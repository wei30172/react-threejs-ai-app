import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'

import newRequest, { AxiosError } from '../../utils/newRequest'
import { useToast } from '../../hooks/useToast'
import { FormInput, Toast } from '../../components'
import { Loader, ErrorIcon } from '../../components/icons'
import './Profile.scss'

export interface IUserData {
  username: string
  password: string
  confirmPassword: string
}

const Profile: FC = () => {
  const { isLoading, error, data } = useQuery<IUserData, Error>({
    queryKey: ['user'],
    queryFn: () =>newRequest.get('/users/profile').then((res) => res.data)
  })
  
  const [user, setUser] = useState<IUserData>({
    username: '',
    password: '',
    confirmPassword: ''
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
      placeholder: data?.username || 'User Name',
      required: false
    },
    {
      id: 2,
      label: 'Password',
      errorMessage:
        'Password should be 6-20 characters and include at least 1 letter, 1 number and 1 special character!',
      name: 'password',
      type: 'password',
      placeholder: 'Password',
      pattern: '^(?=.*[0-9])(?=.*[a-zA-Z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,20}$',
      value: '',
      required: false
    },
    {
      id: 3,
      label: 'Confirm Password',
      errorMessage: 'Passwords do not match!',
      name: 'confirmPassword',
      type: 'password',
      placeholder: 'Confirm Password',
      pattern: user.password,
      required: false
    }
  ]

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setUser({ ...user, [target.name]: target.value })
  }

  const registerMutation = useMutation({
    mutationFn: (userData: IUserData) => {
      return newRequest.put('/users/profile', userData)
    },
    onSuccess: async () => {
      await newRequest.post('/auth/logout')
      localStorage.setItem('currentUser', '')
      showToast('User has been updated. Redirecting to the login page in 10 seconds...', 'success')
      setTimeout(() => {
        navigate('/login')
      }, 10000)
    },
    onError: (error) => {
      const axiosError = error as AxiosError
      const errorMessage = axiosError.response?.data?.message || 'Update failed'
      showToast(errorMessage, 'error')
    }
  })

  const { isLoading: isLoadingAuth } = registerMutation

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    registerMutation.mutate(user)
  }

  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={hideToast}
      />
      <div className='profile flex-center'>
        {isLoading ? <Loader /> : error ? <ErrorIcon /> : (
          <form className='flex-center' onSubmit={handleSubmit}>
            <h1>Update profile</h1>
            {formInputs.map((input) => (
              <div key={input.id}>
                <FormInput
                  key={input.id}
                  {...input}
                  value={user[input.name as keyof IUserData]?.toString()}
                  handleChange={handleChange}
                />
              </div>
            ))}
            <button
              disabled={
                isLoadingAuth ||
                toastConfig.type === 'success'
              }
              className='button button--filled'
              type='submit'
            >
              {isLoadingAuth ? <Loader /> : 'Update'}
            </button>
          </form>
        )}
      </div>
    </>
  )
}

export default Profile