import { useReducer } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { Modal, Input, Button } from '@/components'
import { useSendSms, useVerifySms } from '@/features/accounts/verification'
import { useChangePhone } from '@/features/accounts/change-phone'
import { useVerificationTimer } from '@/hooks/useVerificationTimer'

interface PhoneChangeModalProps {
  isOpen: boolean
  onClose: () => void
}

type State = {
  phoneNumber: string
  phoneError: string
  code: string
  codeError: string
  smsSent: boolean
  codeVerified: boolean
  smsToken: string
}

type Action =
  | { type: 'SET_PHONE_NUMBER'; payload: string }
  | { type: 'SET_PHONE_ERROR'; payload: string }
  | { type: 'SET_CODE'; payload: string }
  | { type: 'SET_CODE_ERROR'; payload: string }
  | { type: 'SMS_SENT' }
  | { type: 'SMS_SEND_FAILED'; payload: string }
  | { type: 'PREPARE_RESEND' }
  | { type: 'CODE_VERIFIED'; payload: string }
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
      return { ...state, smsSent: true }
    case 'SMS_SEND_FAILED':
      return { ...state, phoneError: action.payload }
    case 'PREPARE_RESEND':
      return { ...state, code: '', codeError: '', codeVerified: false }
    case 'CODE_VERIFIED':
      return {
        ...state,
        smsToken: action.payload,
        codeVerified: true,
        codeError: '',
      }
    case 'TIMER_TIMEOUT':
      return { ...state, smsSent: false }
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
  } = state

  const timer = useVerificationTimer({
    onExpire: () => dispatch({ type: 'TIMER_TIMEOUT' }),
  })

  const sendSms = useSendSms()
  const verifySms = useVerifySms()
  const changePhone = useChangePhone()

  function handleClose() {
    dispatch({ type: 'RESET' })
    timer.reset()
    onClose()
  }

  function handleSendSms() {
    if (!/^010\d{8}$/.test(phoneNumber)) {
      dispatch({
        type: 'SET_PHONE_ERROR',
        payload: '010으로 시작하는 11자리 번호를 입력해주세요.',
      })
      return
    }

    dispatch({ type: 'PREPARE_RESEND' })

    sendSms.mutate(
      { phone_number: phoneNumber, purpose: 'phone_change' },
      {
        onSuccess: () => {
          dispatch({ type: 'SMS_SENT' })
          timer.start()
        },
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
        onSuccess: (data) => {
          dispatch({ type: 'CODE_VERIFIED', payload: data.sms_token })
          timer.stop()
        },
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

  const smsButtonLabel = smsSent ? '재전송' : '인증번호 받기'

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
              isError={!!phoneError || timer.isTimedOut}
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
        {(phoneError || timer.isTimedOut) && (
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
                      {timer.formattedTime}
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
