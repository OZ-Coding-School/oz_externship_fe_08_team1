/**
 * @figma 랜딩 페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-12014&m=dev
 */
import { useState } from 'react'
import bannerImg from '@/assets/main-banner.png'
import examImg from '@/assets/main-exam.png'
import qnaImg from '@/assets/main-qna.png'
import communityImg from '@/assets/main-community.png'

type FeatureTab = 'exam' | 'qna' | 'community'

interface TabConfig {
  key: FeatureTab
  label: string
  heading: string
  image: string
  alt: string
}

const TABS: TabConfig[] = [
  {
    key: 'exam',
    label: '쪽지시험',
    heading: '쪽지시험으로\n실력을 차곡차곡 쌓아보세요',
    image: examImg,
    alt: '쪽지시험 기능 소개',
  },
  {
    key: 'qna',
    label: '질의응답',
    heading: '질문하고 배우고,\n동료 수강생과 함께 성장해요',
    image: qnaImg,
    alt: '질의응답 기능 소개',
  },
  {
    key: 'community',
    label: '커뮤니티',
    heading: '정보 공유부터 팀원 모집까지\n커뮤니티에서 함께해요',
    image: communityImg,
    alt: '커뮤니티 기능 소개',
  },
]

export function HomePage() {
  const [activeTab, setActiveTab] = useState<FeatureTab>('exam')
  const current = TABS.find((t) => t.key === activeTab)!

  return (
    <main className="flex flex-col">
      {/* Feature section */}
      <section className="bg-[#FAFAFB] py-20">
        <h2 className="text-text-heading pt-10 pb-10 text-center text-4xl leading-tight font-bold whitespace-pre-line">
          {current.heading}
        </h2>
        <div className="max-w-container mx-auto px-4">
          {/* Tab navigation */}
          <div
            role="tablist"
            aria-label="서비스 기능 탭"
            className="flex justify-center"
          >
            <div className="border-border-base inline-flex rounded-full border bg-white p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    'rounded-full px-7 py-2.5 text-base font-semibold transition-colors duration-150 outline-none',
                    'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2',
                    activeTab === tab.key
                      ? 'bg-primary text-white'
                      : 'text-text-muted hover:text-text-body',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Section content */}
          <div className="mt-16 flex flex-col items-center gap-14">
            <img
              src={current.image}
              alt={current.alt}
              className="w-full max-w-5xl"
            />
          </div>
        </div>
      </section>
      {/* Hero section */}
      <section className="flex justify-center pt-20 pb-20">
        <img
          src={bannerImg}
          alt="함께 묻고 답하며, 현직자의 피드백으로 빠르게 성장할 수 있어요"
        />
      </section>
    </main>
  )
}
