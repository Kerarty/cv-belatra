import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Coins, RotateCcw, Sparkles, Star, Ticket, Wand2 } from 'lucide-react'
import { Section, Reveal } from '../ui/ui'
import { Reel } from './Reel'
import { PaylineOverlay } from './PaylineOverlay'
import { EventLog } from './EventLog'
import { PrizeParade } from '../bonus/PrizeParade'
import { createInitialState, gameReducer, winningCells } from '../../game/reducer'
import { evaluateGrid, spinGrid } from '../../game/engine'
import type { BonusConfig } from '../../game/types'
import { ROLE_LABELS, SYMBOL_ORDER, SYMBOLS } from '../../data/symbols'
import { SymbolArt } from './SymbolArt'

const REEL_COUNT = 5

const PHASE_LABELS: Record<string, string> = {
  ready: 'Готов к запуску',
  spinning: 'Барабаны вращаются…',
  evaluating: 'Проверка комбинаций…',
  result: 'Результат',
  bonusTrigger: 'Prize Parade — выбери павильон',
  bonusGame: 'Идут бонусные вращения',
  bonusResult: 'Бонус завершён',
}

const PAVILION_LABEL: Record<string, string> = {
  multiplier: 'Multiplier Pavilion',
  spins: 'Extra Spins Pavilion',
  wild: 'Wild Show Pavilion',
}

export function SlotLab({ config }: { config: BonusConfig }) {
  const [state, dispatch] = useReducer(gameReducer, undefined, createInitialState)
  const [stoppedCount, setStoppedCount] = useState(REEL_COUNT)

  const phase = state.phase
  const spinning = phase === 'spinning'
  const bonus = state.bonus
  const inBonus = bonus !== null

  const onReelStopped = useCallback(() => setStoppedCount((c) => c + 1), [])

  // Все барабаны остановились → фаза проверки результатов
  useEffect(() => {
    if (spinning && stoppedCount === REEL_COUNT) {
      const t = window.setTimeout(() => dispatch({ type: 'EVALUATE' }), 140)
      return () => window.clearTimeout(t)
    }
  }, [spinning, stoppedCount])

  // Проверка комбинаций → показ результата
  useEffect(() => {
    if (phase !== 'evaluating') return
    const evaluation = evaluateGrid(state.grid, {
      multiplier: bonus?.multiplier ?? 1,
      bet: state.bet,
      // Повторный триггер внутри бонуса выключен (см. GDD · Design Decisions)
      scatterToTrigger: bonus ? 99 : config.scatterToTrigger,
    })
    const t = window.setTimeout(() => dispatch({ type: 'RESOLVE', evaluation }), 520)
    return () => window.clearTimeout(t)
  }, [phase, state.grid, state.bet, bonus, config.scatterToTrigger])

  // Автоматическая цепочка бесплатных вращений
  useEffect(() => {
    if (phase !== 'bonusGame' || !bonus) return
    const t = window.setTimeout(() => {
      const grid = spinGrid(bonus.extraWildWeight)
      dispatch({ type: 'BONUS_SPIN_START', grid })
      setStoppedCount(0)
    }, 1000)
    return () => window.clearTimeout(t)
  }, [phase, bonus])

  const canSpin = phase === 'ready' || phase === 'result'

  const spin = () => {
    if (!canSpin) return
    const grid = spinGrid(0)
    dispatch({ type: 'SPIN_START', grid })
    setStoppedCount(0)
  }

  const highlight = useMemo(() => {
    const set = winningCells(state.wins)
    state.scatterCells.forEach((c) => set.add(`${c.reel}-${c.row}`))
    return set
  }, [state.wins, state.scatterCells])

  // Метки результата: базовая игра и паузы между бесплатными вращениями в бонусе
  const showWinMarks =
    phase === 'result' || (inBonus && (phase === 'bonusGame' || phase === 'bonusResult'))
  const dimWins =
    state.wins.length > 0 && (phase === 'result' || (inBonus && phase === 'bonusGame'))
  const stopDelay = (i: number) => (inBonus ? 750 + i * 200 : 1050 + i * 260)

  return (
    <Section
      id="slot-lab"
      kicker="Slot Lab · Demo"
      title="Neon Carnival"
      sub="Демонстрационная слот-игра, спроектированная с нуля: 5×3, 9 линий, Wild, Scatter и бонус Prize Parade. Виртуальные очки — без реальных ставок."
      className="slotlab-section"
    >
      <div className="slotlab-grid">
        {/* ---------- Игровая машина ---------- */}
        <Reveal>
          <div className="machine">
            <div className="machine-marquee">
              <span className="lamp" />
              <span className="machine-title">NEON CARNIVAL</span>
              <span className="lamp" />
              <span className="machine-badge">DEMO</span>
            </div>

            {inBonus && bonus && (
              <div className="bonus-hud">
                <span className="bh-item">
                  <Ticket size={14} /> Free spins: <b>{bonus.freeSpinsLeft}</b>/{bonus.freeSpinsTotal}
                </span>
                <span className="bh-item">
                  ×<b>{bonus.multiplier}</b> множитель
                </span>
                <span className={`bh-item ${bonus.wildShow ? 'bh-active' : ''}`}>
                  <Star size={14} /> Wild Show {bonus.wildShow ? 'ON' : 'OFF'}
                </span>
                <span className="bh-item bh-win">
                  Приз: <b>{bonus.bonusWin}</b>
                </span>
                <span className="bh-pavilion">{bonus.pavilion ? PAVILION_LABEL[bonus.pavilion] : ''}</span>
              </div>
            )}

            <div className="machine-screen">
              <div className={`reels-grid ${spinning ? 'is-spinning' : ''}`}>
                {state.grid.map((column, i) => (
                  <Reel
                    key={i}
                    index={i}
                    symbols={column}
                    spinning={spinning}
                    stopDelay={stopDelay(i)}
                    onStopped={onReelStopped}
                    highlight={highlight}
                    dim={dimWins}
                  />
                ))}
              </div>
              <PaylineOverlay wins={showWinMarks ? state.wins : []} />

              <AnimatePresence>
                {phase === 'result' && state.lastWin > 0 && (
                  <div className="win-banner-wrap" key={state.spinCount}>
                    <motion.div
                      className="win-banner"
                      initial={{ opacity: 0, scale: 0.6 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                    >
                      WIN +{state.lastWin}
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>

            <div className="machine-hud">
              <div className="hud-cell">
                <Coins size={15} />
                <span>
                  Баланс <b>{state.balance}</b>
                </span>
              </div>
              <div className="hud-cell">
                <span>
                  Ставка <b>{state.bet}</b>
                </span>
              </div>
              <div className="hud-cell">
                <span>
                  Спин <b>{state.spinCount}</b>
                </span>
              </div>
              <button
                className="spin-btn"
                onClick={spin}
                disabled={!canSpin}
                aria-label="Запустить барабаны"
              >
                <Sparkles size={20} />
                SPIN
              </button>
              <button
                className="icon-btn"
                onClick={() => dispatch({ type: 'RESET' })}
                aria-label="Сбросить игру"
                title="Сбросить игру"
              >
                <RotateCcw size={17} />
              </button>
            </div>

            <div className="machine-status" aria-live="polite">
              {PHASE_LABELS[phase]}
              {state.wins.length > 0 && phase === 'result' && ` · линий: ${state.wins.length}`}
            </div>
          </div>
        </Reveal>

        {/* ---------- Лог событий ---------- */}
        <Reveal delay={0.1} className="slotlab-side">
          <EventLog events={state.events} />
          <div className="slotlab-hint">
            <Wand2 size={15} />
            <span>
              Ловите <b>3 билета</b> (Ticket) в любом месте поля — откроется бонус Prize Parade.
            </span>
          </div>
        </Reveal>
      </div>

      {/* ---------- Символы ---------- */}
      <Reveal delay={0.08}>
        <h3 className="legend-title">Игровые символы</h3>
        <div className="legend-grid">
          {SYMBOL_ORDER.map((id) => {
            const s = SYMBOLS[id]
            return (
              <div key={id} className="legend-card">
                <div className="legend-art">
                  <SymbolArt id={id} size={44} />
                </div>
                <div className="legend-body">
                  <div className="legend-top">
                    <b>{s.name}</b>
                    <span className="chip" style={{ color: s.color, borderColor: s.color }}>
                      {ROLE_LABELS[s.role]}
                    </span>
                  </div>
                  <div className="legend-pays">
                    3×{s.pays[0]} · 4×{s.pays[1]} · 5×{s.pays[2]}
                  </div>
                  <p className="legend-desc">{s.fn}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Reveal>

      {/* ---------- Бонусный оверлей ---------- */}
      <AnimatePresence>
        {(phase === 'bonusTrigger' || phase === 'bonusResult') && (
          <PrizeParade
            mode={phase === 'bonusTrigger' ? 'choose' : 'result'}
            config={config}
            bonus={bonus}
            onPick={(p) => dispatch({ type: 'PICK_PAVILION', pavilion: p, config })}
            onCollect={() => dispatch({ type: 'COLLECT_BONUS' })}
          />
        )}
      </AnimatePresence>
    </Section>
  )
}
