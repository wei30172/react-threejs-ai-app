import { FC, useState } from 'react'
// import { FC, ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'

import newRequest, { AxiosError } from '../../utils/newRequest'
import { uploadImage }  from '../../utils/handleUploadImage'
import { useToast } from '../../hooks/useToast'
import { FormInput, Toast } from '../../components'
import { PreviewIcon, Loader } from '../../components/icons'
import './Register.scss'

export interface IUser {
  username: string
  email: string
  password: string
  confirmPassword: string
  img: string
  address: string
  phone: string
  isSeller: boolean
}

const Register: FC = () => {
  const [file, setFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [user, setUser] = useState<IUser>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    img: '',
    address: '',
    phone: '',
    isSeller: false
  })

  const { showToast, hideToast, toastConfig } = useToast()

  const navigate = useNavigate()
  
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
      placeholder: 'Address',
      required: true
    },
    {
      id: 6,
      label: 'Phone',
      errorMessage: 'Phone number should be 10 digits and start with 09',
      name: 'phone',
      type: 'text',
      placeholder: '09xxxxxxxx',
      pattern: '^09[0-9]{8}$',
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

  // const handleSeller = (e: ChangeEvent<HTMLInputElement>) => {
  //   const { checked } = e.target
  //   setUser((prev) => {
  //     return { ...prev, isSeller: checked }
  //   })
  // }

  const registerMutation = useMutation({
    mutationFn: async (userData: IUser) => {
      if (file !== null) {
        const url = await uploadImage(file)
        return newRequest.post('/auth/register', {
          ...userData,
          img: url
        })
      } else {
        throw new Error('Please upload an avatar image')
      }
    },
    onSuccess: () => {
      showToast('User has been created please login. To the home page in 10 seconds...', 'success')
      setTimeout(() => {
        navigate('/')
      }, 10000)
    },
    onError: (error) => {
      if (error instanceof Error && error.message === 'Please upload an avatar image') {
        showToast('Please upload an avatar image', 'warning')
      } else {
        const axiosError = error as AxiosError
        const errorMessage = axiosError.response?.data?.message || 'Register failed'
        showToast(errorMessage, 'error')
      }
    }
  })

  const { isLoading } = registerMutation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    registerMutation.mutateAsync(user)
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className='register flex-center'>
        <form onSubmit={handleSubmit}>
          <div className='left flex-center'>
            <h1>Create a new account</h1>
            {formInputs.map((input) => (
              <div key={input.id}>
                <FormInput
                  key={input.id}
                  {...input}
                  value={user[input.name as keyof IUser]?.toString()}
                  handleChange={handleChange}
                />
              </div>
            ))}
          </div>
          <div className='right flex-center'>
            <div className='picture flex-center'>
              <label htmlFor=''>Profile Picture</label>
              <input type='file' onChange={handleFileChange} />
              {previewURL ? <img src={previewURL} alt='preview' /> : <PreviewIcon />}
            </div>
            {/* <div className='toggle flex-center'>
              <label htmlFor=''>Activate the seller account for FREE</label>
              <label className='switch'>
                <input type='checkbox' onChange={handleSeller} />
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
                toastConfig.type === 'success'
              }
              className='button button--filled'
              type='submit'
            >
              {isLoading ? <Loader /> : 'Register'}
            </button>
            <div className='navigation flex-center'>
              <p>Already have an account?</p>
              <button className='cursor-pointer' onClick={() => navigate('/login')}>
                Login
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

export default Register