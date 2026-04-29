import type { Cohort } from '@/features/course/cohorts/types'

export const mockCourses = [
  {
    id: 1,
    name: '14기 백엔드',
    tag: 'BE',
    thumbnail_img_url: 'https://www.test.com',
  },
  {
    id: 2,
    name: '14기 프론트',
    tag: 'FE',
    thumbnail_img_url: 'https://www.test.com',
  },
  {
    id: 3,
    name: '15기 백엔드',
    tag: 'BE',
    thumbnail_img_url: 'https://www.test.com',
  },
  {
    id: 4,
    name: '15기 프론트',
    tag: 'FE',
    thumbnail_img_url: 'https://www.test.com',
  },
]

export const mockCohortsByCourse: Record<number, Cohort[]> = {
  1: [
    { id: 1, course_id: 1, number: 1, status: 'IN_PROGRESS' },
    { id: 2, course_id: 1, number: 2, status: 'IN_PROGRESS' },
    { id: 3, course_id: 1, number: 3, status: 'IN_PROGRESS' },
  ],
  2: [
    { id: 4, course_id: 2, number: 1, status: 'IN_PROGRESS' },
    { id: 5, course_id: 2, number: 2, status: 'IN_PROGRESS' },
  ],
  3: [
    { id: 6, course_id: 3, number: 1, status: 'IN_PROGRESS' },
    { id: 7, course_id: 3, number: 2, status: 'IN_PROGRESS' },
    { id: 8, course_id: 3, number: 3, status: 'IN_PROGRESS' },
    { id: 9, course_id: 3, number: 4, status: 'IN_PROGRESS' },
  ],
  4: [{ id: 10, course_id: 4, number: 1, status: 'IN_PROGRESS' }],
}
