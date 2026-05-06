import { http, HttpResponse } from 'msw'
import type { PresignedUrlResponse, ProfileImageUpdateResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const meProfileImageHandlers = [
  http.put(`${BASE_URL}/accounts/me/profile-image/presigned-url`, () => {
    return HttpResponse.json<PresignedUrlResponse>({
      presigned_url: `${BASE_URL}/mock/s3-upload`,
      img_url: 'https://example.com/profile/mock-image.jpg',
      key: 'profile/mock-image.jpg',
    })
  }),
  http.put(`${BASE_URL}/mock/s3-upload`, () => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.patch(`${BASE_URL}/accounts/me/profile-image`, () => {
    return HttpResponse.json<ProfileImageUpdateResponse>({
      detail: '프로필 이미지가 변경되었습니다.',
    })
  }),
]
