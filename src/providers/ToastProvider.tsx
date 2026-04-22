import { Toast } from '@/components/common/Toast'
import { useToastStore } from '@/stores/toastStore'

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { visible, message, variant, className, hide } = useToastStore()

  return (
    <>
      {children}
      <Toast
        visible={visible}
        message={message}
        variant={variant}
        onClose={hide}
        className={className}
      />
    </>
  )
}
