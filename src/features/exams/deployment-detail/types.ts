export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'ox'
  | 'short_answer'
  | 'ordering'
  | 'fill_blank'

export interface Question {
  question_id: number
  number: number
  type: QuestionType
  question: string
  point: number
  prompt: string | null
  blank_count: number | null
  options: string[] | null
  answer_input: string | string[] | null
}

export interface DeploymentDetailResponse {
  exam_id: number
  exam_title: string
  duration_time: number
  elapsed_time: number
  cheating_count: number
  questions: Question[]
}
