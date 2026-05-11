import { http, HttpResponse } from 'msw'
import type { SubmissionDetailResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const mockSubmissionDetail: SubmissionDetailResponse = {
  id: 1001,
  submitter_id: 42,
  deployment_id: 2,
  exam: {
    id: 2,
    title: 'JavaScript 심화 쪽지시험',
    thumbnail_img_url: 'https://placehold.co/400x300?text=JavaScript',
  },
  questions: [
    {
      id: 1,
      question: 'JavaScript에서 null == undefined는 true이다.',
      prompt: '',
      blank_count: 0,
      options: ['O', 'X'],
      type: 'ox',
      answer: ['O'],
      point: 10,
      explanation:
        'null == undefined는 동등 연산자(==)로 비교 시 true입니다. 단, null === undefined는 false입니다.',
      is_correct: true,
    },
    {
      id: 2,
      question: 'Array.prototype.map()의 반환값은 무엇인가?',
      prompt: '',
      blank_count: 0,
      options: ['새로운 배열', '원본 배열', 'undefined', 'null'],
      type: 'single_choice',
      answer: ['새로운 배열'],
      point: 10,
      explanation:
        'map()은 각 요소에 콜백을 적용한 결과로 구성된 새로운 배열을 반환합니다.',
      is_correct: false,
    },
    {
      id: 3,
      question:
        '다음 중 JavaScript의 원시 타입(Primitive type)에 해당하는 것을 모두 고르시오.',
      prompt: '',
      blank_count: 0,
      options: ['string', 'object', 'number', 'symbol', 'array'],
      type: 'multiple_choice',
      answer: ['string', 'number', 'symbol'],
      point: 10,
      explanation:
        'JavaScript의 원시 타입은 string, number, bigint, boolean, undefined, symbol, null입니다. object와 array는 참조 타입입니다.',
      is_correct: true,
    },
    {
      id: 4,
      question: 'Promise의 세 가지 상태를 쉼표로 구분하여 적으시오.',
      prompt: '',
      blank_count: 0,
      options: [],
      type: 'short_answer',
      answer: ['pending, fulfilled, rejected'],
      point: 10,
      explanation:
        'Promise는 pending(대기), fulfilled(이행), rejected(거부) 세 가지 상태를 가집니다.',
      is_correct: true,
    },
    {
      id: 5,
      question: '다음 문장의 빈칸을 채우시오.',
      prompt:
        '자바스크립트에서 [blank]는 값이 없음을 의미하고, [blank]는 존재하지 않음을 의미한다.',
      blank_count: 2,
      options: [],
      type: 'fill_blank',
      answer: ['null', 'undefined'],
      point: 10,
      explanation:
        'null은 의도적으로 값이 없음을 나타내고, undefined는 변수가 선언되었지만 값이 할당되지 않은 상태입니다.',
      is_correct: false,
    },
    {
      id: 6,
      question: '다음 Promise 실행 순서를 올바르게 배열하시오.',
      prompt: '',
      blank_count: 0,
      options: ['콜백 등록', 'resolve 호출', 'Promise 생성', 'then 실행'],
      type: 'ordering',
      answer: ['Promise 생성', '콜백 등록', 'resolve 호출', 'then 실행'],
      point: 10,
      explanation:
        'Promise는 생성 → 콜백 등록 → resolve 호출 → then 실행 순서로 동작합니다.',
      is_correct: true,
    },
  ],
}

export const submissionDetailHandlers = [
  http.get(`${BASE_URL}/exams/submissions/:submissionId`, ({ params }) => {
    const submissionId = Number(params.submissionId)

    // 403 테스트: submissionId=403
    if (submissionId === 403) {
      return HttpResponse.json({ detail: '권한이 없습니다.' }, { status: 403 })
    }

    // 404 테스트: submissionId=404 또는 NaN
    if (submissionId === 404 || isNaN(submissionId)) {
      return HttpResponse.json(
        { detail: '해당 시험 정보를 찾을 수 없습니다.' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ ...mockSubmissionDetail, id: submissionId })
  }),
]
