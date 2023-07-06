import { apiSlice } from '.'

export interface ICreatePost {
  name: string
  prompt: string
  photo: string
}

export interface IImagePost {
  _id: string
  name: string
  prompt: string
  postPhoto: string
  postCloudinaryId: string
}

const POSTS_URL = '/imageposts'

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createImagePost: builder.mutation<IImagePost, ICreatePost>({
      query: (data) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Posts']
    }),
    getImagePosts: builder.query<IImagePost[], {
      search?: string,
    }>({
      query: ({search = ''}) => ({
        url: `${POSTS_URL}?search=${search}`
      }),
      providesTags: ['Posts']
    }),
    deleteImagePost: builder.mutation<void, string>({
      query: (id) => ({
        url: `${POSTS_URL}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Posts']
    })
  })
})

export const {
  useCreateImagePostMutation,
  useGetImagePostsQuery,
  useDeleteImagePostMutation
} = postsApiSlice