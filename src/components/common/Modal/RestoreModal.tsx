import { Modal } from './Modal'
import { Button } from '../Button/Button'

export interface RestoreModalProps {
  isOpen: boolean
  onClose: () => void
  icon?: React.ReactNode
  title: string
  description: string
  buttonLabel?: string
  onRestore?: () => void
}

/** Figma 1:3245 — 아이콘 + 제목 + 설명 + 풀너비 CTA (탈퇴 복구) */
export function RestoreModal({
  isOpen,
  onClose,
  icon,
  title,
  description,
  buttonLabel = '계정 다시 사용하기',
  onRestore,
}: RestoreModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-[396px] max-h-[437px]"
    >
      <div className="flex flex-col items-center gap-10 pt-12.5 pb-2">
        <div className="flex flex-col items-center gap-4">
          {icon && (
            <div className="bg-primary-300 flex h-8 w-8 items-center justify-center rounded-full">
              {icon}
            </div>
          )}
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="text-xl leading-[140%] font-bold tracking-tight text-gray-900">
              {title}
            </h2>
            <p className="text-sm leading-[140%] tracking-tight whitespace-pre-line text-gray-600">
              {description}
            </p>
          </div>
        </div>
        <Button variant="primary" fullWidth size="md" onClick={onRestore}>
          <span className="font-normal">{buttonLabel}</span>
        </Button>
      </div>
    </Modal>
  )
}
