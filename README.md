# me-ai

A private AI chat and Gmail dashboard that runs **entirely in your browser** — no backend, no servers, no data leaves your machine.

**Live demo:** [https://cypherkitty.github.io/me-ai/](https://cypherkitty.github.io/me-ai/)

## What it does

- **AI Chat** — Run open-source LLMs (Qwen3, DeepSeek, Phi, Gemma) directly in your browser using WebGPU. Models are downloaded once and cached locally. All inference happens on your GPU — nothing is sent to any server.
- **Gmail Dashboard** — Sign in with Google OAuth to browse your Gmail inbox. Read-only access, client-side only. Messages are fetched directly from the Gmail API in your browser.

## Requirements

- A browser with **WebGPU** support (Chrome 113+, Edge 113+)
- For Gmail: a Google Cloud project with OAuth 2.0 Client ID (the app guides you through setup)

## Tech stack

- **Svelte 5** + **Vite 6** — fast, minimal frontend
- **@huggingface/transformers** — ONNX model inference via WebGPU in a Web Worker
- **Google Identity Services** — client-side OAuth implicit flow
- **Gmail REST API** — direct fetch with Bearer token

## Local development

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## License

MIT
