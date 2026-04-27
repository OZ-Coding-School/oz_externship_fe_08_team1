interface SingleChoiceQuestionProps {
  options: string[]
  answer: string
  onChange: (answer: string) => void
}

export function SingleChoiceQuestion({
  options,
  answer,
  onChange,
}: SingleChoiceQuestionProps) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option, index) => {
        const isSelected = answer === option
        return (
          <button
            key={index}
            type="button"
            onClick={() => onChange(option)}
            className="flex items-center gap-3 text-left"
            aria-pressed={isSelected}
          >
            {/* 라디오 원 */}
            <span
              className={[
                'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                isSelected
                  ? 'border-primary bg-primary'
                  : 'border-gray-350 bg-white',
              ].join(' ')}
            >
              {isSelected && <span className="h-2 w-2 rounded-full bg-white" />}
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
