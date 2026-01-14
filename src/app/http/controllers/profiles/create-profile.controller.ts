import { makeCreateProfileUseCase } from '@/profile/application/use-cases/create-profile';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type CreateProfileBody = { name?: unknown; email?: unknown };

export async function createProfileController(
  request: FastifyRequest<{ Body: CreateProfileBody }>,
  reply: FastifyReply,
) {
  const { name, email } = request.body ?? {};

  // minimal format validation (HTTP-level)
  if (typeof name !== 'string' || typeof email !== 'string') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'name and email must be strings',
      },
    });
  }

  const useCase = makeCreateProfileUseCase();
  const result = await useCase.execute({ name, email });

  if (result.isLeft()) {
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(201).send({ data: result.value });
}
