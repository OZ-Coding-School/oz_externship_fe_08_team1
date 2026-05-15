import { indexToLetter } from '@/utils/indexToLetter'

export function OrderingResult({
  options,
  answer,
  submittedAnswer,
  isCorrect,
}: {
  options: string[]
  answer: string[]
  submittedAnswer: string[]
  isCorrect: boolean
}) {
  const toLetter = (item: string) => {
    const idx = options.indexOf(item)
    return idx >= 0 ? indexToLetter(idx) : '?'
  }

  return (
    <div className="flex max-w-[648px] flex-col gap-4">
      {/* 선택지 목록 */}
      <div className="bg-bg-prompt flex flex-col gap-5 rounded px-4 py-5">
        {options.map((option, i) => (
          <div key={`${i}-${option}`} className="flex items-center gap-2">
            <span className="bg-primary-100 text-primary flex h-8 w-8 shrink-0 items-center justify-center rounded text-lg font-normal tracking-[-0.03em]">
              {indexToLetter(i)}
            </span>
            <span className="text-base leading-[140%] tracking-[-0.03em] text-gray-800">
              {option}
            </span>
          </div>
        ))}
      </div>

      {/* 제출 순서 슬롯: 위치별 정오 색상 */}
      <div className="flex flex-wrap gap-[10px]">
        {submittedAnswer.map((item, i) => (
          <div
            key={`submitted-${i}`}
            className={`bg-disable flex h-[62px] w-[62px] items-center justify-center rounded text-xl font-bold tracking-[-0.03em] ${item === answer[i] ? 'text-success-dark' : 'text-error'}`}
          >
            {toLetter(item)}
          </div>
        ))}
      </div>

      {/* 오답일 때만: 정답 순서 슬롯 초록색으로 표시 */}
      {!isCorrect && (
        <div className="flex flex-wrap gap-[10px]">
          {answer.map((item, i) => (
            <div
              key={`answer-${i}`}
              className="bg-disable text-success-dark flex h-[62px] w-[62px] items-center justify-center rounded text-xl font-bold tracking-[-0.03em]"
            >
              {toLetter(item)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
