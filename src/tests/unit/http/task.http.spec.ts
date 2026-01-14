const right = <T>(value: T) => ({ isLeft: () => false, value });
const left = (error: Error) => ({ isLeft: () => true, value: error });

const createTaskExecute = vi.fn();
const completeTaskExecute = vi.fn();

vi.mock('@/tasks/application/use-cases/create-task', () => ({
  makeCreateTaskUseCase: () => ({ execute: createTaskExecute }),
}));

vi.mock('@/tasks/application/use-cases/complete-task', () => ({
  makeCompleteTaskUseCase: () => ({ execute: completeTaskExecute }),
}));

import { buildApp } from '@/app/http/fastify-app';

describe('Task HTTP (Unit)', () => {
  const app = buildApp();

  beforeEach(() => {
    createTaskExecute.mockReset();
    completeTaskExecute.mockReset();
  });

  it('POST /tasks should return 201 on success', async () => {
    createTaskExecute.mockResolvedValueOnce(
      right({
        taskId: 'any-id1',
        title: 'any-title',
      }),
    );

    const res = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: {
        ownerProfileId: 'any-id1',
        title: 'any-title',
      },
    });

    expect(res.statusCode).toBe(201);
    expect(createTaskExecute).toHaveBeenCalledWith({
      ownerProfileId: 'any-id1',
      title: 'any-title',
    });
  });

  it('POST /tasks should return 400 when invalid body', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/tasks',
      payload: { ownerProfileId: 1, title: null },
    });

    expect(res.statusCode).toBe(400);
    expect(createTaskExecute).not.toHaveBeenCalled();
  });

  it('PATCH /tasks/:id/complete should return 200 on success', async () => {
    completeTaskExecute.mockResolvedValueOnce(
      right({ taskId: 'task-1', status: 'completed' }),
    );

    const res = await app.inject({
      method: 'PATCH',
      url: '/tasks/task-1/complete',
      payload: { requesterProfileId: 'profile-1' },
    });

    expect(res.statusCode).toBe(200);
    expect(completeTaskExecute).toHaveBeenCalledWith({
      taskId: 'task-1',
      requesterProfileId: 'profile-1',
    });
  });
  it('PATCH /tasks/:id/complete should map NotTaskOwnerError to 403', async () => {
    class NotTaskOwnerError extends Error {
      constructor() {
        super('Not task owner');
        this.name = 'NotTaskOwnerError';
      }
    }

    completeTaskExecute.mockResolvedValueOnce(left(new NotTaskOwnerError()));

    const res = await app.inject({
      method: 'PATCH',
      url: '/tasks/task-1/complete',
      payload: { requesterProfileId: 'profile-2' },
    });

    expect(res.statusCode).toBe(403);
    expect(res.json().error.code).toBe('NOT_TASK_OWNER');
  });

  it('should close app', async () => {
    await app.close();
    expect(true).toBe(true);
  });
});
