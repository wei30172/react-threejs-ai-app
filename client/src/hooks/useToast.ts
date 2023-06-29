import { useState } from 'react'

type ToastProps = {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error' | 'warning';
};

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