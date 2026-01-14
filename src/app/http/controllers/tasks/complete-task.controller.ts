import { makeCompleteTaskUseCase } from '@/tasks/application/use-cases/complete-task';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type CompleteTaskParams = {
  id: string;
};

type CompleteTaskBody = {
  requesterProfileId?: unknown;
};

export async function completeTaskController(
  request: FastifyRequest<{
    Params: CompleteTaskParams;
    Body: CompleteTaskBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { requesterProfileId } = request.body ?? {};

  if (typeof id !== 'string' || id.trim().length === 0) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'id is required and must be a string',
      },
    });
  }

  if (
    requesterProfileId !== undefined &&
    typeof requesterProfileId !== 'string'
  ) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'requesterProfileId must be a string',
      },
    });
  }

  const useCase = makeCompleteTaskUseCase();
  const result = await useCase.execute({
    taskId: id,
    requesterProfileId: requesterProfileId ?? '',
  });

  if (result.isLeft()) {
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(200).send({ data: result });
}
