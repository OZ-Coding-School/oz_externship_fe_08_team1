import { indexToLetter } from '@/utils/indexToLetter'

export function OrderingResult({
  options,
  answer,
  submittedAnswer,
}: {
  options: string[]
  answer: string[]
  submittedAnswer: string[]
}) {
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

      {/* 제출된 순서 슬롯: 정답과 일치 여부에 따라 색상 표시 */}
      <div className="flex flex-wrap gap-[10px]">
        {submittedAnswer.map((item, i) => {
          const isCorrectPos = item === answer[i]
          const letterIdx = options.indexOf(item)
          const letter = letterIdx >= 0 ? indexToLetter(letterIdx) : '?'
          return (
            <div
              key={`${i}-${item}`}
              className={`bg-disable flex h-[62px] w-[62px] items-center justify-center rounded text-xl font-bold tracking-[-0.03em] ${isCorrectPos ? 'text-success-dark' : 'text-error'}`}
            >
              {letter}
            </div>
          )
        })}
      </div>
    </div>
  )
}
