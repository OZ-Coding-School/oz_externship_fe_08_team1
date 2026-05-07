import { useState } from 'react'
import { Modal, Dropdown, Button } from '@/components'
import { useWithdraw, WITHDRAW_REASONS } from '@/features/accounts/me'
import type { WithdrawReason } from '@/features/accounts/me'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const withdraw = useWithdraw()

  const [reason, setReason] = useState<WithdrawReason | ''>('')
  const [reasonDetail, setReasonDetail] = useState('')
  const [error, setError] = useState('')

  function handleClose() {
    setReason('')
    setReasonDetail('')
    setError('')
    onClose()
  }

  function handleWithdraw() {
    if (!reason) return
    setError('')
    withdraw.mutate(
      {
        reason,
        reason_detail: reasonDetail || undefined,
      },
      {
        onSuccess: () => {
          localStorage.removeItem('accessToken')
          useAuthStore.getState().logout()
          window.location.href = ROUTES.AUTH.LOGIN
        },
        onError: () => {
          setError('회원 탈퇴에 실패했습니다. 다시 시도해주세요.')
        },
      }
    )
  }

  const showAdditionalFeedback = reason !== '' && reason !== 'OTHER'

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[520px]"
      title="오즈코딩스쿨을 탈퇴하시는 이유는 무엇인가요?"
      description="계정을 삭제하시면 회원님의 모든 콘텐츠와 활동 기록, 수강 기간 / 포인트 / 쿠폰 내역이 사라지며 복구할 수 없습니다."
    >
      {/* 탈퇴 사유 드롭다운 */}
      <div>
        <Dropdown
          options={[...WITHDRAW_REASONS]}
          value={reason}
          onChange={(value) => {
            setReason(value as WithdrawReason)
            setError('')
            if (value === 'OTHER') {
              setReasonDetail('')
            }
          }}
          placeholder="해당되는 항목을 선택해 주세요."
          freeInputValue="OTHER"
          freeInputText={reason === 'OTHER' ? reasonDetail : undefined}
          onFreeInputChange={
            reason === 'OTHER' ? (text) => setReasonDetail(text) : undefined
          }
          freeInputPlaceholder="탈퇴 사유를 입력해주세요."
          freeInputMaxLength={100}
        />
      </div>

      {/* 추가 의견 텍스트영역 (OTHER가 아닌 사유 선택 시) */}
      {showAdditionalFeedback && (
        <div className="mt-4">
          <p className="mb-2 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-900">
            서비스를 이용하시면서 불편했던 점이나 보완할 수 있는 방안을
            알려주시면, 서비스 개선에 적극적으로 반영하겠습니다. 감사합니다!
          </p>
          <div className="rounded-sm border border-gray-400 transition-colors duration-150 focus-within:border-gray-500">
            <textarea
              aria-label="추가 의견"
              value={reasonDetail}
              onChange={(e) => setReasonDetail(e.target.value)}
              placeholder="소중한 의견을 반영해 더 좋은 서비스를 위해 노력하겠습니다."
              rows={4}
              className="w-full resize-none bg-transparent px-4 py-3 text-sm leading-relaxed tracking-tight text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>
      )}

      {/* 에러 메시지 */}
      {error && <p className="text-error mt-2 text-xs">*{error}</p>}

      {/* 회원 탈퇴하기 버튼 */}
      <Button
        variant="primary"
        fullWidth
        size="md"
        onClick={handleWithdraw}
        loading={withdraw.isPending}
        disabled={!reason}
        className="mt-6"
      >
        회원 탈퇴하기
      </Button>
    </Modal>
  )
}
