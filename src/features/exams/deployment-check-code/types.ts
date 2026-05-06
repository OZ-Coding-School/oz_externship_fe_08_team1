import type { ApiErrorBody } from '@/features/exams/submissions'

export interface CheckCodeRequest {
  code: string
}

export type CheckCodeErrorResponse = ApiErrorBody
