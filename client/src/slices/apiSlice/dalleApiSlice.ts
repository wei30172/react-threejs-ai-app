import { apiSlice } from '.'

interface IDallePrompt {
  prompt: string
}

interface IDalleImage {
  image: string
}

const DALLE_URL = '/dalle'

export const dalleApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    generateDalleImage: builder.mutation<IDalleImage, IDallePrompt>({
      query: (prompt) => ({
        url: DALLE_URL,
        method: 'POST',
        body: prompt
      })
    })
  })
})

export const {
  useGenerateDalleImageMutation
} = dalleApiSlice

