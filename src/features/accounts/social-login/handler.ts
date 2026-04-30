import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const socialLoginHandlers = [
  http.post(`${BASE_URL}/accounts/me/refresh`, () => {
    return HttpResponse.json({
      access_token: 'mock_social_access_token',
    })
  }),
]
