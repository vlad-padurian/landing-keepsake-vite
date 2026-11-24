# Keepsake — лендінг на Vite + Pug + SCSS

Багатосекційний лендінг цифрової та брендингової агенції Keepsake. Розмітка повністю генерується з Pug, стилі пишуться на SCSS, збірка та оптимізація — Vite.

**Демо:** https://vlad-padurian.github.io/landing-keepsake-vite/

## Вимоги до середовища

- Node.js 20.19+ (рекомендовано 22 LTS)
- npm 10+

```bash
node -v
npm -v
```

## Команди

| Команда           | Що робить                                                                   |
| ----------------- | --------------------------------------------------------------------------- |
| `npm install`     | встановлює залежності та ініціалізує git-хуки (`prepare`)                   |
| `npm run dev`     | dev-сервер Vite з HMR (http://localhost:5173/landing-keepsake-vite/)        |
| `npm run build`   | продакшн-збірка у `dist/` (Pug, SCSS, PostCSS, мінімізація)                 |
| `npm run preview` | локальний перегляд збірки (http://localhost:4173/landing-keepsake-vite/)    |
| `npm run format`  | форматує код Prettier                                                       |
| `npm run lint`    | Stylelint для SCSS + `prettier --check`                                     |
| `npm run images`  | генерує AVIF / WebP / JPG у `src/assets/images` з `images-src/` через sharp |

Швидка перевірка після клонування:

```bash
npm install && npm run build && npm run preview && npm run lint
```

Публікація автоматична: push у `main` запускає GitHub Actions (`.github/workflows/deploy.yml`): `npm ci` → `npm run build` → деплой `dist/` на GitHub Pages. Папка `dist` у репозиторій не комітиться. У `vite.config.js` задано `base: '/landing-keepsake-vite/'`, інакше стилі й зображення на Pages не завантажаться.

## Структура проєкту

```
.
├─ .github/workflows/deploy.yml   # публікація на GitHub Pages
├─ .husky/                        # pre-commit (lint-staged), commit-msg (commitlint)
├─ images-src/                    # оригінали зображень (WebP)
├─ scripts/images.mjs             # генерація адаптивних зображень (sharp)
├─ src/
│  ├─ assets/images/              # згенеровані AVIF / WebP / JPG
│  ├─ components/                 # Pug-компоненти (header, footer, sections/*)
│  ├─ data/data.pug               # дані: масиви об'єктів (посилання, роботи, фільтри…)
│  ├─ includes/                   # sprite, fonts
│  ├─ layouts/main.pug            # базовий макет з block-ами
│  ├─ mixins/                     # btn, icon, picture, work-card, social-links
│  ├─ pages/index.pug             # сторінка (extends layout)
│  └─ styles/                     # SCSS: utils, base, layout, components, main.scss
├─ .browserslistrc
├─ .prettierrc
├─ .stylelintrc.json
├─ postcss.config.js
└─ vite.config.js
```

## Архітектура Pug

- `layouts/main.pug` — єдиний макет: `doctype`, `head` і `body` з іменованими `block` (`meta`, `title`, `fonts`, `styles`, `data`, `header`, `content`, `footer`, `scripts`).
- `pages/index.pug` — `extends` макета; перевизначає блоки, додає мета-теги через `block prepend meta` / `block append meta`.
- `components/` та `includes/` підключаються через `include`.
- `mixins/` — повторно використовувані фрагменти: `+btn`, `+icon` (вибір SVG через `case`), `+picture` (AVIF/WebP/JPG, `srcset`/`sizes`), `+work-card`, `+social-links`.
- `data/data.pug` — дані як масиви об'єктів; секції рендеряться через `each`, умови — `if`/`case`.

## Архітектура SCSS

Модулі підключаються через `@use` / `@forward` (без `@import`):

- `utils/` — змінні та мапи (`$colors`, `$breakpoints`), міксини (`mq`, `focus-ring`, `visually-hidden`…), функція `rem`;
- `base/` — CSS-змінні, reset, типографіка, хелпери;
- `layout/` — контейнер і секції;
- `components/` — по одному файлу на компонент, іменування за БЕМ (`block__element--modifier`), вкладеність ≤ 3.

`main.scss` лише підключає `base`, `layout` і `components`.

## Використані інструменти

| Інструмент                                   | Навіщо                                                 |
| -------------------------------------------- | ------------------------------------------------------ |
| Vite                                         | dev-сервер, збірка, мінімізація CSS                    |
| Vituum + `@vituum/vite-plugin-pug`           | інтеграція Pug у Vite                                  |
| Pug                                          | шаблони: layout, компоненти, міксини, дані             |
| Sass                                         | препроцесор стилів                                     |
| PostCSS + Autoprefixer                       | вендорні префікси за Browserslist                      |
| sharp                                        | генерація AVIF / WebP / JPG різних розмірів            |
| Prettier + `@prettier/plugin-pug`            | єдине форматування (Pug, SCSS, JS, JSON, MD)           |
| Stylelint (`stylelint-config-standard-scss`) | лінтинг SCSS, перевірка БЕМ, `!important`, вкладеності |
| husky + lint-staged                          | pre-commit: Stylelint і Prettier на змінених файлах    |
| commitlint (conventional)                    | перевірка повідомлень комітів                          |
| GitHub Actions                               | автоматична збірка і публікація на GitHub Pages        |

Усі інструменти збірки й лінтингу винесені в `devDependencies`, бо потрібні лише під час розробки та збірки. Версії зафіксовані в `package-lock.json`, `node_modules` і `dist` не комітяться.

## Цільові браузери (Browserslist)

```
last 2 Chrome versions
last 2 Firefox versions
last 2 Edge versions
last 2 Safari versions
last 2 iOS versions
```

Autoprefixer додає лише ті префікси, що потрібні для цього списку.

## Оптимізація: CSS та зображення

### CSS

| Варіант                  | Розмір   | gzip    |
| ------------------------ | -------- | ------- |
| Скомпільований SCSS      | 26,24 КБ | —       |
| Продакшн (мінімізований) | 21,92 КБ | 3,93 КБ |

Мінімізація скорочує CSS приблизно на 16%.

### Зображення (13 файлів: 9 `work-*` і 4 `journal-*`)

Оригінали — WebP (`work` 716 px, `journal` 300 px). Скрипт створює 1x і 2x варіанти у трьох форматах. Браузер завантажує один файл із `srcset` залежно від підтримки формату та щільності екрана.

| Група                       | Оригінал (WebP) | AVIF 1x | WebP 1x | JPG 1x (fallback) |
| --------------------------- | --------------- | ------- | ------- | ----------------- |
| `work-*` (9 шт., 358 px)    | 56,8 КБ         | 18,1 КБ | 22,1 КБ | 38,2 КБ           |
| `journal-*` (4 шт., 150 px) | 3,4 КБ          | 2,1 КБ  | 1,3 КБ  | 3,5 КБ            |

Для екранів 2x: `work` AVIF 716 px — 38,1 КБ, WebP — 47,6 КБ; `journal` AVIF 300 px — 4,2 КБ, WebP — 3,1 КБ.

Також застосовано: `width` / `height` (без зсуву макета), `loading="lazy"`, `decoding="async"` та `sizes` під реальну ширину картки.
