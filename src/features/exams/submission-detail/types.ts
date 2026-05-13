export interface SubmissionExam {
  id: number
  title: string
  thumbnail_img_url: string | null
}

export type QuestionType =
  | 'ox'
  | 'single_choice'
  | 'multiple_choice'
  | 'short_answer'
  | 'ordering'
  | 'fill_blank'

type BaseQuestion = {
  id: number
  question: string
  answer: string[]
  submitted_answer: string[]
  point: number
  explanation: string
  is_correct: boolean
}

// OX: answer/submitted_answer 값이 'O' | 'X'로 고정
type OXQuestion = Omit<BaseQuestion, 'answer' | 'submitted_answer'> & {
  type: 'ox'
  options: ('O' | 'X')[]
  answer: ('O' | 'X')[]
  submitted_answer: ('O' | 'X')[]
  prompt: null
  blank_count: null
}

// 단일선택 · 다중선택 · 순서배열: options 있음, prompt/blank_count는 null
type OptionsQuestion = BaseQuestion & {
  type: 'single_choice' | 'multiple_choice' | 'ordering'
  options: string[]
  prompt: null
  blank_count: null
}

// 단답형: options/prompt/blank_count 모두 null
type ShortAnswerQuestion = BaseQuestion & {
  type: 'short_answer'
  options: null
  prompt: null
  blank_count: null
}

// 빈칸식: prompt · blank_count 있음, options는 null
type FillBlankQuestion = BaseQuestion & {
  type: 'fill_blank'
  options: null
  prompt: string
  blank_count: number
}

export type SubmissionQuestion =
  | OXQuestion
  | OptionsQuestion
  | ShortAnswerQuestion
  | FillBlankQuestion

export interface SubmissionDetailResponse {
  id: number
  submitter_id: number
  deployment_id: number
  exam: SubmissionExam
  questions: SubmissionQuestion[]
  cheating_count: number
  score: number
  total_score: number
  correct_answer_count: number
  elapsed_time: number
  started_at: string
  submitted_at: string
}
