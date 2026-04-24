import { useMutation } from '@tanstack/react-query'
import instance from '@/api/instance'
import type { LoginRequest, LoginResponse, LoginErrorResponse } from './types'
import type { AxiosError } from 'axios'

const loginApi = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>('/accounts/login', data)
  return response.data
}

export const useLogin = () => {
  return useMutation<
    LoginResponse,
    AxiosError<LoginErrorResponse>,
    LoginRequest
  >({
    mutationFn: (data: LoginRequest) => loginApi(data),
  })
}
