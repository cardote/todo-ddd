import { UniqueEntityID } from '@/shared/kernel/unique-entity-id';

const CUSTOM_ID = 'any-id';
const OTHER_ID = 'other-id';

describe('UniqueEntityID (Unit)', () => {
  it('should create an unique id when no value is provided', () => {
    const id = new UniqueEntityID();

    expect(id.value).toBeDefined();
    expect(typeof id.value).toBe('string');
  });

  it('should create an unique id when a value is provided', () => {
    const id = new UniqueEntityID(CUSTOM_ID);

    expect(id.value).toBe(CUSTOM_ID);
  });

  it('should consider two ids equals if they have the same value', () => {
    const id1 = new UniqueEntityID(CUSTOM_ID);
    const id2 = new UniqueEntityID(CUSTOM_ID);

    expect(id1.equals(id2)).toBe(true);
  });

  it('should consider two ids different if they have different value', () => {
    const id1 = new UniqueEntityID(CUSTOM_ID);
    const id2 = new UniqueEntityID(OTHER_ID);

    expect(id1.equals(id2)).toBe(false);
  });

  it('should return false when comparing with null or undefined', () => {
    const id = new UniqueEntityID();

    expect(id.equals(null as any)).toBe(false);
    expect(id.equals(undefined)).toBe(false);
  });
});
