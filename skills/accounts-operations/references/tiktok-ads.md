# TikTok Ads

Studio exposes the TikTok Business API verbatim. The Worker handles auth, rate limiting, and `{advertiser_id}` substitution. The agent calls TikTok's native paths.

## Agent Tool

Use the single `tiktokAds` provider tool with HTTPie/Postman-style input: `account_id`, `method`, provider-relative `url`, `params`, and `body`. Use TikTok Business API paths such as `/open_api/v1.3/campaign/get/` or `/open_api/v1.3/report/integrated/get/`. Include `advertiser_id` as the provider requires. Do not include `business-api.tiktok.com`, `Access-Token`, auth headers, or tokens.

Upstream: https://business-api.tiktok.com/portal/docs. Proxy pinned to version `v1.3`.

## Endpoint

```text
ANY /accounts/{account_id}/connections/tiktok-ads/<api-path>
```

The Worker prepends `https://business-api.tiktok.com/open_api/v1.3` and injects the `Access-Token` header. The literal `{advertiser_id}` is substituted with the credential's advertiser id; TikTok uses it as a query parameter even on POST endpoints.

All responses follow the envelope `{code: 0, message: "OK", data: {...}, request_id: "..."}`. Non-zero `code` signals a provider error — always check it, even on HTTP 200.

Auth is automatic. Never include `Access-Token`, `Authorization`, or any plaintext credential.

## Token-saving conventions

- `fields` query param accepts a JSON-array string, e.g. `?fields=["campaign_id","campaign_name","status","objective_type"]`.
- `filtering` is a JSON object query parameter (URL-encoded), not flat query params: `?filtering={"campaign_status":"STATUS_NOT_DELETE"}`.
- Cursor-style pagination via `page` + `page_size`. Reports cap at 200 rows; many endpoints cap at 1000.
- Asynchronous reports for big pulls: `POST /report/integrated/create_task/` → poll `GET /report/integrated/check/?task_id=...` until `status=SUCCESS` → `GET /report/integrated/download/?task_id=...`.

## Rate limit

Per-app + per-advertiser quotas (defaults in the 10 QPS / 600 calls/min range). On a 429/5xx, the Worker retries up to 3 times with a 1 second backoff base — there is no enforced spacing between successful calls. Async report tasks bypass synchronous quotas — use them for heavy pulls.

## Per-domain catalog

### Authentication and identity discovery

- `GET /oauth2/advertiser/get/` — advertisers granted to an app for a long-term token. Query: `access_token`, `secret`, `app_id`.
- `GET /advertiser/info/?advertiser_ids=["{advertiser_id}"]` — name, currency, timezone, status, role. Optional `fields`.
- `POST /advertiser/update/` — update advertiser settings (`name`, `industry`, `language`, `contacter`).
- `GET /bc/get/` — Business Centers accessible to the token. Query: `bc_id` (optional), `page`, `page_size`.
- `GET /bc/advertiser/get/?bc_id=...` — advertisers under a BC.
- `GET /tt_user/info/?advertiser_id=...` — TikTok user identity bound to the advertiser.
- `GET /identity/get/?advertiser_id=...` — owned and registered identities (`CUSTOMIZED_USER`, `AUTH_CODE`, `TT_USER`, `BC_AUTH_TT`).

### Campaigns

- `GET /campaign/get/?advertiser_id={advertiser_id}` — list. `filtering` keys: `campaign_ids`, `campaign_name`, `objective_type`, `primary_status`, `secondary_status`, `buying_types`, `creation_filter_start_time`, `creation_filter_end_time`, `is_smart_performance_campaign`. `fields` JSON array, `page`, `page_size`.
- `POST /campaign/create/` — required: `advertiser_id`, `campaign_name`, `objective_type`, `budget_mode`, `budget` when `budget_mode != BUDGET_MODE_INFINITE`. v1.3 `objective_type` includes `REACH`, `TRAFFIC`, `VIDEO_VIEWS`, `LEAD_GENERATION`, `APP_PROMOTION`, `WEB_CONVERSIONS`, `PRODUCT_SALES`, `ENGAGEMENT`. `budget_mode` ∈ `BUDGET_MODE_DAY`, `BUDGET_MODE_TOTAL`, `BUDGET_MODE_INFINITE`.
- `POST /campaign/update/` — body must include `advertiser_id` and `campaign_id`. Mutable: `campaign_name`, `budget`, `budget_mode`, `special_industries`, `roas_bid`.
- `POST /campaign/status/update/` — body: `advertiser_id`, `campaign_ids` (≤100), `operation_status` (`ENABLE`, `DISABLE`, `DELETE`).

### Ad Groups

- `GET /adgroup/get/?advertiser_id=...` — list. `filtering` keys: `campaign_ids`, `adgroup_ids`, `adgroup_name`, `primary_status`, `secondary_status`, `objective_type`, `optimization_goal`, `bid_strategy`, `billing_events`, `creation_filter_start_time`, `creation_filter_end_time`.
- `POST /adgroup/create/` — required: `advertiser_id`, `campaign_id`, `adgroup_name`, `placement_type` (`PLACEMENT_TYPE_AUTOMATIC` or `PLACEMENT_TYPE_NORMAL`), `placements` (when normal), `budget_mode`, `budget`, `schedule_type`, `schedule_start_time`, `optimization_goal`, `bid_type`, `billing_event`, `pacing`, `promotion_type`. Targeting block accepts `location_ids`, `gender`, `age_groups`, `languages`, `operating_systems`, `device_model_ids`, `interest_category_ids`, `interest_keyword_ids`, `actions`, `audience_ids`, `excluded_audience_ids`, `included_custom_actions`, `excluded_custom_actions`, `device_price_ranges`, `network_types`, `carrier_ids`, `min_android_version`, `min_ios_version`.
- `POST /adgroup/update/` — body: `advertiser_id`, `adgroup_id`, mutable fields.
- `POST /adgroup/status/update/` — body: `advertiser_id`, `adgroup_ids`, `operation_status`.

### Ads

- `GET /ad/get/?advertiser_id=...` — list. `filtering` keys: `ad_ids`, `campaign_ids`, `adgroup_ids`, `ad_name`, `primary_status`, `secondary_status`, `creation_filter_*`.
- `POST /ad/create/` — body: `advertiser_id`, `adgroup_id`, `creatives: [...]`. Each creative requires `ad_name`, `ad_format` (`SINGLE_VIDEO`, `SINGLE_IMAGE`, `CAROUSEL_ADS`, `CATALOG_CAROUSEL`), `ad_text`, `call_to_action`, `landing_page_url`, `identity_type`, `identity_id`, `video_id` or `image_ids`.
- `POST /ad/update/` — body: `advertiser_id`, `creatives` keyed by `ad_id`.
- `POST /ad/status/update/` — body: `advertiser_id`, `ad_ids`, `operation_status`.

### Reports

Synchronous integrated reports:

```text
GET /report/integrated/get/
  ?advertiser_id={advertiser_id}
  &report_type=BASIC|AUDIENCE|PLAYABLE_MATERIAL|CATALOG|BC
  &data_level=AUCTION_ADVERTISER|AUCTION_CAMPAIGN|AUCTION_ADGROUP|AUCTION_AD|RESERVATION_*
  &dimensions=["campaign_id","stat_time_day"]
  &metrics=["spend","impressions","clicks","ctr","cpc","cpm","conversion","cost_per_conversion","conversion_rate","video_play_actions","video_watched_2s","video_watched_6s","reach","frequency","complete_payment","total_complete_payment_rate","value_per_complete_payment","total_purchase_value"]
  &start_date=2026-04-01&end_date=2026-04-30
  &page=1&page_size=200
  &filtering=[{...}]
  &order_field=spend&order_type=DESC
  &enable_total_metrics=true
```

Common dimensions: `advertiser_id`, `campaign_id`, `adgroup_id`, `ad_id`, `stat_time_day`, `stat_time_hour`, `country_code`, `age`, `gender`, `placement`, `platform`. Hourly is rolling 24h only.

Async flow for >10k rows:

1. `POST /report/integrated/create_task/` — same params as sync plus `output_format` (`CSV`, `JSON`), `file_name`, `enable_report_title_translation`. Returns `data.task_id`.
2. `GET /report/integrated/check/?advertiser_id=...&task_id=...` — `data.status` ∈ `QUEUING`, `PROCESSING`, `SUCCESS`, `FAILED`, `CANCELED`. `download_url` set when ready.
3. `GET /report/integrated/download/?advertiser_id=...&task_id=...` — streams CSV/JSON.

### Audiences (DMP)

- `GET /dmp/custom_audience/list/?advertiser_id=...&page=&page_size=`.
- `GET /dmp/custom_audience/get/?advertiser_id=...&custom_audience_ids=[...]`.
- `POST /dmp/custom_audience/create/` — body: `advertiser_id`, `custom_audience_name`, `calculate_type` (`SHA256`, `MD5`, `PLAIN`, `IDFA_SHA256`), `file_paths` (from upload), optional `audience_sub_type` (`NORMAL`, `REACH_FREQUENCY`), `retention_in_days` (1–365). Audience types: `CUSTOMER_FILE`, `ENGAGEMENT`, `APP_ACTIVITY`, `WEBSITE_TRAFFIC`, `LEAD_GENERATION`, `BUSINESS_ACCOUNT`, `SHOP_ACTIVITY`.
- `POST /dmp/custom_audience/update/` — body: `advertiser_id`, `custom_audience_id`, mutable fields.
- `POST /dmp/custom_audience/delete/` — body: `advertiser_id`, `custom_audience_ids`.
- `POST /dmp/custom_audience/file/upload/` — multipart: `advertiser_id`, `file`, `file_signature` (MD5 of file), `calculate_type`. Returns `data.file_path`.
- `POST /dmp/saved_audience/create/` — body: `advertiser_id`, `saved_audience_name`, `targeting` block.

### Targeting helpers

- `GET /tool/region/?advertiser_id=...&placement=PLACEMENT_TIKTOK&objective_type=...&region_level=COUNTRY|PROVINCE|CITY|DISTRICT|DMA`.
- `GET /tool/language/?advertiser_id=...&placement=...`.
- `GET /tool/interest_category/?advertiser_id=...&placement=...&version=...&special_industries=...`.
- `GET /tool/behavior_category/?advertiser_id=...`.
- `GET /tool/action_category/?advertiser_id=...`.
- `GET /tool/iab_category/get/?advertiser_id=...&language=...`.
- `POST /tool/targeting_recommend/` (a.k.a. `/tool/targeting_category/recommend/`) — body: `advertiser_id`, `app_id`, `region_codes`, `placements`, `targeting_type` (`INTEREST` or `ACTION`), `objective_type`.
- `POST /tool/audience_size/predict/` — body: full targeting object plus `advertiser_id`. Returns reach forecast.

### Creatives and assets

- `POST /file/video/ad/upload/` — multipart. `advertiser_id` plus one of `video_file` + `video_signature`, `video_url`, or `file_id`. Optional `flaw_detect`, `auto_fix_enabled`, `auto_bind_enabled`, `is_third_party`, `upload_type`. Returns `data[0].video_id`.
- `GET /file/video/ad/info/?advertiser_id=...&video_ids=[...]`.
- `POST /file/image/ad/upload/` — multipart. `advertiser_id`, `upload_type`, `image_file` + `image_signature` or `image_url` or `file_id`. Returns `data.image_id`.
- `GET /file/image/ad/info/?advertiser_id=...&image_ids=[...]`.
- `POST /creative/portfolio/create/` — body: `advertiser_id`, `portfolio_name`.
- `GET /creative/playable/get/?advertiser_id=...&playable_id=&page=&page_size=`.
- `POST /creative/playable/upload/` — multipart `playable_file`, `name`, `width`, `height`. Returns `playable_id`, `playable_url`.
- `POST /creative/spark_ad/auth/` — body: `advertiser_id`, `tt_user_id`, `item_id`. Returns auth code/url.
- `POST /creative/spark_ad/save/` — body: `advertiser_id`, `auth_code` to bind a Spark Ad post.

### Pixel and Events API

- `GET /pixel/list/?advertiser_id=...&pixel_ids=&page=&page_size=`.
- `POST /pixel/create/` — body: `advertiser_id`, `pixel_name`, `pixel_category` (`ONLINE_STORE`, `LEAD_GENERATION`, `OTHER`).
- `POST /pixel/update/` — body: `advertiser_id`, `pixel_id`, mutable fields.
- `GET /pixel/event/list/?advertiser_id=...&pixel_id=...`.
- `GET /pixel/event/stats/?advertiser_id=...&pixel_id=...&start_time=&end_time=`.
- `POST /event/track/` — Events API S2S. Body: `event_source` (`web` for pixel), `event_source_id` (the pixel code), `data: [...]`. Per event: `event` (e.g. `Purchase`, `AddToCart`), `event_id` (dedup), `event_time` (Unix seconds), `user` (`email`, `phone_number`, `ttclid`, `ttp`, `external_id` — hashed where required), `properties` (`currency`, `value`, `contents`, `content_id`, `content_type`, `description`), `page` (`url`, `referrer`), `limited_data_use`. (Older `/pixel/track/` exists but Events API 2.0 supersedes it.)

### Catalogs

- `GET /catalog/get/?bc_id=...&catalog_id=&page=&page_size=`.
- `POST /catalog/create/` — body: `bc_id`, `name`, `regions`, `currency`, `catalog_type` (`ECOMMERCE`, `LIFE_SERVICES`, …).
- `GET /catalog/product/list/?bc_id=...&catalog_id=...&filtering=&page=&page_size=`.
- `POST /catalog/product/upload/` — body: `bc_id`, `catalog_id`, `products` (≤200 per call).
- `GET /catalog/product_set/list/?bc_id=...&catalog_id=...`.
- `POST /catalog/product_set/create/` — body: `bc_id`, `catalog_id`, `name`, `filter` rules.
- `POST /catalog/feed/create/` — body: `bc_id`, `catalog_id`, `name`, `feed_url`, `schedule`, `update_type`.
- `GET /catalog/feed/list/?bc_id=...&catalog_id=...`.

### Comments and engagement

- `GET /comment/list/?advertiser_id=...&ad_id=&campaign_id=&comment_type=AD_COMMENT|AD_AUTHOR&filtering=&page=&page_size=`.
- `POST /comment/reply/` — body: `advertiser_id`, `comment_id`, `text`.
- `POST /comment/hide/` — body: `advertiser_id`, `comment_ids`, `action` (`HIDE` / `UNHIDE`).
- `POST /comment/delete/` — body: `advertiser_id`, `comment_ids`.

### Account budgets and balance

- `GET /advertiser/balance/get/?advertiser_ids=[...]` — `balance`, `cash_balance`, `grant_balance`, `currency`.
- `GET /advertiser/transaction/get/?advertiser_id=...&start_date=&end_date=&transaction_type=&page=&page_size=`.

### Recommendations / Smart Performance

- `GET /recommend/tools/get/?advertiser_id=...&recommend_type=...` — sparsely documented in v1.3. Treat as raw passthrough; field shape varies by recommendation surface.

## Canonical example

Daily campaign report for the last 30 days:

```bash
curl -X GET "$PUBLIC_URL/accounts/dunder-mifflin/connections/tiktok-ads/report/integrated/get/?advertiser_id={advertiser_id}&report_type=BASIC&data_level=AUCTION_CAMPAIGN&dimensions=%5B%22campaign_id%22%2C%22stat_time_day%22%5D&metrics=%5B%22spend%22%2C%22impressions%22%2C%22clicks%22%2C%22conversion%22%2C%22cost_per_conversion%22%5D&start_date=2026-04-01&end_date=2026-04-30&page_size=200" \
  -H "Authorization: Bearer $BEARER_TOKEN"
```

## Pitfalls

- TikTok requires `advertiser_id` as a query parameter, even on POST endpoints. Pass it explicitly or via the `{advertiser_id}` placeholder.
- The Business API returns HTTP 200 for most business errors. Always check `code` (`0` = success) and `message` in the response envelope.
- `metrics` and `dimensions` must be JSON-array strings in query params. Construct as JSON, then URL-encode.
- Sync `/report/integrated/get/` caps around 10k rows per call. Anything bigger needs the async task flow.
- `result` and `cost_per_result` are optimization-goal aware. State the `optimization_goal` of the entity when comparing across ad groups.
- Custom-audience uploads use SHA-256 / MD5 / IDFA-SHA256 hashing per `calculate_type`. Plaintext is allowed only for `PLAIN` and is discouraged.
- Spark Ads require an organic post auth flow; you cannot create them by uploading creative directly.
- Currency for `spend` is the advertiser's currency, returned as a decimal string. Cast to a number client-side.
- Status updates use `operation_status`, not `effective_status`. The latter is read-only on get responses.
