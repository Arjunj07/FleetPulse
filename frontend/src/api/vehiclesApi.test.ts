import { getVehicleById, getVehicles } from "./vehiclesApi";
import { mockVehicles } from "./mockVehicles";

describe("vehiclesApi", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("getVehicles returns all vehicles after the delay", async () => {
    const promise = getVehicles();
    await jest.advanceTimersByTimeAsync(500);
    const result = await promise;
    expect(result).toHaveLength(mockVehicles.length);
  });

  it("getVehicles does not resolve before the delay has passed", async () => {
    const onDone = jest.fn();
    getVehicles().then(onDone);

    await jest.advanceTimersByTimeAsync(499);
    expect(onDone).not.toHaveBeenCalled();
  });

  it("getVehicles returns copies, not the original objects", async () => {
    const promise = getVehicles();
    await jest.advanceTimersByTimeAsync(500);
    const result = await promise;

    result[0].name = "CHANGED";

    expect(mockVehicles[0].name).not.toBe("CHANGED");
  });

  it("getVehicleById returns the matching vehicle", async () => {
    const promise = getVehicleById("v-003");
    await jest.advanceTimersByTimeAsync(500);
    const vehicle = await promise;
    expect(vehicle.id).toBe("v-003");
  });

  it("getVehicleById rejects when the id does not exist", async () => {
    const promise = getVehicleById("nope");
    // Attach the assertion BEFORE moving the clock. Otherwise the promise
    // rejects with no handler yet and Jest reports an unhandled rejection.
    const assertion = expect(promise).rejects.toThrow("Vehicle nope not found");

    await jest.advanceTimersByTimeAsync(500);
    await assertion;
  });
});
