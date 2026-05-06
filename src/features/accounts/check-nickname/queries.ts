import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { CheckNicknameRequest, CheckNicknameResponse } from './types'

export function useCheckNickname() {
  return useMutation({
    mutationFn: async (body: CheckNicknameRequest) => {
      const { data } = await api.post<CheckNicknameResponse>(
        'accounts/check-nickname',
        body
      )
      return data
    },
  })
}
