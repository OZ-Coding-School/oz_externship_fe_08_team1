import { useReducer, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { Check, RotateCw } from 'lucide-react'
import { Modal, Input, Button } from '@/components'
import { MehFaceIcon } from './icons'
import { useSendEmail, useVerifyEmail } from '@/features/accounts/verification'
import { useRestoreAccount } from '@/features/accounts/restore'
import { useVerificationTimer } from '@/hooks/useVerificationTimer'
import { useToastStore } from '@/stores/toastStore'
import { ROUTES } from '@/constants/routes'

export interface RestoreWithdrawnModalProps {
  isOpen: boolean
  onClose: () => void
  initialEmail?: string
  expireAt?: string
}

const VERIFY_TTL_SEC = 300

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

type Step = 'status' | 'verification'

interface ModalState {
  step: Step
  email: string
  code: string
  emailToken: string
  codeSent: boolean
  codeVerified: boolean
  emailError: string
  codeError: string
  showSuccess: boolean
  bannerVisible: boolean
}

type ModalAction =
  | { type: 'RESET'; email: string }
  | { type: 'SET_STEP'; step: Step }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_EMAIL_ERROR'; error: string }
  | { type: 'SET_CODE_ERROR'; error: string }
  | { type: 'SEND_EMAIL_START' }
  | { type: 'CODE_SENT' }
  | { type: 'CODE_VERIFIED'; emailToken: string }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'SHOW_BANNER' }
  | { type: 'HIDE_BANNER' }
  | { type: 'RESTORE_SUCCESS' }

function makeInitialState(email: string): ModalState {
  return {
    step: 'status',
    email,
    code: '',
    emailToken: '',
    codeSent: false,
    codeVerified: false,
    emailError: '',
    codeError: '',
    showSuccess: false,
    bannerVisible: false,
  }
}

function reducer(state: ModalState, action: ModalAction): ModalState {
  switch (action.type) {
    case 'RESET':
      return makeInitialState(action.email)
    case 'SET_STEP':
      return { ...state, step: action.step }
    case 'SET_EMAIL':
      return { ...state, email: action.email, emailError: '' }
    case 'SET_CODE':
      return { ...state, code: action.code, codeError: '' }
    case 'SET_EMAIL_ERROR':
      return { ...state, emailError: action.error }
    case 'SET_CODE_ERROR':
      return { ...state, codeError: action.error }
    case 'SEND_EMAIL_START':
      return {
        ...state,
        emailError: '',
        code: '',
        codeError: '',
        codeVerified: false,
      }
    case 'CODE_SENT':
      return { ...state, codeSent: true }
    case 'CODE_VERIFIED':
      return {
        ...state,
        codeVerified: true,
        emailToken: action.emailToken,
        codeError: '',
      }
    case 'TOKEN_EXPIRED':
      return {
        ...state,
        codeVerified: false,
        emailToken: '',
        codeError: '인증이 만료되었습니다. 인증코드를 다시 받아주세요.',
      }
    case 'SHOW_BANNER':
      return { ...state, bannerVisible: true }
    case 'HIDE_BANNER':
      return { ...state, bannerVisible: false }
    case 'RESTORE_SUCCESS':
      return { ...state, showSuccess: true }
    default:
      return state
  }
}

export function RestoreWithdrawnModal({
  isOpen,
  onClose,
  initialEmail = '',
  expireAt,
}: RestoreWithdrawnModalProps) {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.show)

  const [state, dispatch] = useReducer(reducer, makeInitialState(initialEmail))
  const {
    step,
    email,
    code,
    emailToken,
    codeSent,
    codeVerified,
    emailError,
    codeError,
    showSuccess,
    bannerVisible,
  } = state

  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timer = useVerificationTimer({ ttlSeconds: VERIFY_TTL_SEC })
  const resetTimer = timer.reset

  const sendEmail = useSendEmail()
  const verifyEmail = useVerifyEmail()
  const restoreAccount = useRestoreAccount()

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'RESET', email: initialEmail })
      resetTimer()
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    }
  }, [isOpen, initialEmail, resetTimer])

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    }
  }, [])

  const handleNavigateToLogin = useCallback(() => {
    onClose()
    navigate(ROUTES.AUTH.LOGIN)
  }, [onClose, navigate])

  function handleSendEmail() {
    if (!isValidEmail(email)) {
      dispatch({
        type: 'SET_EMAIL_ERROR',
        error: '올바른 이메일 형식을 입력해주세요.',
      })
      return
    }
    dispatch({ type: 'SEND_EMAIL_START' })
    resetTimer()

    sendEmail.mutate(
      { email, purpose: 'recovery' },
      {
        onSuccess: () => {
          dispatch({ type: 'CODE_SENT' })
          timer.start()
          dispatch({ type: 'SHOW_BANNER' })
          if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
          bannerTimerRef.current = setTimeout(
            () => dispatch({ type: 'HIDE_BANNER' }),
            3000
          )
        },
        onError: () =>
          dispatch({
            type: 'SET_EMAIL_ERROR',
            error: '해당 이메일로 인증 코드를 전송할 수 없습니다.',
          }),
      }
    )
  }

  function handleVerifyCode() {
    verifyEmail.mutate(
      { email, purpose: 'recovery', code },
      {
        onSuccess: (data) => {
          dispatch({ type: 'CODE_VERIFIED', emailToken: data.email_token })
          timer.stop()
        },
        onError: () =>
          dispatch({
            type: 'SET_CODE_ERROR',
            error: '인증코드가 일치하지 않습니다.',
          }),
      }
    )
  }

  function handleConfirmRestore() {
    if (!emailToken) return
    restoreAccount.mutate(
      { email_token: emailToken },
      {
        onSuccess: () => dispatch({ type: 'RESTORE_SUCCESS' }),
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status
            if (status === 400 || status === 401) {
              dispatch({ type: 'TOKEN_EXPIRED' })
              return
            }
          }
          showToast('계정 복구에 실패했습니다. 다시 시도해주세요.', 'error')
        },
      }
    )
  }

  return (
    <>
      {bannerVisible &&
        createPortal(
          <div className="pointer-events-none fixed bottom-[calc(50%+230px)] left-1/2 z-55 -translate-x-1/2">
            <div className="flex h-12 w-62 items-center gap-3 rounded-xl bg-white px-4 shadow-md">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-500">
                <Check size={16} className="text-white" />
              </div>
              <span className="text-sm leading-[140%] font-normal tracking-[-0.03em] text-gray-600">
                전송 완료! 이메일을 확인해주세요.
              </span>
            </div>
          </div>,
          document.body
        )}
      {showSuccess &&
        createPortal(
          <div
            className="fixed inset-0 z-55 cursor-pointer bg-gray-900/60 backdrop-blur-sm"
            onClick={handleNavigateToLogin}
          />,
          document.body
        )}
      {showSuccess &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-60 flex items-center justify-center">
            <div className="flex h-32 w-99 flex-col items-center justify-center gap-3 rounded-xl bg-white text-center shadow-lg">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
                <Check size={20} className="text-white" />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-[20px] leading-[140%] font-bold tracking-[-0.03em] text-gray-900">
                  계정 복구 완료!
                </h3>
                <p className="text-sm leading-[140%] font-normal tracking-[-0.03em] text-gray-500">
                  지금 바로 로그인해 보세요
                </p>
              </div>
            </div>
          </div>,
          document.body
        )}
      <Modal
        isOpen={isOpen}
        onClose={showSuccess ? handleNavigateToLogin : onClose}
        hideCloseButton={showSuccess}
        closeOnOverlayClick={step === 'status'}
        maxWidth="max-w-[396px] max-h-[437px]"
      >
        {step === 'status' ? (
          // ── Step 1: 계정 비활성 안내 ──────────────────────────────────
          <div className="flex flex-col items-center gap-10 pb-2">
            <div className="flex flex-col items-center gap-4">
              <div className="bg-primary-300 flex h-8 w-8 items-center justify-center rounded-full">
                <MehFaceIcon className="text-primary" />
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <h2 className="text-xl leading-[140%] font-bold tracking-tight text-gray-900">
                  해당 계정은 탈퇴된 상태에요
                </h2>
                <p className="text-sm leading-[140%] tracking-tight whitespace-pre-line text-gray-600">
                  {expireAt
                    ? `${new Date(expireAt).toLocaleDateString('ko-KR')} 이후, 계정 정보는 완전히 삭제돼요.\n계정을 다시 사용하시려면 아래 버튼을 눌러 복구를 진행해주세요.`
                    : `계정을 다시 사용하시려면 아래 버튼을 눌러 복구를 진행해주세요.`}
                </p>
              </div>
            </div>
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={() =>
                dispatch({ type: 'SET_STEP', step: 'verification' })
              }
            >
              <span className="font-normal">계정 다시 사용하기</span>
            </Button>
          </div>
        ) : (
          // ── Step 2: 이메일 인증 ────────────────────────────────────────
          <div className="relative">
            <div className="mb-6 flex flex-col items-center text-center">
              <div className="bg-primary-300 flex h-8 w-8 items-center justify-center rounded-full">
                <RotateCw size={20} className="text-primary" />
              </div>
              <h2 className="mt-3 text-xl font-bold tracking-tight text-gray-900">
                계정 다시 사용하기
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                입력하신 이메일로 인증번호를 보내드릴게요.
              </p>
            </div>

            {/* 이메일 입력 */}
            <div className="mb-3">
              <label
                htmlFor="restore-email-input"
                className="text-text-heading mb-3 block text-base font-normal"
              >
                이메일{' '}
                <span aria-hidden="true" className="text-error">
                  *
                </span>
              </label>
              <div className="flex items-start gap-2">
                <div className="w-50.25">
                  <Input
                    id="restore-email-input"
                    type="email"
                    placeholder="이메일을 입력해 주세요."
                    className="placeholder:text-sm placeholder:font-normal placeholder:tracking-[-0.03em]"
                    value={email}
                    onChange={(e) =>
                      dispatch({ type: 'SET_EMAIL', email: e.target.value })
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        isValidEmail(email) &&
                        !sendEmail.isPending
                      )
                        handleSendEmail()
                    }}
                    isError={!!emailError}
                    errorMessage={emailError}
                    maxLength={100}
                  />
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleSendEmail}
                  loading={sendEmail.isPending}
                  disabled={!isValidEmail(email) || codeVerified}
                  className="h-12 w-34.75 shrink-0 whitespace-nowrap"
                >
                  {codeSent ? '재전송' : '인증코드전송'}
                </Button>
              </div>
            </div>

            {/* 인증코드 입력 */}
            <div className="mb-10">
              <label htmlFor="restore-code-input" className="sr-only">
                인증코드
              </label>
              <div className="flex items-start gap-2">
                <div className="w-50.25">
                  <Input
                    id="restore-code-input"
                    placeholder={
                      codeSent
                        ? '인증번호를 입력해주세요.'
                        : '인증번호 6자리를 입력해주세요.'
                    }
                    className="placeholder:text-sm placeholder:font-normal placeholder:tracking-[-0.03em]"
                    value={code}
                    inputMode="numeric"
                    onChange={(e) =>
                      dispatch({
                        type: 'SET_CODE',
                        code: e.target.value.replace(/\D/g, ''),
                      })
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === 'Enter' &&
                        code.length === 6 &&
                        !codeVerified &&
                        !verifyEmail.isPending
                      )
                        handleVerifyCode()
                    }}
                    maxLength={6}
                    isError={!!codeError || timer.isTimedOut}
                    errorMessage={
                      codeError ||
                      (timer.isTimedOut
                        ? '인증 시간이 초과되었습니다. 코드를 재전송해 주세요.'
                        : undefined)
                    }
                    disabled={
                      !codeSent ||
                      codeVerified ||
                      timer.isTimedOut ||
                      verifyEmail.isPending
                    }
                    rightElement={
                      codeSent && !codeVerified && !timer.isTimedOut ? (
                        <span className="text-error text-sm font-medium">
                          {timer.formattedTime}
                        </span>
                      ) : undefined
                    }
                  />
                </div>
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleVerifyCode}
                  loading={verifyEmail.isPending}
                  disabled={
                    code.length !== 6 ||
                    !codeSent ||
                    codeVerified ||
                    timer.isTimedOut
                  }
                  className="h-12 w-34.75 shrink-0 whitespace-nowrap"
                >
                  인증코드확인
                </Button>
              </div>
            </div>

            {/* 확인 버튼 */}
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={handleConfirmRestore}
              loading={restoreAccount.isPending}
              disabled={!codeVerified}
            >
              확인
            </Button>
          </div>
        )}
      </Modal>
    </>
  )
}
