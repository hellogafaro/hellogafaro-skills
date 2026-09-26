# Studio MCP and REST access

## Studio MCP

1. `accounts_list` or `accounts_get` for the Studio account id.
2. `connections_list` or `connections_get` for the connection id. Confirm `status` is `connected`.
3. `connections_execute` with `connection_id`, `method`, `path`, `params`, and `body`.

`params` is the provider query string. `body` is the provider JSON body. Never put credentials, `Authorization`, tokens, or provider hosts in those fields.

## Studio REST

Use [references/api.md](api.md) for the HTTP contract. Every request: `curl -H "Authorization: Bearer $BEARER_TOKEN" "$PUBLIC_URL{path}"`.
