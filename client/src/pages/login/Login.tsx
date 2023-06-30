import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { useLoginMutation, IUserLogin } from '../../slices/apiSlice/authApiSlice'
import { ApiError } from '../../slices/apiSlice'
import { login } from '../../slices/authSlice'
import { showToast } from '../../slices/toastSlice'
import { RootState } from '../../store'
import { FormInput } from '../../components'
import { Loader } from '../../components/icons'
import './Login.scss'

const Login: React.FC = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const location = useLocation()
  
  const { userInfo } = useSelector((state: RootState) => state.auth)

  const [user, setUser] = useState<IUserLogin>({
    email: '',
    password: ''
  })

  const [loginApiCall, { isLoading }] = useLoginMutation()

  useEffect(() => {
    if (userInfo) {
      navigate(location.state?.from || '/')
    }
  }, [navigate, userInfo, location.state?.from])

  const formInputs = [
    {
      id: 1,
      label: 'Email',
      errorMessage: 'Email should be a valid email address!',
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      required: true,
      value: ''
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
      required: true,
      value: ''
    }
  ]

  const handleChange = (e: React.FormEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setUser({ ...user, [target.name]: target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const res = await loginApiCall(user).unwrap()

      dispatch(login({ ...res }))

      navigate('/')

    } catch (error) {
      const apiError = error as ApiError
      const errorMessage = apiError.data?.message || 'Login failed'
      
      dispatch(showToast({
        message: errorMessage,
        type: 'error'
      }))
    }
  }
  
  return (
    <section className='login flex-center'>
      <form className='flex-center' onSubmit={handleSubmit}>
        <h1>Login</h1>
        {formInputs.map((input) => (
          <div key={input.id}>
            <FormInput
              key={input.id}
              {...input}
              value={user[input.name as keyof IUserLogin]}
              handleChange={handleChange}
            />
          </div>
        ))}
        <button
          disabled={
            !user.email ||
            !user.password ||
            isLoading
          }
          className='button button--filled'
          type='submit'
        >
          {isLoading ? <Loader /> : 'Login'}
        </button>
        <div className='login__navigation flex-center'>
          <p>Do not have an account?</p>
          <Link to='/register'>
            <button className='cursor-pointer'>
              Signup
            </button>
          </Link>
        </div>
      </form>
    </section>
  )
}

export default Login