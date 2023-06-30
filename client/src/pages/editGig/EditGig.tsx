import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useGetSingleGigQuery, useUpdateGigMutation } from '../../slices/apiSlice/gigsApiSlice'
import { changeGigInput, addImage, addImages, addFeature, removeFeature, resetGig, IGigState } from '../../slices/gigSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import useUpload from '../../hooks/useUpload'
import { Loader, ErrorIcon } from '../../components/icons'
import './EditGig.scss'

const EditGig: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { gigId } = useParams()

  const { isLoading, error, data } = useGetSingleGigQuery(gigId)

  const [singleFile, setSingleFile] = useState<File | null>(null)
  const [files, setFiles] = useState<FileList | null>(null)
  
  const { uploading, handleUpload } = useUpload()

  const gigInfo = useSelector((state: RootState) => state.gig)

  useEffect(() => {
    return () => {
      dispatch(resetGig())
    }
  }, [dispatch])

  const [updateGig, { isLoading: isCreatingGig }] = useUpdateGigMutation()
  
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
        message: `You can upload up to ${fileLimit} images.`,
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
    if (!singleFile && !files) {
      dispatch(showToast({
        message: 'Please add files first',
        type: 'warning'
      }))
    }

    let gig_photo, gig_photos, gig_cloudinary_id, gig_cloudinary_ids

    if (singleFile) {
      const photoData = await handleUpload([singleFile])
      if (photoData && photoData[0]) {
        gig_photo = photoData[0].url,
        gig_cloudinary_id = photoData[0].public_id
  
        dispatch(addImage({
          gig_photo,
          gig_cloudinary_id
        }))
  
        setSingleFile(null)
      }
    }

    if (files) {
      const uploadResults = await handleUpload(Array.from(files))
      if (uploadResults) {
        gig_photos = uploadResults.map(res => res.url),
        gig_cloudinary_ids = uploadResults.map(res => res.public_id)

        dispatch(addImages({
          gig_photos,
          gig_cloudinary_ids
        }))

        setFiles(null)
      }
    }
  }

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault()

    if ((singleFile || files) && (!gigInfo.gig_photo || !gigInfo.gig_photos)) {
      dispatch(showToast({
        message: 'Please upload selected files before updating gig',
        type: 'warning'
      }))
      return
    }

    try {
      await updateGig({gigId, data: gigInfo}).unwrap()

      dispatch(resetGig())
      
      dispatch(showToast({
        message: 'Update gig successfully, To the My Gigs page in 3 seconds...',
        type: 'success'
      }))
      
      setTimeout(() => {
        navigate('/my-gigs')
      }, 3000)

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Update gig failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }

  return (
    <section className='edit-gig'>
      {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
        <div className='container'>
          <h1>Edit Gig</h1>
          <div className='edit-gig__sections'>
            <div className='edit-gig__info'>
              {/* Title */}
              <label htmlFor=''>Service Title</label>
              <input
                type='text'
                name='title'
                value={data?.title}
                onChange={handleChange}
              />
              
              {/* Price */}
              <label htmlFor=''>Price ($)</label>
              <input
                type='number'
                value={data?.price.toString()}
                onChange={handleChange} name='price'
              />
              {/* Delivery Time */}
              <label htmlFor=''>Delivery day(s)</label>
              <input type='number'
                name='deliveryTime'
                value={data?.deliveryTime.toString()}
                onChange={handleChange}
              />
              
              {/* Images */}
              <div className='edit-gig__images'>
                <div className='images_inputs'>
                  <label htmlFor=''>Cover Image</label>
                  <input
                    type='file'
                    onChange={(e) => handleImageChange(1, e)}
                  />
                  <div className='edit-gig__image' >
                    <img
                      src={gigInfo.gig_photo ? gigInfo.gig_photo : data?.gig_photo}
                      alt='gig photo' />
                  </div>
                  <label htmlFor=''>Introductory Images (Max: 5)</label>
                  <input
                    type='file'
                    multiple
                    onChange={(e) => handleImageChange(5, e)}
                  />
                  <div className='edit-gig__image'>
                    {(gigInfo.gig_photos.length > 0 ?
                      gigInfo.gig_photos : 
                      data?.gig_photos)?.map((image: string) => (
                      <img key={image} src={image} alt='gig photo' />
                    ))}
                  </div>
                </div>
                <button
                  onClick={handleUploadFiles}
                  disabled={
                    !singleFile &&
                    !files
                  }
                  className="button button--filled" >
                  {uploading ? 'Uploading' : 'Upload'}
                </button>
              </div>
            </div>
            <div className='edit-gig__details'>
              {/* Description */}
              <label htmlFor=''>Short Description</label>
              <textarea
                name='shortDesc'
                rows={5}
                id=''
                value={data?.shortDesc}
                onChange={handleChange}
              ></textarea>
              <label htmlFor=''>Description</label>
              <textarea
                name='desc'
                rows={8}
                id=''
                value={data?.desc}
                onChange={handleChange}
              ></textarea>
              
              {/* Features */}
              <label htmlFor=''>Add Features</label>
              <form action='' className='edit-gig__add-btn' onSubmit={handleFeatureChange}>
                <input type='text' placeholder='e.g. page design' />
                <button type='submit' className="button button--filled" >
                  add
                </button>
              </form>
              <div className='edit-gig__features'>
                {(gigInfo.features.length > 0 ?
                  gigInfo.features : 
                  data?.features)?.map((f, i) => (
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
              isCreatingGig
            }
            onClick={handleSubmit} 
            className='button button--filled'
          >
            {isCreatingGig ? <Loader /> : 'Update'}
          </button>
          <Link to='/my-gigs'>
            <button className='button button--outline'>
              Cancel
            </button>
          </Link>
        </div>)}
    </section>
  )
}

export default EditGig