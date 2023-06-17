import { FC, useState } from 'react'
import { useSnapshot } from 'valtio'

import designState from '../../store/designState'
import { OrderState, OrderAction, OrderActionType } from '../../reducers/orderReducer'
import { uploadCanvasImage } from '../../utils/handleCanvasImage'
import { uploadImageWithUrl } from '../../utils/handleUploadImage'
import { PreviewIcon, Loader } from '../../components/icons'
import './UploadPreview.scss'

interface UploadPreviewProps {
  state: OrderState
  dispatch: React.Dispatch<OrderAction>
  handleCheckout: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const UploadPreview: FC<UploadPreviewProps> = ({ state, dispatch, handleCheckout }) => {
  const snap = useSnapshot(designState)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = await uploadCanvasImage() || ''
      let logoDecal = ''
      let fullDecal = ''

      if (designState.isLogoTexture) {
        logoDecal = await uploadImageWithUrl(designState.logoDecal, 'logoDecal') || ''
      }

      if (designState.isFullTexture) {
        fullDecal = await uploadImageWithUrl(designState.fullDecal, 'fullDecal') || ''
      }

      dispatch({
        type: OrderActionType.CHANGE_INPUT,
        payload: {
          ...snap,
          url,
          logoDecal,
          fullDecal
        }
      })
    } catch (err) {
      setError('Failed to upload image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='upload-preview'>
      {isLoading 
        ? <Loader />
        : <button
          disabled={!state.name || !state.email || !state.address || !state.phone}
          className='button button--outline'
          onClick={handleUpload}
        >
          Upload My Design
        </button>
      }
      {error && <span className='error-message'>{error}</span>}
      <div  className='my-design'>
        {state.url ? <img src={state.url} alt='preview' /> : <PreviewIcon />}
      </div>
      <button
        disabled={
          !state.name || !state.email || !state.address || !state.phone || !state.url
        }
        className='button button--filled'
        onClick={handleCheckout}
      >
        Checkout
      </button>
    </div>
  )
}

export default UploadPreview