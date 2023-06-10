import { useState } from 'react'
import { ToastProps } from '../components/toast/Toast'

export const useToast = (initialState: ToastProps = { message: '', isVisible: false }) => {
  const [toastConfig, setToastConfig] = useState(initialState)

  const showToast = (message: string, type: ToastProps['type']) => {
    setToastConfig({
      message,
      isVisible: true,
      type
    })
  }

  const hideToast = () => {
    setToastConfig({ ...toastConfig, isVisible: false })
  }

  return { toastConfig, showToast, hideToast }
}