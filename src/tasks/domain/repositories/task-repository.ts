import { Task } from '../aggregates/task';

export interface TaskRepository {
  save(task: Task): Promise<Task>;
  findById(id: string): Promise<Task | null>;
}
