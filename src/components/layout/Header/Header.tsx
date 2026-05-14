import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import logoImg from '@/assets/logo.png'
import { ROUTES } from '@/constants/routes'
import { ProfileIcon } from './icons'
import { ProfileDropdown } from './ProfileDropdown'
import { EnrollStudentModal } from './EnrollStudentModal'
import { useAuthStore } from '@/stores/authStore'
import { useLogout } from '@/features/accounts/logout'

export interface HeaderProps {
  bannerText?: string
}

export function Header({
  bannerText = '🚨 선착순 모집! 국비지원 받고 4주 완성',
}: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [enrollModalOpen, setEnrollModalOpen] = useState(false)
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { isAuthenticated, isLoading, user, logout } = useAuthStore()
  const { mutate: logoutApi } = useLogout()

  const isEnrolled = user?.role === 'USER'

  return (
    <>
      <header className="flex w-full flex-col">
        {/* Top banner */}
        <div className="flex h-12 items-center justify-center bg-black px-4">
          <p className="text-base whitespace-nowrap text-white">{bannerText}</p>
        </div>

        {/* Navigation bar */}
        <div className="border-b border-black/20 bg-white">
          <div className="max-w-container mx-auto flex h-16 items-center justify-between px-4">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-15">
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="flex shrink-0 items-center"
                aria-label="홈으로 이동"
              >
                <img
                  src={logoImg}
                  alt="OzCodingSchool"
                  className="h-5 w-auto"
                />
              </button>

              <nav className="flex items-center gap-15">
                <a
                  href="https://community.ozcodingschool.site/"
                  className="hover:text-primary px-2.5 py-2.5 text-lg tracking-tight text-gray-900 transition-colors duration-150"
                >
                  커뮤니티
                </a>
                <a
                  href="https://qna.ozcodingschool.site/"
                  className="hover:text-primary px-2.5 py-2.5 text-lg tracking-tight text-gray-900 transition-colors duration-150"
                >
                  질의응답
                </a>
              </nav>
            </div>

            {/* Right: Auth or Profile */}
            {isLoading ? (
              <div className="h-10 w-10" />
            ) : isAuthenticated && user ? (
              <div
                className="relative"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={() => setDropdownOpen((v) => !v)}
                  aria-label="프로필 메뉴"
                  aria-expanded={dropdownOpen}
                  className="focus-visible:ring-primary overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt=""
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <ProfileIcon />
                  )}
                </button>

                <ProfileDropdown
                  isOpen={dropdownOpen}
                  onClose={() => setDropdownOpen(false)}
                  nickname={user.nickname}
                  email={user.email}
                  isEnrolled={isEnrolled}
                  onEnroll={() => {
                    setEnrollModalOpen(true)
                    setDropdownOpen(false)
                  }}
                  onMypage={() => {
                    navigate(ROUTES.MYPAGE.HOME)
                    setDropdownOpen(false)
                  }}
                  onLogout={() => {
                    logoutApi(undefined, {
                      onSettled: () => {
                        logout()
                        queryClient.clear()
                        setDropdownOpen(false)
                      },
                    })
                  }}
                />
              </div>
            ) : (
              <div className="flex items-center gap-3 text-base tracking-tight text-gray-600">
                <button
                  onClick={() => navigate(ROUTES.AUTH.LOGIN)}
                  className="transition-colors duration-150 hover:text-gray-900"
                >
                  로그인
                </button>
                <span className="text-gray-400">|</span>
                <button
                  onClick={() => navigate(ROUTES.SIGNUP.SELECT)}
                  className="transition-colors duration-150 hover:text-gray-900"
                >
                  회원가입
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* 수강생 등록 모달 */}
      <EnrollStudentModal
        isOpen={enrollModalOpen}
        onClose={() => setEnrollModalOpen(false)}
      />
    </>
  )
}
