# Step 03: Mock data layer

## 1. Goal
Build a small typed "fake API" (`getVehicles`, `getVehicleById`) with an artificial delay, so the UI can be built as if a real backend existed.

## 2. Key concepts
- **API layer:** components call functions and get typed data. They do not know where it comes from. In Phase 2 only the inside of these functions changes.
- **Promise:** an object that means "a value that will arrive later" (pending, fulfilled or rejected).
- **`async/await`:** nicer syntax for Promises. An `async` function always returns a Promise. `await` pauses only that function, not the page.
- **`throw` in an `async` function** makes its Promise reject. We use it for "not found", so the UI can show an error state.
- **Return copies** (`structuredClone`), so callers cannot change the shared fake database.
- **Fake timers in tests** move the clock by hand, so tests do not really wait.

## 3. Files created or changed
- `frontend/src/api/mockVehicles.ts`: 8 typed sample vehicles (the fake database).
- `frontend/src/api/delay.ts`: `delay(ms)` returns a Promise that resolves after `ms`.
- `frontend/src/api/vehiclesApi.ts`: `getVehicles()` and `getVehicleById(id)`.
- `frontend/src/api/delay.test.ts`: 2 tests with fake timers.
- `frontend/src/api/vehiclesApi.test.ts`: 5 tests (all, not early, copies, by id, not found).
- `frontend/src/types/vehicle.ts`: `batteryPercent` is now optional (diesel and petrol vehicles have no battery).
- `frontend/jest.setup.ts`: added a `structuredClone` stand-in for jsdom.

## 4. Important code

**Wrapping `setTimeout` in a Promise (`delay.ts`)**
```ts
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
```
`resolve` is the "I am done" button. `setTimeout` presses it after `ms`. `Promise<void>` means it carries no value.

**The API functions (`vehiclesApi.ts`)**
```ts
export async function getVehicleById(id: string): Promise<Vehicle> {
  await delay(LATENCY_MS);
  const vehicle = mockVehicles.find((v) => v.id === id);
  if (!vehicle) {
    throw new Error(`Vehicle ${id} not found`);
  }
  return structuredClone(vehicle);
}
```
`find` gives `undefined` when nothing matches, so we throw. A thrown error rejects the Promise, which later becomes the error screen. `structuredClone` returns a deep copy.

**Testing a rejection (`vehiclesApi.test.ts`)**
```ts
const promise = getVehicleById("nope");
const assertion = expect(promise).rejects.toThrow("Vehicle nope not found");
await jest.advanceTimersByTimeAsync(500);
await assertion;
```
The assertion is attached before the clock moves. Otherwise the Promise rejects with no handler and Jest reports an unhandled rejection.

**Jest stand-in (`jest.setup.ts`)**
```ts
Object.assign(globalThis, {
  structuredClone: <T>(value: T): T => deserialize(serialize(value)),
});
```
jsdom is a pretend browser and does not include `structuredClone`.

## 5. How to verify
Run inside `frontend/`:
- `npm test`: expect 4 suites and 14 tests passed.
- `npm run lint`: expect no errors.
- `npm run build`: expect no errors.

## 6. Problems and fixes
- **`Cannot find module '../api/vehiclesApi'`** in a browser experiment: the file had not been created yet. Fix: create `vehiclesApi.ts`.
- **`structuredClone is not defined` in Jest.** The app works in a real browser, but Jest runs in jsdom, which lacks it. Fix: a stand-in in `jest.setup.ts`. The fix goes in the test setup, not in the app code.
- Lesson: the real app and the test environment are different places. `X is not defined` in a test while the app works means the test environment is missing something.

## 7. Interview Q&A
**Q1. Why put an API layer between components and the data source?**
It hides where the data comes from. Components call a typed function. When the backend arrives I change one layer, not every component. It also makes components easier to test.

**Q2. What is the difference between a Promise and `async/await`?**
They do the same job. A Promise is a value that arrives later. `async/await` lets me write Promise code in normal top-to-bottom style. An `async` function always returns a Promise, and `await` pauses only that function.

**Q3. How do you test code with `setTimeout` or a delay?**
With Jest fake timers: start the call, move the fake clock with `jest.advanceTimersByTime`, then check the result. The test runs instantly.

**Bonus: why throw an error for "not found" instead of returning `null`?**
A thrown error rejects the Promise, so the caller cannot forget to handle it. It also matches a real API that returns 404.

## 8. Commit message used
```
feat: add typed mock vehicles API with simulated latency
```
