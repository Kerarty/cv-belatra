import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { cellCenter, PAYLINES } from '../../game/paylines'

/**
 * Схема всех 9 линий выплат: мини-поля 5×3 с выделенным маршрутом.
 * Открывается кнопкой «Линии» в HUD слот-машины.
 */
export function PaylineMap({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="lines-map"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label="Схема всех линий выплат"
        >
          <div className="lines-map-head">
            <b>Фиг. 2 — линии выплат (9)</b>
            <button className="icon-btn" onClick={onClose} aria-label="Закрыть схему линий">
              <X size={16} />
            </button>
          </div>

          <div className="lines-map-grid">
            {PAYLINES.map((line, i) => {
              const onLine = new Set(line.map((row, reel) => `${reel}-${row}`))
              return (
                <div key={i} className="lines-tile">
                  <svg viewBox="0 0 100 60" role="img" aria-label={`Линия ${i + 1}`}>
                    {Array.from({ length: 5 }, (_, reel) =>
                      Array.from({ length: 3 }, (_, row) => {
                        const [cx, cy] = cellCenter(reel, row)
                        const active = onLine.has(`${reel}-${row}`)
                        return (
                          <circle
                            key={`${reel}-${row}`}
                            cx={cx}
                            cy={cy}
                            r={active ? 4.6 : 3.4}
                            fill={active ? 'var(--gold)' : 'rgba(212, 175, 55, 0.22)'}
                          />
                        )
                      }),
                    )}
                    <polyline
                      className="lines-tile-path"
                      points={line
                        .map((row, reel) => {
                          const [x, y] = cellCenter(reel, row)
                          return `${x},${y}`
                        })
                        .join(' ')}
                      fill="none"
                      stroke="var(--gold-bright)"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span>Линия {i + 1}</span>
                </div>
              )
            })}
          </div>

          <p className="lines-map-note">
            Комбинация — 3+ одинаковых символов слева направо от первого барабана. Wild заменяет
            любой символ, кроме Ticket.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
