export type UserRole = 'USER' | 'STUDENT' | 'ADMIN'
export type UserPosition = 'TA' | 'OM' | 'LC' | 'ENROLLED'

// 사용자 정보 응답 타입 (실제 API 명세서 기준)
export interface MeResponse {
  id: number
  email: string
  nickname: string
  name: string
  phone_number: string
  birthday: string | null
  gender: 'M' | 'F' | null
  profile_img_url: string | null
  cohort_id: number | null
  role: UserRole
  position: UserPosition | null
  created_at: string
}

export interface MeUpdateRequest {
  nickname?: string
  name?: string
  birthday?: string
  gender?: 'M' | 'F'
}

export interface MeUpdateResponse {
  id: number
  email: string
  nickname: string
  name: string
  birthday: string | null
  gender: 'M' | 'F' | null
  phone_number: string
  updated_at: string
}

export interface WithdrawRequest {
  password: string
  reason: WithdrawReason
}

export type WithdrawReason =
  | 'FOUND_BETTER_SERVICE'
  | 'GRADUATION'
  | 'LACK_OF_CONTENT'
  | 'LACK_OF_INTEREST'
  | 'NO_LONGER_NEEDED'
  | 'OTHER'
  | 'POOR_SERVICE_QUALITY'
  | 'PRIVACY_CONCERNS'
  | 'TECHNICAL_ISSUES'
  | 'TOO_DIFFICULT'
  | 'TRANSFER'

export const WITHDRAW_REASONS = [
  { value: 'LACK_OF_CONTENT', label: '원하는 종류의 강의가 없어서' },
  {
    value: 'FOUND_BETTER_SERVICE',
    label: '타 부트캠프에 더 양질의 콘텐츠가 있어서',
  },
  { value: 'POOR_SERVICE_QUALITY', label: '사이트내 UX/UI가 불편해서' },
  { value: 'GRADUATION', label: '부트캠프를 수강 완료해서' },
  { value: 'LACK_OF_INTEREST', label: '학습에 대한 흥미가 줄어서' },
  { value: 'NO_LONGER_NEEDED', label: '더 이상 필요하지 않아서' },
  { value: 'PRIVACY_CONCERNS', label: '개인정보 보호가 걱정되어서' },
  { value: 'TECHNICAL_ISSUES', label: '기술적인 문제가 지속되어서' },
  { value: 'TOO_DIFFICULT', label: '학습 난이도가 너무 높아서' },
  { value: 'TRANSFER', label: '다른 플랫폼으로 이동해서' },
  { value: 'OTHER', label: '기타(직접입력)' },
] as const
