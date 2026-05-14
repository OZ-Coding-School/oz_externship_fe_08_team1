import type { UserPosition } from '@/features/accounts/me/types'

export const POSITION_LABEL: Record<UserPosition, string> = {
  TA: '조교',
  OM: '운영매니저',
  LC: '러닝코치',
  ENROLLED: '',
}
