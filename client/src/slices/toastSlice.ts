import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IToastState {
  message: string
  isVisible: boolean
  type: 'success' | 'error' | 'warning'
}

const initialState: IToastState = {
  message: '',
  isVisible: false,
  type: 'success'
}

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    showToast: (state, action: PayloadAction<Omit<IToastState, 'isVisible'>>) => {
      state.message = action.payload.message
      state.type = action.payload.type
      state.isVisible = true
    },
    hideToast: (state) => {
      state.isVisible = false
    }
  }
})

export const { showToast, hideToast } = toastSlice.actions

export default toastSlice.reducer