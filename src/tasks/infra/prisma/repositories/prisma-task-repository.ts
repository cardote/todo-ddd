import { Task } from '@/tasks/domain/aggregates/task';
import { TaskRepository } from '@/tasks/domain/repositories/task-repository';
import { TaskId } from '@/tasks/domain/value-objects/task-id';
import { PrismaTaskMapper } from '../mappers/prisma-task-mapper';
import { prisma } from '@/shared/infra/prisma/prisma-client';
import { PrismaTaskRecord } from '../../types/prisma-task';
import { domainEvents } from '@/shared/infra/events/domain-event-dispatcher';
import { serializeDomainEvent } from '@/shared/infra/outbox/outbox-serializer';

export class PrismaTaskRepository implements TaskRepository {
  async findById(id: TaskId): Promise<Task | null> {
    const raw = await prisma.task.findUnique({ where: { id: id.value } });

    if (!raw) return null;

    const record: PrismaTaskRecord = raw;

    const task = PrismaTaskMapper.toDomain(record);
    if (task.isFailure) {
      // corrupted record
      throw task.error;
    }

    return task.value;
  }

  async save(task: Task): Promise<Task> {
    const data = PrismaTaskMapper.toPrisma(task);
    const events = task.domainEvents;

    await prisma.$transaction(async tx => {
      await prisma.task.upsert({
        where: { id: data.id },
        create: data,
        update: {
          title: data.title,
          status: data.status,
          ownerProfileId: data.ownerProfileId,
          createdAt: data.createdAt,
          completedAt: data.completedAt,
        },
      });

      if (events.length > 0) {
        const messages = events.map(event =>
          serializeDomainEvent({
            aggregateType: 'Task',
            aggregateId: task.id.value,
            event,
          }),
        );

        await tx.outboxMessage.createMany({
          data: messages.map(m => ({
            id: m.id,
            aggregateType: m.aggregateType,
            aggregateId: m.aggregateId,
            eventName: m.eventName,
            payload: m.payload,
            occurredAt: m.occurredAt,
          })),
        });
      }
    });

    task.clearDomainEvents();

    return task;
  }
}
