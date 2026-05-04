import { http, HttpResponse } from 'msw'
import type { DeploymentStatusResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

// 관리자 강제 종료 테스트 시: exam_status를 'closed' 또는 force_submit을 true로 변경
const mockStatus: DeploymentStatusResponse = {
  exam_status: 'activated',
  force_submit: false,
}

// GET /api/v1/exams/deployments/:deploymentId/status — 쪽지시험 배포 상태 폴링 API
export const deploymentStatusHandlers = [
  http.get(`${BASE_URL}/exams/deployments/:deploymentId/status`, () => {
    return HttpResponse.json<DeploymentStatusResponse>(mockStatus)
  }),
]
