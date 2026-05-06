import { TriangleAlert } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'

interface AdminClosedModalProps {
  isOpen: boolean
  onConfirm: () => void
}

export function AdminClosedModal({ isOpen, onConfirm }: AdminClosedModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onConfirm}
      maxWidth="max-w-md"
      hideCloseButton
    >
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <div className="bg-error-bg flex h-[60px] w-[60px] items-center justify-center rounded-full">
          <TriangleAlert
            size={38}
            className="text-error stroke-error-bg"
            fill="currentColor"
            aria-hidden="true"
            strokeWidth={1.5}
          />
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="text-text-heading text-xl leading-normal font-semibold tracking-[-0.03em]">
            관리자에 의해 시험이 <span className="text-error">종료</span>{' '}
            되었습니다
          </h3>
          <div className="text-text-body flex flex-col text-base leading-normal">
            <p>관리자에 의해 쪽지시험이 비공개 및 종료 되었습니다.</p>
            <p>진행 중이던 답안은 저장되지 않으며 결과에 반영되지 않습니다.</p>
            <p>쪽지시험 리스트 페이지로 이동합니다.</p>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={onConfirm}>
          확인
        </Button>
      </div>
    </Modal>
  )
}
