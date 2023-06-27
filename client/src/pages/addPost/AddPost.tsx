import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { useGenerateDalleImageMutation } from '../../slices/apiSlice/dalleApiSlice'
import { useCreateImagePostMutation } from '../../slices/apiSlice/postApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { getRandomPrompt } from '../../utils/getRandomPrompt'
import { downloadImage } from '../../utils/handleImage'
import { FormInput, SurpriseMeInput, CustomButton } from '../../components'
import { Loader, PreviewIcon } from '../../components/icons'
import './AddPost.scss'

const AddPost: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const [isFocused, setFocused] = useState(false)
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  })

  const [generateDalleImage, { isLoading: isGeneratingImage }] = useGenerateDalleImageMutation()
  const [createImagePost, { isLoading: isCreatingPost }] = useCreateImagePostMutation()

  const handleChange = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement

    setForm(prevForm => ({ ...prevForm, [target.name]: target.value }))
  }, [])

  const handleSurpriseMe = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm(prevForm => ({ ...prevForm, prompt: randomPrompt }))
  }, [form.prompt])

  const handleAddImage = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (form.prompt) {
      try {
        const imageData = await generateDalleImage({prompt: form.prompt}).unwrap()
        setForm(prevForm => ({ ...prevForm, photo: `data:image/jpeg;base64,${imageData}` }))
        
      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = apiError.data?.message || 'Generate failed'

        dispatch(showToast({
          message: errorMessage,
          type: 'error'
        }))
      }
      
    } else {
      dispatch(showToast({
        message: 'Please enter a prompt',
        type: 'warning'
      }))
    }
  }, [form.prompt, generateDalleImage, dispatch])

  const handleDownloadImage = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (form.photo) {
      downloadImage(form.photo, 'download-image')

    } else {
      dispatch(showToast({
        message: 'No image to download. Please generate an image first',
        type: 'warning'
      }))
    }
  }, [form.photo, dispatch])

  const handleSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (form.name && form.prompt && form.photo) {
      try {
        await createImagePost({...form}).unwrap()

        dispatch(showToast({
          message: 'Created post successfully',
          type: 'success'
        }))

        navigate('/posts')

      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = apiError.data?.message || 'Create post failed'
        
        dispatch(showToast({
          message: errorMessage,
          type: 'error'
        }))
      }

    } else {
      if (!form.name) {
        dispatch(showToast({
          message: 'please enter your username',
          type: 'warning'
        }))

      } else {
        dispatch(showToast({
          message: 'Please generate an image with proper details',
          type: 'warning'
        }))
      }
    }
  }, [form, createImagePost, navigate, dispatch])
  
  return (
    <section className='add-post'>
      <div className='container'>
        <div className='title'>
          <h1>Generate</h1>
          <p>Generate an imaginative image through DALL-E AI</p>
        </div>

        <form className='add-post__form'>
          <div className='add-post__inputs'>
            <FormInput
              label='Name'
              errorMessage='User Name is required'
              name='name'
              type='text'
              placeholder='User Name'
              required
              value={form.name}
              handleChange={handleChange}
            />

            <SurpriseMeInput
              label='Prompt'
              errorMessage='Prompt is required'
              name='prompt'
              type='text'
              placeholder='an oil painting of a serene garden filled with robotic wildlife'
              required
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />

            <div
              className={`add-post__preview flex-center ${isFocused ? 'focused' : ''}`}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
            >
              
              { form.photo ? (
                <img
                  src={form.photo}
                  alt={form.prompt}
                  className='add-post__image'
                />
              ) : (
                <PreviewIcon/>
              )}

              { isGeneratingImage && (
                <div className='add-post__loader'>
                  <Loader />
                </div>
              )}
            </div>
          </div>

          <div className='add-post__buttons'>
            <CustomButton
              type='filled'
              title={isGeneratingImage ? 'Generating...' : 'Generate'}
              handleClick={handleAddImage}
            />
            <CustomButton
              type='filled'
              title='Download image'
              handleClick={handleDownloadImage}
            />
            <CustomButton 
              type='filled'
              title={isCreatingPost ? 'Savng...' : 'Save the image'}
              handleClick={handleSubmit}
            />
          </div>
        </form>
      </div>
    </section>
  )
}

export default AddPost