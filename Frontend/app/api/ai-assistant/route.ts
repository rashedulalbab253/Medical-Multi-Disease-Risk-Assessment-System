import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    let aiMessage = ""
    let lastError = ""

    // 1. Try Gemini if configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await fetch(
          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + process.env.GEMINI_API_KEY,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are a helpful, knowledgeable health assistant. Provide accurate, evidence-based health information in response to this question: "${message}". 
                             Remember to clarify that you're providing general information and not medical advice. Keep responses concise (under 150 words).`,
                    },
                  ],
                },
              ],
            }),
          }
        )

        if (response.ok) {
          const data = await response.json()
          if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
            aiMessage = data.candidates[0].content.parts[0].text
          }
        } else {
          const errorData = await response.text()
          console.warn("Gemini API error in ai-assistant, attempting fallback:", errorData)
          lastError = `Gemini error: ${response.status}`
        }
      } catch (err: any) {
        console.warn("Gemini exception in ai-assistant:", err.message)
        lastError = err.message
      }
    }

    // 2. Try Groq fallback if Gemini didn't return an answer
    if (!aiMessage && process.env.GROQ_API_KEY) {
      const groqModels = ["qwen/qwen3.8-27b", "openai/gpt-oss-120b", "groq/compound-mini"]

      for (const model of groqModels) {
        try {
          const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model,
              messages: [
                {
                  role: "system",
                  content:
                    "You are a helpful, knowledgeable health assistant. Provide accurate, evidence-based health information. Remember to clarify that you're providing general information and not medical advice. Keep responses concise (under 150 words).",
                },
                { role: "user", content: message },
              ],
              max_tokens: 1024,
              temperature: 0.7,
            }),
          })

          if (response.ok) {
            const data = await response.json()
            const content = data.choices?.[0]?.message?.content
            if (content && content.trim().length > 0) {
              aiMessage = content
              break
            }
          } else {
            const errorData = await response.text()
            console.warn(`Groq model ${model} error:`, errorData)
            lastError = `Groq ${model} error: ${response.status}`
          }
        } catch (err: any) {
          console.warn(`Groq ${model} exception:`, err.message)
          lastError = err.message
        }
      }
    }

    if (!aiMessage) {
      return NextResponse.json(
        { error: "Failed to get response from AI", details: lastError },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error("Error in AI assistant API:", error)
    return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
  }
}
