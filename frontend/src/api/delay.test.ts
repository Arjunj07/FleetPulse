import { delay } from "./delay";

describe("delay", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("does not resolve before the time has passed", async () => {
    const onDone = jest.fn();
    delay(500).then(onDone);

    jest.advanceTimersByTime(499);
    await Promise.resolve();
    expect(onDone).not.toHaveBeenCalled();
  });

  it("resolves after the time has passed", async () => {
    const onDone = jest.fn();
    delay(500).then(onDone);

    await jest.advanceTimersByTimeAsync(500);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
