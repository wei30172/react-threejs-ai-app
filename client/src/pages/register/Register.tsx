import { useState, useEffect } from 'react'
// import { ChangeEvent, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useRegisterMutation, IUserRegister } from '../../slices/apiSlice/authApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import useUpload from '../../hooks/useUpload'
import { FormInput } from '../../components'
import { PreviewIcon, Loader } from '../../components/icons'
import './Register.scss'

const Register: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  
  const { userInfo } = useSelector((state: RootState) => state.auth)
  const [file, setFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [user, setUser] = useState<IUserRegister>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
    isAdmin: false,
    user_photo: '',
    user_cloudinary_id: '',
  })

  const { uploading, handleUpload } = useUpload()

  const [register, { isLoading }] = useRegisterMutation()

  useEffect(() => {
    if (userInfo) {
      navigate('/')
    }
  }, [navigate, userInfo])
  
  const formInputs = [
    {
      id: 1,
      label: 'User Name',
      errorMessage:
        'User Name is required',
      name: 'username',
      type: 'text',
      placeholder: 'User Name',
      required: true
    },
    {
      id: 2,
      label: 'Email',
      errorMessage: 'Email should be a valid email address!',
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      required: true
    },
    {
      id: 3,
      label: 'Password',
      errorMessage:
        'Password should be 6-20 characters and include at least 1 letter, 1 number and 1 special character!',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$',
      required: true,
      value: ''
    },
    {
      id: 4,
      label: 'Confirm Password',
      errorMessage: 'Passwords do not match!',
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      pattern: user.password,
      required: true
    },
    {
      id: 5,
      label: 'Address',
      errorMessage: 'Address is required',
      name: 'address',
      type: 'text',
      placeholder: 'Address', // todo
      required: true
    },
    {
      id: 6,
      label: 'Phone',
      errorMessage: 'Phone number should be 10 digits and start with 09',
      name: 'phone',
      type: 'text',
      placeholder: 'Phone', // todo
      required: true
    }
  ]

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setUser({ ...user, [target.name]: target.value })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setPreviewURL(URL.createObjectURL(e.target.files[0]))
    } else {
      setFile(null)
      setPreviewURL(null)
    }
  }

  // const handlePremium = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { checked } = e.target
  //   setUser((prev) => {
  //     return { ...prev, isPremium: checked }
  //   })
  // }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    let updatedUser = user

    try {
      if (file) {
        const photoData = await handleUpload([file])
        if (photoData && photoData[0]) {
          updatedUser = {
            ...user,
            user_photo: photoData[0].url,
            user_cloudinary_id: photoData[0].public_id
          }
        }
      }

      await register(updatedUser).unwrap()
      
      dispatch(showToast({
        message: 'User has been created please login. To the home page in 5 seconds...',
        type: 'success'
      }))
      
      setTimeout(() => {
        navigate('/')
      }, 5000)

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Register failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }

  return (
    <section className='register flex-center'>
      <form onSubmit={handleSubmit}>
        <div className='register__left flex-center'>
          <h1>Create a new account</h1>
          {formInputs.map((input) => (
            <div key={input.id}>
              <FormInput
                key={input.id}
                {...input}
                value={user[input.name as keyof IUserRegister]?.toString()}
                handleChange={handleChange}
              />
            </div>
          ))}
        </div>
        <div className='register__right flex-center'>
          <div className='register__picture flex-center'>
            <label htmlFor=''>Profile Picture</label>
            <input type='file' onChange={handleFileChange} />
            {previewURL ? <img src={previewURL} alt='preview' /> : <PreviewIcon />}
          </div>
          {/* <div className='toggle flex-center'>
            <label htmlFor=''>Activate the premium account for FREE</label>
            <label className='switch'>
              <input type='checkbox' onChange={handlePremium} />
              <span className='slider round'></span>
            </label>
          </div> */}
          <button
            disabled={
              !user.username ||
              !user.email ||
              !user.password ||
              !user.confirmPassword ||
              !user.address ||
              !user.phone ||
              isLoading ||
              uploading
            }
            className='button button--filled'
            type='submit'
          >
            {isLoading || uploading ? <Loader /> : 'Register'}
          </button>
          <div className='register__navigation flex-center'>
            <p>Already have an account?</p>
            <Link to='/login'>
              <button className='cursor-pointer'>
                Login
              </button>
            </Link>
          </div>
        </div>
      </form>
    </section>
  )
}

export default Register