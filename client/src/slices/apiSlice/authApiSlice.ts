import { apiSlice } from '.'
import { AuthState } from '../authSlice'

export interface IUserRegister {
  username: string
  email: string
  password: string
  confirmPassword: string
  address: string
  phone: string
  isAdmin: boolean
  userPhoto: string
  userCloudinaryId: string
}

export interface IUserLogin {
  email: string
  password: string
}

const AUTH_URL = '/auth'

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<void, IUserRegister>({
      query: (data) => ({
        url: `${AUTH_URL}/register`,
        method: 'POST',
        body: data
      })
    }),
    login: builder.mutation<AuthState, IUserLogin>({
      query: (data) => ({
        url: `${AUTH_URL}/login`,
        method: 'POST',
        body: data
      })
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: 'POST'
      })
    })
  })
})

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation
} = authApiSlice
