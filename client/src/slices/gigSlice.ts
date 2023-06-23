import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IGigState {
  userId: string | null
  title: string
  desc: string
  price: number
  cover: string
  images: string[]
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
  cover: '',
  images: [],
  shortDesc: '',
  deliveryTime: 0,
  features: []
}

const gigSlice = createSlice({
  name: 'gig',
  initialState,
  reducers: {
    initializeState: (state, action: PayloadAction<Partial<IGigState>>) => {
      Object.assign(state, action.payload)
    },
    changeGigInput: <T extends keyof IGigState>(state: IGigState, action: PayloadAction<ChangeInputPayload<T>>) => {
      state[action.payload.field] = action.payload.value
    },
    addImages: (state, action: PayloadAction<{ cover: string; images: string[] }>) => {
      state.cover = action.payload.cover
      state.images = action.payload.images
    },
    addFeature: (state, action: PayloadAction<string>) => {
      state.features.push(action.payload)
    },
    removeFeature: (state, action: PayloadAction<string>) => {
      state.features = state.features.filter(
        (feature) => feature !== action.payload
      )
    }
  }
})

export const { initializeState, changeGigInput, addImages, addFeature, removeFeature } = gigSlice.actions

export default gigSlice.reducer