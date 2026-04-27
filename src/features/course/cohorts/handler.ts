import { http, HttpResponse } from 'msw'
import type { Cohort } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const cohortsByCourse: Record<number, Cohort[]> = {
  1: [
    { id: 1, course_id: 1, number: 1, status: 'IN_PROGRESS' },
    { id: 2, course_id: 1, number: 2, status: 'IN_PROGRESS' },
    { id: 3, course_id: 1, number: 3, status: 'IN_PROGRESS' },
  ],
  2: [
    { id: 4, course_id: 2, number: 1, status: 'IN_PROGRESS' },
    { id: 5, course_id: 2, number: 2, status: 'IN_PROGRESS' },
  ],
  3: [
    { id: 6, course_id: 3, number: 1, status: 'IN_PROGRESS' },
    { id: 7, course_id: 3, number: 2, status: 'IN_PROGRESS' },
    { id: 8, course_id: 3, number: 3, status: 'IN_PROGRESS' },
    { id: 9, course_id: 3, number: 4, status: 'IN_PROGRESS' },
  ],
  4: [{ id: 10, course_id: 4, number: 1, status: 'IN_PROGRESS' }],
}

export const cohortHandlers = [
  http.get(`${BASE_URL}/courses/:courseId/cohorts`, ({ params }) => {
    const courseId = Number(params.courseId)
    const cohorts = cohortsByCourse[courseId] ?? []
    return HttpResponse.json(cohorts, { status: 200 })
  }),
]
