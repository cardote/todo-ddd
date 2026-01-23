import { Task } from '../aggregates/task';
import { TaskId } from '../value-objects/task-id';

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: TaskId): Promise<Task | null>;
}
