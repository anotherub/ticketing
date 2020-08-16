import { Publisher, Subjects, OrderCancelledEvent } from '@umeshbhatorg/common'
export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly subject = Subjects.OrderCancelled
}
