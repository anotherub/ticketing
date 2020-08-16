import { Publisher, Subjects, OrderCreatedEvent } from '@umeshbhatorg/common'
export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated
}
