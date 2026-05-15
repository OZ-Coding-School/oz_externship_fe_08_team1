import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { RestoreAccountRequest, RestoreAccountResponse } from './types'

export function useRestoreAccount() {
  return useMutation({
    mutationFn: async (body: RestoreAccountRequest) => {
      const { data } = await api.post<RestoreAccountResponse>(
        'accounts/restore',
        body
      )
      return data
    },
  })
}
