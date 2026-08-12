# Examples

## Generic application

Inspect the repository, ask what external services it needs, install the baseline skills, write project-specific `AGENTS.md`, pin existing project CLIs, and add the Cursor base only when the default environment cannot verify the application.

## Shopify application

Install the baseline skills, the relevant Shopify AI Toolkit skills, and project-scoped `@shopify/cli`. Document the required Shopify secret names and authentication mode. Add ports or terminals only when the app's verified development command needs them.

## Cloudflare Worker

Install the baseline skills, project-scoped Wrangler, and relevant official Cloudflare skills. Use Cursor secrets for `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. Keep bindings in Wrangler configuration and validate with project scripts.

## Combined Shopify and Cloudflare project

Apply both platform references without duplicating skills or CLIs. Confirm which platform owns deployment, secrets, local services, and validation before changing configuration.
