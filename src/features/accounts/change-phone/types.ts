export interface ChangePhoneRequest {
  phone_verify_token: string
}

export interface ChangePhoneResponse {
  detail: string
  phone_number: string
}
