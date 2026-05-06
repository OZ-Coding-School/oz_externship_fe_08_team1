import { useMutation } from '@tanstack/react-query'
import api from '@/api/instance'
import type { CheckCodeRequest } from './types'

export function useCheckCode(deploymentId: number) {
  return useMutation({
    mutationFn: (body: CheckCodeRequest) =>
      api.post(`exams/deployments/${deploymentId}/check-code`, body),
  })
}
