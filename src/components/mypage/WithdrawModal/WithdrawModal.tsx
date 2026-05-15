import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'
import { Modal, Dropdown, Button } from '@/components'
import { PasswordInput } from '@/components/common/PasswordInput'
import { useWithdraw, WITHDRAW_REASONS } from '@/features/accounts/me'
import type { WithdrawReason } from '@/features/accounts/me'
import { useAuthStore } from '@/stores/authStore'
import { ROUTES } from '@/constants/routes'

interface WithdrawModalProps {
  isOpen: boolean
  onClose: () => void
}

export function WithdrawModal({ isOpen, onClose }: WithdrawModalProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const withdraw = useWithdraw()

  const [reason, setReason] = useState<WithdrawReason | ''>('')
  const [reasonDetail, setReasonDetail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isConfirming, setIsConfirming] = useState(false)

  function handleClose() {
    setReason('')
    setReasonDetail('')
    setPassword('')
    setError('')
    setIsConfirming(false)
    onClose()
  }

  function handleWithdrawClick() {
    setIsConfirming(true)
  }

  function handleWithdrawConfirm() {
    if (!reason || !password) return
    setError('')
    withdraw.mutate(
      { password, reason: reason as WithdrawReason },
      {
        onSuccess: () => {
          useAuthStore.getState().logout()
          navigate(ROUTES.AUTH.LOGIN)
          queryClient.clear()
        },
        onError: () => {
          setError('회원 탈퇴에 실패했습니다. 다시 시도해주세요.')
          setIsConfirming(false)
        },
      }
    )
  }

  const showAdditionalFeedback = reason !== ''

  if (isConfirming) {
    return (
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        maxWidth="max-w-[520px]"
        title="정말 탈퇴하시겠습니까?"
        description="탈퇴 후에는 모든 데이터가 삭제되며 복구할 수 없습니다."
        bodyClassName="overflow-visible min-h-[380px] flex flex-col pt-8"
      >
        <div className="mt-2">
          <PasswordInput
            aria-label="비밀번호 확인"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
          />
        </div>

        {error && <p className="text-error mt-2 text-xs">*{error}</p>}

        <div className="mt-auto flex gap-3">
          <Button
            variant="secondary"
            fullWidth
            size="md"
            onClick={() => setIsConfirming(false)}
            disabled={withdraw.isPending}
          >
            취소
          </Button>
          <Button
            variant="danger"
            fullWidth
            size="md"
            onClick={handleWithdrawConfirm}
            loading={withdraw.isPending}
            disabled={!password}
          >
            최종 탈퇴
          </Button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="max-w-[520px]"
      title="오즈코딩스쿨을 탈퇴하시는 이유는 무엇인가요?"
      description="계정을 삭제하시면 회원님의 모든 콘텐츠와 활동 기록, 수강 기간 / 포인트 / 쿠폰 내역이 사라지며 복구할 수 없습니다."
      bodyClassName="overflow-visible min-h-[380px] flex flex-col pt-8"
    >
      {/* 탈퇴 사유 드롭다운 */}
      <div className="w-full">
        <Dropdown
          className="w-[60%]"
          options={WITHDRAW_REASONS}
          value={reason}
          onChange={(value) => {
            setReason(value as WithdrawReason)
            setError('')
          }}
        />
      </div>

      {/* 추가 의견 텍스트영역 (사유 선택 시) */}
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
        onClick={handleWithdrawClick}
        disabled={!reason || !reasonDetail.trim()}
        className="mt-auto"
      >
        회원 탈퇴하기
      </Button>
    </Modal>
  )
}
