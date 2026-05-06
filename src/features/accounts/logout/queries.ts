import { useMutation } from '@tanstack/react-query'
import instance from '@/api/instance'
import type { LogoutResponse } from './types'

const logoutApi = async (): Promise<LogoutResponse> => {
  const { data } = await instance.post<LogoutResponse>('/accounts/logout')
  return data
}

export const useLogout = () =>
  useMutation({
    mutationFn: logoutApi,
  })
