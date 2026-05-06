import { http, HttpResponse } from 'msw'
import type { DeploymentsResponse } from './types'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

const PAGE_SIZE = 3

const allItems: DeploymentsResponse['results'] = [
  {
    id: 1,
    submission_id: 101,
    exam: {
      id: 10,
      title: 'Python 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 1, title: 'Python 입문', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'done', score: 80, correct_answer_count: 8 },
    is_done: true,
    duration_time: 30,
  },
  {
    id: 2,
    submission_id: null,
    exam: {
      id: 11,
      title: 'JavaScript 심화 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 2, title: 'JavaScript 심화', thumbnail_img_url: null },
    },
    question_count: 15,
    total_score: 100,
    exam_info: { status: 'pending', score: null, correct_answer_count: null },
    is_done: false,
    duration_time: 45,
  },
  {
    id: 3,
    submission_id: null,
    exam: {
      id: 12,
      title: 'React 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 3, title: 'React 기초', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'pending', score: null, correct_answer_count: null },
    is_done: false,
    duration_time: 30,
  },
  {
    id: 4,
    submission_id: 202,
    exam: {
      id: 13,
      title: 'TypeScript 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 4, title: 'TypeScript', thumbnail_img_url: null },
    },
    question_count: 12,
    total_score: 100,
    exam_info: { status: 'done', score: 92, correct_answer_count: 11 },
    is_done: true,
    duration_time: 30,
  },
  {
    id: 5,
    submission_id: null,
    exam: {
      id: 14,
      title: 'CSS 레이아웃 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 5, title: 'CSS', thumbnail_img_url: null },
    },
    question_count: 8,
    total_score: 100,
    exam_info: { status: 'pending', score: null, correct_answer_count: null },
    is_done: false,
    duration_time: 20,
  },
  {
    id: 6,
    submission_id: 303,
    exam: {
      id: 15,
      title: 'HTML 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 6, title: 'HTML', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'done', score: 70, correct_answer_count: 7 },
    is_done: true,
    duration_time: 25,
  },
  {
    id: 7,
    submission_id: null,
    exam: {
      id: 16,
      title: 'Git 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 7, title: 'Git & GitHub', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'pending', score: null, correct_answer_count: null },
    is_done: false,
    duration_time: 20,
  },
  {
    id: 8,
    submission_id: 404,
    exam: {
      id: 17,
      title: 'SQL 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 8, title: 'SQL', thumbnail_img_url: null },
    },
    question_count: 12,
    total_score: 100,
    exam_info: { status: 'done', score: 58, correct_answer_count: 7 },
    is_done: true,
    duration_time: 30,
  },
  {
    id: 9,
    submission_id: null,
    exam: {
      id: 18,
      title: 'REST API 설계 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 9, title: 'REST API', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'pending', score: null, correct_answer_count: null },
    is_done: false,
    duration_time: 25,
  },
  {
    id: 10,
    submission_id: 505,
    exam: {
      id: 19,
      title: 'Node.js 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 10, title: 'Node.js', thumbnail_img_url: null },
    },
    question_count: 15,
    total_score: 100,
    exam_info: { status: 'done', score: 100, correct_answer_count: 15 },
    is_done: true,
    duration_time: 40,
  },
  {
    id: 11,
    submission_id: null,
    exam: {
      id: 20,
      title: 'Docker 기초 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 11, title: 'Docker', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'pending', score: null, correct_answer_count: null },
    is_done: false,
    duration_time: 30,
  },
  {
    id: 12,
    submission_id: 606,
    exam: {
      id: 21,
      title: 'Redux 심화 쪽지시험',
      thumbnail_img_url: 'https://placehold.co/48x48',
      subject: { id: 12, title: 'Redux', thumbnail_img_url: null },
    },
    question_count: 10,
    total_score: 100,
    exam_info: { status: 'done', score: 60, correct_answer_count: 6 },
    is_done: true,
    duration_time: 25,
  },
]

// GET /api/v1/exams/deployments — 쪽지시험 목록 조회 API
export const deploymentsHandlers = [
  http.get(`${BASE_URL}/exams/deployments`, async ({ request }) => {
    const url = new URL(request.url)

    const status = url.searchParams.get('status') ?? 'all'
    const page = Number(url.searchParams.get('page') ?? '1')

    const filtered =
      status === 'done'
        ? allItems.filter((item) => item.exam_info.status === 'done')
        : status === 'pending'
          ? allItems.filter((item) => item.exam_info.status === 'pending')
          : allItems

    const start = (page - 1) * PAGE_SIZE
    const results = filtered.slice(start, start + PAGE_SIZE)
    const has_next = start + PAGE_SIZE < filtered.length

    return HttpResponse.json<DeploymentsResponse>({ page, has_next, results })
  }),
]
