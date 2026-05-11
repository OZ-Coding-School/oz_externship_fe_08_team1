import { useState } from 'react'
import { X, AlertCircle } from 'lucide-react'

export function ExamWarningBanner() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className="bg-primary-100 mb-6 rounded-lg px-6 py-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 shrink-0">
            <AlertCircle
              size={24}
              className="text-error stroke-primary-100"
              fill="currentColor"
              aria-hidden="true"
            />
          </span>
          <div className="flex flex-col gap-5">
            <p className="text-lg leading-normal font-semibold tracking-[-0.03em] text-gray-900">
              시험에만 집중해 주세요
            </p>
            <p className="text-base leading-normal tracking-[-0.03em] text-gray-900">
              탭이나 창을 이동하면 부정행위로 처리돼 시험이 중단될 수 있어요.
              안정적인 환경에서 시험을 이어가 주세요.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          aria-label="배너 닫기"
          className="shrink-0 text-gray-900 transition-opacity hover:opacity-60"
        >
          <X size={24} aria-hidden="true" />
        </button>
      </div>
    </div>
  )
}
