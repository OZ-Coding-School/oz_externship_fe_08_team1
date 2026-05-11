import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { SubmissionDetailResponse } from './types'

export const submissionDetailQueries = {
  detail: (submissionId: number) =>
    queryOptions({
      queryKey: ['exams', 'submissions', submissionId, 'detail'],
      queryFn: async () => {
        const { data } = await api.get<SubmissionDetailResponse>(
          `exams/submissions/${submissionId}`
        )
        return data
      },
    }),
}

export function useSubmissionDetail(submissionId: number) {
  return useSuspenseQuery(submissionDetailQueries.detail(submissionId))
}
