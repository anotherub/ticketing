import { OrderStatus } from '@umeshbhatorg/common'
import mongoose from 'mongoose'
import { TicketDoc } from './ticket'
import { updateIfCurrentPlugin } from 'mongoose-update-if-current'

interface OrderAttrs {
  expiresAt: Date
  status: OrderStatus
  userId: string
  ticket: TicketDoc
}

interface OrderDoc extends mongoose.Document {
  expiresAt: Date
  status: OrderStatus
  userId: string
  ticket: TicketDoc
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc
}

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      enum: Object.values(OrderStatus),
      default: OrderStatus.Created
    },
    expiresAt: {
      type: mongoose.Schema.Types.Date,
      required: true
    },
    ticket: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Ticket'
    }
  },
  {
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id
        delete ret._id
      }
    }
  }
)

OrderSchema.set('versionKey', 'version')
OrderSchema.plugin(updateIfCurrentPlugin)
OrderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs)
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema)

export { Order, OrderStatus }
