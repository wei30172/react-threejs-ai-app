import { apiSlice } from '.'
import { AuthState } from '../authSlice'

export interface IUserInfo {
  username: string
  userPhoto: string
}

export interface IUserProfile {
  username: string
  password: string
  confirmPassword: string
  userPhoto: string
  userCloudinaryId: string
}

const USERS_URL = '/users'

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    deleteUser: builder.mutation<void, void>({
      query: () => ({
        url: `${USERS_URL}/profile`,
        method: 'DELETE'
      }),
      invalidatesTags: ['User']
    }),
    updateUserProfile: builder.mutation<AuthState, IUserProfile>({
      query: (userData) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['User']
    }),
    isAdminUser: builder.query<{isAdmin: boolean}, void>({
      query: () => ({
        url: `${USERS_URL}/isAdmin`
      })
    }),
    getUserInfoById: builder.query<IUserInfo, string>({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`
      }),
      providesTags: ['User']
    })
  })
})

export const {
  useDeleteUserMutation,
  useUpdateUserProfileMutation,
  useGetUserInfoByIdQuery,
  useIsAdminUserQuery
} = usersApiSlice