# CLAUDE.md

Это тестовый проект на Angular, который мы делаем вместе с Claude.

## Запуск

- Dev-версия: `npm run dev` (или `npm start`) — `ng serve`, http://localhost:4200

## Правила ведения файла

После каждого значимого шага добавляй сюда запись в журнал ниже (что сделано и текущее состояние проекта), чтобы сохранять контекст между сессиями.

## Журнал шагов

1. Создан Angular-проект в корне папки (CSS, без роутинга и SSR, без git). Шаблон `src/app/app.html` пустой. Добавлены npm-скрипты `dev` и `start` (оба `ng serve`). Dev-сервер проверен, работает на порту 4200.
2. Создан этот файл CLAUDE.md.
3. Проект переведён с CSS на SCSS: `src/styles.scss`, `src/app/app.scss`, в `angular.json` подключён `styles.scss` и задан `@schematics/angular:component` со `style: scss` для новых компонентов. Проверено, что в проекте только TypeScript (`.ts`, нет `.js`-исходников). Сборка `ng build` проходит.
4. Создан компонент `header` (`src/app/components/header`, селектор `app-header`), подключён в `App`. Header на всю ширину, фон `rgba(255, 0, 0, 0.5)`, высота `min-height: 64px` (без неё пустой header невидим), внутри пустой `.container`, без кнопок и наполнения. В `styles.scss` добавлены `--content-width: 1440px`, класс `.container` (max-width 1440px по центру) для всего проекта и `body { margin: 0 }`.
5. Создан компонент `content` (`src/app/components/content`, селектор `app-content`), подключён в `App` под `app-header`. Блок `<main class="content">` с `max-width: var(--content-width)` (1440px), отцентрирован, `min-height: 64px`, фон `rgba(0, 255, 0, 0.5)`, внутри пустой `.container`, без наполнения.
6. Блок `content` растянут на всю оставшуюся высоту страницы: `App` — flex-колонка с `min-height: 100vh`, `app-content` и `.content` с `flex: 1`; у `content` убран `min-height: 64px` (он больше не нужен). Header остаётся 64px, у `app-header` добавлен `display: block`.
7. Тема проекта — страны, данные из REST Countries. Ключ API лежит в `.env` (переменная `REST_COUNTRIES_API_KEY`), файл добавлен в `.gitignore`; шаблон без секрета — `.env.example`. Значение ключа не записывать в CLAUDE.md, код и коммиты. Ключ пока нигде не подключён в коде.
8. Заготовка слоя данных (запросов пока нет): `provideHttpClient()` в `app.config.ts`; `src/app/services/country-api.ts` (класс `CountryApi`, внутри `HttpClient`); `src/app/services/country-store.ts` (класс `CountryStore`, хранилище на сигналах: `countries`, `loading`, `error`, `count`; RxJS только для HTTP); минимальная модель `src/app/models/country.ts`. Сервисы объявлены через `@Service()` (новый декоратор Angular, суффикс `.service` в именах не используем).
9. Создан универсальный компонент `header-button` (`src/app/components/header-button`, селектор `app-header-button`): обёртка над `<button type="button">` с обязательным signal-input `label`, стили сброшены так, что выглядит как простой текст. В `header` выводятся 7 кнопок «Continent 1» … «Continent 7» через `@for` из массива `continents`; `.container` в header — flex, gap 24px. Действий по клику пока нет.
10. Стили кнопок header: по правому краю (`justify-content: flex-end` у `.header__inner`), текст UPPERCASE, `font-weight: 700`, `font-size: 14px` (в `header-button.scss`). Добавлен файл цветов `src/styles/_colors.scss` с CSS-переменными в `:root`; первая — `--color-text: #1e1e1e` (основной цвет текста). Подключён через `@use 'styles/colors'` в `styles.scss`, применён к `body` и явно к `.header`; кнопки наследуют цвет. Новые цвета добавлять в этот файл.
11. Шрифт проекта — Arial, sans-serif: переменная `--font-family` в `src/styles/_fonts.scss` (подключён через `@use` в `styles.scss`), применена к `body`. Кнопки наследуют шрифт (`font: inherit`). Новые шрифтовые переменные добавлять в этот файл.
12. Создан компонент `country-board` (`src/app/components/country-board`, селектор `app-country-board`), выводится внутри `content`; показывает выбранный континент из `CountryStore` или «Select a continent». `header-button` получил output `pressed`; `header` по клику вызывает `store.loadByContinent(continent)`. Модель `Continent` (`id`, `label`) в `src/app/models/continent.ts`. В `CountryStore` добавлены сигнал `selectedContinent` и метод `loadByContinent` — пока заглушка (только сохраняет выбранный континент, TODO: запрос через `CountryApi`).
13. Кнопок в header теперь 6 (было 7) — по числу регионов REST Countries (Africa, Americas, Asia, Europe, Oceania, Antarctic). Инициализирован git (ветка `main`), сделан первый коммит; `.env` проверен — в индекс не попадает. Удалённый репозиторий GitHub `AI-Coded-Angular-Project` пока не создан (`gh` не установлен). Тесты решено писать позже, `app.spec.ts` от стартового шаблона пока устарел.
