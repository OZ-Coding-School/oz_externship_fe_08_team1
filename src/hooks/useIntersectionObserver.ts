import { useEffect, useLayoutEffect, useRef } from 'react'

interface UseIntersectionObserverOptions {
  onIntersect: () => void
  enabled?: boolean
}

export function useIntersectionObserver({
  onIntersect,
  enabled = true,
}: UseIntersectionObserverOptions) {
  const ref = useRef<HTMLDivElement>(null)
  const onIntersectRef = useRef(onIntersect)
  useLayoutEffect(() => {
    onIntersectRef.current = onIntersect
  })

  useEffect(() => {
    if (!enabled || !ref.current) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onIntersectRef.current()
        }
      },
      { threshold: 0.1 }
    )

    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [enabled])

  return ref
}
