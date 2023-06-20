import { FC, useEffect } from 'react'
import { CloseIcon } from '../icons/index'
import './Toast.scss'

export type ToastType = 'success' | 'error' | 'warning'

export type ToastProps = {
  message: string
  isVisible: boolean
  type?: ToastType
}

const Toast: FC<ToastProps & { onHide: () => void }> = (
  { message, isVisible, type = 'success', onHide }
) => {
  useEffect(() => {
    const timer = setTimeout(onHide, 10000)
    return () => clearTimeout(timer)
  }, [onHide])

  if (!isVisible) {
    return null
  }

  return (
    <div className={`toast flex-between toast--${type}`}>
      {message}
      <button
        onClick={onHide}
        className='cursor-pointer'
      >
        <CloseIcon />
      </button>
    </div>
  )
}

export default Toast