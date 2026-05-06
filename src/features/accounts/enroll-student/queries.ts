import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import api from '@/api/instance'
import type {
  EnrollStudentRequest,
  EnrollStudentResponse,
  EnrollStudentErrorResponse,
} from './types'
import { meEnrolledCoursesQueries } from '@/features/accounts/me-enrolled-courses/queries'

export function useEnrollStudent() {
  const queryClient = useQueryClient()

  return useMutation<
    EnrollStudentResponse,
    AxiosError<EnrollStudentErrorResponse>,
    EnrollStudentRequest
  >({
    mutationFn: async (data) => {
      const { data: res } = await api.post<EnrollStudentResponse>(
        'accounts/enroll-student',
        data
      )
      return res
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: meEnrolledCoursesQueries.all().queryKey,
      })
    },
  })
}
