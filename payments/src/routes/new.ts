import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest
} from '@umeshbhatorg/common'
import express, { Request, Response } from 'express'
import { body } from 'express-validator'
import { PaymentCreatedPublisher } from '../events/publishers/payment-created-publishers'
import { Order } from '../models/order'
import { Payment } from '../models/payment'
import { natsWrapper } from '../nats-wrapper'
import { stripe } from '../stripe'
const router = express.Router()

router.post(
  '/api/payments',
  [requireAuth, body('token').not().isEmpty(), body('orderId').not().isEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('Entered controller', req.path)
    const { token, orderId } = req.body
    console.log(token, orderId)
    const order = await Order.findById(orderId)
    if (!order) {
      throw new NotFoundError()
    }
    if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
    if (order.status === OrderStatus.Cancelled) throw new BadRequestError('can not pay for cancelled order')
    const charge = await stripe.paymentIntents.create({
      amount: order.price * 100,
      currency: 'usd',
      description: 'Software development services'
    })
    const payment = Payment.build({
      orderId,
      stripeId: charge.id
    })
    const paymentDetail = await payment.save()
    new PaymentCreatedPublisher(natsWrapper.client).publish({
      id: payment.id,
      orderId: payment.orderId,
      stripeId: payment.stripeId
    })
    return res.status(201).send({ chargeDetails: paymentDetail, success: true })
  }
)

export { router as createChargeRouter }

// stripePublishableKey:
//     'pk_test_51GwXx4DA6WipXJWrhZjXR5kJ84ZtErZ1zaKWbchbugTL61s8OVlRkqh7zFrSLQ8XrHWdlyj66fNFn0fjo7HL9pBO0092oHW1XY',
//   stripeSecretKey:
//     'sk_test_51GwXx4DA6WipXJWruUPOBbYng0pn9gZWZ4YeeLbLUaiTlwRmg4RPpKMDHKzltgEzm13nXFfAw9MqdBQtySkdGu1K00gcvMlQC3',
