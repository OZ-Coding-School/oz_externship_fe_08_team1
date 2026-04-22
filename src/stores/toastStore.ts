import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ToastVariant } from '@/components/common/Toast'

interface ToastState {
  visible: boolean
  message: string
  variant: ToastVariant
  className?: string
  show: (message: string, variant?: ToastVariant, className?: string) => void
  hide: () => void
}

export const useToastStore = create<ToastState>()(
  devtools(
    (set) => ({
      visible: false,
      message: '',
      variant: 'error',
      className: undefined,
      show: (message, variant = 'error', className) =>
        set(
          { visible: true, message, variant, className },
          undefined,
          'toast/show'
        ),
      hide: () =>
        set({ visible: false, className: undefined }, undefined, 'toast/hide'),
    }),
    { name: 'ToastStore' }
  )
)
