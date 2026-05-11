// 시험 남은 시간을 1초 단위로 카운트다운하는 훅.
// enabled가 false면 타이머가 멈춘다 (제출 완료 후 타이머 정지에 사용).
import { useState, useEffect, useRef } from 'react'

interface UseExamTimerOptions {
  initialSeconds: number
  enabled?: boolean
  onExpire: () => void
}

interface UseExamTimerResult {
  remainingSeconds: number
}

export function useExamTimer({
  initialSeconds,
  enabled = true,
  onExpire,
}: UseExamTimerOptions): UseExamTimerResult {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, initialSeconds)
  )
  // onExpire를 ref에 저장해 setInterval 클로저가 항상 최신 함수를 호출하게 한다.
  // 없으면 interval 생성 시점의 onExpire만 참조해 최신 submit 콜백을 놓칠 수 있다.
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  }, [onExpire])

  // remainingSeconds를 ref로도 보관해 interval effect deps에 넣지 않고도
  // 만료 여부 가드에 사용할 수 있게 한다 (매초 interval 재생성 방지).
  const remainingSecondsRef = useRef(remainingSeconds)

  useEffect(() => {
    remainingSecondsRef.current = remainingSeconds
  }, [remainingSeconds])

  useEffect(() => {
    setRemainingSeconds(Math.max(0, initialSeconds))
  }, [initialSeconds])

  useEffect(() => {
    if (!enabled) return
    // 에러 복구 등으로 enabled가 다시 true가 되더라도, 이미 만료된 상태면
    // interval을 재시작하지 않는다. 그렇지 않으면 onExpire가 즉시 재호출되어
    // 무한 재제출이 발생할 수 있다.
    if (remainingSecondsRef.current <= 0) return

    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timer)
          onExpireRef.current()
          return 0
        }
        return next
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [enabled])

  return { remainingSeconds }
}
