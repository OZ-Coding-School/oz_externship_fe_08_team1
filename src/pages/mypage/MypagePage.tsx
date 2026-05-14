/**
 * @figma 마이페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5063&m=dev
 */
import { Suspense, useState } from 'react'
import { useNavigate } from 'react-router'
import { Card, Button, Avatar, Spinner } from '@/components'
import { MypageErrorBoundary, WithdrawModal } from '@/components/mypage'
import { ROUTES } from '@/constants/routes'
import { GENDER_LABEL } from '@/constants/genderLabel'
import { ROLE_LABEL } from '@/constants/roleLabel'
import { POSITION_LABEL } from '@/constants/positionLabel'
import { formatPhone } from '@/utils/formatPhone'
import { useMe } from '@/features/accounts/me'
import { useAuthStore } from '@/stores/authStore'
import { ProfileIcon } from '@/components/layout/Header/icons'
import { MypageEnrolledCourses } from '@/components/mypage'

interface InfoRowProps {
  label: string
  value: string
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex items-center">
      <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
        {label}
      </span>
      <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
        {value}
      </p>
    </div>
  )
}

function MypageContent() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { user } = useAuthStore()
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false)

  const roleDisplay =
    me.role === 'ADMIN' && me.position && POSITION_LABEL[me.position]
      ? `${ROLE_LABEL[me.role]}(${POSITION_LABEL[me.position]})`
      : ROLE_LABEL[me.role]

  const profileRows: InfoRowProps[] = [
    { label: '닉네임', value: me.nickname },
    { label: '이메일', value: me.email },
    { label: '권한', value: roleDisplay },
  ]

  const personalRows: InfoRowProps[] = [
    { label: '이름', value: me.name },
    {
      label: '휴대전화',
      value: me.phone_number ? formatPhone(me.phone_number) : '-',
    },
    {
      label: '성별',
      value: me.gender ? (GENDER_LABEL[me.gender] ?? me.gender) : '-',
    },
    { label: '생년월일', value: me.birthday?.replace(/-/g, '.') ?? '-' },
  ]
  return (
    <div className="space-y-8">
      {/* 헤더 - 카드 밖 */}
      <div className="flex items-center justify-between">
        <h1 className="text-text-heading self-start text-[32px] leading-[140%] font-bold tracking-[-0.03em]">
          내 정보
        </h1>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(ROUTES.MYPAGE.EDIT)}
          className="px-9 py-5"
        >
          수정하기
        </Button>
      </div>

      {/* 카드 1: 프로필 + 개인정보 */}
      <Card padding="none" elevation="sm" className="px-10 py-13">
        {/* 프로필 섹션 */}
        <section className="mb-13 border-b border-gray-200 pb-13">
          <h2 className="text-primary-600 mb-5 border-b border-gray-200 pb-5 text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            프로필
          </h2>

          {/* 프로필 이미지 (중앙) */}
          <div className="mb-11 flex flex-col items-center">
            <Avatar
              src={user?.profileImage}
              alt={me.nickname}
              className="h-46 w-46 text-6xl"
              fallback={<ProfileIcon size={184} />}
            />
          </div>

          {/* 프로필 정보 */}
          <div className="space-y-5">
            {profileRows.map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>
        </section>

        {/* 개인 정보 섹션 */}
        <section>
          <h2 className="text-primary-600 mb-13 text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            개인 정보
          </h2>

          <div className="space-y-5">
            {personalRows.map(({ label, value }) => (
              <InfoRow key={label} label={label} value={value} />
            ))}
          </div>
        </section>
      </Card>

      {/* 카드 2: 수강 중인 과정 */}
      <Card padding="none" elevation="sm" className="px-11 py-13">
        <h2 className="text-primary-600 mb-13 border-b border-gray-200 pb-13 text-xl leading-[140%] font-semibold tracking-[-0.03em]">
          수강 중인 과정
        </h2>

        {me.role === 'STUDENT' ? (
          <MypageErrorBoundary>
            <Suspense fallback={<Spinner size="md" />}>
              <MypageEnrolledCourses />
            </Suspense>
          </MypageErrorBoundary>
        ) : (
          <p className="text-sm text-gray-400">수강 중인 과정이 없습니다</p>
        )}
      </Card>

      {/* 회원 탈퇴 - 카드 없음 */}
      <div className="pt-6">
        <div className="flex items-start justify-between gap-6">
          {/* 왼쪽: 제목 + 안내 문구 */}
          <div className="flex-1">
            <h3 className="mb-3 text-lg leading-[140%] font-medium tracking-[-0.03em] text-gray-400">
              회원 탈퇴 안내
            </h3>
            <p className="mb-2 text-sm leading-[140%] font-normal tracking-[-0.03em] text-gray-400">
              탈퇴 처리 시, 수강 기간 / 포인트 / 쿠폰은 소멸되며 환불되지
              않습니다.
            </p>
            <p className="text-sm leading-[140%] font-normal tracking-[-0.03em] text-gray-400">
              본인의 경우, 반드시 탈퇴 전에 문의 바랍니다.
            </p>
          </div>

          {/* 오른쪽: 버튼 */}
          <div className="flex shrink-0">
            <Button
              variant="secondary"
              size="md"
              className="px-6 py-3"
              onClick={() => setIsWithdrawModalOpen(true)}
            >
              회원 탈퇴하기
            </Button>
          </div>
        </div>
      </div>

      {/* 회원 탈퇴 모달 */}
      <WithdrawModal
        isOpen={isWithdrawModalOpen}
        onClose={() => setIsWithdrawModalOpen(false)}
      />
    </div>
  )
}

export function MypagePage() {
  return (
    <MypageErrorBoundary>
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-20">
            <Spinner size="lg" />
          </div>
        }
      >
        <MypageContent />
      </Suspense>
    </MypageErrorBoundary>
  )
}
