import { queryOptions, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { CourseListResponse } from './types'

export const courseListQueries = {
  all: () => ({ queryKey: ['course'] as const }),
  list: () =>
    queryOptions({
      queryKey: [...courseListQueries.all().queryKey, 'list'],
      queryFn: async () => {
        const { data } = await api.get<CourseListResponse>('course')
        return data
      },
    }),
}

export function useCourseList(enabled = true) {
  return useQuery({ ...courseListQueries.list(), enabled })
}
