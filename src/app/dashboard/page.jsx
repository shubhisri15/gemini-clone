'use client'
import React, { useState, useRef, useEffect } from 'react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { v4 as uuidv4 } from 'uuid'

// ... (randomResponses array)

const UserDashboard = () => {
  const currentUser = useAuthStore((state) => state.currentUser)
  const { createChat, addMessage, deleteChat, getChatsForUser } = useChatStore()

  console.log(currentUser)

  const userId = currentUser?.phoneNumber;
  const userChatrooms = getChatsForUser(userId)

  const [input, setInput] = useState('')
  const [activeChatId, setActiveChatId] = useState(null)
  const [isTyping, setIsTyping] = useState(false) // Added Typing Indicator State
  const messagesEndRef = useRef(null)

  // 1. Set the first chat as active when the component loads
  useEffect(() => {
    if (!activeChatId && userChatrooms.length > 0) {
      setActiveChatId(userChatrooms[0].id)
    }
  }, [userChatrooms, activeChatId])


  // FIX: This now correctly calls the store with userId and newChat object
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

    // 2. LOGIC: If no chat is active, create one first.
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
    setIsTyping(true) // Show typing indicator
    setTimeout(() => {
      setIsTyping(false) // Hide typing indicator
      const botMessage = {
        sender: 'bot',
        text: randomResponses[Math.floor(Math.random() * randomResponses.length)],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      addMessage(userId, currentChatId, botMessage)
    }, 2000) // Delay: 2 seconds for a more realistic wait
  }

  // Auto-scroll logic remains the same
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [userChatrooms]) 

  const activeChat = userChatrooms.find(chat => chat.id === activeChatId)
  const messages = activeChat ? activeChat.messages : []


  return (
    <div className="flex min-h-[94vh] w-full text-gray-800 overflow-y-hidden">
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
      <div className="flex-1 flex flex-col p-8">
        <h1 className="text-3xl font-extrabold mb-6 text-center text-white">
            {activeChat ? activeChat.title : "What's on your mind today?"}
        </h1>
        <div className='flex-1 overflow-y-auto px-6 h-0'>
        
        <div className="p-4 bg-white rounded-lg shadow-inner flex flex-col">
          {messages.map((msg, i) => (
            <div key={i} className={`flex flex-col max-w-[80%] mb-4 group ${ msg.sender === 'user' ? 'self-end' : 'self-start' }`}>
              {/* Message Content */}
              <div className={`px-4 py-2 rounded-lg ${ msg.sender === 'user' ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-800' }`}>
                {msg.text}
              </div>
              
              {/* Timestamp and Copy Button */}
              <div className="flex items-center gap-2 mt-1 px-1">
                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                <div className="opacity-0 group-hover:opacity-100 transition">
                  <button onClick={() => navigator.clipboard.writeText(msg.text)} className="text-xs text-gray-600 bg-white rounded px-2 py-1 shadow">Copy</button>
                </div>
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="self-start text-gray-500 bg-gray-200 px-4 py-2 rounded-lg max-w-[80%] flex items-center gap-2">
              <span className="dot-flashing"></span> {/* CSS animation required for actual dots */}
              Gemini is typing...
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        </div>

        {/* Input box now handles both initial input and subsequent messages */}
        <form onSubmit={handleSend} className="mt-4 flex gap-2 items-center">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder={activeChat ? "Message " + activeChat.title : "Start a new conversation..."}
            className="flex-1 border border-gray-400 rounded-xl py-3 px-4 m-4 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-400 text-white"
            disabled={isTyping} // Disable input while bot is typing
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