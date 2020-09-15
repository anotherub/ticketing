import { natsWrapper } from './nats-wrapper'
import { OrderCreatedListener } from './events/listeners/order-created-listerner'
const start = async () => {
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
    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    new OrderCreatedListener(natsWrapper.client).listen()
  } catch (error) {
    console.log(error)
  }
}
start()
