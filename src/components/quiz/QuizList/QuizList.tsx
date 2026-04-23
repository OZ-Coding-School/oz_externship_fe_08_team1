import { Spinner } from '@/components'
import { QuizCard } from '@/components/quiz/QuizCard'
import { useDeployments } from '@/features/exams/deployments'
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver'
import type { DeploymentsParams } from '@/features/exams/deployments'

interface QuizListProps {
  params: Omit<DeploymentsParams, 'page'>
}

export function QuizList({ params }: QuizListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useDeployments(params)

  const items = data.pages.flatMap((page) => page.results)

  const sentinelRef = useIntersectionObserver({
    onIntersect: () => {
      if (hasNextPage && !isFetchingNextPage) fetchNextPage()
    },
    enabled: hasNextPage,
  })

  if (items.length === 0) {
    return (
      <p className="py-20 text-center text-sm text-gray-500">
        쪽지시험 목록이 없습니다.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <QuizCard key={item.id} item={item} />
      ))}

      <div ref={sentinelRef} className="h-1" />

      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      )}
    </div>
  )
}
