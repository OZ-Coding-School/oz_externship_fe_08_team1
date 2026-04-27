import { http, HttpResponse } from 'msw'
import { deploymentsHandlers } from '@/features/exams/deployments'
import { loginHandlers } from '@/features/accounts/login/handler'
import { meHandlers } from '@/features/accounts/me'
import { meEnrolledCoursesHandlers } from '@/features/accounts/me-enrolled-courses'
import { checkCodeHandlers } from '@/features/exams/deployment-check-code'
import { checkNicknameHandlers } from '@/features/accounts/check-nickname'
import { meProfileImageHandlers } from '@/features/accounts/me-profile-image'
import { deploymentDetailHandlers } from '@/features/exams/deployment-detail'
import { submissionsHandlers } from '@/features/exams/submissions'
import { logoutHandlers } from '@/features/accounts/logout'
import { courseListHandlers } from '@/features/course/list/handler'
import { cohortHandlers } from '@/features/course/cohorts/handler'
import { enrollStudentHandlers } from '@/features/accounts/enroll-student/handler'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...meHandlers,
  ...meEnrolledCoursesHandlers,
  ...deploymentsHandlers,
  ...loginHandlers,
  // check-code는 deploymentDetail보다 먼저 등록해 패스 우선순위 확보
  ...checkCodeHandlers,
  ...checkNicknameHandlers,
  ...meProfileImageHandlers,
  ...deploymentDetailHandlers,
  ...submissionsHandlers,
  ...logoutHandlers,
  ...courseListHandlers,
  ...cohortHandlers,
  ...enrollStudentHandlers,
]
