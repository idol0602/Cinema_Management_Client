"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Bot, Send, Sparkles, User } from "lucide-react"

interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function ChatPanel() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Xin chào! 👋 Tôi là trợ lý AI của Meta Cinema. Tôi có thể giúp bạn đặt vé xem phim, chọn suất chiếu, ghế ngồi và combo đồ ăn. Hãy cho tôi biết bạn muốn xem phim gì nhé!",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const handleSend = () => {
    if (!inputValue.trim()) return
    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue.trim(),
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, newMessage])
    setInputValue("")

    // Placeholder auto-reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "Tính năng chat AI đang được phát triển. Hiện tại bạn có thể sử dụng các nút điều hướng bên trái để duyệt nội dung.",
          timestamp: new Date(),
        },
      ])
    }, 800)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend()
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-4 py-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              <Bot className="h-3.5 w-3.5" />
              AI Trợ Lý Đặt Vé
            </h3>
            <p className="text-[10px] text-orange-100">
              Powered by Meta Cinema AI
            </p>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  msg.role === "assistant"
                    ? "bg-gradient-to-r from-orange-500 to-orange-600"
                    : "bg-gradient-to-r from-blue-500 to-blue-600"
                }`}
              >
                {msg.role === "assistant" ? (
                  <Bot className="h-3.5 w-3.5 text-white" />
                ) : (
                  <User className="h-3.5 w-3.5 text-white" />
                )}
              </div>
              <div
                className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                  msg.role === "assistant"
                    ? "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    : "bg-gradient-to-r from-orange-500 to-orange-600 text-white"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3 shrink-0">
        <div className="flex items-center gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Nhập tin nhắn..."
            className="flex-1 border-gray-300 dark:border-gray-600 focus:border-orange-500 focus:ring-orange-500 text-sm"
          />
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="h-9 w-9 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shrink-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
