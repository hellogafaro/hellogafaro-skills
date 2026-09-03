# Search Console

Studio exposes the Google Search Console APIs verbatim. The Worker handles auth, host selection (by URL prefix), and rate limiting.

## Agent Tool

Pass `connection_id`, `method`, `path`, `params`, and `body` to Studio `connections_execute` or `POST /connections/{connection_id}`. Use `/webmasters/` for Sites, Sitemaps, and Search Analytics, or `/v1/urlInspection/` for URL Inspection. Keep those prefixes; they are part of the upstream path. Do not include Google hosts, OAuth tokens, auth headers, or API keys.

Upstream:

- Webmasters / Search Analytics / Sitemaps / Sites: https://developers.google.com/webmaster-tools/v1/api_reference_index
- URL Inspection: https://developers.google.com/webmaster-tools/v1/urlInspection.index

## Endpoint

```text
ANY /accounts/{account_id}/connections/google-search-console/<api-path>
```

The first path segment selects the host:

- `/webmasters/...` → `https://www.googleapis.com/webmasters/...` (Search Analytics, Sites, Sitemaps).
- `/v1/urlInspection/...` → `https://searchconsole.googleapis.com/v1/urlInspection/...` (URL Inspection).

Both prefixes are forwarded **verbatim** — they are part of the upstream URL, not stripped. Anything else returns `400`. `Authorization: Bearer <access_token>` is injected with rotation. Auth is automatic.

`siteUrl` path segments must be percent-encoded:

- URL-prefix property: `https%3A%2F%2Fexample.com%2F` (trailing slash matters).
- Domain property: `sc-domain%3Aexample.com`.

`feedpath` for sitemaps follows the same encoding rule (full sitemap URL, percent-encoded).

Required OAuth scopes: `https://www.googleapis.com/auth/webmasters.readonly` for reads, `https://www.googleapis.com/auth/webmasters` for `PUT`/`DELETE` on sites/sitemaps and for URL inspection writes.

## Token-saving conventions

- Always pass `dimensions[]` (subset of `query, page, country, device, searchAppearance, date, hour`) — every additional dimension multiplies row counts.
- `rowLimit` defaults to 1,000 and caps at 25,000. Use `startRow` for pagination.
- `dataState` defaults to `final`. Pass `all` for fresh-but-not-final 48–72 h. The `hour` dimension requires `dataState: hourly_all`.
- `type` defaults to `web`. Use `discover`, `googleNews`, `news`, `image`, `video` to scope.
- Always pass narrow `startDate` / `endDate` (≤ 16 months back, max range 16 months).

## Rate limit

- All resources except URL Inspection: 200 QPM and 20 QPS per user, 100,000,000 QPD per project.
- Search Analytics: 1,200 QPM per site, 1,200 QPM per user, 40,000 QPM and 30,000,000 QPD per project. Tracked in 10-minute and 1-day buckets.
- URL Inspection: 600 QPM and 2,000 QPD per site, 15,000 QPM and 10,000,000 QPD per project — much stricter than the rest.

On a 429/5xx, the Worker retries up to 3 times with a 500 ms backoff base — there is no enforced spacing between successful calls.

## Per-domain catalog

### Sites

- `GET /webmasters/v3/sites` — every property the OAuth user can access. Each `WmxSite` returns `siteUrl` and `permissionLevel` (`siteOwner`, `siteFullUser`, `siteRestrictedUser`, `siteUnverifiedUser`).
- `GET /webmasters/v3/sites/{siteUrl}` — one property and the caller's permission level.
- `PUT /webmasters/v3/sites/{siteUrl}` — adds the property to the user's Search Console set (no body). Verification still happens out-of-band.
- `DELETE /webmasters/v3/sites/{siteUrl}` — removes the property from the user's set.

### Search Analytics

```text
POST /webmasters/v3/sites/{siteUrl}/searchAnalytics/query
Body: {
  "startDate": "2026-04-01",
  "endDate": "2026-04-30",
  "dimensions": ["query", "page"],
  "dimensionFilterGroups": [
    {
      "groupType": "and",
      "filters": [
        {"dimension": "country", "operator": "equals", "expression": "usa"},
        {"dimension": "page", "operator": "contains", "expression": "/blog/"}
      ]
    }
  ],
  "type": "web",
  "aggregationType": "auto",
  "rowLimit": 5000,
  "startRow": 0,
  "dataState": "final"
}
```

Required: `startDate`, `endDate` (`YYYY-MM-DD`, Pacific Time).

Optional fields:

- `dimensions[]`: zero or more of `query`, `page`, `country`, `device`, `searchAppearance`, `date`, `hour`. Output rows have a `keys[]` aligned to this list.
- `type`: `web` (default), `discover`, `googleNews`, `news`, `image`, `video`.
- `aggregationType`: `auto` (default), `byPage`, `byProperty`, `byNewsShowcasePanel`.
- `dataState`: `final`, `all`, `hourly_all` (required when grouping by `hour`).
- `rowLimit` (1–25,000, default 1,000), `startRow` (default 0).
- `dimensionFilterGroups[]`: only `groupType: and` supported. Each filter has `dimension` ∈ `country`, `device`, `page`, `query`, `searchAppearance`; `operator` ∈ `equals` (default), `notEquals`, `contains`, `notContains`, `includingRegex`, `excludingRegex`; `expression` (max 4,096 chars). `device` filter values: `DESKTOP`, `MOBILE`, `TABLET`.

Response: `rows[]` of `{ keys[], clicks, impressions, ctr, position }`, `responseAggregationType`, `metadata.first_incomplete_date` / `metadata.first_incomplete_hour`. Sort: clicks descending unless date-grouped (date ascending). Results are top-N, not exhaustive.

### Sitemaps

All paths under `/webmasters/v3/sites/{siteUrl}`. `feedpath` is the full sitemap URL, percent-encoded.

- `GET .../sitemaps` — list submitted sitemaps + entries inside index files. Optional `?sitemapIndex=<feedpath>` to filter to entries inside one index sitemap.
- `GET .../sitemaps/{feedpath}` — one sitemap.
- `PUT .../sitemaps/{feedpath}` — submit (empty body).
- `DELETE .../sitemaps/{feedpath}` — remove.

`WmxSitemap` fields: `path`, `lastSubmitted` (RFC3339), `lastDownloaded` (RFC3339), `type` (`sitemap`, `rssFeed`, `atomFeed`, `urlList`, `patternSitemap`, `notSitemap`), `isPending`, `isSitemapsIndex`, `errors`, `warnings`, `contents[]` (each `type` ∈ `web`, `image`, `video`, `news`, `mobile`, `androidApp`, `iosApp`, `pattern`, plus submitted/indexed counters).

### URL Inspection

```text
POST /v1/urlInspection/index:inspect
Body: {
  "inspectionUrl": "https://example.com/blog/post",
  "siteUrl": "https://example.com/",
  "languageCode": "en-US"
}
```

Required: `inspectionUrl`, `siteUrl`. Optional `languageCode` (IETF BCP-47, default `en-US`).

Response: `{ inspectionResult: UrlInspectionResult }`. `UrlInspectionResult` has `inspectionResultLink`, required `indexStatusResult`, optional `ampResult`, optional `richResultsResult`, deprecated `mobileUsabilityResult`.

`IndexStatusInspectionResult` fields: `sitemap[]`, `referringUrls[]`, `verdict`, `coverageState` (free-form), `robotsTxtState`, `indexingState`, `lastCrawlTime`, `pageFetchState`, `googleCanonical`, `userCanonical`, `crawledAs`.

Verbatim enums:

- `Verdict`: `VERDICT_UNSPECIFIED`, `PASS`, `PARTIAL` (reserved/unused), `FAIL`, `NEUTRAL`.
- `RobotsTxtState`: `ROBOTS_TXT_STATE_UNSPECIFIED`, `ALLOWED`, `DISALLOWED`.
- `IndexingState`: `INDEXING_STATE_UNSPECIFIED`, `INDEXING_ALLOWED`, `BLOCKED_BY_META_TAG`, `BLOCKED_BY_HTTP_HEADER`, `BLOCKED_BY_ROBOTS_TXT` (reserved/unused).
- `PageFetchState`: `PAGE_FETCH_STATE_UNSPECIFIED`, `SUCCESSFUL`, `SOFT_404`, `BLOCKED_ROBOTS_TXT`, `NOT_FOUND`, `ACCESS_DENIED`, `SERVER_ERROR`, `REDIRECT_ERROR`, `ACCESS_FORBIDDEN`, `BLOCKED_4XX`, `INTERNAL_CRAWL_ERROR`, `INVALID_URL`.
- `CrawlingUserAgent`: `CRAWLING_USER_AGENT_UNSPECIFIED`, `DESKTOP`, `MOBILE`.

`AmpInspectionResult`: `issues[]`, `verdict`, `ampUrl`, `robotsTxtState`, `indexingState` (`AmpIndexingState`), `ampIndexStatusVerdict`, `lastCrawlTime`, `pageFetchState`. Absent if not AMP.

`RichResultsInspectionResult`: `detectedItems[]`, `verdict`. Absent when no rich results detected.

`MobileUsabilityInspectionResult`: `issues[]`, `verdict`. Marked deprecated.

## Canonical example

Top queries for one page in April 2026:

```bash
curl -X POST "$PUBLIC_URL/accounts/dunder-mifflin/connections/google-search-console/webmasters/v3/sites/https%3A%2F%2Fexample.com%2F/searchAnalytics/query" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"startDate":"2026-04-01","endDate":"2026-04-30","dimensions":["query"],"dimensionFilterGroups":[{"filters":[{"dimension":"page","operator":"equals","expression":"https://example.com/blog/post"}]}],"rowLimit":25}'
```

## Pitfalls

- `/webmasters/` and `/v1/urlInspection/` are part of the upstream path — keep the prefix in the URL you send.
- `siteUrl` must be URL-encoded. The trailing slash on URL-prefix properties matters; the colon in `sc-domain:` must be `%3A`.
- Search Analytics returns top rows ordered by clicks, not exhaustive logs. Anonymized queries (low-volume) are silently dropped.
- `position` is average position over impressions — not "rank for that query at a single moment." It is sensitive to filter cardinality.
- Data freshness: `dataState=final` lags 2–3 days; `dataState=all` includes preliminary data that updates after the fact; `hourly_all` is required for the `hour` dimension and is restricted to recent days.
- The 16-month rolling window is hard. Earlier dates return `400`.
- URL Inspection's daily quota is small (2,000 / day per site). Cache verdicts when polling many URLs; prefer site-audit tools for bulk indexability checks.
- `PUT /sites/{siteUrl}` adds a property but does not verify ownership.
- `MobileUsabilityInspectionResult` is deprecated — don't rely on it for new work.
