# Google Analytics (GA4)

Studio exposes the GA4 Data API and Admin API verbatim. The Worker handles auth, host selection (by URL prefix), and rate limiting.

## Agent Tool

Use the single `googleAnalytics` provider tool with HTTPie/Postman-style input: `account_id`, `method`, provider-relative `url`, `params`, and `body`. Use `/data/...` for GA4 Data API and `/admin/...` for Admin API, such as `/data/v1beta/properties/123:runReport` or `/admin/v1beta/accountSummaries`. Do not include Google hosts, OAuth tokens, auth headers, or API keys.

Upstream:

- Data API: https://developers.google.com/analytics/devguides/reporting/data/v1
- Admin API: https://developers.google.com/analytics/devguides/config/admin/v1

## Endpoint

```text
ANY /accounts/{account_id}/connections/google-analytics/<api-path>
```

The first path segment selects the host:

- `/data/...` → `https://analyticsdata.googleapis.com/...` (Data API).
- `/admin/...` → `https://analyticsadmin.googleapis.com/...` (Admin API).

Anything else returns `400`. The `/data/` or `/admin/` prefix is **stripped** before the upstream call. Examples:

- `POST /accounts/{account_id}/connections/google-analytics/data/v1beta/properties/123:runReport` → `POST https://analyticsdata.googleapis.com/v1beta/properties/123:runReport`.
- `GET /accounts/{account_id}/connections/google-analytics/admin/v1beta/accountSummaries` → `GET https://analyticsadmin.googleapis.com/v1beta/accountSummaries`.

`Authorization: Bearer <access_token>` is injected with rotation. Auth is automatic.

## Token-saving conventions

- Project the smallest dimension and metric set. High-cardinality dimensions like `pagePath` cost more.
- `dateRanges:[{startDate, endDate}]` accepts ISO `YYYY-MM-DD` or shorthands (`7daysAgo`, `today`, `yesterday`).
- `limit` and `offset` for pagination on `runReport`. Max 250,000 rows per call. For larger pulls split by date.
- `metricAggregations: ["TOTAL", "MAXIMUM", "MINIMUM", "COUNT"]` returns aggregate rows alongside data.
- `returnPropertyQuota: true` echoes quota use — useful when chaining calls.

## Rate limit

GA4 enforces per-property tokens (Core, Realtime, Funnel) plus daily concurrent and project-level limits. On a 429/5xx, the Worker retries up to 3 times with a 500 ms backoff base — there is no enforced spacing between successful calls. Heavy scans should use `dimensionFilter` to push selection upstream.

## Per-domain catalog

### Data API (reporting) — `/data/v1beta/...`

| Method | Path |
|---|---|
| `runReport` | `POST /v1beta/properties/{property_id}:runReport` |
| `runPivotReport` | `POST /v1beta/properties/{property_id}:runPivotReport` |
| `batchRunReports` | `POST /v1beta/properties/{property_id}:batchRunReports` (max 5 sub-requests) |
| `batchRunPivotReports` | `POST /v1beta/properties/{property_id}:batchRunPivotReports` (max 5) |
| `runRealtimeReport` | `POST /v1beta/properties/{property_id}:runRealtimeReport` |
| `checkCompatibility` | `POST /v1beta/properties/{property_id}:checkCompatibility` |
| `getMetadata` | `GET /v1beta/properties/{property_id}/metadata` (use `properties/0` for universal metadata) |

Funnel report is alpha-only:

- `runFunnelReport` — `POST /v1alpha/properties/{property_id}:runFunnelReport`. Body requires `dateRanges` + `funnel.steps[]`; supports `funnelBreakdown.breakdownDimension`, `funnelEventFilter`, `funnelFieldFilter`, `orGroup`/`andGroup`/`notExpression`.

#### `runReport` body

Required: `dateRanges[]` (`{startDate, endDate}`), `dimensions[]` (`{name, dimensionExpression?}`), `metrics[]` (`{name, expression?, invisible?}`).

Optional: `dimensionFilter`, `metricFilter`, `offset` (string), `limit` (string, default 10,000, max 250,000), `metricAggregations[]` (`TOTAL`/`MINIMUM`/`MAXIMUM`/`COUNT`), `orderBys[]` (`metric|dimension|pivot`, `desc`), `currencyCode` (ISO 4217), `cohortSpec`, `keepEmptyRows`, `returnPropertyQuota`, `comparisons[]`.

#### Filter expressions

`FilterExpression` = one of `andGroup{expressions[]}`, `orGroup{expressions[]}`, `notExpression{expression}`, `filter{fieldName, ...}`. Inner `filter` variants:

- `stringFilter` — `matchType` ∈ `EXACT`, `BEGINS_WITH`, `ENDS_WITH`, `CONTAINS`, `FULL_REGEXP`, `PARTIAL_REGEXP`. `value`, `caseSensitive`.
- `inListFilter` — `values[]`, `caseSensitive`.
- `numericFilter` — `operation` ∈ `EQUAL`, `LESS_THAN`, `LESS_THAN_OR_EQUAL`, `GREATER_THAN`, `GREATER_THAN_OR_EQUAL`. `value{int64Value|doubleValue}`.
- `betweenFilter` — `fromValue`, `toValue`.
- `emptyFilter` — no params.

#### Pivots, cohorts, comparisons

- `pivots[]`: `fieldNames[]`, `orderBys[]`, `offset`, `limit`, `metricAggregations[]`.
- `cohortSpec`: `cohorts[]` (`name`, `dimension`, `dateRange`), `cohortsRange{granularity, startOffset, endOffset}`, `cohortReportSettings.accumulate`.
- `comparisons[]`: `name` plus inline `dimensionFilter` or referenced saved comparison.

#### Confirmed dimension API names

`date`, `dateHour`, `country`, `region`, `city`, `deviceCategory`, `operatingSystem`, `browser`, `pagePath`, `pageTitle`, `landingPagePlusQueryString`, `sessionSource`, `sessionMedium`, `sessionCampaignName`, `firstUserSource`, `firstUserMedium`, `firstUserCampaignName`, `eventName`, `language`, `audienceName`, `userAgeBracket`, `userGender`.

#### Confirmed metric API names

`activeUsers`, `newUsers`, `totalUsers`, `sessions`, `engagedSessions`, `engagementRate`, `bounceRate`, `averageSessionDuration`, `screenPageViews`, `screenPageViewsPerUser`, `eventCount`, `eventCountPerUser`, **`keyEvents`** (replaces `conversions`), `purchaseRevenue`, `totalRevenue`, `transactions`, `ecommercePurchases`, `addToCarts`, `checkouts`, `itemRevenue`, `averageEngagementTime`, `userEngagementDuration`.

#### Realtime

`runRealtimeReport` accepts `dimensions`, `metrics`, `dimensionFilter`, `metricFilter`, `limit`, `metricAggregations`, `orderBys`, `returnPropertyQuota`, `minuteRanges[]` (last 30 minutes). Realtime metric / dimension list is narrower than core — read `metadata?type=REALTIME` for the allowed set.

### Admin API — `/admin/v1beta/...` and `/admin/v1alpha/...`

#### Account summaries / accounts (v1beta)

| Method | Path |
|---|---|
| `accountSummaries.list` | `GET /v1beta/accountSummaries` (`pageSize` ≤ 200, `pageToken`) |
| `accounts.list` | `GET /v1beta/accounts` |
| `accounts.get` | `GET /v1beta/accounts/{account}` |
| `accounts.patch` | `PATCH /v1beta/accounts/{account}` |
| `accounts.delete` | `DELETE /v1beta/accounts/{account}` (soft-delete) |
| `accounts.provisionAccountTicket` | `POST /v1beta/accounts:provisionAccountTicket` |
| `accounts.searchChangeHistoryEvents` | `POST /v1beta/accounts:searchChangeHistoryEvents` |
| `accounts.runAccessReport` | `POST /v1beta/accounts/{account}:runAccessReport` |
| `accounts.getDataSharingSettings` | `GET /v1beta/accounts/{account}/dataSharingSettings` |

#### Properties (v1beta)

- `GET /v1beta/properties?filter=parent:accounts/{id}` (filter required).
- `GET /v1beta/properties/{id}`.
- `POST /v1beta/properties` — create.
- `PATCH /v1beta/properties/{id}` — requires `updateMask`.
- `DELETE /v1beta/properties/{id}`.
- `POST /v1beta/properties/{id}:runAccessReport`.
- `GET|PATCH /v1beta/properties/{id}/dataRetentionSettings`.

#### Data streams + measurement protocol secrets (v1beta)

- `properties/{id}/dataStreams` — `POST` create, `GET` list, `GET` get, `PATCH` patch, `DELETE` delete.
- `dataStreams/{stream}/measurementProtocolSecrets` — `list`, `get`, `create`, `patch`, `delete`.

#### Custom dimensions / metrics / key events (v1beta)

For each of `customDimensions`, `customMetrics`, `keyEvents`:

- `POST /v1beta/properties/{id}/{collection}` — create.
- `GET /v1beta/properties/{id}/{collection}` — list.
- `GET /v1beta/properties/{id}/{collection}/{name}`.
- `PATCH /v1beta/properties/{id}/{collection}/{name}`.
- For dimensions / metrics: `POST .../{name}:archive` (no DELETE; archive is the deletion path).
- `keyEvents` supports `DELETE` and **replaces** the deprecated `conversionEvents` resource.

#### Links (v1beta)

`googleAdsLinks` and `firebaseLinks`:

- `list`, `get`, `create`, `patch`, `delete` under `/v1beta/properties/{id}/{collection}`.

#### Alpha-only resources — `/admin/v1alpha/...`

- `properties/{id}/audiences` — `create`, `list`, `get`, `patch`, plus `POST .../{name}:archive`.
- `properties/{id}/accessBindings` — `create`, `list`, `get`, `patch`, `delete`, plus `:batchCreate`, `:batchGet`, `:batchUpdate`, `:batchDelete`. Same suite under `accounts/{id}/accessBindings`.
- `properties/{id}/channelGroups` — CRUD. Has `primary` field.
- `properties/{id}/displayVideo360AdvertiserLinks` and `displayVideo360AdvertiserLinkProposals`.
- `properties/{id}/searchAds360Links` — CRUD.
- `properties/{id}/adSenseLinks`, `bigQueryLinks`, `expandedDataSets`, `calculatedMetrics`, `reportingDataAnnotations`.
- `properties/{id}/subpropertyEventFilters`, `subpropertySyncConfigs`, `rollupPropertySourceLinks`.
- `properties/{id}/dataStreams/{stream}/eventCreateRules`, `eventEditRules`, `sKAdNetworkConversionValueSchema`.
- `GET|PATCH /v1alpha/properties/{id}/attributionSettings`.
- `GET|PATCH /v1alpha/properties/{id}/reportingIdentitySettings`.

#### Conversion events (deprecated)

`v1alpha/.../conversionEvents` `GET`/`POST`/`PATCH`/`DELETE` remain for backwards compatibility but are explicitly superseded by `keyEvents` in v1beta.

#### Access report (v1beta)

`POST /v1beta/properties/{id}:runAccessReport` and `POST /v1beta/accounts/{id}:runAccessReport` — body has `dateRanges[]`, `dimensions[].dimensionName`, `metrics[].metricName`, `dimensionFilter.accessFilter`, `metricFilter.accessFilter`, `orderBys[]`, `limit`, `offset`, `timeZone`, `expandGroups`. Records retained 2 years; admin-only.

## Canonical example

Top landing pages last 30 days:

```bash
curl -X POST "$PUBLIC_URL/accounts/dunder-mifflin/connections/google-analytics/data/v1beta/properties/PROPERTY_ID:runReport" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"dateRanges":[{"startDate":"30daysAgo","endDate":"yesterday"}],"dimensions":[{"name":"landingPagePlusQueryString"}],"metrics":[{"name":"sessions"},{"name":"keyEvents"}],"orderBys":[{"metric":{"metricName":"sessions"},"desc":true}],"limit":25}'
```

## Pitfalls

- The `/data/` and `/admin/` prefixes are routing markers used by the Worker, not part of the upstream URL. They are stripped before the upstream call.
- API names differ from UI labels. Read `properties/{property_id}/metadata` before guessing custom dimension or metric names.
- GA4 reports include sampling and thresholding (low-volume rows are suppressed). Don't compare 1:1 with Shopify orders or ad-platform impressions.
- `runRealtimeReport` accepts a much smaller dimension / metric set than `runReport`.
- `purchaseRevenue` is GA4 ecommerce; `totalRevenue` includes ad revenue and in-app purchases. Pick deliberately.
- Custom metrics are typed (`STANDARD`, `CURRENCY`, `FEET`, `METERS`, `MILLISECONDS`, `SECONDS`, `MINUTES`, `HOURS`). Wrong units break aggregations silently.
- Quota errors usually surface as 429 with `RESOURCE_EXHAUSTED`. Split queries by date or shrink dimension cardinality.
- `keyEvents` replaced `conversionEvents` in v1beta. Older code or docs that reference `conversionEvents` need updating; the Data API metric `keyEvents` replaces the old `conversions` metric.
- `runFunnelReport` remains v1alpha-only — do not assume v1beta.
- Many newer surfaces (audiences, accessBindings, channelGroups, attribution, link types beyond Ads/Firebase, calculated metrics) live only in `/admin/v1alpha/...`.
- Admin API uses long resource names (`properties/123/customDimensions/456`). Don't confuse `name` (full path) with `parameterName` / `displayName`.
