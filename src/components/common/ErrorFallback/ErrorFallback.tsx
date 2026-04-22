interface ErrorFallbackProps {
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorFallback({
  message,
  onRetry,
  className = '',
}: ErrorFallbackProps) {
  return (
    <div
      className={[
        'flex flex-col items-center gap-4 py-20 text-center',
        className,
      ].join(' ')}
    >
      <p className="text-sm text-gray-500">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="text-primary text-sm underline">
          다시 시도
        </button>
      )}
    </div>
  )
}
