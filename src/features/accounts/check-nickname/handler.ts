import { http, HttpResponse } from 'msw'
import type { CheckNicknameResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const checkNicknameHandlers = [
  http.post(`${BASE_URL}/accounts/check-nickname`, async ({ request }) => {
    const { nickname } = (await request.json()) as { nickname: string }

    if (nickname === '중복닉네임') {
      return HttpResponse.json(
        { detail: '이미 사용 중인 닉네임입니다.' },
        { status: 400 }
      )
    }

    return HttpResponse.json<CheckNicknameResponse>({
      detail: '사용 가능한 닉네임입니다.',
    })
  }),
]
