import { SYMBOLS } from '../data/symbols'
import type { CellRef, Grid, SpinEvaluation, SymbolId, WinLine } from './types'
import { PAYLINES } from './paylines'

const IDS = Object.keys(SYMBOLS) as SymbolId[]

const REELS = 5
const ROWS = 3

/** Взвешенный выбор символа. extraWildWeight усиливает выпадение Wild (режим Wild Show). */
function pickWeighted(extraWildWeight = 0): SymbolId {
  let total = 0
  const weights = IDS.map((id) => {
    const w = SYMBOLS[id].weight + (id === 'star' ? extraWildWeight : 0)
    total += w
    return w
  })
  let r = Math.random() * total
  for (let i = 0; i < IDS.length; i++) {
    r -= weights[i]
    if (r < 0) return IDS[i]
  }
  return IDS[IDS.length - 1]
}

export function spinGrid(extraWildWeight = 0): Grid {
  return Array.from({ length: REELS }, () =>
    Array.from({ length: ROWS }, () => pickWeighted(extraWildWeight)),
  )
}

export interface EvaluateOptions {
  /** Множитель сессии (базовая игра — 1, бонус — по конфигу) */
  multiplier: number
  /** Ставка игрока (влияет на выплату Scatter) */
  bet: number
  /** Сколько Scatter нужно для бонуса */
  scatterToTrigger: number
}

/**
 * Оценка поля: выигрышные линии слева направо + Scatter в любом месте.
 * Wild (star) заменяет любые символы, кроме Ticket.
 */
export function evaluateGrid(grid: Grid, opts: EvaluateOptions): SpinEvaluation {
  const wins: WinLine[] = []

  PAYLINES.forEach((line, lineIndex) => {
    const path = line.map((row, reel) => ({ reel, row, id: grid[reel][row] }))
    const first = path[0].id
    // Scatter не участвует в линиях
    if (first === 'ticket') return

    // Лид линии: первый не-Wild символ; линия из одних Wild платит как Wild
    const lead: SymbolId =
      first !== 'star'
        ? first
        : (path.find((c) => c.id !== 'star' && c.id !== 'ticket')?.id ?? 'star')

    let count = 0
    for (const cell of path) {
      if (cell.id === lead || (cell.id === 'star' && lead !== 'ticket')) count++
      else break
    }

    if (count >= 3) {
      const payIndex = Math.min(count, 5) - 3
      const payout = SYMBOLS[lead].pays[payIndex] * opts.multiplier
      wins.push({
        lineIndex,
        symbol: lead,
        count,
        payout,
        cells: path.slice(0, count).map((c) => ({ reel: c.reel, row: c.row })),
      })
    }
  })

  // Scatter считается по всему полю
  const scatterCells: CellRef[] = []
  grid.forEach((reelSymbols, reel) =>
    reelSymbols.forEach((id, row) => {
      if (id === 'ticket') scatterCells.push({ reel, row })
    }),
  )
  const scatterCount = scatterCells.length
  let scatterPayout = 0
  if (scatterCount >= 3) {
    const payIndex = Math.min(scatterCount, 5) - 3
    scatterPayout = Math.round(SYMBOLS.ticket.pays[payIndex] * (opts.bet / 20) * opts.multiplier)
  }

  const totalWin =
    wins.reduce((sum, w) => sum + w.payout, 0) + scatterPayout

  return {
    wins,
    scatterCells,
    scatterCount,
    scatterPayout,
    totalWin,
    triggersBonus: scatterCount >= opts.scatterToTrigger,
  }
}

/** Демо-баланс при старте */
export const START_BALANCE = 1000
export const BASE_BET = 20
