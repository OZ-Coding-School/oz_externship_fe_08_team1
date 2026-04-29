import { http, HttpResponse } from 'msw'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export const courseListHandlers = [
  http.get(`${BASE_URL}/course`, () => {
    return HttpResponse.json(
      [
        {
          id: 1,
          name: '14기 백엔드',
          tag: 'BE',
          thumbnail_img_url: 'https://www.test.com',
        },
        {
          id: 2,
          name: '14기 프론트',
          tag: 'FE',
          thumbnail_img_url: 'https://www.test.com',
        },
        {
          id: 3,
          name: '15기 백엔드',
          tag: 'BE',
          thumbnail_img_url: 'https://www.test.com',
        },
        {
          id: 4,
          name: '15기 프론트',
          tag: 'FE',
          thumbnail_img_url: 'https://www.test.com',
        },
      ],
      { status: 200 }
    )
  }),
]
