import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useCreateGigMutation } from '../../slices/apiSlice/gigsApiSlice'
import { changeGigInput, addImage, addImages, addFeature, removeFeature, resetGig, IGigState } from '../../slices/gigSlice'
import { ApiError, AxiosError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { uploadImage } from '../../utils/handleImage'
import { Loader } from '../../components/icons'
import './AddGig.scss'

const AddGig: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const gigInfo = useSelector((state: RootState) => state.gig)

  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (userInfo) dispatch(changeGigInput({field: 'userId', value: userInfo._id}))
  }, [dispatch, userInfo])

  const [createGig, { isLoading: isCreatingGig }] = useCreateGigMutation()
  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement
    dispatch(
      changeGigInput({
        field: target.name as keyof IGigState,
        value: target.value
      })
    )
  }

  const handleImageChange = (fileLimit: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fileLimit) {
      return
    }

    if (fileLimit === 1) {
      setSingleFile(event.target.files ? event.target.files[0] : null)
      return
    }

    const dataTransfer = new DataTransfer()
    const files = Array.from(event.target.files || [])
    
    files.slice(0, fileLimit)
    files.forEach(file => dataTransfer.items.add(file))
    setFiles(dataTransfer.files)

    if (files.length > fileLimit) {
      dispatch(showToast({
        message: `You can upload up to ${fileLimit} images`,
        type: 'warning'
      }))
    }
  }
  
  const handleFeatureChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input')

    if (input) {
      dispatch(addFeature(input.value))
      input.value = ''
    }
  }

  const handleRemoveFeature = (feature: string) => {
    dispatch(removeFeature(feature))
  }

  const handleUpload = async () => {
    if (!singleFile || !files) {
      return dispatch(showToast({
        message: 'Please add files first',
        type: 'warning'
      }))
    }

    setUploading(true)
    try {
      let gig_photo, gig_photos, gig_cloudinary_id, gig_cloudinary_ids
  
      const photoData = await uploadImage(singleFile)
      if (photoData) {
        gig_photo = photoData.url
        gig_cloudinary_id = photoData.public_id
      }
  
      const uploadResults = await Promise.all(
        Array.from(files).map(async (file) => {
          const photoData = await uploadImage(file)
          if (photoData === undefined) {
            throw new Error(`Failed to upload file: ${file.name}`)
          }
          return photoData
        })
      )

      const photoUrls = uploadResults.map(result => result.url)
      const photoIds = uploadResults.map(result => result.public_id)

      if (photoUrls.length > 0 && photoIds.length > 0) {
        gig_photos = photoUrls
        gig_cloudinary_ids = photoIds
      }

      if (gig_photo && gig_cloudinary_id) {
        dispatch(addImage({
          gig_photo,
          gig_cloudinary_id
        }))
      }

      if ((gig_photos && gig_photos.length > 0) && (gig_cloudinary_ids && gig_cloudinary_ids.length > 0)) {
        dispatch(addImages({
          gig_photos,
          gig_cloudinary_ids
        }))
      }

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

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    if (gigInfo.gig_photo !== '' && gigInfo.gig_photos.length !== 0) {
      
      try {
        await createGig(gigInfo).unwrap()

        dispatch(resetGig())
        
        dispatch(showToast({
          message: 'Create gig successfully, To the My Gigs page in 5 seconds...',
          type: 'success'
        }))

        setTimeout(() => {
          navigate('/my-gigs')
        }, 5000)
        
      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = apiError.data?.message || 'Create gig failed'

        dispatch(showToast({
          message: errorMessage,
          type: 'error'
        }))
      }
      
    } else {
      dispatch(showToast({
        message: 'Please upload files first',
        type: 'warning'
      }))
    }
  }

  return (
    <section className='add-gig'>
      <div className='container'>
        <h1>Add New Gig</h1>
        <div className='add-gig__sections'>
          <div className='add-gig__info'>
            {/* Title */}
            <label htmlFor=''>Service Title</label>
            <input
              type='text'
              name='title'
              placeholder='e.g. One-page web design'
              onChange={handleChange}
            />
            
            {/* Price */}
            <label htmlFor=''>Price ($)</label>
            <input type='number' onChange={handleChange} name='price' />
            
            {/* Delivery Time */}
            <label htmlFor=''>Delivery day(s)</label>
            <input type='number' name='deliveryTime' onChange={handleChange} />
            
            {/* Images */}
            <div className='add-gig__images'>
              <div className='images_inputs'>
                <label htmlFor=''>Cover Image</label>
                <input
                  type='file'
                  onChange={(e) => handleImageChange(1, e)}
                />
                <label htmlFor=''>Introductory Images (Max: 5)</label>
                <input
                  type='file'
                  multiple
                  onChange={(e) => handleImageChange(5, e)}
                />
              </div>
              <button onClick={handleUpload} className="button button--filled" >
                {uploading ? 'Uploading' : 'Upload'}
              </button>
            </div>
          </div>
          <div className='add-gig__details'>
            {/* Description */}
            <label htmlFor=''>Short Description</label>
            <textarea
              name='shortDesc'
              rows={5}
              id=''
              placeholder='Short description of your service'
              onChange={handleChange}
            ></textarea>
            <label htmlFor=''>Description</label>
            <textarea
              name='desc'
              rows={8}
              id=''
              placeholder='Brief descriptions to introduce your service to customers'
              onChange={handleChange}
            ></textarea>
            
            {/* Features */}
            <label htmlFor=''>Add Features</label>
            <form action='' className='add-gig__add-btn' onSubmit={handleFeatureChange}>
              <input type='text' placeholder='e.g. page design' />
              <button type='submit' className="button button--filled" >
                add
              </button>
            </form>
            <div className='add-gig__features'>
              {gigInfo?.features?.map((f, i) => (
                <div className='item' key={`${f}-${i}`}>
                  <button
                    onClick={() => handleRemoveFeature(f)}
                    className='cursor-pointer'
                  >
                    {f}<span>X</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <button
          disabled={
            !gigInfo.title ||
            !gigInfo.desc ||
            !gigInfo.shortDesc ||
            !gigInfo.deliveryTime ||
            !gigInfo.features ||
            uploading ||
            isCreatingGig
          }
          onClick={handleSubmit} 
          className='button button--filled'
        >
          {isCreatingGig ? <Loader /> : 'Create'}
        </button>
      </div>
    </section>
  )
}

export default AddGig