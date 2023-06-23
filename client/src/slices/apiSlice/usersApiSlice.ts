import { apiSlice } from '.'

export interface IUserInfo {
  username: string
  img: string
}

export interface IUserProfile {
  username: string
  password: string
  confirmPassword: string
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
    updateUserProfile: builder.mutation<void, IUserProfile>({
      query: (userData) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: userData
      }),
      invalidatesTags: ['User']
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
  useGetUserInfoByIdQuery
} = usersApiSlice