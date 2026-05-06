import { ChoiceOption } from '@/components/quiz/exam/questions/ChoiceOption'

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
      {options.map((option, index) => (
        <ChoiceOption
          key={index}
          type="checkbox"
          label={option}
          isSelected={answer.includes(option)}
          onClick={() => toggle(option)}
        />
      ))}
    </div>
  )
}
