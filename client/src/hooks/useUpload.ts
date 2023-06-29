import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { AxiosError } from '../slices/apiSlice'
import { showToast } from '../slices/toastSlice'
import { uploadImage } from '../utils/handleImage'

interface IUploadImage {
  url: string,
  public_id: string
}

const useUpload = () => {
  const dispatch = useDispatch()
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (files: File[]): Promise<IUploadImage[] | undefined> => {
    setUploading(true)
    
    try {
      const uploadResults = await Promise.all(
        files.map(async (file) => {
          const photoData = await uploadImage(file)
          if (photoData === undefined) {
            throw new Error(`Failed to upload file: ${file.name}`)
          }
          return photoData
        })
      )
      return uploadResults

    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = axiosError.response?.data?.message || 'Upload file(s) failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
      
    } finally {
      setUploading(false)
    }
  }

  return { uploading, handleUpload }
}

export default useUpload