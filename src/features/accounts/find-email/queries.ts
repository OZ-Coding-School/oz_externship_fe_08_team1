import { useMutation } from '@tanstack/react-query'
import instance from '@/api/instance'
import type { FindEmailRequest, FindEmailResponse } from './types'

const findEmailApi = async (
  body: FindEmailRequest
): Promise<FindEmailResponse> => {
  const { data } = await instance.post<FindEmailResponse>(
    '/accounts/find-email',
    body
  )
  return data
}

export const useFindEmail = () =>
  useMutation({
    mutationFn: findEmailApi,
  })
