import { Suspense } from 'react'
import { useParams, useLocation, Navigate } from 'react-router'
import { Spinner } from '@/components/common/Spinner'
import { ExamContent } from './exam/ExamContent'
import { ROUTES } from '@/constants/routes'

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
