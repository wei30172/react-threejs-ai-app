import { FC, useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useCreateGigMutation } from '../../slices/apiSlice/gigsApiSlice'
import { changeGigInput, addImages, addFeature, removeFeature, IGigState } from '../../slices/gigSlice'
import { RootState } from '../../store'
import { ApiError, AxiosError } from '../../slices/apiSlice'

import { uploadImage } from '../../utils/handleUploadImage'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/toast/Toast'
import { Loader } from '../../components/icons'
import './AddGig.scss'

const AddGig: FC = () => {
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)

  const { userInfo } = useSelector((state: RootState) => state.auth)
  const gigInfo = useSelector((state: RootState) => state.gig)

  const { showToast, hideToast, toastConfig } = useToast()

  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  const handleFileChange = (fileLimit: number, event: React.ChangeEvent<HTMLInputElement>) => {
    if (fileLimit === 0) {
      return

    } else if (fileLimit === 1) {
      setSingleFile(event.target.files ? event.target.files[0] : null)

    } else {
      const dataTransfer = new DataTransfer()
      const files = Array.from(event.target.files || [])
      
      files.slice(0, fileLimit)
      files.forEach(file => dataTransfer.items.add(file))
      setFiles(dataTransfer.files)

      if (files.length > fileLimit) {
        showToast(`You can upload up to ${fileLimit} images.`, 'warning')
      }
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
      return showToast('Please add files first', 'warning')
    }

    setUploading(true)
    try {
      const cover = await uploadImage(singleFile)
      
      const images = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await uploadImage(file)
          if (url === undefined) {
            throw new Error(`Failed to upload file: ${file.name}`)
          }
          return url
        })
      )

      if (cover && images.length > 0) dispatch(addImages({ cover, images }))
    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = axiosError.response?.data?.message || 'Upload file(s) failed'
      showToast(errorMessage, 'error')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    if (gigInfo.cover !== '' && gigInfo.images.length !== 0) {
      try {
        await createGig(gigInfo).unwrap()
        showToast('Create gig successfully, To the My Gigs page in 5 seconds...', 'success')
        setTimeout(() => {
          navigate('/my-gigs')
        }, 5000)
      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = apiError.data?.message || 'Create gig failed'
        showToast(errorMessage, 'error')
      }
    } else {
      showToast('Please upload files first', 'warning')
    }
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className='add'>
        <div className='container'>
          <h1>Add New Gig</h1>
          <div className='sections'>
            <div className='info'>
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
              <div className='images'>
                <div className='images_inputs'>
                  <label htmlFor=''>Cover Image</label>
                  <input
                    type='file'
                    onChange={(e) => handleFileChange(1, e)}
                  />
                  <label htmlFor=''>Introductory Images (Max: 5)</label>
                  <input
                    type='file'
                    multiple
                    onChange={(e) => handleFileChange(5, e)}
                  />
                </div>
                <button onClick={handleUpload} className="button button--filled" >
                  {uploading ? 'Uploading' : 'Upload'}
                </button>
              </div>
            </div>
            <div className='details'>
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
              <form action='' className='add' onSubmit={handleFeatureChange}>
                <input type='text' placeholder='e.g. page design' />
                <button type='submit' className="button button--filled" >
                  add
                </button>
              </form>
              <div className='addedFeatures'>
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
      </div>
    </>
  )
}

export default AddGig