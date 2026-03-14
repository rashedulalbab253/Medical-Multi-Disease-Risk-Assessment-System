export type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export type ChatResponse = {
  message: string
}

export type ChatError = {
  error: string
}
