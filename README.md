# mayak-legal-front

Фронтенд сайта Маяк — статика на Vite.

Репозиторий: https://github.com/Aleshawork/mayak-legal-front

```bash
npm install
npm run dev
```

Сборка: `npm run build` → `dist/`

Деплой на Yandex Cloud / SourceCraft: [DEPLOY.md](./DEPLOY.md)

Правила проекта для ИИ-агентов: [AGENTS.md](./AGENTS.md)

---

## Онбординг разработчика (macOS)

Push в `main` автоматически публикует боевой сайт через SourceCraft CI. Поэтому перед каждым push обязателен `npm run build`.

### 1. Инструменты

Homebrew, если его ещё нет:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

На Apple Silicon добавить brew в PATH:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

git, Node.js, GitHub CLI:

```bash
brew install git node gh
git --version && node -v && npm -v && gh --version
```

### 2. Агент для правок кода

**Claude Code.** Нужен платный аккаунт Anthropic (Pro, Max, Team, Enterprise или Console с API-кредитом) — бесплатный план Claude.ai доступа не даёт. Нативный установщик не требует Node.js и обновляется сам, нужен macOS 13+:

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

Перезапустить Терминал и проверить:

```bash
claude --version
claude doctor
```

**Cursor** как альтернатива:

```bash
brew install --cask cursor
```

Команда `cursor` для терминала: в Cursor нажать `Cmd+Shift+P` → `Shell Command: Install 'cursor' command`.

### 3. Вход в GitHub

```bash
gh auth login
```

Выбрать `GitHub.com` → `HTTPS` → `Y` (authenticate Git with GitHub credentials) → `Login with a web browser`. После этого git пушит без ввода пароля.

Подпись коммитов:

```bash
git config --global user.name "Имя Фамилия"
git config --global user.email "почта-от-github@example.com"
```

### 4. Клон и запуск

```bash
mkdir -p ~/Projects && cd ~/Projects
gh repo clone Aleshawork/mayak-legal-front
cd mayak-legal-front
npm install
npm run dev
```

Локально: http://localhost:5173

Запустить агента в папке проекта — `claude` (первый запуск попросит войти через браузер, выход из сессии `/exit`) или `cursor .`

### 5. Рабочий цикл

```bash
cd ~/Projects/mayak-legal-front
git pull --rebase origin main      # забрать чужие правки
npm install                        # если менялся package.json
claude                             # правки через агента
npm run build                      # обязательная проверка сборки
git add -A
git commit -m "что изменено"
git push origin main               # публикует боевой сайт
```

Посмотреть собранный результат до push: `npm run preview`

### 6. Если что-то пошло не так

- Конфликт при `git pull --rebase`: править файлы, затем `git add <файл>` и `git rebase --continue`
- Откатить незакоммиченные правки: `git restore .`
- Отменить последний коммит, сохранив правки: `git reset --soft HEAD~1`
- Сборка упала: читать вывод `npm run build`, не пушить до зелёной сборки
- Сайт не обновился после push: смотреть workflow `build-and-deploy` в SourceCraft
- `claude: command not found`: перезапустить Терминал, затем `claude doctor`
