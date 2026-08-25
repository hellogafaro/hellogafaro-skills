# Meta Ads

Accounts exposes the Meta Marketing API verbatim. The Worker handles auth, rate limiting, and `{account_id}` substitution. The agent calls Meta Graph paths directly.

## Agent Tool

Use the single `metaAds` provider tool with HTTPie/Postman-style input: `account_id`, `method`, provider-relative `url`, `params`, and `body`. Use Graph API paths such as `/act_<id>/insights`, `/act_<id>/campaigns`, or `/<object_id>`. Do not include `graph.facebook.com`, `access_token`, auth headers, or tokens.

Upstream: https://developers.facebook.com/docs/marketing-api. Proxy pinned to Graph API `v23.0`.

## Endpoint

```text
ANY /accounts/{account_id}/connections/meta-ads/<graph-path>
```

The Worker prepends `https://graph.facebook.com/v23.0`, appends `access_token` as a query param, and substitutes `{account_id}` (already in `act_<id>` form) into the path. Pass `{account_id}` in templates instead of hardcoding ids.

Auth is automatic. Never include `access_token` or `Authorization`.

## Token-saving conventions

- `?fields=id,name,status,daily_budget,objective` — sparse fields.
- Field expansion: `?fields=adsets{id,name,status,targeting},ads.limit(50){id,creative}` — parent + children in one round trip.
- `?summary=total_count` to learn collection size before paginating.
- Cursor pagination: `?limit=200&after=<cursor>`. Capture `paging.cursors.after` from prior response. Avoid `offset` for large collections.
- Date filtering on insights: `?time_range={"since":"2026-04-01","until":"2026-04-30"}` (URL-encoded JSON) or `date_preset=last_30d`.
- Asynchronous insights for big pulls: `POST /{ad_object_id}/insights` (no `fields=`) returns `report_run_id`; poll `GET /{report_run_id}` for `async_status`; then `GET /{report_run_id}/insights`.
- Batched requests: `POST /` with `batch=[{method, relative_url}, ...]` runs up to 50 calls per request.

## Rate limit

Meta uses per-app + per-ad-account budgets tracked via `X-Business-Use-Case-Usage` and `X-Ad-Account-Usage` response headers. On a 429/5xx, the Worker retries up to 3 times with a 1 second backoff base (honoring `Retry-After` when present) — there is no enforced spacing between successful calls. For long pulls prefer asynchronous insights jobs.

## Per-domain catalog

### Identity and discovery

- `GET /me` — authenticated user. Sanity check.
- `GET /act_{ad_account_id}` — ad account metadata: `name`, `account_id`, `account_status`, `currency`, `timezone_name`, `timezone_offset_hours_utc`, `business`, `business_country_code`, `disable_reason`, `funding_source`, `spend_cap`, `amount_spent`, `min_daily_budget`, `min_campaign_group_spend_cap`, `capabilities`, `owner`, `is_personal`.
- `GET /{business_id}/owned_ad_accounts` — owned ad accounts; rows include `permitted_tasks` (`ANALYZE`, `ADVERTISE`, `MANAGE`, `DRAFT`) and `access_type`.
- `GET /{business_id}/client_ad_accounts` — agency-access accounts. `POST /{business_id}/client_ad_accounts` requests access (`adaccount_id`, `permitted_tasks`).
- `GET /{business_id}/pending_client_ad_accounts` — pending agency requests.
- `GET /{page_id}` — Facebook Page (`name`, `category`, `tasks`, `access_token` if scoped, `instagram_business_account`).
- `GET /{ig_user_id}` — Instagram Business / Creator account (`username`, `profile_picture_url`, `followers_count`, `media_count`).

### Campaigns

- `GET /act_{id}/campaigns` — list. Filter `effective_status=["ACTIVE","PAUSED",...]` (JSON array). Enum: `ACTIVE`, `PAUSED`, `DELETED`, `ARCHIVED`, `IN_PROCESS`, `WITH_ISSUES`, `CAMPAIGN_PAUSED`. Common fields: `name`, `objective`, `status`, `effective_status`, `special_ad_categories`, `daily_budget`, `lifetime_budget`, `start_time`, `stop_time`, `buying_type`, `bid_strategy`.
- `POST /act_{id}/campaigns` — create. Required: `name`, `objective`, `special_ad_categories[]` (`NONE`, `EMPLOYMENT`, `HOUSING`, `CREDIT`, `ISSUES_ELECTIONS_POLITICS`, `ONLINE_GAMBLING_AND_GAMING`, `FINANCIAL_PRODUCTS_SERVICES`). Optional: `status` (`ACTIVE`/`PAUSED` only at create), `buying_type`, `bid_strategy`, `daily_budget`, `lifetime_budget`, `spend_cap`, `start_time`, `stop_time`, `promoted_object`. As of v23.0 only ODAX objectives are accepted: `OUTCOME_AWARENESS`, `OUTCOME_TRAFFIC`, `OUTCOME_ENGAGEMENT`, `OUTCOME_LEADS`, `OUTCOME_APP_PROMOTION`, `OUTCOME_SALES`.
- `POST /{campaign_id}` — update fields including `status` (full enum on updates), `name`, budgets, `special_ad_categories`.
- `DELETE /{campaign_id}` — delete.
- `POST /{campaign_id}/copies` — duplicate (`deep_copy`, `status_option`, `rename_options`).

### Ad Sets

- `GET /act_{id}/adsets`, `GET /{campaign_id}/adsets` — list. Same `effective_status` filter syntax as campaigns plus `ADSET_PAUSED`.
- `POST /act_{id}/adsets` — create. Required: `name`, `campaign_id`, `optimization_goal`, `billing_event`, `targeting`, `status`, plus one of `daily_budget` or `lifetime_budget` (lifetime requires `start_time` + `end_time`). `bid_strategy` enum: `LOWEST_COST_WITHOUT_CAP`, `LOWEST_COST_WITH_BID_CAP`, `COST_CAP`, `LOWEST_COST_WITH_MIN_ROAS`. ODAX optimization goals vary by parent objective (e.g. Sales: `OFFSITE_CONVERSIONS`, `VALUE`, `LINK_CLICKS`, `LANDING_PAGE_VIEWS`, `IMPRESSIONS`, `REACH`). `billing_event` enum: `IMPRESSIONS`, `LINK_CLICKS`, `THRUPLAY`, `APP_INSTALLS`, `PAGE_LIKES`, `POST_ENGAGEMENT`.
- Targeting spec keys (subset): `geo_locations` (`countries`, `regions[{key}]`, `cities[{key, radius, distance_unit}]`, `zips`, `location_types`), `age_min`, `age_max`, `genders` (`[1]` male, `[2]` female), `locales`, `interests` (`[{id,name}]`), `behaviors`, `life_events`, `custom_audiences[{id}]`, `excluded_custom_audiences`, `flexible_spec` (array of include groups), `exclusions`, `publisher_platforms` (`facebook`, `instagram`, `audience_network`, `messenger`), `facebook_positions`, `instagram_positions`, `device_platforms` (`mobile`, `desktop`), `relationship_statuses`.
- `POST /{adset_id}` (update), `DELETE /{adset_id}`, `POST /{adset_id}/copies`.

### Ads

- `GET /act_{id}/ads`, `GET /{adset_id}/ads`, `GET /{campaign_id}/ads` — list. Common fields: `name`, `adset_id`, `campaign_id`, `creative`, `status`, `effective_status`, `tracking_specs`, `conversion_specs`.
- `POST /act_{id}/ads` — create. Required: `name`, `adset_id`, `creative` (`{"creative_id":"<id>"}` or `{"object_story_spec":{...}}`), `status`.
- `POST /{ad_id}` (update), `DELETE /{ad_id}`, `POST /{ad_id}/copies`.

### Ad Creatives

- `GET /act_{id}/adcreatives`, `GET /{creative_id}` — `name`, `object_story_spec`, `image_hash`, `video_id`, `thumbnail_url`, `body`, `title`, `effective_object_story_id`.
- `POST /act_{id}/adcreatives` — create. Common shapes:
  - Link ad: `object_story_spec.link_data` (`link`, `message`, `name`, `description`, `image_hash`, `call_to_action`).
  - Video ad: `object_story_spec.video_data` (`video_id`, `image_url`, `call_to_action`, `message`).
  - Carousel: `link_data.child_attachments[]` of `{link, name, description, image_hash, video_id}`, optional `multi_share_end_card`.
  - Lead: `call_to_action.type=SIGN_UP` with `value.lead_gen_form_id`.
  - DPA: `template_data` plus `product_set_id`.

### Insights (synchronous)

- `GET /act_{id}/insights`, `/{campaign_id}/insights`, `/{adset_id}/insights`, `/{ad_id}/insights`. `level` ∈ `account|campaign|adset|ad`.
- Date params: `date_preset` (`today`, `yesterday`, `this_month`, `last_month`, `last_3d`, `last_7d`, `last_14d`, `last_28d`, `last_30d`, `last_90d`, `this_quarter`, `last_quarter`, `this_year`, `last_year`, `last_week_mon_sun`, `last_week_sun_sat`, `this_week_mon_today`, `this_week_sun_today`, `maximum`) or `time_range={"since":"YYYY-MM-DD","until":"YYYY-MM-DD"}` or `time_ranges` (array).
- Common fields: `impressions`, `reach`, `frequency`, `spend`, `clicks`, `cpc`, `cpm`, `cpp`, `ctr`, `unique_clicks`, `inline_link_clicks`, `inline_link_click_ctr`, `actions`, `action_values`, `conversions`, `conversion_values`, `cost_per_action_type`, `cost_per_unique_action_type`, `purchase_roas`, `website_purchase_roas`, `video_play_actions`, `video_p25_watched_actions`, `video_p100_watched_actions`, `video_avg_time_watched_actions`.
- `breakdowns`: `age`, `gender`, `country`, `region`, `dma`, `publisher_platform`, `platform_position`, `device_platform`, `impression_device`, `hourly_stats_aggregated_by_advertiser_time_zone`.
- `action_breakdowns`: `action_type`, `action_device`, `action_destination`, `action_target_id`, `action_carousel_card_id`, `action_carousel_card_name`, `action_canvas_component_name`, `action_reaction`, `action_video_sound`, `action_video_type`, `conversion_destination`, `standard_event_content_type`, `signal_source_bucket`, `matched_persona_id`, `matched_persona_name`, `is_business_ai_assisted`.
- `action_attribution_windows`: `1d_view`, `7d_view`, `1d_click`, `7d_click`, `28d_click`, `dda`.

### Insights — Async Reports

1. `POST /{ad_object_id}/insights` — body params identical to GET, no `fields`. Returns `report_run_id`.
2. `GET /{report_run_id}` — poll. `async_status` ∈ `Job Not Started`, `Job Started`, `Job Running`, `Job Completed`, `Job Failed`, `Job Skipped`. `async_percent_completion` for progress.
3. `GET /{report_run_id}/insights` — fetch results, paginated.

Report runs expire after 30 days.

### Custom Audiences and Lookalikes

- `GET /act_{id}/customaudiences`. `POST /act_{id}/customaudiences` — `subtype` ∈ `CUSTOM`, `WEBSITE`, `APP`, `OFFLINE_CONVERSION`, `CLAIM`, `PARTNER`, `MANAGED`, `VIDEO`, `LOOKALIKE`, `ENGAGEMENT`, `BAG_OF_ACCOUNTS`, `STUDY_RULE_AUDIENCE`. Customer-list create: `subtype=CUSTOM`, `customer_file_source` ∈ `USER_PROVIDED_ONLY`, `PARTNER_PROVIDED_ONLY`, `BOTH_USER_AND_PARTNER_PROVIDED`.
- `POST /{custom_audience_id}/users` — body `payload={schema, data}`. Schema fields use SHA-256 hashed values: `EMAIL`/`EMAIL_SHA256`, `PHONE`/`PHONE_SHA256`, `FN`, `LN`, `DOBY`, `DOBM`, `DOBD`, `GEN`, `CT`, `ST`, `ZIP`, `COUNTRY`, `MADID`, `EXTERN_ID`. Multi-batch: `session={session_id, batch_seq, last_batch_flag, estimated_num_total}`. Max 10,000 users per request. `DATA_PROCESSING_OPTIONS=["LDU"]` opt-in.
- `DELETE /{custom_audience_id}/users` — same payload.
- Lookalike: `POST /act_{id}/customaudiences` with `subtype=LOOKALIKE`, `origin_audience_id`, `lookalike_spec={"type":"similarity"|"reach","country":"US","ratio":0.01}`.
- Website audience: `rule` JSON with `inclusions`/`exclusions`, `event_sources`, `retention_seconds`, `filter`.

### Custom Conversions and Pixels

- `GET /act_{id}/customconversions`, `POST /act_{id}/customconversions` — required `name`, `event_source_id`. Optional `custom_event_type` (`PURCHASE`, `ADD_TO_CART`, `LEAD`, `COMPLETE_REGISTRATION`, `CONTENT_VIEW`, `SEARCH`, `INITIATE_CHECKOUT`, `ADD_PAYMENT_INFO`, `ADD_TO_WISHLIST`, `OTHER`), `rule`, `default_conversion_value`, `description`, `action_source_type`.
- `GET /act_{id}/adspixels` — list pixels. `GET /{pixel_id}` — read pixel. `GET /{pixel_id}/stats?aggregation=event` — event volumes.
- Conversions API: `POST /{pixel_id}/events` with `data: [Event]`. Each event: required `event_name`, `event_time`, `action_source` (`website`, `app`, `email`, `phone_call`, `chat`, `physical_store`, `system_generated`, `business_messaging`, `other`), `user_data`. `user_data` keys: `em`, `ph` (SHA-256), `client_ip_address`, `client_user_agent`, `fbc`, `fbp`, `fn`, `ln`, `external_id`. Optional: `event_id` (dedup), `event_source_url`, `custom_data`, `opt_out`.

### Lead Forms and Leads

- `GET /{page_id}/leadgen_forms`, `POST /{page_id}/leadgen_forms` (Page token; `name`, `questions`, `privacy_policy`, `follow_up_action_url`, `locale`, `context_card`).
- `GET /{form_id}` — form metadata. `GET /{form_id}/leads` — leads (`field_data`, `created_time`, `ad_id`, `form_id`, `is_organic`, `platform`). Filtering: `filtering=[{"field":"time_created","operator":"GREATER_THAN","value":1700000000}]`.
- `GET /{lead_id}` — single lead.
- `GET /{form_id}/test_leads`, `POST /{form_id}/test_leads` — synthetic leads for testing.

### Catalogs (Commerce)

- `GET /{business_id}/owned_product_catalogs`, `POST /{business_id}/owned_product_catalogs` (`name`, `vertical=commerce`).
- `GET /{catalog_id}` — read. `GET /{catalog_id}/products`, `POST /{catalog_id}/products` — single-product create. Required commerce fields: `retailer_id`, `availability`, `condition`, `description`, `image_url`, `name`/`title`, `brand`, `url`/`link`, `price` (`"19.99 USD"`).
- `POST /{catalog_id}/items_batch` — preferred. `item_type=PRODUCT_ITEM`, `requests=[{method:CREATE|UPDATE|DELETE, data:{...}}]`, `allow_upsert` (default true). Max 5,000 records / 28 MB. Returns `handles[]`, `validation_status[]`. Status: `GET /{catalog_id}/check_batch_request_status?handles=[...]`.
- `GET/POST /{catalog_id}/product_sets` — `name`, `filter` rule.
- `GET/POST /{catalog_id}/product_feeds` — hosted feeds (`name`, `schedule`, `file_name`, `update_schedule`).

### Videos and Images

- `POST /act_{id}/adimages` — multipart `filename` or base64 `bytes` or `url`. Response keyed by filename: `hash`, `url`, `width`, `height`. Read: `GET /act_{id}/adimages?hashes=[...]`.
- `POST /act_{id}/advideos` — small files: `source` multipart or `file_url`. Large/chunked: `upload_phase=start` (returns `upload_session_id`, `video_id`, offsets) → `upload_phase=transfer` with `video_file_chunk` and updated offsets → `upload_phase=finish`. Resumable alt: `POST https://rupload.facebook.com/video-ads-upload/{version}/{video_id}` with `Authorization: OAuth`, `offset`, `file_size` headers.

### Comments and Engagement (organic)

- `GET /{page_post_id}/comments` — `order=chronological|reverse_chronological`, `filter=stream|toplevel`, `summary=total_count`.
- `POST /{page_post_id}/comments` — Page token; `message`, `attachment_id`/`attachment_url`.
- `GET /{comment_id}/comments`, `POST /{comment_id}/comments` — replies.
- `GET /{object_id}/likes?summary=total_count` — likes (limited; counts only).

### Webhook Subscriptions

- App-level: `POST /{app_id}/subscriptions` — `object` (`page`, `user`, `application`, `instagram`, `permissions`), `callback_url`, `fields`, `verify_token`, `include_values`. `GET` lists, `DELETE` removes.
- Page-level install: `POST /{page_id}/subscribed_apps?subscribed_fields=leadgen,feed,messages,...` with Page access token. `GET /{page_id}/subscribed_apps`, `DELETE /{page_id}/subscribed_apps`.
- Lead webhook payload: `field=leadgen`, `value.leadgen_id`. Fetch via `GET /{lead_id}`.

### Batch Requests

- `POST /` (graph root, no path) with `batch=[{method, relative_url, body?, headers?, attached_files?, name?}]` and `access_token`. Up to 50 sub-requests; ≤10 recommended for ad creation. Sub-requests can chain via JSONPath references (`{result=create-creative:$.id}`). Response is an ordered array `[{code, headers, body}]`. Note: cross-object batch requires posting to graph root, which the per-account catch-all does not directly cover — call the proxy with the bare `meta-ads/` path and a body containing the batch.

## Canonical example

Campaign-level insights for last 30 days:

```bash
curl -X GET "$PUBLIC_URL/accounts/dunder-mifflin/connections/meta-ads/{account_id}/insights?level=campaign&date_preset=last_30d&fields=campaign_id,campaign_name,spend,impressions,clicks,ctr,cpc,actions,action_values,purchase_roas&action_breakdowns=action_type&limit=200" \
  -H "Authorization: Bearer $BEARER_TOKEN"
```

## Pitfalls

- Use the `{account_id}` placeholder; it already includes the `act_` prefix. Do not add `act_` again.
- ROAS in `purchase_roas` is keyed by attribution window. Always state the window via `action_attribution_windows=['1d_view','7d_click']` when comparing.
- `actions` is an array of `{action_type, value}` pairs. Filter precisely (e.g. `offsite_conversion.fb_pixel_purchase` for purchases).
- Synchronous `GET /insights` caps at ~25k rows. Anything bigger must use the async report flow.
- Rate limits are per-app + per-account. Bursting many calls against one account triggers throttling on every other request from your app.
- Reported purchases in Meta include attributed conversions across the entire window; don't compare 1:1 with Shopify orders without naming the attribution model.
- `effective_status` and `status` differ. `status=ACTIVE` says "the entity is on" but `effective_status` reflects the realized state after parent statuses, schedule, and review.
- Conversions API requires SHA-256 hashed PII (`em`, `ph`); plaintext is rejected.
- POST/PATCH bodies must be `application/json`. Form-encoded bodies are rejected by the proxy with `400 invalid_request "Malformed JSON body"`. The Meta Marketing API itself accepts both, but this proxy expects JSON.
- `customaudiences` create requires the ad account to be owned by a Business Account. Personal or dev ad accounts return `OAuthException 1870050 "Business Account Needed to Create/Edit This Audience"`. Move the ad account into a Business Manager first.
- Campaign delete via `DELETE /{campaign_id}` and adset delete via `DELETE /{adset_id}` succeed with `{"success": true}`. They are soft-archive in Meta — entities remain visible with `effective_status=DELETED` for 90 days.
- Adset create requires `start_time`, `end_time` (or omit `end_time` for ongoing), `optimization_goal`, `billing_event`, `targeting.geo_locations`, plus a `bid_amount` or `bid_strategy`. Without `start_time` Meta returns "Invalid parameter" with no field hint.
