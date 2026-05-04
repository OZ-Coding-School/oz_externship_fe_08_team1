import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import { useDeploymentStatus } from '@/features/exams/deployment-status'
import { useToastStore } from '@/stores/toastStore'
import { getErrorStatus } from '@/utils/getErrorStatus'
import { getErrorDetail } from '@/utils/getErrorDetail'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { ROUTES } from '@/constants/routes'

function exitFullscreen() {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {})
}

export function useExamStatusPoller(
  deploymentId: number,
  enabled: boolean,
  setIsAdminClosed: (value: boolean) => void
) {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.show)
  const { data, error } = useDeploymentStatus(deploymentId, enabled)
  const triggeredRef = useRef(false)

  useEffect(() => {
    if (triggeredRef.current || !data) return
    if (data.exam_status === 'closed' || data.force_submit === true) {
      triggeredRef.current = true
      exitFullscreen()
      setIsAdminClosed(true)
    }
  }, [data, setIsAdminClosed])

  useEffect(() => {
    if (triggeredRef.current || !error) return
    const status = getErrorStatus(error)
    if (status === HTTP_STATUS.GONE) {
      // 410: 시험 종료 신호 — closed로 처리
      triggeredRef.current = true
      exitFullscreen()
      setIsAdminClosed(true)
    } else if (status && status >= 400 && status < 500) {
      // 4xx: 명확한 에러 — 종결 처리
      triggeredRef.current = true
      exitFullscreen()
      if (status === HTTP_STATUS.UNAUTHORIZED) {
        navigate(ROUTES.AUTH.LOGIN, { replace: true })
      } else {
        showToast(
          getErrorDetail(error) ?? '시험 상태 확인 중 오류가 발생했습니다.',
          'error'
        )
        navigate(ROUTES.MYPAGE.QUIZ, { replace: true })
      }
    }
    // 5xx/네트워크 에러: retry 정책으로 흡수, triggeredRef 잠금하지 않아 폴링 지속
  }, [error, navigate, showToast, setIsAdminClosed])
}
