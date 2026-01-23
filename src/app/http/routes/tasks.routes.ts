import { FastifyInstance } from 'fastify';
import { completeTaskController } from '../controllers/tasks/complete-task.controller';
import { createTasksController } from '../controllers/tasks/create-tasks.controller';

export async function tasksRoutes(app: FastifyInstance) {
  app.post(
    '/',
    {
      schema: {
        body: {
          type: 'object',
          required: ['ownerProfileId', 'title'],
          additionalProperties: false,
          properties: {
            ownerProfileId: { type: 'string', minLength: 1 },
            title: { type: 'string', minLength: 1 },
          },
        },
        response: {
          400: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    createTasksController,
  );

  app.patch(
    '/:id/complete',
    {
      schema: {
        params: {
          type: 'object',
          required: ['id'],
          additionalProperties: false,
          properties: {
            id: { type: 'string', minLength: 1 },
          },
        },
        body: {
          type: 'object',
          required: ['requesterProfileId'],
          additionalProperties: false,
          properties: {
            requesterProfileId: { type: 'string', minLength: 1 },
          },
        },
        response: {
          200: { type: 'object' },
          400: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          403: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          404: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
          409: {
            type: 'object',
            properties: {
              error: {
                type: 'object',
                properties: {
                  code: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
    completeTaskController,
  );
}
