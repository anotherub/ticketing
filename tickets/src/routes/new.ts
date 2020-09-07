import express, { Request, Response } from 'express'
import { requireAuth, validateRequest } from '@umeshbhatorg/common'
import { body } from 'express-validator'
import { Ticket } from '../models/ticket'
import { TicketCreatedPublisher } from '../events/publishers/tikcet-created-publisher'
import { natsWrapper } from '../nats-wrapper'
const router = express.Router()
router.post(
  '/api/tickets',
  [
    body('title').not().isEmpty().withMessage('Title is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than 0')
  ],
  validateRequest,
  requireAuth,
  async (req: Request, res: Response) => {
    console.log('Entered controller for', req.path)
    console.log(req.currentUser!.id)
    const { title, price } = req.body
    const ticket = Ticket.build({ title, price, userId: req.currentUser!.id })
    console.log('ticket', ticket)
    await ticket.save()
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      title: ticket.title,
      version: ticket.version,
      price: ticket.price,
      userId: ticket.userId
    })
    res.status(201).send(ticket)
  }
)

export { router as createTicketRouter }
