import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  gigId: string
  gig_photo: string
  title: string
  price: number
  sellerId: string
  buyerId: string
  isPaid: boolean
  payment_intent: string
  name: string
  email: string
  address: string
  phone: string
  color: string
  isLogoTexture: boolean
  isFullTexture: boolean
  logoDecal_photo: string
  fullDecal_photo: string
  logoDecal_cloudinary_id: string
  fullDecal_cloudinary_id: string
  design_photo: string
  design_cloudinary_id: string
}

const OrderSchema: Schema = new Schema(
  {
    gigId: {
      type: String,
      required: true
    },
    gig_photo: {
      type: String,
      required: false
    },
    title: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true
    },
    sellerId: {
      type: String,
      required: true
    },
    buyerId: {
      type: String,
      required: true
    },
    isPaid: {
      type: Boolean,
      default: false
    },
    payment_intent: {
      type: String,
      required: false
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    color: {
      type: String,
      required: true
    },
    isLogoTexture: {
      type: Boolean,
      required: true
    },
    isFullTexture: {
      type: Boolean,
      required: true
    },
    logoDecal_photo: {
      type: String,
      required: false
    },
    fullDecal_photo: {
      type: String,
      required: false
    },
    logoDecal_cloudinary_id: {
      type: String,
      required: false
    },
    fullDecal_cloudinary_id: {
      type: String,
      required: false
    },
    design_photo: {
      type: String,
      required: true
    },
    design_cloudinary_id: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
)

export default mongoose.model<IOrder>('Order', OrderSchema)