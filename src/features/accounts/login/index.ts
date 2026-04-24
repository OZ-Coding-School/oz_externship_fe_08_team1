import instance from '@/api/instance'
import type { LoginRequest, LoginResponse } from './types'

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const response = await instance.post<LoginResponse>('/accounts/login', data)
  return response.data
}
