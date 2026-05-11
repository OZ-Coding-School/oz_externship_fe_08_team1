import { useMutation } from '@tanstack/react-query'
import instance from '@/api/instance'
import type { RefreshResponse } from './types'

const refreshApi = async (): Promise<RefreshResponse> => {
  const { data } = await instance.post<RefreshResponse>(
    '/accounts/me/refresh',
    {},
    { withCredentials: true }
  )
  return data
}

export const useSocialLoginCallback = () =>
  useMutation({
    mutationFn: refreshApi,
  })
