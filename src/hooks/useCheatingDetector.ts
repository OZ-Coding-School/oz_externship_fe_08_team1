import { useState, useEffect, useRef } from 'react'

interface UseCheatingDetectorOptions {
  initialCount: number
  onDetect: (count: number) => void
  enabled: boolean
}

interface UseCheatingDetectorResult {
  cheatingCount: number
}

export function useCheatingDetector({
  initialCount,
  onDetect,
  enabled,
}: UseCheatingDetectorOptions): UseCheatingDetectorResult {
  const [cheatingCount, setCheatingCount] = useState(initialCount)
  const onDetectRef = useRef(onDetect)
  // 두 이벤트가 동시에 발생할 때 이중 카운트 방지용 타임스탬프
  const lastDetectedAt = useRef(0)
  const prevCountRef = useRef(initialCount)

  useEffect(() => {
    onDetectRef.current = onDetect
  })

  // setState 업데이터 내부에서 콜백 호출 시 Strict Mode 더블 실행 문제 방지
  useEffect(() => {
    if (cheatingCount > prevCountRef.current) {
      prevCountRef.current = cheatingCount
      onDetectRef.current(cheatingCount)
    }
  }, [cheatingCount])

  // 시험 중 탭 종료 / 새로고침 방지
  useEffect(() => {
    if (!enabled) return
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [enabled])

  useEffect(() => {
    if (!enabled) return

    // 페이지 진입 직후 네비게이션/포커스 전환으로 인한 오탐 방지
    let active = false
    const warmup = setTimeout(() => {
      active = true
    }, 1000)

    const detect = () => {
      if (!active) return
      const now = Date.now()
      // 300ms 내 중복 이벤트 무시 (fullscreenchange + visibilitychange 동시 발생 대응)
      if (now - lastDetectedAt.current < 300) return
      lastDetectedAt.current = now
      setCheatingCount((prev) => prev + 1)
    }

    // 1. 전체화면 이탈 감지 (Escape, alt+tab 등)
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) detect()
    }

    // 2. 탭/창 전환 감지 — 전체화면 미지원 브라우저 fallback 및 보조 감지
    const handleVisibilityChange = () => {
      if (document.hidden) detect()
    }

    // 3. 듀얼모니터 등 다른 앱/창 포커스 감지 — visibilitychange가 발생하지 않는 경우 보완
    const handleWindowBlur = () => {
      if (!document.hasFocus()) detect()
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleWindowBlur)

    return () => {
      clearTimeout(warmup)
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleWindowBlur)
    }
  }, [enabled])

  return { cheatingCount }
}
