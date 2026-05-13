import { useNavigate } from 'react-router'
import { Button } from '@/components/common/Button'
import { useSubmissionDetail } from '@/features/exams/submission-detail'
import { ROUTES } from '@/constants/routes'
import { ResultQuestionCard } from '@/components/quiz/result/ResultQuestionCard'
import { ResultHeader } from '@/components/quiz/result/ResultHeader'

interface QuizResultContentProps {
  submissionId: number
}

export function QuizResultContent({ submissionId }: QuizResultContentProps) {
  const navigate = useNavigate()
  const { data } = useSubmissionDetail(submissionId)
  const { exam, questions, cheating_count, score, total_score, elapsed_time } =
    data

  return (
    <div className="min-h-screen bg-white">
      <ResultHeader
        examTitle={exam.title}
        totalQuestions={questions.length}
        cheatingCount={cheating_count}
        elapsedTime={elapsed_time}
        score={score}
        totalScore={total_score}
        onBack={() => navigate(ROUTES.MYPAGE.QUIZ)}
      />

      <div className="bg-primary-100">
        <div className="max-w-container mx-auto px-6 py-8">
          <h1 className="text-2xl font-bold tracking-[-0.03em] text-gray-900">
            쪽지시험 응시 결과
          </h1>
          <p className="mt-2 text-sm leading-[140%] tracking-[-0.03em] text-gray-600">
            고생 많으셨어요😊 틀린 문제는 해설을 보며 꼭 복습해보세요. 앞으로의
            성장을 기대하겠습니다!
          </p>
        </div>
      </div>

      <main className="max-w-container mx-auto px-6 py-10">
        <div className="flex flex-col gap-[100px]">
          {questions.map((q, i) => (
            <ResultQuestionCard key={q.id} question={q} index={i} />
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button
            variant="primary"
            size="md"
            className="px-12"
            onClick={() => navigate(ROUTES.MYPAGE.QUIZ)}
          >
            완료
          </Button>
        </div>
      </main>
    </div>
  )
}
