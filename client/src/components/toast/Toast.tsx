import { FC, useState, useEffect } from 'react'
import { CloseIcon } from '../icons/index'
import './Toast.scss'

export type ToastType = 'success' | 'error' | 'warning'

export type ToastProps = {
  message: string
  isVisible: boolean
  type?: ToastType
  onHide?: () => void
}

const Toast: FC<ToastProps> = ({ message, isVisible, onHide, type= 'success'}) => {
  const [visibility, setVisibility] = useState(isVisible)

  useEffect(() => {
    setVisibility(isVisible)
  }, [isVisible])

  if (!visibility) {
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