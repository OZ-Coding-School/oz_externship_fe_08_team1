export interface SubmissionExam {
  id: number
  title: string
  thumbnail_img_url: string
}

export interface SubmissionQuestion {
  id: number
  question: string
  prompt: string
  blank_count: number
  options: string[]
  type: string
  answer: string[]
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
}
