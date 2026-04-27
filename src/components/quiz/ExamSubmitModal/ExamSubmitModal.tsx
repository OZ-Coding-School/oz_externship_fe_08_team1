import { Check } from 'lucide-react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'

interface ExamSubmitModalProps {
  isOpen: boolean
  onConfirm: () => void
}

export function ExamSubmitModal({ isOpen, onConfirm }: ExamSubmitModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onConfirm} maxWidth="max-w-md">
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        {/* 아이콘 */}
        <div className="bg-success flex h-20 w-20 items-center justify-center rounded-full">
          <Check size={40} stroke="white" aria-hidden="true" />
        </div>

        {/* 타이틀 */}
        <div className="flex flex-col gap-3">
          <h3 className="text-text-heading text-xl leading-normal font-semibold tracking-[-0.03em]">
            시험 제출이 <span className="text-success">완료</span> 되었습니다
          </h3>
          <div className="text-text-body flex flex-col text-base leading-normal">
            <p>시험이 종료 되었습니다</p>
            <p>시험 제출이 완료 되었습니다!</p>
            <p>정답 확인 페이지로 넘어갑니다.</p>
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={onConfirm}>
          확인
        </Button>
      </div>
    </Modal>
  )
}
