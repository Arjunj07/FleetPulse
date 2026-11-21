# Step 02: Routing and layout

## 1. Goal
Make the app multi-page with React Router (`/vehicles`, `/vehicles/:id`, not found), with one shared layout (header + nav) that stays while the page content changes.

## 2. Key concepts
- **Client-side routing:** the browser loads one HTML file. React Router changes the URL (History API) and swaps components, so there is no page reload.
- **Layout route + `<Outlet />`:** a route with no `path` renders the shared layout. Its child routes appear where `<Outlet />` is. Frame and picture.
- **Relative child paths:** child routes are relative to the parent (`vehicles`). Links and redirects are full paths (`/vehicles`).
- **`NavLink`** adds the class `active` to the link of the current page.
- **`MemoryRouter` in tests:** it keeps the URL in memory, because jsdom has no real address bar. `BrowserRouter` goes in `main.tsx`, not `App`, so `App` stays testable.

## 3. Files created or changed
- `frontend/src/components/Layout.tsx`: header, nav and `<Outlet />`.
- `frontend/src/components/layout.css`: styles for the layout.
- `frontend/src/pages/VehiclesPage.tsx`, `VehicleDetailPage.tsx`, `NotFoundPage.tsx`: placeholder pages (only an `<h1>`).
- `frontend/src/App.tsx`: the route map.
- `frontend/src/main.tsx`: wraps `<App />` in `<BrowserRouter>`.
- `frontend/src/index.css`: CSS variables (colours) and body styles.
- `frontend/src/App.test.tsx`: 5 routing tests with `MemoryRouter`.
- `frontend/jest.setup.ts`: `TextEncoder` / `TextDecoder` polyfill.
- `frontend/tsconfig.jest.json`: added `node` and `vite/client` to `types`.
- `frontend/package.json`: added `react-router` v7.

## 4. Important code

**Route map (`App.tsx`)**
```tsx
<Route element={<Layout />}>
  <Route index element={<Navigate to="/vehicles" replace />} />
  <Route path="vehicles" element={<VehiclesPage />} />
  <Route path="vehicles/:id" element={<VehicleDetailPage />} />
  <Route path="*" element={<NotFoundPage />} />
</Route>
```
The outer `Route` has no `path`, so it is a layout route. `index` handles `/` and redirects. `:id` is a variable part. `*` is the catch-all for unknown URLs.

**Layout with Outlet (`Layout.tsx`)**
```tsx
<main className="layout_main">
  <Outlet />
</main>
```
The matching child page renders here. If it is missing, there is no error, the pages just never appear.

**Router wrapper (`main.tsx`)**
```tsx
<BrowserRouter>
  <App />
</BrowserRouter>
```
Routing components only work inside a router. It is here, not in `App`, so tests can use `MemoryRouter` instead.

**Test helper (`App.test.tsx`)**
```tsx
function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
}
```
Each test starts at a chosen URL with one line.

## 5. How to verify
Run inside `frontend/`:
- `npm test`: expect 2 suites and 7 tests passed.
- `npm run lint`: expect no errors.
- `npm run build`: expect no errors.
- `npm run dev`, then in the browser:
  - `/` redirects to `/vehicles`.
  - Clicking **Vehicles** does not reload the page.
  - `/vehicles/42` shows "Vehicle Details" and the header stays.
  - `/xyz` shows "Page Not Found" and the blue underline disappears.

## 6. Problems and fixes
- **react-router v8 broke Jest.** v8 is ESM-only and uses `import.meta`, which Jest 29 cannot run. Fix: pin `react-router@7`, which also ships CommonJS.
- **`TextEncoder is not defined`** in tests. jsdom does not provide it, but react-router needs it. Fix: polyfill in `jest.setup.ts` (and add `node` to `types` in `tsconfig.jest.json` so `util` has types).
- **Blue underline missing.** The TSX used `layout_link` but two CSS rules used `layout__link`. CSS ignores selectors that match nothing, without an error. Fix: make the names match exactly. Debug tip: browser DevTools, Elements tab, compare class names.
- **Test suite failed: cannot find module `./layout.css`.** `tsconfig.jest.json` replaced the `types` list and left out `vite/client`, which teaches TypeScript that CSS imports are valid. Fix: add `vite/client` to `types`.

## 7. Interview Q&A
**Q1. What is the difference between `<Link>` and `<a>`?**
`<a>` asks the server for a new page and reloads everything. `<Link>` changes the URL with the History API and React re-renders only the matching components, so state is kept.

**Q2. What does `<Outlet />` do?**
It is a placeholder in a layout route that shows the matching child route. Many pages share one header and nav without repeating code. If I forget it, there is no error, the pages just do not show.

**Q3. How do you read `:id` from `/vehicles/:id`?**
With `useParams()`. It returns an object like `{ id: "42" }`. The value is always a string. (We will use it in Step 7.)

**Bonus: why `MemoryRouter` in tests?**
Tests run in jsdom, which has no real address bar. `MemoryRouter` keeps the URL in memory, so a test can start at any URL.

**Bonus: why is the nav link border `transparent` by default?**
A transparent border still takes 3px, so the link does not change size when it becomes active.

## 8. Commit message used
```
feat: add React Router with shared layout and placeholder pages
```
