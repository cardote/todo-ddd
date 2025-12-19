import { Result } from '@/shared/kernel/result';

describe('Result (Unit)', () => {
  it('should create a success result with a value', () => {
    const result = Result.ok('any_value');

    expect(result.isSuccess).toBe(true);
    expect(result.isFailure).toBe(false);
    expect(result.value).toBe('any_value');
    expect(result.error).toBe(undefined);
  });

  it('should create a failure result with an error message', () => {
    const result = Result.fail('any_error');

    expect(result.isSuccess).toBe(false);
    expect(result.isFailure).toBe(true);
    expect(result.error).toBe('any_error');
  });

  it('should throw an error when accessing value of a falure result', () => {
    const result = Result.fail('any_error');

    expect(() => result.value).toThrow();
  });

  it('should not allow create a success result with an error', () => {
    // () => {} -> anonymous function prevents typescript from throwing an error and stop the test
    expect(() => {
      new (Result as any)(true, 'any_error', 'value');
    }).toThrow();
  });

  it('should not allow create a failure result without an error', () => {
    expect(() => {
      new (Result as any)(false);
    }).toThrow();
  });
});
