import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { MeResponse } from './types'

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
