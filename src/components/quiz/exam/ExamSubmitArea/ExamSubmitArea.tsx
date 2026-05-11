import { Button } from '@/components/common/Button'

interface ExamSubmitAreaProps {
  disabled: boolean
  loading: boolean
  onSubmit: () => void
}

export function ExamSubmitArea({
  disabled,
  loading,
  onSubmit,
}: ExamSubmitAreaProps) {
  return (
    <div className="mt-30 flex justify-center">
      <Button
        variant="primary"
        size="lg"
        disabled={disabled}
        loading={loading}
        onClick={onSubmit}
      >
        제출하기
      </Button>
    </div>
  )
}
