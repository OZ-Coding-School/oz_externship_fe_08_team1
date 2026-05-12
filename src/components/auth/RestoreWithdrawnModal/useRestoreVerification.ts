import { useState, useCallback } from 'react'
import axios from 'axios'
import { useRestoreAccount } from '@/features/accounts/restore'
import { useToastStore } from '@/stores/toastStore'
import { useRecoveryEmailCodeFlow } from './useRecoveryEmailCodeFlow'
import type { UseRecoveryEmailCodeFlowReturn } from './useRecoveryEmailCodeFlow'

export interface UseRestoreVerificationReturn extends UseRecoveryEmailCodeFlowReturn {
  showSuccess: boolean
  isRestoring: boolean
  onConfirmRestore: () => void
  onNavigateToLogin: () => void
}

interface UseRestoreVerificationProps {
  isOpen: boolean
  onClose: () => void
  onRestored: () => void
  initialEmail?: string
}

export function useRestoreVerification({
  isOpen,
  onClose,
  onRestored,
  initialEmail = '',
}: UseRestoreVerificationProps): UseRestoreVerificationReturn {
  const showToast = useToastStore((s) => s.show)
  const restoreAccount = useRestoreAccount()
  const [showSuccess, setShowSuccess] = useState(false)

  const emailCodeFlow = useRecoveryEmailCodeFlow({ isOpen, initialEmail })

  const onNavigateToLogin = useCallback(() => {
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
    onNavigateToLogin,
  }
}
