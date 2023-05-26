import mongoose, { Document, Schema } from 'mongoose'

interface IOrder extends Document {
  gigId: string
  img: string
  title: string
  price: number
  sellerId: string
  buyerId: string
  isPaid: boolean
  payment_intent: string
}

const OrderSchema: Schema = new Schema(
  {
    gigId: {
      type: String,
      required: true,
    },
    img: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    payment_intent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export default mongoose.model<IOrder>('Order', OrderSchema)