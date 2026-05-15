import { useState, useEffect, useRef, useCallback } from 'react'

interface UseVerificationTimerOptions {
  ttlSeconds?: number
  onExpire?: () => void
}

interface UseVerificationTimerResult {
  timeLeft: number
  isTimedOut: boolean
  isActive: boolean
  formattedTime: string
  start: () => void
  stop: () => void
  reset: () => void
}

export function useVerificationTimer({
  ttlSeconds = 300,
  onExpire,
}: UseVerificationTimerOptions = {}): UseVerificationTimerResult {
  const [timeLeft, setTimeLeft] = useState(ttlSeconds)
  const [endTime, setEndTime] = useState<number | null>(null)
  const [timerActive, setTimerActive] = useState(false)
  const [isTimedOut, setIsTimedOut] = useState(false)
  const onExpireRef = useRef(onExpire)

  useEffect(() => {
    onExpireRef.current = onExpire
  })

  useEffect(() => {
    if (!timerActive || endTime === null) return
    const id = setInterval(() => {
      const remaining = Math.max(0, Math.round((endTime - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining <= 0) {
        clearInterval(id)
        setTimerActive(false)
        setIsTimedOut(true)
        onExpireRef.current?.()
      }
    }, 1000)
    return () => clearInterval(id)
  }, [timerActive, endTime])

  const start = useCallback(() => {
    setTimeLeft(ttlSeconds)
    setEndTime(Date.now() + ttlSeconds * 1000)
    setTimerActive(true)
    setIsTimedOut(false)
  }, [ttlSeconds])

  const stop = useCallback(() => {
    setTimerActive(false)
    setEndTime(null)
  }, [])

  const reset = useCallback(() => {
    setTimeLeft(ttlSeconds)
    setEndTime(null)
    setTimerActive(false)
    setIsTimedOut(false)
  }, [ttlSeconds])

  const m = Math.floor(timeLeft / 60)
  const s = timeLeft % 60
  const formattedTime = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`

  return {
    timeLeft,
    isTimedOut,
    isActive: timerActive,
    formattedTime,
    start,
    stop,
    reset,
  }
}
