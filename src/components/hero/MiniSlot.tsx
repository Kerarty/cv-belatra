import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { SymbolId } from '../../game/types'
import { SymbolArt } from '../slotlab/SymbolArt'

const POOL: SymbolId[] = ['carnival', 'star', 'diamond', 'mask', 'target', 'carousel']

function randomSymbol(): SymbolId {
  return POOL[Math.floor(Math.random() * POOL.length)]
}

/** Декоративный арочный автомат главного экрана: 3 барабана + кнопка SPIN */
export function MiniSlot() {
  const [reels, setReels] = useState<SymbolId[]>(['star', 'carnival', 'diamond'])
  const [spinning, setSpinning] = useState(false)
  const [jackpot, setJackpot] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setJackpot(false)

    const tick = setInterval(() => {
      setReels((prev) => prev.map(() => randomSymbol()))
    }, 80)
    timers.current.push(Number(tick))

    // Последовательная остановка барабанов
    ;[500, 850, 1200].forEach((delay, i) => {
      const t = window.setTimeout(() => {
        setReels((prev) => {
          const next = [...prev]
          next[i] = randomSymbol()
          return next
        })
        if (i === 2) {
          clearInterval(tick)
          setReels((final) => {
            if (final[0] === final[1] && final[1] === final[2]) setJackpot(true)
            return final
          })
          setSpinning(false)
        }
      }, delay)
      timers.current.push(t)
    })
  }

  return (
    <div className="minislot" aria-label="Декоративная слот-машина">
      <div className="minislot-arch">
        <div className="minislot-marquee">NEON CARNIVAL</div>
        <div className={`minislot-reels ${spinning ? 'spinning' : ''}`}>
          {reels.map((id, i) => (
            <motion.div
              key={i}
              className="minislot-cell"
              animate={spinning ? { y: [0, -5, 5, 0] } : { y: 0 }}
              transition={{ repeat: spinning ? Infinity : 0, duration: 0.16 }}
            >
              <SymbolArt id={id} />
            </motion.div>
          ))}
        </div>
      </div>
      <div className="minislot-msg" aria-live="polite">
        {jackpot ? <span className="jackpot">JACKPOT! ×3</span> : <span>Попробуй удачу</span>}
      </div>
      <button className="btn btn-gold btn-block" onClick={spin} disabled={spinning}>
        {spinning ? 'Крутится…' : 'SPIN'}
      </button>
      <div className="minislot-credits">DEMO · БЕЗ РЕАЛЬНЫХ СТАВОК</div>
    </div>
  )
}
