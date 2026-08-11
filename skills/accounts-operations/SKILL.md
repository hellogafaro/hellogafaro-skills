---
name: accounts-operations
description: Use when work needs connected client account data or provider-native reads and confirmed writes through Hello Gafaro Accounts for Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, GA4, or Search Console.
---

# accounts-operations

Use the authenticated raw-provider proxy in `hellogafaro/hellogafaro-accounts`. Do not invent provider endpoints, fields, API versions, or limits.

## Workflow

1. Identify the client, account id, provider, operation, date window, and whether a write is requested.
2. Locate and validate one existing `hellogafaro/hellogafaro-accounts` checkout. Do not assume its path or clone it without approval.
3. Read `<accounts-ops-root>/AGENTS.md`, `<accounts-ops-root>/skills/hellogafaro-accounts/SKILL.md`, [references/edge-cases.md](references/edge-cases.md), and the needed provider reference below.
4. Browse the linked official provider documentation before constructing every new or changed operation. Treat checked-in references as routing and safety guidance, not an API catalog.
5. List accounts when the account id is unknown. Use the canonical request script from the consumer root; it loads `HELLOGAFARO_ACCOUNTS_URL` and `HELLOGAFARO_ACCOUNTS_BEARER_TOKEN` without printing either value.
6. Send provider-native calls through `POST /accounts/{account_id}/{provider}` with `{ method, url, params, body }`. Use no provider credentials, authorization headers, or absolute upstream URLs.
7. Run the smallest read that answers the question. Perform a write only when the user explicitly asks and the operation is supported by the current official documentation.
8. Return provider, account id, official source, endpoint, date window, metric definition, result, and limitations.

## Provider references

- [references/shopify.md](references/shopify.md)
- [references/klaviyo.md](references/klaviyo.md)
- [references/meta-ads.md](references/meta-ads.md)
- [references/google-ads.md](references/google-ads.md)
- [references/tiktok-ads.md](references/tiktok-ads.md)
- [references/posthog.md](references/posthog.md)
- [references/google-analytics.md](references/google-analytics.md)
- [references/search-console.md](references/search-console.md)

## Hard rules

- Never call a provider directly with stored credentials or expose tokens, secrets, authorization headers, or account secrets.
- Reject unknown account ids, unsupported providers, absolute URLs, path traversal, and requests that attempt to supply provider authentication.
- Preserve upstream response semantics. Label sampling, thresholding, partial pages, stale data, and inferences.
- Prefer sparse fields, server-side filtering, cursor pagination, and month-by-month aggregation for long windows.
- Stop on authentication, authorization, missing credential, quota, or provider errors. Do not represent partial provider data as complete.
