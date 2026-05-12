import { useMutation } from '@tanstack/react-query'
import instance from '@/api/instance'
import type {
  SignupRequest,
  SignupResponse,
  SendEmailRequest,
  VerifyEmailRequest,
  VerifyEmailResponse,
  SendSmsRequest,
  VerifySmsRequest,
  VerifySmsResponse,
} from './types'

const signupApi = async (body: SignupRequest): Promise<SignupResponse> => {
  const { data } = await instance.post<SignupResponse>('/accounts/signup', body)
  return data
}

const sendEmailApi = async (body: SendEmailRequest): Promise<void> => {
  await instance.post('/accounts/verification/send-email', body)
}

const verifyEmailApi = async (
  body: VerifyEmailRequest
): Promise<VerifyEmailResponse> => {
  const { data } = await instance.post<VerifyEmailResponse>(
    '/accounts/verification/verify-email',
    body
  )
  return data
}

const sendSmsApi = async (body: SendSmsRequest): Promise<void> => {
  await instance.post('/accounts/verification/send-sms', body)
}

const verifySmsApi = async (
  body: VerifySmsRequest
): Promise<VerifySmsResponse> => {
  const { data } = await instance.post<VerifySmsResponse>(
    '/accounts/verification/verify-sms',
    body
  )
  return data
}

export const useSignup = () => useMutation({ mutationFn: signupApi })
export const useSendEmail = () => useMutation({ mutationFn: sendEmailApi })
export const useVerifyEmail = () => useMutation({ mutationFn: verifyEmailApi })
export const useSendSms = () => useMutation({ mutationFn: sendSmsApi })
export const useVerifySms = () => useMutation({ mutationFn: verifySmsApi })
