import Fastify from 'fastify';
import { profileRoutes } from '../http/routes/profiles.routes';
import { tasksRoutes } from '../http/routes/tasks.routes';
export function buildApp() {
  const app = Fastify({ logger: true });

  app.register(profileRoutes, { prefix: 'profile' });
  app.register(tasksRoutes, { prefix: 'tasks' });

  return app;
}
