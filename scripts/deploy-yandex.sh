#!/usr/bin/env bash
# Загрузка dist/ в Yandex Object Storage
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BUCKET="${YC_BUCKET:-mayak-legal-front}"
ENDPOINT="${YC_ENDPOINT:-https://storage.yandexcloud.net}"

if [[ -z "${AWS_ACCESS_KEY_ID:-}" || -z "${AWS_SECRET_ACCESS_KEY:-}" ]]; then
  echo "Задайте AWS_ACCESS_KEY_ID и AWS_SECRET_ACCESS_KEY (статический ключ Object Storage)." >&2
  exit 1
fi

if ! command -v aws >/dev/null 2>&1; then
  echo "Нужен AWS CLI (совместим с Yandex Object Storage): brew install awscli" >&2
  exit 1
fi

echo "==> npm run build"
npm run build

echo "==> sync dist/ → s3://$BUCKET/"
aws s3 sync dist/ "s3://$BUCKET/" \
  --endpoint-url="$ENDPOINT" \
  --acl public-read \
  --delete

echo
echo "Готово. Проверьте website-URL бакета в консоли Object Storage."
echo "Пример: http://$BUCKET.website.yandexcloud.net"
