import { DomainEvent } from '@/shared/kernel/domain-event';

type Handler<E extends DomainEvent = DomainEvent> = (
  event: E,
) => Promise<void> | void;

export class DomainEventDispatcher {
  private handlers: Record<string, Handler[]> = {};

  register(eventName: string, handler: Handler) {
    this.handlers[eventName] = this.handlers[eventName] ?? [];
    this.handlers[eventName].push(handler);
  }

  async dispatch(events: DomainEvent[]) {
    for (const event of events) {
      const handlers = this.handlers[event.name] ?? [];
      for (const handler of handlers) {
        await handler(event);
      }
    }
  }
}

export const domainEvents = new DomainEventDispatcher();
