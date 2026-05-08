import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { CloseIcon } from './icons'

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  /** Override the default max-width class */
  maxWidth?: string
  /** Hide the X close button */
  hideCloseButton?: boolean
  /** Override the body wrapper className (e.g. 'overflow-visible' for dropdowns) */
  bodyClassName?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'max-w-md',
  hideCloseButton = false,
  bodyClassName = 'overflow-visible',
}: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  // Save focus and lock scroll when opening
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4 backdrop-blur-sm"
    >
      <div
        className={[
          'bg-bg-base relative flex w-full flex-col rounded-xl shadow-xl',
          maxWidth,
        ].join(' ')}
      >
        {/* Close button */}
        {!hideCloseButton && (
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text-heading hover:bg-bg-muted focus-visible:ring-primary absolute top-4 right-4 shrink-0 rounded-lg p-1 transition-colors duration-150 outline-none focus-visible:ring-2"
          >
            <CloseIcon />
          </button>
        )}

        {/* Header */}
        {(title || description) && (
          <div className="flex flex-col gap-3 px-6 pt-14">
            {title && (
              <h2 className="text-text-heading text-xl font-semibold">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-text-muted text-sm">{description}</p>
            )}
          </div>
        )}

        {/* Body */}
        <div className={`flex-1 px-6 py-5 ${bodyClassName}`}>{children}</div>
      </div>
    </div>,
    document.body
  )
}
