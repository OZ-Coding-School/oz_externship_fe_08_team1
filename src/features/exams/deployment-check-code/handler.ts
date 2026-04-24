import { http, HttpResponse } from 'msw'
import { HTTP_STATUS } from '@/constants/httpStatus'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// POST /api/v1/exams/deployments/:deploymentId/check-code — 참가코드 검증 API
export const checkCodeHandlers = [
  http.post(
    `${BASE_URL}/exams/deployments/:deploymentId/check-code`,
    async ({ request }) => {
      const body = (await request.json()) as { code: string }

      // 성공
      if (body.code === 'ABC123') {
        return new HttpResponse(null, { status: 204 })
      }

      // 401 — 미인증
      if (body.code === 'ERR401') {
        return HttpResponse.json(
          { error_detail: '자격 인증 데이터가 제공되지 않았습니다.' },
          { status: HTTP_STATUS.UNAUTHORIZED }
        )
      }

      // 403 — 권한 없음
      if (body.code === 'ERR403') {
        return HttpResponse.json(
          { error_detail: '시험에 응시할 권한이 없습니다.' },
          { status: HTTP_STATUS.FORBIDDEN }
        )
      }

      // 404 — 배포 없음
      if (body.code === 'ERR404') {
        return HttpResponse.json(
          { error_detail: '배포 정보를 찾을 수 없습니다.' },
          { status: HTTP_STATUS.NOT_FOUND }
        )
      }

      // 423 — 아직 응시 불가
      if (body.code === 'ERR423') {
        return HttpResponse.json(
          { error_detail: '아직 응시할 수 없습니다.' },
          { status: HTTP_STATUS.LOCKED }
        )
      }

      // 400 — 코드 불일치
      return HttpResponse.json(
        { error_detail: '응시 코드가 일치하지 않습니다.' },
        { status: HTTP_STATUS.BAD_REQUEST }
      )
    }
  ),
]
