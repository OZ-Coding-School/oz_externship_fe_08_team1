/**
 * @figma 마이페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5063&m=dev
 */
import { useNavigate } from 'react-router'
import { Card, Button, Avatar } from '@/components'
import { ROUTES } from '@/constants/routes'
import { useMe } from '@/features/accounts/me'
import { useMeEnrolledCourses } from '@/features/accounts/me-enrolled-courses'

const GENDER_LABEL: Record<string, string> = { M: '남자', F: '여자' }

function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  const match = digits.match(/^(\d{3})(\d{3,4})(\d{4})$/)
  return match ? `${match[1]} - ${match[2]} - ${match[3]}` : phone
}

export function MypagePage() {
  const navigate = useNavigate()
  const { data: me } = useMe()
  const { data: enrolledCourses } = useMeEnrolledCourses()

  const firstCourse = enrolledCourses[0]

  return (
    <div className="space-y-6">
      {/* 헤더 - 카드 밖 */}
      <div className="flex items-center justify-between">
        <h1 className="text-text-heading text-[32px] leading-[140%] font-bold tracking-[-0.03em]">
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
      <Card padding="none" elevation="sm" className="px-10 py-[52px]">
        {/* 프로필 섹션 */}
        <section className="mb-[52px] border-b border-gray-200 pb-[52px]">
          <h2 className="text-primary-600 mb-[52px] text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            프로필
          </h2>

          {/* 프로필 이미지 (중앙) */}
          <div className="mb-[44px] flex flex-col items-center">
            <Avatar
              src={me.profile_img_url}
              alt={me.nickname}
              className="h-[184px] w-[184px] text-6xl"
            />
          </div>

          {/* 프로필 정보 */}
          <div className="space-y-5">
            <div className="flex items-center">
              <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                닉네임
              </span>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                {me.nickname}
              </p>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                이메일
              </span>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                {me.email}
              </p>
            </div>
          </div>
        </section>

        {/* 개인 정보 섹션 */}
        <section>
          <h2 className="text-primary-600 mb-[52px] text-xl leading-[140%] font-semibold tracking-[-0.03em]">
            개인 정보
          </h2>

          <div className="space-y-5">
            <div className="flex items-center">
              <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                이름
              </span>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                {me.name}
              </p>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                휴대전화
              </span>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                {formatPhone(me.phone_number)}
              </p>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                성별
              </span>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                {GENDER_LABEL[me.gender] ?? me.gender}
              </p>
            </div>

            <div className="flex items-center">
              <span className="w-32 text-sm leading-[140%] font-medium tracking-[-0.03em] text-gray-700">
                생년월일
              </span>
              <p className="flex-1 text-base leading-[140%] font-normal tracking-[-0.03em] text-gray-900">
                {me.birthday.replace(/-/g, '.')}
              </p>
            </div>
          </div>
        </section>
      </Card>

      {/* 카드 2: 수강 중인 과정 */}
      <Card padding="none" elevation="sm" className="px-11 py-[52px]">
        <h2 className="text-primary-600 mb-[52px] border-b border-gray-200 pb-[52px] text-xl leading-[140%] font-semibold tracking-[-0.03em]">
          수강 중인 과정
        </h2>

        {firstCourse ? (
          <div className="flex items-center justify-between gap-6">
            {/* 텍스트 (왼쪽) */}
            <div className="flex-1">
              <h3 className="text-lg leading-[140%] font-semibold tracking-[-0.03em] text-gray-900">
                {firstCourse.course.name} &lt; {firstCourse.cohort.number}기
                &gt;
              </h3>
            </div>

            {/* 썸네일 (오른쪽) */}
            <div className="flex h-[163px] w-[163px] flex-shrink-0 items-center justify-center rounded bg-gray-100">
              {firstCourse.course.thumbnail_img_url ? (
                <img
                  src={firstCourse.course.thumbnail_img_url}
                  alt={firstCourse.course.name}
                  className="h-full w-full rounded object-cover"
                />
              ) : (
                <svg width="163" height="163" viewBox="0 0 163 163">
                  <pattern
                    id="checkerboard"
                    x="0"
                    y="0"
                    width="16"
                    height="16"
                    patternUnits="userSpaceOnUse"
                  >
                    <rect width="8" height="8" fill="#E5E7EB" />
                    <rect x="8" y="0" width="8" height="8" fill="#F3F4F6" />
                    <rect x="0" y="8" width="8" height="8" fill="#F3F4F6" />
                    <rect x="8" y="8" width="8" height="8" fill="#E5E7EB" />
                  </pattern>
                  <rect width="163" height="163" fill="url(#checkerboard)" />
                </svg>
              )}
            </div>
          </div>
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
          <div className="flex-shrink-0">
            {/* TODO: 회원 탈퇴 모달 연동 */}
            <Button variant="secondary" size="md" className="px-6 py-3">
              회원 탈퇴하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
