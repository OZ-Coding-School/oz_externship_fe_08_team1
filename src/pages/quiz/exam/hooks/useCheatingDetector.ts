// 부정행위를 감지하는 훅. 세 가지 이벤트를 감시한다:
//   - visibilitychange: 다른 탭으로 전환 시 (document.hidden === true)
//   - fullscreenchange: 전체화면 이탈 시 (document.fullscreenElement === null)
//   - window blur: 다른 앱/창으로 포커스 이동 시 (듀얼 모니터 감지 포함)
// enabled가 false면 이벤트 리스너를 붙이지 않는다 (제출 후 감지 중단).
import { useEffect, useRef, useState } from 'react'

interface UseCheatingDetectorOptions {
  initialCount: number
  enabled: boolean
  onDetect?: (count: number) => void
}

interface UseCheatingDetectorResult {
  cheatingCount: number
}

// 탭 전환과 전체화면 해제가 동시에 발생할 수 있어 300ms 이내 중복 이벤트는 한 번으로 처리
const DUPLICATE_IGNORE_MS = 300

export function useCheatingDetector({
  initialCount,
  enabled,
  onDetect,
}: UseCheatingDetectorOptions): UseCheatingDetectorResult {
  const [cheatingCount, setCheatingCount] = useState(initialCount)
  // 마지막으로 부정행위가 감지된 시각
  const lastDetectedAtRef = useRef(0)

  // onDetect를 ref에 보관해 deps에서 제외한다.
  // deps에 포함하면 외부에서 매 렌더 새 함수가 들어올 때 listener가 detach/attach되며
  // 그 사이에 발생한 이벤트가 손실되어 부정행위 감지 누락 버그가 생긴다.
  const onDetectRef = useRef(onDetect)

  const enabledRef = useRef(enabled)

  useEffect(() => {
    onDetectRef.current = onDetect
  }, [onDetect])

  useEffect(() => {
    enabledRef.current = enabled
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    // increaseCount는 부정행위 1회를 카운트하는 역할.
    // 300ms 내 중복 이벤트를 무시하고, ref 가드로 제출 직후 오탐을 차단한다.
    const increaseCount = () => {
      // enabled가 false로 바뀐 직후 React 재렌더 전에 이벤트가 올 수 있다.
      // ref는 렌더 중 즉시 갱신되므로 effect 갱신보다 빠르게 최신값을 확인할 수 있다.
      if (!enabledRef.current) return
      const now = Date.now()

      if (now - lastDetectedAtRef.current < DUPLICATE_IGNORE_MS) {
        return
      }

      lastDetectedAtRef.current = now

      // setState updater는 순수해야 한다 (StrictMode dev에서 이중 호출됨).
      // onDetect 호출은 별도 effect로 분리한다.
      setCheatingCount((prev) => prev + 1)
    }

    // handleVisibilityChange는 탭/앱 전환을 감지하는 역할.
    const handleVisibilityChange = () => {
      if (document.hidden) increaseCount()
    }

    // handleFullscreenChange는 전체화면 이탈을 감지하는 역할.
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) increaseCount()
    }

    // handleWindowBlur는 다른 앱/창으로 포커스가 이동할 때 감지하는 역할.
    // visibilitychange는 탭 전환만 잡지만, blur는 듀얼 모니터에서
    // 다른 창을 클릭하는 경우도 잡는다.
    const handleWindowBlur = () => {
      increaseCount()
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    document.addEventListener('fullscreenchange', handleFullscreenChange)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [enabled])

  // cheatingCount가 initialCount보다 커진 시점, 즉 새 부정행위가 감지된 시점에만 콜백 호출
  useEffect(() => {
    if (cheatingCount > initialCount) {
      onDetectRef.current?.(cheatingCount)
    }
  }, [cheatingCount, initialCount])

  return { cheatingCount }
}
