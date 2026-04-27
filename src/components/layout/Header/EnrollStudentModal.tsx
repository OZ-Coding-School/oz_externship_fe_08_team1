import { useState } from 'react'
import { Modal } from '@/components/common/Modal'
import { Button } from '@/components/common/Button'
import { Dropdown } from '@/components/common/Dropdown'
import { CheckIcon } from '@/components/common/Modal/icons'
import { useCourseList } from '@/features/course/list/queries'
import { useCohortList } from '@/features/course/cohorts/queries'
import { useEnrollStudent } from '@/features/accounts/enroll-student/queries'
import type { EnrollStudentErrorResponse } from '@/features/accounts/enroll-student/types'
import { useToastStore } from '@/stores/toastStore'

export interface EnrollStudentModalProps {
  isOpen: boolean
  onClose: () => void
}

function flattenErrorDetail(
  detail: EnrollStudentErrorResponse['error_detail'] | undefined
): string {
  if (!detail) return '수강생 등록에 실패했습니다. 다시 시도해주세요.'
  if (typeof detail === 'string') return detail
  return (
    Object.values(detail).flat()[0] ??
    '수강생 등록에 실패했습니다. 다시 시도해주세요.'
  )
}

export function EnrollStudentModal({
  isOpen,
  onClose,
}: EnrollStudentModalProps) {
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null)
  const [selectedCohortId, setSelectedCohortId] = useState<number | null>(null)

  const {
    data: courses,
    isLoading: isCoursesLoading,
    isError: isCoursesError,
  } = useCourseList(isOpen)
  const {
    data: cohorts,
    isLoading: isCohortsLoading,
    isError: isCohortsError,
  } = useCohortList(selectedCourseId)
  const { mutate: enrollStudent, isPending } = useEnrollStudent()
  const { show: showToast } = useToastStore()

  const handleClose = () => {
    setSelectedCourseId(null)
    setSelectedCohortId(null)
    onClose()
  }

  const courseOptions =
    courses?.map((c) => ({ value: String(c.id), label: c.name })) ?? []

  const cohortOptions =
    cohorts?.map((c) => ({ value: String(c.id), label: `${c.number}기` })) ?? []

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(Number(value))
    setSelectedCohortId(null)
  }

  const handleSubmit = () => {
    if (!selectedCohortId) return

    enrollStudent(
      { cohort_id: selectedCohortId },
      {
        onSuccess: () => {
          showToast('수강생 등록이 완료되었습니다.', 'success')
          handleClose()
        },
        onError: (error) => {
          const message = flattenErrorDetail(error.response?.data?.error_detail)
          showToast(message, 'error')
        },
      }
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      maxWidth="w-full max-w-[396px] mx-auto"
    >
      <div className="flex flex-col items-center gap-10">
        {/* 아이콘 + 제목 + 설명 */}
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="bg-primary-300 flex h-8 w-8 items-center justify-center rounded-full">
            <CheckIcon />
          </div>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-text-heading text-xl font-bold tracking-[-0.03em]">
              내 과정 선택하기
            </h2>
            <p className="text-sm tracking-[-0.03em] text-gray-600">
              해당하는 과정과 기수를 선택해 주세요.
            </p>
          </div>
        </div>

        {/* 드롭다운 */}
        <div className="flex w-full flex-col gap-4">
          {isCoursesError ? (
            <p className="text-error text-center text-sm tracking-tight">
              과정 목록을 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          ) : (
            <Dropdown
              options={courseOptions}
              value={selectedCourseId !== null ? String(selectedCourseId) : ''}
              onChange={handleCourseChange}
              placeholder={
                isCoursesLoading
                  ? '과정 불러오는 중...'
                  : '수강중인 과정을 선택해 주세요.'
              }
              disabled={isCoursesLoading}
            />
          )}

          {isCohortsError ? (
            <p className="text-error text-center text-sm tracking-tight">
              기수 목록을 불러오지 못했습니다. 다시 시도해 주세요.
            </p>
          ) : (
            <Dropdown
              options={cohortOptions}
              value={selectedCohortId !== null ? String(selectedCohortId) : ''}
              onChange={(value) => setSelectedCohortId(Number(value))}
              placeholder={
                selectedCourseId === null
                  ? '기수를 선택해 주세요.'
                  : isCohortsLoading
                    ? '기수 불러오는 중...'
                    : '기수를 선택해 주세요.'
              }
              disabled={selectedCourseId === null || isCohortsLoading}
            />
          )}
        </div>

        {/* 등록 버튼 */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleSubmit}
          loading={isPending}
          disabled={!selectedCohortId || isPending}
        >
          등록하기
        </Button>
      </div>
    </Modal>
  )
}
