import { Check } from 'lucide-react'

function getChoiceTextColor(isCorrect: boolean, isSubmitted: boolean): string {
  if (isCorrect) return 'text-success-dark'
  if (isSubmitted) return 'text-error'
  return 'text-gray-800'
}

export function ChoiceResult({
  options,
  answer,
  submittedAnswer,
  multi,
}: {
  options: string[]
  answer: string[]
  submittedAnswer: string[]
  multi: boolean
}) {
  return (
    <div className="flex flex-col gap-3">
      {options.map((option, i) => {
        const isSubmitted = submittedAnswer.includes(option)
        const isCorrect = answer.includes(option)
        const textColor = getChoiceTextColor(isCorrect, isSubmitted)

        return (
          <div key={`${i}-${option}`} className="flex items-center gap-3">
            {multi ? (
              <span
                className={[
                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border transition-colors',
                  isSubmitted
                    ? 'border-primary bg-primary'
                    : 'border-gray-350 bg-white',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSubmitted && (
                  <Check size={10} strokeWidth={1.5} className="text-white" />
                )}
              </span>
            ) : (
              <span
                className={[
                  'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors',
                  isSubmitted
                    ? 'border-primary bg-primary'
                    : 'border-gray-350 bg-white',
                ].join(' ')}
                aria-hidden="true"
              >
                {isSubmitted && (
                  <span className="h-2 w-2 rounded-full bg-white" />
                )}
              </span>
            )}
            <span
              className={`text-base leading-[140%] tracking-[-0.03em] ${textColor}`}
            >
              {option}
            </span>
          </div>
        )
      })}
    </div>
  )
}
