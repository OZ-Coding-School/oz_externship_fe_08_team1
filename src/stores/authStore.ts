import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  nickname: string
  email: string
  profileImage?: string | null
  role?: 'user' | 'student' | 'admin'
}

interface AuthState {
  isAuthenticated: boolean
  isLoading: boolean
  user: User | null
  login: (user: User) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: !!localStorage.getItem('accessToken'),
      isLoading: !!localStorage.getItem('accessToken'),
      user: null,
      login: (user) =>
        set(
          { isAuthenticated: true, isLoading: false, user },
          undefined,
          'auth/login'
        ),
      logout: () =>
        set(
          { isAuthenticated: false, isLoading: false, user: null },
          undefined,
          'auth/logout'
        ),
      setLoading: (loading) =>
        set({ isLoading: loading }, undefined, 'auth/setLoading'),
    }),
    { name: 'AuthStore' }
  )
)
