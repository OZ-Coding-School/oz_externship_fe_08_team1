interface ShortAnswerQuestionProps {
  answer: string
  onChange: (answer: string) => void
}

export function ShortAnswerQuestion({
  answer,
  onChange,
}: ShortAnswerQuestionProps) {
  return (
    <div className="max-w-[648px]">
      <input
        type="text"
        value={answer}
        onChange={(e) => onChange(e.target.value)}
        placeholder="20글자 이내로 입력해 주세요."
        className="bg-bg-muted placeholder:text-gray-350 h-12 w-full rounded px-4 py-[10px] text-base leading-normal tracking-[-0.03em] text-gray-800 outline-none"
      />
    </div>
  )
}
