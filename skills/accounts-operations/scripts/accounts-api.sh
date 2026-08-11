#!/usr/bin/env bash

set -euo pipefail

environment_url="${HELLOGAFARO_ACCOUNTS_URL:-}"
environment_token="${HELLOGAFARO_ACCOUNTS_BEARER_TOKEN:-}"
env_file="${HELLOGAFARO_ACCOUNTS_ENV_FILE:-.env}"

if [[ -f "${env_file}" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "${env_file}"
  set +a
fi

if [[ -n "${environment_url}" ]]; then
  HELLOGAFARO_ACCOUNTS_URL="${environment_url}"
fi
if [[ -n "${environment_token}" ]]; then
  HELLOGAFARO_ACCOUNTS_BEARER_TOKEN="${environment_token}"
fi

: "${HELLOGAFARO_ACCOUNTS_BEARER_TOKEN:?Missing HELLOGAFARO_ACCOUNTS_BEARER_TOKEN in the environment or ${env_file}}"

readonly accounts_url="${HELLOGAFARO_ACCOUNTS_URL:-https://accounts.ongafaro.com}"
readonly method="${1:?Usage: accounts-api.sh METHOD PATH [curl arguments...]}"
readonly path="${2:?Usage: accounts-api.sh METHOD PATH [curl arguments...]}"
shift 2

curl --fail-with-body --silent --show-error \
  --request "${method}" \
  --url "${accounts_url%/}/${path#/}" \
  --header @<(printf 'Authorization: Bearer %s\n' "${HELLOGAFARO_ACCOUNTS_BEARER_TOKEN}") \
  "$@"
