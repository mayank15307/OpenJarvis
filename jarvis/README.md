# JARVIS Custom

A browser-first personal assistant project on the separate `jarvis-custom` branch.

## Current milestone: Phase 2 — Gemini chat

- Task board with add, complete, and delete actions.
- Browser-local project notes.
- Gemini chat through a small Python server.
- API key read only from `GEMINI_API_KEY`; never exposed to browser JavaScript or committed to Git.
- Chat-only: no computer control, account access, publishing, messaging, purchases, or arbitrary command execution.

The server uses Google's Gemini Developer API with `gemini-3.8-flash`. Free-tier availability and rate limits are controlled by Google and can change. The app does not automatically switch to a paid model or provider.

## Run in Codespaces

1. Open the `jarvis-custom` branch in Codespaces.
2. Add a Codespaces secret named `GEMINI_API_KEY` with access to this repository.
3. Restart the Codespace after creating or changing the secret.
4. The dev container starts `python server.py` on port 8000. Open the forwarded port labelled **JARVIS dashboard**.

For manual startup, run `python server.py`. The server uses Python's standard library. The API key stays server-side and is sent to Google over HTTPS in a request header.

## Privacy and safety

- Never paste the API key into chat, source code, screenshots, or commits.
- Do not use this prototype for sensitive personal information.
- Google processes prompts under the applicable Gemini API terms and data-use settings.
- Future external actions must be permission-scoped, logged, and require explicit approval where they affect accounts, people, money, or public content.

## Planned milestones

1. Foundation: dashboard, tasks, and notes.
2. Gemini chat backend.
3. User-controlled, inspectable memory.
4. Narrowly scoped tools with confirmation.
5. Investigate Uplika integration and supported permissions.
6. Voice and desktop features.
