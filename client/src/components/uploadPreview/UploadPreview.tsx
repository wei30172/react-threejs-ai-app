import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { changeOrderInput } from '../../slices/orderSlice'
import { setDesign } from '../../slices/designSlice'
import { RootState } from '../../store'
import { uploadCanvasImage } from '../../utils/handleCanvasImage'
import { uploadImageWithUrl } from '../../utils/handleUploadImage'
import { PreviewIcon, Loader } from '../../components/icons'
import './UploadPreview.scss'

interface UploadPreviewProps {
  handleCheckout: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const UploadPreview: React.FC<UploadPreviewProps> = ({ handleCheckout }) => {
  const dispatch = useDispatch()

  const orderInfo = useSelector((state: RootState) => state.order)
  const designInfo = useSelector((state: RootState) => state.design)

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = await uploadCanvasImage() || ''
      let logoDecal = ''
      let fullDecal = ''

      if (designInfo.isLogoTexture) {
        logoDecal = await uploadImageWithUrl(designInfo.logoDecal, 'logoDecal') || designInfo.logoDecal
        dispatch(setDesign({ field: 'logoDecal', value: logoDecal }))
      }

      if (designInfo.isFullTexture) {
        fullDecal = await uploadImageWithUrl(designInfo.fullDecal, 'fullDecal') || designInfo.fullDecal
        dispatch(setDesign({ field: 'fullDecal', value: fullDecal }))
      }

      dispatch(changeOrderInput({field: 'url', value: url}))

    } catch (err) {
      setError('Failed to upload image. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [dispatch, designInfo])

  return (
    <div className='upload-preview'>
      {isLoading 
        ? <Loader />
        : <button
          disabled={!orderInfo.name || !orderInfo.email || !orderInfo.address || !orderInfo.phone}
          className='button button--outline'
          onClick={handleUpload}
        >
          Upload My Design
        </button>
      }
      {error && <span className='error-message'>{error}</span>}
      <div  className='my-design'>
        {orderInfo.url ? <img src={orderInfo.url} alt='preview' /> : <PreviewIcon />}
      </div>
      <button
        disabled={
          !orderInfo.name || !orderInfo.email || !orderInfo.address || !orderInfo.phone || !orderInfo.url
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