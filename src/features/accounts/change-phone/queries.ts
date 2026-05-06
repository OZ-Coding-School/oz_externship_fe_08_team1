import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import { meQueries } from '@/features/accounts/me'
import type { ChangePhoneRequest, ChangePhoneResponse } from './types'

export function useChangePhone() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: ChangePhoneRequest) => {
      const { data } = await api.patch<ChangePhoneResponse>(
        'accounts/change-phone',
        body
      )
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(meQueries.all())
    },
  })
}
