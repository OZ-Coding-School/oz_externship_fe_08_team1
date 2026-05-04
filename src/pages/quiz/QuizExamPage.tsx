import { Suspense, useState, useRef, useCallback, useEffect } from 'react'
import { X, AlertCircle, Check } from 'lucide-react'
import { useParams, useNavigate, useLocation, Navigate } from 'react-router'
import { Button } from '@/components/common/Button'
import { Spinner } from '@/components/common/Spinner'
import { Modal } from '@/components/common/Modal'
import { ExamHeader } from '@/components/quiz/exam/ExamHeader'
import { CheatingWarningModal } from '@/components/quiz/exam/CheatingWarningModal'
import { AdminClosedModal } from '@/components/quiz/exam/AdminClosedModal'
import { QuestionCard } from '@/components/quiz/exam/QuestionCard'
import { useDeploymentDetail } from '@/features/exams/deployment-detail'
import { useSubmitExam } from '@/features/exams/submissions'
import { useExamTimer } from '@/hooks/useExamTimer'
import { useCheatingDetector } from '@/hooks/useCheatingDetector'
import { useExamStatusPoller } from '@/hooks/useExamStatusPoller'
import { useToastStore } from '@/stores/toastStore'
import { ROUTES } from '@/constants/routes'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { getErrorDetail } from '@/utils/getErrorDetail'
import { getErrorStatus } from '@/utils/getErrorStatus'
import { initAnswers, isAnswered } from './examUtils'
import type { SubmissionAnswer } from '@/features/exams/submissions'

const ERROR_MAP: Record<number, { fallback: string; redirect?: string }> = {
  [HTTP_STATUS.BAD_REQUEST]: {
    fallback: '유효하지 않은 시험 응시 세션입니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
  [HTTP_STATUS.UNAUTHORIZED]: {
    fallback: '로그인이 필요합니다.',
    redirect: ROUTES.AUTH.LOGIN,
  },
  [HTTP_STATUS.FORBIDDEN]: {
    fallback: '권한이 없습니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
  [HTTP_STATUS.NOT_FOUND]: {
    fallback: '해당 시험 정보를 찾을 수 없습니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
  [HTTP_STATUS.CONFLICT]: { fallback: '이미 제출된 시험입니다.' },
  [HTTP_STATUS.GONE]: {
    fallback: '시험이 종료되었습니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
}

interface ExamContentProps {
  deploymentId: number
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
  const [isAdminClosed, setIsAdminClosed] = useState(false)
  const [submitRedirectUrl, setSubmitRedirectUrl] = useState<string | null>(
    null
  )

  const isExamActive = !isSubmitted && !isAdminClosed

  useExamStatusPoller(deploymentId, isExamActive, setIsAdminClosed)

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
            const detail = getErrorDetail(error)
            const status = getErrorStatus(error)
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
    enabled: isExamActive,
  })

  const handleTimerExpire = useCallback(() => {
    handleSubmit(answers, cheatingCount, (url) =>
      navigate(url, { replace: true })
    )
  }, [answers, cheatingCount, handleSubmit, navigate])

  const { remainingSeconds } = useExamTimer({
    initialSeconds: duration_time * 60 - elapsed_time,
    enabled: isExamActive,
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
    navigate(ROUTES.MYPAGE.QUIZ)
  }, [navigate])

  return (
    <div className="min-h-screen bg-white">
      <ExamHeader
        examTitle={exam_title}
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
                  <AlertCircle
                    size={24}
                    className="text-error stroke-primary-100"
                    fill="currentColor"
                    aria-hidden="true"
                  />
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

      {/* 관리자 종료 모달 */}
      <AdminClosedModal
        isOpen={isAdminClosed}
        onConfirm={() => navigate(ROUTES.MYPAGE.QUIZ, { replace: true })}
      />

      {/* 제출 완료 모달 */}
      <Modal
        isOpen={submitRedirectUrl !== null}
        onClose={() => {
          if (submitRedirectUrl) navigate(submitRedirectUrl, { replace: true })
        }}
        maxWidth="max-w-md"
      >
        <div className="flex flex-col items-center gap-6 py-4 text-center">
          <div className="bg-success flex h-20 w-20 items-center justify-center rounded-full">
            <Check size={40} stroke="white" aria-hidden="true" />
          </div>
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
          <Button
            variant="primary"
            size="lg"
            fullWidth
            onClick={() => {
              if (submitRedirectUrl)
                navigate(submitRedirectUrl, { replace: true })
            }}
          >
            확인
          </Button>
        </div>
      </Modal>
    </div>
  )
}

/**
 * @figma 쪽지시험_응시하기  https://www.figma.com/design/zTej1hAEgfChWzZhByThtt/%EC%9D%B5%EC%8A%A4%ED%84%B4%EC%8B%AD-%EC%AA%BD%EC%A7%80%EC%8B%9C%ED%97%98?node-id=1-710
 */
export function QuizExamPage() {
  const { quizId } = useParams<{ quizId: string }>()
  const location = useLocation()
  const deploymentId = Number(quizId)

  if (!quizId || Number.isNaN(deploymentId) || deploymentId <= 0) {
    return <Navigate to={ROUTES.MYPAGE.QUIZ} replace />
  }

  if (!location.state?.fromCode) {
    return <Navigate to={ROUTES.MYPAGE.QUIZ} replace />
  }

  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <Spinner />
        </div>
      }
    >
      <ExamContent key={deploymentId} deploymentId={deploymentId} />
    </Suspense>
  )
}
