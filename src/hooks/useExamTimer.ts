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
  const onExpireRef = useRef(onExpire)
  // Strict Mode 더블 마운트 또는 cleanup 후 재큐잉으로 onExpire 중복 호출 방지
  const expiredRef = useRef(false)
  const expireTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    setRemainingSeconds(Math.max(0, initialSeconds))
  }, [initialSeconds])

  useEffect(() => {
    if (!enabled) return

    expiredRef.current = false

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
        expireTimeoutRef.current = null
      }
    }
  }, [initialSeconds, enabled])

  return { remainingSeconds }
}
