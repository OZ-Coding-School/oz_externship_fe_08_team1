import { indexToLetter } from '@/utils/indexToLetter'

interface FillBlankQuestionProps {
  prompt: string
  answer: string[]
  onChange: (answer: string[]) => void
}

export function FillBlankQuestion({
  prompt,
  answer,
  onChange,
}: FillBlankQuestionProps) {
  const segments = prompt.split('[blank]')

  const handleChange = (index: number, value: string) => {
    const next = [...answer]
    next[index] = value
    onChange(next)
  }

  return (
    <div className="flex max-w-[648px] flex-col gap-5">
      {/* 지문: [blank] → (A) ________ 볼드 표시 */}
      <div className="bg-bg-prompt rounded px-4 py-5">
        <p className="text-base leading-normal tracking-[-0.03em] whitespace-pre-wrap text-gray-800">
          {segments.map((segment, i) => (
            <span key={i}>
              {segment}
              {i < segments.length - 1 && (
                <strong className="font-bold">
                  ({indexToLetter(i)}) ________
                </strong>
              )}
            </span>
          ))}
        </p>
      </div>

      {/* 빈칸 입력: A, B, C... 라벨 포함 */}
      <div className="flex flex-col gap-3">
        {answer.map((val, i) => (
          <div
            key={i}
            className="bg-bg-muted flex h-12 max-w-[308px] items-center gap-2 rounded px-4 py-[10px]"
          >
            <span className="shrink-0 text-base leading-normal font-semibold tracking-[-0.03em] text-gray-800">
              {indexToLetter(i)}
            </span>
            <input
              type="text"
              value={val}
              onChange={(e) => handleChange(i, e.target.value)}
              placeholder="정답을 입력해 주세요."
              aria-label={`빈칸 ${indexToLetter(i)}`}
              className="placeholder:text-gray-350 flex-1 bg-transparent text-base leading-normal tracking-[-0.03em] text-gray-800 outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
