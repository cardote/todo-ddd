import { makeCompleteTaskUseCase } from '@/tasks/application/use-cases/complete-task';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type CompleteTaskParams = {
  id: string;
};

type CompleteTaskBody = {
  requesterProfileId: string;
};

export async function completeTaskController(
  request: FastifyRequest<{
    Params: CompleteTaskParams;
    Body: CompleteTaskBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { requesterProfileId } = request.body;

  const useCase = makeCompleteTaskUseCase();
  const result = await useCase.execute({
    taskId: id,
    requesterProfileId,
  });

  if (result.isLeft()) {
    console.log(result);
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(200).send({ data: result });
}
