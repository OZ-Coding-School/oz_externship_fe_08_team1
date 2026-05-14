import { http, HttpResponse } from 'msw'
import type { ChangePasswordResponse } from './types'

export const changePasswordHandlers = [
  http.post('/accounts/change-password', () => {
    return HttpResponse.json<ChangePasswordResponse>({
      detail: '비밀번호 변경 성공',
    })
  }),
]
