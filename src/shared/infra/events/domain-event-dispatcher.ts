import { DomainEvent } from '@/shared/kernel/domain-event';

export type DomainEventHandler<E extends DomainEvent = DomainEvent> = (
  event: E,
) => Promise<void> | void;

export class DomainEventDispatcher {
  private handlers: Record<string, DomainEventHandler[]> = {};

  register(eventName: string, handler: DomainEventHandler) {
    this.handlers[eventName] ??= []; // initialize if undefined
    this.handlers[eventName].push(handler);
  }

  async dispatch(events: DomainEvent[]): Promise<void> {
    for (const event of events) {
      const handlers = this.handlers[event.name] ?? [];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }
}

export const domainEvents = new DomainEventDispatcher();
