import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, PartyPopper, Play, Ticket } from 'lucide-react'
import { PAVILIONS } from '../../data/tuning'
import type { BonusConfig, BonusState, PavilionType } from '../../game/types'
import { PavilionArt } from '../slotlab/SymbolArt'

const PAVILION_NUMERAL: Record<PavilionType, string> = {
  multiplier: 'I',
  spins: 'II',
  wild: 'III',
}

interface PrizeParadeProps {
  mode: 'choose' | 'result'
  config: BonusConfig
  bonus: BonusState | null
  onPick: (pavilion: PavilionType) => void
  onCollect: () => void
}

/**
 * Бонусная механика Prize Parade:
 * mode 'choose' — экран выбора павильона, mode 'result' — экран завершения сессии.
 */
export function PrizeParade({ mode, config, bonus, onPick, onCollect }: PrizeParadeProps) {
  const [selected, setSelected] = useState<PavilionType | null>(null)

  const pavilion = selected ? PAVILIONS.find((p) => p.type === selected) : null

  return (
    <motion.div
      className="bonus-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      role="dialog"
      aria-modal="true"
      aria-label={mode === 'choose' ? 'Выбор павильона Prize Parade' : 'Результат бонуса'}
    >
      <div className="glow-orb" style={{ width: 380, height: 380, top: '10%', left: '12%', background: 'rgba(212,175,55,0.16)' }} />
      <div className="glow-orb" style={{ width: 320, height: 320, bottom: '8%', right: '10%', background: 'rgba(143,107,29,0.18)' }} />

      <motion.div
        className="bonus-panel"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 30, scale: 0.97 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {mode === 'choose' ? (
          <>
            <div className="bonus-marquee">
              <Ticket size={18} />
              <h3>PRIZE PARADE</h3>
              <Ticket size={18} />
            </div>
            <p className="bonus-sub">
              Билеты собраны — карнавал открывает парад призов. Выбери <b>один</b> павильон: его
              эффект будет работать всю бонусную сессию.
            </p>

            <div className="pavilion-grid">
              {PAVILIONS.map((p, i) => {
                const isActive = selected === p.type
                const isPicked = selected !== null && !isActive
                return (
                  <motion.button
                    key={p.type}
                    className={`pavilion ${isActive ? 'pavilion-active' : ''} ${isPicked ? 'pavilion-dim' : ''}`}
                    onClick={() => setSelected(p.type)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.1, duration: 0.4 }}
                    whileHover={{ y: -6 }}
                    disabled={false}
                    aria-pressed={isActive}
                  >
                    <span className="pavilion-num">{PAVILION_NUMERAL[p.type]}</span>
                    <motion.span
                      className="pavilion-art"
                      animate={isActive ? { scale: [1, 1.18, 1.08], rotate: [0, -4, 3, 0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      <PavilionArt type={p.type} size={46} />
                    </motion.span>
                    <b style={{ color: p.color }}>{p.name}</b>
                    <p className="pavilion-desc">{p.desc}</p>
                    <span className="pavilion-effect" style={{ borderColor: p.color, color: p.color }}>
                      {p.type === 'multiplier' ? `×${config.multiplier} → ×${config.multiplier + 2}` : p.effect}
                    </span>
                    {isActive && (
                      <motion.span
                        className="pavilion-check"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check size={14} />
                      </motion.span>
                    )}
                  </motion.button>
                )
              })}
            </div>

            <div className="bonus-actions">
              <AnimatePresence>
                {pavilion && (
                  <motion.button
                    key="start"
                    className="btn btn-gold btn-lg"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    onClick={() => onPick(selected!)}
                  >
                    <Play size={18} />
                    Начать free spins — {pavilion.name}
                  </motion.button>
                )}
              </AnimatePresence>
            </div>
          </>
        ) : (
          <div className="bonus-result">
            <motion.div
              className="bonus-result-icon"
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            >
              <PartyPopper size={40} />
            </motion.div>
            <h3>ПАРАД ЗАВЕРШЁН</h3>
            {bonus && (
              <>
                <div className="bonus-result-win">{bonus.bonusWin}</div>
                <p className="bonus-sub">
                  {bonus.spinsDone} бесплатных вращений · множитель ×{bonus.multiplier}
                  {bonus.wildShow ? ' · Wild Show' : ''}
                </p>
              </>
            )}
            <button className="btn btn-gold btn-lg" onClick={onCollect}>
              Забрать приз
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
