'use server'

import { buildRAGPromptPayload } from '@/lib/ai/context'
import { GeminiProvider } from '@/lib/ai/gemini'
import prisma from '@/db/prisma'
import { createClient } from '@/services/supabase/server'
import { syncUserProfile } from '@/lib/auth/admin-check'

export interface ChatAssistantResult {
  sessionId: string;
  content: string;
  confidenceScore: number;
  language: 'en' | 'ur';
  citations: { title: string; url: string }[];
  followUpQuestions: string[];
  relatedServices: { title: string; slug: string }[];
  suggestedNextSteps: string[];
}

function parseGeminiResponse(rawResult: string): Partial<ChatAssistantResult> {
  let cleaned = rawResult.trim()
  
  // Strip markdown fences
  if (cleaned.includes('```')) {
    cleaned = cleaned.replace(/```(?:json)?/gi, '').trim()
  }

  // Extract content between first '{' and last '}'
  const firstBrace = cleaned.indexOf('{')
  const lastBrace = cleaned.lastIndexOf('}')
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1)
  }

  try {
    const obj = JSON.parse(cleaned)
    if (obj && typeof obj === 'object') {
      if (typeof obj.content === 'string' && obj.content.trim().startsWith('{') && obj.content.includes('"content"')) {
        try {
          const inner = JSON.parse(obj.content)
          if (inner && inner.content) {
            obj.content = inner.content
          }
        } catch {
          // Keep original content if inner parsing fails
        }
      }
      return obj
    }
  } catch (err) {
    console.warn("Direct JSON.parse failed, attempting fallback extraction:", err)
  }

  // Fallback regex extraction if JSON parsing fails
  let extractedContent = rawResult
  const contentMatch = rawResult.match(/"content"\s*:\s*"((?:[^"\\]|[\s\S])*?)"/)
  if (contentMatch && contentMatch[1]) {
    try {
      extractedContent = JSON.parse(`"${contentMatch[1]}"`)
    } catch {
      extractedContent = contentMatch[1].replace(/\\n/g, '\n').replace(/\\"/g, '"')
    }
  } else if (rawResult.includes('"content":')) {
    const idx = rawResult.indexOf('"content":')
    if (idx !== -1) {
      let sub = rawResult.substring(idx + 10).trim()
      if (sub.startsWith('"')) sub = sub.substring(1)
      const endIdx = sub.indexOf('",\n') !== -1 ? sub.indexOf('",\n') : sub.indexOf('",')
      if (endIdx !== -1) {
        extractedContent = sub.substring(0, endIdx).replace(/\\n/g, '\n').replace(/\\"/g, '"')
      }
    }
  }

  return {
    content: extractedContent,
    confidenceScore: rawResult.includes("I currently do not have access") ? 0 : 90,
    language: 'en',
    citations: [],
    followUpQuestions: [
      "How to register for NTN?",
      "How do I renew my CNIC?",
      "What is the fee for a 10-year passport?"
    ],
    relatedServices: [],
    suggestedNextSteps: []
  }
}

export async function askAssistant(
  prompt: string, 
  history: { role: 'user' | 'model'; content: string }[],
  sessionId?: string | null
): Promise<ChatAssistantResult> {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Ensure UserProfile exists with correct role sync
    const profile = await syncUserProfile(user)

    // Establish active session
    let activeSessionId = sessionId
    if (!activeSessionId) {
      const title = prompt.length > 30 ? prompt.substring(0, 30) + '...' : prompt
      const newSession = await prisma.chatSession.create({
        data: {
          userId: profile.id,
          title
        }
      })
      activeSessionId = newSession.id
    } else {
      // Touch session updated time
      await prisma.chatSession.update({
        where: { id: activeSessionId },
        data: { updatedAt: new Date() }
      })
    }

    // Save user message to database
    await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        sender: 'USER',
        content: prompt
      }
    })

    // Invoke RAG & Gemini
    const { messages, systemPrompt } = await buildRAGPromptPayload(prompt, history)
    const provider = new GeminiProvider()
    const rawResult = await provider.generate(messages, systemPrompt)

    // Parse JSON safely
    const parsed = parseGeminiResponse(rawResult)

    const result: ChatAssistantResult = {
      sessionId: activeSessionId,
      content: parsed.content || rawResult || 'No response details received.',
      confidenceScore: typeof parsed.confidenceScore === 'number' ? parsed.confidenceScore : 95,
      language: parsed.language === 'ur' ? 'ur' : 'en',
      citations: Array.isArray(parsed.citations) ? parsed.citations : [],
      followUpQuestions: Array.isArray(parsed.followUpQuestions) ? parsed.followUpQuestions.slice(0, 3) : [],
      relatedServices: Array.isArray(parsed.relatedServices) ? parsed.relatedServices.slice(0, 3) : [],
      suggestedNextSteps: Array.isArray(parsed.suggestedNextSteps) ? parsed.suggestedNextSteps : []
    }

    // Save model response to database
    await prisma.chatMessage.create({
      data: {
        sessionId: activeSessionId,
        sender: 'SYSTEM',
        content: result.content,
        metadata: {
          confidenceScore: result.confidenceScore,
          language: result.language,
          citations: result.citations,
          followUpQuestions: result.followUpQuestions,
          relatedServices: result.relatedServices,
          suggestedNextSteps: result.suggestedNextSteps
        }
      }
    })

    return result
  } catch (error) {
    console.error("AI Assistant Server Action Error:", error)
    return {
      sessionId: sessionId || '',
      content: "### System Exception\n\nThere was an error communicating with the AI assistant engine. Please try again.",
      confidenceScore: 0,
      language: 'en',
      citations: [],
      followUpQuestions: [],
      relatedServices: [],
      suggestedNextSteps: []
    }
  }
}

export async function getUserSessions() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return []

    // Fetch the UserProfile by supabaseId
    const profile = await prisma.userProfile.findUnique({
      where: { supabaseId: user.id }
    })
    if (!profile) return []

    return await prisma.chatSession.findMany({
      where: { userId: profile.id },
      orderBy: { updatedAt: 'desc' }
    })
  } catch (err) {
    console.error("Error fetching sessions:", err)
    return []
  }
}

export async function getSessionMessages(sessionId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Fetch the UserProfile by supabaseId
    const profile = await prisma.userProfile.findUnique({
      where: { supabaseId: user.id }
    })
    if (!profile) throw new Error("Profile not found")

    // Check ownership
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { userId: true }
    })

    if (!session || session.userId !== profile.id) {
      throw new Error("Session not found or access denied")
    }

    return await prisma.chatMessage.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' }
    })
  } catch (err) {
    console.error("Error fetching session messages:", err)
    return []
  }
}

export async function deleteSession(sessionId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error("Unauthorized")

    // Fetch the UserProfile by supabaseId
    const profile = await prisma.userProfile.findUnique({
      where: { supabaseId: user.id }
    })
    if (!profile) throw new Error("Profile not found")

    // Check ownership
    const session = await prisma.chatSession.findUnique({
      where: { id: sessionId },
      select: { userId: true }
    })

    if (session && session.userId === profile.id) {
      await prisma.chatSession.delete({
        where: { id: sessionId }
      })
      return { success: true }
    }
    return { success: false, error: "Access denied" }
  } catch (err) {
    console.error("Error deleting session:", err)
    return { success: false, error: String(err) }
  }
}
