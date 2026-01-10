import { DomainEventDispatcher } from '@/shared/infra/events/domain-event-dispatcher';
import { DomainEvent } from '@/shared/kernel/domain-event';

class FakeEvent implements DomainEvent {
  public readonly name = 'FakeEvent';
  public readonly occuredAt = new Date();
}

describe('DomainEventDispatcher (Unit)', () => {
  it('should call hanlder when event is dispatched', async () => {
    const dispatcher = new DomainEventDispatcher();
    const handler = vi.fn();

    dispatcher.register('FakeEvent', handler);

    await dispatcher.dispatch([new FakeEvent()]);

    expect(handler).toHaveBeenCalledTimes(1);
    expect(handler).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'FakeEvent' }),
    );
  });

  it('should call all handlers registered for the same event', async () => {
    const dispatcher = new DomainEventDispatcher();
    const handler1 = vi.fn();
    const handler2 = vi.fn();

    dispatcher.register('FakeEvent', handler1);
    dispatcher.register('FakeEvent', handler2);

    await dispatcher.dispatch([new FakeEvent()]);

    expect(handler1).toHaveBeenCalledTimes(1);
    expect(handler2).toHaveBeenCalledTimes(1);
  });

  it('should await async handlers', async () => {
    const dispatcher = new DomainEventDispatcher();

    const calls: string[] = [];
    const asyncHandler = vi.fn(async () => {
      await new Promise(resolver => setTimeout(resolver, 100));

      calls.push('asyncHandler');
    });

    dispatcher.register('FakeEvent', asyncHandler);

    await dispatcher.dispatch([new FakeEvent()]);

    expect(asyncHandler).toHaveBeenCalledTimes(1);
    expect(calls).toEqual(['asyncHandler']);
  });

  it('should not throw when there are no handlers for an event', async () => {
    const dispatcher = new DomainEventDispatcher();

    await expect(dispatcher.dispatch([new FakeEvent()])).resolves.not.toThrow();
  });

  it('should dispatch events independently by name', async () => {
    const dispatcher = new DomainEventDispatcher();

    class OtherEvent implements DomainEvent {
      public readonly name = 'OtherEvent';
      public readonly occuredAt = new Date();
    }

    const fakeHandler = vi.fn();
    const otherHandler = vi.fn();

    dispatcher.register('FakeEvent', fakeHandler);
    dispatcher.register('OtherEvent', otherHandler);

    await dispatcher.dispatch([new FakeEvent(), new OtherEvent()]);

    expect(fakeHandler).toHaveBeenCalledTimes(1);
    expect(otherHandler).toHaveBeenCalledTimes(1);
  });
});
