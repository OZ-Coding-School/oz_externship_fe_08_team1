/**
 * @figma 비밀번호 변경  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-5510&m=dev
 */
import { useState } from 'react'
import { Card, Button } from '@/components'
import {
  PasswordInput,
  type PasswordInputProps,
} from '@/components/common/PasswordInput'
import { useChangePassword } from '@/features/accounts/change-password'
import { useToastStore } from '@/stores/toastStore'

const PASSWORD_HINT = '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합'
const PASSWORD_REGEX =
  /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{6,15}$/

const LABEL_CLASS = 'text-text-heading w-[120px] shrink-0 text-base font-normal'
const LABEL_CLASS_TOP = `${LABEL_CLASS} mt-3`

interface PasswordFieldProps extends PasswordInputProps {
  htmlFor: string
  label: string
  alignTop?: boolean
}

function PasswordField({
  htmlFor,
  label,
  alignTop = false,
  ...inputProps
}: PasswordFieldProps) {
  return (
    <div className={`flex gap-8 ${alignTop ? 'items-start' : 'items-center'}`}>
      <label
        htmlFor={htmlFor}
        className={alignTop ? LABEL_CLASS_TOP : LABEL_CLASS}
      >
        {label}
      </label>
      <div className="flex-1">
        <PasswordInput id={htmlFor} {...inputProps} />
      </div>
    </div>
  )
}

export function ChangePasswordPage() {
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const changePassword = useChangePassword()
  const showToast = useToastStore((s) => s.show)

  const confirmStatus: 'idle' | 'match' | 'mismatch' =
    confirmPassword === ''
      ? 'idle'
      : newPassword === confirmPassword
        ? 'match'
        : 'mismatch'

  const isNewPasswordValid =
    newPassword === '' || PASSWORD_REGEX.test(newPassword)

  const isSubmitDisabled =
    !oldPassword ||
    !newPassword ||
    !isNewPasswordValid ||
    !confirmPassword ||
    confirmStatus === 'mismatch' ||
    changePassword.isPending

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    changePassword.reset()
    changePassword.mutate(
      { old_password: oldPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setOldPassword('')
          setNewPassword('')
          setConfirmPassword('')
          showToast('비밀번호가 성공적으로 변경되었습니다.', 'success')
        },
      }
    )
  }

  return (
    <div className="space-y-8">
      <h1 className="text-text-heading text-[32px] leading-[140%] font-bold tracking-[-0.03em]">
        비밀번호 변경
      </h1>

      <Card padding="none" elevation="sm" className="px-10 py-[52px]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <PasswordField
            htmlFor="old-password"
            label="기존 비밀번호"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="기존 비밀번호를 입력해주세요."
          />

          <PasswordField
            htmlFor="new-password"
            label="새 비밀번호"
            alignTop
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="새 비밀번호를 입력해주세요."
            helperText={isNewPasswordValid ? PASSWORD_HINT : undefined}
            errorMessage={
              !isNewPasswordValid
                ? '* 6~15자의 영문 대/소문자, 숫자 및 특수문자 조합이어야 합니다.'
                : undefined
            }
          />

          <PasswordField
            htmlFor="confirm-password"
            label="새 비밀번호 확인"
            alignTop
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="새 비밀번호를 한 번 더 입력해주세요."
            successMessage={
              confirmStatus === 'match' ? '* 비밀번호가 일치합니다.' : undefined
            }
            errorMessage={
              confirmStatus === 'mismatch'
                ? '* 비밀번호가 일치하지 않습니다.'
                : undefined
            }
          />

          {changePassword.isError && (
            <p className="text-error text-sm">
              비밀번호 변경에 실패했습니다. 기존 비밀번호를 확인해주세요.
            </p>
          )}

          {/* 변경하기 버튼 - 우측 정렬 */}
          <div className="flex justify-end pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitDisabled}
              loading={changePassword.isPending}
              className="px-9 py-5"
            >
              변경하기
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
