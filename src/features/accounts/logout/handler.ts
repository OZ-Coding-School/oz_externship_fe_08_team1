import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const logoutHandlers = [
  http.post(`${BASE_URL}/accounts/logout`, () => {
    return HttpResponse.json({ detail: '로그아웃 되었습니다.' })
  }),
]
