import { create } from 'zustand'

export const useChatStore = create((set) => ({
  chats: {}, // { chatId1: [messages], chatId2: [messages], ... }

  // Add a message to a specific chat
  addMessage: (chatId, message) =>
    set((state) => ({
      chats: {
        ...state.chats,
        [chatId]: [...(state.chats[chatId] || []), message],
      },
    })),

  // Create a new chat session
  createChat: (chatId) =>
    set((state) => ({
      chats: {
        [chatId]: [],
        ...state.chats,  
      },
    })),

  // Delete a chat entirely
  deleteChat: (chatId) =>
    set((state) => {
      const newChats = { ...state.chats }
      delete newChats[chatId]
      return { chats: newChats }
    }),
}))
