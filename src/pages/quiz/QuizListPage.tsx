import { Suspense, useState } from 'react'
import { Tabs, TabList, Tab, TabPanel } from '@/components'
import {
  QuizCardSkeleton,
  QuizList,
  QuizListErrorBoundary,
} from '@/components/quiz'

const QUIZ_STATUS = {
  ALL: 'all',
  DONE: 'done',
  PENDING: 'pending',
} as const

type TabStatus = (typeof QUIZ_STATUS)[keyof typeof QUIZ_STATUS]

const tabs: { label: string; value: TabStatus }[] = [
  { label: '전체보기', value: QUIZ_STATUS.ALL },
  { label: '응시완료', value: QUIZ_STATUS.DONE },
  { label: '미응시', value: QUIZ_STATUS.PENDING },
]

function QuizListSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <QuizCardSkeleton key={i} />
      ))}
    </div>
  )
}

export function QuizListPage() {
  const [status, setStatus] = useState<TabStatus>(QUIZ_STATUS.ALL)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-text-heading text-[32px] leading-[140%] font-bold tracking-[-0.03em]">
        쪽지시험
      </h1>

      <Tabs value={status} onChange={(v) => setStatus(v as TabStatus)}>
        <TabList aria-label="쪽지시험 필터">
          {tabs.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabList>

        {tabs.map(({ value }) => (
          <TabPanel key={value} value={value} className="pt-6">
            <QuizListErrorBoundary>
              <Suspense fallback={<QuizListSkeleton />}>
                <QuizList
                  params={value !== QUIZ_STATUS.ALL ? { status: value } : {}}
                />
              </Suspense>
            </QuizListErrorBoundary>
          </TabPanel>
        ))}
      </Tabs>
    </div>
  )
}
