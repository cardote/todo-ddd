import Fastify from 'fastify';
import { profileRoutes } from '../http/routes/profiles.routes';
import { tasksRoutes } from '../http/routes/tasks.routes';
export function buildApp() {
  const app = Fastify({ logger: true });

  app.setErrorHandler((error, _request, reply) => {
    // schema validation error
    if ((error as any).validation) {
      return reply.status(400).send({
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid request',
          details: (error as any).validation,
        },
      });
    }

    // fallback
    reply.status(500).send({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Unexpected error',
      },
    });
  });

  app.register(profileRoutes, { prefix: 'profile' });
  app.register(tasksRoutes, { prefix: 'tasks' });

  return app;
}
