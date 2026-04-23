import { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { Input } from '@/components/common/Input'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/common/Button'
import { SocialLoginButton } from '@/components/common/SocialLoginButton'
import { AlertModal } from '@/components/common/Modal/AlertModal'
import { useLogin } from '@/features/accounts/login/queries'
import type { AxiosError } from 'axios'
import type { LoginErrorResponse } from '@/features/accounts/login/types'
import logo from '@/assets/logo.png'

export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [alertMessage, setAlertMessage] = useState('')
  const [isAlertOpen, setIsAlertOpen] = useState(false)

  const { mutate: login, isPending } = useLogin()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setEmailError('이 필드는 필수 항목입니다.')
      return
    }
    if (!password) {
      setPasswordError('이 필드는 필수 항목입니다.')
      return
    }

    login(
      { email, password },
      {
        onSuccess: (data) => {
          localStorage.setItem('access_token', data.access_token)
          navigate('/')
        },
        onError: (error: AxiosError<LoginErrorResponse>) => {
          const errorDetail = error.response?.data?.error_detail

          if (!errorDetail) return

          if (typeof errorDetail === 'string') {
            setAlertMessage(errorDetail)
            setIsAlertOpen(true)
          } else {
            if (errorDetail.detail) {
              const detail = errorDetail as unknown as {
                detail: string
                expire_at: string
              }
              setAlertMessage(
                `${detail.detail}\n복구 가능 날짜: ${detail.expire_at}`
              )
              setIsAlertOpen(true)
            }
            if (errorDetail.email) {
              setEmailError(errorDetail.email[0])
            }
            if (errorDetail.password) {
              setPasswordError(errorDetail.password[0])
            }
          }
        },
      }
    )
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        <div className="flex w-full flex-col items-center gap-4">
          <img src={logo} alt="OZ 오즈코딩스쿨" className="h-5 w-auto" />
          <p className="text-text-muted text-sm">
            아직 회원이 아니신가요?{' '}
            <Link to="/signup" className="text-primary font-medium">
              회원가입 하기
            </Link>
          </p>
        </div>

        <div className="mt-4 flex w-full flex-col gap-3">
          <SocialLoginButton provider="kakao" />
          <SocialLoginButton provider="naver" />
        </div>

        <form onSubmit={handleSubmit} className="flex w-full flex-col gap-3">
          <Input
            label="아이디"
            type="email"
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setEmailError('')
            }}
            isError={Boolean(emailError)}
            errorMessage={emailError}
          />
          <PasswordInput
            label="비밀번호"
            placeholder="6~15자리 영문 대소문자, 숫자, 특수문자 포함"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setPasswordError('')
            }}
            isError={Boolean(passwordError)}
            errorMessage={passwordError}
          />

          <div className="text-text-muted flex gap-2 text-sm">
            <button type="button">아이디 찾기</button>
            <span>|</span>
            <button type="button">비밀번호 찾기</button>
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isPending}
            disabled={!email || !password}
          >
            일반회원 로그인
          </Button>
        </form>
      </div>

      <AlertModal
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        message={alertMessage}
      />
    </main>
  )
}

export default LoginPage
