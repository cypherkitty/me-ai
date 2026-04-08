# TypeScript Coding Standards

> **Core belief #12:** `null` is strictly prohibited in `me-ai-web`. Use `undefined` for
> absence. This is not a stylistic preference — it is an invariant.

## Rule: No `null`

`null` must never appear in application TypeScript or Svelte code. This means:

- No `null` in variable declarations, state, props, or return types.
- No `null` in type annotations (`string | null` → `string | undefined`).
- No `null` literal in expressions, assignments, or comparisons.
- No `as null` casts.
- No `!= null` / `== null` guards (use `!== undefined` / `=== undefined`).

### Why `undefined` over `null`

TypeScript uses `undefined` natively for optional values (`T?` is `T | undefined`). `null`
is a distinct second "nothing" value that TypeScript inherited from JavaScript. Having two
ways to express absence doubles the surface area for bugs (`=== null` vs `=== undefined`
vs `== null`). A single convention — `undefined` everywhere — eliminates that class of
mistake entirely.

### The WASM boundary exception

WASM (the `me-ai-core` package) may return JavaScript `null` for absent optional fields
because Rust `Option<T>` serialises to `null` at the JS boundary. This is the **only**
permitted source of `null` in the codebase.

**Rule:** Convert `null` to `undefined` immediately at the call site — never let it
propagate into application code.

```typescript
// correct — convert at the boundary
const token = await getCore().getGoogleToken() ?? undefined;

// wrong — null propagates inward
const token = await getCore().getGoogleToken();  // type includes null
```

Use `?? undefined` for simple cases. For objects, use a narrow helper:

```typescript
function nullToUndefined<T>(v: T | null): T | undefined {
  return v ?? undefined;
}
```

### Representing absence

| Situation | Use |
|-----------|-----|
| Optional function parameter | `param?: T` |
| Optional object field | `field?: T` |
| Value that may be missing | `T \| undefined` |
| Explicit two-state result | Discriminated union (see below) |
| Error or absence | `T \| undefined` from a throwing function, or a Result-style union |

### Discriminated unions instead of nullable flags

When a value can be in one of several meaningful states, model it explicitly:

```typescript
// wrong — two nullables with implicit coupling
interface Sync {
  state: SyncState | null;
  error: string | null;
}

// correct — explicit states, illegal combos are impossible
type SyncStatus =
  | { phase: "idle" }
  | { phase: "syncing"; progress: number }
  | { phase: "done"; state: SyncState }
  | { phase: "error"; message: string };
```

### `$state()` in Svelte

Never initialise reactive state with `null`:

```typescript
// wrong
let token = $state<GoogleToken | null>(null);

// correct
let token = $state<GoogleToken | undefined>(undefined);
```

### Default values with `??`

Use `??` (nullish coalescing), not `||` (falsy coalescing), for defaults. `||` silently
swallows `0`, `""`, and `false`, masking real values.

```typescript
// wrong — 0 and "" are silently replaced
const limit = options.limit || 50;

// correct — only undefined/null triggers the default (null won't appear, but ?? is safe)
const limit = options.limit ?? 50;
```

### Linting enforcement

The no-null rule is enforced by `@typescript-eslint/no-restricted-syntax` targeting null
literals and `null` in type positions. Any PR that introduces `null` must update the ESLint
config to add an explicit exception with a justification comment — the WASM boundary
wrapper functions are the only accepted exceptions.
