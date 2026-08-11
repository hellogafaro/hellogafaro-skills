# Accounts API

The live API is `https://accounts.ongafaro.com`. Override it only when explicitly targeting another deployed environment.

## Authentication

Set the bearer token in the host environment, secret store, or consumer project's uncommitted `.env`:

```env
HELLOGAFARO_ACCOUNTS_BEARER_TOKEN=...
```

Optional overrides:

```env
HELLOGAFARO_ACCOUNTS_URL=https://accounts.ongafaro.com
HELLOGAFARO_ACCOUNTS_ENV_FILE=/absolute/path/to/.env
```

Never print the token, place it in a command, commit it, or send it to a provider. Use `scripts/accounts-api.sh`, which injects the Accounts authorization header.

## Accounts

List accounts when the account id is unknown:

```bash
scripts/accounts-api.sh GET /accounts
```

Read one account:

```bash
scripts/accounts-api.sh GET /accounts/{account_id}
```

## Provider requests

Send provider-native operations through the proxy endpoint:

```text
POST /accounts/{account_id}/{provider}
```

Request envelope:

```json
{
  "method": "GET",
  "url": "/provider-relative/path",
  "params": {},
  "body": {}
}
```

Example:

```bash
scripts/accounts-api.sh POST /accounts/{account_id}/shopify \
  --json '{"method":"POST","url":"/admin/api/{api_version}/graphql.json","body":{"query":"query { shop { name } }"}}'
```

Supported provider ids are `shopify`, `klaviyo`, `meta-ads`, `google-ads`, `tiktok-ads`, `posthog`, `google-analytics`, and `google-search-console`.

Use only provider-relative URLs. The Accounts API owns provider credentials, authentication headers, token refresh, request validation, retries, and response redaction.

Successful provider responses use this envelope:

```json
{
  "account": "account-id",
  "platform": "provider",
  "method": "GET",
  "url": "/provider-relative/path",
  "response": {}
}
```

Treat `401`, `403`, `404`, `429`, and provider `502` responses as source failures. Do not bypass the API with provider credentials.
