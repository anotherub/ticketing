import mongoose from 'mongoose'
import { app } from './app'
import { OrderCancelledListener } from './events/listeners/order-cancelled-listener'
import { OrderCreatedListener } from './events/listeners/order-created-listener'
import { natsWrapper } from './nats-wrapper'

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('no jwt key found')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('no MONGO_URI key found')
  }
  if (!process.env.JWT_KEY) {
    throw new Error('no JWT key found')
  }
  if (!process.env.STRIPE_KEY) {
    throw new Error('no STRIPE key found')
  }
  if (!process.env.NATS_URL) {
    throw new Error('no NATS_URL key found')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('no NATS_CLIENT_ID key found')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('no MONGO_URI key found')
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!')
      process.exit()
    })
    new OrderCreatedListener(natsWrapper.client).listen()
    new OrderCancelledListener(natsWrapper.client).listen()
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(3000, () => {
      console.log('Ticket service is up and running on port:3000')
    })
  } catch (error) {
    console.log(error)
  }
}
start()
