// 관리자가 시험을 강제 종료했는지 주기적으로 확인하는 훅.
// useDeploymentStatus 내부에서 폴링 인터벌을 관리하고, 이 훅은 그 결과에 반응한다.
// enabled가 false면 폴링 자체가 중단된다 (제출 완료 후 불필요한 네트워크 요청 방지).
import { useCallback, useEffect, useRef } from 'react'
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
  // 종결 처리는 한 번만 실행해야 한다. 폴링이 계속 돌면서 같은 데이터가 오더라도
  // 이미 처리했으면 중복으로 setIsAdminClosed나 navigate가 호출되지 않도록 잠근다.
  const triggeredRef = useRef(false)

  // 관리자 강제 종료/시험 종결 시 공통 처리: 잠금 → 전체화면 해제 → 모달 표시
  const handleAdminClose = useCallback(() => {
    if (triggeredRef.current) return
    triggeredRef.current = true
    exitFullscreen()
    setIsAdminClosed(true)
  }, [setIsAdminClosed])

  useEffect(() => {
    if (triggeredRef.current || !data) return
    if (data.exam_status === 'closed' || data.force_submit === true) {
      handleAdminClose()
    }
  }, [data, handleAdminClose])

  useEffect(() => {
    if (triggeredRef.current || !error) return
    const status = getErrorStatus(error)
    if (status === HTTP_STATUS.GONE) {
      // 410: 서버가 시험 종료를 에러로 내려보내는 경우 — closed와 동일하게 처리
      handleAdminClose()
    } else if (status && status >= 400 && status < 500) {
      // 4xx: 세션 만료나 권한 문제처럼 복구 불가능한 에러 — 즉시 종결
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
    // 5xx / 네트워크 에러: 일시적 장애일 수 있으므로 triggeredRef를 잠그지 않고 폴링 지속
  }, [error, navigate, showToast, handleAdminClose])
}
