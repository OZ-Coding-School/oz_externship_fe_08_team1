import { useState } from 'react'
import { RestoreModal } from '@/components'
import { MehFaceIcon } from './icons'
import { VerificationStep } from './VerificationStep'

export interface RestoreWithdrawnModalProps {
  isOpen: boolean
  onClose: () => void
  onRestored: () => void
  initialEmail?: string
  expireAt?: string
}

export function RestoreWithdrawnModal({
  isOpen,
  onClose,
  onRestored,
  initialEmail = '',
  expireAt,
}: RestoreWithdrawnModalProps) {
  const [step, setStep] = useState<'status' | 'verification'>('status')

  const handleClose = () => {
    setStep('status')
    onClose()
  }

  const description = expireAt
    ? `${new Date(expireAt).toLocaleDateString('ko-KR')} 이후, 계정 정보는 완전히 삭제돼요.\n계정을 다시 사용하시려면 아래 버튼을 눌러 복구를 진행해주세요.`
    : `계정을 다시 사용하시려면 아래 버튼을 눌러 복구를 진행해주세요.`

  return (
    <>
      {/* Step 1: 탈퇴 상태 안내 */}
      {step === 'status' && (
        <RestoreModal
          isOpen={isOpen}
          onClose={handleClose}
          icon={<MehFaceIcon className="text-primary" />}
          title="해당 계정은 탈퇴된 상태에요"
          description={description}
          onRestore={() => setStep('verification')}
        />
      )}

      {/* Step 2: 이메일 인증 — mount/unmount로 훅 생명주기 자동 관리 */}
      {step === 'verification' && (
        <VerificationStep
          isOpen={isOpen}
          onClose={handleClose}
          onRestored={onRestored}
          initialEmail={initialEmail}
        />
      )}
    </>
  )
}
