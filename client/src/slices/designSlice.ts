import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IDesignState {
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecal_photo: string
  fullDecal_photo: string
  logoDecal_cloudinary_id: string
  fullDecal_cloudinary_id: string
}

interface SetDesignPayload<T extends keyof IDesignState> {
  field: T
  value: IDesignState[T]
}

const initialState: IDesignState = {
  color: '#dbab80',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal_photo: '/img/design.jpg',
  fullDecal_photo: '/img/design.jpg',
  logoDecal_cloudinary_id: '',
  fullDecal_cloudinary_id: ''
}

const designSlice = createSlice({
  name: 'design',
  initialState,
  reducers: {
    setDesign: <T extends keyof IDesignState>(state: IDesignState, action: PayloadAction<SetDesignPayload<T>>) => {
      state[action.payload.field] = action.payload.value
    }
  }
})

export const { setDesign } = designSlice.actions

export default designSlice.reducer