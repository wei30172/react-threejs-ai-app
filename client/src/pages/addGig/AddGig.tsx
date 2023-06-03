import { FC, useState, useReducer, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { gigReducer, INITIAL_STATE, GigState, GigAction } from '../../reducers/gigReducer'
import { AxiosError } from 'axios'

import newRequest, { IErrorResponse } from '../../utils/newRequest'
import upload from '../../utils/uploadImage'
import Toast, { ToastProps } from '../../components/toast/Toast'
import { Loader } from '../../components/icons'
import './AddGig.scss'

const AddGig: FC = () => {
  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [state, dispatch] = useReducer<(state: GigState, action: GigAction) => GigState>(gigReducer, INITIAL_STATE)

  const [toastConfig, setToastConfig] = useState<ToastProps>({
    message: '',
    isVisible: false
  })

  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dispatch({
      type: 'CHANGE_INPUT',
      payload: { name: e.target.name, value: e.target.value }
    })
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
        setToastConfig({
          message: `You can upload up to ${fileLimit} images.`,
          isVisible: true,
          type: 'error'
        })
      }
    }
  }
  
  const handleFeatureChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input')

    if (input) {

      dispatch({
        type: 'ADD_FEATURE',
        payload: input.value
      })
      input.value = ''
    }
  }

  const handleRemoveFeature = (feature: string) => {
    dispatch({ type: 'REMOVE_FEATURE', payload: feature })
  }

  const handleUpload = async () => {
    if (!singleFile || !files) {
      return
    }

    setUploading(true)
    try {
      const cover = await upload(singleFile)

      const images = await Promise.all(
        Array.from(files).map(async (file) => {
          const url = await upload(file)
          if (url === undefined) {
            throw new Error(`Failed to upload file: ${file.name}`)
          }
          return url
        })
      )

      if (cover && images.length > 0)
        dispatch({ type: 'ADD_IMAGES', payload: { cover, images } })
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const errorMessage = axiosError.response?.data?.message || 'Upload file(s) failed'
      
      setToastConfig({
        message: errorMessage,
        isVisible: true,
        type: 'error'
      })
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (state.cover !== '' && state.images.length !== 0) {
      try {
        setIsLoading(true)
        await newRequest.post('/gigs', state)
        setToastConfig({
          message: 'Create gig successfully, To the My Gigs page in 10 seconds...',
          isVisible: true,
          type: 'success'
        })
        setTimeout(() => {
          navigate('/my-gigs')
        }, 10000)
      } catch (error) {
        const axiosError = error as AxiosError<IErrorResponse>
        const errorMessage = axiosError.response?.data?.message || 'Create gig failed'
        
        setToastConfig({
          message: errorMessage,
          isVisible: true,
          type: 'error'
        })
      } finally {
        setIsLoading(false)
      }
    } else {
      setToastConfig({
        message: 'Please upload files first',
        isVisible: true,
        type: 'warning'
      })
    }
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={() => setToastConfig({isVisible: false, message: ''})}
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
                <div className='imagesInputs'>
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
                onChange={handleChange}
                id=''
                placeholder='Short description of your service'
                rows={5}
              ></textarea>
              <label htmlFor=''>Description</label>
              <textarea
                name='desc'
                id=''
                placeholder='Brief descriptions to introduce your service to customers'
                rows={8}
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
                {state?.features?.map((f, i) => (
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
              !state.title ||
              !state.desc ||
              !state.shortDesc ||
              !state.deliveryTime ||
              !state.features ||
              uploading ||
              isLoading
            }
            onClick={handleSubmit} 
            className='button button--filled'
          >
            {isLoading ? <Loader /> : 'Create'}
          </button>
        </div>
      </div>
    </>
  )
}

export default AddGig