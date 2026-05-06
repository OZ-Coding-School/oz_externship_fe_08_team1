import axios from 'axios'

export function getErrorDetail(error: unknown): string | undefined {
  if (!axios.isAxiosError(error)) return undefined
  return error.response?.data?.error_detail as string | undefined
}
