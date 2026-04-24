import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { meQueries } from '@/features/accounts/me/queries'
import { useAuthStore } from '@/stores/authStore'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { login: setAuth } = useAuthStore()

  //
  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (!token) return

    queryClient
      .fetchQuery(meQueries.detail())
      .then((meData) => {
        setAuth({
          email: meData.email,
          nickname: meData.nickname,
          profileImage: meData.profile_img_url,
        })
      })
      .catch(() => {
        localStorage.removeItem('accessToken')
      })
  }, [queryClient, setAuth])

  return <>{children}</>
}
