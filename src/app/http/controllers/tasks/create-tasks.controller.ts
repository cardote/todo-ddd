import { makeCreateTaskUseCase } from '@/tasks/application/use-cases/create-task';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type CreateTaskBody = { title?: unknown; ownerProfileId?: unknown };

export async function createTasksController(
  request: FastifyRequest<{ Body: CreateTaskBody }>,
  reply: FastifyReply,
) {
  const { title, ownerProfileId } = request.body ?? {};

  if (typeof title !== 'string' || typeof ownerProfileId !== 'string') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'title and ownerProfileId must be strings',
      },
    });
  }

  const useCase = makeCreateTaskUseCase();
  const result = await useCase.execute({ title, ownerProfileId });

  if (result.isLeft()) {
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(201).send({ data: result });
}
