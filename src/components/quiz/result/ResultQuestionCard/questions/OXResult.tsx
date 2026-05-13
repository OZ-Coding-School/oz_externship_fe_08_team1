import { Check, Circle, X } from 'lucide-react'

const OX_OPTIONS = [
  { value: 'O', label: '맞아요' },
  { value: 'X', label: '아니에요' },
] as const

function getOXContainerColor(
  isAnswer: boolean,
  isWrongSubmit: boolean
): string {
  if (isAnswer) return 'bg-success-bg'
  if (isWrongSubmit) return 'bg-error-bg'
  return 'bg-bg-muted'
}

function getOXTextColor(isAnswer: boolean, isWrongSubmit: boolean): string {
  if (isAnswer) return 'text-success-dark'
  if (isWrongSubmit) return 'text-error'
  return 'text-gray-600'
}

export function OXResult({
  answer,
  submittedAnswer,
}: {
  answer: ('O' | 'X')[]
  submittedAnswer: ('O' | 'X')[]
}) {
  return (
    <div className="flex max-w-[308px] flex-col gap-3">
      {OX_OPTIONS.map(({ value, label }) => {
        const isAnswer = answer.includes(value)
        const isSubmitted = submittedAnswer.includes(value)
        const isWrongSubmit = isSubmitted && !isAnswer

        const container = getOXContainerColor(isAnswer, isWrongSubmit)
        const text = getOXTextColor(isAnswer, isWrongSubmit)

        return (
          <div
            key={value}
            className={`flex h-12 items-center gap-2 rounded px-4 ${container}`}
          >
            <span
              className={`flex w-5 shrink-0 items-center justify-center ${text}`}
              aria-hidden="true"
            >
              {value === 'O' ? (
                <Circle size={20} strokeWidth={2} />
              ) : (
                <X size={20} strokeWidth={2.5} />
              )}
            </span>
            <span
              className={`flex-1 text-base leading-[140%] tracking-[-0.03em] ${text}`}
            >
              {label}
            </span>
            {isSubmitted && (
              <Check
                size={18}
                strokeWidth={2}
                className={isAnswer ? 'text-success-dark' : 'text-error'}
                aria-hidden="true"
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
