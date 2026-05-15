import { http, HttpResponse } from 'msw'
import type { PresignedUrlResponse, ProfileImageUpdateResponse } from './types'

export const meProfileImageHandlers = [
  http.post('/accounts/me/profile-image/presigned-url', () => {
    return HttpResponse.json<PresignedUrlResponse>({
      presigned_url: '/mock/s3-upload',
      img_url: '/favicon.svg',
      key: 'profile/mock-image',
    })
  }),
  http.put('/mock/s3-upload', () => {
    return new HttpResponse(null, { status: 200 })
  }),
  http.patch('/accounts/me/profile-image', () => {
    return HttpResponse.json<ProfileImageUpdateResponse>({
      detail: '프로필 이미지가 변경되었습니다.',
    })
  }),
]
