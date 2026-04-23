import { useMutation } from '@tanstack/react-query'
import { login } from './index'
import type { LoginRequest, LoginResponse, LoginErrorResponse } from './types'
import type { AxiosError } from 'axios'

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    AxiosError<LoginErrorResponse>,
    LoginRequest
  >({
    mutationFn: (data: LoginRequest) => login(data),
  })
}
