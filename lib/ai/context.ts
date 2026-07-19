import { buildRAGContext } from './rag'
import { systemInstructions } from './prompts'
import { ChatMessage } from './provider'

export async function buildRAGPromptPayload(
  userPrompt: string, 
  history: ChatMessage[]
): Promise<{ messages: ChatMessage[]; systemPrompt: string }> {
  const { contextText } = await buildRAGContext(userPrompt)
  
  const fullSystemPrompt = `${systemInstructions}\n\nDATABASE CONTEXT:\n${contextText}`
  
  const payloadMessages: ChatMessage[] = []
  
  // Initialize payload messages
  if (history.length > 0) {
    history.forEach(h => payloadMessages.push(h))
    payloadMessages.push({ role: 'user', content: userPrompt })
  } else {
    payloadMessages.push({ role: 'user', content: userPrompt })
  }

  return { messages: payloadMessages, systemPrompt: fullSystemPrompt }
}
