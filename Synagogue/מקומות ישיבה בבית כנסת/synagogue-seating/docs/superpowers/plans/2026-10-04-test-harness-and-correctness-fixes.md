# Test Harness and Correctness Fixes Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Put the synagogue-seating project under version control, give it a test harness it currently lacks entirely, and fix three verified defects with tests that prove them.

**Architecture:** Two separate Vitest suites — one for the React frontend (jsdom + Testing Library), one for the Express backend (node environment + supertest with a mocked `pg` pool). No database is required to run the tests. Each fix is driven by a failing test first.

**Tech Stack:** React 19, Vite 8, Vitest, @testing-library/react, Express 4, TypeScript (ESM/NodeNext), supertest, PostgreSQL 16 (not needed for tests).

---

## Context for the implementer

You have zero context for this codebase. Read this section before Task 1.

**What the app is.** A Hebrew, right-to-left web app for managing synagogue seat assignments. A map of seats is drawn as hand-written SVG (not a library). Each seat has an owner name, a status (`available` / `assigned` / `reserved`), and an annual price. There is an edit mode for drawing the hall: dragging seats, clicking empty space to add one, adding whole rows, clearing a block.

**Where things live.** All code is under `synagogue-seating/`. The frontend is plain JS/JSX (no TypeScript) in `src/`. The backend is TypeScript ESM in `backend/src/`. Data model is `sections` → `blocks` → `seats`.

**Two project rules you must not break:**
1. Never delete a file without explicit user approval. Task 8 deletes three files — approval for exactly those three was given on 2026-10-04. Do not delete anything else.
2. The UI is Hebrew and RTL. Use CSS logical properties (`margin-inline-start`, not `margin-left`). Text inputs get `dir="auto"`, numbers and prices get `dir="ltr"`. The existing CSS already complies — keep it that way.

**Package managers differ between the two halves.** The frontend uses **pnpm** (`pnpm-lock.yaml` is the live lockfile; `node_modules` has pnpm's layout). The backend uses **npm** (`package-lock.json`). Use the right one in each directory or you will corrupt the other's `node_modules`. Never hand-edit either lockfile.

**The three defects you are fixing** (all verified by running the real stack on 2026-10-04):

1. *Price inconsistency.* A seat created through the API gets `price: 0` (the SQL column default), but the demo seed and the frontend's offline mode both use `1200`. Identical actions produce different prices depending on whether the server is reachable. **Decision: ₪0 is the correct value everywhere** — it now means "not yet priced", and the UI must say so in words instead of showing "0 ₪". This means the backend `INSERT` statements stay exactly as they are; the seed and the frontend change to match them.

2. *Silent save failures.* Every mutation in `src/App.jsx` updates local state immediately and swallows any error with `console.error`. If the backend is down mid-session the user edits all morning, sees the changes on screen, and loses them on refresh. **Decision: pessimistic saving** — the details-panel form disables itself while saving and only commits on a `200`; on failure it restores the last server-confirmed values and shows an inline error.

   *Assumption, stated because the decision only covered form fields:* drag, add, delete and clear-block have no form field to disable, so they get the same guarantee adapted to their shape — the UI never shows unsaved state as saved. Delete and clear-block become pessimistic (nothing disappears until the server confirms). Add-seat is already pessimistic online and only needs its error surfaced. Drag stays optimistic (a seat that refuses to follow the cursor is unusable) but snaps back to its old position if the save fails.

3. *Shape inconsistency.* `backend/src/routes/blocks.ts` returns raw database rows (`section_id`, `sort_order`) while `seats.ts` maps to camelCase via `mapSeat`. This will break the UI the moment block editing is wired up.

**Out of scope, deliberately.** Authentication, wiring block CRUD to the UI, Excel/PDF export, undo, and multi-select drag each need their own plan. Do not start them here.

---

## File Structure

**Created:**

| Path | Responsibility |
| --- | --- |
| `src/test/setup.js` | Frontend test bootstrap: jest-dom matchers, DOM cleanup between tests |
| `src/data/seatLayout.test.js` | Locks the ₪0 default and the demo-layout builder |
| `src/components/SeatDetailsPanel.test.jsx` | Price wording, pessimistic save behavior |
| `src/App.test.jsx` | App-level wiring: a failed delete must not remove the seat |
| `backend/vitest.config.ts` | Backend test config (node environment) |
| `backend/src/routes/blocks.test.ts` | camelCase response shape |
| `backend/src/bootstrap.test.ts` | Seeded seats carry no price |
| `docs/superpowers/plans/…` | This plan (already created) |

**Modified:**

| Path | Change |
| --- | --- |
| `vite.config.js` | Add the `test` block |
| `package.json` | Test deps + `test` script |
| `backend/package.json` | Test deps + `test` script |
| `backend/tsconfig.json` | Exclude `*.test.ts` from the build output |
| `src/data/seatLayout.js:16` | `DEFAULT_PRICE` 1200 → 0 |
| `src/App.jsx` | Offline price → 0; pessimistic save/delete/clear; error banner |
| `src/components/SeatDetailsPanel.jsx` | Saving state, disabled fields, inline error, "טרם נקבע מחיר" |
| `src/App.css` | Styles for `.field-error` and `.action-error-banner` |
| `backend/src/bootstrap.ts` | `DEFAULT_PRICE` 1200 → 0, exported for testing |
| `backend/src/types.ts` | Add `mapBlock` |
| `backend/src/routes/blocks.ts` | Use `mapBlock` on both responses |
| `.gitignore` (repo root is `E:\Projects`; this is the project-level one) | Ignore `.playwright-mcp/` |
| `CLAUDE.md`, `AGENTS.md` | Replace the stale "not verified" sections |

**Deleted (Task 8, approved):** `src/TestImport.jsx`, `inspect.mjs`, `inspect2.mjs`

---

### Task 1: Get the project into git

Nothing in `synagogue-seating/` is tracked. There is no history, so nothing in this plan is recoverable until this task is done. Do it first.

The git repository root is `E:\Projects` — a large repo with many unrelated pending changes from other projects. **Only ever stage paths inside `synagogue-seating/`.** Never run `git add -A` or `git add .` from the repository root.

**Files:**
- Modify: `.gitignore` (the one inside `synagogue-seating/`)

- [ ] **Step 1: Confirm you are in the right directory and see the project untracked**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
git status --porcelain .
```

Expected: a single line reporting the whole directory as untracked, like
`?? "Synagogue/\327\236\327\247\327\225\327\236\327\225\327\252 .../synagogue-seating/"`

- [ ] **Step 2: Create a working branch**

The current branch is `main`, the default branch. Do not commit to it directly.

```bash
git checkout -b feat/seating-tests-and-fixes
```

Expected: `Switched to a new branch 'feat/seating-tests-and-fixes'`

- [ ] **Step 3: Add the Playwright artifact directory to .gitignore**

Append these two lines to the end of `synagogue-seating/.gitignore`:

```
# Playwright MCP snapshots
.playwright-mcp
```

- [ ] **Step 4: Stage only this project's subtree**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
git add -- .
git status --short -- . | head -40
```

Expected: a list of `A` (added) entries for `src/`, `backend/src/`, `CLAUDE.md`, `Dockerfile`, etc. Verify that **no** `node_modules`, `dist`, or `.playwright-mcp` paths appear. If any do, stop and fix `.gitignore` before continuing.

- [ ] **Step 5: Commit the baseline**

```bash
git commit -m "chore: track synagogue seating app

Frontend (React 19 + Vite), backend (Express + pg + TypeScript),
schema, and Docker compose setup. No functional changes.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

Expected: a commit summary listing roughly 30 files changed.

---

### Task 2: Frontend test harness

There is no test runner anywhere in this project. This task adds one and proves it works with a throwaway assertion before any real test is written.

**Files:**
- Create: `src/test/setup.js`
- Modify: `vite.config.js`, `package.json`

- [ ] **Step 1: Install the test dependencies with pnpm**

Run from `synagogue-seating/` (the frontend root, not `backend/`):

```bash
pnpm add -D vitest jsdom @testing-library/react @testing-library/dom @testing-library/user-event @testing-library/jest-dom
```

Expected: pnpm reports the packages added to `devDependencies` and updates `pnpm-lock.yaml`.

Note on versions: this project runs Vite 8, which needs a recent Vitest. The command above installs the current release, which is correct. If Vitest reports a Vite peer-version conflict on first run, install the matching major (`pnpm add -D vitest@latest`) rather than downgrading Vite.

- [ ] **Step 2: Create the test setup file**

Create `src/test/setup.js`:

```js
import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// ניקוי ה-DOM בין בדיקות כדי שרכיבים לא ידלפו מבדיקה אחת לשנייה
afterEach(() => {
  cleanup();
});
```

- [ ] **Step 3: Add the test block to the Vite config**

Replace the entire contents of `vite.config.js` with:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
  },
})
```

- [ ] **Step 4: Add the test scripts**

In `package.json`, replace the `"scripts"` block with:

```json
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "oxlint",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 5: Write a throwaway test to prove the harness runs**

Create `src/test/harness.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('test harness', () => {
  it('renders a React component into jsdom', () => {
    render(<p>שלום</p>);
    expect(screen.getByText('שלום')).toBeInTheDocument();
  });
});
```

- [ ] **Step 6: Run it and verify it passes**

```bash
pnpm test
```

Expected: `Test Files  1 passed (1)` and `Tests  1 passed (1)`.

If it fails with a module-resolution error on `@testing-library/jest-dom/vitest`, confirm Step 1 completed and `node_modules/@testing-library/jest-dom` exists.

- [ ] **Step 7: Delete the throwaway test**

This file exists only to prove the harness works. It is a file you created in this task, so removing it is not covered by the no-deletion rule.

```bash
rm src/test/harness.test.jsx
```

- [ ] **Step 8: Commit**

```bash
git add -- package.json pnpm-lock.yaml vite.config.js src/test/setup.js
git commit -m "test: add Vitest + Testing Library harness for the frontend

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 3: Backend test harness

The backend talks to PostgreSQL through a single exported `pool` in `backend/src/db.ts`. Tests mock that module, so no database is needed.

**Files:**
- Create: `backend/vitest.config.ts`
- Modify: `backend/package.json`, `backend/tsconfig.json`

- [ ] **Step 1: Install the backend test dependencies with npm**

Run from `synagogue-seating/backend/`:

```bash
npm install -D vitest supertest @types/supertest
```

Expected: npm reports the packages added and updates `backend/package-lock.json`.

- [ ] **Step 2: Create the backend Vitest config**

Create `backend/vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
```

- [ ] **Step 3: Keep test files out of the build output**

`backend/tsconfig.json` currently compiles everything under `src`, which would emit test files into `dist/`. Replace the whole file with:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": false,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["src/**/*.test.ts"]
}
```

- [ ] **Step 4: Add the test script**

In `backend/package.json`, replace the `"scripts"` block with:

```json
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc -p tsconfig.json && cp src/schema.sql dist/schema.sql",
    "start": "node dist/server.js",
    "db:init": "node dist/init-db.js",
    "db:seed": "node dist/seed.js",
    "test": "vitest run",
    "test:watch": "vitest"
  },
```

- [ ] **Step 5: Write a throwaway test proving the pg mock works**

Create `backend/src/test-harness.test.ts`:

```ts
import { describe, it, expect, vi } from 'vitest';

const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }));

vi.mock('./db.js', () => ({
  pool: { query: mockQuery, connect: vi.fn() },
}));

const { pool } = await import('./db.js');

describe('backend test harness', () => {
  it('serves a mocked pg pool instead of a real database', async () => {
    mockQuery.mockResolvedValueOnce({ rows: [{ ok: true }] });
    const result = await pool.query('SELECT 1');
    expect(result.rows[0]).toEqual({ ok: true });
  });
});
```

- [ ] **Step 6: Run it and verify it passes**

```bash
npm test
```

Expected: `Test Files  1 passed (1)` and `Tests  1 passed (1)`.

- [ ] **Step 7: Verify the production build still works and has no test files in it**

```bash
npm run build
ls dist
```

Expected: `dist/` contains `server.js`, `bootstrap.js`, `db.js`, `types.js`, `schema.sql`, `routes/`, and **no** `*.test.js` files.

- [ ] **Step 8: Delete the throwaway test**

```bash
rm src/test-harness.test.ts
```

- [ ] **Step 9: Commit**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
git add -- backend/package.json backend/package-lock.json backend/vitest.config.ts backend/tsconfig.json
git commit -m "test: add Vitest harness for the backend with a mocked pg pool

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 4: A new seat has no price (₪0 means "not yet priced")

Three places disagree about a new seat's price. The backend's `INSERT` statements already omit `price` and let the column default to 0 — that is now the intended policy, so **the backend routes do not change**. The seed and the frontend move to 0 to match, and the UI learns to say "no price set" in words.

**Files:**
- Create: `src/data/seatLayout.test.js`, `backend/src/bootstrap.test.ts`
- Modify: `src/data/seatLayout.js:16`, `src/App.jsx` (two literals), `backend/src/bootstrap.ts:55`
- Test: both files above

- [ ] **Step 1: Write the failing frontend test**

Create `src/data/seatLayout.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { DEFAULT_PRICE, buildInitialLayout } from './seatLayout';

describe('DEFAULT_PRICE', () => {
  it('is 0, so that a price of zero means "not yet priced"', () => {
    expect(DEFAULT_PRICE).toBe(0);
  });
});

describe('buildInitialLayout', () => {
  it('builds every demo seat with no price set', () => {
    const seats = buildInitialLayout().flatMap((section) =>
      section.blocks.flatMap((block) => block.seats),
    );
    expect(seats.length).toBe(256);
    expect(seats.every((seat) => seat.price === 0)).toBe(true);
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
pnpm test src/data/seatLayout.test.js
```

Expected: FAIL — `expected 1200 to be 0`.

- [ ] **Step 3: Change the frontend default**

In `src/data/seatLayout.js`, line 16, change:

```js
export const DEFAULT_PRICE = 1200;
```

to:

```js
// 0 = טרם נקבע מחיר למקום. הערך הזה חייב להישאר תואם ל-DEFAULT בעמודת price ב-schema.sql
export const DEFAULT_PRICE = 0;
```

- [ ] **Step 4: Run it to verify it passes**

```bash
pnpm test src/data/seatLayout.test.js
```

Expected: PASS, 2 tests.

- [ ] **Step 5: Fix the two hard-coded 1200s in App.jsx**

`src/App.jsx` creates seats in offline mode with a literal `1200`, in two places. Both must become 0, sourced from the shared constant rather than another literal.

First, extend the existing import on line 3 to pull in the constant:

```js
import { buildInitialLayout, DEFAULT_PRICE, STATUS_META } from './data/seatLayout';
```

Then in `handleAddSeat`, inside the `if (offlineMode)` branch, change:

```js
        price: 1200,
```

to:

```js
        price: DEFAULT_PRICE,
```

Then in `handleAddRow`, inside the `if (offlineMode)` branch, change the identical line:

```js
        price: 1200,
```

to:

```js
        price: DEFAULT_PRICE,
```

Verify both are gone:

```bash
grep -n "1200" src/App.jsx
```

Expected: no output.

- [ ] **Step 6: Write the failing backend seed test**

Create `backend/src/bootstrap.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockQuery, mockConnect } = vi.hoisted(() => ({
  mockQuery: vi.fn(),
  mockConnect: vi.fn(),
}));

vi.mock('./db.js', () => ({
  pool: { query: mockQuery, connect: mockConnect },
}));

const { seedDemoData } = await import('./bootstrap.js');

describe('seedDemoData', () => {
  beforeEach(() => {
    mockQuery.mockReset();
    mockConnect.mockReset();
  });

  it('seeds every demo seat with no price', async () => {
    const client = {
      query: vi.fn().mockResolvedValue({ rows: [] }),
      release: vi.fn(),
    };
    mockConnect.mockResolvedValue(client);

    await seedDemoData();

    const seatInserts = client.query.mock.calls.filter(
      ([sql]) => typeof sql === 'string' && sql.includes('INSERT INTO seats'),
    );
    // 6*8 + 6*10 + 6*8 + 5*10 + 5*10 = 256 מקומות
    expect(seatInserts.length).toBe(256);
    // סדר הפרמטרים: id, block_id, row, col, name, status, price
    expect(seatInserts.every(([, params]) => params[6] === 0)).toBe(true);
  });
});
```

- [ ] **Step 7: Run it to verify it fails**

```bash
cd backend && npm test -- src/bootstrap.test.ts
```

Expected: FAIL — the price assertion fails because every insert passes `1200`.

- [ ] **Step 8: Change the backend seed default**

In `backend/src/bootstrap.ts`, line 55, change:

```ts
const DEFAULT_PRICE = 1200;
```

to:

```ts
// 0 = טרם נקבע מחיר. תואם ל-DEFAULT בעמודת price ולקבוע DEFAULT_PRICE בצד הלקוח
const DEFAULT_PRICE = 0;
```

- [ ] **Step 9: Run it to verify it passes**

```bash
cd backend && npm test -- src/bootstrap.test.ts
```

Expected: PASS, 1 test.

- [ ] **Step 10: Write the failing UI wording test**

Create `src/components/SeatDetailsPanel.test.jsx`:

```jsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SeatDetailsPanel from './SeatDetailsPanel';

const baseSeat = {
  id: 's1',
  blockId: 'b1',
  row: 1,
  col: 1,
  posX: null,
  posY: null,
  name: '',
  status: 'available',
  price: 0,
};

const noop = () => {};

function renderPanel(seat, props = {}) {
  return render(
    <SeatDetailsPanel
      seat={seat}
      blockTitle="עזרת גברים · אגף ימין"
      editMode={false}
      onSave={props.onSave ?? (() => Promise.resolve())}
      onClose={noop}
      onDelete={noop}
      onResetPosition={noop}
    />,
  );
}

describe('price hint', () => {
  it('says the price has not been set when it is 0', () => {
    renderPanel(baseSeat);
    expect(screen.getByText('טרם נקבע מחיר')).toBeInTheDocument();
  });

  it('shows the formatted currency once a price is set', () => {
    renderPanel({ ...baseSeat, price: 1200 });
    expect(screen.queryByText('טרם נקבע מחיר')).not.toBeInTheDocument();
    expect(screen.getByText(/1,200/)).toBeInTheDocument();
  });
});
```

- [ ] **Step 11: Run it to verify it fails**

```bash
pnpm test src/components/SeatDetailsPanel.test.jsx
```

Expected: FAIL on the first test — the panel currently renders `0 ₪`, so `טרם נקבע מחיר` is not found.

- [ ] **Step 12: Make the panel say it in words**

In `src/components/SeatDetailsPanel.jsx`, replace the `field-hint` span (lines 87-89):

```jsx
          <span className="field-hint" dir="ltr">
            {currencyFormatter.format(Number(price) || 0)}
          </span>
```

with:

```jsx
          {/* dir="auto" - סכום מעוצב מיושר לשמאל, הודעה בעברית מיושרת לימין */}
          <span className="field-hint" dir="auto">
            {Number(price) > 0 ? currencyFormatter.format(Number(price)) : 'טרם נקבע מחיר'}
          </span>
```

- [ ] **Step 13: Run it to verify it passes**

```bash
pnpm test src/components/SeatDetailsPanel.test.jsx
```

Expected: PASS, 2 tests.

- [ ] **Step 14: Run everything and commit**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
pnpm test && pnpm run lint && pnpm run build
cd backend && npm test && npm run build
```

Expected: all green.

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
git add -- src/data/seatLayout.js src/data/seatLayout.test.js src/App.jsx \
  src/components/SeatDetailsPanel.jsx src/components/SeatDetailsPanel.test.jsx \
  backend/src/bootstrap.ts backend/src/bootstrap.test.ts
git commit -m "fix: a new seat has no price instead of an inconsistent default

The API left price to the SQL default of 0 while the seed and the
frontend's offline mode both used 1200, so the same action produced
different prices depending on whether the server was reachable.

0 now means 'not yet priced' everywhere, and the details panel says so
in words instead of showing '0 ₪'.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 5: Pessimistic saving in the details panel

Today the panel fires `onSave` and forgets about it; `App.jsx` applies the change locally and swallows errors. After this task the form disables itself while saving, commits only on success, and on failure restores the last server-confirmed values and shows the error.

This changes the `onSave` contract: **it must now return a Promise** that rejects on failure. Task 5 changes both sides together.

**Files:**
- Modify: `src/components/SeatDetailsPanel.jsx`, `src/App.jsx`, `src/App.css`
- Test: `src/components/SeatDetailsPanel.test.jsx`

- [ ] **Step 1: Write the failing tests**

Append to `src/components/SeatDetailsPanel.test.jsx` (the file already has `renderPanel` and `baseSeat` from Task 4). Add `vi` and the extra imports at the top by replacing the first two import lines with:

```jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
```

Then append these tests to the end of the file:

```jsx
describe('pessimistic saving', () => {
  it('disables the form while saving and keeps the typed value on success', async () => {
    const user = userEvent.setup();
    let resolveSave;
    const onSave = vi.fn(() => new Promise((resolve) => { resolveSave = resolve; }));
    renderPanel(baseSeat, { onSave });

    const nameInput = screen.getByLabelText('שם');
    await user.type(nameInput, 'כהן יעקב');
    await user.click(screen.getByRole('button', { name: 'שמירה' }));

    expect(nameInput).toBeDisabled();
    expect(screen.getByRole('button', { name: 'שומר…' })).toBeDisabled();

    resolveSave();
    await waitFor(() => expect(nameInput).toBeEnabled());
    expect(nameInput).toHaveValue('כהן יעקב');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('restores the last server value and shows the error when the save fails', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn(() => Promise.reject(new Error('שגיאת שרת (500)')));
    renderPanel({ ...baseSeat, name: 'לוי משה' }, { onSave });

    const nameInput = screen.getByLabelText('שם');
    await user.clear(nameInput);
    await user.type(nameInput, 'מזרחי דוד');
    await user.click(screen.getByRole('button', { name: 'שמירה' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('שגיאת שרת (500)'),
    );
    expect(nameInput).toHaveValue('לוי משה');
    expect(nameInput).toBeEnabled();
  });
});
```

- [ ] **Step 2: Run them to verify they fail**

```bash
pnpm test src/components/SeatDetailsPanel.test.jsx
```

Expected: both new tests FAIL — the input is never disabled, there is no `שומר…` button, and no element with `role="alert"`.

- [ ] **Step 3: Rewrite the panel's state and submit handler**

In `src/components/SeatDetailsPanel.jsx`, replace the state declarations and the effect (lines 11-21) with:

```jsx
  const [name, setName] = useState('');
  const [status, setStatus] = useState(STATUS.AVAILABLE);
  const [price, setPrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  useEffect(() => {
    if (seat) {
      setName(seat.name || '');
      setStatus(seat.status);
      setPrice(seat.price ?? 0);
      setSaving(false);
      setSaveError(null);
    }
  }, [seat]);
```

Then replace the whole `handleSubmit` function (lines 31-38) with:

```jsx
  // שמירה פסימית: הטופס ננעל עד שהשרת מאשר. אם השמירה נכשלת חוזרים
  // לערכים האחרונים שהשרת אישר, כדי שהמסך לעולם לא יציג מידע שלא נשמר.
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    try {
      await onSave(seat.id, {
        name: name.trim(),
        status,
        price: Number(price) || 0,
      });
    } catch (err) {
      setName(seat.name || '');
      setStatus(seat.status);
      setPrice(seat.price ?? 0);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };
```

Note this also removes the pointless `status === STATUS.ASSIGNED ? name.trim() : name.trim()` ternary, whose branches were identical.

- [ ] **Step 4: Disable the inputs and add the error message**

Still in `src/components/SeatDetailsPanel.jsx`, add `disabled={saving}` to the three form controls.

The name input becomes:

```jsx
          <input
            type="text"
            dir="auto"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="שם המחזיק במקום"
            disabled={saving}
          />
```

The status select becomes:

```jsx
          <select value={status} onChange={(e) => setStatus(e.target.value)} disabled={saving}>
```

The price input becomes:

```jsx
            <input
              type="number"
              dir="ltr"
              min={0}
              step={50}
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              disabled={saving}
            />
```

Then replace the actions block (lines 92-96) with:

```jsx
        {saveError && (
          <p className="field-error" role="alert">
            {saveError}
          </p>
        )}

        <div className="seat-panel-actions">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'שומר…' : 'שמירה'}
          </button>
        </div>
```

- [ ] **Step 5: Make App.jsx return a promise from handleSave**

In `src/App.jsx`, replace `handleSave` with:

```jsx
  // מחזיר Promise כדי שפאנל הפרטים יוכל לנעול את הטופס עד לאישור מהשרת.
  // במצב מקוון מעדכנים את ה-state רק מהתשובה של השרת - היא המקור האמין.
  const handleSave = (seatId, updates) => {
    if (offlineMode) {
      setLayout((prev) => updateSeatInLayout(prev, seatId, updates));
      return Promise.resolve();
    }
    return api.updateSeat(seatId, updates).then((saved) => {
      setLayout((prev) => updateSeatInLayout(prev, seatId, saved));
    });
  };
```

- [ ] **Step 6: Add the error style**

Append to `src/App.css`:

```css
.field-error {
  margin-block: 0.5rem 0;
  padding-block: 0.5rem;
  padding-inline: 0.75rem;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.875rem;
}
```

- [ ] **Step 7: Run the tests to verify they pass**

```bash
pnpm test src/components/SeatDetailsPanel.test.jsx
```

Expected: PASS, 4 tests.

- [ ] **Step 8: Commit**

```bash
git add -- src/components/SeatDetailsPanel.jsx src/components/SeatDetailsPanel.test.jsx src/App.jsx src/App.css
git commit -m "fix: lock the seat form until the server confirms the save

The panel fired onSave and forgot about it while App applied the change
locally and swallowed errors, so a failed save was indistinguishable
from a successful one. The form now disables while saving, commits from
the server's response, and restores the previous values with an inline
error if the request fails.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 6: Surface failures for drag, add, delete and clear block

These four mutations have no form field to disable, so they get the same guarantee in a different shape: delete and clear-block wait for the server before removing anything, add-seat already waits and just needs its error shown, and drag stays optimistic but snaps back on failure. All four report failures through one banner.

**Files:**
- Modify: `src/App.jsx`, `src/App.css`
- Test: `src/App.test.jsx`

- [ ] **Step 1: Write the failing test**

Create `src/App.test.jsx`:

```jsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

vi.mock('./api', () => ({
  fetchLayout: vi.fn(),
  updateSeat: vi.fn(),
  createSeat: vi.fn(),
  deleteSeat: vi.fn(),
  addRow: vi.fn(),
  clearBlockSeats: vi.fn(),
}));

import * as api from './api';
import App from './App';

const layout = {
  sections: [
    {
      id: 'men',
      title: 'עזרת גברים',
      sortOrder: 0,
      blocks: [
        {
          id: 'b1',
          sectionId: 'men',
          title: 'אגף ימין',
          sortOrder: 0,
          seats: [
            {
              id: 's1',
              blockId: 'b1',
              row: 1,
              col: 1,
              posX: null,
              posY: null,
              name: 'לוי משה',
              status: 'assigned',
              price: 0,
            },
          ],
        },
      ],
    },
  ],
};

describe('failed delete', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.fetchLayout.mockResolvedValue(structuredClone(layout));
  });

  it('keeps the seat on the map and reports the failure', async () => {
    const user = userEvent.setup();
    api.deleteSeat.mockRejectedValue(new Error('שגיאת שרת (500)'));

    const { container } = render(<App />);
    await screen.findByText('עזרת גברים');

    // בוחרים את המקום לפני הכניסה למצב עריכה: מחוץ למצב עריכה
    // handleSeatPointerDown קורא ל-onSeatClick ישירות, בלי setPointerCapture
    // (ש-jsdom לא מממש על אלמנטי SVG).
    const seatRect = container.querySelector('rect.seatmap-seat');
    expect(seatRect).not.toBeNull();
    fireEvent.pointerDown(seatRect);

    // כניסה למצב עריכה כדי שכפתור המחיקה יופיע בפאנל (הבחירה נשמרת)
    await user.click(screen.getByRole('button', { name: /ערוך מפה/ }));
    await user.click(screen.getByRole('button', { name: 'מחיקת מקום זה' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent('מחיקת המקום נכשלה'),
    );
    // המקום עדיין על המפה
    expect(container.querySelectorAll('rect.seatmap-seat')).toHaveLength(1);
  });
});
```

Two notes on why the test is shaped this way, so you do not "simplify" it into a broken state:

- **Do not use `getByTitle` to find a seat.** Testing Library's selector for SVG titles is `svg > title`, and in `SeatMap.jsx` the `<title>` is a child of the `<rect>`, not of the `<svg>`. It will never match. Query the rect by class instead.
- **Do not click the seat with `userEvent` while in edit mode.** In edit mode `handleSeatPointerDown` calls `e.target.setPointerCapture(...)`, which jsdom does not implement on SVG elements, and the test will throw. Selecting before entering edit mode avoids that path entirely.

- [ ] **Step 2: Run it to verify it fails**

```bash
pnpm test src/App.test.jsx
```

Expected: FAIL — the seat is removed optimistically before the server answers, so no element with `role="alert"` is ever rendered and the seat count is 0 instead of 1.

- [ ] **Step 3: Add the action-error state and a seat lookup helper**

In `src/App.jsx`, add this helper next to `updateSeatInLayout` (after line 27):

```jsx
function findSeat(layout, seatId) {
  for (const section of layout ?? []) {
    for (const block of section.blocks) {
      const seat = block.seats.find((s) => s.id === seatId);
      if (seat) return seat;
    }
  }
  return null;
}
```

Then add the state next to the other `useState` calls:

```jsx
  const [actionError, setActionError] = useState(null);
```

- [ ] **Step 4: Make delete and clear-block pessimistic**

Replace `handleDeleteSeat` with:

```jsx
  const handleDeleteSeat = (seatId) => {
    const removeLocally = () => {
      setLayout((prev) =>
        prev.map((section) => ({
          ...section,
          blocks: section.blocks.map((block) => ({
            ...block,
            seats: block.seats.filter((s) => s.id !== seatId),
          })),
        })),
      );
      setSelectedSeatId(null);
    };

    if (offlineMode) {
      removeLocally();
      return;
    }
    setActionError(null);
    api
      .deleteSeat(seatId)
      .then(removeLocally)
      .catch((err) => setActionError(`מחיקת המקום נכשלה: ${err.message}`));
  };
```

Replace the body of `handleClearBlock` after the `confirm` check with:

```jsx
    const clearLocally = () => {
      setLayout((prev) =>
        prev.map((section) => ({
          ...section,
          blocks: section.blocks.map((b) => (b.id === blockId ? { ...b, seats: [] } : b)),
        })),
      );
      setSelectedSeatId(null);
    };

    if (offlineMode) {
      clearLocally();
      return;
    }
    setActionError(null);
    api
      .clearBlockSeats(blockId)
      .then(clearLocally)
      .catch((err) => setActionError(`ניקוי הבלוק נכשל: ${err.message}`));
```

- [ ] **Step 5: Make drag revert on failure**

Replace `handleSeatMove` with:

```jsx
  // הגרירה נשארת אופטימית - מקום שלא עוקב אחרי הסמן אינו שמיש.
  // אם השמירה נכשלת המקום קופץ חזרה למיקום הקודם והמשתמש מקבל הודעה.
  const handleSeatMove = (seatId, posX, posY) => {
    const previous = findSeat(layout, seatId);
    setLayout((prev) => updateSeatInLayout(prev, seatId, { posX, posY }));
    if (offlineMode) return;
    setActionError(null);
    api.updateSeat(seatId, { posX, posY }).catch((err) => {
      setLayout((prev) =>
        updateSeatInLayout(prev, seatId, {
          posX: previous?.posX ?? null,
          posY: previous?.posY ?? null,
        }),
      );
      setActionError(`הזזת המקום לא נשמרה: ${err.message}`);
    });
  };
```

- [ ] **Step 6: Surface the add-seat and add-row failures**

In `handleAddSeat`, replace the final `.catch` line:

```jsx
      .catch((err) => console.error('הוספת מקום נכשלה:', err));
```

with:

```jsx
      .catch((err) => setActionError(`הוספת מקום נכשלה: ${err.message}`));
```

In `handleAddRow`, replace the final `.catch` line:

```jsx
      .catch((err) => console.error('הוספת שורה נכשלה:', err));
```

with:

```jsx
      .catch((err) => setActionError(`הוספת שורה נכשלה: ${err.message}`));
```

In `handleResetPosition`, replace:

```jsx
      api.updateSeat(seatId, { posX: null, posY: null }).catch((err) => console.error(err));
```

with:

```jsx
      api
        .updateSeat(seatId, { posX: null, posY: null })
        .catch((err) => setActionError(`איפוס המיקום נכשל: ${err.message}`));
```

- [ ] **Step 7: Render the banner**

In `src/App.jsx`, immediately after the closing `)}` of the `{offlineMode && (...)}` block, add:

```jsx
      {actionError && (
        <div className="action-error-banner" role="alert">
          {actionError}
          <button type="button" onClick={() => setActionError(null)}>
            סגירה
          </button>
        </div>
      )}
```

- [ ] **Step 8: Add the banner style**

Append to `src/App.css`:

```css
.action-error-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-block-end: 0.75rem;
  padding-block: 0.625rem;
  padding-inline: 1rem;
  border-radius: 6px;
  background: #fee2e2;
  color: #991b1b;
  font-size: 0.9rem;
}
```

- [ ] **Step 9: Run the test to verify it passes**

```bash
pnpm test src/App.test.jsx
```

Expected: PASS, 1 test.

- [ ] **Step 10: Run the whole frontend suite and commit**

```bash
pnpm test && pnpm run lint && pnpm run build
```

Expected: all green, 7 frontend tests passing.

```bash
git add -- src/App.jsx src/App.test.jsx src/App.css
git commit -m "fix: report drag, add, delete and clear-block failures to the user

Delete and clear-block now wait for the server before removing anything,
drag snaps back if the save fails, and every failure reaches a banner
instead of only console.error.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 7: Return camelCase from the block routes

`seats.ts` maps rows through `mapSeat`; `blocks.ts` returns raw rows with `section_id` and `sort_order`. Fix the shape now, before any UI depends on it.

**Files:**
- Create: `backend/src/routes/blocks.test.ts`
- Modify: `backend/src/types.ts`, `backend/src/routes/blocks.ts`

- [ ] **Step 1: Write the failing test**

Create `backend/src/routes/blocks.test.ts`:

```ts
import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';

const { mockQuery } = vi.hoisted(() => ({ mockQuery: vi.fn() }));

vi.mock('../db.js', () => ({
  pool: { query: mockQuery, connect: vi.fn() },
}));

const { blocksRouter } = await import('./blocks.js');

const app = express();
app.use(express.json());
app.use('/api', blocksRouter);

describe('PATCH /api/blocks/:id', () => {
  beforeEach(() => mockQuery.mockReset());

  it('returns the block in camelCase, like the seat routes do', async () => {
    mockQuery.mockResolvedValueOnce({
      rows: [{ id: 'm-right', section_id: 'men', title: 'אגף ימין', sort_order: 0 }],
    });

    const res = await request(app).patch('/api/blocks/m-right').send({ title: 'אגף ימין' });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: 'm-right',
      sectionId: 'men',
      title: 'אגף ימין',
      sortOrder: 0,
    });
  });

  it('rejects an empty title', async () => {
    const res = await request(app).patch('/api/blocks/m-right').send({ title: '   ' });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe('כותרת לא תקינה');
  });
});

describe('POST /api/sections/:sectionId/blocks', () => {
  beforeEach(() => mockQuery.mockReset());

  it('returns the new block in camelCase with an empty seat list', async () => {
    mockQuery
      .mockResolvedValueOnce({ rows: [{ count: '2' }] })
      .mockResolvedValueOnce({
        rows: [{ id: 'm-new', section_id: 'men', title: 'אגף חדש', sort_order: 2 }],
      });

    const res = await request(app)
      .post('/api/sections/men/blocks')
      .send({ id: 'm-new', title: 'אגף חדש' });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({
      id: 'm-new',
      sectionId: 'men',
      title: 'אגף חדש',
      sortOrder: 2,
      seats: [],
    });
  });
});
```

- [ ] **Step 2: Run it to verify it fails**

```bash
cd backend && npm test -- src/routes/blocks.test.ts
```

Expected: FAIL on the two camelCase tests — the body comes back as `{ id, section_id, title, sort_order }`. The empty-title test passes already; that is fine, it guards existing behavior.

- [ ] **Step 3: Add mapBlock to types.ts**

Append to `backend/src/types.ts`:

```ts
export type BlockSummary = Omit<Block, 'seats'>;

export function mapBlock(row: BlockRow): BlockSummary {
  return {
    id: row.id,
    sectionId: row.section_id,
    title: row.title,
    sortOrder: row.sort_order,
  };
}
```

- [ ] **Step 4: Use it in both block responses**

In `backend/src/routes/blocks.ts`, change the import on line 3 from:

```ts
import type { BlockRow } from '../types.js';
```

to:

```ts
import { mapBlock, type BlockRow } from '../types.js';
```

In the `PATCH /blocks/:id` handler, change:

```ts
    res.json(result.rows[0]);
```

to:

```ts
    res.json(mapBlock(result.rows[0]));
```

In the `POST /sections/:sectionId/blocks` handler, change:

```ts
    res.status(201).json({ ...result.rows[0], seats: [] });
```

to:

```ts
    res.status(201).json({ ...mapBlock(result.rows[0]), seats: [] });
```

- [ ] **Step 5: Run it to verify it passes**

```bash
cd backend && npm test -- src/routes/blocks.test.ts
```

Expected: PASS, 3 tests.

- [ ] **Step 6: Type-check, build and commit**

```bash
cd backend && npx tsc -p tsconfig.json --noEmit && npm test && npm run build
```

Expected: all green, 4 backend tests passing.

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
git add -- backend/src/types.ts backend/src/routes/blocks.ts backend/src/routes/blocks.test.ts
git commit -m "fix: return camelCase from the block routes

blocks.ts returned raw snake_case rows while seats.ts mapped to
camelCase, which would have broken the UI as soon as block editing
was wired up.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 8: Remove the dead seatmap-canvas files

Three files import `@alisaitteke/seatmap-canvas`, a library that was evaluated, rejected, and removed from `package.json`. None is reachable from `src/main.jsx`, so the build ignores them, but they mislead anyone reading the codebase.

**Deletion of exactly these three files was approved by the user on 2026-10-04.** Do not delete anything else. They are recoverable from the Task 1 commit.

**Files:**
- Delete: `src/TestImport.jsx`, `inspect.mjs`, `inspect2.mjs`

- [ ] **Step 1: Confirm nothing imports them**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
grep -rn "TestImport\|inspect2\?\.mjs\|seatmap-canvas" src/ index.html package.json vite.config.js
```

Expected: matches **only** inside the three files themselves (`src/TestImport.jsx`). If any other file references them, stop and report it rather than deleting.

- [ ] **Step 2: Confirm they are committed and therefore recoverable**

```bash
git log --oneline -1 -- src/TestImport.jsx inspect.mjs inspect2.mjs
```

Expected: the Task 1 baseline commit. If this prints nothing, Task 1 did not include them — stop and investigate.

- [ ] **Step 3: Delete them**

```bash
git rm src/TestImport.jsx inspect.mjs inspect2.mjs
```

Expected: `rm 'Synagogue/.../src/TestImport.jsx'` and two more lines.

- [ ] **Step 4: Verify the build and tests are unaffected**

```bash
pnpm run build && pnpm test && pnpm run lint
```

Expected: all green. The bundle size should be unchanged from Task 6, since these files were never bundled.

- [ ] **Step 5: Commit**

```bash
git commit -m "chore: remove dead seatmap-canvas files

TestImport.jsx, inspect.mjs and inspect2.mjs all import
@alisaitteke/seatmap-canvas, which was rejected during evaluation and
is no longer a dependency. None was reachable from main.jsx.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

### Task 9: Refresh the stale documentation

`CLAUDE.md` and `AGENTS.md` both claim Postgres, Docker and browser behavior were never tested, because Claude's environment supposedly lacked Docker. That environment does have Docker, and all three were verified on 2026-10-04. Both files also need to mention the new test suites.

**Files:**
- Modify: `CLAUDE.md`, `AGENTS.md`

- [ ] **Step 1: Replace the verification section in CLAUDE.md**

Replace the entire `## מה אומת ומה לא` section with:

```markdown
## מה אומת ומה לא
אומת ב-2026-10-04 מול הסביבה האמיתית (Docker 29.8.1 זמין במכונה):
- `docker compose up --build` — שלושת ה-images נבנים, שלושת הקונטיינרים עולים, ה-DB מדווח healthy.
- מול PostgreSQL 16 אמיתי: `GET /api/layout` מחזיר 2 אזורים / 5 בלוקים / 256 מקומות.
- עברית עוברת הלוך-חזור דרך ה-DB ללא שיבוש.
- בדפדפן: המפה נטענת, לחיצה על מקום פותחת את פאנל הפרטים, 0 שגיאות ו-0 אזהרות בקונסול.
- nginx מגיש SPA fallback (`/some/deep/route` → 200).
- ולידציה: 400 על סטאטוס לא תקין, 404 על מקום לא קיים, שתיהן עם הודעה בעברית.
- `vitest run` — 7 בדיקות frontend, 4 בדיקות backend. `tsc --noEmit`, `vite build` ו-oxlint נקיים.

**לא אומת:** מסלול ההזרעה על DB ריק (`seedIfEmpty`). ה-volume `synagogue-seating_db-data`
כבר מכיל נתונים, ולכן הבדיקה דורשת `docker compose down -v` שמוחק אותו — לא בוצע.

## בדיקות
- Frontend: `pnpm test` (Vitest + Testing Library, סביבת jsdom).
- Backend: `cd backend && npm test` (Vitest, ה-pool של `pg` ממוק — אין צורך ב-DB).
- שים לב: ה-frontend מנוהל ב-pnpm וה-backend ב-npm. אל תחליף ביניהם.
```

- [ ] **Step 2: Replace the matching section in AGENTS.md**

Replace the `## מה לא נבדק` section (lines 42-43) with:

```markdown
## מה נבדק
אומת ב-2026-10-04: `docker compose up --build`, PostgreSQL אמיתי (256 מקומות דרך `/api/layout`),
והתנהגות בדפדפן (טעינת המפה, בחירת מקום, 0 שגיאות קונסול).
לא נבדק: מסלול ההזרעה על DB ריק — דורש מחיקת ה-volume.

## בדיקות
`pnpm test` ב-frontend, `npm test` ב-`backend/`. ה-frontend ב-pnpm וה-backend ב-npm — אל תחליף.
```

- [ ] **Step 3: Update the history line in both files**

In `CLAUDE.md`, append to the `## החלטות והיסטוריה` list:

```markdown
5. נוספו בדיקות (Vitest בשני הצדדים), ותוקנו שלושה באגים: מחיר ברירת מחדל לא עקבי (0 = טרם נקבע מחיר), שמירות שנכשלו בשקט (שמירה פסימית + באנר שגיאה), ו-`blocks.ts` שהחזיר snake_case.
```

In `AGENTS.md`, append to the history line at the end:

```markdown
→ בדיקות Vitest + תיקון מחיר ברירת מחדל, שמירה פסימית, ו-camelCase ב-blocks.
```

- [ ] **Step 4: Verify no stale claims remain**

```bash
grep -n "לא נבדק" CLAUDE.md AGENTS.md
```

Expected: only the two lines about the empty-DB seeding path. Any claim that Docker or Postgres is untested is now wrong and must be removed.

- [ ] **Step 5: Commit**

```bash
git add -- CLAUDE.md AGENTS.md
git commit -m "docs: record what was verified and document the test suites

Both files claimed Docker, Postgres and browser behavior were untested
because the dev environment lacked Docker. It does not, and all three
were verified on 2026-10-04.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>"
```

---

## Final verification

Run everything from a clean state before calling this done.

- [ ] **Step 1: Full frontend check**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
pnpm test && pnpm run lint && pnpm run build
```

Expected: 7 tests passing, oxlint silent with exit 0, `vite build` succeeds.

- [ ] **Step 2: Full backend check**

```bash
cd backend && npm test && npx tsc -p tsconfig.json --noEmit && npm run build
```

Expected: 4 tests passing, no type errors, `dist/` built with no `*.test.js` inside.

- [ ] **Step 3: End-to-end check against the real stack**

```bash
cd "E:/Projects/Synagogue/מקומות ישיבה בבית כנסת/synagogue-seating"
docker compose up --build -d
curl -s http://localhost:4000/api/health
```

Expected: `{"ok":true}`.

Then create a seat and confirm it comes back unpriced:

```bash
curl -s -X POST http://localhost:4000/api/blocks/m-right/seats \
  -H 'Content-Type: application/json' \
  -d '{"row":0,"col":99,"posX":120,"posY":80}'
```

Expected: `201` with `"price":0`.

Clean up the seat you just created — substitute the `id` from the response above:

```bash
curl -s -o /dev/null -w "%{http_code}\n" -X DELETE http://localhost:4000/api/seats/<THE_ID_FROM_ABOVE>
```

Expected: `204`.

- [ ] **Step 4: Stop the stack, keeping the data volume**

```bash
docker compose down
```

Do **not** add `-v`. That flag deletes `synagogue-seating_db-data` and the user has not approved destroying it.

- [ ] **Step 5: Confirm the branch is clean**

```bash
git status --short -- .
git log --oneline feat/seating-tests-and-fixes -8
```

Expected: no uncommitted changes inside the project, and eight commits from this plan.
