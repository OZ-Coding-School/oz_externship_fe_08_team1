export interface SignupRequest {
  password: string
  nickname: string
  name: string
  birthday: string
  gender: 'M' | 'F'
  email_token: string
  sms_token: string
}

export interface SignupResponse {
  [key: string]: string
}

export interface SendEmailRequest {
  email: string
  purpose: 'signup' | 'find_password' | 'restore'
}

export interface VerifyEmailRequest {
  email: string
  purpose: 'signup' | 'find_password' | 'restore'
  code: string
}

export interface VerifyEmailResponse {
  email_token: string
}

export interface SendSmsRequest {
  phone_number: string
  purpose: 'signup' | 'find_email' | 'change_phone'
}

export interface VerifySmsRequest {
  phone_number: string
  purpose: 'signup' | 'find_email' | 'change_phone'
  code: string
}

export interface VerifySmsResponse {
  sms_token: string
}
