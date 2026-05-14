export interface FindEmailRequest {
  sms_token: string
  name: string
}

export interface FindEmailResponse {
  email: string
}
