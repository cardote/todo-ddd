import { FastifyInstance } from 'fastify';
import { createTasksController } from '../controllers/tasks/create-tasks.controller';
import { completeTaskController } from '../controllers/tasks/complete-task.controller';

export async function tasksRoutes(app: FastifyInstance) {
  app.post('/', createTasksController);
  // app.get('/:id', getProfileController);
  app.patch('/:id/complete', completeTaskController);
  // app.delete('/:id', deleteProfileController);
}
