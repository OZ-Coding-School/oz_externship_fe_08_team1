import { QuestionCard } from '@/components/quiz/exam/QuestionCard'
import type { Question } from '@/features/exams/deployment-detail'

interface QuestionListProps {
  questions: Question[]
  answers: Record<number, string | string[]>
  onAnswerChange: (questionId: number, answer: string | string[]) => void
}

export function QuestionList({
  questions,
  answers,
  onAnswerChange,
}: QuestionListProps) {
  return (
    <div className="flex flex-col gap-30">
      {questions.map((q) => (
        <QuestionCard
          key={q.question_id}
          question={q}
          answer={answers[q.question_id]}
          onChange={(ans) => onAnswerChange(q.question_id, ans)}
        />
      ))}
    </div>
  )
}
