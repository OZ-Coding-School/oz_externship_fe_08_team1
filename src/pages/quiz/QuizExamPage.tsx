import { Suspense, useState, useRef, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import { useParams, useNavigate, Navigate } from 'react-router'
import axios from 'axios'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { ExamHeader } from '@/components/quiz/ExamHeader'
import { CheatingWarningModal } from '@/components/quiz/CheatingWarningModal'
import { ExamSubmitModal } from '@/components/quiz/ExamSubmitModal'
import { QuestionCard } from '@/components/quiz/QuestionCard'
import { useDeploymentDetail } from '@/features/exams/deployment-detail'
import { useSubmitExam } from '@/features/exams/submissions'
import { useExamTimer } from '@/hooks/useExamTimer'
import { useCheatingDetector } from '@/hooks/useCheatingDetector'
import { useToastStore } from '@/stores/toastStore'
import { HTTP_STATUS } from '@/constants/httpStatus'
import type { Question } from '@/features/exams/deployment-detail'
import type { SubmissionAnswer } from '@/features/exams/submissions'

interface ApiErrorBody {
  error_detail?: string
}

const ERROR_MAP: Record<number, { fallback: string; redirect?: string }> = {
  [HTTP_STATUS.BAD_REQUEST]: {
    fallback: '유효하지 않은 시험 응시 세션입니다.',
    redirect: '/mypage/quiz',
  },
  [HTTP_STATUS.UNAUTHORIZED]: {
    fallback: '로그인이 필요합니다.',
    redirect: '/auth/login',
  },
  [HTTP_STATUS.FORBIDDEN]: {
    fallback: '권한이 없습니다.',
    redirect: '/mypage/quiz',
  },
  [HTTP_STATUS.NOT_FOUND]: {
    fallback: '해당 시험 정보를 찾을 수 없습니다.',
    redirect: '/mypage/quiz',
  },
  [HTTP_STATUS.CONFLICT]: { fallback: '이미 제출된 시험입니다.' },
  [HTTP_STATUS.GONE]: {
    fallback: '시험이 종료되었습니다.',
    redirect: '/mypage/quiz',
  },
}

function initAnswers(questions: Question[]): Record<number, string | string[]> {
  const map: Record<number, string | string[]> = {}
  for (const q of questions) {
    if (
      q.type === 'single_choice' ||
      q.type === 'ox' ||
      q.type === 'short_answer'
    ) {
      map[q.question_id] =
        typeof q.answer_input === 'string' ? q.answer_input : ''
    } else if (q.type === 'multiple_choice') {
      map[q.question_id] = Array.isArray(q.answer_input) ? q.answer_input : []
    } else if (q.type === 'ordering') {
      map[q.question_id] = Array.isArray(q.answer_input) ? q.answer_input : []
    } else if (q.type === 'fill_blank') {
      map[q.question_id] = Array.isArray(q.answer_input)
        ? q.answer_input
        : Array<string>(q.blank_count ?? 0).fill('')
    }
  }
  return map
}

function isAnswered(q: Question, answer: string | string[]): boolean {
  if (q.type === 'ordering') {
    const ans = answer as string[]
    return ans.length === (q.options?.length ?? 0) && ans.every((a) => a !== '')
  }
  if (Array.isArray(answer))
    return answer.length > 0 && answer.every((a) => a !== '')
  return (answer as string).trim() !== ''
}

interface ExamContentProps {
  deploymentId: number
}

function AlertCircleIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className="text-error shrink-0"
    >
      <circle cx="12" cy="12" r="10" fill="currentColor" />
      <path d="M12 7v6" stroke="white" strokeWidth="2" strokeLinecap="round" />
      <circle cx="12" cy="16.5" r="1" fill="white" />
    </svg>
  )
}

function ExamContent({ deploymentId }: ExamContentProps) {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.show)

  const { data } = useDeploymentDetail(deploymentId)
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam()

  const { exam_title, duration_time, elapsed_time, cheating_count, questions } =
    data

  const [answers, setAnswers] = useState<Record<number, string | string[]>>(
    () => initAnswers(questions)
  )
  const [showWarningBanner, setShowWarningBanner] = useState(true)
  const [warningModalCount, setWarningModalCount] = useState(0)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitRedirectUrl, setSubmitRedirectUrl] = useState<string | null>(
    null
  )
  // 사용자 제스처(버튼 클릭) 이후 fullscreen 진입 및 시험 시작 상태
  const startedAt = useRef(new Date().toISOString().slice(0, 19))

  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {})
    return () => {
      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }
    }
  }, [])

  const allAnswered = questions.every((q) =>
    isAnswered(q, answers[q.question_id])
  )

  const buildSubmissionAnswers = useCallback(
    (currentAnswers: Record<number, string | string[]>): SubmissionAnswer[] =>
      questions.map((q) => ({
        question_id: q.question_id,
        type: q.type,
        submitted_answer: currentAnswers[q.question_id] ?? '',
      })),
    [questions]
  )

  const handleSubmit = useCallback(
    (
      currentAnswers: Record<number, string | string[]>,
      currentCheating: number,
      onSuccess?: (redirectUrl: string) => void
    ) => {
      if (isSubmitted) return
      setIsSubmitted(true)

      submitExam(
        {
          deployment_id: deploymentId,
          started_at: startedAt.current,
          cheating_count: currentCheating,
          answers: buildSubmissionAnswers(currentAnswers),
        },
        {
          onSuccess: (res) => {
            if (onSuccess) {
              onSuccess(res.redirect_url)
            } else {
              setSubmitRedirectUrl(res.redirect_url)
            }
          },
          onError: (error) => {
            setIsSubmitted(false)
            if (!axios.isAxiosError(error)) return

            const status = error.response?.status
            const detail = (error.response?.data as ApiErrorBody | undefined)
              ?.error_detail
            const config = status ? ERROR_MAP[status] : undefined
            showToast(
              detail ?? config?.fallback ?? '서버 오류가 발생했습니다.',
              'error'
            )
            if (config?.redirect) navigate(config.redirect)
          },
        }
      )
    },
    [
      isSubmitted,
      deploymentId,
      navigate,
      showToast,
      submitExam,
      buildSubmissionAnswers,
    ]
  )

  const { cheatingCount } = useCheatingDetector({
    initialCount: cheating_count,
    onDetect: (count) => setWarningModalCount(count),
    enabled: !isSubmitted,
  })

  const handleTimerExpire = useCallback(() => {
    handleSubmit(answers, cheatingCount, (url) =>
      navigate(url, { replace: true })
    )
  }, [answers, cheatingCount, handleSubmit, navigate])

  const { formattedTime, remainingSeconds } = useExamTimer({
    initialSeconds: duration_time * 60 - elapsed_time,
    onExpire: handleTimerExpire,
  })

  const handleWarningConfirm = useCallback(() => {
    setWarningModalCount(0)
    if (cheatingCount >= 3) {
      handleSubmit(answers, cheatingCount, (url) =>
        navigate(url, { replace: true })
      )
    } else {
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [answers, cheatingCount, handleSubmit, navigate])

  const handleAnswerChange = useCallback(
    (questionId: number, answer: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    },
    []
  )

  const handleBack = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {})
    }
    navigate('/mypage/quiz')
  }, [navigate])

  return (
    <div className="min-h-screen bg-white">
      <ExamHeader
        examTitle={exam_title}
        formattedTime={formattedTime}
        remainingSeconds={remainingSeconds}
        cheatingCount={cheatingCount}
        onBack={handleBack}
      />

      {/* 헤더 높이(128px) + 여백 보정 */}
      <main className="max-w-container mx-auto px-6 pt-[160px] pb-24">
        {/* 부정행위 안내 배너 */}
        {showWarningBanner && (
          <div className="bg-primary-100 mb-6 rounded-lg px-6 py-5">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 shrink-0">
                  <AlertCircleIcon />
                </span>
                <div className="flex flex-col gap-5">
                  <p className="text-lg leading-normal font-semibold tracking-[-0.03em] text-gray-900">
                    시험에만 집중해 주세요
                  </p>
                  <p className="text-base leading-normal tracking-[-0.03em] text-gray-900">
                    탭이나 창을 이동하면 부정행위로 처리돼 시험이 중단될 수
                    있어요. 안정적인 환경에서 시험을 이어가 주세요.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowWarningBanner(false)}
                aria-label="배너 닫기"
                className="shrink-0 text-gray-900 transition-opacity hover:opacity-60"
              >
                <X size={24} aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* 문제 목록 */}
        <div className="flex flex-col gap-30">
          {questions.map((q) => (
            <QuestionCard
              key={q.question_id}
              question={q}
              answer={answers[q.question_id]}
              onChange={(ans) => handleAnswerChange(q.question_id, ans)}
            />
          ))}
        </div>

        {/* 제출 버튼 */}
        <div className="mt-30 flex justify-center">
          <Button
            variant="primary"
            size="lg"
            disabled={!allAnswered || isSubmitted}
            loading={isSubmitting}
            onClick={() => handleSubmit(answers, cheatingCount)}
          >
            제출하기
          </Button>
        </div>
      </main>

      {/* 부정행위 경고 모달 */}
      <CheatingWarningModal
        count={warningModalCount}
        isOpen={warningModalCount > 0}
        onConfirm={handleWarningConfirm}
        onClose={() => setWarningModalCount(0)}
      />

      {/* 제출 완료 모달 */}
      <ExamSubmitModal
        isOpen={submitRedirectUrl !== null}
        onConfirm={() => {
          if (submitRedirectUrl) navigate(submitRedirectUrl, { replace: true })
        }}
      />
    </div>
  )
}

/**
 * @figma 쪽지시험_응시하기  https://www.figma.com/design/zTej1hAEgfChWzZhByThtt/%EC%9D%B5%EC%8A%A4%ED%84%B4%EC%8B%AD-%EC%AA%BD%EC%A7%80%EC%8B%9C%ED%97%98?node-id=1-710
 */
export function QuizExamPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const deploymentId = Number(quizId)

  if (!quizId || Number.isNaN(deploymentId)) {
    return <Navigate to="/mypage/quiz" replace />
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner />
        </div>
      }
    >
      <ExamContent deploymentId={deploymentId} />
    </Suspense>
  )
}
