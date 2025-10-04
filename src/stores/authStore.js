// stores/useAuthStore.js
import { create } from 'zustand'

const AUTH_STORAGE_KEY = 'geminiCloneAuth'
const USERS_STORAGE_KEY = 'geminiCloneUsers'

const getInitialState = () => {
  if (typeof window === 'undefined') {
    return {
      isAuthenticated: false,
      currentUser: null,
      users: {},
    }
  }

  const authData = localStorage.getItem(AUTH_STORAGE_KEY)
  const usersData = localStorage.getItem(USERS_STORAGE_KEY)
  
  return {
    isAuthenticated: !!authData,
    currentUser: authData ? JSON.parse(authData) : null,
    users: usersData ? JSON.parse(usersData) : {}, // { phoneNumber: { name, email, phone, ... } }
  }
}

export const useAuthStore = create((set, get) => ({
  ...getInitialState(),

  // Action to register a new user
  registerUser: (userData) => {
    const { phoneNumber } = userData
    const newUsers = {
      ...get().users,
      [phoneNumber]: userData,
    }
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers))
    set({ users: newUsers })
  },

  // Action to log a user in (after successful OTP validation)
  login: (userData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
    set({ isAuthenticated: true, currentUser: userData })
  },

  // Action to check if a phone number exists
  getUserByPhone: (phoneNumber) => {
    return get().users[phoneNumber] || null
  },

  // ... other auth actions like logout
}))