import { http, HttpResponse } from 'msw'
import type { MeEnrolledCoursesResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const meEnrolledCoursesHandlers = [
  http.get(`${BASE_URL}/accounts/me/enrolled-courses`, () => {
    return HttpResponse.json<MeEnrolledCoursesResponse>([
      {
        cohort: {
          id: 1,
          number: 1,
          start_date: '2024-01-01',
          end_date: '2024-06-30',
          status: 'IN_PROGRESS',
        },
        course: {
          id: 1,
          name: 'IT스타트업 실무형 풀스택 웹 개발 부트캠프 (React + Node.js)',
          tag: 'fullstack',
          thumbnail_img_url: '',
        },
      },
    ])
  }),
]
