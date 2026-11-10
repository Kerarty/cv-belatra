export interface Skill {
  name: string
  level: number // 0–100 — самооценка уверенности
  note: string
  /** Якоря разделов, где навык применён */
  applied: Array<{ label: string; href: string }>
}

export const GAME_DESIGN_SKILLS: Skill[] = [
  {
    name: 'Проектирование механик',
    level: 80,
    note: 'Core loop, правила, состояния игры, Wild/Scatter-логика',
    applied: [
      { label: 'Slot Lab', href: '#slot-lab' },
      { label: 'GDD', href: '#gdd' },
    ],
  },
  {
    name: 'Баланс и математика',
    level: 75,
    note: 'Таблицы выплат, веса символов, мат. статистика и теория вероятностей',
    applied: [
      { label: 'Feature Tuning', href: '#tuning' },
      { label: 'Turn-Based Tactics', href: '#portfolio' },
    ],
  },
  {
    name: 'Бонусные функции',
    level: 72,
    note: 'Free spins, множители, Wild Show, триггеры по Scatter',
    applied: [
      { label: 'Prize Parade', href: '#slot-lab' },
      { label: 'Bonus Feature', href: '#gdd' },
    ],
  },
  {
    name: 'Документация (GDD)',
    level: 85,
    note: 'Структура под передачу в команду: параметры, edge cases, тесты',
    applied: [
      { label: 'Документация', href: '#gdd' },
      { label: 'Концепт-документ', href: '#portfolio' },
    ],
  },
  {
    name: 'Плейтесты и итерации',
    level: 80,
    note: '15+ сессий по варгейму: обратная связь → правки → повторный замер',
    applied: [
      { label: 'Design Process', href: '#process' },
      { label: 'Королевства Эридора', href: '#portfolio' },
    ],
  },
  {
    name: 'Экономика игры',
    level: 68,
    note: 'Прогрессия ресурсов, цена/награда, влияние изменений на цикл',
    applied: [
      { label: 'Factory Simulator', href: '#portfolio' },
      { label: 'GDD · Parameters', href: '#gdd' },
    ],
  },
]

export interface TechSkill {
  name: string
  icon: 'unity' | 'csharp' | 'python' | 'ai' | 'design' | 'web'
  note: string
  applied?: Array<{ label: string; href: string }>
}

export const TECH_SKILLS: TechSkill[] = [
  {
    name: 'Unity 6 / URP',
    icon: 'unity',
    note: 'Дипломный проект Factory Simulator, прототипы, headless-тесты',
    applied: [{ label: 'Factory Simulator', href: '#portfolio' }],
  },
  {
    name: 'C# / C++',
    icon: 'csharp',
    note: 'Игровая логика, данные уровней, EditMode-тесты (26 шт. в Echoloop)',
    applied: [{ label: 'Echoloop', href: '#portfolio' }],
  },
  {
    name: 'Python',
    icon: 'python',
    note: 'Скрипты баланс-расчётов и обработка плейтест-данных',
    applied: [{ label: 'Feature Tuning', href: '#tuning' }],
  },
  {
    name: 'AI-инструменты',
    icon: 'ai',
    note: 'Codex и Claude — ускорение прототипирования, код-ревью, генерация вариантов баланса',
    applied: [{ label: 'Design Process', href: '#process' }],
  },
  {
    name: 'TypeScript / JS',
    icon: 'web',
    note: 'HTML5-игры и playable-реклама: PixiJS, matter.js, SDK-адаптеры',
    applied: [{ label: 'Playable Ads', href: '#portfolio' }],
  },
  {
    name: 'Photoshop / Figma',
    icon: 'design',
    note: 'Арт-стиль в GDD, UI-макеты, подготовка графики',
    applied: [{ label: 'GDD · Art Style', href: '#gdd' }],
  },
]
