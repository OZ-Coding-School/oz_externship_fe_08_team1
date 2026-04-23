import { useNavigate } from 'react-router'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import type { DeploymentListItem } from '@/features/exams/deployments'

interface QuizCardProps {
  item: DeploymentListItem
}

function StatusBadge({ isDone }: { isDone: boolean }) {
  return (
    <span
      className={[
        'inline-flex h-6 items-center rounded-sm px-2 text-xs leading-[140%] font-normal tracking-[-0.03em]',
        isDone
          ? 'bg-success-bg text-success-dark'
          : 'bg-error-bg text-error-dark',
      ].join(' ')}
    >
      {isDone ? '응시완료' : '미응시'}
    </span>
  )
}

export function QuizCard({ item }: QuizCardProps) {
  const navigate = useNavigate()
  const { id, exam, exam_info, question_count, total_score } = item
  const isDone = exam_info.status === 'done'

  const subtitle = isDone
    ? `${exam.subject.title} · ${exam_info.score ?? 0}점/${total_score}점 · ${exam_info.correct_answer_count ?? 0}/${question_count}개 정답`
    : `${exam.subject.title} · 응시하고 점수를 확인해보세요!`

  return (
    <div className="border-disable flex h-[104px] w-full items-center justify-between rounded-lg border bg-gray-100 px-8 py-7">
      {/* 좌측: 아이콘 + 시험 정보 */}
      <div className="flex items-center gap-4">
        <div className="bg-primary-100 flex h-12 w-12 shrink-0 items-center justify-center p-[10px]">
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
            <StatusBadge isDone={isDone} />
          </div>
          <span className="text-sm leading-[140%] tracking-[-0.03em] text-gray-700">
            {subtitle}
          </span>
        </div>
      </div>

      {/* 우측: CTA 버튼 */}
      <Button
        variant="outline"
        size="md"
        className="w-[112px]"
        onClick={() =>
          navigate(
            isDone
              ? ROUTES.QUIZ.RESULT.replace(':quizId', String(id))
              : ROUTES.QUIZ.EXAM.replace(':quizId', String(id))
          )
        }
      >
        {isDone ? '상세보기' : '응시하기'}
      </Button>
    </div>
  )
}
