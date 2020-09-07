import express, { Request, Response } from 'express'
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from '@umeshbhatorg/common'
import { body } from 'express-validator'
import mongoose from 'mongoose'
import { Ticket } from '../models/ticket'
import { Order, OrderStatus } from '../models/order'
import { natsWrapper } from '../nats-wrapper'
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher'
const router = express.Router()
const EXPIRATION_WINDOWS_SECONDS = 15 * 60

router.post(
  '/api/orders/',
  [
    requireAuth,
    body('ticketId')
      .not()
      .isEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('Ticket id must be provded')
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    console.log('Entered controller for', req.path)
    const { ticketId } = req.body
    const ticket = await Ticket.findById(ticketId)
    if (!ticket) throw new NotFoundError()
    const isReserved = await ticket.isReserved()
    if (isReserved) throw new BadRequestError('Ticket is already reserved')
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOWS_SECONDS)
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket
    })
    await order.save()

    new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      status: order.status,
      version: order.version,
      userId: req.currentUser!.id,
      expiresAt: order.expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        price: ticket.price
      }
    })

    res.status(201).send(order)
  }
)

export { router as newOrderRouter }
