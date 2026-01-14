const right = <T>(value: T) => ({ isLeft: () => false, value });
const left = (error: Error) => ({ isLeft: () => true, value: error });

const createExecute = vi.fn();
const getExecute = vi.fn();
const updateExecute = vi.fn();

vi.mock('@/profile/application/use-cases/create-profile', () => ({
  makeCreateProfileUseCase: () => ({
    execute: createExecute,
  }),
}));

vi.mock('@/profile/application/use-cases/get-profile', () => ({
  makeGetProfileUseCase: () => ({
    execute: getExecute,
  }),
}));

vi.mock('@/profile/application/use-cases/update-profile', () => ({
  makeUpdateProfileUseCase: () => ({
    execute: updateExecute,
  }),
}));

import { buildApp } from '@/app/http/fastify-app';

describe('Profile HTTP (Unit)', () => {
  const app = buildApp();

  beforeEach(() => {
    createExecute.mockReset();
    getExecute.mockReset();
    updateExecute.mockReset();
  });

  it('POST /profile should return 201 on success', async () => {
    createExecute.mockResolvedValueOnce(
      right({
        profileId: 'any-id1',
        name: 'any-name',
        email: 'any-email@email.com',
      }),
    );

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
    expect(body).toEqual({
      data: {
        profileId: 'any-id1',
        name: 'any-name',
        email: 'any-email@email.com',
      },
    });
    expect(createExecute).toHaveBeenCalledWith({
      name: 'any-name',
      email: 'any-email@email.com',
    });
  });
  it('POST /profile should return 400 when body is invalid', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/profile',
      payload: {
        name: 123,
        email: true,
      },
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /profile should map EmailAlreadyInUseError to 409', async () => {
    class EmailAlreadyInUseError extends Error {
      constructor() {
        super('Email already in use.');
        this.name = 'EmailAlreadyInUseError';
      }
    }

    createExecute.mockResolvedValueOnce(left(new EmailAlreadyInUseError()));

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
    getExecute.mockResolvedValueOnce(
      right({
        profileId: 'any-id1',
        name: 'any-name',
        email: 'any-email@email.com',
      }),
    );

    const res = await app.inject({
      method: 'GET',
      url: '/profile/any-id1',
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toEqual({
      data: {
        profileId: 'any-id1',
        name: 'any-name',
        email: 'any-email@email.com',
      },
    });
    expect(getExecute).toHaveBeenCalledWith({ profileId: 'any-id1' });
  });

  it('GET /profile/:id should map ProfileNotFoundError to 404', async () => {
    class ProfileNotFoundError extends Error {
      constructor() {
        super('Profile not found.');
        this.name = 'ProfileNotFoundError';
      }
    }

    getExecute.mockResolvedValueOnce(left(new ProfileNotFoundError()));

    const res = await app.inject({
      method: 'GET',
      url: '/profile/any-id1',
    });

    expect(res.statusCode).toBe(404);
    expect(res.json().error.code).toBe('PROFILE_NOT_FOUND');
  });

  it('PATCH /profile/:id should return 200 on success', async () => {
    updateExecute.mockResolvedValueOnce(
      right({
        profileId: 'any-id1',
        name: 'new-name',
        email: 'new-email@email.com',
      }),
    );
    const res = await app.inject({
      method: 'PATCH',
      url: '/profile/any-id1',
      payload: {
        name: 'new-name',
        email: 'new-email@email.com',
      },
    });

    expect(res.statusCode).toBe(200);
    expect(updateExecute).toHaveBeenCalledWith({
      profileId: 'any-id1',
      name: 'new-name',
      email: 'new-email@email.com',
    });
  });

  it('PATCH /profile/:id should return 400 when no fields are provided', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/profile/any-id1',
      payload: {},
    });
    expect(res.statusCode).toBe(400);
    expect(res.json().error.code).toBe('VALIDATION_ERROR');
  });

  it('should cloase app', async () => {
    await app.close();
    expect(true).toBe(true);
  });
});
