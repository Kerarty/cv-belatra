// ============================================================
// Игровое ядро Neon Carnival — типы
// ============================================================

export type SymbolId =
  | 'carnival'
  | 'ticket'
  | 'star'
  | 'diamond'
  | 'carousel'
  | 'mask'
  | 'balloon'
  | 'target'

export type SymbolRole = 'top' | 'wild' | 'scatter' | 'premium' | 'mid' | 'low'

export interface SlotSymbol {
  id: SymbolId
  name: string
  emoji: string
  role: SymbolRole
  /** Акцентный цвет символа */
  color: string
  /** Фон ячейки барабана */
  bg: string
  /** Вес появления в барабане */
  weight: number
  /** Выплаты за 3 / 4 / 5 в линию */
  pays: [number, number, number]
  desc: string
  /** Игровая функция символа */
  fn: string
}

/** Поле 5 барабанов × 3 ряда: grid[reel][row] */
export type Grid = SymbolId[][]

export interface CellRef {
  reel: number
  row: number
}

export interface WinLine {
  lineIndex: number
  symbol: SymbolId
  count: number
  payout: number
  cells: CellRef[]
}

export interface SpinEvaluation {
  wins: WinLine[]
  scatterCells: CellRef[]
  scatterCount: number
  scatterPayout: number
  totalWin: number
  triggersBonus: boolean
}

/** Фазы игровой стейт-машины */
export type Phase =
  | 'ready' // ожидание запуска
  | 'spinning' // барабаны вращаются
  | 'evaluating' // проверка результатов после остановки
  | 'result' // показ результатов базовой игры
  | 'bonusTrigger' // выпало нужное число Scatter — выбор павильона
  | 'bonusGame' // идут бесплатные вращения
  | 'bonusResult' // экран завершения бонуса

export type PavilionType = 'multiplier' | 'spins' | 'wild'

/** Конфигурация бонусной сессии (управляется из Feature Tuning) */
export interface BonusConfig {
  /** Стартовое количество free spins */
  freeSpins: number
  /** Базовый множитель бонусной сессии */
  multiplier: number
  /** Включён ли Wild Show (доп. Wild в барабанах) */
  wildShow: boolean
  /** Насколько сильнее выпадает Wild во время Wild Show */
  extraWildWeight: number
  /** Сколько Scatter нужно для активации бонуса */
  scatterToTrigger: number
}

export interface BonusState {
  multiplier: number
  freeSpinsLeft: number
  freeSpinsTotal: number
  wildShow: boolean
  extraWildWeight: number
  spinsDone: number
  bonusWin: number
  pavilion: PavilionType | null
}

export type EventKind = 'info' | 'win' | 'bonus' | 'lose'

export interface GameEvent {
  id: number
  kind: EventKind
  text: string
}

export interface GameState {
  phase: Phase
  grid: Grid
  wins: WinLine[]
  scatterCells: CellRef[]
  lastWin: number
  balance: number
  bet: number
  spinCount: number
  bonus: BonusState | null
  events: GameEvent[]
  eventSeq: number
}

export type GameAction =
  | { type: 'SPIN_START'; grid: Grid }
  | { type: 'EVALUATE' }
  | { type: 'RESOLVE'; evaluation: SpinEvaluation }
  | { type: 'PICK_PAVILION'; pavilion: PavilionType; config: BonusConfig }
  | { type: 'BONUS_SPIN_START'; grid: Grid }
  | { type: 'COLLECT_BONUS' }
  | { type: 'TOPUP'; amount: number }
  | { type: 'RESET' }
