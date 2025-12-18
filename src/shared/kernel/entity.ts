import { UniqueEntityID } from './unique-entity-id';

export abstract class Entity<T> {
  protected readonly _id: UniqueEntityID;
  protected props;

  protected constructor(props: T, id?: UniqueEntityID) {
    this._id = id ?? new UniqueEntityID();
    this.props = props;
  }

  get id(): UniqueEntityID {
    return this._id;
  }

  // entities are equal if they have the same id, not if they have the same props
  public equals(entity?: Entity<T>): boolean {
    if (entity == null || entity == undefined) {
      return false;
    }

    if (entity === this) {
      return true;
    }

    return this.id.equals(entity.id);
  }
}
