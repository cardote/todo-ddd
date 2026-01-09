import { Profile } from '@/profile/domain/entities/profile';
import { ProfileRepository } from '@/profile/domain/repositories/profile-repository';
import { ProfileId } from '@/profile/domain/value-objects/profile-id';
import { PrismaProfileMapper } from '../mappers/prisma-profile-mapper';
import { prisma } from '@/shared/infra/prisma/prisma-client';
import { ProfileEmail } from '@/profile/domain/value-objects/profile-email';
import { PrismaUniqueConstraintError } from '../errors/prisma-unique-constraint-error';

export class PrismaProfileRepository implements ProfileRepository {
  async findById(id: ProfileId): Promise<Profile | null> {
    const raw = await prisma.profile.findUnique({ where: { id: id.value } });

    if (!raw) return null;

    const profile = PrismaProfileMapper.toDomain(raw);

    if (profile.isFailure) {
      // corrupted record
      throw profile.error;
    }

    return profile.value;
  }

  async findByEmail(email: ProfileEmail): Promise<Profile | null> {
    const raw = await prisma.profile.findUnique({
      where: { email: email.value },
    });

    if (!raw) return null;

    const profile = PrismaProfileMapper.toDomain(raw);

    if (profile.isFailure) {
      // corrupted record
      throw profile.error;
    }

    return profile.value;
  }

  async save(profile: Profile): Promise<Profile> {
    const data = PrismaProfileMapper.toPrisma(profile);

    try {
      await prisma.profile.upsert({
        where: { id: data.id },
        create: data,
        update: {
          name: data.name,
          email: data.email,
          updatedAt: data.updatedAt,
        },
      });

      return profile;
    } catch (error) {
      // i'm not sure if this is the best way
      throw new PrismaUniqueConstraintError('Email already in use.');
    }
  }
}
