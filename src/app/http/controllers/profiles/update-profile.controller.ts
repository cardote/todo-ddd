import { makeUpdateProfileUseCase } from '@/profile/application/use-cases/update-profile';
import { FastifyReply, FastifyRequest } from 'fastify';
import { mapErrorToHttp } from '../../presenters/http-error-mapper';

type UpdateProfileParams = {
  id: string;
};

type UpdateProfileBody = {
  name?: string;
  email?: string;
};

export async function updateProfileController(
  request: FastifyRequest<{
    Params: UpdateProfileParams;
    Body: UpdateProfileBody;
  }>,
  reply: FastifyReply,
) {
  const { id } = request.params;
  const { name, email } = request.body;

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
