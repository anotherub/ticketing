import { Publisher, Subjects, TicketUpdatedEvent } from '@umeshbhatorg/common'
export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated
}
