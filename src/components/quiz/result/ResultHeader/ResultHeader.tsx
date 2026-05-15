import { ArrowLeft } from 'lucide-react'

interface ResultHeaderProps {
  examTitle: string
  totalQuestions: number
  cheatingCount: number
  elapsedTime: number
  score: number
  totalScore: number
  onBack: () => void
}

export function ResultHeader({
  examTitle,
  totalQuestions,
  cheatingCount,
  elapsedTime,
  score,
  totalScore,
  onBack,
}: ResultHeaderProps) {
  const minutes = Math.floor(elapsedTime / 60)
  const seconds = elapsedTime % 60
  const elapsedText = minutes > 0 ? `${minutes}분 ${seconds}초` : `${seconds}초`

  const statsText = [
    `총 문항 수: ${totalQuestions}`,
    `부정행위: ${cheatingCount}회`,
    `응시시간: ${elapsedText}`,
    `응시 결과 점수: ${score}점/${totalScore}점`,
  ].join(' ㆍ ')

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white">
      <div className="max-w-container mx-auto flex h-[127px] flex-col justify-center gap-2 px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            aria-label="시험 목록으로 돌아가기"
            className="focus-visible:ring-primary shrink-0 rounded text-gray-900 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <ArrowLeft size={24} aria-hidden="true" />
          </button>
          <span className="text-xl leading-[140%] font-semibold tracking-[-0.03em] text-gray-900">
            {examTitle}
          </span>
        </div>
        <p className="pl-9 text-base leading-[140%] tracking-[-0.03em] text-gray-600">
          {statsText}
        </p>
      </div>
    </header>
  )
}
