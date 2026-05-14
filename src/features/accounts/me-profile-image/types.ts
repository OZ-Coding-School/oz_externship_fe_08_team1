export interface PresignedUrlRequest {
  file_name: string
}

export interface PresignedUrlResponse {
  presigned_url: string
  img_url: string
  key: string
}

export interface ProfileImageUpdateRequest {
  profile_img_url: string | null
}

export interface ProfileImageUpdateResponse {
  detail: string
}
