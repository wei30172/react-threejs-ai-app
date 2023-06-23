import { apiSlice } from '.'

interface IConversation {
  id: string
  buyerId: string
  sellerId: string
  lastMessage: string
  updatedAt: string
  readBySeller: boolean
  readByBuyer: boolean
}

const CONVERSATIONS_URL = '/conversations'

export const conversationsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createConversation: builder.mutation<IConversation, {to: string}>({
      query: (data) => ({
        url: CONVERSATIONS_URL,
        method: 'POST',
        body: data
      }),
      invalidatesTags : ['Conversations']
    }),
    getConversations: builder.query<IConversation[], void>({
      query: () => ({
        url: CONVERSATIONS_URL
      }),
      providesTags: ['Conversations']
    }),
    getSingleConversation: builder.query<IConversation, string | undefined>({
      query: (id) => ({
        url: `${CONVERSATIONS_URL}/single/${id}`
      })
    }),
    updateConversation: builder.mutation<void, string>({
      query: (id) => ({
        url: `${CONVERSATIONS_URL}/${id}`,
        method: 'PUT'
      }),
      invalidatesTags: ['Conversations']
    })
  })
})

export const {
  useCreateConversationMutation,
  useGetConversationsQuery,
  useGetSingleConversationQuery,
  useUpdateConversationMutation
} = conversationsApiSlice