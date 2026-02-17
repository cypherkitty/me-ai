# me-ai

A private AI chat and Gmail dashboard that runs **entirely in your browser** — no backend, no servers, no data leaves your machine.

**Live demo:** [https://cypherkitty.github.io/me-ai/](https://cypherkitty.github.io/me-ai/)

## Architecture

The system is built on an **event-stream model**: all data (emails, messages, etc.) flows through as events, each classified into a type. Each event type maps to a list of **commands** — actions that can be taken. The chat serves as the **control interface** on top of this event stream, rendering not just text but interactive command cards.

```
Data Sources → Events → EventType → Commands → Chat UI
```

See [`.cursor/rules/architecture.md`](.cursor/rules/architecture.md) for the full architecture reference.

## What it does

- **AI Chat** — Run open-source LLMs (Qwen3, DeepSeek, Phi, Gemma) directly in your browser using WebGPU, or connect to a local Ollama server. The chat renders both text responses and structured event/command cards.
- **Email Triage** — Classify Gmail messages using LLM into action types (Reply, Delete, Track Delivery, etc.), each with associated commands.
- **Gmail Dashboard** — Sign in with Google OAuth to browse your Gmail inbox. Read-only access, client-side only. Messages are fetched directly from the Gmail API in your browser.
- **Markdown Export** — Export any email to Markdown format with a live preview.

## Requirements

- A browser with **WebGPU** support (Chrome 113+, Edge 113+)
- For Gmail: a Google Cloud project with OAuth 2.0 Client ID (the app guides you through setup)

## Tech stack

- **Svelte 5** + **Vite 6** — fast, minimal frontend
- **@huggingface/transformers** — ONNX model inference via WebGPU in a Web Worker
- **Ollama** — optional local LLM backend via HTTP API
- **Google Identity Services** — client-side OAuth implicit flow
- **Gmail REST API** — direct fetch with Bearer token
- **Dexie.js** — IndexedDB wrapper for local data store
- **marked** + **DOMPurify** — Markdown rendering with XSS protection
- **Vitest** — unit testing

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## Testing

```bash
npm test          # watch mode (development)
npm run test:ci   # single run (CI)
```

## Deployment

The app auto-deploys to [GitHub Pages](https://cypherkitty.github.io/me-ai/) on every push to `main` via GitHub Actions.

## License

MIT
