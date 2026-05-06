import { http, HttpResponse } from 'msw'
import type { ChangePasswordResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const changePasswordHandlers = [
  http.post(`${BASE_URL}/accounts/change-password`, () => {
    return HttpResponse.json<ChangePasswordResponse>({
      detail: '비밀번호 변경 성공',
    })
  }),
]
