function SkeletonBox({ className = '' }: { className?: string }) {
  return (
    <div
      className={['animate-pulse rounded-sm bg-gray-200', className].join(' ')}
    />
  )
}

export function QuizCardSkeleton() {
  return (
    <div className="border-disable flex h-[104px] w-full items-center justify-between rounded-lg border bg-gray-100 px-8 py-7">
      {/* 좌측: 아이콘 + 시험 정보 */}
      <div className="flex items-center gap-4">
        <SkeletonBox className="h-12 w-12 shrink-0" />
        <div className="flex flex-col justify-center gap-2">
          <div className="flex items-center gap-3">
            <SkeletonBox className="h-4 w-36" />
            <SkeletonBox className="h-6 w-14" />
          </div>
          <SkeletonBox className="h-3 w-56" />
        </div>
      </div>

      {/* 우측: 버튼 */}
      <SkeletonBox className="h-9 w-[112px]" />
    </div>
  )
}
