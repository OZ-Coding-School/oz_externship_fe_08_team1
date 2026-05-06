import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { meQueries } from '@/features/accounts/me'
import { useAuthStore } from '@/stores/authStore'
import instance from '@/api/instance'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient()
  const { login: setAuth, setLoading, setAccessToken } = useAuthStore()

  useEffect(() => {
    instance
      .post('/accounts/me/refresh', {}, { withCredentials: true })
      .then(({ data }) => {
        setAccessToken(data.access_token)
        return queryClient.fetchQuery(meQueries.detail())
      })
      .then((meData) => {
        setAuth(
          {
            email: meData.email,
            nickname: meData.nickname,
            profileImage: meData.profile_img_url,
          },
          useAuthStore.getState().accessToken ?? ''
        )
      })
      .catch(() => {
        queryClient.clear()
        useAuthStore.getState().logout()
      })
      .finally(() => {
        setLoading(false)
      })
  }, [queryClient, setAuth, setLoading, setAccessToken])

  return <>{children}</>
}
