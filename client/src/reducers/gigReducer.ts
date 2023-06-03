import getCurrentUser from '../utils/getCurrentUser'
const currentUser = getCurrentUser()

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

interface ChangeInputAction {
  type: 'CHANGE_INPUT';
  payload: {
    name: string;
    value: string;
  };
}

interface AddImagesAction {
  type: 'ADD_IMAGES';
  payload: {
    cover: string;
    images: string[];
  };
}

interface AddFeatureAction {
  type: 'ADD_FEATURE';
  payload: string;
}

interface RemoveFeatureAction {
  type: 'REMOVE_FEATURE';
  payload: string;
}

export type GigAction = ChangeInputAction | AddImagesAction | AddFeatureAction | RemoveFeatureAction;

export const INITIAL_STATE: GigState = {
  userId: currentUser?._id || null,
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