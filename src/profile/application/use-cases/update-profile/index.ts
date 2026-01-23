import { PrismaProfileRepository } from '@/profile/infra/prisma/repositories/prisma-profile-repository';
import { UpdateProfileUseCase } from './update-profile-use-case';

export const makeUpdateProfileUseCase = () => {
  const repo = new PrismaProfileRepository();
  return new UpdateProfileUseCase(repo);
};
