import { fetchBaseQuery, createApi } from '@reduxjs/toolkit/query/react'

export interface ApiError {
  data? :{
    message: string
  }
}

export interface AxiosError {
  response? :{
    data? :{
      message: string
    }
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_APP_API_URL as string || 'http://localhost:8080/api',
  credentials: 'include'
})

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Gigs', 'Orders', 'Messages', 'Conversations', 'Reviews', 'Posts'],
  endpoints: () => ({})
})