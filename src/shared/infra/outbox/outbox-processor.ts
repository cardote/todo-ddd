import { domainEvents } from '../events/domain-event-dispatcher';
import { prisma } from '../prisma/prisma-client';

type ProcessOptions = {
  batchSize?: number;
};

export async function processOutbox(options: ProcessOptions = {}) {
  const batchSize = options.batchSize ?? 20;

  // get unprocessed events
  const messages = await prisma.outboxMessage.findMany({
    where: { processedAt: null },
    orderBy: { createdAt: 'asc' },
    take: batchSize,
  });

  for (const message of messages) {
    try {
      // rebuild a DomainEvent-like from payload
      // to dispatch it
      const event = {
        ...(message.payload as Record<string, unknown>),
        name: message.eventName,
        occuredAt: new Date(message.occurredAt),
      };

      await domainEvents.dispatch([event]);

      await prisma.outboxMessage.update({
        where: { id: message.id },
        data: { processedAt: new Date(), lastError: null },
      });
    } catch (error: any) {
      await prisma.outboxMessage.update({
        where: { id: message.id },
        data: {
          attempts: { increment: 1 },
          lastError: String(error?.message ?? error),
        },
      });
    }
  }
}
