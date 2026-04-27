import { OXQuestion } from '@/components/quiz/OXQuestion'
import { SingleChoiceQuestion } from '@/components/quiz/SingleChoiceQuestion'
import { MultipleChoiceQuestion } from '@/components/quiz/MultipleChoiceQuestion'
import { ShortAnswerQuestion } from '@/components/quiz/ShortAnswerQuestion'
import { OrderingQuestion } from '@/components/quiz/OrderingQuestion'
import { FillBlankQuestion } from '@/components/quiz/FillBlankQuestion'
import type { Question } from '@/features/exams/deployment-detail'

const TYPE_LABELS: Record<Question['type'], string> = {
  ox: 'OX선택',
  single_choice: '단일선택',
  multiple_choice: '다중선택',
  short_answer: '단답형',
  ordering: '순서배열',
  fill_blank: '빈칸식',
}

interface QuestionCardProps {
  question: Question
  answer: string | string[]
  onChange: (answer: string | string[]) => void
}

export function QuestionCard({
  question,
  answer,
  onChange,
}: QuestionCardProps) {
  const renderInput = () => {
    switch (question.type) {
      case 'ox':
      case 'single_choice':
      case 'short_answer': {
        if (typeof answer !== 'string') return null
        if (question.type === 'ox') {
          return <OXQuestion answer={answer} onChange={onChange} />
        }
        if (question.type === 'single_choice') {
          return (
            <SingleChoiceQuestion
              options={question.options ?? []}
              answer={answer}
              onChange={onChange}
            />
          )
        }
        return <ShortAnswerQuestion answer={answer} onChange={onChange} />
      }
      case 'multiple_choice':
      case 'ordering':
      case 'fill_blank': {
        if (!Array.isArray(answer)) return null
        if (question.type === 'multiple_choice') {
          return (
            <MultipleChoiceQuestion
              options={question.options ?? []}
              answer={answer}
              onChange={onChange}
            />
          )
        }
        if (question.type === 'ordering') {
          return (
            <OrderingQuestion
              options={question.options ?? []}
              answer={answer}
              onChange={onChange}
            />
          )
        }
        return (
          <FillBlankQuestion
            prompt={question.prompt ?? ''}
            blankCount={question.blank_count ?? 0}
            answer={answer}
            onChange={onChange}
          />
        )
      }
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {/* 헤더: 번호 + 문제 텍스트 + 배점/유형 뱃지 */}
      <div className="flex items-start gap-4">
        <div className="flex flex-1 items-start py-1">
          <span className="w-8 shrink-0 text-xl leading-normal font-bold tracking-[-0.03em] text-gray-900">
            {question.number}.
          </span>
          <p className="text-xl leading-normal font-bold tracking-[-0.03em] text-gray-900">
            {question.question}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="bg-disable rounded-sm px-3 py-2 text-xs leading-normal tracking-[-0.03em] whitespace-nowrap text-gray-900">
            {question.point}점
          </span>
          <span className="bg-disable rounded-sm px-3 py-2 text-xs leading-normal tracking-[-0.03em] whitespace-nowrap text-gray-900">
            {TYPE_LABELS[question.type]}
          </span>
        </div>
      </div>

      {/* 답안 입력 — 번호(32px) 너비만큼 들여쓰기 */}
      <div className="pl-8">{renderInput()}</div>
    </div>
  )
}
