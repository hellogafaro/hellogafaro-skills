# Studio REST

Use this file when Hello Gafaro Studio MCP tools are unavailable, or when you need the HTTP contract. Prefer MCP `connections_execute` when those tools are present.

Read `PUBLIC_URL` and `BEARER_TOKEN` from the environment, host secrets, or an uncommitted `.env`. Never print, commit, or send the token to a provider.

```env
PUBLIC_URL=
BEARER_TOKEN=
```

`PUBLIC_URL` is the live Studio base URL. Do not hardcode a host. Do not use the retired Accounts proxy execute shape `POST /accounts/{account_id}/{provider}`.

Every request:

```http
Authorization: Bearer {BEARER_TOKEN}
```

```bash
curl -H "Authorization: Bearer $BEARER_TOKEN" "$PUBLIC_URL{path}"
```

## Accounts

| Method | Path | Body |
|---|---|---|
| `GET` | `/accounts` | none |
| `POST` | `/accounts` | `{id, name, currency, goal}` |
| `GET` | `/accounts/{account_id}` | none |
| `PATCH` | `/accounts/{account_id}` | any of `{name, currency, goal}` |
| `DELETE` | `/accounts/{account_id}` | none |

`id` matches `^[a-z0-9][a-z0-9-]*$`. `goal` is `leads` or `sales`. `DELETE` cascades connections.

## Connections

| Method | Path | Body |
|---|---|---|
| `GET` | `/connections` | none |
| `GET` | `/accounts/{account_id}/connections` | none |
| `POST` | `/connections` | `{account_id, platform, credential?, metadata?}` |
| `GET` | `/connections/{connection_id}` | none |
| `PATCH` | `/connections/{connection_id}` | any of `{credential, metadata, status}` |
| `DELETE` | `/connections/{connection_id}` | none |
| `POST` | `/connections/{connection_id}` | execute envelope below |
| `POST` | `/connections/{connection_id}/authorize` | Shopify `{shop, client_id, client_secret}`; others `{}` |

`platform` enum: `shopify`, `meta-ads`, `google-ads`, `google-analytics`, `google-search-console`, `tiktok-ads`, `klaviyo`, `posthog`. Connection ids look like `con_` plus 24 to 32 hex characters. `GET` never returns credentials.

Never call `/accounts/{id}/credentials*`, `GET` or `PUT /accounts/{id}/connections/{provider}`, or `/accounts/{id}/{provider}/*`. Those legacy routes return decrypted credentials.

## Execute

```http
POST /connections/{connection_id}
Authorization: Bearer {BEARER_TOKEN}
Content-Type: application/json

{
  "method": "POST",
  "path": "/admin/api/2026-07/graphql.json",
  "query": {},
  "body": { "query": "query { shop { name } }" }
}
```

`method` is the provider HTTP verb. `path` is the official provider path after the hostname. Include the provider version and `/api` when the provider documents them. Studio injects host, auth, token refresh, and required provider headers only.

`query` is the provider query string (MCP `params`). `body` is the provider JSON body. Neither may contain secret-shaped keys (`access_token`, `api_key`, `authorization`, `secret`). The connection must be `status: connected` or this returns `409`.

Look up the current official version before a new call, then put that version in `path`.

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

Google Ads `GET /v25/customers:listAccessibleCustomers` returns every customer the OAuth grant can see. Read `customer.descriptive_name` before querying. Do not use the first id.

## Response

Success:

```json
{
  "account": "account-id",
  "platform": "shopify",
  "method": "POST",
  "url": "/admin/api/2026-07/graphql.json",
  "response": {}
}
```

Error: `{ "error": { "code": "<code>", "message": "<message>", "details": [] } }`.

| Status | Code | Meaning |
|---|---|---|
| `400` | `invalid_request` | malformed body, unsafe or absolute path, secret key in `query`/`body` |
| `401` | `unauthorized` | missing bearer token |
| `403` | `forbidden` | wrong bearer token |
| `404` | `not_found` | missing account or connection |
| `409` | `conflict` | duplicate platform connection, or execute against a connection that is not `connected` |
| `413` | `payload_too_large` | request body too large |
| `502` | `upstream_error` | provider call failed after retries |
| `500` | `internal_error` | server misconfiguration |

Treat `401`, `403`, `404`, `429`, and provider `502` as source failures. Do not bypass Studio with provider credentials.
