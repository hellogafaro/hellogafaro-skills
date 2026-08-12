# Shopify

Install `@shopify/cli` as a project development dependency with the repository's existing package manager. Run it through repository scripts, `bunx`, `pnpm exec`, or `npx`; never install it globally.

Install Shopify's official AI Toolkit when the repository builds Shopify apps, themes, extensions, or Admin API integrations. For Cursor, `/add-plugin shopify` is Shopify's recommended account-level installation. For repository-owned collaboration, install only relevant skills from `Shopify/shopify-ai-toolkit` and commit them under `.agents/skills`.

Authentication is workflow-specific:

- Theme automation supports `SHOPIFY_CLI_THEME_TOKEN` from Theme Access. Pass the
  store explicitly with `--store <store>.myshopify.com`; the store name is
  configuration, not a secret.
- App development may require interactive Shopify CLI authentication or app-specific credentials.

Use configured Cursor secrets. Ask for the exact missing supported credential; never treat a theme token as a universal Shopify login. Never print credentials or commit login caches.

Sources: [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) and [Theme Access](https://shopify.dev/docs/storefronts/themes/tools/theme-access).
