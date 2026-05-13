import { Suspense } from 'react'
import { useParams, Navigate } from 'react-router'
import { Spinner } from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'
import { QuizResultErrorBoundary } from '@/components/quiz/result/QuizResultErrorBoundary'
import { QuizResultContent } from '@/components/quiz/result/QuizResultContent'

export function QuizResultPage() {
  const { submissionId: submissionIdParam } = useParams<{
    submissionId?: string
  }>()
  const submissionId = Number(submissionIdParam)

  if (!Number.isInteger(submissionId) || submissionId <= 0) {
    return <Navigate to={ROUTES.MYPAGE.QUIZ} replace />
  }

  return (
    <QuizResultErrorBoundary>
      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-white">
            <Spinner />
          </div>
        }
      >
        <QuizResultContent submissionId={submissionId} />
      </Suspense>
    </QuizResultErrorBoundary>
  )
}
