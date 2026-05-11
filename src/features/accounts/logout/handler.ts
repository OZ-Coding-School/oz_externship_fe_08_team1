import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const logoutHandlers = [
  http.post(`${BASE_URL}/accounts/logout`, () => {
    return new HttpResponse(
      JSON.stringify({ detail: '로그아웃 되었습니다.' }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Set-Cookie': 'refresh_token=; HttpOnly; SameSite=Lax; Max-Age=0',
        },
      }
    )
  }),
]
