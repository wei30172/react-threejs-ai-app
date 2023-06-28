import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IOrderState {
  gigId: string
  buyerId: string
  name: string
  email: string
  address: string
  phone: string
  design_photo: string
  design_cloudinary_id: string
}

interface ChangeInputPayload {
  field: keyof IOrderState
  value: string
}

interface User {
  _id: string
  username: string
  email: string
  address: string
  phone: string
}

const getDefaultUser = (): User => ({
  _id: '',
  username: '',
  email: '',
  address: '',
  phone: ''
})

let userInfoFromStorage: User

try {
  userInfoFromStorage = JSON.parse(localStorage.getItem('currentUser') as string) || getDefaultUser()
} catch {
  userInfoFromStorage = getDefaultUser()
}

const initialState: IOrderState = {
  gigId: '',
  buyerId: userInfoFromStorage._id,
  name: userInfoFromStorage.username,
  email: userInfoFromStorage.email,
  address: userInfoFromStorage.address,
  phone: userInfoFromStorage.phone,
  design_photo: '',
  design_cloudinary_id: ''
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    changeOrderInput: (state, action: PayloadAction<ChangeInputPayload>) => {
      state[action.payload.field] = action.payload.value
    }
  }
})

export const { changeOrderInput } = orderSlice.actions

export default orderSlice.reducer