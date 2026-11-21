# Step 01: Project structure and Vehicle types

## 1. Goal
Set up the project as a monorepo (`frontend/` now, `backend/` later), configure Jest + React Testing Library, and define the `Vehicle` TypeScript types used by the whole app.

## 2. Key concepts
- **Monorepo:** one Git repo, with `frontend/` and `backend/` folders. One history, one CI, and shared API shape.
- **Union type** (`'online' | 'offline'`) is safer than `string`. Typos are compile errors and the editor autocompletes values.
- **Types are erased at runtime.** TypeScript does not validate API data. We add Zod for that later (Step 8).
- **Optional (`?`) means "can really be missing".** It does not remove errors, it forces us to handle `undefined`.
- **Jest runs in Node**, so it needs jsdom (a fake browser DOM) and a stub for CSS imports.

## 3. Files created or changed
- `frontend/src/types/vehicle.ts`: the `Vehicle`, `Telemetry`, `GeoLocation`, `VehicleStatus` and `FuelType` types.
- `frontend/jest.config.cjs`: Jest settings (jsdom, ts-jest transform, CSS stub).
- `frontend/jest.setup.ts`: loads the jest-dom matchers (`toBeInTheDocument`).
- `frontend/tsconfig.jest.json`: TypeScript settings for tests (CommonJS, because Jest uses `require`).
- `frontend/tsconfig.app.json`: added `jest` and `@testing-library/jest-dom` to `types`.
- `frontend/package.json`: added `test` and `test:watch` scripts.
- `frontend/src/App.tsx`: replaced the Vite demo with a simple `<h1>FleetPulse</h1>`.
- `frontend/src/App.test.tsx`: smoke test for the toolchain.
- `frontend/src/types/vehicle.test.ts`: tests for the types.

## 4. Important code

**Union types for fixed values**
```ts
export type VehicleStatus = "online" | "offline" | "charging" | "maintenance";
```
Only these four strings are allowed. `'onlin'` fails at compile time.

**Compile-time test**
```ts
// @ts-expect-error 'onlin' is not a valid VehicleStatus
const bad: Vehicle = { ...vehicle, status: 'onlin' };
```
`@ts-expect-error` says the next line MUST be a type error. If it stops being one, TypeScript complains. This proves the type really blocks bad values.

**Jest config**
```js
transform: {
  '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
},
moduleNameMapper: {
  '\\.(css|less|scss)$': 'identity-obj-proxy',
},
```
`ts-jest` lets Jest read TypeScript. The mapper replaces CSS imports with a fake module, because Jest cannot parse CSS.

**Jest tsconfig**
```json
"extends": "./tsconfig.app.json",
"compilerOptions": { "module": "commonjs", "moduleResolution": "node10", "ignoreDeprecations": "6.0" }
```
We extend the Vite config and change only what Jest needs. `ignoreDeprecations` is there because TypeScript 6 marks `node10` as deprecated.

## 5. How to verify
Run these inside `frontend/`:
- `npm test`: expect 2 suites and 3 tests passed.
- `npm run lint`: expect no errors.
- `npm run build`: expect no TypeScript errors and a `dist/` folder.
- `npm run dev`: open the printed URL and see the heading **FleetPulse**.

## 6. Problems and fixes
- **Wrong folder layout:** the Vite project was first created at the repo root. We moved it into `frontend/` so `backend/` can sit next to it in Phase 2.
- **`npm run build` failed** with "Cannot find name 'describe'". The build uses `tsconfig.app.json`, which only knew the `vite/client` types. Fix: add `jest` and `@testing-library/jest-dom` to `types` there. Jest and the build use different tsconfig files, so both need the test types.
- `ignoreDeprecations: "6.0"` was added up front because the project uses TypeScript 6. We did not test without it.

## 7. Interview Q&A
**Q1. `interface` vs `type`?**
Both describe shapes. I use `interface` for objects and `type` for unions, and I stay consistent in the project.

**Q2. Why a union like `'online' | 'offline'` instead of `string`?**
It limits the value to the allowed set, so typos are caught by the compiler and the editor autocompletes. It also disappears at runtime, unlike an enum.

**Q3. Does TypeScript validate API data?**
No. Types only exist at compile time. Data from an API needs runtime validation, for example with Zod.

**Bonus: why jsdom in Jest?**
Jest runs in Node, which has no DOM. jsdom simulates a browser so `render()` works. CSS imports are stubbed because Jest cannot parse them.

## 8. Commit message used
```
chore: set up frontend project, Jest + RTL, and Vehicle types
```
