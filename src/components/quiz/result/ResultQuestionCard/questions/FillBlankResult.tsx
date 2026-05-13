import { indexToLetter } from '@/utils/indexToLetter'

export function FillBlankResult({
  prompt,
  blankCount,
  answer,
  submittedAnswer,
}: {
  prompt: string
  blankCount: number
  answer: string[]
  submittedAnswer: string[]
}) {
  const segments = prompt.split('[blank]')

  return (
    <div className="flex max-w-[648px] flex-col gap-4">
      {/* 지문 박스 */}
      <div className="bg-bg-prompt rounded px-4 py-5">
        <p className="text-base leading-[140%] tracking-[-0.03em] whitespace-pre-wrap text-gray-800">
          {segments.map((segment, i) => (
            <span key={`${i}-${segment}`}>
              {segment}
              {i < segments.length - 1 && (
                <span className="font-semibold text-gray-800">
                  ({indexToLetter(i)}) ______
                </span>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* 답안 입력칸 표시 */}
      <div className="flex flex-col gap-2">
        {Array.from({ length: blankCount }).map((_, i) => {
          const submitted = submittedAnswer[i] ?? ''
          const correctAns = answer[i] ?? ''
          const isCorrectBlank = submitted === correctAns
          const textColor = isCorrectBlank ? 'text-success-dark' : 'text-error'

          return (
            <div
              key={`${i}-${submitted}`}
              className="bg-bg-muted flex h-12 w-[308px] items-center gap-2 rounded px-4"
            >
              <span
                className={`text-lg font-semibold tracking-[-0.03em] ${textColor}`}
              >
                {indexToLetter(i)}
              </span>
              <span
                className={`text-base leading-[140%] tracking-[-0.03em] ${textColor}`}
              >
                {submitted || '(미입력)'}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
