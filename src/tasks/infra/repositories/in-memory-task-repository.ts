import { Task } from '@/tasks/domain/aggregates/task';
import { TaskRepository } from '@/tasks/domain/repositories/task-repository';

export class InMemoryTaskRepository implements TaskRepository {
  private tasks = new Map<string, Task>();

  async save(task: Task): Promise<Task> {
    this.tasks.set(task.id.value, task);
    return task;
  }
  async findById(id: string): Promise<Task | null> {
    return this.tasks.get(id) ?? null;
  }
}
