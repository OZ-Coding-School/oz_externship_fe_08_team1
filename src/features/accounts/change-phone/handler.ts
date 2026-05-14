import { http, HttpResponse } from 'msw'
import type { ChangePhoneResponse } from './types'

export const changePhoneHandlers = [
  http.patch('/accounts/change-phone', () => {
    return HttpResponse.json<ChangePhoneResponse>({
      detail: '휴대폰 번호가 변경되었습니다.',
      phone_number: '+821099998888',
    })
  }),
]
