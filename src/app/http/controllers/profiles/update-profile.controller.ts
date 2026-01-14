import { makeUpdateProfileUseCase } from '@/profile/application/use-cases/update-profile';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type UpdateProfileParams = {
  id: string;
};

type UpdateProfileBody = {
  name?: unknown;
  email?: unknown;
};

export async function updateProfileController(
  request: FastifyRequest<{
    Params: UpdateProfileParams;
    Body: UpdateProfileBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, email } = request.body ?? {};

  if (typeof id !== 'string' || id.trim().length === 0) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'id is required and must be a string',
      },
    });
  }

  if (name !== undefined && typeof name !== 'string') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'name must be a string',
      },
    });
  }

  if (email !== undefined && typeof email !== 'string') {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'email must be a string',
      },
    });
  }

  if (name === undefined && email === undefined) {
    return reply.status(400).send({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'name or email is required',
      },
    });
  }

  const useCase = makeUpdateProfileUseCase();
  const result = await useCase.execute({
    profileId: id,
    name: name as string | undefined,
    email: email as string | undefined,
  });

  if (result.isLeft()) {
    const http = mapErrorToHttp(result.value);
    return reply.status(http.statusCode).send(http.body);
  }

  return reply.status(200).send({ data: result.value });
}
