import { apiSlice } from '.'
import { IGigState } from '../gigSlice'

export interface IGig {
  _id: string
  userId: string
  title: string
  desc: string
  totalStars: number
  starNumber: number
  price: number
  gig_photo: string
  gig_photos: string[]
  gig_cloudinary_id: string
  gig_cloudinary_ids: string[]
  shortDesc: string
  deliveryTime: number
  features: string[]
  sales: number
}

const GIGS_URL = '/gigs'

export const gigsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createGig: builder.mutation<void, IGigState>({
      query: (data) => ({
        url: `${GIGS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Gigs']
    }),
    getGigs: builder.query<IGig[], {
      userId?: string,
      search?: string,
      min?: string,
      max?: string,
      sort?: string
    }>({
      query: ({ userId='', search = '', min = '', max = '', sort = '' }) => ({
        url: `${GIGS_URL}?userId=${userId}&search=${search}&min=${min}&max=${max}&sort=${sort}`
      }),
      providesTags: ['Gigs']
    }),
    getSingleGig: builder.query<IGig, string | undefined>({
      query: (gigId) => ({
        url: `${GIGS_URL}/single/${gigId}`
      })
    }),
    deleteGig: builder.mutation<void, string>({
      query: (id) => ({
        url: `${GIGS_URL}/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Gigs']
    }),
    updateGig: builder.mutation<void, {
      gigId: string | undefined,
      data: IGigState
    }>({
      query: ({ gigId, data }) => ({
        url: `${GIGS_URL}/${gigId}`,
        method: 'PUT',
        body: data
      }),
      invalidatesTags: ['Gigs']
    })
  })
})

export const {
  useCreateGigMutation,
  useGetGigsQuery,
  useGetSingleGigQuery,
  useDeleteGigMutation,
  useUpdateGigMutation
} = gigsApiSlice