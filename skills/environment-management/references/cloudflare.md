# Cloudflare

Install `wrangler` as a project development dependency with the existing package manager. Keep its version in the manifest and lockfile; never install it globally.

Use `CLOUDFLARE_API_TOKEN` and, when required, `CLOUDFLARE_ACCOUNT_ID` from Cursor secrets for non-interactive access. Keep non-secret bindings and configuration in `wrangler.jsonc`, `wrangler.json`, or `wrangler.toml`. Never commit secret values as Wrangler vars.

Install Cloudflare's official skills only for Cloudflare repositories. Current Wrangler versions support `wrangler --install-skills`; select and commit only the skills relevant to the project. The canonical source is `cloudflare/skills`.

Sources: [Cloudflare skills](https://github.com/cloudflare/skills) and [Wrangler system environment variables](https://developers.cloudflare.com/workers/wrangler/system-environment-variables/).
