import { useMeEnrolledCourses } from '@/features/accounts/me-enrolled-courses'

export function MypageEnrolledCourses() {
  const { data: enrolledCourses } = useMeEnrolledCourses()
  // 디자인 스펙: 대표 수강 과정 1개만 표시
  const firstCourse = enrolledCourses?.[0]

  return (
    <>
      {firstCourse ? (
        <div className="flex items-center justify-between gap-6">
          {/* 텍스트 (왼쪽) */}
          <div className="flex-1">
            <h3 className="text-lg leading-[140%] font-semibold tracking-[-0.03em] text-gray-900">
              {firstCourse.course.name} &lt; {firstCourse.cohort.number}기 &gt;
            </h3>
          </div>

          {/* 썸네일 (오른쪽) */}
          <div className="flex h-40.75 w-40.75 flex-shrink-0 items-center justify-center rounded bg-gray-100">
            {firstCourse.course.thumbnail_img_url ? (
              <img
                src={firstCourse.course.thumbnail_img_url}
                alt={firstCourse.course.name}
                width={163}
                height={163}
                className="h-full w-full rounded object-cover"
              />
            ) : (
              <svg
                width="163"
                height="163"
                viewBox="0 0 163 163"
                aria-hidden="true"
              >
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
    </>
  )
}
