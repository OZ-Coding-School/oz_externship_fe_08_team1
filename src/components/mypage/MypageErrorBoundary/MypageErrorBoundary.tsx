import { ErrorBoundary } from 'react-error-boundary'
import { ErrorFallback } from '@/components/common/ErrorFallback'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { useToastStore } from '@/stores/toastStore'
import { getErrorStatus } from '@/utils/getErrorStatus'

const ERROR_MESSAGES: Record<number, string> = {
  [HTTP_STATUS.UNAUTHORIZED]: '로그인이 필요합니다.',
  [HTTP_STATUS.NOT_FOUND]: '정보를 찾을 수 없습니다.',
}

function handleError(error: unknown) {
  const status = getErrorStatus(error)
  if (!status || status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
    useToastStore
      .getState()
      .show('일시적인 오류가 발생했습니다. 다시 시도해주세요.', 'error')
  }
}

export function MypageErrorBoundary({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => {
        const status = getErrorStatus(error)
        return (
          <ErrorFallback
            message={
              ERROR_MESSAGES[status ?? 0] ??
              '정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
            }
            onRetry={
              !status || status >= HTTP_STATUS.INTERNAL_SERVER_ERROR
                ? resetErrorBoundary
                : undefined
            }
          />
        )
      }}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  )
}
