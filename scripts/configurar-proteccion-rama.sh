#!/usr/bin/env bash
set -euo pipefail
# Se ejecuta manualmente con GitHub CLI autenticado y permisos de administración.
# Uso: bash scripts/configurar-proteccion-rama.sh propietario/repositorio
REPO="${1:?Indique propietario/repositorio, ejemplo: usuario/inventario-nova-sqa}"
command -v gh >/dev/null || { echo 'Se requiere GitHub CLI (gh)'; exit 1; }
gh api --method PUT "repos/$REPO/branches/main/protection" \
  --input - <<'JSON'
{
  "required_status_checks":{"strict":true,"contexts":["build","test","analyze","report"]},
  "enforce_admins":true,
  "required_pull_request_reviews":{"dismiss_stale_reviews":true,"required_approving_review_count":1},
  "restrictions":null,
  "required_linear_history":true,
  "allow_force_pushes":false,
  "allow_deletions":false
}
JSON
echo 'Regla de protección solicitada; confirmar en GitHub Settings > Branches.'
