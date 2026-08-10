# environment.json patterns

Tooling only. No secrets.

## Minimal (most client repos)

```json
{
  "install": "corepack enable"
}
```

## Shopify Dev dashboard environment (shared)

Install script on the environment, not every repo:

- Shopify CLI
- Node via nvm or corepack
- Shared deps your stack needs

Per-repo `.cursor/environment.json` can be minimal or omitted if the dashboard environment covers install.

## Ops multi-repo

HG Ops environment includes `ops` and `hellogafaro-skills` in the dashboard. Repo-level file optional.

## Rules

- Secrets go in Cursor dashboard, not here.
- Do not run long-lived servers in `install`. Use `terminals` for dev servers.
