#!/usr/bin/env bash

set -euo pipefail

# Cursor caches disk state after this idempotent update hook.
bash .cursor/install.sh
