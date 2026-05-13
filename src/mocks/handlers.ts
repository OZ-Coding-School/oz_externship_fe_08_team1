import { http, HttpResponse } from 'msw'
import { deploymentsHandlers } from '@/features/exams/deployments'
import { meHandlers } from '@/features/accounts/me'
import { meEnrolledCoursesHandlers } from '@/features/accounts/me-enrolled-courses'
import { checkCodeHandlers } from '@/features/exams/deployment-check-code'
import { checkNicknameHandlers } from '@/features/accounts/check-nickname'
import { meProfileImageHandlers } from '@/features/accounts/me-profile-image'
import { deploymentDetailHandlers } from '@/features/exams/deployment-detail'
import { deploymentStatusHandlers } from '@/features/exams/deployment-status'
import { submissionsHandlers } from '@/features/exams/submissions'
import { logoutHandlers } from '@/features/accounts/logout'
import { courseListHandlers } from '@/features/course/list/handler'
import { cohortHandlers } from '@/features/course/cohorts/handler'
import { enrollStudentHandlers } from '@/features/accounts/enroll-student/handler'
// import { verificationHandlers } from '@/features/accounts/verification'
import { changePhoneHandlers } from '@/features/accounts/change-phone'
import { changePasswordHandlers } from '@/features/accounts/change-password'
import { submissionDetailHandlers } from '@/features/exams/submission-detail'

export const handlers = [
  http.get('/api/health', () => {
    return HttpResponse.json({ status: 'ok' })
  }),
  ...meHandlers,
  ...meEnrolledCoursesHandlers,
  ...deploymentsHandlers,
  // status / check-code는 deploymentDetail보다 먼저 등록해 패스 우선순위 확보
  ...deploymentStatusHandlers,
  ...checkCodeHandlers,
  ...checkNicknameHandlers,
  ...meProfileImageHandlers,
  ...deploymentDetailHandlers,
  ...submissionsHandlers,
  ...logoutHandlers,
  ...courseListHandlers,
  ...cohortHandlers,
  ...enrollStudentHandlers,
  // ...verificationHandlers,
  ...changePhoneHandlers,
  ...changePasswordHandlers,
  ...submissionDetailHandlers,
]
