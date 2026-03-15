import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    // Primary: Use Groq API
    let aiMessage = "I'm sorry, I couldn't generate a response at this time."

    if (process.env.GROQ_API_KEY) {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "You are a helpful, knowledgeable health assistant. Provide accurate, evidence-based health information. Remember to clarify that you're providing general information and not medical advice. Keep responses concise (under 150 words)." 
            },
            { role: "user", content: message }
          ],
          max_tokens: 1024,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Groq API error:", errorData)
        throw new Error("Failed to get response from Groq API")
      }

      const data = await response.json()
      if (data.choices?.[0]?.message?.content) {
        aiMessage = data.choices[0].message.content
      }
    } else if (process.env.GEMINI_API_KEY) {
      // Fallback: Gemini API
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + process.env.GEMINI_API_KEY, {
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
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error("Gemini API error:", errorData)
        throw new Error("Failed to get response from Gemini API")
      }

      const data = await response.json()
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiMessage = data.candidates[0].content.parts[0].text
      }
    } else {
      return NextResponse.json({ error: "No AI API key configured" }, { status: 500 })
    }

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error("Error in AI assistant API:", error)
    return NextResponse.json({ error: "Failed to get response from AI" }, { status: 500 })
  }
}
