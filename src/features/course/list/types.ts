export interface Course {
  id: number
  name: string
  tag: string
  thumbnail_img_url: string
}

export type CourseListResponse = Course[]

export interface CourseListErrorResponse {
  error_detail: string
}
