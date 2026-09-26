# Execute, placeholders, responses, and errors

- `path` is the official provider path after the hostname. Include the provider version and `/api` when the provider documents them. Studio injects host, auth, token refresh, and required provider headers only. Do not omit a version because Studio used to pin one.

## Execute

MCP: `connections_execute` with `method`, `path`, `params`, `body`.

REST:

```javascript
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
| --- | --- | --- |
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
| --- | --- |
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
| --- | --- | --- |
| `400` | `invalid_request` | malformed body, unsafe or absolute path, secret key in `query`/`body` |
| `401` | `unauthorized` | missing bearer token |
| `403` | `forbidden` | wrong bearer token |
| `404` | `not_found` | missing account or connection |
| `409` | `conflict` | duplicate platform connection, or execute against a connection that is not `connected` |
| `413` | `payload_too_large` | request body too large |
| `502` | `upstream_error` | provider call failed after retries (status and redacted body in `details`) |
| `500` | `internal_error` | server misconfiguration |

Provider-specific `400` causes worth knowing: Shopify requires the `/admin/` prefix on every path; GA4 and Search Console require the correct routing prefix (`/data/` vs `/admin/`, `/webmasters/` vs `/v1/urlInspection/`).
