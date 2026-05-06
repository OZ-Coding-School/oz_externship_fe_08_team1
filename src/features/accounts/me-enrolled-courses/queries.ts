import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { MeEnrolledCoursesResponse } from './types'

export const meEnrolledCoursesQueries = {
  all: () => ({ queryKey: ['accounts', 'me', 'enrolled-courses'] as const }),
  list: () =>
    queryOptions({
      queryKey: [...meEnrolledCoursesQueries.all().queryKey, 'list'],
      queryFn: async () => {
        const { data } = await api.get<MeEnrolledCoursesResponse>(
          'accounts/me/enrolled-courses'
        )
        return data
      },
    }),
}

export function useMeEnrolledCourses() {
  return useSuspenseQuery(meEnrolledCoursesQueries.list())
}
