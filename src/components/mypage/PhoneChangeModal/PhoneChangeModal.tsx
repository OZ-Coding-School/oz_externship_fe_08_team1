import { useReducer, useEffect } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { Modal, Input, Button } from '@/components'
import { useSendSms, useVerifySms } from '@/features/accounts/verification'
import { useChangePhone } from '@/features/accounts/change-phone'

interface PhoneChangeModalProps {
  isOpen: boolean
  onClose: () => void
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

type State = {
  phoneNumber: string
  phoneError: string
  code: string
  codeError: string
  smsSent: boolean
  codeVerified: boolean
  smsToken: string
  timeLeft: number
  endTime: number | null
  timerActive: boolean
  isTimedOut: boolean
}

type Action =
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_PHONE_ERROR'; payload: string }
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_CODE_ERROR'; payload: string }
  | { type: 'SMS_SENT'; payload: number }
  | { type: 'SMS_SEND_FAILED'; payload: string }
  | { type: 'PREPARE_RESEND' }
  | { type: 'CODE_VERIFIED'; payload: string }
  | { type: 'TIMER_TICK'; payload: number }
  | { type: 'TIMER_TIMEOUT' }
  | { type: 'RESET' }

const initialState: State = {
  phoneNumber: '',
  phoneError: '',
  code: '',
  codeError: '',
  smsSent: false,
  codeVerified: false,
  smsToken: '',
  timeLeft: 300,
  endTime: null,
  timerActive: false,
  isTimedOut: false,
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PHONE_NUMBER':
      return { ...state, phoneNumber: action.payload, phoneError: '' }
    case 'SET_PHONE_ERROR':
      return { ...state, phoneError: action.payload }
    case 'SET_CODE':
      return { ...state, code: action.payload, codeError: '' }
    case 'SET_CODE_ERROR':
      return { ...state, codeError: action.payload }
    case 'SMS_SENT':
      return {
        ...state,
        smsSent: true,
        endTime: action.payload,
        timerActive: true,
        timeLeft: 300,
        isTimedOut: false,
      }
    case 'SMS_SEND_FAILED':
      return { ...state, phoneError: action.payload }
    case 'PREPARE_RESEND':
      return {
        ...state,
        code: '',
        codeError: '',
        codeVerified: false,
        isTimedOut: false,
        timeLeft: 300,
        endTime: null,
        timerActive: false,
      }
    case 'CODE_VERIFIED':
      return {
        ...state,
        smsToken: action.payload,
        codeVerified: true,
        timerActive: false,
        endTime: null,
        codeError: '',
      }
    case 'TIMER_TICK':
      return { ...state, timeLeft: action.payload }
    case 'TIMER_TIMEOUT':
      return {
        ...state,
        timerActive: false,
        isTimedOut: true,
        smsSent: false,
        timeLeft: 0,
      }
    case 'RESET':
      return initialState
  }
}

export function PhoneChangeModal({ isOpen, onClose }: PhoneChangeModalProps) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {
    phoneNumber,
    phoneError,
    code,
    codeError,
    smsSent,
    codeVerified,
    smsToken,
    timeLeft,
    endTime,
    timerActive,
    isTimedOut,
  } = state

  const sendSms = useSendSms()
  const verifySms = useVerifySms()
  const changePhone = useChangePhone()

  useEffect(() => {
    if (!timerActive || endTime === null) return
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000))
      if (remaining <= 0) {
        clearInterval(id)
        dispatch({ type: 'TIMER_TIMEOUT' })
      } else {
        dispatch({ type: 'TIMER_TICK', payload: remaining })
      }
    }, 1000)
    return () => clearInterval(id)
  }, [timerActive, endTime])

  function handleClose() {
    dispatch({ type: 'RESET' })
    onClose()
  }

  function handleSendSms() {
    if (!/^010\d{8}$/.test(phoneNumber)) {
      dispatch({
        type: 'SET_PHONE_ERROR',
        payload: '숫자만 입력해주세요. (예: 01012341234)',
      })
      return
    }

    dispatch({ type: 'PREPARE_RESEND' })

    sendSms.mutate(
      { phone_number: phoneNumber, purpose: 'phone_change' },
      {
        onSuccess: () =>
          dispatch({ type: 'SMS_SENT', payload: Date.now() + 300_000 }),
        onError: () =>
          dispatch({
            type: 'SMS_SEND_FAILED',
            payload: 'SMS 전송에 실패했습니다. 다시 시도해주세요.',
          }),
      }
    )
  }

  function handleVerifyCode() {
    verifySms.mutate(
      { phone_number: phoneNumber, purpose: 'phone_change', code },
      {
        onSuccess: (data) =>
          dispatch({ type: 'CODE_VERIFIED', payload: data.sms_token }),
        onError: () =>
          dispatch({
            type: 'SET_CODE_ERROR',
            payload: '인증번호가 일치하지 않습니다.',
          }),
      }
    )
  }

  function handleConfirm() {
    if (!smsToken) return
    changePhone.mutate(
      { phone_verify_token: smsToken },
      {
        onSuccess: () => handleClose(),
        onError: () =>
          dispatch({
            type: 'SET_CODE_ERROR',
            payload: '번호 변경에 실패했습니다. 다시 시도해주세요.',
          }),
      }
    )
  }

  const smsButtonLabel = smsSent
    ? '재전송'
    : phoneNumber
      ? '인증번호 받기'
      : '변경'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[480px]"
      title="휴대폰 번호 변경"
      description="입력하신 휴대폰번호로 인증번호를 보내드릴게요."
    >
      {/* Icon */}
      <div className="mb-6 flex justify-center">
        <div className="bg-primary-100 flex h-12 w-12 items-center justify-center rounded-full">
          <RefreshCw size={24} className="text-primary" />
        </div>
      </div>

      {/* Phone input row */}
      <div className="mb-4">
        <label
          htmlFor="phone-change-input"
          className="text-text-heading mb-3 block text-base font-normal"
        >
          휴대전화
        </label>
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              id="phone-change-input"
              placeholder="01012341234"
              value={phoneNumber}
              autoFocus
              onChange={(e) =>
                dispatch({ type: 'SET_PHONE_NUMBER', payload: e.target.value })
              }
              onKeyDown={(e) => {
                if (
                  e.key === 'Enter' &&
                  phoneNumber &&
                  !codeVerified &&
                  !sendSms.isPending
                )
                  handleSendSms()
              }}
              isError={!!phoneError || isTimedOut}
              disabled={codeVerified}
            />
          </div>
          <Button
            variant="outline"
            size="md"
            onClick={handleSendSms}
            loading={sendSms.isPending}
            disabled={!phoneNumber || codeVerified}
            className="h-12 shrink-0"
          >
            {smsButtonLabel}
          </Button>
        </div>
        {(phoneError || isTimedOut) && (
          <p className="text-error mt-2 text-xs">
            {phoneError ||
              '*인증번호 전송 시간이 초과되었습니다. 인증번호를 재전송해 주세요.'}
          </p>
        )}
      </div>

      {/* Code input row (shown after SMS sent) */}
      {smsSent && (
        <div className="mb-6">
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <Input
                aria-label="인증번호"
                placeholder="인증 번호"
                value={code}
                inputMode="numeric"
                onChange={(e) =>
                  dispatch({
                    type: 'SET_CODE',
                    payload: e.target.value.replace(/\D/g, ''),
                  })
                }
                onKeyDown={(e) => {
                  if (
                    e.key === 'Enter' &&
                    code &&
                    !codeVerified &&
                    !verifySms.isPending
                  )
                    handleVerifyCode()
                }}
                maxLength={6}
                isSuccess={codeVerified}
                isError={!!codeError}
                disabled={codeVerified}
                rightElement={
                  codeVerified ? (
                    <Check size={16} className="text-success-dark" />
                  ) : (
                    <span className="text-error text-sm font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  )
                }
              />
            </div>
            <Button
              variant="outline"
              size="md"
              onClick={handleVerifyCode}
              loading={verifySms.isPending}
              disabled={!code || codeVerified}
              className="h-12 shrink-0"
            >
              인증번호 확인
            </Button>
          </div>
          {codeError && <p className="text-error mt-2 text-xs">*{codeError}</p>}
        </div>
      )}

      {/* Confirm button */}
      <Button
        variant="primary"
        fullWidth
        size="md"
        onClick={handleConfirm}
        loading={changePhone.isPending}
        disabled={!codeVerified}
        className="mt-2"
      >
        확인
      </Button>
    </Modal>
  )
}
