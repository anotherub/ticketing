import { Listener, Subjects, TicketCreatedEvent, TicketUpdatedEvent } from '@umeshbhatorg/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
  queueGroupName = queueGroupName
  async onMessage(data: TicketUpdatedEvent['data'], msg: Message) {
    const { title, price, id } = data
    const ticket = await Ticket.findById(id)
    if (!ticket) throw new Error('No ticket found')
    ticket.set({ title, price })
    await ticket.save()
    msg.ack()
  }
}
