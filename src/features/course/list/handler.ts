import { http, HttpResponse } from 'msw'
import { mockCourses } from '@/mocks/mockCourseData'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const courseListHandlers = [
  http.get(`${BASE_URL}/course`, () => {
    return HttpResponse.json(mockCourses, { status: 200 })
  }),
]
