# syntax=docker/dockerfile:1
# ============================================================
# Multi-stage Dockerfile for me-ai (Rust WASM core + Vite web)
# Rust deps: cargo-chef (cached layer when Cargo.toml unchanged) + BuildKit
# cache mounts on wasm-pack / cargo test for registry + incremental artifacts.
# ============================================================
# RUST_VERSION defaults to `bookworm` → rust:bookworm (latest stable Rust on Debian bookworm).
# Override to pin, e.g. --build-arg RUST_VERSION=1.85.0-bookworm
# ============================================================

ARG RUST_VERSION=bookworm

# --- cargo-chef: dependency recipe (stub lib.rs — invalidates only when Cargo.toml changes) ---
FROM rust:${RUST_VERSION} AS chef-planner
RUN cargo install cargo-chef --locked
WORKDIR /build/me-ai-core
COPY me-ai-core/Cargo.toml .
RUN mkdir -p src && \
    printf '%s\n' '// cargo-chef stub; real sources are copied in wasm-builder' > src/lib.rs && \
    printf '%s\n' 'pub fn _chef_dependency_stub() {}' >> src/lib.rs
RUN cargo chef prepare --recipe-path recipe.json

# --- cargo-chef: compile all third-party crates for wasm32 (heavy layer; reuse until recipe changes) ---
FROM rust:${RUST_VERSION} AS chef-cacher
RUN rustup target add wasm32-unknown-unknown \
    && cargo install cargo-chef --locked
WORKDIR /build/me-ai-core
COPY --from=chef-planner /build/me-ai-core/recipe.json recipe.json
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    cargo chef cook --release --target wasm32-unknown-unknown --recipe-path recipe.json

# --- WASM pkg: reuse chef target/ + BuildKit caches for incremental me-ai-core compile ---
FROM rust:${RUST_VERSION} AS wasm-builder
RUN rustup target add wasm32-unknown-unknown \
    && cargo install wasm-pack --version 0.13.1 --locked
WORKDIR /build/me-ai-core
COPY --from=chef-cacher /build/me-ai-core/target target
COPY me-ai-core/ .
# Do not mount cache on `target/` here — it would hide the prebuilt deps from chef-cacher.
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    wasm-pack build . --target web --out-dir pkg

# --- Clippy (wasm32; same chef target/ as wasm-builder — CI runs this in Docker) ---
FROM rust:${RUST_VERSION} AS wasm-clippy
RUN rustup target add wasm32-unknown-unknown \
    && rustup component add clippy
WORKDIR /build/me-ai-core
COPY --from=chef-cacher /build/me-ai-core/target target
COPY me-ai-core/ .
RUN cargo clippy --target wasm32-unknown-unknown -- -D warnings

# --- Web: Vite production build ---
FROM node:20-bookworm AS web-build

WORKDIR /build/me-ai-web
COPY me-ai-web/package.json ./
# postinstall runs scripts/ensure-tslib.cjs and ensure-core.cjs before full tree copy
COPY me-ai-web/scripts ./scripts/
# package.json uses file:../me-ai-core/pkg — layout must match repo (sibling me-ai-core/pkg)
RUN mkdir -p /build/me-ai-core/pkg
COPY --from=wasm-builder /build/me-ai-core/pkg /build/me-ai-core/pkg/
RUN npm install --foreground-scripts
COPY me-ai-web/ ./

ENV VITE_BASE=/
RUN npm run build

# --- Runtime: static dist via `serve` (SPA rewrite, no nginx) ---
FROM node:20-bookworm-slim AS web

WORKDIR /app
RUN npm install -g serve@14
COPY --from=web-build /build/me-ai-web/dist ./dist

EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]

# --- Extract wasm pkg only (e.g. local sync or inspection) ---
FROM scratch AS wasm-output
COPY --from=wasm-builder /build/me-ai-core/pkg/ /

# --- Extract Vite dist only (e.g. deploy without loading full image) ---
FROM scratch AS web-output
COPY --from=web-build /build/me-ai-web/dist/ /

# --- Rust unit tests (native target; cache mounts — separate target dir from wasm) ---
FROM rust:${RUST_VERSION} AS rust-test

WORKDIR /build/me-ai-core
COPY me-ai-core/ .
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    --mount=type=cache,target=/build/me-ai-core/target \
    cargo test --lib
