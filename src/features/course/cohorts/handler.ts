import { http, HttpResponse } from 'msw'
import { mockCohortsByCourse } from '@/mocks/mockCourseData'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const cohortHandlers = [
  http.get(`${BASE_URL}/courses/:courseId/cohorts`, ({ params }) => {
    const courseId = Number(params.courseId)
    const cohorts = mockCohortsByCourse[courseId] ?? []
    return HttpResponse.json(cohorts, { status: 200 })
  }),
]
