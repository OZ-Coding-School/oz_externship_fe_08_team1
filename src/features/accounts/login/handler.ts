import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const loginHandlers = [
  http.post(`${BASE_URL}/accounts/login`, async ({ request }) => {
    const body = (await request.json()) as { email: string; password: string }

    if (body.email === 'withdrawn@test.com') {
      return HttpResponse.json(
        {
          error_detail: {
            detail: '탈퇴 신청한 계정입니다.',
            expire_at: '2025-05-01',
          },
        },
        { status: 403 }
      )
    }

    if (body.email === 'test@test.com' && body.password === 'Test1234!@') {
      return HttpResponse.json(
        { access_token: 'mock_access_token' },
        { status: 200 }
      )
    }

    return HttpResponse.json(
      {
        error_detail: '이메일 또는 비밀번호가 올바르지 않습니다.',
      },
      { status: 400 }
    )
  }),
]
