export interface ChatMessage {
  role: 'user' | 'model'
  content: string
}

export interface AIProvider {
  generate(messages: ChatMessage[], systemPrompt?: string): Promise<string>
}
