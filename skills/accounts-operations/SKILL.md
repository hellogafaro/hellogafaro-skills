---
name: |-
  accounts-operations
description: |-
  Use when work needs connected client account data, account or connection management, or provider-native reads and confirmed writes through Hello Gafaro Studio for Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, GA4, or Search Console.
notion_page_id: 3dafc798-2e43-8093-8c0d-fc9aa6d44580
---

# accounts-operations

Call live Hello Gafaro Studio. This skill is self-contained and does not require an implementation repository checkout.

When Hello Gafaro Studio MCP tools are available, use them. Otherwise call Studio REST with curl. Do not call providers through the retired Accounts proxy.

## Rules

- Read `PUBLIC_URL` and `BEARER_TOKEN` from the environment, host secrets, or an uncommitted `.env` without printing them. Never hardcode a token.
- Never call `/accounts/{id}/credentials*`, `GET` or `PUT /accounts/{id}/connections/{provider}`, or `/accounts/{id}/{provider}/*`. These legacy routes return decrypted credentials in plain JSON. Everything needed is in the references below.
- Do not perform writes (create, update, delete, or execute-write) unless the user explicitly asks.

## Workflow

1. Identify the client, account id, provider, operation, date window, and whether a write is requested.
2. List accounts when the account id is unknown (`accounts_list` or `GET /accounts`). See [studio-access.md](references/studio-access.md).
3. For account or connection management, use the MCP account/connection tools or the tables in [accounts-and-connections.md](references/accounts-and-connections.md).
4. For querying a connected platform, get the connection id, read the matching provider reference, then run the smallest `connections_execute` or `POST /connections/{connection_id}` call that answers the question. Details: [execute.md](references/execute.md).
5. For windows longer than a calendar month, query month by month and aggregate client-side.
6. Return provider, account id, source endpoint, date window, metric definition, result, and any limitation.

## Provider references

- [references/api.md](references/api.md)
- [references/shopify.md](references/shopify.md)
- [references/klaviyo.md](references/klaviyo.md)
- [references/meta-ads.md](references/meta-ads.md)
- [references/google-ads.md](references/google-ads.md)
- [references/tiktok-ads.md](references/tiktok-ads.md)
- [references/posthog.md](references/posthog.md)
- [references/google-analytics.md](references/google-analytics.md)
- [references/search-console.md](references/search-console.md)
