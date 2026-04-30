export interface SocialLoginCallbackParams {
  provider: 'kakao' | 'naver'
  is_success: 'true' | 'false'
}

export interface RefreshResponse {
  access_token: string
}
