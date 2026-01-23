import { buildApp } from '@/app/http/fastify-app';
import { prisma } from '@/shared/infra/prisma/prisma-client';
import { resetDb } from '@/tests/helpers/reset-db';

describe('Profile HTTP (Integration)', () => {
  const app = buildApp();

  beforeAll(async () => {
    await prisma.$connect;
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await resetDb();
  });

  async function createProfile(email = 'any-email@email.com') {
    const res = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: { name: 'any-name', email },
    });

    return res.json().data.profileId;
  }

  it('POST /tasks should return 201 on success', async () => {
    const profileId = await createProfile();

    const res = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { ownerProfileId: profileId, title: 'any-title' },
    });

    expect(res.statusCode).toBe(201);
    expect(res.json().data).toEqual({
      taskId: res.json().data.taskId,
    });
  });

  it('POST /tasks should return 404 when owner profile not found', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { ownerProfileId: 'any-id1', title: 'any-title' },
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe('PROFILE_NOT_FOUND');
  });

  it('PATCH /tasks/:id/complete should return 200 on success', async () => {
    const profileId = await createProfile('any-email@email.com');
    const taskId = await app
      .inject({
        method: 'POST',
        url: '/tasks',
        payload: { ownerProfileId: profileId, title: 'any-title' },
      })
      .then(res => res.json().data.taskId);

    const res = await app.inject({
      method: 'PATCH',
      url: `/tasks/${taskId}/complete`,
      payload: { requesterProfileId: profileId },
    });

    expect(res.statusCode).toBe(200);
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    expect(task?.status).toBe('completed');
    expect(task?.completedAt).not.toBeNull();
  });

  it('PATCH /tasks/:id/complete should return 403 if requester is not the task owner', async () => {
    const ownerProfileId = await createProfile('any-email@email.com');
    const otherProfileId = await createProfile('other-email@email.com');

    const taskId = await app
      .inject({
        method: 'POST',
        url: '/tasks',
        payload: { ownerProfileId, title: 'any-title' },
      })
      .then(res => res.json().data.taskId);

    const res = await app.inject({
      method: 'PATCH',
      url: `/tasks/${taskId}/complete`,
      payload: { requesterProfileId: otherProfileId },
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().error.code).toBe('NOT_TASK_OWNER');
  });

  it('PATCH /tasks/:id/complete should return 409 if task is already completed', async () => {
    const ownerProfileId = await createProfile('any-email@email.com');

    const taskId = await app
      .inject({
        method: 'POST',
        url: '/tasks',
        payload: { ownerProfileId, title: 'any-title' },
      })
      .then(res => res.json().data.taskId);

    await app.inject({
      method: 'PATCH',
      url: `/tasks/${taskId}/complete`,
      payload: { requesterProfileId: ownerProfileId },
    });

    const res = await app.inject({
      method: 'PATCH',
      url: `/tasks/${taskId}/complete`,
      payload: { requesterProfileId: ownerProfileId },
    });

    expect(res.statusCode).toBe(409);
    expect(res.json().error.code).toBe('TASK_ALREADY_COMPLETED');
  });
});
