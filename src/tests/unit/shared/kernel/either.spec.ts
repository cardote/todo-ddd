import { Either, Left, left, Right, right } from '@/shared/kernel/either';

const CUSTOM_STRING = 'any-error';
const CUSTOM_NUMBER = 10;

describe('Either (Unit)', () => {
  it('should create a Left value', () => {
    const result: Either<string, number> = left(CUSTOM_STRING);

    expect(result).toBeInstanceOf(Left);
    expect(result.isLeft()).toBe(true);
    expect(result.isRight()).toBe(false);
    expect(result.value).toBe(CUSTOM_STRING);
  });

  it('should create a Right value', () => {
    const result: Either<string, number> = right(CUSTOM_NUMBER);

    expect(result).toBeInstanceOf(Right);
    expect(result.isLeft()).toBe(false);
    expect(result.isRight()).toBe(true);
    expect(result.value).toBe(CUSTOM_NUMBER);
  });

  it('should allow type narrowing using isLeft()', () => {
    const result: Either<string, number> = left(CUSTOM_STRING);

    if (result.isLeft()) {
      expect(result.value).toBe(CUSTOM_STRING);
    }
  });

  it('should allow type narrowing using isRight()', () => {
    const result: Either<string, number> = right(CUSTOM_NUMBER);

    if (result.isRight()) {
      expect(result.value).toBe(CUSTOM_NUMBER);
    }
  });
});
