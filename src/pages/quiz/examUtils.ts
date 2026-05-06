import type { Question } from '@/features/exams/deployment-detail'

export function initAnswers(
  questions: Question[]
): Record<number, string | string[]> {
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

export function isAnswered(q: Question, answer: string | string[]): boolean {
  if (q.type === 'ordering') {
    const ans = answer as string[]
    return ans.length === (q.options?.length ?? 0) && ans.every((a) => a !== '')
  }
  if (Array.isArray(answer))
    return answer.length > 0 && answer.every((a) => a !== '')
  return (answer as string).trim() !== ''
}
