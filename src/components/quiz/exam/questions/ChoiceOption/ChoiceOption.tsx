import { Check } from 'lucide-react'

interface ChoiceOptionProps {
  type: 'radio' | 'checkbox'
  label: string
  isSelected: boolean
  onClick: () => void
}

export function ChoiceOption({
  type,
  label,
  isSelected,
  onClick,
}: ChoiceOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-3 text-left"
      aria-pressed={isSelected}
    >
      {type === 'radio' ? (
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
      ) : (
        <span
          className={[
            'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-sm border transition-colors',
            isSelected
              ? 'border-primary bg-primary'
              : 'border-gray-350 bg-white',
          ].join(' ')}
        >
          {isSelected && (
            <Check size={10} strokeWidth={1.5} className="text-white" />
          )}
        </span>
      )}
      <span className="text-base leading-normal tracking-[-0.03em] text-gray-800">
        {label}
      </span>
    </button>
  )
}
