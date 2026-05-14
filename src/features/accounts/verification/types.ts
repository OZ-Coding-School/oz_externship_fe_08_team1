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
