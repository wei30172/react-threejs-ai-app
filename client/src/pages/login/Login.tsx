import { FC, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import newRequest, { IErrorResponse } from '../../utils/newRequest'
import { AxiosError } from 'axios'

import { FormInput, Toast } from '../../components'
import { ToastProps } from '../../components/toast/Toast'
import './Login.scss'
interface User {
  email: string
  password: string
}

const Login: FC = () => {
  const [user, setUser] = useState<User>({
    email: '',
    password: ''
  })

  const [toastConfig, setToastConfig] = useState<ToastProps>({
    message: '',
    isVisible: false
  })

  const navigate = useNavigate()

  const formInputs = [
    {
      id: 1,
      label: 'Email',
      errorMessage: 'Email should be a valid email address!',
      name: 'email',
      type: 'email',
      placeholder: 'Email',
      pattern: '^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$',
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
      const res = await newRequest.post('auth/login', user)
      localStorage.setItem('currentUser', JSON.stringify(res.data))
      navigate('/')
    } catch (error) {
      const axiosError = error as AxiosError<IErrorResponse>
      const errorMessage = axiosError.response?.data?.message || 'Login failed'
      
      setToastConfig({
        message: errorMessage,
        isVisible: true,
        type: 'error'
      })
    }
  }
  
  return (
    <>
      <Toast
        isVisible={toastConfig.isVisible}
        message={toastConfig.message}
        type={toastConfig.type}
        onHide={() => setToastConfig({isVisible: false, message: ''})}
      />
      <div className='login flex-center'>
        <form className='flex-center' onSubmit={handleSubmit}>
          <h1>Sign in</h1>
          {formInputs.map((input) => (
            <div key={input.id}>
              <FormInput
                key={input.id}
                {...input}
                value={user[input.name as keyof User]}
                handleChange={handleChange}
              />
            </div>
          ))}
          <button
            disabled={!user.email || !user.password}
            className='button button--fill'
            type='submit'
          >
            Login
          </button>
          <div className='navigation flex-center'>
            <p>Do not have an account?</p>
            <button className='cursor-pointer' onClick={() => navigate('/register')}>
              Signup
            </button>
          </div>
        </form>
      </div>
    </>
  )
}

export default Login