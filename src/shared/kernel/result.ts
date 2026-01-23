export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * A Result class to represent success or failure of an operation.
 * @template T - Type of the success value.
 * @template E - Type of the error value, extends DomainError.
 */
export class Result<T, E extends DomainError = DomainError> {
  public readonly isFailure: boolean;
  public readonly isSuccess: boolean;
  public readonly error?: E;
  public readonly _value?: T;

  private constructor(isSuccess: boolean, error?: E, value?: T) {
    // Success cannot have an error
    if (isSuccess && error) {
      throw new Error(
        `Invalid operation: A result cannot be successful and contain an error`,
      );
    }
    // Fail needs to have an error
    if (!isSuccess && !error) {
      throw new Error(
        `Invalid operation: A failing result needs an error message`,
      );
    }

    this.isSuccess = isSuccess;
    this.isFailure = !isSuccess;
    this.error = error;
    this._value = value;
  }

  get value(): T {
    // if try to access value without checking if it is success
    if (!this.isSuccess) {
      throw new Error(
        'Cannot access value of a failure result. Use error instead.',
      );
    }

    return this._value as T;
  }
  public static ok<T>(): Result<T>;
  public static ok<T>(value: T): Result<T>;
  public static ok<T>(value?: T): Result<T> {
    return new Result<T>(true, undefined, value);
  }

  public static fail<E extends DomainError>(error: E): Result<never, E> {
    return new Result<never, E>(false, error);
  }
}
