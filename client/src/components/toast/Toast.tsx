import { useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { hideToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { CloseIcon } from '../icons/index'
import './Toast.scss'

const Toast: React.FC = () => {
  const dispatch = useDispatch()
  
  const { message, isVisible, type } = useSelector((state: RootState) => state.toast)

  const onHide = useCallback(() => {
    dispatch(hideToast())
  }, [dispatch])

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onHide, 10000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onHide])

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