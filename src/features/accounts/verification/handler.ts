import { http, HttpResponse } from 'msw'
import type {
  SendSmsRequest,
  SendSmsResponse,
  VerifySmsRequest,
  VerifySmsResponse,
  SendEmailRequest,
  SendEmailResponse,
  VerifyEmailRequest,
  VerifyEmailResponse,
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

  http.post(
    `${BASE_URL}/accounts/verification/send-email`,
    async ({ request }) => {
      const body = (await request.json()) as SendEmailRequest
      // MSW 개발 환경 전용: 탈퇴 계정 복구 테스트 이메일 → withdrawn@test.com
      if (body.email !== 'withdrawn@test.com') {
        return HttpResponse.json(
          { error_detail: { email: ['등록된 탈퇴 계정 이메일이 아닙니다.'] } },
          { status: 400 }
        )
      }
      return HttpResponse.json<SendEmailResponse>({
        detail: '이메일 인증 코드가 전송되었습니다.',
      })
    }
  ),

  http.post(
    `${BASE_URL}/accounts/verification/verify-email`,
    async ({ request }) => {
      const body = (await request.json()) as VerifyEmailRequest
      if (!body.purpose || body.code !== '123456') {
        return HttpResponse.json(
          { detail: '인증코드가 올바르지 않습니다.' },
          { status: 400 }
        )
      }
      return HttpResponse.json<VerifyEmailResponse>({
        detail: '이메일 인증에 성공하였습니다.',
        email_token: 'mock-email-token-abc123',
      })
    }
  ),
]
