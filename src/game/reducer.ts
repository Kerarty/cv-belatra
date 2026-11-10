import { BASE_BET, START_BALANCE } from './engine'
import type {
  BonusConfig,
  BonusState,
  GameAction,
  GameEvent,
  GameState,
  PavilionType,
  WinLine,
} from './types'
import { SYMBOLS } from '../data/symbols'

/** Красивое стартовое поле — без RNG на этапе инициализации */
const INITIAL_GRID: GameState['grid'] = [
  ['diamond', 'mask', 'balloon'],
  ['diamond', 'balloon', 'star'],
  ['mask', 'star', 'diamond'],
  ['balloon', 'mask', 'target'],
  ['target', 'carousel', 'balloon'],
]

const MAX_EVENTS = 40

export function createInitialState(): GameState {
  return {
    phase: 'ready',
    grid: INITIAL_GRID,
    wins: [],
    scatterCells: [],
    lastWin: 0,
    balance: START_BALANCE,
    bet: BASE_BET,
    spinCount: 0,
    bonus: null,
    events: [
      { id: 0, kind: 'info', text: 'Добро пожаловать в Neon Carnival. Демо-баланс: 1000.' },
    ],
    eventSeq: 1,
  }
}

function withEvent(state: GameState, kind: GameEvent['kind'], text: string): GameState {
  const events = [{ id: state.eventSeq, kind, text }, ...state.events].slice(0, MAX_EVENTS)
  return { ...state, events, eventSeq: state.eventSeq + 1 }
}

/** Защита переходов: из каких фаз разрешён спин */
function canSpin(phase: GameState['phase']): boolean {
  return phase === 'ready' || phase === 'result'
}

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    // ---------- Запуск базового спина ----------
    case 'SPIN_START': {
      if (!canSpin(state.phase)) return state
      let balance = state.balance
      let next = state
      if (balance < state.bet) {
        balance += 500
        next = withEvent(state, 'info', 'Демо-баланс пополнен на 500 — продолжаем крутить.')
      }
      next = {
        ...next,
        phase: 'spinning',
        grid: action.grid,
        wins: [],
        scatterCells: [],
        lastWin: 0,
        balance: balance - state.bet,
      }
      return withEvent(next, 'info', `Ставка −${state.bet}. Барабаны запущены.`)
    }

    // ---------- Барабаны остановились: переход в проверку ----------
    case 'EVALUATE': {
      if (state.phase !== 'spinning') return state
      return { ...state, phase: 'evaluating' }
    }

    // ---------- Результаты проверены ----------
    case 'RESOLVE': {
      if (state.phase !== 'evaluating') return state
      const { evaluation } = action

      // ---- Контекст бонусной сессии ----
      if (state.bonus) {
        const bonus: BonusState = {
          ...state.bonus,
          freeSpinsLeft: Math.max(0, state.bonus.freeSpinsLeft - 1),
          spinsDone: state.bonus.spinsDone + 1,
          bonusWin: state.bonus.bonusWin + evaluation.totalWin,
        }
        const parts: string[] = []
        if (evaluation.totalWin > 0) parts.push(`+${evaluation.totalWin}`)
        if (evaluation.scatterCount > 0) parts.push(`Scatter ×${evaluation.scatterCount}`)
        const text = parts.length
          ? `Free spin ${bonus.spinsDone}: ${parts.join(', ')}`
          : `Free spin ${bonus.spinsDone}: без выигрыша`
        const kind = evaluation.totalWin > 0 ? 'win' : 'info'
        return withEvent(
          {
            ...state,
            phase: bonus.freeSpinsLeft > 0 ? 'bonusGame' : 'bonusResult',
            bonus,
            grid: state.grid,
            // Сохраняем выигрыш последнего фри-спина для подсветки линий
            wins: evaluation.wins,
            scatterCells: evaluation.scatterCells,
            lastWin: evaluation.totalWin,
          },
          kind,
          text,
        )
      }

      // ---- Базовая игра ----
      const winLines = evaluation.wins
      let base = { ...state, wins: winLines, scatterCells: evaluation.scatterCells }
      if (evaluation.totalWin > 0) {
        base = {
          ...base,
          lastWin: evaluation.totalWin,
          balance: state.balance + evaluation.totalWin,
        }
        base = withEvent(
          base,
          'win',
          winLines.length > 0
            ? `Выигрыш +${evaluation.totalWin}: ${winLines.map((w) => `${SYMBOLS[w.symbol].name} ×${w.count}`).join(', ')}${evaluation.scatterPayout > 0 ? ' + Scatter' : ''}`
            : `Scatter выплата +${evaluation.totalWin}`,
        )
      } else {
        base = withEvent(base, 'lose', `Спин ${state.spinCount + 1}: без выигрыша.`)
      }

      if (evaluation.triggersBonus) {
        base = withEvent(
          { ...base, phase: 'bonusTrigger', spinCount: state.spinCount + 1 },
          'bonus',
          `🎁 Scatter ×${evaluation.scatterCount} — открывается Prize Parade!`,
        )
        return base
      }

      return { ...base, phase: 'result', spinCount: state.spinCount + 1 }
    }

    // ---------- Выбор павильона в Prize Parade ----------
    case 'PICK_PAVILION': {
      if (state.phase !== 'bonusTrigger') return state
      const { pavilion, config } = action

      const bonus: BonusState = {
        multiplier: config.multiplier + (pavilion === 'multiplier' ? 2 : 0),
        freeSpinsTotal: config.freeSpins + (pavilion === 'spins' ? 3 : 0),
        freeSpinsLeft: config.freeSpins + (pavilion === 'spins' ? 3 : 0),
        wildShow: config.wildShow || pavilion === 'wild',
        extraWildWeight: config.wildShow || pavilion === 'wild' ? config.extraWildWeight : 0,
        spinsDone: 0,
        bonusWin: 0,
        pavilion,
      }

      const labels: Record<PavilionType, string> = {
        multiplier: `Множитель сессии: ×${bonus.multiplier}`,
        spins: `Free spins: ${bonus.freeSpinsTotal}`,
        wild: 'Wild Show: барабаны насыщены Wild',
      }

      return withEvent(
        { ...state, phase: 'bonusGame', bonus, wins: [], scatterCells: [] },
        'bonus',
        `Павильон выбран. ${labels[pavilion]}`,
      )
    }

    // ---------- Запуск бесплатного вращения ----------
    case 'BONUS_SPIN_START': {
      if (state.phase !== 'bonusGame' || !state.bonus) return state
      return { ...state, phase: 'spinning', grid: action.grid, wins: [], scatterCells: [], lastWin: 0 }
    }

    // ---------- Забрать выигрыш бонуса ----------
    case 'COLLECT_BONUS': {
      if (state.phase !== 'bonusResult' || !state.bonus) return state
      const won = state.bonus.bonusWin
      const next = withEvent(
        {
          ...state,
          phase: 'result',
          balance: state.balance + won,
          lastWin: won,
          bonus: null,
        },
        won > 0 ? 'win' : 'info',
        won > 0 ? `Бонус завершён. Приз +${won} зачислен на баланс.` : 'Бонус завершён без приза.',
      )
      return next
    }

    // ---------- Пополнение демо-баланса ----------
    case 'TOPUP':
      return withEvent(
        { ...state, balance: state.balance + action.amount },
        'info',
        `Демо-баланс пополнен на ${action.amount}.`,
      )

    // ---------- Полный сброс ----------
    case 'RESET':
      return createInitialState()

    default:
      // Любой некорректный переход игнорируется — стейт-машина защищена
      return state
  }
}

/** Хелпер: подсветка выигрышных ячеек */
export function winningCells(wins: WinLine[]): Set<string> {
  const set = new Set<string>()
  for (const w of wins) for (const c of w.cells) set.add(`${c.reel}-${c.row}`)
  return set
}

export type { BonusConfig }
