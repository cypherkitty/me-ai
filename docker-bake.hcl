variable "REGISTRY" {
  default = "me-ai"
}

// Set PUSH_CACHE=1 to enable writing cache to registry (local push / some CI)
variable "PUSH_CACHE" {
  default = ""
}

// Set CACHE_GHA=1 in GitHub Actions for type=gha cache (requires actions: write on same-repo runs)
variable "CACHE_GHA" {
  default = ""
}

// Set CACHE_GHA_RO=1 for fork PRs (cache-from gha only; no cache-to — token cannot write)
variable "CACHE_GHA_RO" {
  default = ""
}

group "default" {
  targets = ["web-image"]
}

// Shared BuildKit cache config: GitHub Actions vs registry vs none
function "cache_from" {
  params = []
  result = CACHE_GHA != "" ? [
    "type=gha,scope=me-ai",
  ] : [
    "type=registry,ref=${REGISTRY}/web:cache",
    "type=registry,ref=${REGISTRY}/core-wasm:cache",
  ]
}

function "cache_to" {
  params = []
  result = CACHE_GHA != "" ? (
    CACHE_GHA_RO != "" ? [] : [
      "type=gha,scope=me-ai,mode=max",
    ]
  ) : PUSH_CACHE != "" ? [
    "type=registry,ref=${REGISTRY}/web:cache,mode=max",
  ] : []
}

target "web-image" {
  context      = "."
  dockerfile   = "Dockerfile"
  target       = "web"
  tags         = ["${REGISTRY}/web:latest"]
  cache-from   = cache_from()
  cache-to     = cache_to()
}

target "web-local" {
  context      = "."
  dockerfile   = "Dockerfile"
  target       = "web-output"
  output       = ["type=local,dest=me-ai-web/dist-docker"]
  cache-from   = cache_from()
  cache-to     = cache_to()
}

target "wasm-local" {
  context      = "."
  dockerfile   = "Dockerfile"
  target       = "wasm-output"
  output       = ["type=local,dest=me-ai-core/pkg-docker"]
  cache-from   = cache_from()
  cache-to     = cache_to()
}

target "rust-test" {
  context      = "."
  dockerfile   = "Dockerfile"
  target       = "rust-test"
  output       = ["type=cacheonly"]
  cache-from   = cache_from()
  cache-to     = cache_to()
}

target "wasm-clippy" {
  context      = "."
  dockerfile   = "Dockerfile"
  target       = "wasm-clippy"
  output       = ["type=cacheonly"]
  cache-from   = cache_from()
  cache-to     = cache_to()
}

group "ci" {
  targets = ["web-image", "rust-test", "wasm-clippy", "wasm-local"]
}
