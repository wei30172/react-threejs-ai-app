import { FC, useState, useEffect, useReducer, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { gigReducer, INITIAL_STATE, GigState, GigActionType } from '../../reducers/gigReducer'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

import { IGig } from '../../reducers/gigReducer'
import getCurrentUser from '../../utils/getCurrentUser'
import newRequest, { AxiosError } from '../../utils/newRequest'
import { uploadImage }  from '../../utils/handleUploadImage'
import { useToast } from '../../hooks/useToast'
import Toast from '../../components/toast/Toast'
import { Loader, ErrorIcon } from '../../components/icons'
import './EditGig.scss'

const EditGig: FC = () => {
  
  const { gigId } = useParams()

  const { isLoading, error, data } = useQuery<IGig, Error>({
    queryKey: ['gig'],
    queryFn: () => newRequest.get(`/gigs/single/${gigId}`).then((res) => res.data)
  })

  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  const [uploading, setUploading] = useState(false)

  const currentUser = getCurrentUser()
  const [state, dispatch] = useReducer(gigReducer, {...INITIAL_STATE, userId: currentUser?._id || null})

  const { showToast, hideToast, toastConfig } = useToast()

  const navigate = useNavigate()

  useEffect(() => {
    if (data) {
      dispatch({
        type: GigActionType.INITIALIZE_STATE,
        payload: data
      })
    }
  }, [data])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    dispatch({
      type: GigActionType.CHANGE_INPUT,
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
        showToast(`You can upload up to ${fileLimit} images.`, 'error')
      }
    }
  }
  
  const handleFeatureChange = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const input = form.querySelector('input')

    if (input) {

      dispatch({
        type: GigActionType.ADD_FEATURE,
        payload: input.value
      })
      input.value = ''
    }
  }

  const handleRemoveFeature = (feature: string) => {
    dispatch({ type: GigActionType.REMOVE_FEATURE, payload: feature })
  }

  const handleUpload = async () => {
    setUploading(true)

    try {
      let cover = state.cover, images = state.images
  
      if (singleFile) {
        const uploadResult = await uploadImage(singleFile)
        cover = uploadResult ? uploadResult : cover
      }
  
      if (files) {
        const uploadImages = await Promise.all(
          Array.from(files).map(async (file) => {
            const url = await uploadImage(file)
            if (url === undefined) {
              throw new Error(`Failed to upload file: ${file.name}`)
            }
            return url
          })
        )

        images = uploadImages.length > 0 ? uploadImages : images
      }

      if (cover || (images && images.length > 0)) {
        dispatch({ type: GigActionType.ADD_IMAGES, payload: { cover, images } })
      }

    } catch (error) {
      const axiosError = error as AxiosError
      const errorMessage = axiosError.response?.data?.message || 'Upload file(s) failed'
      showToast(errorMessage, 'error')
      
    } finally {
      setUploading(false)
    }
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (gig: GigState) => {
      return newRequest.put(`/gigs/${gigId}`, gig)
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['gigs'])
    }
  })

  const { isLoading: isLoadingGigs } = mutation

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    mutation.mutate(state, {
      onSuccess: () => {
        showToast('Update gig successfully, To the My Gigs page in 10 seconds...', 'success')
        setTimeout(() => {
          navigate('/my-gigs')
        }, 10000)
      },
      onError: (error: unknown) => {
        const axiosError = error as AxiosError
        const errorMessage = axiosError.response?.data?.message || 'Update gig failed'
        showToast(errorMessage, 'error')
      }
    })
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className='edit'>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <div className='container'>
            <h1>Edit Gig</h1>
            <div className='sections'>
              <div className='info'>
                {/* Title */}
                <label htmlFor=''>Service Title</label>
                <input
                  type='text'
                  name='title'
                  placeholder={data.title}
                  onChange={handleChange}
                />
                
                {/* Price */}
                <label htmlFor=''>Price ($)</label>
                <input
                  type='number'
                  placeholder={data.price.toString()}
                  onChange={handleChange} name='price'
                />
                {/* Delivery Time */}
                <label htmlFor=''>Delivery day(s)</label>
                <input type='number'
                  name='deliveryTime'
                  placeholder={data.deliveryTime.toString()}
                  onChange={handleChange}
                />
                
                {/* Images */}
                <div className='images'>
                  <div className='images_inputs'>
                    <label htmlFor=''>Cover Image</label>
                    <input
                      type='file'
                      onChange={(e) => handleFileChange(1, e)}
                    />
                    {!singleFile && <div className='images_img' >
                      <img src={data?.cover} alt='' />
                    </div>}
                    <label htmlFor=''>Introductory Images (Max: 5)</label>
                    <input
                      type='file'
                      multiple
                      onChange={(e) => handleFileChange(5, e)}
                    />
                    {!files && <div className='images_img' >
                      {data?.images?.map((image) => (
                        <img key={image} src={image} alt='' />
                      ))}
                    </div>}
                  </div>
                  <button
                    onClick={handleUpload}
                    disabled={
                      !singleFile &&
                      !files
                    }
                    className="button button--filled" >
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
                  placeholder={data.shortDesc}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor=''>Description</label>
                <textarea
                  name='desc'
                  rows={8}
                  id=''
                  placeholder={data.desc}
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
                uploading ||
                isLoadingGigs
              }
              onClick={handleSubmit} 
              className='button button--filled'
            >
              {isLoadingGigs ? <Loader /> : 'Update'}
            </button>
            <Link to='/my-gigs'>
              <button className='button button--outline'>
                Cancel
              </button>
            </Link>
          </div>)}
      </div>
    </>
  )
}

export default EditGig