import type { MeEnrolledCoursesResponse } from '@/features/accounts/me-enrolled-courses/types'
import { mockCourses, mockCohortsByCourse } from './mockCourseData'

type CohortInfo = {
  courseId: number
  number: number
  courseName: string
  courseTag: string
}

const courseMap = Object.fromEntries(mockCourses.map((c) => [c.id, c]))

const cohortLookup: Record<number, CohortInfo> = Object.fromEntries(
  Object.values(mockCohortsByCourse)
    .flat()
    .map((cohort) => {
      const course = courseMap[cohort.course_id]
      return [
        cohort.id,
        {
          courseId: cohort.course_id,
          number: cohort.number,
          courseName: course.name,
          courseTag: course.tag,
        },
      ]
    })
)

let enrolledCourses: MeEnrolledCoursesResponse = []

export function getMockEnrolledCourses(): MeEnrolledCoursesResponse {
  return enrolledCourses
}

export function setMockEnrolledCourse(cohortId: number): boolean {
  const info = cohortLookup[cohortId]
  if (!info) return false
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
  return true
}
