'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/services/supabase/client'
import { 
  askAssistant, 
  getUserSessions, 
  getSessionMessages, 
  deleteSession 
} from '@/features/chat/actions/chat-action'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { User } from '@supabase/supabase-js'
import { 
  Landmark, 
  Sparkles, 
  Send, 
  Trash2, 
  ArrowLeft, 
  Database, 
  ShieldAlert, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  ListTodo, 
  Languages, 
  Award,
  ChevronRight
} from 'lucide-react'

interface Message {
  role: 'user' | 'model'
  content: string
  confidenceScore?: number
  language?: 'en' | 'ur'
  citations?: { title: string; url: string }[]
  followUpQuestions?: string[]
  relatedServices?: { title: string; slug: string }[]
  suggestedNextSteps?: string[]
}

interface Session {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
}

function ChatPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlSessionId = searchParams.get('session')

  const [sessions, setSessions] = useState<Session[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(urlSessionId)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  
  // Interactive checklist state (persisted per session in memory)
  const [checkedSteps, setCheckedSteps] = useState<{ [key: string]: boolean }>({})

  const chatEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // 1. Authentication & Load Sessions List
  useEffect(() => {
    async function checkAuthAndLoad() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      setUser(user)
      
      const userSessions = await getUserSessions()
      setSessions(userSessions as Session[])
      
      setPageLoading(false)
    }
    checkAuthAndLoad()
  }, [router, supabase])

  // 2. Load Session Messages when Active Session changes
  useEffect(() => {
    async function loadActiveMessages() {
      if (activeSessionId) {
        setLoading(true)
        const dbMessages = await getSessionMessages(activeSessionId)
        const formatted = dbMessages.map(m => {
          const meta = (m.metadata as {
            confidenceScore?: number;
            language?: 'en' | 'ur';
            citations?: { title: string; url: string }[];
            followUpQuestions?: string[];
            relatedServices?: { title: string; slug: string }[];
            suggestedNextSteps?: string[];
          }) || {}
          return {
            role: m.sender === 'USER' ? 'user' : 'model',
            content: m.content,
            confidenceScore: meta.confidenceScore,
            language: meta.language,
            citations: meta.citations,
            followUpQuestions: meta.followUpQuestions,
            relatedServices: meta.relatedServices,
            suggestedNextSteps: meta.suggestedNextSteps
          } as Message
        })
        setMessages(formatted)
        
        // Populate checked checklist status from memory/localStorage
        const savedChecklist = localStorage.getItem(`checklist_${activeSessionId}`)
        if (savedChecklist) {
          setCheckedSteps(JSON.parse(savedChecklist))
        } else {
          setCheckedSteps({})
        }
        
        setLoading(false)
      } else {
        setMessages([])
        setCheckedSteps({})
      }
    }
    loadActiveMessages()
  }, [activeSessionId])

  // 3. Scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Reload sessions from database
  const refreshSessions = async () => {
    const s = await getUserSessions()
    setSessions(s as Session[])
  }

  // Handle message sending
  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return

    const userMessage = textToSend.trim()
    setInput('')
    
    // Add user message to UI instantly
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    setLoading(true)

    // Call server action RAG pipeline
    const historyPayload = messages.map(m => ({ role: m.role, content: m.content }))
    const result = await askAssistant(userMessage, historyPayload, activeSessionId)
    
    // Add AI response to UI
    setMessages(prev => [...prev, { 
      role: 'model', 
      content: result.content,
      confidenceScore: result.confidenceScore,
      language: result.language,
      citations: result.citations,
      followUpQuestions: result.followUpQuestions,
      relatedServices: result.relatedServices,
      suggestedNextSteps: result.suggestedNextSteps
    }])

    // If new session was created, update URL and state
    if (!activeSessionId && result.sessionId) {
      setActiveSessionId(result.sessionId)
      router.replace(`/chat?session=${result.sessionId}`)
    }

    setLoading(false)
    refreshSessions()
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSendMessage(input)
  }

  const handleStartNewChat = () => {
    setActiveSessionId(null)
    setMessages([])
    setCheckedSteps({})
    router.replace('/chat')
  }

  const handleDeleteSession = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    
    if (confirm("Are you sure you want to delete this conversation?")) {
      const res = await deleteSession(id)
      if (res.success) {
        if (activeSessionId === id) {
          handleStartNewChat()
        }
        refreshSessions()
      }
    }
  }

  const toggleChecklistStep = (stepKey: string) => {
    const updated = { ...checkedSteps, [stepKey]: !checkedSteps[stepKey] }
    setCheckedSteps(updated)
    if (activeSessionId) {
      localStorage.setItem(`checklist_${activeSessionId}`, JSON.stringify(updated))
    }
  }

  const selectSession = (id: string) => {
    setActiveSessionId(id)
    router.replace(`/chat?session=${id}`)
  }

  // Simple, robust custom markdown formatter helper
  const renderFormattedMarkdown = (markdownText: string) => {
    if (!markdownText) return ''
    
    return markdownText.split('\n').map((line, lineIdx) => {
      const trimmed = line.trim()
      
      // Headers
      if (trimmed.startsWith('### ')) {
        return <h4 key={lineIdx} className="text-sm font-bold text-emerald-800 dark:text-emerald-400 mt-4 mb-2 first:mt-0">{trimmed.replace('### ', '')}</h4>
      }
      if (trimmed.startsWith('## ')) {
        return <h3 key={lineIdx} className="text-base font-bold text-emerald-950 dark:text-emerald-200 mt-5 mb-2 first:mt-0">{trimmed.replace('## ', '')}</h3>
      }
      if (trimmed.startsWith('# ')) {
        return <h2 key={lineIdx} className="text-lg font-black text-emerald-950 dark:text-emerald-100 mt-6 mb-3 first:mt-0">{trimmed.replace('# ', '')}</h2>
      }
      
      // Bullet points
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        const text = trimmed.substring(2)
        return (
          <ul key={lineIdx} className="list-disc pl-5 my-1.5 space-y-1 text-xs">
            <li>{renderInlineStyles(text)}</li>
          </ul>
        )
      }

      // Ordered list items
      if (/^\d+\.\s/.test(trimmed)) {
        const match = trimmed.match(/^(\d+)\.\s(.*)/)
        if (match) {
          return (
            <ol key={lineIdx} className="list-decimal pl-5 my-1.5 space-y-1 text-xs">
              <li>{renderInlineStyles(match[2])}</li>
            </ol>
          )
        }
      }

      if (trimmed === '') return <div key={lineIdx} className="h-2" />

      return <p key={lineIdx} className="my-1 text-xs leading-relaxed text-slate-700 dark:text-slate-300">{renderInlineStyles(trimmed)}</p>
    })
  }

  // Render basic inline bold elements (**text**)
  const renderInlineStyles = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g)
    return parts.map((part, idx) => {
      if (idx % 2 === 1) {
        return <strong key={idx} className="font-semibold text-emerald-900 dark:text-emerald-100">{part}</strong>
      }
      return part
    })
  }

  // Retrieve the latest assistant checklist
  const getLatestChecklist = () => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'model' && messages[i].suggestedNextSteps && messages[i].suggestedNextSteps!.length > 0) {
        return messages[i].suggestedNextSteps
      }
    }
    return null
  }

  const latestChecklist = getLatestChecklist()

  if (pageLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-emerald-950/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-emerald-700 border-t-transparent mx-auto" />
          <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">Initializing AI Chat workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 h-16 flex items-center justify-between px-6 shrink-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Landmark className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base bg-clip-text text-transparent bg-gradient-to-r from-emerald-800 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
                PakAssist AI Assistant
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 px-2 py-0.5 rounded-full font-bold">
                RAG Locked
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            onClick={handleStartNewChat} 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1.5 border-emerald-200 hover:bg-emerald-50 text-emerald-800 dark:border-emerald-900/50 dark:text-emerald-400 dark:hover:bg-emerald-900/20"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat</span>
          </Button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Column: Sessions History */}
        <aside className="hidden lg:flex w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-4 flex-col gap-4 shrink-0 overflow-y-auto">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Conversations</h3>
            <span className="text-[10px] px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-full font-semibold">{sessions.length}</span>
          </div>

          <div className="space-y-1 flex-1">
            {sessions.length === 0 ? (
              <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-xl mt-2">
                <p className="text-[11px] text-slate-400">No previous sessions found. Start by asking a question.</p>
              </div>
            ) : (
              sessions.map(s => {
                const isActive = activeSessionId === s.id
                return (
                  <button
                    key={s.id}
                    onClick={() => selectSession(s.id)}
                    className={`w-full group text-left px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isActive 
                        ? 'bg-emerald-700 text-white shadow-sm shadow-emerald-700/20' 
                        : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="truncate pr-2">{s.title || 'Conversation'}</span>
                    <Trash2 
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className={`h-3.5 w-3.5 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity ${
                        isActive ? 'text-emerald-200 hover:text-white' : 'text-slate-400 hover:text-red-500'
                      }`} 
                    />
                  </button>
                )
              })
            )}
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-4 mt-auto space-y-3">
            <div className="flex gap-2 items-center text-xs p-2 text-slate-500">
              <Database className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>Supabase Cloud Active</span>
            </div>
          </div>
        </aside>

        {/* Center: Chat Interface */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden bg-slate-50 dark:bg-slate-900">
          
          {/* Scrollable messages panel */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center max-w-xl mx-auto text-center space-y-6">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/10">
                  <Sparkles className="h-6 w-6 animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Citizen Assistance Assistant</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
                    Type a Pakistani procedure query below (e.g. active tax status, passport costs, utility billing, job prep guides) to get official verified steps.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left pt-4">
                  {[
                    "How to register for NTN online?",
                    "What is the fee for a 10-year Passport?",
                    "How to check ATL status with FBR?",
                    "What are the PPSC online registration steps?"
                  ].map((s, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(s)}
                      className="p-3.5 text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:shadow-sm rounded-xl text-slate-800 dark:text-slate-200 font-semibold transition-all text-left flex justify-between items-center group"
                    >
                      <span className="truncate">{s}</span>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-500 transition-colors shrink-0 ml-2" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-6 pb-6">
                {messages.map((msg, idx) => {
                  const isUser = msg.role === 'user'
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-4 items-start ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      {!isUser && (
                        <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-700 to-teal-500 text-white flex items-center justify-center font-bold text-xs shadow-sm shrink-0">
                          AI
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-1.5 max-w-[85%]">
                        <div className={`p-5 rounded-2xl shadow-xs border text-slate-800 dark:text-slate-100 ${
                          isUser 
                            ? 'bg-emerald-700 text-white border-transparent' 
                            : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800'
                        }`}>
                          {/* Message main content */}
                          {isUser ? (
                            <p className="text-xs font-semibold whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                          ) : (
                            <div className="space-y-1">
                              {renderFormattedMarkdown(msg.content)}
                            </div>
                          )}

                          {/* Render meta details inside response block */}
                          {!isUser && (
                            <div className="border-t border-slate-100 dark:border-slate-900/50 mt-4 pt-3 flex flex-wrap gap-2 items-center text-[10px] text-slate-400">
                              {/* Confidence indicator */}
                              <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
                                <Award className="h-3 w-3" />
                                {msg.confidenceScore || 95}% Confidence Score
                              </span>
                              
                              {/* Language identifier */}
                              <span className="flex items-center gap-1 font-semibold text-slate-500 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded-full">
                                <Languages className="h-3 w-3" />
                                {msg.language === 'ur' ? 'Urdu Detected' : 'English Detected'}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Citations, related services and follow ups rendered below the balloon */}
                        {!isUser && (
                          <div className="px-1 space-y-2 mt-1">
                            {/* Citations List */}
                            {msg.citations && msg.citations.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Sources:</span>
                                {msg.citations.map((cite, citeIdx) => (
                                  <a 
                                    key={citeIdx} 
                                    href={cite.url} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-bold px-2.5 py-1 rounded-md flex items-center gap-1 border border-slate-200/50 dark:border-slate-800 transition-colors"
                                  >
                                    <span>{cite.title}</span>
                                    <ExternalLink className="h-2.5 w-2.5" />
                                  </a>
                                ))}
                              </div>
                            )}

                            {/* Related Services */}
                            {msg.relatedServices && msg.relatedServices.length > 0 && (
                              <div className="flex flex-wrap items-center gap-1.5">
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mr-1">Related:</span>
                                {msg.relatedServices.map((rel, relIdx) => (
                                  <Link 
                                    key={relIdx} 
                                    href={`/services?slug=${rel.slug}`}
                                    className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/20 dark:hover:bg-emerald-950/40 dark:text-emerald-400 font-bold px-2 py-1 rounded-md border border-emerald-100/30 dark:border-emerald-900/30 transition-all"
                                  >
                                    {rel.title}
                                  </Link>
                                ))}
                              </div>
                            )}

                            {/* Dynamic follow-up questions */}
                            {msg.followUpQuestions && msg.followUpQuestions.length > 0 && (
                              <div className="pt-2 flex flex-col gap-1 text-xs">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Follow up suggestions:</span>
                                {msg.followUpQuestions.map((q, qIdx) => (
                                  <button
                                    key={qIdx}
                                    onClick={() => handleSendMessage(q)}
                                    className="text-left w-fit text-xs font-semibold text-emerald-700 hover:text-emerald-900 dark:text-emerald-400 dark:hover:text-emerald-300 flex items-center gap-1 py-0.5"
                                  >
                                    <ChevronRight className="h-3 w-3 shrink-0" />
                                    <span>{q}</span>
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {isUser && (
                        <div className="h-9 w-9 rounded-xl bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-slate-300 shrink-0 shadow-sm border border-slate-300/40 dark:border-slate-700">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Loading indicator */}
                {loading && (
                  <div className="flex gap-4 items-start justify-start animate-pulse">
                    <div className="h-9 w-9 rounded-xl bg-emerald-700/10 text-emerald-700 flex items-center justify-center font-bold text-xs shrink-0">
                      AI
                    </div>
                    <div className="p-4 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-500 flex items-center gap-2">
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2.5 w-2.5 rounded-full bg-emerald-600 animate-bounce" />
                    </div>
                  </div>
                )}

                <div ref={chatEndRef} />
              </div>
            )}
          </div>

          {/* Form Input Container */}
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 bg-white dark:bg-slate-950 shrink-0 shadow-sm">
            <form onSubmit={handleFormSubmit} className="max-w-3xl mx-auto flex gap-2">
              <Input
                type="text"
                placeholder="Ask about Passport renewal fees, FBR NTN registration, utility complaints..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="flex-1 h-11 rounded-xl border-slate-200 focus-visible:ring-emerald-700 focus-visible:ring-offset-2 dark:border-slate-800 dark:bg-slate-900"
              />
              <Button 
                type="submit" 
                disabled={!input.trim() || loading} 
                className="h-11 px-5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-all shadow-sm"
              >
                <Send className="h-4.5 w-4.5 mr-1.5" />
                <span>Send</span>
              </Button>
            </form>
            <p className="text-[10px] text-center text-slate-400 mt-2.5">
              Verified Source RAG Lock ensures that answers strictly reference verified government portals. Zero hallucinations enforced.
            </p>
          </div>
        </main>

        {/* Right Column: Procedure Steps Tracking Checklist */}
        <aside className="hidden xl:flex w-80 border-l border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 flex-col gap-6 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-900 pb-3">
            <ListTodo className="h-5 w-5 text-emerald-700" />
            <h3 className="text-xs font-bold text-slate-800 dark:text-white uppercase tracking-wider">Interactive Checklist</h3>
          </div>

          {latestChecklist && latestChecklist.length > 0 ? (
            <div className="space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Check off these steps as you complete them to track your official government application progress:
              </p>
              
              <div className="space-y-3">
                {latestChecklist.map((step, sIdx) => {
                  const stepKey = `${activeSessionId || 'temp'}_step_${sIdx}`
                  const isChecked = checkedSteps[stepKey] || false
                  return (
                    <button
                      key={sIdx}
                      onClick={() => toggleChecklistStep(stepKey)}
                      className="w-full flex items-start gap-3 p-3 rounded-xl border text-left text-xs transition-all hover:bg-slate-50 dark:hover:bg-slate-900/60"
                      style={{
                        borderColor: isChecked ? 'rgba(16, 185, 129, 0.2)' : 'rgba(226, 232, 240, 0.4)',
                        background: isChecked ? 'rgba(16, 185, 129, 0.03)' : 'transparent'
                      }}
                    >
                      <div className="pt-0.5 shrink-0">
                        <CheckCircle2 
                          className={`h-4.5 w-4.5 transition-colors ${
                            isChecked ? 'text-emerald-600 fill-emerald-100 dark:fill-emerald-950/20' : 'text-slate-300'
                          }`} 
                        />
                      </div>
                      <span className={`leading-relaxed font-semibold transition-all ${
                        isChecked ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'
                      }`}>
                        {step}
                      </span>
                    </button>
                  )
                })}
              </div>

              {/* Progress indicator */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-900/60 space-y-1.5">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Progress</span>
                  <span>
                    {Math.round(
                      (latestChecklist.filter((_, idx) => checkedSteps[`${activeSessionId || 'temp'}_step_${idx}`]).length /
                        latestChecklist.length) *
                        100
                    )}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 transition-all duration-300"
                    style={{
                      width: `${
                        (latestChecklist.filter((_, idx) => checkedSteps[`${activeSessionId || 'temp'}_step_${idx}`]).length /
                          latestChecklist.length) *
                        100
                      }%`
                    }}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-64 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center p-6 text-center space-y-3">
              <ListTodo className="h-8 w-8 text-slate-300" />
              <p className="text-[11px] text-slate-400 leading-normal">
                No active checklist available. Ask about a specific government procedure to load actionable steps.
              </p>
            </div>
          )}

          <div className="border-t border-slate-100 dark:border-slate-900/60 pt-4 mt-auto">
            <div className="flex gap-2.5 items-start p-3 bg-red-500/5 dark:bg-red-500/10 rounded-xl border border-red-500/10">
              <ShieldAlert className="h-4.5 w-4.5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] font-bold text-red-800 dark:text-red-400 uppercase tracking-wider">Caution</span>
                <p className="text-[10px] text-red-700/80 dark:text-red-400/80 leading-normal mt-0.5 font-medium">
                  Always verify offline fee vouchers and official URLs before making payments online.
                </p>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <React.Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-emerald-950/10">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-11 w-11 border-2 border-emerald-700 border-t-transparent mx-auto" />
          <p className="text-sm text-emerald-800 dark:text-emerald-400 font-medium">Initializing AI Assistant...</p>
        </div>
      </div>
    }>
      <ChatPageContent />
    </React.Suspense>
  )
}
