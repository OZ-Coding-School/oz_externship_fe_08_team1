import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Check, RotateCw } from 'lucide-react'
import { Modal, Input, Button } from '@/components'
import { useAccountRestoreFlow } from './useAccountRestoreFlow'

interface VerificationStepProps {
  isOpen: boolean
  onClose: () => void
  onRestored: () => void
  initialEmail: string
}

export function VerificationStep({
  isOpen,
  onClose,
  onRestored,
  initialEmail,
}: VerificationStepProps) {
  const {
    email,
    code,
    codeSent,
    codeVerified,
    emailError,
    codeError,
    showSuccess,
    bannerVisible,
    timerFormatted,
    timerTimedOut,
    isSendingEmail,
    isVerifyingCode,
    isRestoring,
    isEmailValid,
    onEmailChange,
    onCodeChange,
    onSendEmail,
    onVerifyCode,
    onConfirmRestore,
    finishRestoreFlow,
  } = useAccountRestoreFlow({ isOpen, onClose, onRestored, initialEmail })

  useEffect(() => {
    if (!showSuccess) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finishRestoreFlow()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [showSuccess, finishRestoreFlow])

  return (
    <>
      {/* 이메일 전송 완료 배너 */}
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

      {/* 복구 완료 오버레이 */}
      {showSuccess &&
        isOpen &&
        createPortal(
          <div
            role="button"
            tabIndex={0}
            aria-label="계정 복구 완료, 로그인 페이지로 이동"
            className="fixed inset-0 z-55 cursor-pointer bg-gray-900/60 backdrop-blur-sm"
            onClick={finishRestoreFlow}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') finishRestoreFlow()
            }}
          />,
          document.body
        )}
      {showSuccess &&
        isOpen &&
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
        onClose={showSuccess ? finishRestoreFlow : onClose}
        hideCloseButton={showSuccess}
        closeOnOverlayClick={false}
        maxWidth="max-w-[396px] max-h-[437px]"
      >
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
                  onChange={(e) => onEmailChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && isEmailValid && !isSendingEmail)
                      onSendEmail()
                  }}
                  isError={!!emailError}
                  errorMessage={emailError}
                  maxLength={100}
                />
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={onSendEmail}
                loading={isSendingEmail}
                disabled={!isEmailValid || codeVerified}
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
                    onCodeChange(e.target.value.replace(/\D/g, ''))
                  }
                  onKeyDown={(e) => {
                    if (
                      e.key === 'Enter' &&
                      code.length === 6 &&
                      !codeVerified &&
                      !isVerifyingCode
                    )
                      onVerifyCode()
                  }}
                  maxLength={6}
                  isError={!!codeError || timerTimedOut}
                  errorMessage={
                    codeError ||
                    (timerTimedOut
                      ? '인증 시간이 초과되었습니다. 코드를 재전송해 주세요.'
                      : undefined)
                  }
                  disabled={
                    !codeSent ||
                    codeVerified ||
                    timerTimedOut ||
                    isVerifyingCode
                  }
                  rightElement={
                    codeSent && !codeVerified && !timerTimedOut ? (
                      <span className="text-error text-sm font-medium">
                        {timerFormatted}
                      </span>
                    ) : undefined
                  }
                />
              </div>
              <Button
                variant="outline"
                size="md"
                onClick={onVerifyCode}
                loading={isVerifyingCode}
                disabled={
                  code.length !== 6 ||
                  !codeSent ||
                  codeVerified ||
                  timerTimedOut
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
            onClick={onConfirmRestore}
            loading={isRestoring}
            disabled={!codeVerified}
          >
            확인
          </Button>
        </div>
      </Modal>
    </>
  )
}
