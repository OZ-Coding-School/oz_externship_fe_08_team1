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
  accessToken: string | null
  user: User | null
  login: (user: User, accessToken: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setAccessToken: (token: string) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: false,
      isLoading: true,
      accessToken: null,
      user: null,
      login: (user, accessToken) =>
        set(
          { isAuthenticated: true, isLoading: false, user, accessToken },
          undefined,
          'auth/login'
        ),
      logout: () =>
        set(
          {
            isAuthenticated: false,
            isLoading: false,
            user: null,
            accessToken: null,
          },
          undefined,
          'auth/logout'
        ),
      setLoading: (loading) =>
        set({ isLoading: loading }, undefined, 'auth/setLoading'),
      setAccessToken: (token) =>
        set({ accessToken: token }, undefined, 'auth/setAccessToken'),
    }),
    { name: 'AuthStore' }
  )
)
