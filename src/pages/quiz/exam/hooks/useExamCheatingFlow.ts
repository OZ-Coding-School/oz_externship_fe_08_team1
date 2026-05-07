// 부정행위 감지 → 경고 모달 표시 → 한도 초과 시 강제 제출까지의 흐름을 관리하는 훅.
// useCheatingDetector(저수준 이벤트 감지)를 감싸서 UI 상태(경고 모달)와 연결한다.
import { useState, useCallback } from 'react'
import { useCheatingDetector } from './useCheatingDetector'

// 부정행위 허용 한도. 이 횟수에 도달하면 강제 제출된다.
const CHEATING_LIMIT = 3

interface UseExamCheatingFlowOptions {
  initialCount: number
  enabled: boolean
  onLimitExceeded: () => void
}

interface UseExamCheatingFlowResult {
  cheatingCount: number // 누적 부정행위 횟수 (헤더 표시용)
  warningModalCount: number // 경고 모달에 표시할 현재 카운트 (0이면 모달 닫힘)
  confirmWarningModal: () => void
}

export function useExamCheatingFlow({
  initialCount,
  enabled,
  onLimitExceeded,
}: UseExamCheatingFlowOptions): UseExamCheatingFlowResult {
  const [warningModalCount, setWarningModalCount] = useState(0)

  // useCallback으로 감싸야 useCheatingDetector의 deps 배열이 안정적으로 유지된다.
  // 그렇지 않으면 매 렌더마다 새 함수가 생성되어 이벤트 리스너가 반복 재등록된다.
  const onDetect = useCallback((count: number) => {
    setWarningModalCount(count)
  }, [])

  const { cheatingCount } = useCheatingDetector({
    initialCount,
    enabled,
    onDetect,
  })

  const confirmWarningModal = useCallback(() => {
    setWarningModalCount(0)
    if (cheatingCount >= CHEATING_LIMIT) {
      // 한도 도달 시 강제 제출 (ExamContent에서 submit('cheating-limit') 호출됨)
      onLimitExceeded()
    } else {
      // 아직 한도 미달이면 전체화면으로 복귀
      document.documentElement.requestFullscreen().catch(() => {})
    }
  }, [cheatingCount, onLimitExceeded])

  return {
    cheatingCount,
    warningModalCount,
    confirmWarningModal,
  }
}
