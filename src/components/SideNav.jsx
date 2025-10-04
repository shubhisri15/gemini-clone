'use client'
import React from 'react'
import { useChatStore } from '@/stores/chatStore'

const SideNav = ({ activeChatId, setActiveChatId, onCreateChat, onDeleteChat }) => {
  const chats = useChatStore((state) => state.chats)

  return (
    <aside className="w-64 bg-gray-900/90 backdrop-blur-md text-white flex flex-col p-4 gap-4">
      <button
        onClick={onCreateChat}
        className="bg-purple-500 hover:bg-purple-600 transition px-4 py-2 rounded font-semibold"
      >
        + New Chat
      </button>

      <div className="flex flex-col gap-2 overflow-y-auto mt-4">
        {Object.keys(chats).map((chatId, index) => (
          <div key={chatId} className="flex justify-between items-center">
            <button
              onClick={() => setActiveChatId(chatId)}
              className={`text-left px-3 py-2 rounded hover:bg-purple-500/30 transition flex-1 ${
                activeChatId === chatId ? 'bg-purple-500/50' : ''
              }`}
            >
              Chat {index + 1}
            </button>
            <button
              onClick={() => onDeleteChat(chatId)}
              className="text-red-400 hover:text-red-600 px-2"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}

export default SideNav
