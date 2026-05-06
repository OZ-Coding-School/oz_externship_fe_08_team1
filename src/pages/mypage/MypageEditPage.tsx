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

function CameraIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="20" cy="20" r="20" className="fill-primary" />
      <path
        d="M16.5 13L15 15H12C11.17 15 10.5 15.67 10.5 16.5V26.5C10.5 27.33 11.17 28 12 28H28C28.83 28 29.5 27.33 29.5 26.5V16.5C29.5 15.67 28.83 15 28 15H25L23.5 13H16.5Z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx="20"
        cy="21.5"
        r="3.5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MypageEditContent() {
  const navigate = useNavigate()
  const { data: me } = useMe()
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

  // Critical 1: Object URL 메모리 누수 방지
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

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    // Critical 1: 이전 Object URL 해제
    if (imagePreview) URL.revokeObjectURL(imagePreview)
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  async function handleSave() {
    setSaveError(null)
    setIsSaving(true)
    try {
      // 1. Upload profile image if selected
      if (imageFile) {
        const presigned = await getPresignedUrl.mutateAsync({
          file_name: imageFile.name,
        })
        const uploadRes = await fetch(presigned.presigned_url, {
          method: 'PUT',
          body: imageFile,
        })
        if (!uploadRes.ok) {
          throw new Error(`이미지 업로드 실패: ${uploadRes.status}`)
        }
        await updateProfileImage.mutateAsync({
          profile_img_url: presigned.img_url,
        })
      }

      // 2. Update user info
      await updateMe.mutateAsync({ nickname })

      // 3. Navigate back
      navigate(ROUTES.MYPAGE.HOME)
    } catch {
      // Critical 3: 에러 피드백
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
      <Card padding="none" elevation="sm" className="px-10 py-[52px]">
        {/* Profile Edit Section */}
        <section className="mb-[52px] border-b border-gray-200 pb-[52px]">
          <h2 className="text-primary-600 mb-5 border-b border-gray-200 pb-5 text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            프로필 수정
          </h2>

          {/* Avatar with camera overlay */}
          <div className="mb-[44px] flex flex-col items-center">
            <div className="relative">
              <Avatar
                src={imagePreview ?? me.profile_img_url}
                alt={me.nickname}
                className="h-[184px] w-[184px] text-6xl"
              />
              <button
                type="button"
                onClick={handleImageSelect}
                className="absolute right-1 bottom-1 cursor-pointer rounded-full"
                aria-label="프로필 이미지 변경"
              >
                <CameraIcon />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
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
                    className={`flex h-[42px] w-20 cursor-default items-center justify-center rounded-full text-base font-semibold select-none ${
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
