import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const socialLoginHandlers = [
  http.post(`${BASE_URL}/accounts/me/refresh`, ({ cookies }) => {
    const refreshToken = cookies.refresh_token

    if (!refreshToken) {
      return HttpResponse.json(
        { error_detail: '자격 인증 데이터가 제공되지 않았습니다.' },
        { status: 401 }
      )
    }

    return HttpResponse.json({
      access_token: 'access_token',
    })
  }),
]
