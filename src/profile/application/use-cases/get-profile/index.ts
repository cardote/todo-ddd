import { PrismaProfileRepository } from '@/profile/infra/prisma/repositories/prisma-profile-repository';
import { GetProfileUseCase } from './get-profile-use-case';

export const makeGetProfileUseCase = () => {
  const repo = new PrismaProfileRepository();
  return new GetProfileUseCase(repo);
};
