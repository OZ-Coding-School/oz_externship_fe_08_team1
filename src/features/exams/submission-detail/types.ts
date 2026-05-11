export interface SubmissionExam {
  id: number
  title: string
  thumbnail_img_url: string
}

export type QuestionType =
  | 'ox'
  | 'single_choice'
  | 'multiple_choice'
  | 'short_answer'
  | 'ordering'
  | 'fill_blank'

export interface SubmissionQuestion {
  id: number
  question: string
  prompt: string
  blank_count: number
  options: string[]
  type: QuestionType
  answer: string[]
  submitted_answer: string[]
  point: number
  explanation: string
  is_correct: boolean
}

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
