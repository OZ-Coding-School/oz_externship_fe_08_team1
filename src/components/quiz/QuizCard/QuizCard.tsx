import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import { QuizCodeModal } from '@/components/quiz/QuizCodeModal'
import type { DeploymentListItem } from '@/features/exams/deployments'

interface QuizCardProps {
  item: DeploymentListItem
}

type QuizCardAction = { type: 'navigate'; path: string } | { type: 'openModal' }

interface QuizCardViewModel {
  badgeLabel: string
  badgeClassName: string
  subtitle: string
  buttonLabel: string
  action: QuizCardAction
}

function getQuizCardViewModel(item: DeploymentListItem): QuizCardViewModel {
  const { id, exam, exam_info, question_count, total_score, is_done } = item

  if (is_done) {
    return {
      badgeLabel: '응시완료',
      badgeClassName: 'bg-success-bg text-success-dark',
      subtitle: `${exam.subject.title} · ${exam_info.score ?? 0}점/${total_score}점 · ${exam_info.correct_answer_count ?? 0}/${question_count}개 정답`,
      buttonLabel: '상세보기',
      action: {
        type: 'navigate',
        path: ROUTES.QUIZ.RESULT.replace(':quizId', String(id)),
      },
    }
  }

  return {
    badgeLabel: '미응시',
    badgeClassName: 'bg-error-bg text-error-dark',
    subtitle: `${exam.subject.title} · 응시하고 점수를 확인해보세요!`,
    buttonLabel: '응시하기',
    action: { type: 'openModal' },
  }
}

function StatusBadge({
  label,
  className,
}: {
  label: string
  className: string
}) {
  return (
    <span
      className={[
        'inline-flex h-6 items-center rounded-sm px-2 text-xs leading-[140%] font-normal tracking-[-0.03em]',
        className,
      ].join(' ')}
    >
      {label}
    </span>
  )
}

export function QuizCard({ item }: QuizCardProps) {
  const navigate = useNavigate()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { exam, duration_time, id, question_count } = item

  const vm = getQuizCardViewModel(item)

  const handleButtonClick = () => {
    if (vm.action.type === 'navigate') {
      navigate(vm.action.path)
    } else {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="border-disable flex h-[104px] w-full items-center justify-between rounded-lg border bg-gray-100 px-8 py-7">
      {/* 좌측: 아이콘 + 시험 정보 */}
      <div className="flex items-center gap-4">
        <div className="bg-primary-100 flex h-12 w-12 shrink-0 items-center justify-center p-2.5">
          <img
            src={exam.thumbnail_img_url}
            alt={exam.title}
            width={28}
            height={28}
            className="h-full w-full object-contain"
          />
        </div>
        <div className="flex flex-col justify-center gap-1">
          <div className="flex items-center gap-3">
            <span className="text-lg leading-[140%] font-semibold tracking-[-0.03em] text-black">
              {exam.title}
            </span>
            <StatusBadge label={vm.badgeLabel} className={vm.badgeClassName} />
          </div>
          <span className="text-sm leading-[140%] tracking-[-0.03em] text-gray-700">
            {vm.subtitle}
          </span>
        </div>
      </div>

      {/* 우측: CTA 버튼 */}
      <Button
        variant="outline"
        size="md"
        className="w-[112px]"
        onClick={handleButtonClick}
      >
        {vm.buttonLabel}
      </Button>

      {vm.action.type === 'openModal' && (
        <QuizCodeModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          deploymentId={id}
          examTitle={exam.title}
          thumbnailUrl={exam.thumbnail_img_url}
          questionCount={question_count}
          durationTime={duration_time}
        />
      )}
    </div>
  )
}
