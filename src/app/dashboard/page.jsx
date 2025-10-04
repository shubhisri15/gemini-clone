'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { v4 as uuidv4 } from 'uuid'

const randomResponses = [
  "That's interesting! Tell me more.",
  "I see what you mean.",
  "Can you explain that differently?",
  "Good point! I hadn’t thought of that.",
  "Haha, that made me smile!",
  "Hmm, let me think about that."
]

const UserDashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const _hasHydrated = useAuthStore((state) => state._hasHydrated)
  const { createChat, addMessage, deleteChat, getChatsForUser } = useChatStore()

  const [input, setInput] = useState('')
  const [activeChatId, setActiveChatId] = useState(null)
  const [isTyping, setIsTyping] = useState(false) // Added Typing Indicator State
  const messagesEndRef = useRef(null)
  
  const userId = currentUser?.phoneNumber;
  const userChatrooms = getChatsForUser(userId) || []

  // 1. Set the first chat as active when the component loads
  useEffect(() => {
    if (!activeChatId && userChatrooms.length > 0) {
      setActiveChatId(userChatrooms[0].id)
    }
  }, [userChatrooms, activeChatId])

  // Auto-scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [userChatrooms]) 

  if (!_hasHydrated) {
      return (
          <div className="flex w-full items-center justify-center min-h-[94vh] text-xl text-gray-400 bg-gray-900">
              Loading Session...
          </div>
      )
  }

  if (!currentUser) {
      // Typically, you would use next/navigation's useRouter to redirect to /login
      return (
          <div className="flex w-full items-center justify-center min-h-[94vh] text-xl text-red-400 bg-gray-900">
              Access Denied. Please log in.
          </div>
      )
  }

  const handleCreateNewChat = () => {
    if (!userId) return;

    const newChat = {
      id: uuidv4(),
      title: `New Chat ${userChatrooms.length + 1}`,
      messages: [],
    };
    
    createChat(userId, newChat); 
    setActiveChatId(newChat.id); 
  };

  const handleSend = (e) => {
    e.preventDefault()
    if (!input.trim() || !userId) return

    let currentChatId = activeChatId

    // If no chat is active, create one first.
    if (!currentChatId) {
      currentChatId = uuidv4()
      const newChat = {
        id: currentChatId,
        title: input.trim().substring(0, 30) + '...', // Use first input as title
        messages: [],
      };
      createChat(userId, newChat)
      setActiveChatId(currentChatId)
    }

    const userMessage = { 
        sender: 'user', 
        text: input.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
    addMessage(userId, currentChatId, userMessage)
    setInput('')

    // Simulate bot response (with typing indicator)
    setIsTyping(true) 
    setTimeout(() => {
      setIsTyping(false) 
      const botMessage = {
        sender: 'bot',
        text: randomResponses[Math.floor(Math.random() * randomResponses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      addMessage(userId, currentChatId, botMessage)
    }, 2000) 
  }

  const activeChat = userChatrooms.find(chat => chat.id === activeChatId)
  const messages = activeChat ? activeChat.messages : []

  return (
    <div className="flex h-screen w-full text-gray-800">
      {/* Sidebar for Chatrooms */}
      <div className="w-1/4 bg-gray-800 text-white p-4 flex flex-col shadow-xl">
        <h2 className="text-xl font-bold mb-4">Your Chats</h2>
        <button onClick={handleCreateNewChat} className="mb-4 w-full bg-purple-500 hover:bg-purple-600 rounded-lg py-2 transition">
          + Start New Chat
        </button>
        <div className="flex-1 overflow-y-auto">
          {userChatrooms.map((chat) => (
            <div
              key={chat.id}
              className={`p-2 my-1 rounded-lg cursor-pointer flex justify-between items-center ${
                activeChatId === chat.id ? 'bg-purple-600 font-semibold' : 'hover:bg-gray-700'
              }`}
              onClick={() => setActiveChatId(chat.id)}
            >
              <span className="truncate">{chat.title}</span>
              <button 
                onClick={(e) => {
                    e.stopPropagation(); 
                    deleteChat(userId, chat.id)
                }} 
                className="text-red-400 hover:text-red-600 text-sm"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
<div className="flex-1 flex flex-col p-8 overflow-hidden">
  <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
    What's on your mind today?
  </h1>

  {/* Scrollable chat messages */}
  <div className="flex-1 overflow-y-auto px-6 py-4 rounded-lg shadow-inner bg-gray-900/30 space-y-4">
    {messages.map((msg, i) => (
        <div
            key={i}
            className={`w-full flex mb-4 ${
            msg.sender === 'user' ? 'justify-end' : 'justify-start'
            } group`} // keep group for hover visibility
        >
            <div
            className={`relative max-w-[75%] px-4 py-2 rounded-2xl shadow-sm break-words ${
                msg.sender === 'user'
                ? 'bg-purple-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}
            >
            <p className="text-sm leading-relaxed">{msg.text}</p>

            {/* Timestamp */}
            <div
                className={`text-[10px] mt-1 ${
                msg.sender === 'user'
                    ? 'text-purple-200 text-right'
                    : 'text-gray-500 text-left'
                }`}
            >
                {msg.timestamp}
            </div>

            {/* Copy button - only shows on hover */}
            <button
                onClick={() => navigator.clipboard.writeText(msg.text)}
                className={`absolute -bottom-5 right-0 text-[10px] text-gray-600 bg-white/80 rounded px-2 py-0.5 shadow opacity-0 group-hover:opacity-100 transition duration-200`}
            >
                Copy
            </button>
            </div>
        </div>
        ))
    }


    {/* Typing Indicator */}
    {isTyping && (
      <div className="self-start text-gray-500 bg-gray-200 px-4 py-2 rounded-lg max-w-[80%] flex items-center gap-2">
        <span className="dot-flashing"></span> Gemini is typing...
      </div>
    )}

    <div ref={messagesEndRef} />
  </div>

    {/* Input Area */}
    <form onSubmit={handleSend} className="flex gap-2 items-center mt-4 shrink-0 pb-4">
        <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={
            activeChat
            ? 'Message ' + activeChat.title
            : 'Start a new conversation...'
        }
        className="flex-1 border border-gray-400 rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-white bg-gray-800"
        disabled={isTyping}
        />
        <button
        type="submit"
        onClick={handleSend}
        className="px-6 py-3 bg-purple-500 text-white rounded-xl font-semibold hover:bg-purple-600 transition disabled:opacity-50"
        disabled={!input.trim() || isTyping}
        >
        Send
        </button>
    </form>
    </div>

    </div>
  )
}

export default UserDashboard