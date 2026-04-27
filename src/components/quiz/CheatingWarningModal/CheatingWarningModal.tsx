import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import warningSvg from '@/assets/cheating/warning.svg'
import exitSvg from '@/assets/cheating/exit.svg'

interface CheatingWarningModalProps {
  count: number
  isOpen: boolean
  onConfirm: () => void
  onClose: () => void
}

const MESSAGES: Record<1 | 2 | 3, { lines: string[]; button: string }> = {
  1: {
    lines: [
      '다른 화면으로 이동했어요.',
      '부정행위로 간주되며, 누적 시 시험이 종료될 수 있어요.',
    ],
    button: '확인',
  },
  2: {
    lines: [
      '한 번 더 화면을 이탈했어요.',
      '3회 이상 감지되면 시험이 자동 종료됩니다.',
    ],
    button: '확인',
  },
  3: {
    lines: [
      '세 번째 이탈이 감지됐어요.',
      '부정행위로 처리되어 시험이 종료됩니다.',
    ],
    button: '시험종료',
  },
}

function ModalIcon({ count }: { count: 1 | 2 | 3 }) {
  if (count >= 3)
    return (
      <img
        src={exitSvg}
        alt=""
        aria-hidden="true"
        className="h-[106px] w-[72px]"
      />
    )
  return (
    <img
      src={warningSvg}
      alt=""
      aria-hidden="true"
      className="h-[106px] w-[72px]"
    />
  )
}

function ModalTitle({ count }: { count: 1 | 2 | 3 }) {
  const accentColor = count >= 3 ? 'text-error' : 'text-warning'
  return (
    <h3 className="text-text-heading text-xl leading-normal font-semibold tracking-[-0.03em]">
      부정행위 <span className={accentColor}>{count}회</span> 감지
    </h3>
  )
}

export function CheatingWarningModal({
  count,
  isOpen,
  onConfirm,
  onClose,
}: CheatingWarningModalProps) {
  const safeCount = Math.max(1, Math.min(count, 3)) as 1 | 2 | 3
  const msg = MESSAGES[safeCount]
  const final = count >= 3

  return (
    <Modal
      isOpen={isOpen}
      onClose={final ? onConfirm : onClose}
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center gap-6 py-4 text-center">
        <ModalIcon count={safeCount} />

        <div className="flex flex-col gap-2">
          <ModalTitle count={safeCount} />
          <div className="text-text-body flex flex-col text-base leading-normal">
            {msg.lines.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
        </div>

        <Button variant="primary" size="lg" fullWidth onClick={onConfirm}>
          {msg.button}
        </Button>
      </div>
    </Modal>
  )
}
