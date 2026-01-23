import { makeCreateProfileUseCase } from '@/profile/application/use-cases/create-profile';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type CreateProfileBody = { name: string; email: string };

export async function createProfileController(
  request: FastifyRequest<{ Body: CreateProfileBody }>,
  reply: FastifyReply,
) {
  const { name, email } = request.body;

  const useCase = makeCreateProfileUseCase();
  const result = await useCase.execute({ name, email });

  if (result.isLeft()) {
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(201).send({ data: result.value });
}
