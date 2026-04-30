import { useEffect, useRef } from 'react'
import { Button } from '@/components/common/Button'

export interface ProfileDropdownProps {
  isOpen: boolean
  onClose: () => void
  nickname: string
  email: string
  isEnrolled?: boolean
  onEnroll?: () => void
  onMypage?: () => void
  onLogout?: () => void
}

export function ProfileDropdown({
  isOpen,
  onClose,
  nickname,
  email,
  isEnrolled = false,
  onEnroll,
  onMypage,
  onLogout,
}: ProfileDropdownProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleMouseDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        onClose()
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={ref}
      role="menu"
      aria-label="프로필 메뉴"
      className="absolute top-full right-0 z-50 w-[204px] rounded-xl bg-white px-4 py-6 shadow-[0px_0px_16px_0px_rgba(160,160,160,0.25)]"
    >
      <div className="flex flex-col gap-2">
        {/* User info */}
        <div className="flex flex-col gap-3">
          <p className="text-base font-semibold tracking-tight text-gray-900">
            {nickname}
          </p>
          <p className="text-sm tracking-tight break-all text-gray-400">
            {email}
          </p>
        </div>

        {/* Divider */}
        <div className="my-2 border-t border-gray-200" />

        {/* Menu */}
        <nav className="flex flex-col gap-1">
          {!isEnrolled && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              role="menuitem"
              onClick={onEnroll}
              className="text-text-heading hover:text-primary h-12 justify-start"
            >
              수강생 등록
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            role="menuitem"
            onClick={onMypage}
            className="text-text-heading hover:text-primary h-12 justify-start tracking-tight"
          >
            마이페이지
          </Button>
          <Button
            variant="ghost"
            size="sm"
            fullWidth
            role="menuitem"
            onClick={onLogout}
            className="text-text-heading hover:text-primary h-12 justify-start tracking-tight"
          >
            로그아웃
          </Button>
        </nav>
      </div>
    </div>
  )
}
