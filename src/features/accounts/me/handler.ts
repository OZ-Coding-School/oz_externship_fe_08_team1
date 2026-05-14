import { http, HttpResponse } from 'msw'
import type { MeResponse, MeUpdateResponse } from './types'

export const meHandlers = [
  http.get(`/accounts/me`, () => {
    return HttpResponse.json<MeResponse>({
      id: 1,
      email: 'ozschool1234@gmail.com',
      nickname: '오즈오즈',
      name: '김오즈',
      phone_number: '01012341234',
      birthday: '2000-12-25',
      gender: 'M',
      profile_img_url: null,
      cohort_id: 1,
      role: 'STUDENT',
      position: 'ENROLLED',
      created_at: '2024-01-15T09:00:00Z',
    })
  }),
  http.patch(`/accounts/me`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    return HttpResponse.json<MeUpdateResponse>({
      id: 1,
      email: 'ozschool1234@gmail.com',
      nickname: (body.nickname as string) ?? '오즈오즈',
      name: (body.name as string) ?? '김오즈',
      birthday: (body.birthday as string) ?? '2000-12-25',
      gender: (body.gender as 'M' | 'F') ?? 'M',
      phone_number: '01012341234',
      updated_at: new Date().toISOString(),
    })
  }),
  http.delete(`/accounts/withdrawal`, async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    if (!body.password) {
      return HttpResponse.json(
        { error_detail: '비밀번호를 입력해주세요.' },
        { status: 400 }
      )
    }
    return new HttpResponse(null, { status: 204 })
  }),
]
