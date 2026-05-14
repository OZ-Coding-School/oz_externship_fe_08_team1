import type { UserRole } from '@/features/accounts/me/types'

export const ROLE_LABEL: Record<UserRole, string> = {
  USER: '일반 회원',
  STUDENT: '수강생',
  ADMIN: '관리자',
}
