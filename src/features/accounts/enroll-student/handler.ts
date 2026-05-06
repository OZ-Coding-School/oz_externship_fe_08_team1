import { http, HttpResponse } from 'msw'
import { setMockEnrolledCourse } from '@/mocks/mockEnrollState'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const enrollStudentHandlers = [
  http.post(`${BASE_URL}/accounts/enroll-student`, async ({ request }) => {
    const body = (await request.json()) as { cohort_id: number }

    if (typeof body.cohort_id !== 'number') {
      return HttpResponse.json(
        { error_detail: '기수를 선택해주세요.' },
        { status: 400 }
      )
    }

    const enrolled = setMockEnrolledCourse(body.cohort_id)
    if (!enrolled) {
      return HttpResponse.json(
        { error_detail: '존재하지 않는 기수입니다.' },
        { status: 404 }
      )
    }

    return HttpResponse.json(
      { detail: '수강생 등록 신청완료.' },
      { status: 201 }
    )
  }),
]
