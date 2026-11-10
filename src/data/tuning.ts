import type { BonusConfig, PavilionType } from '../game/types'

/** Значения бонусной функции по умолчанию */
export const DEFAULT_BONUS_CONFIG: BonusConfig = {
  freeSpins: 8,
  multiplier: 2,
  wildShow: false,
  extraWildWeight: 6,
  scatterToTrigger: 3,
}

/** Пределы настройки — выбраны как безопасный диапазон демо-баланса */
export const TUNING_LIMITS: Record<keyof BonusConfig, { min: number; max: number }> = {
  freeSpins: { min: 4, max: 16 },
  multiplier: { min: 1, max: 6 },
  extraWildWeight: { min: 0, max: 12 },
  scatterToTrigger: { min: 3, max: 5 },
  wildShow: { min: 0, max: 1 },
}

export interface TuningParam {
  key: keyof BonusConfig
  label: string
  desc: string
  impact: string
  type: 'number' | 'bool'
  step?: number
}

export const TUNING_PARAMS: TuningParam[] = [
  {
    key: 'freeSpins',
    label: 'Free Spins',
    desc: 'Стартовое количество бесплатных вращений в Prize Parade.',
    impact: 'Чем больше — тем дольше бонус и выше суммарный потенциал сессии.',
    type: 'number',
    step: 1,
  },
  {
    key: 'multiplier',
    label: 'Множитель',
    desc: 'Базовый множитель всех выигрышей бонусной сессии.',
    impact: 'Линейно увеличивает каждую выплату. Главный источник «потолка» приза.',
    type: 'number',
    step: 1,
  },
  {
    key: 'wildShow',
    label: 'Wild Show',
    desc: 'Насыщение барабанов дополнительными Wild на время бонуса.',
    impact: 'Растёт частота длинных комбинаций. Самый агрессивный параметр.',
    type: 'bool',
  },
  {
    key: 'extraWildWeight',
    label: 'Сила Wild Show',
    desc: 'Насколько сильнее выпадает Wild во время Wild Show.',
    impact: '0 — как в базовой игре; 12 — Wild выпадает в 4 раза чаще.',
    type: 'number',
    step: 1,
  },
  {
    key: 'scatterToTrigger',
    label: 'Scatter для триггера',
    desc: 'Сколько билетов (Scatter) запускают Prize Parade.',
    impact: '3 — бонус заходит часто; 5 — редкое крупное событие.',
    type: 'number',
    step: 1,
  },
]

export interface Pavilion {
  type: PavilionType
  name: string
  emoji: string
  color: string
  desc: string
  effect: string
}

export const PAVILIONS: Pavilion[] = [
  {
    type: 'multiplier',
    name: 'Multiplier Pavilion',
    emoji: '🎆',
    color: 'var(--gold-bright)',
    desc: 'Фейерверки усиливают каждый выигрыш сессии.',
    effect: '+2 к множителю (итог ×{multiplier})',
  },
  {
    type: 'spins',
    name: 'Extra Spins Pavilion',
    emoji: '🎟️',
    color: 'var(--gold)',
    desc: 'Билетная будка выдаёт дополнительные вращения.',
    effect: '+3 free spins',
  },
  {
    type: 'wild',
    name: 'Wild Show Pavilion',
    emoji: '✨',
    color: 'var(--gold-deep)',
    desc: 'Сцена наполняется Wild-звёздами.',
    effect: 'Wild Show включён на всю сессию',
  },
]
