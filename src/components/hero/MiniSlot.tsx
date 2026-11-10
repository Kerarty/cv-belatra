import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Dices } from 'lucide-react'

const POOL = ['🎪', '💎', '⭐', '🎈', '🎯', '🎭']

/** Декоративная слот-машина главного экрана: 3 барабана + кнопка Spin */
export function MiniSlot() {
  const [reels, setReels] = useState(['⭐', '🎪', '💎'])
  const [spinning, setSpinning] = useState(false)
  const [jackpot, setJackpot] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const spin = () => {
    if (spinning) return
    setSpinning(true)
    setJackpot(false)

    const tick = setInterval(() => {
      setReels((prev) => prev.map(() => POOL[Math.floor(Math.random() * POOL.length)]))
    }, 80)
    timers.current.push(Number(tick))

    // Последовательная остановка барабанов
    ;[500, 850, 1200].forEach((delay, i) => {
      const t = window.setTimeout(() => {
        setReels((prev) => {
          const next = [...prev]
          next[i] = POOL[Math.floor(Math.random() * POOL.length)]
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
      <div className="minislot-top">
        <span className="minislot-lamp" />
        <span className="minislot-lamp" />
        <span className="minislot-lamp" />
      </div>
      <div className="minislot-marquee">NEON CARNIVAL</div>
      <div className={`minislot-reels ${spinning ? 'spinning' : ''}`}>
        {reels.map((emoji, i) => (
          <motion.div
            key={i}
            className="minislot-cell"
            animate={spinning ? { y: [0, -6, 6, 0] } : { y: 0 }}
            transition={{ repeat: spinning ? Infinity : 0, duration: 0.16 }}
          >
            {emoji}
          </motion.div>
        ))}
      </div>
      <div className="minislot-msg" aria-live="polite">
        {jackpot ? <span className="jackpot">JACKPOT! ×3</span> : <span>Попробуй удачу</span>}
      </div>
      <button className="btn btn-gold btn-block" onClick={spin} disabled={spinning}>
        <Dices size={18} />
        {spinning ? 'Крутится…' : 'SPIN'}
      </button>
      <div className="minislot-credits">DEMO · без реальных ставок</div>
    </div>
  )
}
