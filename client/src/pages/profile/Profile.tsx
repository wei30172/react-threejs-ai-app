import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useUpdateUserProfileMutation, IUserProfile } from '../../slices/apiSlice/usersApiSlice'
import { useLogoutMutation } from '../../slices/apiSlice/authApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { logout } from '../../slices/authSlice'
import { RootState } from '../../store'
import { useToast } from '../../hooks/useToast'
import { FormInput, Toast } from '../../components'
import { Loader } from '../../components/icons'
import './Profile.scss'

const Profile: React.FC = () => {
  const [user, setUser] = useState<IUserProfile>({
    username: '',
    password: '',
    confirmPassword: ''
  })

  const { showToast, hideToast, toastConfig } = useToast()

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [updateUserProfile, { isLoading }] = useUpdateUserProfileMutation()
  const [logoutApiCall] = useLogoutMutation()

  const { userInfo } = useSelector((state: RootState) => state.auth)

  const formInputs = [
    {
      id: 1,
      label: 'User Name',
      errorMessage:
        'User Name is required',
      name: 'username',
      type: 'text',
      placeholder: userInfo?.username || 'User Name',
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await updateUserProfile(user).unwrap()
      await logoutApiCall().unwrap()
      dispatch(logout())
      showToast('User has been updated. Redirecting to the login page in 5 seconds...', 'success')
      
      setTimeout(() => {
        navigate('/login')
      }, 5000)

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Update failed'
      showToast(errorMessage, 'error')
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
      <div className='profile flex-center'>
        <form className='flex-center' onSubmit={handleSubmit}>
          <h1>Update profile</h1>
          {formInputs.map((input) => (
            <div key={input.id}>
              <FormInput
                key={input.id}
                {...input}
                value={user[input.name as keyof IUserProfile]?.toString()}
                handleChange={handleChange}
              />
            </div>
          ))}
          <button
            disabled={
              isLoading ||
              toastConfig.type === 'success'
            }
            className='button button--filled'
            type='submit'
          >
            {isLoading ? <Loader /> : 'Update'}
          </button>
        </form>
      </div>
    </>
  )
}

export default Profile