import { apiSlice } from '.'

export interface IImagePost {
  _id: string
  name: string
  prompt: string
  photo: string
  cloudinary_id: string
}

const POSTS_URL = '/imageposts'

export const postsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createImagePost: builder.mutation<IImagePost, Partial<IImagePost>>({
      query: (data) => ({
        url: `${POSTS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Posts']
    }),
    getImagePosts: builder.query<IImagePost[], void>({
      query: () => ({
        url: `${POSTS_URL}`
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