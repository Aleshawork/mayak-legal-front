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
- Статьи блога — файлы `content/blog/*.md` (см. `content/blog/_КАК_ДОБАВИТЬ_СТАТЬЮ.md`). Страницы `blog/<slug>/`, карточки в `blog/index.html`, строки в `sitemap.xml` и `llms.txt` создаёт `scripts/blog.mjs` при `npm run build`; вручную их не править. SourceCraft собирает сайт каждый день в 09:00 МСК, статья выходит в свою дату.
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

- **Проверка объекта** (`DD_SKUS`: `obj-fast`, `obj-deep`, `obj-full`): форма → `/api/dd/form` → `/api/dd/case` → `/api/dd/upload-url` → PUT в Object Storage → `/api/dd/commit` → `/checkout/` → кнопка `#coPay` → `/api/dd/start` → переход по полю `оплата` ответа → Robokassa.
- `501` от `/api/dd/start` — оплата на сервере ещё не подключена; текст клиенту — «оплата подключается».
- Возврат с Robokassa — `/payment/success/` (успех) и `/payment/fail/` (отказ), метод GET; адреса задаются в кабинете Robokassa (решения 577, § 4 и 578, § 2.2). На обеих — цель Метрики `robokassa_return`; на `/payment/fail/` ещё `payment_fail` (решение 583, § 2). Статус заказа страницы не меняют и сервер не зовут.
- Прежняя `/payment/result/?rk=ok|fail` остаётся как была: её судьбу решает Вероника. URL страниц не переименовывать.
- **Оплату отмечает сервер** по уведомлению Robokassa (ResultURL на шлюзе). Возврат на страницу сайта оплатой не считается: клиент узнаёт о ней письмом.
- Заказ проверки объекта (`/api/dd/case`): третье согласие `{"вид":"реклама","дано":true,"редакция":DD_ADS_REV,"текст":…}` — только при отмеченной необязательной галочке; `ref` из `localStorage` `mayak_ref` — верхним полем, только если проходит правило приёмной (до 64 знаков, A–Z a–z 0–9 - . _ ~), иначе не шлётся (решения 573, 579, § 6).
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
