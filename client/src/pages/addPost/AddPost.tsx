import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import { useGenerateDalleImageMutation } from '../../slices/apiSlice/dalleApiSlice'
import { useCreateImagePostMutation } from '../../slices/apiSlice/postApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { getRandomPrompt } from '../../utils/getRandomPrompt'
import { downloadImage } from '../../utils/handleImage'
import { useToast } from '../../hooks/useToast'
import { FormInput, SurpriseMeInput, CustomButton, Toast } from '../../components'
import { Loader, PreviewIcon } from '../../components/icons'
import './AddPost.scss'

const AddPost: React.FC = () => {
  const navigate = useNavigate()
  
  const [isFocused, setFocused] = useState(false)
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: ''
  })

  const { showToast, hideToast, toastConfig } = useToast()

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
        showToast(errorMessage, 'error')
      }
    } else {
      showToast('Please enter a prompt', 'warning')
    }
  }, [form.prompt, generateDalleImage, showToast])

  const handleDownloadImage = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    
    if (form.photo) {
      downloadImage(form.photo, 'download-image')
    } else {
      showToast('No image to download. Please generate an image first.', 'warning')
    }
  }, [form.photo, showToast])

  const handleSubmit = useCallback(async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (form.name && form.prompt && form.photo) {
      try {
        await createImagePost({...form}).unwrap()
        showToast('Success', 'success')
        navigate('/posts')

      } catch (error) {
        const apiError = error as ApiError
        const errorMessage = apiError.data?.message || 'Create post failed'
        showToast(errorMessage, 'error')
      }
    } else {
      if (!form.name) {
        showToast('please enter your username', 'warning')
      } else {
        showToast('Please generate an image with proper details', 'warning')
      }
    }
  }, [form, createImagePost, showToast, navigate])
  
  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
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
    </>
  )
}

export default AddPost