/**
 * @figma 마이페이지_수정하기  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5240&m=dev
 */
import { Suspense, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, Button, Avatar, Input, Spinner } from '@/components'
import { MypageErrorBoundary, PhoneChangeModal } from '@/components/mypage'
import { ROUTES } from '@/constants/routes'
import { useMe, useUpdateMe } from '@/features/accounts/me'
import { useCheckNickname } from '@/features/accounts/check-nickname'
import {
  useGetPresignedUrl,
  useUpdateProfileImage,
} from '@/features/accounts/me-profile-image'
import { formatPhone } from '@/utils/formatPhone'
import { useAuthStore } from '@/stores/authStore'
import { ProfileIcon } from '@/components/layout/Header/icons'
import { Camera } from 'lucide-react'

function MypageEditContent() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { user } = useAuthStore()
  const updateMe = useUpdateMe()
  const checkNickname = useCheckNickname()
  const getPresignedUrl = useGetPresignedUrl()
  const updateProfileImage = useUpdateProfileImage()

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile image state
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Form state
  const [nickname, setNickname] = useState(me.nickname ?? '')
  const gender = me.gender
  const [nicknameStatus, setNicknameStatus] = useState<
    'idle' | 'valid' | 'invalid'
  >('idle')

  // Phone change modal state
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false)

  // Saving state
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  // Object URL 메모리 누수 방지 — imagePreview 변경 시 이전 URL 해제
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview)
    }
  }, [imagePreview])

  // Critical 2: check-nickname API 연동
  function handleNicknameCheck() {
    checkNickname.mutate(
      { nickname },
      {
        onSuccess: () => setNicknameStatus('valid'),
        onError: () => setNicknameStatus('invalid'),
      }
    )
  }

  function handleImageSelect() {
    fileInputRef.current?.click()
  }

  const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB
  // const profileImageUrl =
  //   import.meta.env.VITE_PROFILE_IMAGE_URL + '/accounts/me/profile-image'
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > MAX_IMAGE_SIZE) {
      setSaveError('이미지 크기는 5MB 이하만 업로드 가능합니다.')
      return
    }
    // URL 해제는 useEffect cleanup에서 처리
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    const isNicknameChanged = nickname !== me.nickname
    if (isNicknameChanged && nicknameStatus !== 'valid') {
      setSaveError('닉네임 중복확인을 먼저 진행해주세요.')
      return
    }
    setSaveError(null)
    setIsSaving(true)
    try {
      // 1. Upload profile image if selected
      if (imageFile) {
        // 1-1. Presigned URL 발급 (PUT)
        const { presigned_url, img_url } = await getPresignedUrl.mutateAsync({
          file_name: imageFile.name,
        })

        console.log('Presigned URL:', presigned_url)
        // 1-2. S3에 실제 파일 업로드 (axios 미사용 — Authorization 헤더 제외)
        const uploadRes = await fetch(presigned_url, {
          method: 'PUT',
          body: imageFile,
          headers: { 'Content-Type': imageFile.type },
        })
        if (!uploadRes.ok) {
          throw new Error(`이미지 업로드 실패: ${uploadRes.status}`)
        }
        // 1-3. DB에 이미지 URL 저장
        await updateProfileImage.mutateAsync({
          profile_img_url: img_url,
        })
      }

      // 2. Update user info (닉네임 변경 시에만)
      if (isNicknameChanged) {
        await updateMe.mutateAsync({ nickname })
      }

      // 3. Navigate back
      navigate(ROUTES.MYPAGE.HOME)
    } catch {
      setSaveError('저장에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-text-heading self-start text-[32px] leading-[140%] font-bold tracking-[-0.03em]">
          내 정보
        </h1>
        <Button
          variant="primary"
          size="lg"
          onClick={handleSave}
          loading={isSaving}
          className="px-9 py-5"
        >
          저장하기
        </Button>
      </div>

      {saveError && <p className="text-error text-sm">{saveError}</p>}

      {/* Card */}
      <Card padding="none" elevation="sm" className="px-10 py-13">
        {/* Profile Edit Section */}
        <section className="mb-13 border-b border-gray-200 pb-13">
          <h2 className="text-primary-600 mb-5 border-b border-gray-200 pb-5 text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            프로필 수정
          </h2>

          {/* Avatar with camera overlay */}
          <div className="mb-11 flex flex-col items-center">
            <div className="relative">
              <Avatar
                src={imagePreview ?? user?.profileImage}
                alt={me.nickname}
                className="h-46 w-46 text-6xl"
                fallback={<ProfileIcon size={184} />}
              />
              <button
                type="button"
                onClick={handleImageSelect}
                className="absolute right-1 bottom-1 cursor-pointer rounded-full"
                aria-label="프로필 이미지 변경"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-gray-300">
                  <Camera color="#cecece" size={35} fill="white" />
                </div>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Nickname */}
          <div className="mb-5">
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <Input
                  label="닉네임"
                  value={nickname}
                  onChange={(e) => {
                    setNickname(e.target.value)
                    setNicknameStatus('idle')
                  }}
                  placeholder="닉네임을 입력하세요"
                  helperText={
                    nicknameStatus === 'idle'
                      ? '*한글 8자, 영문 및 숫자 16자까지 혼용할 수 있어요.'
                      : undefined
                  }
                  successMessage={
                    nicknameStatus === 'valid'
                      ? '사용 가능한 닉네임입니다.'
                      : undefined
                  }
                  errorMessage={
                    nicknameStatus === 'invalid'
                      ? '올바른 닉네임 형식이 아닙니다.'
                      : undefined
                  }
                />
              </div>
              <Button
                variant="secondary"
                size="md"
                onClick={handleNicknameCheck}
                loading={checkNickname.isPending}
                disabled={!nickname}
                className="mt-9 shrink-0"
              >
                중복확인
              </Button>
            </div>
          </div>

          {/* Email */}
          <Input label="이메일" value={me.email} readOnly />
        </section>

        {/* Personal Info Edit Section */}
        <section>
          <h2 className="text-primary-600 mb-5 border-b border-gray-200 pb-5 text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            개인 정보 수정
          </h2>

          <div className="space-y-5">
            {/* Name */}
            <Input label="이름" value={me.name} readOnly />

            {/* Phone */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Input
                  label="휴대전화"
                  value={formatPhone(me.phone_number)}
                  readOnly
                />
              </div>
              <Button
                variant="primary"
                size="md"
                className="shrink-0"
                onClick={() => setIsPhoneModalOpen(true)}
              >
                변경하기
              </Button>
            </div>

            {/* Gender (read-only) */}
            <div>
              <label className="text-text-heading mb-1.5 block text-sm font-medium">
                성별
              </label>
              <div className="flex gap-2">
                {(['M', 'F'] as const).map((g) => (
                  <div
                    key={g}
                    className={`flex h-10.5 w-20 cursor-default items-center justify-center rounded-full text-base font-semibold select-none ${
                      gender === g
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-bg-muted text-text-muted'
                    }`}
                  >
                    {g === 'M' ? '남' : '여'}
                  </div>
                ))}
              </div>
            </div>

            {/* Birthday */}
            <Input
              label="생년월일"
              value={me.birthday?.replace(/-/g, '.') ?? ''}
              readOnly
            />
          </div>
        </section>
      </Card>

      <PhoneChangeModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
      />
    </div>
  )
}

export function MypageEditPage() {
  return (
    <MypageErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        }
      >
        <MypageEditContent />
      </Suspense>
    </MypageErrorBoundary>
  )
}
