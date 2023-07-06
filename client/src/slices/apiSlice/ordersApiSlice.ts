import { apiSlice } from '.'
import { IOrderState } from '../orderSlice'
import { IDesignState } from '../designSlice'

interface ICombinedState extends IOrderState, IDesignState {}

export interface IOrder {
  _id: string
  gigId: string
  gigPhoto: string
  title: string
  price: number
  sellerId: string
  buyerId: string
  isPaid: boolean
  paymentIntent: string
  name: string
  email: string
  address: string
  phone: string
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecalPhoto: string
  fullDecalPhoto: string
  logoDecalCloudinaryId: string
  fullDecalCloudinaryId: string
  designPhoto: string
  designCloudinaryId: string
  createdAt: string
}

interface IOrderIntent {
  clientSecret: string
}

const ORDERS_URL = '/orders'

export const ordersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<IOrder, ICombinedState>({
      query: (data) => ({
        url: `${ORDERS_URL}`,
        method: 'POST',
        body: data
      }),
      invalidatesTags: ['Orders']
    }),
    intent: builder.mutation<IOrderIntent, string | undefined>({
      query: (id) => ({
        url: `${ORDERS_URL}/create-payment-intent/${id}`,
        method: 'POST'
      })
    }),
    getOrders: builder.query<IOrder[], void>({
      query: () => ({
        url: `${ORDERS_URL}`
      }),
      providesTags: ['Orders']
    }),
    getSingleOrder: builder.query<IOrder, string | undefined>({
      query: (id) => ({
        url: `${ORDERS_URL}/single/${id}`
      })
    }),
    confirm: builder.mutation<void, {paymentIntent: string}>({
      query: (data) => ({
        url: `${ORDERS_URL}/confirm`,
        method: 'PUT',
        body: data
      })
    })
  })
})

export const {
  useCreateOrderMutation,
  useIntentMutation,
  useGetOrdersQuery,
  useGetSingleOrderQuery,
  useConfirmMutation
} = ordersApiSlice