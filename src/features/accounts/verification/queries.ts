import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
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

export function useSendSms() {
  return useMutation({
    mutationFn: async (body: SendSmsRequest) => {
      const { data } = await api.post<SendSmsResponse>(
        'accounts/verification/send-sms',
        body
      )
      return data
    },
  })
}

export function useVerifySms() {
  return useMutation({
    mutationFn: async (body: VerifySmsRequest) => {
      const { data } = await api.post<VerifySmsResponse>(
        'accounts/verification/verify-sms',
        body
      )
      return data
    },
  })
}

export function useSendEmail() {
  return useMutation({
    mutationFn: async (body: SendEmailRequest) => {
      const { data } = await api.post<SendEmailResponse>(
        'accounts/verification/send-email',
        body
      )
      return data
    },
  })
}

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (body: VerifyEmailRequest) => {
      const { data } = await api.post<VerifyEmailResponse>(
        'accounts/verification/verify-email',
        body
      )
      return data
    },
  })
}
