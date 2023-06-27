import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './slices/apiSlice'
import authReducer, { AuthState } from './slices/authSlice'
import orderReducer, { IOrderState } from './slices/orderSlice'
import gigReducer, { IGigState } from './slices/gigSlice'
import designReducer, { IDesignState } from './slices/designSlice'
import toastReducer, { IToastState } from './slices/toastSlice'

export interface RootState {
  [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>
  auth: {
    userInfo: AuthState
  },
  design: IDesignState
  order: IOrderState
  gig: IGigState
  toast: IToastState
}

const store = configureStore<RootState>({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authReducer,
    design: designReducer,
    order: orderReducer,
    gig: gigReducer,
    toast: toastReducer
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware) as any,
  devTools: true // todo
})

export type AppDispatch = typeof store.dispatch
export default store