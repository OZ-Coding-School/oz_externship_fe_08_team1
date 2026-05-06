import { useState, useEffect } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { Modal, Input, Button } from '@/components'
import { useSendSms, useVerifySms } from '@/features/accounts/verification'
import { useChangePhone } from '@/features/accounts/change-phone'

interface PhoneChangeModalProps {
  isOpen: boolean
  onClose: () => void
}

function toApiPhone(input: string): string {
  const digits = input.replace(/\D/g, '')
  if (digits.startsWith('0')) return '+82' + digits.slice(1)
  return '+' + digits
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function PhoneChangeModal({ isOpen, onClose }: PhoneChangeModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('')
  const [code, setCode] = useState('')
  const [smsToken, setSmsToken] = useState('')
  const [smsSent, setSmsSent] = useState(false)
  const [timeLeft, setTimeLeft] = useState(300)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const [codeVerified, setCodeVerified] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [codeError, setCodeError] = useState('')

  const sendSms = useSendSms()
  const verifySms = useVerifySms()
  const changePhone = useChangePhone()

  useEffect(() => {
    if (!timerActive || endTime === null) return
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(id)
        setTimerActive(false)
        setIsTimedOut(true)
        setSmsSent(false)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [timerActive, endTime])

  function handleClose() {
    setPhoneNumber('')
    setCode('')
    setSmsToken('')
    setSmsSent(false)
    setTimeLeft(300)
    setEndTime(null)
    setTimerActive(false)
    setIsTimedOut(false)
    setCodeVerified(false)
    setPhoneError('')
    setCodeError('')
    onClose()
  }

  function handleSendSms() {
    const apiPhone = toApiPhone(phoneNumber)
    if (!/^\+\d{11,15}$/.test(apiPhone)) {
      setPhoneError('올바른 휴대폰 번호를 입력해주세요.')
      return
    }

    setPhoneError('')
    setCode('')
    setCodeError('')
    setCodeVerified(false)
    setIsTimedOut(false)
    setTimeLeft(300)
    setEndTime(null)
    setTimerActive(false)

    sendSms.mutate(
      { phone_number: apiPhone, purpose: 'phone_change' },
      {
        onSuccess: () => {
          setSmsSent(true)
          setEndTime(Date.now() + 300_000)
          setTimerActive(true)
        },
        onError: () =>
          setPhoneError('SMS 전송에 실패했습니다. 다시 시도해주세요.'),
      }
    )
  }

  function handleVerifyCode() {
    verifySms.mutate(
      { phone_number: toApiPhone(phoneNumber), code },
      {
        onSuccess: (data) => {
          setSmsToken(data.sms_token)
          setCodeVerified(true)
          setTimerActive(false)
          setEndTime(null)
          setCodeError('')
        },
        onError: () => setCodeError('인증번호가 일치하지 않습니다.'),
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
          setCodeError('번호 변경에 실패했습니다. 다시 시도해주세요.'),
      }
    )
  }

  const smsButtonLabel = smsSent
    ? '재전송'
    : phoneNumber
      ? '인증번호 받기'
      : '변경'

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-[480px]">
      {/* Icon + Title + Description */}
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="bg-primary-100 mb-1 flex h-12 w-12 items-center justify-center rounded-full">
          <RefreshCw size={24} className="text-primary" />
        </div>
        <h2 className="text-text-heading mt-3 text-xl font-bold">
          휴대폰 번호 변경
        </h2>
        <p className="text-text-muted mt-1 text-sm">
          입력하신 휴대폰번호로 인증번호를 보내드릴게요.
        </p>
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
              onChange={(e) => {
                setPhoneNumber(e.target.value)
                setPhoneError('')
              }}
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
                placeholder="인증 번호"
                value={code}
                inputMode="numeric"
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, ''))
                  setCodeError('')
                }}
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
