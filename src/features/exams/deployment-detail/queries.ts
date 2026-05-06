import { queryOptions, useSuspenseQuery } from '@tanstack/react-query'
import api from '@/api/instance'
import type { DeploymentDetailResponse } from './types'

export const deploymentDetailQueries = {
  detail: (deploymentId: number) =>
    queryOptions({
      queryKey: ['exams', 'deployments', deploymentId, 'detail'],
      queryFn: async () => {
        const { data } = await api.get<DeploymentDetailResponse>(
          `exams/deployments/${deploymentId}`
        )
        return data
      },
    }),
}

export function useDeploymentDetail(deploymentId: number) {
  return useSuspenseQuery(deploymentDetailQueries.detail(deploymentId))
}
