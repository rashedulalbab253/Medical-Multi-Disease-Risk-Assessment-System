"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Navbar } from "@/components/navbar"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content:
        "Hello! I'm your AI Health Assistant powered by Google Gemini. How can I help you with your health questions today?",
      role: "assistant",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      // This would be replaced with actual API call to Gemini
      // For now, we'll simulate a response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getSimulatedResponse(input),
          role: "assistant",
        }
        setMessages((prev) => [...prev, aiResponse])
        setIsLoading(false)
      }, 1000)

      // Actual implementation would look like:
      /*
      const response = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input }),
      })
      
      if (!response.ok) {
        throw new Error('Failed to get response')
      }
      
      const data = await response.json()
      const aiResponse: Message = {
        id: Date.now().toString(),
        content: data.message,
        role: 'assistant'
      }
      
      setMessages(prev => [...prev, aiResponse])
      */
    } catch (error) {
      console.error("Error getting AI response:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "I'm sorry, I encountered an error. Please try again later.",
        role: "assistant",
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Simple simulated responses for demo purposes
  const getSimulatedResponse = (message: string): string => {
    const lowerMessage = message.toLowerCase()

    if (lowerMessage.includes("headache") || lowerMessage.includes("head pain")) {
      return "Headaches can be caused by various factors including stress, dehydration, lack of sleep, or eye strain. For occasional headaches, rest, hydration, and over-the-counter pain relievers may help. If you're experiencing severe or persistent headaches, it's best to consult with a healthcare professional."
    } else if (lowerMessage.includes("diet") || lowerMessage.includes("nutrition") || lowerMessage.includes("eat")) {
      return "A balanced diet is essential for good health. Try to include a variety of fruits, vegetables, whole grains, lean proteins, and healthy fats in your meals. Limit processed foods, added sugars, and excessive salt. Remember to stay hydrated by drinking plenty of water throughout the day."
    } else if (lowerMessage.includes("exercise") || lowerMessage.includes("workout")) {
      return "Regular physical activity is important for maintaining good health. Aim for at least 150 minutes of moderate-intensity exercise per week, such as brisk walking, swimming, or cycling. Strength training exercises are also beneficial and should be done at least twice a week. Always start gradually and consult with a healthcare provider if you have any underlying health conditions."
    } else if (lowerMessage.includes("sleep") || lowerMessage.includes("insomnia")) {
      return "Quality sleep is crucial for overall health. Adults typically need 7-9 hours of sleep per night. To improve sleep quality, maintain a regular sleep schedule, create a relaxing bedtime routine, limit screen time before bed, ensure your bedroom is dark and quiet, and avoid caffeine and large meals close to bedtime."
    } else if (lowerMessage.includes("stress") || lowerMessage.includes("anxiety")) {
      return "Managing stress is important for both mental and physical health. Some effective stress management techniques include deep breathing exercises, meditation, physical activity, spending time in nature, connecting with loved ones, and engaging in hobbies you enjoy. If stress is significantly affecting your daily life, consider speaking with a mental health professional."
    } else {
      return "Thank you for your question. As an AI health assistant, I can provide general health information, but I'm not a substitute for professional medical advice. If you have specific health concerns, please consult with a qualified healthcare provider for personalized guidance."
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar showBackButton />
      <div className="container mx-auto max-w-4xl py-6 flex-1">
        <Card className="flex h-[calc(100vh-12rem)] flex-col overflow-hidden border shadow-sm">
          <div className="border-b p-4">
            <h1 className="text-xl font-semibold">AI Health Assistant</h1>
            <p className="text-sm text-muted-foreground">
              Powered by Google Gemini - Ask me anything about health and wellness
            </p>
          </div>

          <ScrollArea className="flex-1 p-4">
            <div className="flex flex-col gap-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex w-max max-w-[80%] flex-col rounded-lg px-4 py-2 text-sm",
                    message.role === "user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted",
                  )}
                >
                  <div className="flex items-center gap-2 text-xs font-medium">
                    {message.role === "user" ? (
                      <>
                        <User className="h-3 w-3" /> You
                      </>
                    ) : (
                      <>
                        <Bot className="h-3 w-3" /> Health Assistant
                      </>
                    )}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
                </div>
              ))}
              {isLoading && (
                <div className="flex w-max max-w-[80%] flex-col rounded-lg bg-muted px-4 py-3 text-sm">
                  <div className="flex items-center gap-2 text-xs font-medium">
                    <Bot className="h-3 w-3" /> Health Assistant
                  </div>
                  <div className="mt-2 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="border-t p-4">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask a health question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="min-h-10 flex-1 resize-none"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage(e)
                  }
                }}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send message</span>
              </Button>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">Press Enter to send. Use Shift+Enter for a new line.</p>
          </form>
        </Card>
      </div>
    </div>
  )
}
