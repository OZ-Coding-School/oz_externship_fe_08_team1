export function ShortAnswerResult({
  submittedAnswer,
  isCorrect,
}: {
  submittedAnswer: string[]
  isCorrect: boolean
}) {
  return (
    <div className="flex max-w-[648px] flex-col gap-2">
      <div className="bg-bg-muted flex h-12 max-w-[648px] items-center rounded px-4">
        <span
          className={`text-base leading-[140%] tracking-[-0.03em] ${isCorrect ? 'text-success-dark' : 'text-error'}`}
        >
          {submittedAnswer[0] || '(미입력)'}
        </span>
      </div>
    </div>
  )
}
