import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { ChangePasswordRequest, ChangePasswordResponse } from './types'

export function useChangePassword() {
  return useMutation({
    mutationFn: async (body: ChangePasswordRequest) => {
      const { data } = await api.post<ChangePasswordResponse>(
        'accounts/change-password',
        body
      )
      return data
    },
  })
}
