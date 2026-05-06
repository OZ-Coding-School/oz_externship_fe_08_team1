import { queryOptions, skipToken, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { CohortListResponse } from './types'

export const cohortListQueries = {
  all: () => ({ queryKey: ['course', 'cohorts'] as const }),
  list: (courseId: number | null) =>
    queryOptions({
      queryKey: [...cohortListQueries.all().queryKey, courseId] as const,
      queryFn:
        courseId === null
          ? skipToken
          : async () => {
              const { data } = await api.get<CohortListResponse>(
                `courses/${courseId}/cohorts`
              )
              return data
            },
    }),
}

export function useCohortList(courseId: number | null) {
  return useQuery(cohortListQueries.list(courseId))
}
