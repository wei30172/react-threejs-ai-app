import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IDesignState {
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecalPhoto: string
  fullDecalPhoto: string
  logoDecalCloudinaryId: string
  fullDecalCloudinaryId: string
}

interface SetDesignPayload<T extends keyof IDesignState> {
  field: T
  value: IDesignState[T]
}

const initialState: IDesignState = {
  color: '#dbab80',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecalPhoto: '/img/design.jpg',
  fullDecalPhoto: '/img/design.jpg',
  logoDecalCloudinaryId: '',
  fullDecalCloudinaryId: ''
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