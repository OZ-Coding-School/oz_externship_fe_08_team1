// 사용자 정보 응답 타입 (실제 API 명세서 기준)
export interface MeResponse {
  id: number
  email: string
  nickname: string
  name: string
  phone_number: string
  birthday: string
  gender: 'M' | 'F'
  profile_img_url: string | null
  cohort_id: number | null
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
  birthday: string
  gender: 'M' | 'F'
  phone_number: string
  updated_at: string
}
