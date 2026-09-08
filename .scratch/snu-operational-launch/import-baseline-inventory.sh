#!/usr/bin/env bash
set -euo pipefail
read -rsp 'Supabase secret key 또는 legacy service_role key (저장하지 않음): ' SUPABASE_SERVICE_ROLE_KEY
printf '\n'
export SUPABASE_SERVICE_ROLE_KEY
set -a; source .env.local; set +a
node scripts/import-baseline-inventory.mjs
unset SUPABASE_SERVICE_ROLE_KEY
