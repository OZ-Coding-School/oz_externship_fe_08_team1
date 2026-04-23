export const account = {
  'api/v1/account/me': {
    id: 'int',
    email: 'str',
    nickname: 'str',
    name: 'str',
    phone_number: 'str',
    birthday: 'str',
    gender: 'enum(M, F)',
    profile_img_url: 'str',
    cohort_id: 'int | null',
    created_at: 'datetime',
  },
  'api/v1/accounts/me/enrolled-courses': {
    cohort: {
      id: 'int',
      number: 'int',
      start_date: 'datetime',
      end_date: 'datetime',
      status: 'enum(PENDING,IN_PROGRESS,COMPLETED)',
    },
    course: {
      id: 'int',
      name: 'str',
      tag: 'str',
      thumbnail_img_url: 'str',
    },
  },
}
