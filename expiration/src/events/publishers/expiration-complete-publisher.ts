import { Publisher, Subjects, ExpirationCompleteEvent } from '@umeshbhatorg/common'
export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete
}
