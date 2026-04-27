import type { MeEnrolledCoursesResponse } from '@/features/accounts/me-enrolled-courses/types'

type CohortInfo = {
  courseId: number
  number: number
  courseName: string
  courseTag: string
}

const cohortLookup: Record<number, CohortInfo> = {
  1: { courseId: 1, number: 1, courseName: '14기 백엔드', courseTag: 'BE' },
  2: { courseId: 1, number: 2, courseName: '14기 백엔드', courseTag: 'BE' },
  3: { courseId: 1, number: 3, courseName: '14기 백엔드', courseTag: 'BE' },
  4: { courseId: 2, number: 1, courseName: '14기 프론트', courseTag: 'FE' },
  5: { courseId: 2, number: 2, courseName: '14기 프론트', courseTag: 'FE' },
  6: { courseId: 3, number: 1, courseName: '15기 백엔드', courseTag: 'BE' },
  7: { courseId: 3, number: 2, courseName: '15기 백엔드', courseTag: 'BE' },
  8: { courseId: 3, number: 3, courseName: '15기 백엔드', courseTag: 'BE' },
  9: { courseId: 3, number: 4, courseName: '15기 백엔드', courseTag: 'BE' },
  10: { courseId: 4, number: 1, courseName: '15기 프론트', courseTag: 'FE' },
}

let enrolledCourses: MeEnrolledCoursesResponse = []

export function getMockEnrolledCourses(): MeEnrolledCoursesResponse {
  return enrolledCourses
}

export function setMockEnrolledCourse(cohortId: number): void {
  const info = cohortLookup[cohortId]
  if (!info) return
  enrolledCourses = [
    {
      cohort: {
        id: cohortId,
        number: info.number,
        start_date: '2024-01-01',
        end_date: '2024-12-31',
        status: 'IN_PROGRESS',
      },
      course: {
        id: info.courseId,
        name: info.courseName,
        tag: info.courseTag,
        thumbnail_img_url: 'https://www.test.com',
      },
    },
  ]
}
