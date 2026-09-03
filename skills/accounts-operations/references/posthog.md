# PostHog

Studio exposes the PostHog private REST and HogQL Query APIs verbatim. The Worker handles auth, host selection, placeholder substitution, and rate limiting.

## Agent Tool

Pass `connection_id`, `method`, `path`, `params`, and `body` to Studio `connections_execute` or `POST /connections/{connection_id}`. Use private REST paths including `/api`, such as `/api/projects/{project_id}/query/`, `/api/environments/{environment_id}/query/`, or `/api/organizations/{organization_id}/dashboards/`. This is customer PostHog through Studio, not a local PostHog MCP. Do not include PostHog hosts, Personal API Keys, auth headers, or tokens.

Upstream: https://posthog.com/docs/api.

## Endpoint

```text
ANY /accounts/{account_id}/connections/posthog/<api-path>
```

Studio prepends the credential's `host` only (default `https://us.i.posthog.com`; EU clouds use `https://eu.i.posthog.com`) and injects `Authorization: Bearer <personal_api_key>`. Keep `/api` in the path. Three placeholders are substituted from the credential:

- `{project_id}` → the PostHog project id.
- `{environment_id}` → environment id when the credential pins one.
- `{organization_id}` → org id for org-scoped endpoints.

Most resource paths require a trailing slash. Auth is automatic.

> Public ingestion paths (`/capture/`, `/batch/`, `/decide/`, `/flags/`) take the project **public** key in the body, not the Personal API Key the proxy injects. They are not reachable via this proxy. Use a project SDK directly for ingestion.

## Token-saving conventions

- Prefer the HogQL Query API over scanning REST list endpoints. One `SELECT ... LIMIT ...` beats paging through `/persons/`.
- Limit + offset on REST list endpoints; many cap at 100, some at 1000.
- HogQL row default is 100 — raise via SQL `LIMIT` (cap 50,000).
- Use property-value reads (`/persons/values/?key=email`) rather than scanning persons for distincts.

## Rate limit

PostHog Cloud enforces team-level burst (~240 req/min) plus per-endpoint ceilings — heavier on `/query/` and `/insights/funnels`. On a 429/5xx, the Worker retries up to 3 times with a 200 ms backoff base — there is no enforced spacing between successful calls.

## Per-domain catalog

### Identity, projects, organizations, environments

- `GET /api/users/@me/` — current authenticated user.
- `GET /api/organizations/{organization_id}/` — org metadata, plan, members.
- `GET|POST /api/organizations/{organization_id}/projects/`; `GET|PATCH|DELETE /api/organizations/{organization_id}/projects/{id}/`.
- Project sub-routes: `GET /activity/`, `PATCH /add_product_intent/`, `POST /change_organization/`, `PATCH /complete_product_onboarding/`, `PATCH /delete_secret_token_backup/`, `POST /generate_conversations_public_token/`, `GET /is_generating_demo_data/`, `PATCH /reset_token/`, `PATCH /rotate_secret_token/`.
- `GET /api/projects/{project_id}/` — project metadata: name, timezone, ingested_event flag, data_attributes.
- `GET /api/environments/?project_id={project_id}` — environments. Environment-scoped resources mirror project ones for `batch_exports`, `session_recordings`, `session_recording_playlists`, and `groups`.
- `GET /api/personal_api_keys/` — audit endpoint listing keys for the current user.

### HogQL Query API (preferred read path)

```text
POST /api/projects/{project_id}/query/
Body: {
  "query": { "kind": "<Kind>", ...kind-specific fields... },
  "name": "<descriptive name>",
  "async": false,
  "client_query_id": "<optional>",
  "filters": {...},
  "variables_overrides": {...},
  "refresh": "blocking"
}
```

Required scope: `query:read`. Default row limit 100, capped at 50,000 via SQL `LIMIT`.

Confirmed `kind` values: `HogQLQuery`, `EventsQuery`, `TrendsQuery`, `FunnelsQuery`, `RetentionQuery`, `LifecycleQuery`, `PathsQuery`, `StickinessQuery`, `WebOverviewQuery`, `WebStatsTableQuery`, `WebTopClicksQuery`, `WebGoalsQuery`, `WebExternalClicksTableQuery`, `ActorsQuery`, `SessionAttributionExplorerQuery`, `RecordingsQuery`, `ErrorTrackingQuery`.

HogQL response: `query`, `results`, `types`, `columns`, `hogql`, `clickhouse`. HogQL tables: `events`, `persons`, `groups`, `sessions`, `cohort_people`, `session_replay_events`, `app_metrics`. HogQL functions mirror ClickHouse SQL — `toDate(timestamp)`, `dateDiff('day', a, b)`, `arrayJoin(...)`, `JSONExtractString(properties, 'key')`.

### Events and definitions

- `GET /api/projects/{project_id}/events/` — deprecated for ad-hoc; use the Query API. Filters: `after`, `before`, `distinct_id`, `event`, `format` (`csv`|`json`), `limit`, `offset`, `person_id`, `properties`, `select`, `where`. Scope `query:read`.
- `GET /api/projects/{project_id}/event_definitions/` — known event names.
- `GET /api/projects/{project_id}/property_definitions/` — known properties.

### Persons

- `GET /api/projects/{project_id}/persons/` — filters: `distinct_id`, `email`, `format`, `limit`, `offset`, `properties`, `search`.
- `GET|PATCH /api/projects/{project_id}/persons/{id}/`. PATCH body `{ "properties": {...} }` requires `person:write`. PostHog still recommends `$set`/`$unset` via capture for production updates.
- `DELETE /api/projects/{project_id}/persons/{id}/?delete_events=true` — GDPR delete.
- `POST /api/projects/{project_id}/persons/{id}/merge/` — merge two persons.
- `GET /api/projects/{project_id}/persons/{id}/properties/` — full property bag.
- `GET /api/projects/{project_id}/persons/{id}/cohorts/` — per-person cohort list.
- `GET /api/projects/{project_id}/persons/cohorts/?person_id=` — alternate query form.
- `GET /api/projects/{project_id}/persons/values/?key=<prop>` — distinct property values.

### Cohorts

- `GET|POST /api/projects/{project_id}/cohorts/`, `GET|PATCH|DELETE /{id}/`.
- `GET /api/projects/{project_id}/cohorts/{id}/persons/` — members.
- `PATCH /api/projects/{project_id}/cohorts/{id}/add_persons_to_static_cohort/` with `{ "person_ids": [...] }` for static cohorts. Static cohorts also accept CSV uploads in the UI (Distinct IDs, Person IDs, or Emails).
- Create body: `name`, `description`, `filters.properties.{type, values[]}`, `is_static`, `static_person_ids`.

### Insights, dashboards, notebooks

- `GET|POST /api/projects/{project_id}/insights/`; `GET|PATCH /{id}/` for soft delete. Insight create requires the new `query` shape — POST body must wrap the query in `InsightVizNode`: `{ "name": "...", "query": { "kind": "InsightVizNode", "source": { "kind": "TrendsQuery"|"FunnelsQuery"|..., ... } } }`. Legacy `{ "filters": {...} }` is rejected with 403 `permission_denied` "Creating or updating insights with legacy filters is not available for this user."
- `GET|POST /api/projects/{project_id}/dashboards/`; `GET|PATCH|DELETE /{id}/`.
- `GET|POST /api/projects/{project_id}/notebooks/`; `GET|PATCH|DELETE /{id}/`.

### Session recordings, playlists

- `GET /api/projects/{project_id}/session_recordings/` and `GET|PATCH|DELETE /{id}/`. Scope `session_recording:read`/`:write`.
- `GET /api/projects/{project_id}/session_recordings/{id}/sharing/` — sharing config (scope `sharing_configuration:read`).
- Snapshots fetched as part of the recording payload via the same `{id}` endpoint; large recordings stream from S3 via signed URLs.
- Mirror routes under `/api/environments/{environment_id}/session_recordings/...`.
- Playlists: `GET|POST /api/environments/{environment_id}/session_recording_playlists/`; `GET|PATCH|DELETE /{short_id}/`. `GET /api/projects/{project_id}/session_recording_playlists/{short_id}/recordings/` for members.

### Feature flags

- `GET|POST /api/projects/{project_id}/feature_flags/`; `GET|PATCH|DELETE /{id}/`. List filters: `active` (`STALE`|`true`|`false`), `created_by_id`, `evaluation_runtime` (`both`|`client`|`server`), `excluded_properties`, `has_evaluation_contexts`, `limit`, `offset`, `search`, `tags`, `type` (`boolean`|`experiment`|`multivariant`|`remote_config`).
- `GET /api/projects/{project_id}/feature_flags/{id}/activity/`.
- `POST /api/projects/{project_id}/feature_flags/{id}/create_static_cohort_for_flag/`.
- `POST /api/projects/{project_id}/feature_flags/{id}/dashboard/`.
- `GET /api/projects/{project_id}/feature_flags/{id}/dependent_flags/`.
- The `remote_config` flag type carries server-only payloads; runtime evaluation uses `/decide/`/`/flags/` with the project key (not proxyable here).

### Experiments (A/B)

- `GET|POST /api/projects/{project_id}/experiments/`; `GET|PATCH|DELETE /{id}/`. List filters: status `draft|running|paused|complete|stopped|all`, archival, feature flag, creator, `search`.
- `POST /{id}/archive/`, `POST /{id}/copy_to_project/`, `POST /{id}/create_exposure_cohort_for_experiment/`, `POST /{id}/duplicate/`. Scope `experiment:read`/`:write`.

### Surveys

- `GET|POST /api/projects/{project_id}/surveys/`; `GET|PATCH|DELETE /{id}/`. List filters: `archived`, `limit`, `offset`, `search`.
- `GET /{id}/activity/`, `GET /{id}/archived-response-uuids/`, `POST /{id}/duplicate_to_projects/`, `POST /{id}/generate_translations/`.
- Survey responses are stored as events. Aggregate via Query API (`HogQLQuery` against `events` filtered by `event = 'survey sent'` / `survey shown` / `survey dismissed`). Scope `survey:read`/`:write`.

### Groups (B2B)

- `GET /api/projects/{project_id}/groups/?group_type_index=<n>` — list groups of a type. `POST /api/projects/{project_id}/groups/` creates.
- `POST /api/projects/{project_id}/groups/update_property/`, `POST /api/projects/{project_id}/groups/delete_property/`.
- `GET /api/projects/{project_id}/groups/find/`, `/related/`, `/activity/`.
- `GET /api/projects/{project_id}/groups/property_definitions/`, `/property_values/`.
- `GET /api/projects/{project_id}/groups_types/` — configured group types.
- Mirror routes under `/api/environments/{environment_id}/groups/`. Scopes `group:read`/`:write`.

### Actions, annotations, hooks

- `GET|POST /api/projects/{project_id}/actions/`; `GET|PATCH|DELETE /{id}/`. Use `EventsQuery` with `actionId` to fetch matching events.
- `GET|POST /api/projects/{project_id}/annotations/`; `GET|PATCH|DELETE /{id}/`.
- `GET|POST /api/projects/{project_id}/hooks/`; `GET|PATCH|DELETE /{id}/` — Zapier-style REST hooks.

### Plugins / apps / pipelines

- `GET|POST /api/organizations/{organization_id}/plugins/`; `GET|PATCH|DELETE /{id}/` — install or remove plugins org-wide.
- `GET|POST /api/projects/{project_id}/plugin_configs/`; `GET|PATCH|DELETE /{id}/` — configure per project.

### Batch exports (environment-scoped)

- `GET|POST /api/environments/{environment_id}/batch_exports/`; `GET /{id}/`.
- Backfills: `GET|POST /{batch_export_id}/backfills/`, `GET /{batch_export_id}/backfills/{id}/`, `POST /{batch_export_id}/backfills/{id}/cancel/`.
- Runs: `GET /{batch_export_id}/runs/`, `GET /{batch_export_id}/runs/{id}/`, `POST /{batch_export_id}/runs/{id}/cancel/`, `GET /{batch_export_id}/runs/{id}/logs/`, `POST /{batch_export_id}/runs/{id}/retry/`. Scope `batch_export:read`/`:write`.

### Web Analytics query kinds

The Web Analytics tab is implemented entirely on the Query API:

- `WebOverviewQuery` — headline KPIs.
- `WebStatsTableQuery` — grouped breakdowns (paths, sources, devices, geo).
- `WebTopClicksQuery` — click ranking.
- `WebGoalsQuery` — conversion goal performance.
- `WebExternalClicksTableQuery` — outbound link tracking.

All accept `dateRange.{date_from, date_to}`, `properties[]`, `sampling`, and `compareFilter`.

## Canonical example

Top events in the last 7 days via HogQL:

```bash
curl -X POST "$PUBLIC_URL/accounts/dunder-mifflin/connections/posthog/api/projects/{project_id}/query/" \
  -H "Authorization: Bearer $BEARER_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query":{"kind":"HogQLQuery","query":"SELECT event, count() FROM events WHERE timestamp >= now() - INTERVAL 7 DAY GROUP BY event ORDER BY count() DESC LIMIT 50"},"name":"top_events_last_7_days"}'
```

## Pitfalls

- Personal API Key only — public ingest paths (`/capture/`, `/batch/`, `/decide/`, `/flags/`) take the project public key in the body and won't work through the proxy.
- Always pin `{project_id}` (or pass it explicitly) — many endpoints have org-scoped twins (`/api/organizations/.../`) that do different things.
- HogQL `events` table tracks the project's `timestamp` field. Be explicit (`timestamp >= toDateTime('2026-04-01')`) instead of relying on a default lookback.
- `/query/` runs synchronous queries with a hard timeout (~120 s on Cloud). Heavy joins should chunk by date or `LIMIT ... OFFSET`.
- `remote_config` feature flags carry server-only payloads. Reading the flag definition + computing eligibility in HogQL is a viable analysis pattern.
- Session-recording snapshot URLs are presigned and expire quickly.
- Group analytics is opt-in per project. If `group_types_index` is 0 by default, your project hasn't configured groups yet.
- Cloud regions are separate hosts. The credential's `host` (`us`, `eu`, or self-hosted) is honored automatically; do not hardcode a region.
- Environment-scoped routes (`/api/environments/...`) are the canonical home for `batch_exports`, `session_recordings`, `session_recording_playlists`, and `groups`. Project-scoped equivalents remain.
- Most resources do NOT support hard `DELETE`. Use soft delete via `PATCH /api/projects/{project_id}/<resource>/<id>/ { "deleted": true }` for `dashboards`, `insights`, `feature_flags`, `actions`, `cohorts`. Hard `DELETE` returns HTTP 405. Surveys are the exception — they support `DELETE /api/projects/{project_id}/surveys/<uuid>/`. Annotations have neither a documented soft-delete flag nor a `DELETE` route on `/annotations/{id}/` — let stale annotations age out, or PATCH to mark them inactive.
- Survey ids are UUIDs; insights, dashboards, feature_flags, actions, cohorts, annotations use numeric integer ids. Treat ids as opaque strings when concatenating into paths.
- Insight `query` shape changed in 2024 — when reading existing insights you may see either the modern `query: { kind: "InsightVizNode", ... }` envelope or the legacy `filters: {...}` block. Writes must use the modern shape.
