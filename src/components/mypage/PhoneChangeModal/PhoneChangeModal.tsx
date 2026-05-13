import { useState } from 'react'
import { RefreshCw, Check } from 'lucide-react'
import { Modal, Input, Button } from '@/components'
import { useSendSms, useVerifySms } from '@/features/accounts/verification'
import { useChangePhone } from '@/features/accounts/change-phone'
import { useVerificationTimer } from '@/hooks/useVerificationTimer'

interface PhoneChangeModalProps {
  isOpen: boolean
  onClose: () => void
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
  const [codeVerified, setCodeVerified] = useState(false)
  const [phoneError, setPhoneError] = useState('')
  const [codeError, setCodeError] = useState('')

  const timer = useVerificationTimer({
    ttlSeconds: 300,
    onExpire: () => setSmsSent(false),
  })

  const sendSms = useSendSms()
  const verifySms = useVerifySms()
  const changePhone = useChangePhone()

  function handleClose() {
    setPhoneNumber('')
    setCode('')
    setSmsToken('')
    setSmsSent(false)
    timer.reset()
    setCodeVerified(false)
    setPhoneError('')
    setCodeError('')
    onClose()
  }

  function handleSendSms() {
    const apiPhone = phoneNumber
    if (!/^010\d{8}$/.test(apiPhone)) {
      setPhoneError('올바른 휴대폰 번호를 입력해주세요.')
      return
    }

    setPhoneError('')
    setCode('')
    setCodeError('')
    setCodeVerified(false)

    sendSms.mutate(
      { phone_number: apiPhone, purpose: 'phone_change' },
      {
        onSuccess: () => {
          setSmsSent(true)
          timer.start()
        },
        onError: () =>
          setPhoneError('SMS 전송에 실패했습니다. 다시 시도해주세요.'),
      }
    )
  }

  function handleVerifyCode() {
    verifySms.mutate(
      { phone_number: phoneNumber, purpose: 'phone_change', code },
      {
        onSuccess: (data) => {
          setSmsToken(data.sms_token)
          setCodeVerified(true)
          timer.stop()
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
