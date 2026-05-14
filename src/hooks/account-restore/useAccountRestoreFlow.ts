import { useState, useCallback } from 'react'
import axios from 'axios'
import { useRestoreAccount } from '@/features/accounts/restore'
import { useToastStore } from '@/stores/toastStore'
import { useRecoveryEmailCodeFlow } from '@/hooks/account-restore/useRecoveryEmailCodeFlow'
import type { UseRecoveryEmailCodeFlowReturn } from '@/hooks/account-restore/useRecoveryEmailCodeFlow'

export interface UseAccountRestoreFlowReturn extends UseRecoveryEmailCodeFlowReturn {
  showSuccess: boolean
  isRestoring: boolean
  onConfirmRestore: () => void
  finishRestoreFlow: () => void
}

interface UseRestoreVerificationProps {
  isOpen: boolean
  onClose: () => void
  onRestored: () => void
  initialEmail?: string
}

export function useAccountRestoreFlow({
  isOpen,
  onClose,
  onRestored,
  initialEmail = '',
}: UseRestoreVerificationProps): UseAccountRestoreFlowReturn {
  const showToast = useToastStore((s) => s.show)
  const restoreAccount = useRestoreAccount()
  const [showSuccess, setShowSuccess] = useState(false)

  const emailCodeFlow = useRecoveryEmailCodeFlow({ isOpen, initialEmail })

  const finishRestoreFlow = useCallback(() => {
    onClose()
    onRestored()
  }, [onClose, onRestored])

  function onConfirmRestore() {
    if (!emailCodeFlow.emailToken) return
    restoreAccount.mutate(
      { email_token: emailCodeFlow.emailToken },
      {
        onSuccess: () => setShowSuccess(true),
        onError: (err) => {
          if (axios.isAxiosError(err)) {
            const status = err.response?.status
            if (status === 400 || status === 401) {
              emailCodeFlow.markTokenExpired()
              return
            }
          }
          showToast('계정 복구에 실패했습니다. 다시 시도해주세요.', 'error')
        },
      }
    )
  }

  return {
    ...emailCodeFlow,
    showSuccess,
    isRestoring: restoreAccount.isPending,
    onConfirmRestore,
    finishRestoreFlow,
  }
}
