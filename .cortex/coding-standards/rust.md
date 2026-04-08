# Rust Coding Standards

> **Core belief #13:** Follow type-driven development. The type system is the first line of
> defence. If an invalid state can be represented by the type, it will eventually be
> constructed. Design types so illegal states are unrepresentable.

## Principle: Make illegal states unrepresentable

Every design decision should reduce the set of values a type can hold to exactly the set of
valid values — no more. When invalid states are impossible to construct, entire classes of
bugs cease to exist.

---

## Rule: `enum` over stringly-typed values

When a field takes a finite set of values, represent it as an `enum`, not a `String`.
`String` is for genuinely dynamic, unbounded data (user text, email bodies, URLs).

```rust
// wrong — typos compile, exhaustiveness is not checked
fn handle(category: &str) { ... }

// correct — compiler enforces all variants, typos are a compile error
enum Category { Noise, Info, Critical }
fn handle(category: Category) { ... }
```

When you see `match category { "noise" => ... }` anywhere in the codebase, that field
should be an `enum`.

---

## Rule: `Option<T>` over sentinel values

Never use special values (`-1`, `0`, `""`, `"none"`, `false`) to mean "absent". Use
`Option<T>` — the compiler then forces callers to handle the absent case.

```rust
// wrong — callers must remember the convention
fn oldest_page_token() -> String { /* "" means none */ }

// correct — the type communicates the contract
fn oldest_page_token() -> Option<String> { ... }
```

---

## Rule: No `unwrap()` / `expect()` outside tests

`unwrap()` and `expect()` are panics waiting to happen. In production code they turn
programming errors into crashes with no recovery path. Use `?` to propagate errors, or
handle them explicitly with `match` / `map_err`.

```rust
// wrong — panics if the store lookup fails
let db = self.rexie.store("items").unwrap();

// correct — propagates the error to the caller
let db = self.rexie.store("items")?;
```

**Permitted locations for `unwrap()` / `expect()`:**
- Inside `#[test]` / `#[cfg(test)]` blocks.
- `main()` of CLI tools where a panic is acceptable startup-failure behaviour.

`unreachable!()` is permitted only when the compiler cannot prove exhaustiveness and the
branch is genuinely impossible — document why with a comment.

---

## Rule: Newtype wrappers for domain identifiers

When multiple `String` or `u64` values exist with distinct semantics, wrap them in
newtypes. This prevents accidentally passing a `SourceId` where a `MessageId` is expected.

```rust
// wrong — easy to mix up
fn get_item(source_id: String, message_id: String) { ... }

// correct — compiler rejects transposed arguments
struct SourceId(pub String);
struct MessageId(pub String);
fn get_item(source_id: SourceId, message_id: MessageId) { ... }
```

Apply this rule whenever a function accepts two or more values of the same primitive type
with different semantic roles.

---

## Rule: Narrower integer types where zero (or negative) is invalid

Prefer `NonZeroU32`, `NonZeroUsize`, etc. when zero is not a valid value. This moves
validation from runtime to the type level.

```rust
// wrong — caller must check page_size != 0 manually
fn paginate(page_size: usize) { ... }

// correct — zero is a compile-/construction-time error
use std::num::NonZeroUsize;
fn paginate(page_size: NonZeroUsize) { ... }
```

---

## Rule: Discriminated state via `enum`, not parallel `Option`s

When a struct has two or more mutually exclusive optional fields, replace them with an
`enum` variant per state.

```rust
// wrong — four combinations, three are invalid
struct Job {
    result: Option<JobResult>,
    error: Option<String>,
}

// correct — only valid combinations exist
enum Job {
    Pending,
    Running { started_at: u64 },
    Done(JobResult),
    Failed(String),
}
```

---

## Rule: Prefer borrowing in function signatures

Accept `&str` over `&String`, `&[T]` over `&Vec<T>`. Return owned types from constructors
and builders; borrow everywhere else. This keeps APIs maximally flexible for callers.

```rust
// wrong — forces callers to own a String
fn parse_source(s: &String) -> SourceId { ... }

// correct — accepts string slices from any source
fn parse_source(s: &str) -> SourceId { ... }
```

---

## Rule: `CoreError` is the single error type

All functions that can fail return `Result<T, CoreError>`. Never introduce a second error
type inside `me-ai-core`. Define new variants on `CoreError` as needed.

```rust
// wrong — leaks implementation details
fn load() -> Result<Data, rexie::Error> { ... }

// correct — errors are normalised at the module boundary
fn load() -> Result<Data, CoreError> { ... }
```

---

## Clippy enforcement

The following Clippy lints are enabled in CI and must pass clean:

| Lint | What it catches |
|------|----------------|
| `clippy::unwrap_used` | `unwrap()` calls in non-test code |
| `clippy::expect_used` | `expect()` calls in non-test code |
| `clippy::str_to_string` | Unnecessary `&String` params |
| `clippy::pedantic` (selected) | Various type-level improvements |

Run `task lint` to check locally before pushing.
