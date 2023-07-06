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
      const logoDecalDataPromise = designInfo.isLogoTexture ? uploadImageWithUrl(designInfo.logoDecalPhoto, 'logoDecal') : null
      const fullDecalDataPromise = designInfo.isFullTexture ? uploadImageWithUrl(designInfo.fullDecalPhoto, 'fullDecal') : null

      const [designData, logoDecalData, fullDecalData] = await Promise.all([designDataPromise, logoDecalDataPromise, fullDecalDataPromise])

      if (designData) {
        dispatch(changeOrderInput({field: 'designPhoto', value: designData.url}))
        dispatch(changeOrderInput({field: 'designCloudinaryId', value: designData.public_id}))
      }

      if (logoDecalData) {
        dispatch(setDesign({ field: 'logoDecalPhoto', value: logoDecalData.url }))
        dispatch(setDesign({ field: 'logoDecalCloudinaryId', value: logoDecalData.public_id }))
      }

      if (fullDecalData) {
        dispatch(setDesign({ field: 'fullDecalPhoto', value: fullDecalData.url }))
        dispatch(setDesign({ field: 'fullDecalCloudinaryId', value: fullDecalData.public_id }))
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
        {orderInfo.designPhoto ? <img src={orderInfo.designPhoto} alt='preview' /> : <PreviewIcon />}
      </div>
      <button
        disabled={
          !isFormValid
          || !orderInfo.designPhoto
          || !orderInfo.designCloudinaryId
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