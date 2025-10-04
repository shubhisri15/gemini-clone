// stores/useChatStore.js
import { create } from 'zustand'

const CHATS_STORAGE_KEY = 'geminiCloneChats'

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {}
  }
  const storedChats = localStorage.getItem(CHATS_STORAGE_KEY)
  return storedChats ? JSON.parse(storedChats) : {}
}

export const useChatStore = create((set, get) => ({
  userChats: getInitialState(),

  // Selector to get chats for a specific user
  getChatsForUser: (userId) => {
    return get().userChats[userId]?.chatrooms || []
  },

  // Create a new chat for a specific user
  createChat: (userId, newChat) => { // newChat should be { id, title, messages: [] }
    set((state) => {
      const currentUserChats = state.userChats[userId]?.chatrooms || []
      const updatedUserEntry = {
        ...state.userChats,
        [userId]: {
          chatrooms: [newChat, ...currentUserChats],
        },
      }
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedUserEntry))
      return { userChats: updatedUserEntry }
    })
  },
  
  // Add a message to a specific chat for a specific user
  addMessage: (userId, chatId, message) => {
    set((state) => {
      const userChatrooms = state.userChats[userId]?.chatrooms || []
      const updatedChatrooms = userChatrooms.map(room => {
        if (room.id === chatId) {
          return { ...room, messages: [...room.messages, message] }
        }
        return room
      })
      
      const updatedUserEntry = {
        ...state.userChats,
        [userId]: { chatrooms: updatedChatrooms },
      }
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedUserEntry))
      return { userChats: updatedUserEntry }
    })
  },

  // Delete a chat for a specific user
  deleteChat: (userId, chatId) => {
    set((state) => {
      const userChatrooms = state.userChats[userId]?.chatrooms || []
      const filteredChatrooms = userChatrooms.filter(room => room.id !== chatId)
      
      const updatedUserEntry = {
        ...state.userChats,
        [userId]: { chatrooms: filteredChatrooms },
      }
      localStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(updatedUserEntry))
      return { userChats: updatedUserEntry }
    })
  },
}))