import { Publisher, Subjects, PaymentCreatedEvent } from '@umeshbhatorg/common'
export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated
}
