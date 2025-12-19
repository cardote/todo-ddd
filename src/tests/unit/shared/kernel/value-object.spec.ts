// Use Fake implementation for testing abstract classes
// the domain should never be mocked
import { ValueObject } from '@/shared/kernel/value-object';

const CUSTOM_VALUE = 'any-value';
const OTHER_VALUE = 'other-value';

interface FakeValueObjectProps {
  value: string;
}

class FakeValueObject extends ValueObject<FakeValueObjectProps> {
  constructor(value: string) {
    super({ value });
  }

  get value() {
    return this.props.value;
  }
}

const makeFakeValueObject = (value: string = CUSTOM_VALUE): FakeValueObject =>
  new FakeValueObject(value);

describe('ValueObject (Unit)', () => {
  it('should consider two value objects equals if they have the same props', () => {
    expect(makeFakeValueObject().equals(makeFakeValueObject())).toBe(true);
  });

  it('should consider two value objects different if they have the different props', () => {
    const vo1 = makeFakeValueObject(CUSTOM_VALUE);
    const vo2 = makeFakeValueObject(OTHER_VALUE);

    expect(vo1.equals(vo2)).toBe(false);
  });

  it('should return false when comparing with null or undefined', () => {
    const vo = makeFakeValueObject();

    expect(vo.equals(null as any)).toBe(false);
    expect(vo.equals(undefined)).toBe(false);
  });

  it('should be immutable (props should be frozen(shallow))', () => {
    const vo = makeFakeValueObject();

    expect(() => {
      (vo as any).props.value = OTHER_VALUE;
    }).toThrow();
  });
});
