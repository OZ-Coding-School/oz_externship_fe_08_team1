// 시험 응시 화면의 핵심 컴포넌트.
// 각 도메인 훅(타이머·답안·부정행위·제출·폴링)을 조합해 시험 세션 전체를 조율한다.
import { useState, useCallback, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { ExamHeader } from '@/components/quiz/exam/ExamHeader'
import { ExamWarningBanner } from '@/components/quiz/exam/ExamWarningBanner'
import { QuestionList } from '@/components/quiz/exam/QuestionList'
import { ExamSubmitArea } from '@/components/quiz/exam/ExamSubmitArea'
import { ExamCompletionModal } from '@/components/quiz/exam/ExamCompletionModal'
import { CheatingWarningModal } from '@/components/quiz/exam/CheatingWarningModal'
import { AdminClosedModal } from '@/components/quiz/exam/AdminClosedModal'
import { useDeploymentDetail } from '@/features/exams/deployment-detail'
import { useExamAnswers } from './hooks/useExamAnswers'
import { useExamSubmission } from './hooks/useExamSubmission'
import { useExamCheatingFlow } from './hooks/useExamCheatingFlow'
import { useExamTimer } from './hooks/useExamTimer'
import { useExamStatusPoller } from './hooks/useExamStatusPoller'
import { ROUTES } from '@/constants/routes'

interface ExamContentProps {
  deploymentId: number
}

export function ExamContent({ deploymentId }: ExamContentProps) {
  const navigate = useNavigate()

  const { data } = useDeploymentDetail(deploymentId)
  const { exam_title, duration_time, elapsed_time, cheating_count, questions } =
    data

  const { answers, allAnswered, handleAnswerChange, buildSubmissionAnswers } =
    useExamAnswers({ questions })

  // 관리자가 시험을 강제 종료했을 때 true로 바뀐다
  const [isAdminClosed, setIsAdminClosed] = useState(false)

  const {
    isSubmitted,
    isSubmitting,
    submitRedirectUrl,
    submit,
    closeCompletionModal,
  } = useExamSubmission({
    deploymentId,
    getSubmissionAnswers: buildSubmissionAnswers,
  })

  // 제출 완료 또는 관리자 강제 종료 시 타이머·부정행위 감지·폴링을 모두 중단
  const isExamActive = !isSubmitted && !isAdminClosed

  const { cheatingCount, warningModalCount, confirmWarningModal } =
    useExamCheatingFlow({
      initialCount: cheating_count,
      enabled: isExamActive,
      onLimitExceeded: () => submit('cheating-limit', cheatingCount),
    })

  const { remainingSeconds } = useExamTimer({
    initialSeconds: duration_time * 60 - elapsed_time,
    enabled: isExamActive,
    onExpire: () => submit('timer-expired', cheatingCount),
  })

  useExamStatusPoller(deploymentId, isExamActive, setIsAdminClosed)

  // 시험 시작 시 전체화면 진입, 언마운트 시 전체화면 해제
  useEffect(() => {
    document.documentElement.requestFullscreen().catch(() => {})
    return () => {
      if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
    }
  }, [])

  const handleBack = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
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
      <main className="max-w-container mx-auto px-6 pt-[160px] pb-24">
        <ExamWarningBanner />
        <QuestionList
          questions={questions}
          answers={answers}
          onAnswerChange={handleAnswerChange}
        />
        <ExamSubmitArea
          disabled={!allAnswered || isSubmitted}
          loading={isSubmitting}
          onSubmit={() => submit('button', cheatingCount)}
        />
      </main>
      <CheatingWarningModal
        count={warningModalCount}
        isOpen={warningModalCount > 0}
        onConfirm={confirmWarningModal}
        onClose={confirmWarningModal}
      />
      <AdminClosedModal
        isOpen={isAdminClosed}
        onConfirm={() => navigate(ROUTES.MYPAGE.QUIZ, { replace: true })}
      />
      <ExamCompletionModal
        isOpen={submitRedirectUrl !== null}
        onConfirm={closeCompletionModal}
        onClose={closeCompletionModal}
      />
    </div>
  )
}
