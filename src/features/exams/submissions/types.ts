import type { QuestionType } from '../deployment-detail/types'

export interface SubmissionAnswer {
  question_id: number
  type: QuestionType
  submitted_answer: string | string[]
}

export interface SubmissionRequest {
  deployment_id: number
  started_at: string
  cheating_count: number
  answers: SubmissionAnswer[]
}

export interface SubmissionResponse {
  submission_id: number
  score: number
  correct_answer_count: number
  redirect_url: string
}
