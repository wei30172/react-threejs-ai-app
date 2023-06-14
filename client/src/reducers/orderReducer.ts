export interface OrderState {
  gigId: string
  buyerId: string | null
  name: string
  email: string
  address: string
  phone: string
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecal: string
  fullDecal: string
  url: string
}

export enum OrderActionType {
  CHANGE_INPUT = 'CHANGE_INPUT'
}

export type OrderAction =
  | { type: OrderActionType.CHANGE_INPUT; payload: Partial<OrderState> }

export const INITIAL_STATE: OrderState = {
  gigId: '',
  buyerId: '',
  name: '',
  email: '',
  address: '',
  phone: '',
  color: '',
  isLogoTexture: false,
  isFullTexture: false,
  logoDecal: '',
  fullDecal: '',
  url: ''
}

export const orderReducer = (state: OrderState, action: OrderAction): OrderState => {
  switch (action.type) {
  case 'CHANGE_INPUT':
    return {
      ...state,
      ...action.payload
    }
  default:
    return state
  }
}