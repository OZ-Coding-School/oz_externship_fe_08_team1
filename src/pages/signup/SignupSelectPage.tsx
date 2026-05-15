import { useNavigate } from 'react-router'
import { SocialLoginButton } from '@/components/common/SocialLoginButton'
import { ROUTES } from '@/constants/routes'
import logo from '@/assets/logo.png'

export function SignupSelectPage() {
  const navigate = useNavigate()

  const handleSocialSignup = (provider: 'kakao' | 'naver') => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/accounts/social-login/${provider}/`
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-22">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-4">
          <img src={logo} alt="OZ 오즈코딩스쿨" className="h-6 w-45" />
          <p className="text-base text-gray-600">
            이미 회원이신가요?{' '}
            <button
              onClick={() => navigate(ROUTES.AUTH.LOGIN)}
              className="text-primary font-medium"
            >
              로그인 하기
            </button>
          </p>
        </div>

        <div className="mt-12 flex w-full flex-col gap-3">
          <SocialLoginButton
            provider="kakao"
            onClick={() => handleSocialSignup('kakao')}
          />
          <SocialLoginButton
            provider="naver"
            onClick={() => handleSocialSignup('naver')}
          />
        </div>

        <button
          onClick={() => navigate(ROUTES.SIGNUP.FORM)}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          일반 회원가입
        </button>
      </div>
    </main>
  )
}
