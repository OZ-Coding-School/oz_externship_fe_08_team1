import type { Question } from '@/features/exams/deployment-detail'

// 문항 타입별로 초기 답안 상태를 만든다.
// 서버에서 이미 입력된 answer_input이 있으면 그 값으로 초기화 (이어풀기 지원).
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
      // blank_count만큼 빈 문자열 배열로 초기화
      map[q.question_id] = Array.isArray(q.answer_input)
        ? q.answer_input
        : Array<string>(q.blank_count ?? 0).fill('')
    }
  }
  return map
}

// 문항이 "제출 가능한 상태"인지 판별한다.
// ordering은 모든 선택지가 배치돼야 완료, 나머지는 빈 값 여부만 확인.
export function isAnswered(q: Question, answer: string | string[]): boolean {
  if (q.type === 'ordering') {
    const ans = answer as string[]
    // 선택지 개수와 배치된 개수가 일치해야 완료
    return ans.length === (q.options?.length ?? 0) && ans.every((a) => a !== '')
  }
  if (Array.isArray(answer))
    return answer.length > 0 && answer.every((a) => a !== '')
  return (answer as string).trim() !== ''
}
