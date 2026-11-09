# JARVIS Custom

A browser-first personal assistant project built on top of the OpenJarvis repository. Custom work stays on the `jarvis-custom` branch.

## Current milestone: Phase 1 — Control Center

The dashboard currently provides:
- A task board with add, complete, and delete actions.
- Task counts for total, completed, and remaining work.
- A project-notes area that autosaves in the current browser.
- A clearly labelled demo assistant panel. It is **not** connected to an AI model.
- A status panel showing which integrations are not configured.

Tasks and notes use browser local storage. They remain on this browser/device and are not synced to a server.

## Open in GitHub Codespaces

1. Open this repository and select the `jarvis-custom` branch.
2. Create/open a Codespace for that branch.
3. The development container starts a simple web server on port 8000.
4. Open the forwarded port labelled **JARVIS dashboard**.

If the server is not running, open the Codespaces terminal and run:

```bash
python -m http.server 8000 --directory jarvis
```

Python runs inside the cloud Codespace, not on your laptop.

## Planned milestones

1. **Foundation:** dashboard, local tasks, and notes.
2. **AI brain:** connect a model through a secure server-side backend. Never place API keys in browser JavaScript or commit them to Git.
3. **Memory:** add user-controlled, inspectable persistent memory.
4. **Tools:** add narrowly scoped tools with confirmation before consequential actions.
5. **Integrations:** investigate supported Uplika actions and connect only with explicit permissions.
6. **Voice and desktop:** add after the backend and security model are stable.

## Safety model

This prototype does not access accounts, publish content, send messages, run arbitrary commands, or spend money. Future external actions must be permission-scoped, logged, and require user approval where they affect accounts, people, money, or public content.
