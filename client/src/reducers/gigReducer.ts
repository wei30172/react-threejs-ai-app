export interface IGig {
  _id: string
  userId: string
  title: string
  desc: string
  totalStars: number
  starNumber: number
  price: number
  cover: string
  images: string[]
  shortDesc: string
  deliveryTime: number
  features: string[]
  sales: number
}

export interface GigState {
  userId: string | null
  title: string
  desc: string
  price: number
  cover: string;
  images: string[]
  shortDesc: string
  deliveryTime: number
  features: string[]
}

export enum GigActionType {
  INITIALIZE_STATE = 'INITIALIZE_STATE',
  CHANGE_INPUT = 'CHANGE_INPUT',
  ADD_IMAGES = 'ADD_IMAGES',
  ADD_FEATURE = 'ADD_FEATURE',
  REMOVE_FEATURE = 'REMOVE_FEATURE'
}

export type GigAction =
  | { type: GigActionType.INITIALIZE_STATE; payload: IGig }
  | { type: GigActionType.CHANGE_INPUT; payload: { name: string; value: string } }
  | { type: GigActionType.ADD_IMAGES; payload: { cover: string; images: string[] } }
  | { type: GigActionType.ADD_FEATURE; payload: string }
  | { type: GigActionType.REMOVE_FEATURE; payload: string }

export const INITIAL_STATE: GigState = {
  userId: null,
  title: '',
  cover: '',
  images: [],
  desc: '',
  shortDesc: '',
  deliveryTime: 0,
  features: [],
  price: 0
}

export const gigReducer = (state: GigState, action: GigAction): GigState => {
  switch (action.type) {
  case 'INITIALIZE_STATE':
    return {
      ...state,
      ...action.payload
    }
  case 'CHANGE_INPUT':
    return {
      ...state,
      [action.payload.name]: action.payload.value
    }
  case 'ADD_IMAGES':
    return {
      ...state,
      cover: action.payload.cover,
      images: action.payload.images
    }
  case 'ADD_FEATURE':
    return {
      ...state,
      features: [...state.features, action.payload]
    }
  case 'REMOVE_FEATURE':
    return {
      ...state,
      features: state.features.filter(
        (feature) => feature !== action.payload
      )
    }
  default:
    return state
  }
}