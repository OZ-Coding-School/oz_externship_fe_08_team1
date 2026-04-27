import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { SubmissionRequest, SubmissionResponse } from './types'

export function useSubmitExam() {
  return useMutation({
    mutationFn: async (body: SubmissionRequest) => {
      const { data } = await api.post<SubmissionResponse>(
        'exams/submissions',
        body
      )
      return data
    },
    // 재시도 시 409(중복 제출) 유발 방지
    retry: 0,
  })
}
