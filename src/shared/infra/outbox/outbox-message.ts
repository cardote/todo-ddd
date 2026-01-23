// Defines the structure of the outbox message
// avoid use Value Objects and Entities
export type OutboxMessage = {
  id: string;
  aggregateType: string;
  aggregateId: string;
  eventName: string;
  payload: any;
  occurredAt: Date;
};
