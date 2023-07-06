import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useCreateGigMutation } from '../../slices/apiSlice/gigsApiSlice'
import { changeGigInput, addImage, addImages, addFeature, removeFeature, resetGig, IGigState } from '../../slices/gigSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import useUpload from '../../hooks/useUpload'
import { Loader } from '../../components/icons'
import './AddGig.scss'

const AddGig: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const gigInfo = useSelector((state: RootState) => state.gig)

  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  
  const { uploading, handleUpload } = useUpload()

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
    if (fileLimit === 0) {
      return
    }

    if (fileLimit === 1) {
      setSingleFile(event.target.files ? event.target.files[0] : null)
      return
    }

    const dataTransfer = new DataTransfer()
    const files = Array.from(event.target.files || [])
    
    if (files.length === 0) {
      setFiles(null)
    }

    if (files.length > fileLimit) {
      dispatch(showToast({
        message: `You can upload up to ${fileLimit} images`,
        type: 'warning'
      }))
    }

    files.slice(0, fileLimit)
    files.forEach(file => dataTransfer.items.add(file))
    setFiles(dataTransfer.files)
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

  const handleUploadFiles = async () => {
    if (!singleFile || !files) {
      return dispatch(showToast({
        message: 'Please add files first',
        type: 'warning'
      }))
    }
  
    let gigPhoto, gigPhotos, gigCloudinaryId, gigCloudinaryIds
    
    const photoData = await handleUpload([singleFile])
    
    if (photoData && photoData[0]) {
      gigPhoto = photoData[0].url,
      gigCloudinaryId = photoData[0].public_id

      dispatch(addImage({
        gigPhoto,
        gigCloudinaryId
      }))

      setSingleFile(null)
    }
  
    const uploadResults = await handleUpload(Array.from(files))
    if (uploadResults) {
      gigPhotos = uploadResults.map(res => res.url),
      gigCloudinaryIds = uploadResults.map(res => res.public_id)

      dispatch(addImages({
        gigPhotos,
        gigCloudinaryIds
      }))

      setFiles(null)
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    if (gigInfo.gigPhoto !== '' && gigInfo.gigPhotos.length !== 0) {
      
      try {
        await createGig(gigInfo).unwrap()

        dispatch(resetGig())
        
        dispatch(showToast({
          message: 'Create gig successfully, To the My Gigs page in 3 seconds...',
          type: 'success'
        }))

        setTimeout(() => {
          navigate('/my-gigs')
        }, 3000)
        
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
            <input
              type='number'
              name='price'
              onChange={handleChange}
            />

            {/* Delivery Time */}
            <label htmlFor=''>Delivery day(s)</label>
            <input
              type='number'
              name='deliveryTime'
              onChange={handleChange}
            />
            
            {/* Images */}
            <div className='add-gig__images'>
              <div className='images_inputs'>
                <label htmlFor=''>Cover Image</label>
                <input
                  type='file'
                  onChange={(e) => handleImageChange(1, e)}
                />
                {gigInfo.gigPhoto && <div className='add-gig__image' >
                  <img src={gigInfo.gigPhoto} alt='gig photo' />
                </div>}
                <label htmlFor=''>Introductory Images (Max: 5)</label>
                <input
                  type='file'
                  multiple
                  onChange={(e) => handleImageChange(5, e)}
                />
                {gigInfo.gigPhotos.length > 0 && <div className='add-gig__image' >
                  {gigInfo.gigPhotos.map((image: string) => (
                    <img key={image} src={image} alt='gig photo' />
                  ))}
                </div>}
              </div>
              <button
                onClick={handleUploadFiles}
                className='button button--filled'
                disabled={
                  !singleFile ||
                  !files
                }
              >
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
              <button type='submit' className='button button--filled' >
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