import { useState, useEffect, useRef } from 'react'

interface UseExamTimerOptions {
  initialSeconds: number
  onExpire: () => void
}

interface UseExamTimerResult {
  remainingSeconds: number
  formattedTime: string
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function useExamTimer({
  initialSeconds,
  onExpire,
}: UseExamTimerOptions): UseExamTimerResult {
  const [remainingSeconds, setRemainingSeconds] = useState(
    Math.max(0, initialSeconds)
  )
  const onExpireRef = useRef(onExpire)
  // Strict Mode 더블 마운트 또는 cleanup 후 재큐잉으로 onExpire 중복 호출 방지
  const expiredRef = useRef(false)
  const expireTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingSeconds((prev) => {
        const next = prev - 1
        if (next <= 0) {
          clearInterval(timer)
          if (!expiredRef.current) {
            expiredRef.current = true
            expireTimeoutRef.current = window.setTimeout(
              () => onExpireRef.current(),
              0
            )
          }
          return 0
        }
        return next
      })
    }, 1000)

    return () => {
      clearInterval(timer)
      if (expireTimeoutRef.current !== null) {
        clearTimeout(expireTimeoutRef.current)
      }
    }
  }, [])

  return {
    remainingSeconds,
    formattedTime: formatTime(remainingSeconds),
  }
}
