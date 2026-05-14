import { useNavigate } from 'react-router'
import { EnrollStudentModal } from '@/components/layout/Header/EnrollStudentModal'
import { ROUTES } from '@/constants/routes'

export function EnrollPage() {
  const navigate = useNavigate()
  const handleClose = () => navigate(ROUTES.HOME, { replace: true })
  return <EnrollStudentModal isOpen onClose={handleClose} />
}
