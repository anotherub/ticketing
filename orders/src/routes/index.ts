import express, { Request, Response } from 'express'
const router = express.Router()
import { Ticket } from '../models/ticket'
import { Order } from '../models/order'
import { requireAuth } from '@umeshbhatorg/common'

router.get('/api/orders/', requireAuth, async (req: Request, res: Response) => {
  console.log('Entered controller for', req.path)
  const orders = await Order.find({ userId: req.currentUser!.id }).populate('ticket')
  return res.send(orders)
})

export { router as indexOrderRouter }
