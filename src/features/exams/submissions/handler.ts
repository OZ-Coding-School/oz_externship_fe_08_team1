import { http, HttpResponse } from 'msw'
import { HTTP_STATUS } from '@/constants/httpStatus'
import type { SubmissionResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// POST /api/v1/exams/submissions — 답안 제출 API
export const submissionsHandlers = [
  http.post(`${BASE_URL}/exams/submissions`, async ({ request }) => {
    const body = (await request.json()) as { deployment_id?: number }

    // 400 — 유효하지 않은 시험 응시 세션
    if (body.deployment_id === 997) {
      return HttpResponse.json(
        { error_detail: '유효하지 않은 시험 응시 세션입니다.' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }

    // 401 — 인증 실패
    if (body.deployment_id === 996) {
      return HttpResponse.json(
        { error_detail: '자격 인증 데이터가 제공되지 않았습니다.' },
        { status: HTTP_STATUS.UNAUTHORIZED }
      )
    }

    // 403 — 권한 없음
    if (body.deployment_id === 995) {
      return HttpResponse.json(
        { error_detail: '권한이 없습니다.' },
        { status: HTTP_STATUS.FORBIDDEN }
      )
    }

    // 404 — 시험 없음
    if (body.deployment_id === 994) {
      return HttpResponse.json(
        { error_detail: '해당 시험 정보를 찾을 수 없습니다.' },
        { status: HTTP_STATUS.NOT_FOUND }
      )
    }

    // 409 — 중복 제출
    if (body.deployment_id === 999) {
      return HttpResponse.json(
        { error_detail: '이미 제출된 시험입니다.' },
        { status: HTTP_STATUS.CONFLICT }
      )
    }

    // 410 — 시험 종료됨
    if (body.deployment_id === 998) {
      return HttpResponse.json(
        { error_detail: '시험이 이미 종료되었습니다.' },
        { status: HTTP_STATUS.GONE }
      )
    }

    return HttpResponse.json<SubmissionResponse>(
      {
        submission_id: 1001,
        score: 80,
        correct_answer_count: 5,
        redirect_url: `/quiz/1001/result`,
      },
      { status: HTTP_STATUS.CREATED }
    )
  }),
]
