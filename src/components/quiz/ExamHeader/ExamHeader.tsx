import { ArrowLeft } from 'lucide-react'

interface ExamHeaderProps {
  examTitle: string
  formattedTime: string
  remainingSeconds: number
  cheatingCount: number
  onBack: () => void
}

export function ExamHeader({
  examTitle,
  formattedTime,
  remainingSeconds,
  cheatingCount,
  onBack,
}: ExamHeaderProps) {
  const isUrgent = remainingSeconds > 0 && remainingSeconds <= 60
  const [minutes, seconds] = formattedTime.split(':')

  const timerColor = isUrgent ? 'text-error' : 'text-primary'

  return (
    <header className="border-gray-350 fixed top-0 right-0 left-0 z-40 border-b bg-gray-100">
      {/* 스크린리더용 부정행위 카운트 실시간 알림 */}
      <span className="sr-only" role="status" aria-live="polite">
        {cheatingCount > 0 ? `부정행위 ${cheatingCount}회 감지됨` : ''}
      </span>

      <div className="max-w-container mx-auto flex h-[128px] items-center justify-between px-6">
        {/* 좌측: 뒤로가기 + 시험 제목 + 부제 */}
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="시험 목록으로 돌아가기"
            className="mt-1 shrink-0 text-gray-900"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <div className="flex flex-col gap-5 py-1">
            <span className="text-xl leading-normal font-semibold tracking-[-0.03em] text-gray-900">
              {examTitle}
            </span>
            <span className="text-base leading-normal font-normal tracking-[-0.03em] text-gray-600">
              집중해서 천천히, 끝까지 응시해 주세요. 응원할게요 💪
            </span>
          </div>
        </div>

        {/* 우측: 타이머 + 부정행위 */}
        <div className="flex items-center gap-6">
          {/* 타이머 pill */}
          <div className="border-disable flex items-center gap-[2px] rounded-full border bg-white px-4 py-4">
            <span
              className={`text-lg leading-normal font-semibold tracking-[-0.03em] ${timerColor}`}
            >
              {minutes}
            </span>
            <span className={`text-lg font-semibold ${timerColor}`}>:</span>
            <span
              className={`text-lg leading-normal font-semibold tracking-[-0.03em] ${timerColor}`}
            >
              {seconds}
            </span>
            <span
              className={`ml-2 text-lg leading-normal font-semibold tracking-[-0.03em] ${timerColor}`}
            >
              뒤에 끝나요
            </span>
          </div>

          {/* 부정행위 pill */}
          <div
            className="border-disable flex items-center gap-[14px] rounded-full border bg-white px-4 py-4"
            aria-label={`부정행위 ${cheatingCount}회 감지됨`}
          >
            <span
              className="text-lg leading-normal font-semibold tracking-[-0.03em] text-gray-700"
              aria-hidden="true"
            >
              부정행위
            </span>
            <div className="flex gap-2" aria-hidden="true">
              {[1, 2, 3].map((n) => {
                const filled = cheatingCount >= n
                const isDanger = n === 3 && filled
                return (
                  <span
                    key={n}
                    className={[
                      'inline-block h-[26.667px] w-5 rounded-sm border-[1.5px]',
                      isDanger
                        ? 'border-error bg-error'
                        : filled
                          ? 'border-warning bg-warning'
                          : 'border-gray-350 bg-gray-100',
                    ].join(' ')}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
