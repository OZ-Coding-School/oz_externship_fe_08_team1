import { http, HttpResponse } from 'msw'
import type { RestoreAccountRequest, RestoreAccountResponse } from './types'

export const restoreHandlers = [
  http.post(`/accounts/restore`, async ({ request }) => {
    const body = (await request.json()) as RestoreAccountRequest
    if (!body.email_token) {
      return HttpResponse.json(
        { error_detail: { email_token: ['이 필드는 필수 항목입니다.'] } },
        { status: 400 }
      )
    }
    return HttpResponse.json<RestoreAccountResponse>({
      detail: '계정복구가 완료되었습니다.',
    })
  }),
]
