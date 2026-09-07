#!/usr/bin/env bash
set -euo pipefail
read -rsp 'Supabase service_role key (not saved): ' SUPABASE_SERVICE_ROLE_KEY
printf '\n'
export SUPABASE_SERVICE_ROLE_KEY
set -a; source .env.local; set +a
node scripts/import-baseline-inventory.mjs
unset SUPABASE_SERVICE_ROLE_KEY
