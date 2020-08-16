import { BadRequestError, NotAuthorizedError, NotFoundError, requireAuth } from '@umeshbhatorg/common'
import express, { Request, Response } from 'express'
import { Order } from '../models/order'
const router = express.Router()

router.get('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
  console.log('Entered controller for', req.path)
  const { orderId } = req.params
  const order = await Order.findById(orderId).populate('ticket')
  if (!order) throw new NotFoundError()
  if (order.userId !== req.currentUser!.id) throw new NotAuthorizedError()
  return res.send(order)
})

export { router as showOrderRouter }
