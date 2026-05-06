import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import { useAuthStore } from '@/stores/authStore'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface PendingRequest {
  resolve: (token: string) => void
  reject: (err: unknown) => void
}

const REFRESH_URL = '/accounts/me/refresh'

let isRefreshing = false
let pendingQueue: PendingRequest[] = []

const processQueue = (error: unknown, token: string | null) => {
  pendingQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve(token!)
  )
  pendingQueue = []
}


export function setupInterceptors(instance: AxiosInstance): void {
  instance.interceptors.request.use(
    (config) => {
      const token = useAuthStore.getState().accessToken
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  instance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalConfig = error.config as RetryConfig

      if (!error.response || !originalConfig) {
        return Promise.reject(error)
      }

      if (originalConfig.url === REFRESH_URL) {
        return Promise.reject(error)
      }

      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        if (isRefreshing) {
          return new Promise<string>((resolve, reject) => {
            pendingQueue.push({ resolve, reject })
          }).then((token) => {
            originalConfig.headers.Authorization = `Bearer ${token}`
            return instance(originalConfig)
          })
        }

        isRefreshing = true

        try {
          const { data } = await instance.post(
            REFRESH_URL,
            {},
            {
              withCredentials: true,
            }
          )

          const newToken: string = data.access_token
          useAuthStore.getState().setAccessToken(newToken)
          processQueue(null, newToken)

          originalConfig.headers.Authorization = `Bearer ${newToken}`
          return instance(originalConfig)
        } catch (refreshError) {
          processQueue(refreshError, null)
          useAuthStore.getState().logout()
          return Promise.reject(refreshError)
        } finally {
          isRefreshing = false
        }
      }

      return Promise.reject(error)
    }
  )
}
