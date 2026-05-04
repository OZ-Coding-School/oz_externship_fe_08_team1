import { http, HttpResponse } from 'msw'
import type { DeploymentDetailResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const mockDetail: DeploymentDetailResponse = {
  exam_id: 2,
  exam_title: 'JavaScript 심화 쪽지시험',
  duration_time: 30,
  elapsed_time: 0,
  cheating_count: 0,
  questions: [
    {
      question_id: 1,
      number: 1,
      type: 'ox',
      question: 'JavaScript에서 null == undefined는 true이다.',
      point: 10,
      prompt: null,
      blank_count: null,
      options: ['O', 'X'],
      answer_input: null,
    },
    {
      question_id: 2,
      number: 2,
      type: 'single_choice',
      question: 'Array.prototype.map()의 반환값은 무엇인가?',
      point: 10,
      prompt: null,
      blank_count: null,
      options: ['새로운 배열', '원본 배열', 'undefined', 'null'],
      answer_input: null,
    },
    {
      question_id: 3,
      number: 3,
      type: 'multiple_choice',
      question:
        '다음 중 JavaScript의 원시 타입(Primitive type)에 해당하는 것을 모두 고르시오.',
      point: 10,
      prompt: null,
      blank_count: null,
      options: ['string', 'object', 'number', 'symbol', 'array'],
      answer_input: null,
    },
    {
      question_id: 4,
      number: 4,
      type: 'short_answer',
      question: 'Promise의 세 가지 상태를 쉼표로 구분하여 적으시오.',
      point: 10,
      prompt: null,
      blank_count: null,
      options: null,
      answer_input: null,
    },
    {
      question_id: 5,
      number: 5,
      type: 'fill_blank',
      question: '다음 문장의 빈칸을 채우시오.',
      point: 10,
      prompt:
        '자바스크립트에서 [blank]는 값이 없음을 의미하고, [blank]는 존재하지 않음을 의미한다.',
      blank_count: 2,
      options: null,
      answer_input: ['', ''],
    },
    {
      question_id: 6,
      number: 6,
      type: 'ordering',
      question: '다음 Promise 실행 순서를 올바르게 배열하시오.',
      point: 10,
      prompt: null,
      blank_count: null,
      options: ['콜백 등록', 'resolve 호출', 'Promise 생성', 'then 실행'],
      answer_input: null,
    },
  ],
}

// GET /api/v1/exams/deployments/:deploymentId — 쪽지시험 문제 조회 API
export const deploymentDetailHandlers = [
  http.get(`${BASE_URL}/exams/deployments/:deploymentId`, ({ request }) => {
    const url = new URL(request.url)
    // check-code 서브패스는 별도 핸들러에서 처리
    if (url.pathname.endsWith('check-code')) return
    // status 서브패스는 별도 핸들러에서 처리
    if (url.pathname.endsWith('status')) return
    return HttpResponse.json<DeploymentDetailResponse>(mockDetail)
  }),
]
