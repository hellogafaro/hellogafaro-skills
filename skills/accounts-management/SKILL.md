---
name: accounts-management
description: Use when work needs connected client account data or provider-native reads and confirmed writes through Accounts Ops for Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, GA4, or Search Console.
---

# accounts-management

Use this skill when the request involves connected client account data in Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, Google Analytics, or Search Console.

Accounts Ops implementation lives in the canonical `hellogafaro/hellogafaro-accounts` repository.

Resolve an existing local checkout before provider work. Do not assume a fixed home directory, workspace name, or path capitalization.

This repo only defines how agents should route and use that capability. Do not duplicate provider auth, proxy, or API mechanics here.

## Purpose

Use one owned operations surface for provider-native reads and confirmed writes without exposing credentials or scattering account logic across agents.

## Providers

- Shopify.
- Klaviyo.
- Meta Ads.
- Google Ads.
- TikTok Ads.
- PostHog.
- Google Analytics.
- Search Console.

## Hard rules

- Resolve and validate an existing `hellogafaro/hellogafaro-accounts` checkout before running provider mechanics.
- Never hardcode a local checkout path or clone the repository before checking the user's existing workspaces.
- Query data only for existing connected account ids.
- If account id is unknown, list accounts first.
- Do not manage OAuth, credentials, account setup, or webhooks unless the user explicitly asks and the owning repo supports it.
- Never call provider APIs directly with stored credentials.
- Never expose API keys, provider tokens, webhook secrets, authorization headers, or account secrets.
- Use the smallest provider-native call that answers the question.
- Prefer sparse fields, narrow filters, server-side search, and cursor pagination over full scans.
- For long date windows, query month by month and aggregate client-side.
- Do not perform writes unless the user explicitly asks and the provider method is appropriate.

## Workflow

1. Identify client, account id, provider, date window, metric, and question.
2. Locate existing checkout candidates in the current workspace, sibling repositories, and the user's established project roots. Validate candidates by confirming their Git remote points to `hellogafaro/hellogafaro-accounts`.
3. If exactly one valid checkout exists, use its absolute root as `<accounts-ops-root>`. If multiple valid checkouts exist and the active project convention does not resolve the choice, ask the user. Clone only when none exists and the user authorizes it, following the existing workspace naming and capitalization convention.
4. Open `<accounts-ops-root>/AGENTS.md`, `skills/hellogafaro-accounts/SKILL.md`, and only the needed provider reference before running provider work.
5. Use `<accounts-ops-root>/skills/hellogafaro-accounts/scripts/accounts-api.sh` from the consumer app root for `/accounts/{account_id}/{provider}` requests. It loads `HELLOGAFARO_ACCOUNTS_URL` and `HELLOGAFARO_ACCOUNTS_BEARER_TOKEN` from the app's local environment without printing either value.
6. Build the smallest native provider request.
7. Execute the read or explicitly confirmed write.
8. Return evidence with platform, account id, date window, endpoint, metric definition, comparison, and limitations when relevant.

## Failures

Missing account, missing credential, provider 401, provider 403, quota, and provider errors are source failures.

Surface the exact source and operation.

Continue only with sources that still work.

Do not present partial provider data as complete.

Label inferences.
