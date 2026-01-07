import { TaskTitle } from '@/tasks/domain/value-objects/task-title';

describe('TaskTitle (Unit)', () => {
  it('should return success when title is valid', () => {
    const result = TaskTitle.create('Study DDD');

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.error).toBeUndefined();
  });

  it('should normalize the title by trimming whitespace', () => {
    const result = TaskTitle.create('   Learn React   ');
    expect(result.value.value).toBe('Learn React');
  });

  it('should return failure when title is empty', () => {
    const result = TaskTitle.create('');

    expect(result.isFailure).toBe(true);
    expect(result.isSuccess).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should return failure when title is too short', () => {
    const result = TaskTitle.create('Hi');

    expect(result.isFailure).toBe(true);
    expect(result.isSuccess).toBe(false);
  });

  it('should return failure when title is too long', () => {
    const longTitle = 'A'.repeat(121);
    const result = TaskTitle.create(longTitle);

    expect(result.isFailure).toBe(true);
    expect(result.isSuccess).toBe(false);
  });
});
