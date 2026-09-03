# Google Ads

Studio exposes the Google Ads REST API verbatim. The Worker handles auth, refresh-token rotation, the developer token header, and rate limiting. The agent calls Google's native paths.

## Agent Tool

Pass `connection_id`, `method`, `path`, `params`, and `body` to Studio `connections_execute` or `POST /connections/{connection_id}`. Use official Google Ads REST paths including the current version, such as `/v25/customers/{customer_id}/googleAds:searchStream`. Put GAQL in the JSON body. Do not include `googleads.googleapis.com`, OAuth tokens, `developer-token`, `login-customer-id`, auth headers, or API keys.

Upstream: https://developers.google.com/google-ads/api/rest/overview and https://developers.google.com/google-ads/api/docs/release-notes. Confirm the current REST version before a new call. Catalog examples below use `/v23/`; replace that segment with the current version.

## Endpoint

```text
ANY /accounts/{account_id}/connections/google-ads/<api-path>
```

Studio prepends `https://googleads.googleapis.com` only. Always include the REST version in `path` (`/v25/customers/{customer_id}/googleAds:search`). Studio injects:

- `Authorization: Bearer <access_token>` (refreshed on demand)
- `developer-token: <developer_token>`
- `login-customer-id: <login_customer_id>` when present on the credential
- `linked-customer-id: <id>` only on third-party-app analytics conversion uploads

Two placeholders are substituted before the request:

- `{customer_id}` → operating account customer id (no dashes).
- `{login_customer_id}` → manager (MCC) id, when present.

Auth is automatic. Never include access tokens, developer tokens, or `login-customer-id` in agent calls.

## Token-saving conventions

- `searchStream` over paginated `search` for analytics — server-streamed, fewer round trips.
- `?validateOnly=true` on mutate endpoints to dry-run.
- Field masks on update operations: every `update` op needs `update_mask` (FieldMask) listing the fields you intend to write.
- `responseContentType: "RESOURCE_NAME_ONLY"` shrinks mutate responses; default is `MUTABLE_RESOURCE`.
- Project the smallest GAQL `SELECT` set; only add `segments.*` you actually need.
- Date macros: `DURING LAST_30_DAYS`, `DURING THIS_MONTH`, `DURING LAST_MONTH`, or custom: `WHERE segments.date BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD'`.

## Rate limit

Three access levels (Test / Basic / Standard). Basic = 15,000 ops/day + 1,000 GET/day per developer token. Standard = unlimited subject to per-customer rate limits. Quota errors return HTTP 429 with `QuotaError.RESOURCE_EXHAUSTED` and a `RetryInfo` proto. On a 429/5xx, the Worker retries up to 3 times with a 1 second backoff base — there is no enforced spacing between successful calls.

## GAQL primer

Reads use `GoogleAdsService`:

- `POST /v23/customers/{customer_id}/googleAds:searchStream` — server-streamed; preferred for analytics. Body: `{ "query": "<GAQL>", "summaryRowSetting": "..." }`.
- `POST /v23/customers/{customer_id}/googleAds:search` — paged. Body: `{ "query", "pageToken", "pageSize", "returnTotalResultsCount", "summaryRowSetting", "validateOnly" }`.

GAQL clauses:

- `SELECT` — resource attributes, metrics, segments.
- `FROM` — exactly one resource. The resource governs which metrics and segments are valid.
- `WHERE` — operators `=`, `!=`, `>`, `<`, `IN`, `NOT IN`, `LIKE`, `CONTAINS`, `DURING`, `BETWEEN`, `IS NULL`, `IS NOT NULL`.
- `ORDER BY` — `ASC | DESC`.
- `LIMIT` — bounded row cap.
- `PARAMETERS include_drafts = true` — optional.

Date macros usable in `DURING`: `TODAY`, `YESTERDAY`, `LAST_7_DAYS`, `LAST_BUSINESS_WEEK`, `THIS_MONTH`, `LAST_MONTH`, `LAST_14_DAYS`, `LAST_30_DAYS`, `THIS_WEEK_SUN_TODAY`, `THIS_WEEK_MON_TODAY`, `LAST_WEEK_SUN_SAT`, `LAST_WEEK_MON_SUN`.

Metrics semantics:

- `metrics.cost_micros` — int64; cost in account-currency micros (divide by 1e6).
- `metrics.conversions` / `metrics.conversions_value` — primary conversions only (`conversion_action.include_in_conversions_metric = true`).
- `metrics.all_conversions` / `metrics.all_conversions_value` — every conversion action including non-primary.
- Adding any `segments.*` field splits rows per segment combination.

```sql
SELECT
  campaign.id,
  campaign.name,
  campaign.status,
  metrics.cost_micros,
  metrics.clicks,
  metrics.conversions
FROM campaign
WHERE segments.date DURING LAST_30_DAYS
  AND campaign.status = 'ENABLED'
ORDER BY metrics.cost_micros DESC
LIMIT 50
```

## Reportable resources (v23 `FROM`)

Core entities: `customer`, `campaign`, `campaign_budget`, `campaign_criterion`, `ad_group`, `ad_group_ad`, `ad_group_criterion`, `bidding_strategy`, `accessible_bidding_strategy`, `asset`, `asset_group`, `asset_group_asset`, `asset_group_listing_group_filter`, `asset_set`, `asset_set_asset`, `audience`, `user_list`, `combined_audience`, `conversion_action`, `conversion_value_rule`, `conversion_value_rule_set`, `customer_client`, `customer_client_link`, `customer_manager_link`, `customer_user_access`, `feed`, `feed_item`, `feed_mapping`, `extension_feed_item`, `recommendation`, `change_event`, `change_status`, `label`, `customer_label`, `campaign_label`, `ad_group_label`.

Performance views (segmented metrics): `keyword_view`, `search_term_view`, `landing_page_view`, `expanded_landing_page_view`, `geographic_view`, `user_location_view`, `age_range_view`, `gender_view`, `parental_status_view`, `income_range_view`, `shopping_performance_view`, `product_group_view`, `display_keyword_view`, `topic_view`, `video`, `click_view`, `dynamic_search_ads_search_term_view`, `paid_organic_search_term_view`, `webpage_view`, `campaign_audience_view`, `ad_group_audience_view`.

Keyword Planner resources: `keyword_plan`, `keyword_plan_campaign`, `keyword_plan_campaign_keyword`, `keyword_plan_ad_group`, `keyword_plan_ad_group_keyword`. (`keyword_plan_idea` is a service RPC, not a `FROM` resource.)

Billing: `billing_setup`, `account_budget`, `account_budget_proposal`, `invoice` (typically retrieved via `InvoiceService.list_invoices`).

## Common segments

- `segments.date` (YYYY-MM-DD), `segments.week`, `segments.month`, `segments.quarter`, `segments.year`.
- `segments.day_of_week` (`MONDAY`..`SUNDAY`).
- `segments.hour` (0–23).
- `segments.device` (`MOBILE`, `TABLET`, `DESKTOP`, `CONNECTED_TV`, `OTHER`, `UNKNOWN`, `UNSPECIFIED`).
- `segments.ad_network_type` (`SEARCH`, `SEARCH_PARTNERS`, `CONTENT`, `YOUTUBE_SEARCH`, `YOUTUBE_WATCH`, `MIXED`, `UNKNOWN`, `UNSPECIFIED`).
- `segments.click_type`, `segments.conversion_action`, `segments.conversion_action_category`, `segments.conversion_action_name`.
- `segments.geo_target_country`, `segments.product_*` (Shopping breakdowns).

## Mutate services

All mutate endpoints follow:

```text
POST /v23/customers/{customer_id}/<collection>:mutate
Body: {
  "operations": [
    { "create": { ... } },
    { "update": { ..., "resource_name": "..." }, "update_mask": "name,status" },
    { "remove": "<resource_name>" }
  ],
  "validateOnly": false,
  "partialFailure": true,
  "responseContentType": "RESOURCE_NAME_ONLY"
}
```

Available services on v23:

- `campaigns:mutate`
- `campaignBudgets:mutate`
- `campaignCriteria:mutate`
- `adGroups:mutate`
- `adGroupAds:mutate`
- `adGroupCriteria:mutate`
- `assets:mutate` (assets are immutable; `update`/`remove` are limited; `create` dominant)
- `assetGroups:mutate`
- `assetGroupAssets:mutate`
- `assetGroupListingGroupFilters:mutate`
- `conversionActions:mutate`
- `conversionValueRules:mutate`
- `conversionValueRuleSets:mutate`
- `customerNegativeCriteria:mutate` (create / remove only)
- `userLists:mutate`
- `biddingStrategies:mutate`
- `customers:mutate` (update only; cannot create via API)

Cross-resource: `POST /v23/customers/{customer_id}/googleAds:mutate` accepts a heterogeneous `MutateOperation` list — useful for atomic creation across resource types.

## Account discovery

- `GET /v25/customers:listAccessibleCustomers` — every customer the OAuth grant can see, including other Hello Gafaro clients. Returns `{ "resourceNames": ["customers/<id>", ...] }`. Ignores `{customer_id}`. Identify the operating account with `SELECT customer.id, customer.descriptive_name FROM customer` before querying metrics. Do not use the first id.
- Hierarchy walk: GAQL on `customer_client` selecting `customer_client.client_customer`, `customer_client.level`, `customer_client.manager`, `customer_client.descriptive_name`, `customer_client.currency_code`, `customer_client.time_zone`, `customer_client.id`. Filter `WHERE customer_client.level <= 1` and recurse.

## Conversions

- `POST /v23/customers/{customer_id}:uploadClickConversions` — body `{ "conversions": [ClickConversion], "partialFailure": bool, "validateOnly": bool, "debugEnabled": bool }`. Each `ClickConversion` requires `conversionAction`, `conversionDateTime` (`YYYY-MM-DD HH:MM:SS+TZ`), `conversionValue`, `currencyCode`, plus identifier (`gclid`, `gbraid`, `wbraid`, or enhanced `userIdentifiers`).
- `POST /v23/customers/{customer_id}:uploadCallConversions` — same shape with `CallConversion` (`callerId`, `callStartDateTime`).
- `POST /v23/customers/{customer_id}:uploadConversionAdjustments` — restate past conversions.

Customer Match / store-sales:

- `POST /v23/customers/{customer_id}/offlineUserDataJobs:create` — `{ "job": { "type": "CUSTOMER_MATCH_USER_LIST" | "STORE_SALES_UPLOAD_FIRST_PARTY" | ..., "customerMatchUserListMetadata": { "userList": "customers/<id>/userLists/<id>", "consent": {...} } } }`.
- `POST /v23/{resourceName}:addOperations` — `{ "operations": [{ "create": <UserData> | "remove": <UserData> }], "enablePartialFailure": true, "enableWarnings": true }`.
- `POST /v23/{resourceName}:run` — long-running operation; poll status via GAQL `FROM offline_user_data_job`.

## Recommendations

- Read via GAQL on `recommendation` (and `recommendation_subscription`).
- `POST /v23/customers/{customer_id}/recommendations:apply` — body `{ "operations": [ApplyRecommendationOperation], "partialFailure": bool }`. Each op has `resourceName` plus a oneof apply-parameters (`campaignBudget`, `textAd`, `keyword`, `targetCpaOptIn`, `targetRoasOptIn`, `forecastingSetTargetRoas`, `calloutExtension`, `useBroadMatchKeyword`, `leadFormAsset`, …).
- `POST /v23/customers/{customer_id}/recommendations:dismiss` — `{ "operations": [{ "resourceName": "..." }] }`.
- `POST /v23/customers/{customer_id}/recommendationSubscriptions:mutate` — manage auto-apply subscriptions.

## Keyword Planning

`KeywordPlanIdeaService` (no `customers/{id}` segment in path; `customer_id` is a body field):

- `POST /v23/customers/{customer_id}:generateKeywordIdeas` — body requires one of `urlSeed`, `keywordSeed`, `keywordAndUrlSeed`; plus `language`, `geoTargetConstants`, `keywordPlanNetwork` (`GOOGLE_SEARCH` or `GOOGLE_SEARCH_AND_PARTNERS`), `includeAdultKeywords`, `pageSize`, `pageToken`, `keywordAnnotation`, `aggregateMetrics`.
- `POST /v23/customers/{customer_id}:generateKeywordHistoricalMetrics` — `{ "keywords": [...], "language", "geoTargetConstants", "keywordPlanNetwork" }`.
- `POST /v23/customers/{customer_id}:generateKeywordForecastMetrics` — `{ "campaign": <CampaignToForecast>, "forecastPeriod": { "startDate", "endDate" } }`. Max 30-day window starting tomorrow.
- `POST /v23/customers/{customer_id}:generateAdGroupThemes` — theme suggestions.

`KeywordPlanService` mutate plus `POST /v23/customers/{customer_id}/keywordPlans:generateForecastMetrics`, `:generateForecastCurve`, `:generateForecastTimeSeries`, `:generateHistoricalMetrics`.

## Billing and invoicing

- `POST /v23/customers/{customer_id}/billingSetups:mutate` — create / remove only (no update).
- `POST /v23/customers/{customer_id}/accountBudgetProposals:mutate` — proposals create / update / remove.
- `account_budget` and `account_budget_proposal` read via GAQL.
- `GET /v23/customers/{customer_id}/invoices:list?billingSetup=<rn>&issueYear=YYYY&issueMonth=<MonthOfYear>` — issued invoices. (`includeGranularLevelInvoiceDetails` was added in v23 — not on v23.)

## Canonical example

Top-spend campaigns for the last 30 days:

```bash
curl -X POST "$PUBLIC_URL/accounts/dunder-mifflin/connections/google-ads/v25/customers/{customer_id}/googleAds:searchStream" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":"SELECT campaign.id, campaign.name, campaign.status, metrics.cost_micros, metrics.clicks, metrics.conversions, metrics.conversions_value FROM campaign WHERE segments.date DURING LAST_30_DAYS AND campaign.status = \"ENABLED\" ORDER BY metrics.cost_micros DESC LIMIT 50"}'
```

## Pitfalls

- `cost_micros` is micros — divide by 1e6 for currency units.
- Manager (MCC) accounts cannot serve ads. Query against the operating customer id with the manager id in `login-customer-id` (the Worker handles this when both are present on the credential).
- `metrics.conversions` and `metrics.conversions_value` reflect only "primary" conversion actions. Use `metrics.all_conversions` for every action.
- `keyword_view` does not support `segments.conversion_action` in this version — pull conversion-scoped metrics from `ad_group` or `campaign`.
- `ORDER BY` and `LIMIT` are required for stable top-N reads. Without them paginated streams may shuffle.
- `metrics.search_impression_share` and lost-IS metrics are floats in `[0,1]` with thresholding (Google returns `null` below significance). Always pass an `metrics.impressions` minimum filter.
- Mutates respect `partialFailure=true` only when explicitly set. Without it, one bad operation rejects the whole batch.
- `validateOnly=true` is the dry-run flag — use it before any large write. On success the response body is empty `{}` (no `results` array). Do not mistake this for a failure.
- Prefer `googleAds:searchStream` over `googleAds:search`. The paginated `:search` endpoint returns `PAGE_SIZE_NOT_SUPPORTED` for some queries on v23; `searchStream` has no such restriction and matches the common-case access pattern.
- Include the current REST version in every path. Studio does not pin or rewrite it. A 404 for `/v23/v25/customers:` means Studio still prepended a version; report that as a Studio bug rather than omitting `/v25`.
