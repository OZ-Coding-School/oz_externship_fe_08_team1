// 시험 답안 상태를 관리하는 훅.
// answers: UI에 바인딩되는 상태값
// buildSubmissionAnswers는 이벤트 핸들러에서만 호출되므로 stale closure 문제 X
import { useState, useCallback } from 'react'
import type { Question } from '@/features/exams/deployment-detail'
import type { SubmissionAnswer } from '@/features/exams/submissions'
import { initAnswers, isAnswered } from '../examUtils'

interface UseExamAnswersOptions {
  questions: Question[]
}

interface UseExamAnswersResult {
  answers: Record<number, string | string[]>
  allAnswered: boolean
  handleAnswerChange: (questionId: number, answer: string | string[]) => void
  buildSubmissionAnswers: () => SubmissionAnswer[]
}

export function useExamAnswers({
  questions,
}: UseExamAnswersOptions): UseExamAnswersResult {
  // 시험 답변 상태 초기화
  const [answers, setAnswers] = useState<Record<number, string | string[]>>(
    () => initAnswers(questions)
  )

  // 모든 답변이 완료되었는지 확인
  const allAnswered = questions.every((q) =>
    isAnswered(q, answers[q.question_id])
  )

  // 제출할 답변 생성
  const buildSubmissionAnswers = useCallback(
    (): SubmissionAnswer[] =>
      questions.map((q) => ({
        question_id: q.question_id,
        type: q.type,
        submitted_answer: answers[q.question_id] ?? '',
      })),
    [questions, answers]
  )

  // 답변 변경 핸들러
  const handleAnswerChange = useCallback(
    (questionId: number, answer: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    },
    []
  )

  return { answers, allAnswered, handleAnswerChange, buildSubmissionAnswers }
}
