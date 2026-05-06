import { http, HttpResponse } from 'msw'
import type { ChangePhoneResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const changePhoneHandlers = [
  http.patch(`${BASE_URL}/accounts/change-phone`, () => {
    return HttpResponse.json<ChangePhoneResponse>({
      detail: '휴대폰 번호가 변경되었습니다.',
      phone_number: '+821099998888',
    })
  }),
]
