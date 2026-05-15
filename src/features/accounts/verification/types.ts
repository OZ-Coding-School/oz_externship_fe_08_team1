export interface SendSmsRequest {
  phone_number: string
  purpose: 'signup' | 'find_email' | 'phone_change'
}

export interface SendSmsResponse {
  detail: string
}

export interface VerifySmsRequest {
  phone_number: string
  purpose: 'signup' | 'find_email' | 'phone_change'
  code: string
}

export interface VerifySmsResponse {
  detail: string
  sms_token: string
}

export interface SendEmailRequest {
  email: string
  purpose: 'signup' | 'find_password' | 'recovery'
}

export interface SendEmailResponse {
  detail: string
}

export interface VerifyEmailRequest {
  email: string
  purpose: 'signup' | 'find_password' | 'recovery'
  code: string
}

export interface VerifyEmailResponse {
  detail: string
  email_token: string
}
