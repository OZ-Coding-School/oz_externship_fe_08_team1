export interface Cohort {
  id: number
  course_id: number
  number: number
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

export type CohortListResponse = Cohort[]

export interface CohortListErrorResponse {
  error_detail: string
}
