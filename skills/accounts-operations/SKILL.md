---
name: accounts-operations
description: Use when work needs connected client account data, account or connection management, or provider-native reads and confirmed writes through Hello Gafaro Studio for Shopify, Klaviyo, Meta Ads, Google Ads, TikTok Ads, PostHog, GA4, or Search Console.
---

# accounts-operations

Call live Hello Gafaro Studio. This skill is self-contained and does not require an implementation repository checkout.

When Hello Gafaro Studio MCP tools are available, use them. Otherwise call Studio REST with curl. Do not call providers through the retired Accounts proxy.

## Provider references

- [references/shopify.md](references/shopify.md)
- [references/klaviyo.md](references/klaviyo.md)
- [references/meta-ads.md](references/meta-ads.md)
- [references/google-ads.md](references/google-ads.md)
- [references/tiktok-ads.md](references/tiktok-ads.md)
- [references/posthog.md](references/posthog.md)
- [references/google-analytics.md](references/google-analytics.md)
- [references/search-console.md](references/search-console.md)

## Rules

- Read `PUBLIC_URL` and `BEARER_TOKEN` from the environment, host secrets, or an uncommitted `.env` without printing them. Never hardcode a token.
- Never call `/accounts/{id}/credentials*`, `GET` or `PUT /accounts/{id}/connections/{provider}`, or `/accounts/{id}/{provider}/*`. These legacy routes return decrypted credentials in plain JSON. Everything needed is below.
- Do not perform writes (create, update, delete, or execute-write) unless the user explicitly asks.
- `path` is the official provider path after the hostname. Include the provider version and `/api` when the provider documents them. Studio injects host, auth, token refresh, and required provider headers only. Do not omit a version because Studio used to pin one.

## Studio MCP

1. `accounts_list` or `accounts_get` for the Studio account id.
2. `connections_list` or `connections_get` for the connection id. Confirm `status` is `connected`.
3. `connections_execute` with `connection_id`, `method`, `path`, `params`, and `body`.

`params` is the provider query string. `body` is the provider JSON body. Never put credentials, `Authorization`, tokens, or provider hosts in those fields.

## Studio REST

Every request: `curl -H "Authorization: Bearer $BEARER_TOKEN" "$PUBLIC_URL{path}"`.

## Accounts

| Method | Path | Body | Notes |
|---|---|---|---|
| `GET` | `/accounts` | none | list all |
| `POST` | `/accounts` | `{id, name, currency, goal}` | `id` matches `^[a-z0-9][a-z0-9-]*$`; `goal` is `leads` or `sales`; `currency` is free text |
| `GET` | `/accounts/{account_id}` | none | |
| `PATCH` | `/accounts/{account_id}` | any of `{name, currency, goal}` | at least one field |
| `DELETE` | `/accounts/{account_id}` | none | cascades: deletes all of the account's connections too |

## Connections

| Method | Path | Body | Notes |
|---|---|---|---|
| `GET` | `/connections` | none | all accounts |
| `GET` | `/accounts/{account_id}/connections` | none | one account |
| `POST` | `/connections` | `{account_id, platform, credential?, metadata?}` | one connection per platform per account (`409` if it already exists) |
| `GET` | `/connections/{connection_id}` | none | never returns credentials |
| `PATCH` | `/connections/{connection_id}` | any of `{credential, metadata, status}` | setting `credential` auto-sets `status: connected` |
| `DELETE` | `/connections/{connection_id}` | none | |
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

## Execute

MCP: `connections_execute` with `method`, `path`, `params`, `body`.

REST:

```http
POST /connections/{connection_id}
Authorization: Bearer {BEARER_TOKEN}

{
  "method": "POST",
  "path": "/admin/api/2026-07/graphql.json",
  "query": {},
  "body": { "query": "query { shop { name } }" }
}
```

`method` is the provider-side HTTP verb (`GET`, `POST`, `PUT`, `PATCH`, or `DELETE`). `path` must start with `/` and never contain `..`. REST `query` is the same as MCP `params`. `query`/`params` and `body` may never contain secret-shaped keys (`access_token`, `api_key`, `authorization`, `secret`, and similar; rejected with `400`). The connection must be `status: connected`, or this returns `409`.

Look up the current official version before a new or changed call. Then pass that version in `path`.

| Provider | Host Studio adds | Path you pass |
|---|---|---|
| Shopify | shop domain | `/admin/api/2026-07/graphql.json` |
| Klaviyo | `https://a.klaviyo.com` | `/api/metrics` |
| Meta Ads | `https://graph.facebook.com` | `/v25.0/{account_id}/insights` |
| Google Ads | `https://googleads.googleapis.com` | `/v25/customers/{customer_id}/googleAds:search` |
| TikTok Ads | `https://business-api.tiktok.com` | `/open_api/v1.3/campaign/get/` |
| PostHog | credential host | `/api/projects/{project_id}/query/` |
| GA4 | host from `/data` or `/admin` | `/data/v1beta/properties/{id}:runReport` |
| Search Console | host from prefix | `/webmasters/v3/sites/{siteUrl}/searchAnalytics/query` |

If a provider 404 shows a doubled prefix (`/v23/v25/` or `/api/api/`), Studio still prepended a version or `/api`. Report that as a Studio bug. Do not omit versions or `/api` to paper over it.

Google Ads `customers:listAccessibleCustomers` returns every customer the OAuth grant can see, including other Hello Gafaro clients. Read `customer.descriptive_name` before querying. Do not use the first id.

## Placeholders

Per-provider templates substitute well-known fields from the credential into the path (and, for TikTok, into `query` and `body` too). Use placeholders, not hardcoded ids.

| Provider | Placeholders |
|---|---|
| Shopify | `{api_version}` |
| Meta Ads | `{account_id}` (the `act_` ad-account id) |
| Google Ads | `{customer_id}`, `{login_customer_id}` |
| TikTok Ads | `{advertiser_id}` (substituted in the path, and in `query`/`body` if present there too) |
| PostHog | `{project_id}`, `{environment_id}`, `{organization_id}` |
| Google Analytics | none, pass property id directly |
| Search Console | none, encode `siteUrl` segment |
| Klaviyo | none, wrap body in JSON:API or pass `{attributes,relationships}` |

## Response and errors

Success: `{ "account": "<account_id>", "platform": "<platform>", "method": "<verb>", "url": "<path>", "response": <upstream JSON> }`.

Error: `{ "error": { "code": "<code>", "message": "<message>", "details": [] } }`.

| Status | Code | Meaning |
|---|---|---|
| `400` | `invalid_request` | malformed body, unsafe or absolute path, secret key in `query`/`body` |
| `401` | `unauthorized` | missing bearer token |
| `403` | `forbidden` | wrong bearer token |
| `404` | `not_found` | missing account or connection |
| `409` | `conflict` | duplicate platform connection, or execute against a connection that is not `connected` |
| `413` | `payload_too_large` | request body too large |
| `502` | `upstream_error` | provider call failed after retries (status and redacted body in `details`) |
| `500` | `internal_error` | server misconfiguration |

Provider-specific `400` causes worth knowing: Shopify requires the `/admin/` prefix on every path; GA4 and Search Console require the correct routing prefix (`/data/` vs `/admin/`, `/webmasters/` vs `/v1/urlInspection/`).

## Workflow

1. Identify the client, account id, provider, operation, date window, and whether a write is requested.
2. List accounts when the account id is unknown (`accounts_list` or `GET /accounts`).
3. For account or connection management, use the MCP account/connection tools or the tables above.
4. For querying a connected platform, get the connection id, read the matching `references/{provider}.md`, then run the smallest `connections_execute` or `POST /connections/{connection_id}` call that answers the question.
5. For windows longer than a calendar month, query month by month and aggregate client-side.
6. Return provider, account id, source endpoint, date window, metric definition, result, and any limitation.
