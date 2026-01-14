import { CreateTaskUseCase } from './create-task-use-case';
import { PrismaProfileReader } from '@/tasks/infra/readers/prisma-profile-reader';
import { PrismaTaskRepository } from '@/tasks/infra/prisma/repositories/prisma-task-repository';

export function makeCreateTaskUseCase() {
  return new CreateTaskUseCase(
    new PrismaTaskRepository(),
    new PrismaProfileReader(),
  );
}
