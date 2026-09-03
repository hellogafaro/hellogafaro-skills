# Klaviyo

Studio exposes the Klaviyo private API verbatim. The Worker only handles authentication, the `revision` header, rate limiting, and JSON:API body wrapping. The agent calls Klaviyo's native paths and parameters.

## Agent Tool

Pass `connection_id`, `method`, `path`, `params`, and `body` to Studio `connections_execute` or `POST /connections/{connection_id}`. Use official private API paths including `/api`, such as `/api/segments`, `/api/profiles`, or `/api/campaign-values-reports`. Do not include the Klaviyo host, private API key, auth headers, revision headers, or tokens.

Upstream reference: https://developers.klaviyo.com/en/reference/api_overview. Confirm the current `revision` header value from that page. Studio injects it.

## Endpoint

Single catch-all:

```text
ANY /accounts/{account_id}/connections/klaviyo/<klaviyo-path>
```

`<klaviyo-path>` is whatever Klaviyo documents after `https://a.klaviyo.com`, including `/api`. Examples: `/api/profiles`, `/api/segments/{id}`, `/api/campaign-values-reports/`, `/api/profile-bulk-import-jobs`. Studio prepends `https://a.klaviyo.com` only, injects the API key and `revision` header, and forwards method, query params, and body. Catalog paths below omit `/api` for brevity; send `/api/profiles`, not `/profiles`.

Auth is automatic. The agent passes only `account_id` (in the path) and the Klaviyo request shape. Never include `Authorization`, `revision`, or the API key.

## Request body wrapping

Writes (`POST`, `PATCH`, `PUT`) accept either:

- The full Klaviyo JSON:API envelope `{"data":{"type":"...","id":"...","attributes":{...},"relationships":{...}}}`, or
- A flat shape `{"attributes":{...},"relationships":{...}}` — the Worker wraps it into `{"data":{"type":"<resolved>","id":"<from-url>","attributes":...,"relationships":...}}` using a built-in resource-type table.

`GET` and `DELETE` ignore the body.

## Token-saving conventions

These reduce both response size and round trips. Apply them on every read.

- Sparse fieldsets: `?fields[campaign]=name,status,send_strategy,send_time` returns only the listed attributes.
- Additional fields: `?additional-fields[campaign]=audiences` adds optional fields Klaviyo hides by default.
- Includes: `?include=campaign-messages,tags` joins related resources in one call.
- Filter DSL: `?filter=equals(status,"Draft")`, `?filter=greater-than(updated,2026-04-01)`, combinable with `and(...)` and `or(...)`.
- Cursor pagination: `?page[size]=20&page[cursor]=...`. Use the `links.next` cursor from the prior response.
- Sorting: `?sort=-updated`. Prefix with `-` for descending.

## Rate limit

Klaviyo enforces roughly one request every two seconds per API key. On a 429/5xx, the Worker retries up to 3 times with a 2 second backoff base — there is no enforced spacing between successful calls, so bursts can still hit Klaviyo's limit. Design queries to land the answer in the smallest number of calls (sparse fields, includes, filters) rather than over-paginating.

## Per-domain catalog

### Profiles

- `GET /profiles` — list profiles.
- `GET /profiles/{id}` — one profile.
- `POST /profiles` — create profile.
- `PATCH /profiles/{id}` — update profile.
- `GET /profiles/{id}/lists` and `/segments` — membership.
- Common filters: `equals(email,"x@y.com")`, `any(properties,...)`, `greater-than(updated,...)`.
- Example: `GET /profiles?filter=equals(email,"jane@example.com")&fields[profile]=email,first_name,last_name,subscriptions`.

### Profiles — bulk imports, suppressions, subscriptions

- `POST /profile-bulk-import-jobs` — create import job.
- `GET /profile-bulk-import-jobs/{id}` — poll job status.
- `POST /profile-suppression-bulk-create-jobs` — bulk suppress.
- `POST /profile-suppression-bulk-delete-jobs` — bulk unsuppress.
- `POST /profile-subscription-bulk-create-jobs` and `/profile-subscription-bulk-delete-jobs` — consent changes.
- `POST /profile-merge` — merge two profiles.

### Campaigns, campaign messages, send jobs

- `GET /campaigns?filter=equals(messages.channel,"email")` — list (filter on channel is required).
- `GET /campaigns/{id}` — one campaign.
- `POST /campaigns` — draft campaign.
- `PATCH /campaigns/{id}` — update campaign.
- `POST /campaign-clone` — clone a campaign.
- `GET /campaign-messages/{id}` — message detail.
- `PATCH /campaign-messages/{id}` — update message.
- `POST /campaign-message-assign-template` — assign template to message.
- `POST /campaign-send-jobs` — schedule or send.
- `PATCH /campaign-send-jobs/{id}` — control a send.
- `POST /campaign-recipient-estimation-jobs` — kick off recipient estimate.
- `GET /campaign-recipient-estimations/{id}` — read estimate.

### Campaign reports

- `POST /campaign-values-reports/` — campaign performance values.
- `POST /campaign-series-reports/` — values over time.
- Reporting endpoints require `POST`; never call `/campaign-values-reports/`, `/campaign-series-reports/`, `/flow-values-reports/`, `/flow-series-reports/`, `/form-values-reports/`, `/form-series-reports/`, `/segment-values-reports/`, or `/segment-series-reports/` with `GET`.
- Use Klaviyo's exact statistic names. Do not invent common analytics aliases:
  - Use `conversion_value`, not `revenue`.
  - Use `unsubscribe_uniques` or `unsubscribes`, not `unsubscribed`.
  - Use `conversion_uniques`, not `conversions_unique`.
  - Valid common campaign/flow statistics include `recipients`, `delivered`, `opens`, `opens_unique`, `open_rate`, `clicks`, `clicks_unique`, `click_rate`, `conversions`, `conversion_uniques`, `conversion_rate`, `conversion_value`, `revenue_per_recipient`, `unsubscribe_uniques`, `unsubscribes`, `unsubscribe_rate`, `spam_complaints`, and `spam_complaint_rate`.

Body shape:

```json
{
  "data": {
    "type": "campaign-values-report",
    "attributes": {
      "timeframe": { "start": "2026-04-01T00:00:00+00:00", "end": "2026-04-30T23:59:59+00:00" },
      "statistics": ["recipients","delivered","opens_unique","clicks_unique","conversions","conversion_value"],
      "conversion_metric_id": "<metric_id>",
      "filter": "equals(send_channel,'email')"
    }
  }
}
```

`conversion_metric_id` is required for conversion-based statistics. Discover it once via `GET /metrics?filter=equals(integration.name,"Klaviyo")&fields[metric]=name,integration.id,integration.name&page[size]=200`, then match `attributes.name` client-side. The `/metrics` endpoint only filters by `integration.name` and `integration.category`; `name` is not filterable.

### Flows, flow actions, flow messages

- `GET /flows`, `GET /flows/{id}` — lifecycle and status.
- `PATCH /flows/{id}` — change flow status.
- `GET /flow-actions/{id}` — action config.
- `GET /flow-messages/{id}` — message detail.
- `PATCH /flow-messages/{id}` — edit message.

### Flow reports

- `POST /flow-values-reports/` and `/flow-series-reports/` — same shape as campaign reports with `flow-values-report` / `flow-series-report` types.
- Flow report endpoints also require `POST`; use the exact statistics listed in Campaign reports.

### Segments

- `GET /segments?page[size]=20` — list. Klaviyo does not support `contains(name,...)`; for partial-name lookup, list and filter client-side on `attributes.name`.
- `GET /segments/{id}` — one segment.
- `POST /segments` — create.
- `PATCH /segments/{id}` — rename or update.
- `DELETE /segments/{id}` — delete.
- `POST /segment-values-reports/` and `/segment-series-reports/` — segment metrics.
- `GET /segments/{id}/profiles` — membership.

### Lists

- `GET /lists`, `GET /lists/{id}`, `POST /lists`, `PATCH /lists/{id}`, `DELETE /lists/{id}`.
- `GET /lists/{id}/profiles` — membership.
- `POST /lists/{id}/relationships/profiles` — add profiles.
- `DELETE /lists/{id}/relationships/profiles` — remove profiles.

### Metrics and events

- `GET /metrics` — discover metric ids.
- `GET /metrics?filter=equals(integration.name,"Klaviyo")&fields[metric]=name,integration.id,integration.name&page[size]=200` — list native Klaviyo metrics, then match metric names client-side. Note: bare `GET /metrics` returns the unpaginated set; some accounts reject pagination on the metric resource even though it is documented as JSON:API.
- Do not call `GET /metrics?filter=equals(name,"Placed Order")`; `name` is not filterable. Allowed metric filters are `integration.name` and `integration.category`.
- `GET /metrics/{id}` — one metric.
- `GET /metric-properties/{id}` — property definitions.
- `POST /metric-aggregates/` — rollup query (replaces deprecated query timeline).
- `POST /custom-metrics` — define custom metric.
- `POST /events` — push one event.
- `POST /event-bulk-create-jobs` — push many events.
- Common filters on `/events`: `equals(metric_id,"...")`, `equals(profile_id,"...")`, `greater-or-equal(datetime,...)`.

### Catalogs

- `GET /catalog-items`, `/catalog-categories`, `/catalog-variants`.
- `POST /catalog-items` (create), `PATCH /catalog-items/{id}` (update), `DELETE` (remove).
- Bulk: `/catalog-item-bulk-create-jobs`, `/catalog-item-bulk-update-jobs`, `/catalog-item-bulk-delete-jobs`. Same triplet exists for categories and variants.

### Coupons

- `GET /coupons`, `GET /coupons/{id}`, `POST /coupons`, `PATCH /coupons/{id}`, `DELETE /coupons/{id}`.
- `GET /coupon-codes`, `POST /coupon-codes`, `PATCH /coupon-codes/{id}`, `DELETE /coupon-codes/{id}`.
- `POST /coupon-code-bulk-create-jobs` — bulk codes.

### Forms

- `GET /forms`, `GET /forms/{id}` — form metadata.
- `GET /form-versions/{id}` — published version.
- `POST /form-values-reports/` and `/form-series-reports/` — form performance.

### Templates

- `GET /templates`, `GET /templates/{id}`.
- `POST /templates`, `PATCH /templates/{id}`, `DELETE /templates/{id}`.
- `POST /template-render` — render a template.
- `POST /template-clone` — clone.
- `GET /template-universal-content`, `POST /template-universal-content` — saved blocks.

### Tags

- `GET /tags`, `GET /tag-groups` — taxonomy.
- `POST /tags`, `PATCH /tags/{id}`, `DELETE /tags/{id}`.

### Webhooks

Requires Advanced KDP plan; on standard plans these endpoints return HTTP 403 `permission_denied` "You must have Advanced KDP enabled to use this endpoint."

> Profile deletion is not supported via `DELETE /profiles/{id}` (returns HTTP 405). Use `POST /data-privacy-deletion-jobs` (async GDPR) or the Klaviyo UI to remove a profile and its events. For send-prevention without erasure, use `POST /profile-suppression-bulk-create-jobs`.

> JSON:API to-many relationship endpoints (`POST|DELETE /lists/{id}/relationships/profiles`, etc.) accept a body with `data: [{type:"profile", id:"..."}, ...]`. The proxy passes this through unchanged. Older proxy releases (before the array-passthrough fix) wrap the array under `attributes`, which Klaviyo rejects with `'list' is not the resource type expected at this endpoint. 'profile' is the expected resource type.` Update to a build that contains the fix.

- `GET /webhooks`, `GET /webhooks/{id}`.
- `POST /webhooks`, `PATCH /webhooks/{id}`, `DELETE /webhooks/{id}`.
- `GET /webhook-topics` — available topics.

### Conversations (SMS, WhatsApp)

GA in revision `2026-04-15`. Conversation endpoints sit on the SMALL rate-limit tier (3/s burst, 60/min steady).

- `POST /conversations/message` — send outbound SMS or WhatsApp message. Channel resolved automatically from the conversation. Body identifies recipient by `email` or `phone_number`.
- `GET /conversations/{id}` — one conversation thread.
- `GET /conversations/{id}/messages` — messages in a thread.
- `GET /profiles/{id}/conversation` — most-recent thread for a profile.
- Use `?include=conversation` on profile reads to inline thread metadata.

### Accounts

- `GET /accounts` — returns the single account associated with the API key. Use `fields[account]=contact_information,timezone,preferred_currency,public_api_key` to pull only what is needed. Burst rate limit `1/s`.
- `GET /accounts/{id}` — same shape, by id.

### Tracking Settings

- `GET /tracking-settings` — list (one row per account).
- `GET /tracking-settings/{account_id}` — current UTM and custom-parameter rules.
- `PATCH /tracking-settings/{account_id}` — update. Each parameter has `campaign` and `flow` slots, both `{type:"static", value:"..."}`. `custom_parameters` accepts an array of `{name, campaign?, flow?}`.

### Reviews

- `GET /reviews`, `GET /reviews/{id}` — ratings, content, author, images, custom-question answers.
- `POST /reviews` — create. Required attributes: `author`, `content`. Optional: `rating` (1–5), `title`, `incentive_type`, `images[]`, `custom_questions[]`. Optional `relationships.order`.
- `PATCH /reviews/{id}` — moderate (publish, unpublish, hide).
- `DELETE /reviews/{id}` — remove.
- `GET /reviews/{id}/relationships/event`, `/item`, `/relationships/order` — joined resources.

### Images

- `GET /images`, `GET /images/{id}` — name, format, size, hidden flag, image_url.
- `POST /images` — upload by URL. Required: `name`, `image_url`, `format`, `size`, `hidden`.
- `POST /image-upload` — multipart upload from raw bytes.
- `PUT /images/{id}` — update (rename, hide).
- `DELETE /images/{id}`.

### Web Feeds

Web feeds let templates pull external JSON or RSS at render time.

- `GET /web-feeds`, `GET /web-feeds/{id}`.
- `POST /web-feeds` — create. Required: `url`, `name`, `request_method` (`GET` only today), `content_type` (`json` or `rss`).
- `PATCH /web-feeds/{id}`, `DELETE /web-feeds/{id}`.

### Data Sources

- `GET /data-sources`, `GET /data-sources/{id}` — connected systems (Shopify, Stripe, custom integrations).
- `GET /data-sources/{id}/relationships/events` — events flowing from a data source.

### Custom Objects

Klaviyo lets you define custom resource shapes that profiles can relate to.

- `GET /custom-objects` — list defined custom-object types.
- `POST /custom-objects` — create. Body `{type:"custom_object", attributes:{external_id, ...freeform}}`.
- `GET /custom-objects/{id}`, `PUT /custom-objects/{id}`, `DELETE /custom-objects/{id}`.

### Back-in-Stock Subscriptions

- `POST /back-in-stock-subscriptions` — register a profile to receive a notification when a catalog variant is back. Required `relationships.variant.data.id` and `relationships.profile`.

### Data Privacy

- `POST /data-privacy-deletion-jobs` — schedule a GDPR / CCPA deletion. Body identifies the profile by id, email, or phone_number.

### Push Tokens

- `POST /push-tokens` — register a device push token for a profile. Required: `token`, `platform` (`ios` or `android`), `vendor` (`apns` or `fcm`), `profile.data.attributes`.
- `DELETE /push-tokens/{id}` — unregister.

### Server-side Track and Identify (not reachable via this proxy)

The legacy `/track` and `/identify` endpoints take Klaviyo's public site token, not the Private API Key the proxy injects. Use `POST /events` and `POST /profiles` instead — they accept the Private API Key and return JSON:API responses with sparse-field control.

## Canonical example

Find a profile by email with sparse fields:

```bash
curl -X GET "$PUBLIC_URL/accounts/dunder-mifflin/connections/klaviyo/api/profiles?filter=equals(email,%22jane@example.com%22)&fields[profile]=email,first_name,last_name,subscriptions" \
  -H "Authorization: Bearer $BEARER_TOKEN"
```

## Bulk job pattern

Long-running operations follow a job pattern:

1. `POST /<resource>-bulk-<action>-jobs` with attributes and a `relationships.profiles.data` array.
2. The response returns a job id and status.
3. Poll `GET /<resource>-bulk-<action>-jobs/{id}` until status is `complete` or `error`.
4. Read the resulting resources via the normal `GET /<resource>` paths.

## Pitfalls

- Email and SMS metrics differ. Use `filter=equals(send_channel,...)` on reports and never average rates across channels.
- Klaviyo's attributed conversion value is not Shopify revenue. Name the attribution model when reporting.
- Custom date ranges should stay within a calendar month per request to keep responses fast and avoid attribution-window edge effects (Klaviyo's 5-day click window bleeds across month edges if you stretch ranges).
- Rate limits are strict. Pre-plan filters and sparse fields rather than over-paginating.
- Segment name matching is client-side only. Do not call `filter=contains(name,...)`; it is not supported.
