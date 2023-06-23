import { apiSlice } from '.'

export interface IReview {
  _id: string
  gigId: string
  userId: string
  star: 1 | 2 | 3 | 4 | 5
  desc: string
}

const REVIEWS_URL = '/reviews'

export const reviewsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createReview: builder.mutation<void, Partial<IReview>>({
      query: (data) => ({
        url: `${REVIEWS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Reviews']
    }),
    getReviewsByGig: builder.query<IReview[], string>({
      query: (gigId) => ({
        url: `${REVIEWS_URL}/${gigId}`
      }),
      providesTags: ['Reviews']
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `${REVIEWS_URL}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Reviews']
    })
  })
})

export const {
  useCreateReviewMutation,
  useGetReviewsByGigQuery,
  useDeleteReviewMutation
} = reviewsApiSlice