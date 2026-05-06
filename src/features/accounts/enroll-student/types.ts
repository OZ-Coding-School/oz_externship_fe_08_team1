export interface EnrollStudentRequest {
  cohort_id: number
}

export interface EnrollStudentResponse {
  detail: string
}

export interface EnrollStudentErrorResponse {
  error_detail: string | Record<string, string[]>
}
