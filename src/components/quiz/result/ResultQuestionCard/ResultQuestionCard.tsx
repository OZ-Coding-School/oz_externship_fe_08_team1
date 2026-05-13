import { Circle, X } from 'lucide-react'
import type { SubmissionQuestion } from '@/features/exams/submission-detail'
import { OXResult } from './questions/OXResult'
import { ChoiceResult } from './questions/ChoiceResult'
import { ShortAnswerResult } from './questions/ShortAnswerResult'
import { FillBlankResult } from './questions/FillBlankResult'
import { OrderingResult } from './questions/OrderingResult'

const TYPE_LABELS: Record<SubmissionQuestion['type'], string> = {
  ox: 'OX선택',
  single_choice: '단일선택',
  multiple_choice: '다중선택',
  short_answer: '단답형',
  ordering: '순서배열',
  fill_blank: '빈칸식',
}

interface ResultQuestionCardProps {
  question: SubmissionQuestion
  index: number
}

export function ResultQuestionCard({
  question,
  index,
}: ResultQuestionCardProps) {
  const {
    question: text,
    answer,
    submitted_answer,
    point,
    explanation,
    is_correct,
  } = question

  const renderAnswerView = () => {
    switch (question.type) {
      case 'ox':
        return (
          <OXResult
            answer={question.answer}
            submittedAnswer={question.submitted_answer}
          />
        )
      case 'single_choice':
        return (
          <ChoiceResult
            options={question.options}
            answer={answer}
            submittedAnswer={submitted_answer}
            multi={false}
          />
        )
      case 'multiple_choice':
        return (
          <ChoiceResult
            options={question.options}
            answer={answer}
            submittedAnswer={submitted_answer}
            multi={true}
          />
        )
      case 'short_answer':
        return (
          <ShortAnswerResult
            submittedAnswer={submitted_answer}
            isCorrect={is_correct}
          />
        )
      case 'fill_blank':
        return (
          <FillBlankResult
            prompt={question.prompt}
            blankCount={question.blank_count}
            answer={answer}
            submittedAnswer={submitted_answer}
          />
        )
      case 'ordering':
        return (
          <OrderingResult
            options={question.options}
            answer={answer}
            submittedAnswer={submitted_answer}
          />
        )
    }
  }

  return (
    <article className="flex flex-col gap-5">
      {/* 질문 헤더 */}
      <div className="flex items-baseline py-1">
        <span className="w-8 shrink-0 text-xl leading-[140%] font-bold tracking-[-0.03em] text-gray-900">
          {index + 1}.
        </span>
        <h2 className="text-xl leading-[140%] font-bold tracking-[-0.03em] text-gray-900">
          {text}
          <span className="relative -top-0.5 ml-4 inline-flex items-center gap-2 align-top">
            <span className="bg-disable rounded-sm px-3 py-2 text-xs leading-[140%] tracking-[-0.03em] whitespace-nowrap text-gray-900">
              {point}점
            </span>
            <span className="bg-disable rounded-sm px-3 py-2 text-xs leading-[140%] tracking-[-0.03em] whitespace-nowrap text-gray-900">
              {TYPE_LABELS[question.type]}
            </span>
          </span>
        </h2>
      </div>

      {/* 답안 영역 — 번호(w-8=32px)만큼 들여쓰기해 텍스트 시작점과 일치 */}
      <div className="pl-8">{renderAnswerView()}</div>

      {/* 해설 */}
      {explanation && (
        <div className="pl-8">
          <div
            className={`flex items-center gap-3 rounded px-4 py-6 ${is_correct ? 'bg-success-bg' : 'bg-error-bg'}`}
          >
            {is_correct ? (
              <Circle
                size={20}
                strokeWidth={2}
                className="text-success-dark shrink-0"
                aria-hidden="true"
              />
            ) : (
              <X
                size={20}
                strokeWidth={3}
                className="text-error shrink-0"
                aria-hidden="true"
              />
            )}
            <p className="text-base leading-[140%] tracking-[-0.03em] text-black">
              {explanation}
            </p>
          </div>
        </div>
      )}
    </article>
  )
}
