export interface CohortSimple {
  id: number
  number: number
  start_date: string
  end_date: string
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'
}

export interface MyCourseSimple {
  id: number
  name: string
  tag: string
  thumbnail_img_url: string
}

export interface MyEnrolledCourse {
  cohort: CohortSimple
  course: MyCourseSimple
}

export type MeEnrolledCoursesResponse = MyEnrolledCourse[]
