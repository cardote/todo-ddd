import { makeGetProfileUseCase } from '@/profile/application/use-cases/get-profile';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type GetProfileParams = { id: string };

export async function getProfileController(
  request: FastifyRequest<{ Params: GetProfileParams }>,
  reply: FastifyReply,
) {
  const { id } = request.params;

  const useCase = makeGetProfileUseCase();
  const result = await useCase.execute({ profileId: id });

  if (result.isLeft()) {
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(200).send({ data: result.value });
}
