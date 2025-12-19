// Use Fake implementation for testing abstract classes
// the domain should never be mocked

import { Entity } from '@/shared/kernel/entity';
import { UniqueEntityID } from '@/shared/kernel/unique-entity-id';

interface FakeEntityProps {
  name: string;
}

class FakeEntity extends Entity<FakeEntityProps> {
  constructor(props: FakeEntityProps, id?: UniqueEntityID) {
    super(props, id);
  }
}

const makeFakeEntity = (id?: UniqueEntityID): FakeEntity =>
  new FakeEntity({ name: 'any-name' }, id);

describe('Entity (Unit)', () => {
  it('should create an entity with a unique id when none is provided', () => {
    const entity = makeFakeEntity();

    expect(entity.id).toBeInstanceOf(UniqueEntityID);
  });

  it('should consider two entities equals if they have the same id', () => {
    const id = new UniqueEntityID();

    expect(makeFakeEntity(id).equals(makeFakeEntity(id))).toBe(true);
  });

  it('should consider two entities different if they have different ids', () => {
    const id1 = new UniqueEntityID();
    const id2 = new UniqueEntityID();

    expect(makeFakeEntity(id1).equals(makeFakeEntity(id2))).toBe(false);
  });

  it('should return false when comparing with null or undefined', () => {
    const entity = makeFakeEntity();

    expect(entity.equals(null as any)).toBe(false);
    expect(entity.equals(undefined)).toBe(false);
  });

  it('should return true when comparing with itself', () => {
    const entity = makeFakeEntity();

    expect(entity.equals(entity)).toBe(true);
  });
});
