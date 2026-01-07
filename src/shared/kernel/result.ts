export class Result<T> {
  public readonly isFailure: boolean;
  public readonly isSuccess: boolean;
  public readonly error?: string;
  public readonly _value?: T;

  private constructor(isSuccess: boolean, error?: string, value?: T) {
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

  public static fail<T>(error: string): Result<T> {
    return new Result<T>(false, error);
  }
}
