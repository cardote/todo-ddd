import { PrismaTaskRepository } from '@/tasks/infra/prisma/repositories/prisma-task-repository';
import { CompleteTaskUseCase } from './complete-task-use-case';

export function makeCompleteTaskUseCase() {
  return new CompleteTaskUseCase(new PrismaTaskRepository());
}
