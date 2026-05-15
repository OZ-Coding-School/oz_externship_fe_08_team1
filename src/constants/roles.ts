import type { UserRole, UserPosition } from '@/features/accounts/me/types'

type RoleOrPosition = UserRole | UserPosition

// 답변 작성/수정 허용 role (USER 제외)
export const ANSWER_ALLOWED_ROLES: ReadonlySet<RoleOrPosition> =
  new Set<RoleOrPosition>(['STUDENT', 'TA', 'OM', 'LC', 'ADMIN'])
