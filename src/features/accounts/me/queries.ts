import {
  queryOptions,
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query'
import api from '@/api/instance'
import type {
  MeResponse,
  MeUpdateRequest,
  MeUpdateResponse,
  WithdrawRequest,
} from './types'

export const meQueries = {
  all: () => ({ queryKey: ['accounts', 'me'] as const }),
  detail: () =>
    queryOptions({
      queryKey: [...meQueries.all().queryKey, 'detail'],
      queryFn: async () => {
        const { data } = await api.get<MeResponse>('accounts/me')
        return data
      },
    }),
}

export function useMe() {
  return useSuspenseQuery(meQueries.detail())
}

export function useUpdateMe() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: MeUpdateRequest) => {
      const { data } = await api.patch<MeUpdateResponse>('accounts/me', body)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries(meQueries.all())
    },
  })
}

export function useWithdraw() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: WithdrawRequest) => {
      await api.delete('accounts/me', {
        data: {
          reason: body.reason,
          ...(body.reason_detail ? { reason_detail: body.reason_detail } : {}),
        },
      })
    },
    onSuccess: () => {
      queryClient.clear()
    },
  })
}
