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
  const current = TABS.find((t) => t.key === activeTab) ?? TABS[0]

  return (
    <main className="flex flex-col">
      {/* Feature section */}
      <section className="bg-bg-subtle py-20">
        <div className="max-w-container mx-auto px-4">
          <h2 className="text-text-heading mb-10 text-center text-4xl leading-tight font-bold whitespace-pre-line">
            {current.heading}
          </h2>

          {/* Tab navigation */}
          <div
            role="tablist"
            aria-label="서비스 기능 탭"
            className="flex justify-center"
          >
            <div className="border-border-base bg-bg-base inline-flex gap-2 rounded-full border p-2">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    'rounded-full px-8.5 py-3.5 text-base font-semibold transition-colors duration-150 outline-none',
                    'focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2',
                    activeTab === tab.key
                      ? 'bg-primary text-text-inverse'
                      : 'text-text-muted hover:text-text-body',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content — key 변경 시 재마운트되어 애니메이션 재실행 */}
          <div
            key={activeTab}
            role="tabpanel"
            className="animate-fade-in mt-16"
          >
            <img
              src={current.image}
              alt={current.alt}
              className="mx-auto block w-full max-w-5xl"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </section>
      {/* Banner section */}
      <section className="flex justify-center py-20">
        <img
          src={bannerImg}
          alt="함께 묻고 답하며, 현직자의 피드백으로 빠르게 성장할 수 있어요"
          loading="eager"
          fetchPriority="high"
        />
      </section>
    </main>
  )
}
