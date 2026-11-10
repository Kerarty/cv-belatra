# AGENTS.md — правила работы над проектом Game Design Studio

Интерактивное резюме геймдизайнера (Ярослав Кукар, Junior Game Designer) для отклика в **Belatra Games**.
Концепция: *Interactive Game Designer Portfolio*, стиль **Art-Deco Gold** (люкс-казино 1930-х: чёрный + золото + слоновая кость, прямые линии, орнаменты ◆, гравюрные символы).
Центральный элемент — собственная демонстрационная слот-игра **Neon Carnival** с бонусной механикой **Prize Parade** и авторскими SVG-символами (`SymbolArt.tsx`, золотая гравюра).

## Команды

| Действие   | Команда           |
| ---------- | ----------------- |
| Разработка | `npm run dev`     |
| Проверка типов | `npm run typecheck` |
| Сборка     | `npm run build`   |
| Превью сборки | `npm run preview` |

Сборка обязана проходить без ошибок TypeScript перед коммитом.

## Технологии

- React 18 + TypeScript (strict) + Vite
- Framer Motion — анимации
- Lucide React — иконки
- Чистый CSS с переменными (без Tailwind), шрифты Cinzel + Manrope

## Структура

```
src/
  data/      — контент разделов (профиль, навыки, проекты, символы, GDD, тюнинг)
  game/      — игровое ядро: types, engine (RNG/выплаты), paylines, reducer (стейт-машина)
  components/
    ui/      — базовые компоненты (кнопки, карточки, модалки, вкладки)
    layout/  — навигация, футер
    hero/    — главный экран Start Game
    profile/ — Player Profile
    slotlab/ — Slot Lab: поле 5×3, барабаны, HUD, лог
    bonus/   — Prize Parade: павильоны, free spins
    gdd/     — документация Neon Carnival
    tuning/  — Feature Tuning
    portfolio/ — проекты
    process/ — Design Process
    why/     — Why Belatra
    contact/ — контакты
  styles/    — tokens.css (дизайн-система), base.css, ui.css, sections.css, slot.css
```

## Правила кода

1. Строгий TypeScript: без `any`, без неиспользуемых импортов.
2. Данные — в `src/data/*`, компоненты не хранят контент внутри себя.
3. Игровая логика — только в `src/game/*`, компоненты только отображают состояние.
4. Цвета, шрифты, радиусы, тени — только через CSS-переменные из `tokens.css`. Палитра: фон `#0d0a07`, золото `#d4af37`/`#f1d27a`, кость `#f7f1df`, штрих гравюры `--gold-mid`. Не вводить посторонние цвета (бирюза/розовый запрещены).
5. Состояния слота защищены от некорректных переходов (spin возможен только из `ready`/`result`).
6. Анимации умеренные: никакой перегрузки, `prefers-reduced-motion` уважается.
7. Адаптив: desktop → tablet (≤1024px) → mobile (≤680px).

## Git

- Ветка `main`, осмысленные коммиты по этапам разработки (`feat:`, `chore:`, `fix:`, `docs:`).
- Публикация: GitHub Pages из `main` через GitHub Actions (`.github/workflows/deploy.yml`), base `/cv-belatra/`.
