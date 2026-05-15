import { useMutation } from '@tanstack/react-query'
import instance from '@/api/instance'
import type { FindPasswordRequest, FindPasswordResponse } from './types'

const findPasswordApi = async (
  body: FindPasswordRequest
): Promise<FindPasswordResponse> => {
  const { data } = await instance.post<FindPasswordResponse>(
    '/accounts/find_password',
    body
  )
  return data
}

export const useFindPassword = () =>
  useMutation({
    mutationFn: findPasswordApi,
  })
