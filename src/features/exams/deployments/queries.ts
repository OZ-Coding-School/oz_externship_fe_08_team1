import {
  infiniteQueryOptions,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query'
import api from '@/api/instance'
import type { DeploymentsParams, DeploymentsResponse } from './types'

type DeploymentsFilterParams = Omit<DeploymentsParams, 'page'>

export const deploymentsQueries = {
  all: () => ({ queryKey: ['exams', 'deployments'] as const }),
  list: (params?: DeploymentsFilterParams) =>
    infiniteQueryOptions({
      queryKey: [...deploymentsQueries.all().queryKey, 'list', params],
      queryFn: async ({ pageParam }) => {
        const { data } = await api.get<DeploymentsResponse>(
          'exams/deployments',
          { params: { ...params, page: pageParam } }
        )
        return data
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.has_next ? lastPage.page + 1 : undefined,
    }),
}

export function useDeployments(params?: DeploymentsFilterParams) {
  return useSuspenseInfiniteQuery(deploymentsQueries.list(params))
}
