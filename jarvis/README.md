# JARVIS Custom

A lightweight, browser-first personal automation assistant built on top of OpenJarvis.

## Current milestone

This first milestone is a safe task dashboard. It stores tasks in the browser using local storage. It does not execute shell commands, access accounts, publish content, submit campaigns, or spend money.

## Run in GitHub Codespaces

1. Open this repository in GitHub.
2. Switch to the `jarvis-custom` branch.
3. Create a Codespace from this branch.
4. In the Codespaces terminal, run `python -m http.server 8000 --directory jarvis`.
5. Open the forwarded port 8000 in the browser.

Python runs inside the cloud Codespace, not on your laptop.

## Next milestones

- Add a secure backend and persistent task database.
- Add an AI provider through server-side secrets (never put API keys in browser code).
- Add explicit, limited tools for approved workflows.
- Connect Uplika after verifying its supported API/actions.
- Add monitoring, audit logs, and optional mobile alerts.

## Safety model

Routine, reversible actions can be automated within configured limits. Publishing, campaign submission, account/security changes, purchases, and other consequential actions require an approval rule. Every action should be logged.
