import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Modal } from '@/components/common/Modal'
import { Input } from '@/components/common/Input'
import { Button } from '@/components/common/Button'
import { ExamThumbnail } from '@/components/quiz/list/ExamThumbnail'
import { ROUTES } from '@/constants/routes'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { useCheckCode } from '@/features/exams/deployment-check-code'
import { useToastStore } from '@/stores/toastStore'
import { getErrorDetail } from '@/utils/getErrorDetail'
import { getErrorStatus } from '@/utils/getErrorStatus'

const BASE62_REGEX = /^[0-9a-zA-Z]{6}$/

// 401은 axios 인터셉터가 토큰 갱신 후 로그인 리다이렉트 처리
const TOAST_ERROR_MESSAGES: Partial<Record<number, string>> = {
  [HTTP_STATUS.FORBIDDEN]: '시험에 응시할 권한이 없습니다.',
  [HTTP_STATUS.NOT_FOUND]: '배포 정보를 찾을 수 없습니다.',
  [HTTP_STATUS.LOCKED]: '아직 응시할 수 없습니다.',
}

interface QuizCodeModalProps {
  isOpen: boolean
  onClose: () => void
  deploymentId: number
  examTitle: string
  thumbnailUrl: string
  questionCount: number
  durationTime: number
}

export function QuizCodeModal({
  isOpen,
  onClose,
  deploymentId,
  examTitle,
  thumbnailUrl,
  questionCount,
  durationTime,
}: QuizCodeModalProps) {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.show)
  const [code, setCode] = useState('')
  const [inputError, setInputError] = useState<string | null>(null)

  const { mutate, isPending } = useCheckCode(deploymentId)

  const handleClose = () => {
    setCode('')
    setInputError(null)
    onClose()
  }

  const handleSubmit = () => {
    if (!code.trim()) {
      setInputError('참가 코드를 입력해주세요.')
      return
    }

    if (!BASE62_REGEX.test(code)) {
      setInputError('6자리 영문/숫자 코드를 입력해주세요.')
      return
    }

    mutate(
      { code },
      {
        onSuccess: () => {
          navigate(ROUTES.QUIZ.EXAM.replace(':quizId', String(deploymentId)), {
            state: { fromCode: true },
          })
        },
        onError: (error) => {
          const status = getErrorStatus(error)
          const errorDetail = getErrorDetail(error)

          if (status === HTTP_STATUS.BAD_REQUEST) {
            setInputError(errorDetail ?? '응시 코드가 일치하지 않습니다.')
            return
          }

          const toastMessage =
            (status !== undefined ? TOAST_ERROR_MESSAGES[status] : undefined) ??
            errorDetail ??
            '서버 오류가 발생했습니다.'

          showToast(toastMessage, 'error')
        },
      }
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} maxWidth="max-w-sm">
      {/* 시험 정보 */}
      <div className="mb-8 flex flex-col items-center gap-4">
        <ExamThumbnail src={thumbnailUrl} alt={examTitle} />
        <div className="flex flex-col items-center gap-1">
          <span className="text-text-heading text-lg leading-[140%] font-semibold tracking-[-0.03em]">
            {examTitle}
          </span>
          <span className="text-sm leading-[140%] tracking-[-0.03em] text-gray-700">
            총 {questionCount}문항 ·{' '}
            <span className="text-primary">제한시간 {durationTime}분</span>
          </span>
        </div>
      </div>

      {/* 참가코드 입력 */}
      <div className="flex flex-col gap-6">
        <Input
          label="참가 코드입력"
          placeholder="6자리를 입력해주세요"
          maxLength={6}
          value={code}
          isError={!!inputError}
          errorMessage={inputError ?? undefined}
          onChange={(e) => {
            setCode(e.target.value)
            if (inputError) setInputError(null)
          }}
        />
        <Button
          variant="primary"
          size="md"
          fullWidth
          loading={isPending}
          onClick={handleSubmit}
        >
          시험시작
        </Button>
      </div>
    </Modal>
  )
}
