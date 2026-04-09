import { Routes, Route } from 'react-router'
import { DefaultLayout, AuthLayout } from '@/components'
import { HomePage } from '@/pages/home'
import { LoginPage } from '@/pages/auth'
import { SignupSelectPage, SignupPage } from '@/pages/signup'
import { MypagePage, MypageEditPage, ChangePasswordPage } from '@/pages/mypage'
import { QuizListPage, QuizExamPage, QuizResultPage } from '@/pages/quiz'
import { ComponentShowcase } from '@/pages/ComponentShowcase'

export function RouterProvider() {
  return (
    <Routes>
      {/* Header only (no Footer) */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginPage />} />
        <Route path="signup">
          <Route index element={<SignupSelectPage />} />
          <Route path="form" element={<SignupPage />} />
        </Route>
      </Route>

      {/* Header + Footer */}
      <Route element={<DefaultLayout />}>
        <Route index element={<HomePage />} />

        <Route path="mypage">
          <Route index element={<MypagePage />} />
          <Route path="edit" element={<MypageEditPage />} />
          <Route path="change-password" element={<ChangePasswordPage />} />
          <Route path="quiz" element={<QuizListPage />} />
        </Route>

        <Route path="quiz/:quizId">
          <Route path="exam" element={<QuizExamPage />} />
          <Route path="result" element={<QuizResultPage />} />
        </Route>

        <Route path="showcase" element={<ComponentShowcase />} />
      </Route>
    </Routes>
  )
}
