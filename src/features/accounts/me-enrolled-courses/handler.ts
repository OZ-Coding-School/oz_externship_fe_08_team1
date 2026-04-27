import { http, HttpResponse } from 'msw'
import type { MeEnrolledCoursesResponse } from './types'
import { getMockEnrolledCourses } from '@/mocks/mockEnrollState'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const meEnrolledCoursesHandlers = [
  http.get(`${BASE_URL}/accounts/me/enrolled-courses`, () => {
    return HttpResponse.json<MeEnrolledCoursesResponse>(
      getMockEnrolledCourses()
    )
  }),
]
