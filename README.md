# Game Design Studio — интерактивное резюме

**Ярослав Кукар · Junior Game Designer** — интерактивное портфолио для отклика в **Belatra Games**.

🔗 **Живая версия:** <https://kerarty.github.io/cv-belatra/>

## Что внутри

| Раздел | Содержание |
| --- | --- |
| **Start Game** | Главный экран с декоративной слот-машиной (3 барабана, кнопка SPIN) |
| **Player Profile** | Образование (БГУИР), About Me, Game Design Skills, Technical Skills |
| **Slot Lab** | Собственная слот-игра **Neon Carnival**: 5×3, 9 линий, Wild, Scatter, стейт-машина (Ready → Spinning → Evaluating → Result → Bonus Trigger → Bonus Game), лог событий |
| **Prize Parade** | Бонусная механика: 3 павильона (Multiplier / Extra Spins / Wild Show), free spins, экран результата |
| **GDD** | 12 вкладок документации Neon Carnival: от Game Overview до Design Decisions |
| **Feature Tuning** | Живая лаборатория параметров бонуса — изменения сразу применяются к Slot Lab |
| **Portfolio** | Turn-Based Tactics, Factory Simulator, Runner, GDD, Echoloop, Playable Ads |
| **Design Process** | 5 этапов проектирования + пайплайн бонусной механики |
| **Why Belatra** | Мотивация в стилистике сайта |
| **Contact** | Контакты, PDF-резюме, письмо в Belatra |

## Технологии

React 18 · TypeScript (strict) · Vite 6 · Framer Motion · Lucide React · чистый CSS с переменными

## Команды

```bash
npm install        # установка
npm run dev        # разработка
npm run typecheck  # проверка типов
npm run build      # production-сборка (tsc + vite build)
npm run preview    # предпросмотр сборки
```

## Деплой

Сайт публикуется на GitHub Pages из ветки `gh-pages` (подкаталог `/cv-belatra/`, base задан в `vite.config.ts`):

```bash
npm run build
npx gh-pages -d dist
```

Файл `.github/workflows/deploy.yml` для автодеплоя через Actions подготовлен локально
(не закоммичен: токен без скоупа `workflow`). Чтобы включить:

```bash
gh auth refresh -s workflow   # добавить скоуп
git add -f .github && git commit -m "ci: enable Actions deploy" && git push
# затем в Settings → Pages выбрать источник GitHub Actions
```

## Структура

См. [AGENTS.md](AGENTS.md) — правила проекта, архитектура и конвенции.

---

© 2026 Ярослав Кукар · [github.com/Kerarty](https://github.com/Kerarty)
