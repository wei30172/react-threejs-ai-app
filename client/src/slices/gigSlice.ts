import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IGigState {
  userId: string | null
  title: string
  desc: string
  price: number
  gig_photo: string
  gig_photos: string[]
  gig_cloudinary_id: string
  gig_cloudinary_ids: string[]
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
  gig_photo: '',
  gig_photos: [],
  gig_cloudinary_id: '',
  gig_cloudinary_ids: [],
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
      gig_photo: string,
      gig_cloudinary_id: string,
    }>) => {
      state.gig_photo = action.payload.gig_photo
      state.gig_cloudinary_id = action.payload.gig_cloudinary_id
    },
    addImages: (state, action: PayloadAction<{
      gig_photos: string[],
      gig_cloudinary_ids: string[]
    }>) => {
      state.gig_photos = action.payload.gig_photos
      state.gig_cloudinary_ids = action.payload.gig_cloudinary_ids
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