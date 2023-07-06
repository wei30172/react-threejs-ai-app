import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IGigState {
  userId: string | null
  title: string
  desc: string
  price: number
  gigPhoto: string
  gigPhotos: string[]
  gigCloudinaryId: string
  gigCloudinaryIds: string[]
  shortDesc: string
  deliveryTime: number
  features: string[]
}

interface ChangeInputPayload<T extends keyof IGigState> {
  field: T
  value: IGigState[T]
}

const initialState: IGigState = {
  userId: null,
  title: '',
  desc: '',
  price: 0,
  gigPhoto: '',
  gigPhotos: [],
  gigCloudinaryId: '',
  gigCloudinaryIds: [],
  shortDesc: '',
  deliveryTime: 0,
  features: []
}

const gigSlice = createSlice({
  name: 'gig',
  initialState,
  reducers: {
    changeGigInput: <T extends keyof IGigState>(state: IGigState, action: PayloadAction<ChangeInputPayload<T>>) => {
      state[action.payload.field] = action.payload.value
    },
    addImage: (state, action: PayloadAction<{
      gigPhoto: string,
      gigCloudinaryId: string,
    }>) => {
      state.gigPhoto = action.payload.gigPhoto
      state.gigCloudinaryId = action.payload.gigCloudinaryId
    },
    addImages: (state, action: PayloadAction<{
      gigPhotos: string[],
      gigCloudinaryIds: string[]
    }>) => {
      state.gigPhotos = action.payload.gigPhotos
      state.gigCloudinaryIds = action.payload.gigCloudinaryIds
    },
    addFeature: (state, action: PayloadAction<string>) => {
      state.features.push(action.payload)
    },
    removeFeature: (state, action: PayloadAction<string>) => {
      state.features = state.features.filter(
        (feature) => feature !== action.payload
      )
    },
    resetGig: () => initialState
  }
})

export const { changeGigInput, addImage, addImages, addFeature, removeFeature, resetGig } = gigSlice.actions

export default gigSlice.reducer