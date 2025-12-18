import { randomUUID } from 'node:crypto';

export class UniqueEntityID {
  private readonly _value: string;

  constructor(value?: string) {
    this._value = value ?? randomUUID();
  }

  public get value() {
    return this._value;
  }

  public equals(id?: UniqueEntityID): boolean {
    if (id === null || id === undefined) {
      return false;
    }

    return this.value === id.value;
  }
}
