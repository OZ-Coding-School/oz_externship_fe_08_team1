/** GET /api/v1/exams/deployments 쿼리 파라미터 */
export interface DeploymentsParams {
  page?: number
  status?: 'done' | 'pending'
}

export interface DeploymentSubject {
  id: number
  title: string
  thumbnail_img_url: string | null
}

export interface DeploymentExam {
  id: number
  title: string
  thumbnail_img_url: string
  subject: DeploymentSubject
}

export interface DeploymentExamInfo {
  status: 'done' | 'pending'
  score: number | null
  correct_answer_count: number | null
}

export interface DeploymentListItem {
  id: number
  submission_id: number | null
  exam: DeploymentExam
  question_count: number
  total_score: number
  exam_info: DeploymentExamInfo
  is_done: boolean
  duration_time: number
}

/** GET /api/v1/exams/deployments 응답 */
export interface DeploymentsResponse {
  page: number
  has_next: boolean
  results: DeploymentListItem[]
}
