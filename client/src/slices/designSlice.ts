import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IDesignState {
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecal: string
  fullDecal: string
}

interface SetDesignPayload<T extends keyof IDesignState> {
  field: T
  value: IDesignState[T]
}

const initialState: IDesignState = {
  color: '#DB8091',
  isLogoTexture: true,
  isFullTexture: false,
  logoDecal: '/img/design.jpg',
  fullDecal: '/img/design.jpg'
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