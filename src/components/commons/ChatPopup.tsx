"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { chatWithBot } from "@/services/chatbot.service"
import type { ChatMessage } from "@/types/chat.type"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  MessageSquareText,
  Ticket,
} from "lucide-react"

type ChatMode = "qa" | "booking"

export function ChatPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [mode, setMode] = useState<ChatMode>("qa")
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId] = useState(() => crypto.randomUUID())
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading) return

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await chatWithBot({
        sessionId,
        message: trimmed,
      })

      const botMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: response.data || response.message || "Xin lỗi, tôi không hiểu câu hỏi của bạn.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch {
      const errorMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 ${
          isOpen
            ? "bg-gray-700 hover:bg-gray-600 rotate-0"
            : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 shadow-orange-500/40"
        }`}
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageCircle className="w-6 h-6 text-white" />
        )}
      </button>

      {/* Chat Panel */}
      <div
        className={`fixed bottom-24 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] transition-all duration-300 origin-bottom-right ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 translate-y-4 pointer-events-none"
        }`}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col h-[520px]">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">Meta Cinema AI</h3>
              <p className="text-orange-100 text-xs">Luôn sẵn sàng hỗ trợ bạn</p>
            </div>
            <Badge variant="outline" className="text-white border-white/30 text-[10px]">
              Online
            </Badge>
          </div>

          {/* Mode Tabs */}
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setMode("qa")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                mode === "qa"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <MessageSquareText className="w-4 h-4" />
              Hỏi đáp
            </button>
            <button
              onClick={() => setMode("booking")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium transition-colors ${
                mode === "booking"
                  ? "text-orange-600 border-b-2 border-orange-500 bg-orange-50 dark:bg-orange-950/30 dark:text-orange-400"
                  : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              }`}
            >
              <Ticket className="w-4 h-4" />
              Đặt vé
            </button>
          </div>

          {/* Messages / Content */}
          {mode === "qa" ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.length === 0 && (
                  <div className="text-center py-8 space-y-3">
                    <div className="w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto">
                      <Bot className="w-8 h-8 text-orange-500" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Xin chào! Tôi là trợ lý AI của Meta Cinema.
                      <br />
                      Hãy hỏi tôi bất cứ điều gì!
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {["Phim nào hay?", "Giá vé bao nhiêu?", "Combo nào rẻ nhất?"].map((q) => (
                        <button
                          key={q}
                          onClick={() => {
                            setInput(q)
                            inputRef.current?.focus()
                          }}
                          className="text-xs px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-orange-100 hover:text-orange-600 dark:hover:bg-orange-950 dark:hover:text-orange-400 transition-colors"
                        >
                          {q}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex items-end gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-orange-500" />
                      </div>
                    )}
                    <div
                      className={`max-w-[75%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-br-sm"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-sm"
                      }`}
                    >
                      {msg.content}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                  </div>
                ))}

                {isLoading && (
                  <div className="flex items-end gap-2">
                    <div className="w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-orange-500" />
                    </div>
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl rounded-bl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:0ms]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:150ms]" />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:300ms]" />
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-3 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Nhập tin nhắn..."
                    disabled={isLoading}
                    className="flex-1 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 rounded-full text-sm"
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    size="icon"
                    className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg shadow-orange-500/30 h-9 w-9 flex-shrink-0"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Booking Mode Placeholder */
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <Ticket className="w-10 h-10 text-orange-500" />
              </div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                Đặt vé qua AI
              </h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                Tính năng đang được phát triển. Bạn có thể sử dụng chế độ Hỏi đáp để tìm hiểu thông tin phim và suất chiếu.
              </p>
              <Button
                variant="outline"
                onClick={() => setMode("qa")}
                className="border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-700 dark:text-orange-400 dark:hover:bg-orange-950"
              >
                <MessageSquareText className="w-4 h-4 mr-2" />
                Chuyển sang Hỏi đáp
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
