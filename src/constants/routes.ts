export const ROUTES = {
  HOME: '/',

  AUTH: {
    LOGIN: '/login',
  },

  SIGNUP: {
    SELECT: '/signup',
    FORM: '/signup/form',
  },

  MYPAGE: {
    HOME: '/mypage',
    EDIT: '/mypage/edit',
    CHANGE_PASSWORD: '/mypage/change-password',
    QUIZ: '/mypage/quiz',
  },

  QUIZ: {
    EXAM: '/quiz/:quizId/exam',
    RESULT: '/quiz/:submissionId/result',
  },

  QNA: {
    LIST: '/qna',
  },

  COMMUNITY: {
    LIST: '/community',
  },

  ENROLL: '/enroll',
} as const
