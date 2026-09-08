# Деплой фронта Маяк на свой домен

Рекомендуемый путь: **Cloudflare Pages** — бесплатно, HTTPS, CDN, свой домен за несколько минут.

## 1. Сборка

```bash
npm install
npm run build
```

Готовая статика лежит в `dist/`.

## 2. Cloudflare Pages (через Git)

1. Залейте репозиторий на GitHub/GitLab.
2. [dash.cloudflare.com](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → подключите репозиторий.
3. Настройки сборки:
   - **Root directory:** `/` (корень репозитория)
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
4. Deploy.

### Свой домен `mayak-legal.ru`

1. В проекте Pages → **Custom domains** → Add `mayak-legal.ru` (и при желании `www.mayak-legal.ru`).
2. Если DNS на Cloudflare — записи создадутся сами.
3. Если DNS у регистратора — добавьте то, что покажет Cloudflare (обычно CNAME на `*.pages.dev` или их A/AAAA для apex).
4. Дождитесь выдачи сертификата (обычно несколько минут).

Страницы: `/`, `/about`, `/property`, `/build`, `/reports`, `/faq`, `/blog`, `/contacts`, `/legal`, `/pay`, `/privacy`, `/terms`, `/offer`, `/cookie`, плюс `/pricing.md` и `/llms.txt`.

## 3. Быстрый деплой без Git (Wrangler)

```bash
npm i -g wrangler
npm run build
wrangler pages deploy dist --project-name mayak
```

Дальше в панели Pages привяжите домен так же, как выше.

## 4. Альтернативы

### GitHub Pages

- Actions: собрать проект → выложить `dist`.
- Домен: Settings → Pages → Custom domain → `mayak-legal.ru`, у регистратора CNAME на `username.github.io`.

### Yandex Object Storage + API Gateway

Имеет смысл, если всё держите в Yandex Cloud рядом с бэкендом:

1. Залить содержимое `dist/` в бакет (публичное чтение, website hosting).
2. В API Gateway отдать `/*` из Object Storage (`index.html` для `/` и каталогов).
3. Привязать домен к шлюзу / Certificate Manager.

Чуть больше ручной работы, чем Cloudflare Pages.

## 5. DNS после ухода с Tilda

1. Убедитесь, что новый фронт открывается на `*.pages.dev` (или тестовом URL).
2. Переключите DNS домена на Cloudflare Pages.
3. Отключите публикацию на Tilda, чтобы не было конфликта.

## 6. Формы

Сейчас формы работают в UI (валидация + «заявка принята»), без отправки на сервер.  
Подключение к API лидов/оплаты — отдельный шаг.
