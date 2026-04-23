/**
 * @figma 랜딩 페이지  https://www.figma.com/design/4rJmEFUU2HMWVy3qUcYZRs/%EC%A0%9C%EB%AA%A9-%EC%97%86%EC%9D%8C?node-id=1-12014&m=dev
 */
import { useState } from 'react'
import bannerImg from '@/assets/main-banner.png'
import examImg from '@/assets/main-exam.png'
import qnaImg from '@/assets/main-qna.png'
import communityImg from '@/assets/main-community.png'
import { Spinner, ErrorFallback } from '@/components'

type FeatureTab = 'exam' | 'qna' | 'community'
type ImageStatus = 'loading' | 'loaded' | 'error'

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

interface ImageWithStatesProps {
  src: string
  alt: string
  className?: string
  loading?: 'lazy' | 'eager'
  fetchPriority?: 'high' | 'low' | 'auto'
  spinnerMinHeight?: number
}

function ImageWithStates({
  src,
  alt,
  className = '',
  loading = 'lazy',
  fetchPriority,
  spinnerMinHeight = 256,
}: ImageWithStatesProps) {
  const [status, setStatus] = useState<ImageStatus>('loading')
  const [retryKey, setRetryKey] = useState(0)

  if (status === 'error') {
    return (
      <ErrorFallback
        message="이미지를 불러올 수 없어요."
        onRetry={() => {
          setStatus('loading')
          setRetryKey((k) => k + 1)
        }}
      />
    )
  }

  return (
    <div className="relative">
      {status === 'loading' && (
        <div
          style={{ minHeight: spinnerMinHeight }}
          className="flex items-center justify-center"
          aria-hidden="true"
        >
          <Spinner size="lg" label="이미지 로딩 중..." />
        </div>
      )}
      <img
        key={retryKey}
        src={src}
        alt={alt}
        className={[
          className,
          status === 'loading' ? 'pointer-events-none absolute opacity-0' : '',
        ]
          .filter(Boolean)
          .join(' ')}
        loading={loading}
        decoding="async"
        fetchPriority={fetchPriority}
        onLoad={() => setStatus('loaded')}
        onError={() => setStatus('error')}
      />
    </div>
  )
}

export function HomePage() {
  const [activeTab, setActiveTab] = useState<FeatureTab>('exam')
  const current = TABS.find((t) => t.key === activeTab) ?? TABS[0]

  return (
    <main className="flex flex-col">
      {/* Feature section */}
      <section className="bg-bg-subtle pt-37 pb-31">
        <div className="max-w-container mx-auto px-4">
          <h2 className="text-text-heading mb-10 text-center text-5xl leading-normal font-bold tracking-[-0.03em] whitespace-pre-line">
            {current.heading}
          </h2>

          {/* Tab navigation — 바깥 div는 순수 레이아웃, tablist가 pill 컨테이너를 직접 담당 */}
          <div className="flex justify-center">
            <div
              role="tablist"
              aria-label="서비스 기능 탭"
              className="border-border-base bg-bg-base inline-flex gap-2.5 rounded-full border p-2"
            >
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  id={`tab-${tab.key}`}
                  type="button"
                  role="tab"
                  aria-selected={activeTab === tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={[
                    'rounded-full px-9.5 py-5 text-xl leading-[1.4] font-bold tracking-[-0.03em] transition-colors duration-150 outline-none',
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

          {/* Tab content — key 변경 시 재마운트되어 애니메이션 및 로딩 상태 초기화 */}
          <div
            key={activeTab}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="animate-fade-in mt-8.5"
          >
            <ImageWithStates
              src={current.image}
              alt={current.alt}
              className="mx-auto block w-full max-w-5xl"
            />
          </div>
        </div>
      </section>

      {/* Banner section */}
      <section className="flex justify-center py-35">
        <ImageWithStates
          src={bannerImg}
          alt="함께 묻고 답하며, 현직자의 피드백으로 빠르게 성장할 수 있어요"
          loading="eager"
          fetchPriority="high"
          spinnerMinHeight={320}
        />
      </section>
    </main>
  )
}
