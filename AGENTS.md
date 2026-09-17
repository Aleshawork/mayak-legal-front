# Правила проекта для ИИ-агентов

Сайт mayak-legal.ru — статический фронтенд на Vite (MPA, без фреймворка). Вся разметка в HTML-файлах, вся логика в одном `js/main.js`, все стили в одном `css/main.css`.

## Команды

```bash
npm install     # зависимости
npm run dev     # локально, http://localhost:5173
npm run build   # сборка в dist/, обязательна перед коммитом
npm run preview # посмотреть собранный dist/
```

## Структура

- Страница = папка со `index.html`: `about/index.html` → URL `/about/`. Главная — корневой `index.html`.
- Новая страница требует трёх правок: файл `slug/index.html`, слаг в массиве `pages` в `vite.config.js`, строка в `public/_redirects`.
- `js/main.js` — единый скрипт для всех страниц. Один IIFE, ES5-стиль (`var`, `function`), без импортов и сборки модулей. Подключается как `<script type="module" src="../js/main.js">` — без `type="module"` Vite не соберёт его в бандл.
- `css/main.css` — единый файл стилей.
- `public/` копируется в `dist/` как есть: PDF в `public/otchety/`, а также `robots.txt`, `sitemap.xml`, `pricing.md`, `llms.txt`, `favicon.svg`, `404.html`.
- Юридические документы существуют и как страницы (`privacy/`, `terms/`, `offer/`, `cookie/`), и как модалки через `data-doc` — при правке текста синхронизировать оба места.

## Каталог услуг и формы

- `SVC` — услуги: название, цена строкой (`p`) и числом (`pr`), срок, покрытие рисков.
- `FORMS` — поля формы заявки для каждой услуги, `INC` — блок «что входит», `PACKS` — пакеты для риелторов.
- Кнопка открытия заявки — `data-form="svc" data-svc="<ключ из SVC>"`.
- Цену в разметке и `SVC[key].pr` держать согласованными, иначе в ЮKassa уйдёт не та сумма.

## Оплата — трогать только по согласованию

Работающая цепочка: форма → `/checkout/` → кнопка `#coPay` → ЮKassa → `/payment/result/`.

- `ESTATE_API` — адрес Yandex API Gateway. Не менять.
- `API_PAY_SKUS` — услуги, у которых оплата реально подключена (сейчас `obj-fast`, `obj-deep`, `obj-full`). Остальные платные услуги на checkout показывают «скоро».
- `startEstateCase` — `/api/case` → `/api/upload-url` → PUT в Object Storage → `/api/commit` → `/api/start`.
- `waitForPayment` — поллинг `/api/status` (50 попыток по 2.5 с) по полям `payment_status` и `confirmation_url`.
- Presigned PUT подписан под конкретный метод и `Content-Type`: добавление лишних заголовков или смена метода даёт `SignatureDoesNotMatch`.
- `/payment/result/` — это `return_url` ЮKassa, задан на бэкенде. URL страницы не переименовывать.
- Редирект на `/payment/result/` не считать подтверждением оплаты.

## Деплой

- Push в `main` запускает `.sourcecraft/ci.yaml`: сборка и заливка `dist/` в бакет Object Storage `www.mayak-legal.ru`. Каждый push публикует боевой сайт.
- `.sourcecraft/ci.yaml` не менять без согласования: там заданы Content-Type для файлов и сервисное подключение.
- Плагин `stripAssetCrossorigin` в `vite.config.js` снимает атрибут `crossorigin` — без этого бакет отдаёт CSS, который браузер не применяет. Не удалять.

## Чего не делать

- Не коммитить `node_modules/` и `dist/` (уже в `.gitignore`).
- Не добавлять фреймворки, сборщики стилей и новые зависимости без согласования.
- Не разбивать `js/main.js` и `css/main.css` на модули.
- Не пушить в `main` с падающей сборкой.
