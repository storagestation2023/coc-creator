import { create } from 'zustand'

interface AdminState {
  isAuthenticated: boolean
  password: string | null
  login: (password: string) => void
  logout: () => void
}

export const useAdminStore = create<AdminState>()((set) => {
  // Restore from sessionStorage on init
  const storedPassword = typeof window !== 'undefined' ? sessionStorage.getItem('admin_password') : null

  return {
    isAuthenticated: !!storedPassword,
    password: storedPassword,

    login: (password: string) => {
      sessionStorage.setItem('admin_password', password)
      set({ isAuthenticated: true, password })
    },

    logout: () => {
      sessionStorage.removeItem('admin_password')
      set({ isAuthenticated: false, password: null })
    },
  }
})
