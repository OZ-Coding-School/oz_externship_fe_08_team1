import { queryOptions, useQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import { getErrorStatus } from '@/utils/getErrorStatus'
import type { DeploymentStatusResponse } from './types'

const STATUS_POLL_INTERVAL_MS = 15_000

export const deploymentStatusQueries = {
  status: (deploymentId: number) =>
    queryOptions({
      queryKey: ['exams', 'deployments', deploymentId, 'status'],
      queryFn: async () => {
        const { data } = await api.get<DeploymentStatusResponse>(
          `exams/deployments/${deploymentId}/status`
        )
        return data
      },
      refetchInterval: (query) => {
        const d = query.state.data
        if (!d) return STATUS_POLL_INTERVAL_MS
        return d.exam_status === 'closed' || d.force_submit
          ? false
          : STATUS_POLL_INTERVAL_MS
      },
      refetchIntervalInBackground: false,
      // 4xx는 재시도 불필요, 5xx/네트워크 에러는 최대 2회 재시도
      retry: (failureCount, error) => {
        const status = getErrorStatus(error)
        if (status && status < 500) return false
        return failureCount < 2
      },
      staleTime: 0,
      gcTime: 0,
    }),
}

// useSuspenseQuery 미사용: 폴링 중 Suspense fallback이 반복 발생하지 않도록 useQuery 사용
export function useDeploymentStatus(deploymentId: number, enabled = true) {
  return useQuery({ ...deploymentStatusQueries.status(deploymentId), enabled })
}
