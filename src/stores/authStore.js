// stores/authStore.js (Finalized Hydration Pattern)
import { create } from 'zustand'

const AUTH_STORAGE_KEY = 'geminiCloneAuth'
const USERS_STORAGE_KEY = 'geminiCloneUsers'

// Initial state *before* localStorage is checked
const DEFAULT_STATE = {
    isAuthenticated: false,
    currentUser: null,
    users: {}, // { phoneNumber: { name, email, phone, ... } }
    _hasHydrated: false, // <-- NEW STATE FLAG for hydration status
}

export const useAuthStore = create((set, get) => ({
    ...DEFAULT_STATE,
    
    // NEW ACTION: Used internally to flag when localStorage load is complete
    setHasHydrated: (hydrated) => {
        set({ _hasHydrated: hydrated })
    },

    registerUser: (userData) => {
        const { phoneNumber } = userData
        const newUsers = {
            ...get().users,
            [phoneNumber]: userData,
        }
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(newUsers))
        set({ users: newUsers })
    },

    login: (userData) => {
        // This is where the user state is set for the current session
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userData))
        set({ isAuthenticated: true, currentUser: userData })
    },

    getUserByPhone: (phoneNumber) => {
        return get().users[phoneNumber] || null
    },

    // ... other auth actions like logout
}))

// ----------------------------------------------------
// 🛑 CRITICAL HYDRATION LOGIC (Runs only on client side)
// ----------------------------------------------------
if (typeof window !== 'undefined') {
    // We use a function to initialize the store data from localStorage after the window is defined.
    const hydrate = () => {
        try {
            const authData = localStorage.getItem(AUTH_STORAGE_KEY)
            const usersData = localStorage.getItem(USERS_STORAGE_KEY)
            
            const initialAuth = authData ? JSON.parse(authData) : null
            const initialUsers = usersData ? JSON.parse(usersData) : {}

            useAuthStore.setState({
                isAuthenticated: !!initialAuth,
                currentUser: initialAuth,
                users: initialUsers,
                _hasHydrated: true, // Set to TRUE *after* successful data load
            })
            
        } catch (e) {
            console.error("Error hydrating auth store from localStorage", e)
            useAuthStore.setState({ _hasHydrated: true }) // Still set to true even if fail
        }
    }
    
    hydrate()
}