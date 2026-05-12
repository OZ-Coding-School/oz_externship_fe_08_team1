import { useState } from 'react'
import { useNavigate } from 'react-router'
import { Input } from '@/components/common/Input'
import { PasswordInput } from '@/components/common/PasswordInput'
import { Button } from '@/components/common/Button'
import { ROUTES } from '@/constants/routes'
import {
  useSignup,
  useSendEmail,
  useVerifyEmail,
  useSendSms,
  useVerifySms,
} from '@/features/accounts/signup'
import { useCheckNickname } from '@/features/accounts/check-nickname'
import logo from '@/assets/logo.png'

function RequiredLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-text-heading text-base font-normal">
      {children}
      <span className="text-red-500">*</span>
    </p>
  )
}

const validateBirthday = (value: string) => {
  if (!value) return '생년월일을 입력해주세요.'
  if (!/^\d{8}$/.test(value)) return '8자리 숫자로 입력해주세요. (ex.20001204)'

  const year = parseInt(value.slice(0, 4))
  const month = parseInt(value.slice(4, 6))
  const day = parseInt(value.slice(6, 8))

  if (year < 1900 || year > new Date().getFullYear())
    return '올바른 연도를 입력해주세요.'
  if (month < 1 || month > 12) return '올바른 월을 입력해주세요.'

  const maxDays = new Date(year, month, 0).getDate()
  if (day < 1 || day > maxDays) return `올바른 날짜가 아닙니다.`

  return ''
}

/**
 * @figma 회원가입_일반 회원가입  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-2103&m=dev
 */
export function SignupPage() {
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [nickname, setNickname] = useState('')
  const [nicknameChecked, setNicknameChecked] = useState(false)
  const [birthday, setBirthday] = useState('')
  const [gender, setGender] = useState<'M' | 'F' | ''>('')
  const [email, setEmail] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [emailToken, setEmailToken] = useState('')
  const [phone1, setPhone1] = useState('')
  const [phone2, setPhone2] = useState('')
  const [phone3, setPhone3] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [smsToken, setSmsToken] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')

  const [emailSent, setEmailSent] = useState(false)
  const [emailVerified, setEmailVerified] = useState(false)
  const [smsSent, setSmsSent] = useState(false)
  const [smsVerified, setSmsVerified] = useState(false)

  const [nameError, setNameError] = useState('')
  const [nicknameError, setNicknameError] = useState('')
  const [birthdayError, setBirthdayError] = useState('')
  const [genderError, setGenderError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [emailCodeError, setEmailCodeError] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [smsCodeError, setSmsCodeError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordConfirmError, setPasswordConfirmError] = useState('')

  const { mutate: signup, isPending: isSignupPending } = useSignup()
  const { mutate: sendEmail, isPending: isSendEmailPending } = useSendEmail()
  const { mutate: verifyEmail, isPending: isVerifyEmailPending } =
    useVerifyEmail()
  const { mutate: sendSms, isPending: isSendSmsPending } = useSendSms()
  const { mutate: verifySms, isPending: isVerifySmsPending } = useVerifySms()
  const { mutate: checkNickname, isPending: isCheckNicknamePending } =
    useCheckNickname()

  const phoneNumber = `${phone1}${phone2}${phone3}`

  const handleCheckNickname = () => {
    if (!nickname) {
      setNicknameError('닉네임을 입력해주세요.')
      return
    }
    checkNickname(
      { nickname },
      {
        onSuccess: () => {
          setNicknameChecked(true)
          setNicknameError('')
        },
        onError: () => {
          setNicknameChecked(false)
          setNicknameError('이미 사용 중인 닉네임입니다.')
        },
      }
    )
  }

  const handleSendEmail = () => {
    if (!email) {
      setEmailError('이메일을 입력해주세요.')
      return
    }
    sendEmail(
      { email, purpose: 'signup' },
      {
        onSuccess: () => setEmailSent(true),
        onError: () => setEmailError('이메일 발송에 실패했습니다.'),
      }
    )
  }

  const handleVerifyEmail = () => {
    if (!emailCode) {
      setEmailCodeError('인증번호를 입력해주세요.')
      return
    }
    verifyEmail(
      { email, purpose: 'signup', code: emailCode },
      {
        onSuccess: (data) => {
          setEmailToken(data.email_token)
          setEmailVerified(true)
        },
        onError: () => setEmailCodeError('인증번호가 올바르지 않습니다.'),
      }
    )
  }

  const handleSendSms = () => {
    if (!phone1 || !phone2 || !phone3) {
      setPhoneError('휴대폰 번호를 입력해주세요.')
      return
    }
    sendSms(
      { phone_number: phoneNumber, purpose: 'signup' },
      {
        onSuccess: () => setSmsSent(true),
        onError: () => setPhoneError('SMS 발송에 실패했습니다.'),
      }
    )
  }

  const handleVerifySms = () => {
    if (!smsCode) {
      setSmsCodeError('인증번호를 입력해주세요.')
      return
    }
    verifySms(
      { phone_number: phoneNumber, purpose: 'signup', code: smsCode },
      {
        onSuccess: (data) => {
          setSmsToken(data.sms_token)
          setSmsVerified(true)
        },
        onError: () => setSmsCodeError('인증번호가 올바르지 않습니다.'),
      }
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name) {
      setNameError('이름을 입력해주세요.')
      return
    }
    if (!nicknameChecked) {
      setNicknameError('닉네임 중복확인을 해주세요.')
      return
    }
    const birthdayValidation = validateBirthday(birthday)
    if (birthdayValidation) {
      setBirthdayError(birthdayValidation)
      return
    }
    if (!gender) {
      setGenderError('성별을 선택해주세요.')
      return
    }
    if (!emailVerified) {
      setEmailError('이메일 인증을 완료해주세요.')
      return
    }
    if (!smsVerified) {
      setPhoneError('휴대폰 인증을 완료해주세요.')
      return
    }
    if (!password) {
      setPasswordError('비밀번호를 입력해주세요.')
      return
    }
    if (password !== passwordConfirm) {
      setPasswordConfirmError('비밀번호가 일치하지 않습니다.')
      return
    }

    signup(
      {
        name,
        nickname,
        birthday,
        gender,
        email_token: emailToken,
        sms_token: smsToken,
        password,
      },
      {
        onSuccess: () => navigate(ROUTES.AUTH.LOGIN),
        onError: () => alert('회원가입에 실패했습니다.'),
      }
    )
  }

  return (
    <main className="flex flex-1 flex-col items-center px-4 pt-10 pb-10">
      <div className="flex w-full max-w-sm flex-col items-center gap-6">
        {/* 헤더 */}
        <div className="flex w-full flex-col items-center gap-2">
          <p className="text-sm text-gray-500">마법같이 빠르게 성장시켜줄</p>
          <img src={logo} alt="OZ 오즈코딩스쿨" className="h-6 w-45" />
        </div>

        <p className="text-lg font-medium text-gray-900">회원가입</p>

        <form
          onSubmit={handleSubmit}
          className="flex w-full flex-col gap-3"
          autoComplete="off"
        >
          {/* 이름 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>이름</RequiredLabel>
            <Input
              placeholder="이름을 입력해주세요"
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setNameError('')
              }}
              isError={Boolean(nameError)}
              errorMessage={nameError}
              autoComplete="off"
            />
          </div>

          {/* 닉네임 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>닉네임</RequiredLabel>
            <div className="flex gap-2">
              <Input
                placeholder="닉네임을 입력해주세요"
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value)
                  setNicknameError('')
                  setNicknameChecked(false)
                }}
                isError={Boolean(nicknameError)}
                errorMessage={nicknameError}
                className="flex-1"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleCheckNickname}
                loading={isCheckNicknamePending}
                disabled={!nickname || nicknameChecked}
                className="shrink-0"
              >
                중복확인
              </Button>
            </div>
            {nicknameChecked && (
              <p className="text-sm text-green-600">
                사용 가능한 닉네임입니다.
              </p>
            )}
          </div>

          {/* 생년월일 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>생년월일</RequiredLabel>
            <Input
              placeholder="생년월일을 입력해주세요 (ex.20001204)"
              value={birthday}
              onChange={(e) => {
                setBirthday(e.target.value)
                setBirthdayError(validateBirthday(e.target.value))
              }}
              isError={Boolean(birthdayError)}
              errorMessage={birthdayError}
              autoComplete="off"
            />
          </div>

          {/* 성별 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>성별</RequiredLabel>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setGender('M')
                  setGenderError('')
                }}
                className={`rounded-full border px-6 py-2 text-sm transition-colors ${
                  gender === 'M'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                남
              </button>
              <button
                type="button"
                onClick={() => {
                  setGender('F')
                  setGenderError('')
                }}
                className={`rounded-full border px-6 py-2 text-sm transition-colors ${
                  gender === 'F'
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 text-gray-700'
                }`}
              >
                여
              </button>
            </div>
            {genderError && (
              <p className="text-sm text-red-500">{genderError}</p>
            )}
          </div>

          {/* 이메일 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <RequiredLabel>이메일</RequiredLabel>
              <p className="text-xs text-gray-400">
                로그인 시 아이디로 사용됩니다.
              </p>
            </div>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="ozcoding@naver.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setEmailError('')
                }}
                isError={Boolean(emailError)}
                errorMessage={emailError}
                className="flex-1"
                autoComplete="off"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleSendEmail}
                loading={isSendEmailPending}
                disabled={!email || emailVerified}
                className="shrink-0"
              >
                {emailSent ? '재발송' : '인증코드전송'}
              </Button>
            </div>
            {emailSent && !emailVerified && (
              <div className="flex gap-2">
                <Input
                  placeholder="전송된 코드를 입력해주세요"
                  value={emailCode}
                  onChange={(e) => {
                    setEmailCode(e.target.value)
                    setEmailCodeError('')
                  }}
                  isError={Boolean(emailCodeError)}
                  errorMessage={emailCodeError}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifyEmail}
                  loading={isVerifyEmailPending}
                  disabled={!emailCode}
                  className="shrink-0"
                >
                  인증번호확인
                </Button>
              </div>
            )}
            {emailVerified && (
              <p className="text-sm text-green-600">
                이메일 인증이 완료되었습니다.
              </p>
            )}
          </div>

          {/* 휴대전화 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>휴대전화</RequiredLabel>
            <div className="flex gap-2">
              <div className="flex flex-1 gap-1">
                <Input
                  placeholder="010"
                  value={phone1}
                  onChange={(e) => {
                    setPhone1(e.target.value)
                    setPhoneError('')
                  }}
                  className="w-16 text-center"
                  maxLength={3}
                  autoComplete="off"
                />
                <Input
                  value={phone2}
                  onChange={(e) => {
                    setPhone2(e.target.value)
                    setPhoneError('')
                  }}
                  className="flex-1 text-center"
                  maxLength={4}
                  autoComplete="off"
                />
                <Input
                  value={phone3}
                  onChange={(e) => {
                    setPhone3(e.target.value)
                    setPhoneError('')
                  }}
                  className="flex-1 text-center"
                  maxLength={4}
                  autoComplete="off"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={handleSendSms}
                loading={isSendSmsPending}
                disabled={!phone1 || !phone2 || !phone3 || smsVerified}
                className="shrink-0"
              >
                {smsSent ? '재발송' : '인증번호발송'}
              </Button>
            </div>
            {phoneError && <p className="text-sm text-red-500">{phoneError}</p>}
            {smsSent && !smsVerified && (
              <div className="flex gap-2">
                <Input
                  placeholder="인증번호 6자리를 입력해주세요"
                  value={smsCode}
                  onChange={(e) => {
                    setSmsCode(e.target.value)
                    setSmsCodeError('')
                  }}
                  isError={Boolean(smsCodeError)}
                  errorMessage={smsCodeError}
                  className="flex-1"
                  autoComplete="off"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleVerifySms}
                  loading={isVerifySmsPending}
                  disabled={!smsCode}
                  className="shrink-0"
                >
                  인증번호확인
                </Button>
              </div>
            )}
            {smsVerified && (
              <p className="text-sm text-green-600">
                휴대폰 인증이 완료되었습니다.
              </p>
            )}
          </div>

          {/* 비밀번호 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>비밀번호</RequiredLabel>
            <p className="-mt-2 text-xs text-gray-400">
              8-15자리 영문 대소문자, 숫자, 특수문자 포함
            </p>
            <PasswordInput
              placeholder="비밀번호를 입력해주세요"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setPasswordError('')
              }}
              isError={Boolean(passwordError)}
              errorMessage={passwordError}
              autoComplete="new-password"
            />
          </div>

          {/* 비밀번호 확인 */}
          <div className="flex flex-col gap-3">
            <RequiredLabel>비밀번호 확인</RequiredLabel>
            <PasswordInput
              placeholder="비밀번호를 다시 입력해주세요"
              value={passwordConfirm}
              onChange={(e) => {
                setPasswordConfirm(e.target.value)
                setPasswordConfirmError('')
              }}
              isError={Boolean(passwordConfirmError)}
              errorMessage={passwordConfirmError}
              autoComplete="new-password"
            />
          </div>

          <Button
            type="submit"
            fullWidth
            loading={isSignupPending}
            disabled={
              !emailVerified ||
              !smsVerified ||
              !nicknameChecked ||
              Boolean(birthdayError)
            }
          >
            가입하기
          </Button>
        </form>
      </div>
    </main>
  )
}
