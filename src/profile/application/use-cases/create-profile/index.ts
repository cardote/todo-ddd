import { PrismaProfileRepository } from '@/profile/infra/prisma/repositories/prisma-profile-repository';
import { CreateProfileUseCase } from './create-profile-use-case';

export const makeCreateProfileUseCase = () => {
  const repo = new PrismaProfileRepository();

  return new CreateProfileUseCase(repo);
};
