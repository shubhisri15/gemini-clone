'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'

const randomResponses = [
  "That's interesting! Tell me more.",
  "I see what you mean.",
  "Can you explain that differently?",
  "Good point! I hadn’t thought of that.",
  "Haha, that made me smile!",
  "Hmm, let me think about that."
]

const UserDashboard = () => {
  const createChat = useChatStore((state) => state.createChat)
  const addMessage = useChatStore((state) => state.addMessage)
  const chats = useChatStore((state) => state.chats)

  const [input, setInput] = useState('')
  const [activeChatId, setActiveChatId] = useState(null)
  const messagesEndRef = useRef(null)

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim()) return

    let currentChatId = activeChatId

    if (!currentChatId) {
      currentChatId = `chat-${Date.now()}`
      createChat(currentChatId)
      setActiveChatId(currentChatId)
    }

    addMessage(currentChatId, { sender: 'user', text: input.trim() })
    setInput('')

    setTimeout(() => {
      addMessage(currentChatId, {
        sender: 'bot',
        text: randomResponses[Math.floor(Math.random() * randomResponses.length)],
      })
    }, 1000)
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chats, activeChatId])

  const messages = activeChatId ? chats[activeChatId] || [] : []

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center gap-8 p-6 overflow-hidden">
      {/* Header stays fixed visually near the top */}
      <h1 className="font-bold text-3xl mt-12">What's on your mind today?</h1>

      {/* Chat box */}
      {activeChatId && (
        <div className="w-1/2 h-96 rounded-xl p-4 overflow-y-auto flex flex-col gap-2">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`px-4 py-2 rounded-lg max-w-[80%] ${
                msg.sender === 'user'
                  ? 'self-end bg-purple-500 text-white'
                  : 'self-start bg-gray-200 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input box anchored toward bottom */}
      <form
        onSubmit={handleSend}
        className="w-1/2 flex gap-2 items-center mb-4"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 border border-gray-400 rounded-xl py-3 px-4"
        />
        <button
          type="submit"
          className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition"
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default UserDashboard
