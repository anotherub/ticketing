import { Listener, Subjects, TicketCreatedEvent } from '@umeshbhatorg/common'
import { Message } from 'node-nats-streaming'
import { Ticket } from '../../models/ticket'
import { queueGroupName } from './queue-group-name'

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
  queueGroupName = queueGroupName
  async onMessage(data: TicketCreatedEvent['data'], msg: Message) {
    const { title, price, id, version } = data
    const ticket = Ticket.build({ title, price, id, version })
    await ticket.save()
    msg.ack()
  }
}
