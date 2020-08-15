import { Publisher, Subjects, TicketCreatedEvent } from '@umeshbhatorg/common'
export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated
}
