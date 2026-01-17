import { buildApp } from '@/app/http/fastify-app';
import { prisma } from '@/shared/infra/prisma/prisma-client';
import { resetDb } from '@/tests/helpers/reset-db';

describe('Profile HTTP (Integration)', () => {
  const app = buildApp();

  beforeAll(async () => {
    await prisma.$connect();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDb();
  });

  it('POST /profile should create a profile (201) and persist in DB', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: {
        name: 'any-name',
        email: 'any-email@email.com',
      },
    });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body.data).toBeDefined();

    const profile = await prisma.profile.findUnique({
      where: {
        id: body.data.profileId,
      },
    });

    expect(profile).not.toBeNull();
    expect(profile?.name).toBe('Any-name');
    expect(profile?.email).toBe('any-email@email.com');
  });

  it('POST /profile should return 409 when email is already in use', async () => {
    await app.inject({
      method: 'POST',
      url: '/profile',
      payload: {
        name: 'any-name',
        email: 'any-email@email.com',
      },
    });

    const res = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: {
        name: 'any-name',
        email: 'any-email@email.com',
      },
    });

    expect(res.statusCode).toBe(409);
    expect(res.json().error.code).toBe('EMAIL_IN_USE');
  });

  it('GET /profile/:id should return 200 on success', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: {
        name: 'any-name',
        email: 'any-email@email.com',
      },
    });

    const res = await app.inject({
      method: 'GET',
      url: `/profile/${created.json().data.profileId}`,
    });

    expect(res.statusCode).toBe(200);

    expect(res.json().data).toEqual({
      id: created.json().data.profileId,
      name: 'Any-name',
      email: 'any-email@email.com',
    });
  });

  it('PATCH /profiles/:id should update email (200) and persist in DB', async () => {
    const created = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: { name: 'any-name', email: 'any-email@example.com' },
    });

    const res = await app.inject({
      method: 'PATCH',
      url: `/profile/${created.json().data.profileId}`,
      payload: { email: 'new-email@example.com' },
    });

    expect(res.statusCode).toBe(200);

    const stored = await prisma.profile.findUnique({
      where: { id: created.json().data.profileId },
    });

    expect(stored?.email).toBe('new-email@example.com');
  });
});
