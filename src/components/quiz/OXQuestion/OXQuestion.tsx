import { Circle, X, Check } from 'lucide-react'

const OX_CONFIG = [
  { value: 'O', label: '맞아요' },
  { value: 'X', label: '아니에요' },
] as const

interface OXQuestionProps {
  answer: string
  onChange: (answer: string) => void
}

export function OXQuestion({ answer, onChange }: OXQuestionProps) {
  return (
    <div className="flex max-w-[308px] flex-col gap-3">
      {OX_CONFIG.map(({ value, label }) => {
        const isSelected = answer === value
        const isO = value === 'O'

        return (
          <button
            key={value}
            type="button"
            onClick={() => onChange(value)}
            className={[
              'flex h-12 items-center gap-2 rounded px-4 py-[10px] transition-colors duration-150',
              isSelected
                ? 'bg-primary-100 border-primary border'
                : 'bg-bg-muted',
            ].join(' ')}
            aria-pressed={isSelected}
          >
            {/* O / X 아이콘 — currentColor로 부모 text 색상 참조 */}
            <span
              className={[
                'flex w-5 shrink-0 items-center justify-center',
                isSelected
                  ? isO
                    ? 'text-success'
                    : 'text-error'
                  : 'text-gray-350',
              ].join(' ')}
            >
              {isO ? (
                <Circle
                  size={17}
                  aria-hidden="true"
                  stroke="currentColor"
                  fill="none"
                />
              ) : (
                <X size={20} aria-hidden="true" stroke="currentColor" />
              )}
            </span>

            {/* 레이블 */}
            <span
              className={[
                'flex-1 text-left text-base leading-normal tracking-[-0.03em]',
                isSelected ? 'text-primary' : 'text-gray-800',
              ].join(' ')}
            >
              {label}
            </span>

            {/* 체크마크 */}
            <span className={isSelected ? 'text-primary' : 'text-gray-350'}>
              <Check
                size={20}
                aria-hidden="true"
                stroke="currentColor"
                className="transition-colors duration-150"
              />
            </span>
          </button>
        )
      })}
    </div>
  )
}
