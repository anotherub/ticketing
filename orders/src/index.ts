import mongoose from 'mongoose'
import { app } from './app'
import { natsWrapper } from './nats-wrapper'

import { TicketCreatedListener } from '../src/events/listeners/tikcet-created-listener'
import { TicketUpdatedListener } from '../src/events/listeners/tikcet-updated-listener'
import { Listener } from '@umeshbhatorg/common'
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
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })
    app.listen(3000, () => {
      console.log('ORDER service is up and running on port:3000')
    })
  } catch (error) {
    console.log(error)
  }
}
start()
