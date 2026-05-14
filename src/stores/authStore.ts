import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { UserRole } from '@/features/accounts/me/types'

interface User {
  nickname: string
  email: string
  profileImage?: string | null
  role?: UserRole
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
  setProfileImage: (url: string) => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      isAuthenticated: !!localStorage.getItem('accessToken'),
      isLoading: true,
      accessToken: localStorage.getItem('accessToken'),
      user: null,
      login: (user, accessToken) => {
        localStorage.setItem('accessToken', accessToken)
        set(
          { isAuthenticated: true, isLoading: false, user, accessToken },
          undefined,
          'auth/login'
        )
      },
      logout: () => {
        localStorage.removeItem('accessToken')
        set(
          {
            isAuthenticated: false,
            isLoading: false,
            user: null,
            accessToken: null,
          },
          undefined,
          'auth/logout'
        )
      },
      setLoading: (loading) =>
        set({ isLoading: loading }, undefined, 'auth/setLoading'),
      setAccessToken: (token) => {
        localStorage.setItem('accessToken', token)
        set({ accessToken: token }, undefined, 'auth/setAccessToken')
      },
      setProfileImage: (url) =>
        set(
          (state) => ({
            user: state.user ? { ...state.user, profileImage: url } : null,
          }),
          undefined,
          'auth/setProfileImage'
        ),
    }),
    { name: 'AuthStore' }
  )
)
