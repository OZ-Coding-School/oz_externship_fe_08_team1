import { useReducer, useEffect, useRef } from 'react'
import { useSendEmail, useVerifyEmail } from '@/features/accounts/verification'
import { useVerificationTimer } from '@/hooks/useVerificationTimer'

const VERIFY_TTL_SEC = 300
const BANNER_HIDE_MS = 3000

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

interface EmailCodeState {
  email: string
  code: string
  emailToken: string
  codeSent: boolean
  codeVerified: boolean
  emailError: string
  codeError: string
  bannerVisible: boolean
}

type EmailCodeAction =
  | { type: 'RESET'; email: string }
  | { type: 'SET_EMAIL'; email: string }
  | { type: 'SET_CODE'; code: string }
  | { type: 'SET_EMAIL_ERROR'; error: string }
  | { type: 'SET_CODE_ERROR'; error: string }
  | { type: 'SEND_EMAIL_START' }
  | { type: 'SEND_EMAIL_FAIL'; error: string }
  | { type: 'CODE_SENT' }
  | { type: 'CODE_VERIFIED'; emailToken: string }
  | { type: 'TOKEN_EXPIRED' }
  | { type: 'SHOW_BANNER' }
  | { type: 'HIDE_BANNER' }

function makeInitialState(email: string): EmailCodeState {
  return {
    email,
    code: '',
    emailToken: '',
    codeSent: false,
    codeVerified: false,
    emailError: '',
    codeError: '',
    bannerVisible: false,
  }
}

function reducer(
  state: EmailCodeState,
  action: EmailCodeAction
): EmailCodeState {
  switch (action.type) {
    case 'RESET':
      return makeInitialState(action.email)
    case 'SET_EMAIL':
      return {
        ...state,
        email: action.email,
        emailError: '',
        code: '',
        codeSent: false,
        codeVerified: false,
        emailToken: '',
        codeError: '',
      }
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
        emailToken: '',
      }
    case 'SEND_EMAIL_FAIL':
      return {
        ...state,
        emailError: action.error,
        codeSent: false,
        code: '',
        codeVerified: false,
        emailToken: '',
        codeError: '',
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
    default:
      return state
  }
}

export interface UseRecoveryEmailCodeFlowReturn {
  email: string
  code: string
  emailToken: string
  codeSent: boolean
  codeVerified: boolean
  emailError: string
  codeError: string
  bannerVisible: boolean
  timerFormatted: string
  timerTimedOut: boolean
  isSendingEmail: boolean
  isVerifyingCode: boolean
  isEmailValid: boolean
  onEmailChange: (email: string) => void
  onCodeChange: (code: string) => void
  onSendEmail: () => void
  onVerifyCode: () => void
  markTokenExpired: () => void
}

interface UseRecoveryEmailCodeFlowProps {
  isOpen: boolean
  initialEmail?: string
}

export function useRecoveryEmailCodeFlow({
  isOpen,
  initialEmail = '',
}: UseRecoveryEmailCodeFlowProps): UseRecoveryEmailCodeFlowReturn {
  const [state, dispatch] = useReducer(reducer, makeInitialState(initialEmail))
  const {
    email,
    code,
    emailToken,
    codeSent,
    codeVerified,
    emailError,
    codeError,
    bannerVisible,
  } = state

  const bannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const timer = useVerificationTimer({ ttlSeconds: VERIFY_TTL_SEC })
  const resetTimer = timer.reset

  const sendEmail = useSendEmail()
  const verifyEmail = useVerifyEmail()

  useEffect(() => {
    if (isOpen) {
      dispatch({ type: 'RESET', email: initialEmail })
      resetTimer()
      if (bannerTimerRef.current) {
        clearTimeout(bannerTimerRef.current)
        bannerTimerRef.current = null
      }
    }
  }, [isOpen, initialEmail, resetTimer])

  useEffect(() => {
    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current)
    }
  }, [])

  function onSendEmail() {
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
          bannerTimerRef.current = setTimeout(() => {
            dispatch({ type: 'HIDE_BANNER' })
            bannerTimerRef.current = null
          }, BANNER_HIDE_MS)
        },
        onError: () => {
          dispatch({
            type: 'SEND_EMAIL_FAIL',
            error: '해당 이메일로 인증 코드를 전송할 수 없습니다.',
          })
          timer.stop()
        },
      }
    )
  }

  function onVerifyCode() {
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

  return {
    email,
    code,
    emailToken,
    codeSent,
    codeVerified,
    emailError,
    codeError,
    bannerVisible,
    timerFormatted: timer.formattedTime,
    timerTimedOut: timer.isTimedOut,
    isSendingEmail: sendEmail.isPending,
    isVerifyingCode: verifyEmail.isPending,
    isEmailValid: isValidEmail(email),
    onEmailChange: (val) => dispatch({ type: 'SET_EMAIL', email: val }),
    onCodeChange: (val) => dispatch({ type: 'SET_CODE', code: val }),
    onSendEmail,
    onVerifyCode,
    markTokenExpired: () => dispatch({ type: 'TOKEN_EXPIRED' }),
  }
}
