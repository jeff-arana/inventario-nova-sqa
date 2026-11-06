#!/usr/bin/env bash
# Prepara una derivación con historial del proyecto MIT tomado como referencia.
# Requiere conexión a internet y Git instalado en el equipo del estudiante.
set -euo pipefail
SOURCE_DIR="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="${1:-../InventarioNova_derivado_con_historial}"
if [ -e "$TARGET" ]; then echo "El destino ya existe: $TARGET"; exit 1; fi
git clone https://github.com/DMS-ranil/react-mysql-crud-template.git "$TARGET"
cd "$TARGET"
git switch -c feature/sqa-inventario-nova
# Conservamos .git y LICENSE del proyecto original y superponemos la implementación académica.
cp -a "$SOURCE_DIR"/. ./
# Evita copiar un repositorio .git accidentalmente almacenado en el proyecto fuente.
git add -A
echo "Base clonada y archivos SQA copiados. Antes de hacer commit, revisa licencia y diferencias: git status; git diff --cached"
echo "Realiza el commit tú mismo después de verificar qué cambió y conserva atribución al autor original."
