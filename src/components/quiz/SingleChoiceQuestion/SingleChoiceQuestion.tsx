import { ChoiceOption } from '@/components/quiz/ChoiceOption'

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
      {options.map((option, index) => (
        <ChoiceOption
          key={index}
          type="radio"
          label={option}
          isSelected={answer === option}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  )
}
