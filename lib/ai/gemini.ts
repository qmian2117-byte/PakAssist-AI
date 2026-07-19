import { AIProvider, ChatMessage } from './provider'

export class GeminiProvider implements AIProvider {
  private apiKey: string

  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || ''
  }

  async generate(messages: ChatMessage[], systemPrompt?: string): Promise<string> {
    if (!this.apiKey || this.apiKey === 'placeholder-gemini-key') {
      return "### System Warning\n\nGoogle Gemini API Key is not configured. Please supply a valid `GEMINI_API_KEY`."
    }

    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = []
    
    messages.forEach(msg => {
      contents.push({
        role: msg.role === 'model' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      })
    })

    const bodyPayload: Record<string, unknown> = {
      contents,
      generationConfig: {
        temperature: 0.15,
        maxOutputTokens: 4096,
        responseMimeType: "application/json"
      }
    }

    if (systemPrompt) {
      bodyPayload.systemInstruction = {
        parts: [{ text: systemPrompt }]
      }
    }

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(bodyPayload)
        }
      )

      if (!response.ok) {
        const errorText = await response.text()
        console.error("Gemini API call failed:", errorText)
        return "### AI Provider Error\n\nFailed to fetch completions from Gemini API."
      }

      const data = await response.json()
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      return text || "### Verification Failure\n\nNo response returned."
    } catch (error) {
      console.error("Gemini HTTP Error:", error)
      return "### System Exception\n\nFailed to establish connection to the AI provider."
    }
  }
}
