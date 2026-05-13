// 시험 제출 API 호출과 제출 이후 화면 전환을 담당하는 훅.
//
// submit(reason)을 호출하는 경로는 세 가지다:
//   'button'         — 수험자가 제출 버튼을 직접 클릭
//   'timer-expired'  — 타이머가 0에 도달
//   'cheating-limit' — 부정행위 3회 초과
//
// button은 완료 모달을 띄운 뒤 수험자가 확인을 눌러야 이동하고,
// 나머지는 즉시 결과 페이지로 리다이렉트한다.
import { useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { useSubmitExam } from '@/features/exams/submissions'
import { useToastStore } from '@/stores/toastStore'
import { ROUTES } from '@/constants/routes'
import { HTTP_STATUS } from '@/constants/httpStatus'
import { getErrorDetail } from '@/utils/getErrorDetail'
import { getErrorStatus } from '@/utils/getErrorStatus'
import type { SubmissionAnswer } from '@/features/exams/submissions'

export type SubmitReason = 'button' | 'timer-expired' | 'cheating-limit'

const ERROR_MAP: Record<number, { fallback: string; redirect?: string }> = {
  [HTTP_STATUS.BAD_REQUEST]: {
    fallback: '유효하지 않은 시험 응시 세션입니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
  [HTTP_STATUS.UNAUTHORIZED]: {
    fallback: '로그인이 필요합니다.',
    redirect: ROUTES.AUTH.LOGIN,
  },
  [HTTP_STATUS.FORBIDDEN]: {
    fallback: '권한이 없습니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
  [HTTP_STATUS.NOT_FOUND]: {
    fallback: '해당 시험 정보를 찾을 수 없습니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
  [HTTP_STATUS.CONFLICT]: { fallback: '이미 제출된 시험입니다.' },
  [HTTP_STATUS.GONE]: {
    fallback: '시험이 종료되었습니다.',
    redirect: ROUTES.MYPAGE.QUIZ,
  },
}

interface UseExamSubmissionOptions {
  deploymentId: number
  getSubmissionAnswers: () => SubmissionAnswer[]
}

interface UseExamSubmissionResult {
  isSubmitted: boolean
  isSubmitting: boolean
  submitRedirectUrl: string | null // null이면 완료 모달 닫힘, 값이 있으면 모달 열림
  submit: (reason: SubmitReason, cheatingCount: number) => void
  closeCompletionModal: () => void
}

export function useExamSubmission({
  deploymentId,
  getSubmissionAnswers,
}: UseExamSubmissionOptions): UseExamSubmissionResult {
  const navigate = useNavigate()
  const showToast = useToastStore((s) => s.show)
  const { mutate: submitExam, isPending: isSubmitting } = useSubmitExam()

  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitRedirectUrl, setSubmitRedirectUrl] = useState<string | null>(
    null
  )
  // isPending(React state)과 별도로 ref를 두는 이유:
  // state 업데이트는 비동기라 연속 클릭 시 중복 제출이 발생할 수 있다.
  // ref는 동기적으로 읽고 쓸 수 있어 즉시 중복 차단이 가능하다.
  const isSubmittingRef = useRef(false)
  // 시험 시작 시각은 마운트 시점에 한 번만 기록해야 하므로 ref로 고정
  const startedAt = useRef(new Date().toISOString().slice(0, 19))

  const submit = useCallback(
    (reason: SubmitReason, cheatingCount: number) => {
      if (isSubmittingRef.current) return // 이미 제출 중이면 아무것도 안 함
      isSubmittingRef.current = true // 제출 시작, 잠금
      setIsSubmitted(true) // 제출 버튼 비활성화

      if (document.fullscreenElement) {
        document.exitFullscreen().catch(() => {})
      }

      submitExam(
        {
          deployment_id: deploymentId,
          started_at: startedAt.current,
          cheating_count: cheatingCount,
          answers: getSubmissionAnswers(),
        },
        {
          onSuccess: (res) => {
            if (res.submission_id == null) {
              showToast(
                '제출 결과를 불러올 수 없습니다. 다시 시도해주세요.',
                'error'
              )
              isSubmittingRef.current = false
              setIsSubmitted(false)
              return
            }
            const resultUrl = ROUTES.QUIZ.RESULT.replace(
              ':submissionId',
              String(res.submission_id)
            )
            if (reason === 'button') {
              // 버튼 제출: 완료 모달을 표시하고 수험자 확인 후 이동
              setSubmitRedirectUrl(resultUrl)
            } else {
              // 타이머/부정행위: 모달 없이 바로 결과 페이지로 이동
              navigate(resultUrl, { replace: true })
            }
          },
          onError: (error) => {
            isSubmittingRef.current = false
            setIsSubmitted(false)
            const detail = getErrorDetail(error)
            const status = getErrorStatus(error)
            const config = status ? ERROR_MAP[status] : undefined
            showToast(
              detail ?? config?.fallback ?? '서버 오류가 발생했습니다.',
              'error'
            )
            if (config?.redirect) navigate(config.redirect)
          },
        }
      )
    },
    [deploymentId, getSubmissionAnswers, submitExam, showToast, navigate]
  )

  const closeCompletionModal = useCallback(() => {
    if (submitRedirectUrl) {
      navigate(submitRedirectUrl, { replace: true })
    }
  }, [submitRedirectUrl, navigate])

  return {
    isSubmitted,
    isSubmitting,
    submitRedirectUrl,
    submit,
    closeCompletionModal,
  }
}
