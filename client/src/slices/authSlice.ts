import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface AuthState {
  _id: string
  username: string
  email: string
  img: string
  address: string
  phone: string
  isSeller: boolean
  createdAt?: string
  updatedAt?: string
}

const userInfoFromStorage = localStorage.getItem('currentUser')

const defaultAuthState: AuthState = {
  _id: '',
  username: '',
  email: '',
  img: '',
  address: '',
  phone: '',
  isSeller: false,
  createdAt: '',
  updatedAt: ''
}

const initialState = {
  userInfo: userInfoFromStorage
    ? JSON.parse(userInfoFromStorage) 
    : defaultAuthState
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthState>) => {
      state.userInfo = action.payload
      localStorage.setItem('currentUser', JSON.stringify(action.payload))
    },
    logout: (state) => {
      state.userInfo = defaultAuthState
      if(localStorage.getItem('currentUser')) {
        localStorage.removeItem('currentUser')
      }
    }
  }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer
