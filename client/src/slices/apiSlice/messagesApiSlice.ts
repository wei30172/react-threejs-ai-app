import { apiSlice } from '.'

export interface IMessage {
  _id: string
  conversationId: string
  userId: string
  desc: string
}

const MESSAGES_URL = '/messages'

export const messagesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createMessage: builder.mutation<IMessage, Partial<IMessage>>({
      query: (data) => ({
        url: `${MESSAGES_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Conversations', 'Messages']
    }),
    getMessages: builder.query<IMessage[], string | undefined>({
      query: (id) => ({
        url: `${MESSAGES_URL}/${id}`
      }),
      providesTags: ['Messages']
    })
  })
})

export const {
  useCreateMessageMutation,
  useGetMessagesQuery
} = messagesApiSlice