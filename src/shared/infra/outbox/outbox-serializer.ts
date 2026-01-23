import { DomainEvent } from '@/shared/kernel/domain-event';
import { OutboxMessage } from './outbox-message';
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id';

export function serializeDomainEvent(params: {
  aggregateType: string;
  aggregateId: string;
  event: DomainEvent;
}): OutboxMessage {
  const { aggregateType, aggregateId, event } = params;

  const payload = JSON.parse(
    JSON.stringify(event, (_k, v) => (v instanceof Date ? v.toISOString() : v)),
  );

  return {
    id: new UniqueEntityID().value,
    aggregateType,
    aggregateId: aggregateId.toString(),
    eventName: event.name,
    payload,
    occurredAt: event.occuredAt,
  };
}
