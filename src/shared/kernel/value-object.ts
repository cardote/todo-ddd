// Contract for all value objects
// in this todo project, a value object can be a TaskTitle, TaskStatus, TaskPriority
export abstract class ValueObject<T> {
  protected readonly props: T;

  protected constructor(props: T) {
    // Object.freeze() -> prevent direct modification (shallow) in runtime
    this.props = Object.freeze(props);
  }

  public equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }

    if (vo === this) {
      return true;
    }

    // for complex objects don't use JSON.stringify,
    // use deep comparison, maybe a method `toPrimitive()`
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}
