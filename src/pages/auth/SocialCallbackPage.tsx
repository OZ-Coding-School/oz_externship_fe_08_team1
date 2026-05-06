import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { meQueries } from '@/features/accounts/me/queries'
import { useAuthStore } from '@/stores/authStore'
import { useSocialLoginCallback } from '@/features/accounts/social-login/queries'

export function SocialCallbackPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { login: setAuth } = useAuthStore()
  const { mutate: refresh } = useSocialLoginCallback()

  useEffect(() => {
    const isSuccess = searchParams.get('is_success')

    if (isSuccess !== 'true') {
      navigate('/login', { replace: true })
      return
    }

    refresh(undefined, {
      onSuccess: async (data) => {
        localStorage.setItem('accessToken', data.access_token)

        try {
          const meData = await queryClient.fetchQuery(meQueries.detail())
          setAuth({
            email: meData.email,
            nickname: meData.nickname,
            profileImage: meData.profile_img_url,
          })
          navigate('/', { replace: true })
        } catch {
          localStorage.removeItem('accessToken')
          navigate('/login', { replace: true })
        }
      },
      onError: () => {
        navigate('/login', { replace: true })
      },
    })
  }, [])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <p className="text-text-muted text-sm">로그인 처리 중...</p>
    </div>
  )
}
