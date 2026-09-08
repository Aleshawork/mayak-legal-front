# Деплой фронта Маяк на Yandex Cloud

Рекомендуемый хостинг: **Object Storage** (+ опционально CDN) — доступен из России без VPN.

Страницы: `/`, `/about`, `/property`, `/build`, `/reports`, `/faq`, `/blog`, `/contacts`, `/legal`, `/pay`, `/privacy`, `/terms`, `/offer`, `/cookie`, плюс `/pricing.md` и `/llms.txt`.

---

## Способ A — SourceCraft CI/CD (рекомендуется)

После push в `main` сайт собирается и заливается в бакет автоматически.

### 1. Бакет Object Storage

1. [Консоль Object Storage](https://console.yandex.cloud) → создать бакет, например `mayak-legal-front`
2. Включить **хостинг сайта**, главная страница: `index.html`
3. Публичное чтение объектов

Если имя бакета другое — поменяйте `BUCKET_NAME` в [`.sourcecraft/ci.yaml`](.sourcecraft/ci.yaml).

### 2. Сервисный аккаунт

1. IAM → создать SA, например `mayak-front-deploy`
2. На каталог: роль `storage.editor` (для заливки файлов)

### 3. Сервисное подключение в SourceCraft

1. Репозиторий → **Настройки** → **Сервисные подключения** → **Новое**
2. Имя: `mayak-default` (как в `ci.yaml`)
3. Укажите каталог и сервисный аккаунт

Инструкция: [сервисные подключения](https://sourcecraft.dev/portal/docs/ru/sourcecraft/operations/service-connections)

### 4. Запуск деплоя

Конфиг уже в репозитории: `.sourcecraft/ci.yaml`.

```bash
git push origin main
```

В SourceCraft откройте **CI/CD** и дождитесь успешного workflow `build-and-deploy`.

Сайт: website-URL бакета, например  
`http://mayak-legal-front.website.yandexcloud.net`

---

## Способ B — ручной деплой с ноутбука

### Сборка

```bash
npm install
npm run build
```

Готовая статика: `dist/`.

### Заливка скриптом

```bash
export YC_BUCKET=mayak-legal-front
export AWS_ACCESS_KEY_ID=...        # статический ключ Object Storage
export AWS_SECRET_ACCESS_KEY=...
npm run deploy:yc
```

Нужен AWS CLI: `brew install awscli`.

---

## HTTPS и домен `mayak-legal.ru`

1. [Certificate Manager](https://console.yandex.cloud) — сертификат для `mayak-legal.ru` и `www`
2. [CDN](https://console.yandex.cloud) — origin = бакет, подключить сертификат и домен
3. DNS у регистратора — на CDN (как покажет консоль)
4. Отключить Cloudflare / Tilda, когда новый сайт стабильно открывается

---

## (Опционально) API Gateway

Если API уже на Yandex API Gateway, статику можно отдавать с того же домена из Object Storage через шлюз.

---

## Формы

Сейчас формы только UI (валидация + «заявка принята»), без отправки на сервер.  
Подключение к API лидов/оплаты — отдельный шаг.
