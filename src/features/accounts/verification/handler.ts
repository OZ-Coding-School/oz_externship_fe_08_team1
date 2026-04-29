import { http, HttpResponse } from 'msw'
import type {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  VerifySmsResponse,
} from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const verificationHandlers = [
  http.post(
    `${BASE_URL}/accounts/verification/send-sms`,
    async ({ request }) => {
      ;(await request.json()) as SendSmsRequest
      return HttpResponse.json<SendSmsResponse>({
        detail: '인증번호가 전송되었습니다.',
      })
    }
  ),

  http.post(
    `${BASE_URL}/accounts/verification/verify-sms`,
    async ({ request }) => {
      const body = (await request.json()) as VerifySmsRequest
      if (body.code !== '123456') {
        return HttpResponse.json(
          { detail: '인증번호가 일치하지 않습니다.' },
          { status: 400 }
        )
      }
      return HttpResponse.json<VerifySmsResponse>({
        detail: '인증이 완료되었습니다.',
        sms_token: 'mock-sms-token-123',
      })
    }
  ),
]
