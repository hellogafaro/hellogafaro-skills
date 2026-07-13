---
name: accounts-ops
description: Use when work needs connected client account data or provider-native reads and confirmed writes through Accounts Ops for Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, GA4, or Search Console.
---

# accounts-ops

Use this skill when the request involves connected client account data in Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, Google Analytics, or Search Console.

Accounts Ops implementation lives in `$HOME/Dev/hellogafaro-accounts`.

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

- Use `$HOME/Dev/hellogafaro-accounts` for all provider mechanics.
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
2. Open `$HOME/Dev/hellogafaro-accounts/AGENTS.md`, `skills/hellogafaro-accounts/SKILL.md`, and only the needed provider reference before running provider work.
3. Use `$HOME/Dev/hellogafaro-accounts/skills/hellogafaro-accounts/scripts/accounts-api.sh` from the consumer app root for `/accounts/{account_id}/{provider}` requests. It loads `HELLOGAFARO_ACCOUNTS_URL` and `HELLOGAFARO_ACCOUNTS_BEARER_TOKEN` from the app's local environment without printing either value.
4. Build the smallest native provider request.
5. Execute the read or explicitly confirmed write.
6. Return evidence with platform, account id, date window, endpoint, metric definition, comparison, and limitations when relevant.

## Failures

Missing account, missing credential, provider 401, provider 403, quota, and provider errors are source failures.

Surface the exact source and operation.

Continue only with sources that still work.

Do not present partial provider data as complete.

Label inferences.
