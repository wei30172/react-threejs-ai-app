import { useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { changeOrderInput } from '../../slices/orderSlice'
import { setDesign } from '../../slices/designSlice'
import { RootState } from '../../store'
import { uploadCanvasImage } from '../../utils/handleCanvasImage'
import { uploadImageWithUrl } from '../../utils/handleImage'
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

  const isFormValid = orderInfo.name && orderInfo.email && orderInfo.address && orderInfo.phone

  const handleUpload = useCallback(async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const designDataPromise = uploadCanvasImage()
      const logoDecalDataPromise = designInfo.isLogoTexture ? uploadImageWithUrl(designInfo.logoDecal_photo, 'logoDecal') : null
      const fullDecalDataPromise = designInfo.isFullTexture ? uploadImageWithUrl(designInfo.fullDecal_photo, 'fullDecal') : null

      const [designData, logoDecalData, fullDecalData] = await Promise.all([designDataPromise, logoDecalDataPromise, fullDecalDataPromise])

      if (designData) {
        dispatch(changeOrderInput({field: 'design_photo', value: designData.url}))
        dispatch(changeOrderInput({field: 'design_cloudinary_id', value: designData.public_id}))
      }

      if (logoDecalData) {
        dispatch(setDesign({ field: 'logoDecal_photo', value: logoDecalData.url }))
        dispatch(setDesign({ field: 'logoDecal_cloudinary_id', value: logoDecalData.public_id }))
      }

      if (fullDecalData) {
        dispatch(setDesign({ field: 'fullDecal_photo', value: fullDecalData.url }))
        dispatch(setDesign({ field: 'fullDecal_cloudinary_id', value: fullDecalData.public_id }))
      }
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
          disabled={!isFormValid}
          className='button button--outline'
          onClick={handleUpload}
        >
          Upload My Design
        </button>
      }
      {error && <span className='error-message'>{error}</span>}
      <div  className='upload-preview__design'>
        {orderInfo.design_photo ? <img src={orderInfo.design_photo} alt='preview' /> : <PreviewIcon />}
      </div>
      <button
        disabled={
          !isFormValid
          || !orderInfo.design_photo
          || !orderInfo.design_cloudinary_id
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