import type {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosError,
} from 'axios'
import { ROUTES } from '@/constants/routes'
import { useAuthStore } from '@/stores/authStore'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

const redirectToLogin = () => {
  useAuthStore.getState().logout()

  if (window.location.pathname !== ROUTES.AUTH.LOGIN) {
    window.location.href = ROUTES.AUTH.LOGIN
  }
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

      // me/refresh 요청 자체가 401이면 재시도 안 함
      if (originalConfig.url?.includes('me/refresh')) {
        redirectToLogin()
        return Promise.reject(error)
      }

      if (error.response.status === 401 && !originalConfig._retry) {
        originalConfig._retry = true

        try {
          const { data } = await instance.post(
            '/accounts/me/refresh',
            {},
            { withCredentials: true }
          )

          const newToken = data.access_token
          useAuthStore.getState().setAccessToken(newToken)

          originalConfig.headers.Authorization = `Bearer ${newToken}`
          return instance(originalConfig)
        } catch (refreshError) {
          redirectToLogin()
          return Promise.reject(refreshError)
        }
      }

      return Promise.reject(error)
    }
  )
}
