interface MultipleChoiceQuestionProps {
  options: string[]
  answer: string[]
  onChange: (answer: string[]) => void
}

export function MultipleChoiceQuestion({
  options,
  answer,
  onChange,
}: MultipleChoiceQuestionProps) {
  const toggle = (option: string) => {
    if (answer.includes(option)) {
      onChange(answer.filter((a) => a !== option))
    } else {
      onChange([...answer, option])
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {options.map((option, index) => {
        const isSelected = answer.includes(option)
        return (
          <button
            key={index}
            type="button"
            onClick={() => toggle(option)}
            className="flex items-center gap-3 text-left"
            aria-pressed={isSelected}
          >
            {/* 체크박스 */}
            <span
              className={[
                'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border transition-colors',
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-gray-350 bg-white',
              ].join(' ')}
            >
              {isSelected && (
                <svg
                  width="10"
                  height="8"
                  viewBox="0 0 10 8"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M1 4L3.5 6.5L9 1"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>

            {/* 옵션 텍스트 */}
            <span className="text-base leading-normal tracking-[-0.03em] text-gray-800">
              {option}
            </span>
          </button>
        )
      })}
    </div>
  )
}
