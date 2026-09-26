# Accounts, connections, and credential entry

## Accounts

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| `GET` | `/accounts` | none | list all |
| `POST` | `/accounts` | `{id, name, currency, goal}` | `id` matches `^[a-z0-9][a-z0-9-]*$`; `goal` is `leads` or `sales`; `currency` is free text |
| `GET` | `/accounts/{account_id}` | none |  |
| `PATCH` | `/accounts/{account_id}` | any of `{name, currency, goal}` | at least one field |
| `DELETE` | `/accounts/{account_id}` | none | cascades: deletes all of the account's connections too |

## Connections

| Method | Path | Body | Notes |
| --- | --- | --- | --- |
| `GET` | `/connections` | none | all accounts |
| `GET` | `/accounts/{account_id}/connections` | none | one account |
| `POST` | `/connections` | `{account_id, platform, credential?, metadata?}` | one connection per platform per account (`409` if it already exists) |
| `GET` | `/connections/{connection_id}` | none | never returns credentials |
| `PATCH` | `/connections/{connection_id}` | any of `{credential, metadata, status}` | setting `credential` auto-sets `status: connected` |
| `DELETE` | `/connections/{connection_id}` | none |  |
| `POST` | `/connections/{connection_id}` | see Execute | run a provider operation |
| `POST` | `/connections/{connection_id}/authorize` | Shopify needs `{shop, client_id, client_secret}`; others send `{}` | see Credential entry |

`platform` enum: `shopify`, `meta-ads`, `google-ads`, `google-analytics`, `google-search-console`, `tiktok-ads`, `klaviyo`, `posthog`. Connection ids look like `con_` plus 24 to 32 hex characters.

## Credential entry

Two ways to bring a connection to `status: connected`, chosen by platform.

**Direct credential: Klaviyo, PostHog.** No OAuth exists for these; `authorize` returns `400`.

```json
POST /connections
{ "account_id": "dunder-mifflin", "platform": "klaviyo", "credential": { "api_key": "<key>" } }
```

Klaviyo credential: `{api_key, conversion_metric_id?}`. PostHog credential: `{personal_api_key}` with metadata `{host, project_id}` (`host` defaults to `https://us.posthog.com`).

**OAuth authorize: Shopify, Meta Ads, Google Ads, Google Analytics, Google Search Console, TikTok Ads.**

1. `POST /connections {"account_id": "<account_id>", "platform": "<platform>"}` creates it `pending`.
2. `POST /connections/{connection_id}/authorize` returns `{url}`.
3. This step is interactive. Hand the URL to the human and have them open it and complete login and consent in a browser. An agent cannot finish this itself; there is no scriptable path.
4. Poll `GET /connections/{connection_id}` until `status: connected`.
