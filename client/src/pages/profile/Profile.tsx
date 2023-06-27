import { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { useUpdateUserProfileMutation, IUserProfile } from '../../slices/apiSlice/usersApiSlice'
import { useLogoutMutation } from '../../slices/apiSlice/authApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { logout } from '../../slices/authSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { uploadImage }  from '../../utils/handleImage'
import { FormInput } from '../../components'
import { PreviewIcon, Loader } from '../../components/icons'
import './Profile.scss'

const Profile: React.FC = () => {
  const dispatch = useDispatch()
  
  const [file, setFile] = useState<File | null>(null)
  const [previewURL, setPreviewURL] = useState<string | null>(null)
  const [user, setUser] = useState<IUserProfile>({
    username: '',
    password: '',
    confirmPassword: '',
    user_photo: '',
    user_cloudinary_id: ''
  })

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
      label: 'Change Password',
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setPreviewURL(URL.createObjectURL(e.target.files[0]))

    } else {
      setFile(null)
      setPreviewURL(null)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      if (file !== null) {
        const photoData = await uploadImage(file)
        await updateUserProfile({
          ...user,
          user_photo: photoData?.url || '',
          user_cloudinary_id: photoData?.public_id || ''
        }).unwrap()

      } else {
        await updateUserProfile(user).unwrap()
      }
      
      await logoutApiCall().unwrap()
      
      dispatch(showToast({
        message: 'User has been updated. Please login again',
        type: 'success'
      }))
      
      dispatch(logout())
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
    <section className='profile flex-center'>
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
        <div className='profile__picture flex-center'>
          <label htmlFor=''>Profile Picture</label>
          <input type='file' onChange={handleFileChange} />
          {previewURL
            ? <img src={previewURL} alt='preview' />
            : userInfo?.user_photo
              ? <img src={userInfo?.user_photo} alt='preview' />
              :<PreviewIcon />}
        </div>
        <button
          disabled={
            isLoading
          }
          className='button button--filled'
          type='submit'
        >
          {isLoading ? <Loader /> : 'Update'}
        </button>
      </form>
    </section>
  )
}

export default Profile