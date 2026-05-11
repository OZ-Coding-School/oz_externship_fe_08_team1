import { Suspense } from 'react'
import { useParams, useLocation, Navigate } from 'react-router'
import { Spinner } from '@/components/common/Spinner'
import { ExamContent } from './exam/ExamContent'
import { ROUTES } from '@/constants/routes'

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
