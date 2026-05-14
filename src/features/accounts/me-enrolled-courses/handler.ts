import { http, HttpResponse } from 'msw'
import type { MeEnrolledCoursesResponse } from './types'
import { getMockEnrolledCourses } from '@/mocks/mockEnrollState'

export const meEnrolledCoursesHandlers = [
  http.get('/accounts/me/enrolled-courses', () => {
    return HttpResponse.json<MeEnrolledCoursesResponse>(
      getMockEnrolledCourses()
    )
  }),
]
