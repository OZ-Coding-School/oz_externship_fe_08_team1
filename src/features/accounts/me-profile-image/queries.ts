import { useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/api/instance'
import { meQueries } from '@/features/accounts/me'
import { useAuthStore } from '@/stores/authStore'
import type {
  PresignedUrlRequest,
  PresignedUrlResponse,
  ProfileImageUpdateRequest,
  ProfileImageUpdateResponse,
} from './types'

export function useGetPresignedUrl() {
  return useMutation({
    mutationFn: async (body: PresignedUrlRequest) => {
      const { data } = await api.post<PresignedUrlResponse>(
        'accounts/me/profile-image/presigned-url',
        body
      )
      return data
    },
  })
}

export function useUpdateProfileImage() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (body: ProfileImageUpdateRequest) => {
      const { data } = await api.patch<ProfileImageUpdateResponse>(
        'accounts/me/profile-image',
        body
      )
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries(meQueries.all())
      if (variables.profile_img_url) {
        useAuthStore.getState().setProfileImage(variables.profile_img_url)
      }
    },
  })
}
