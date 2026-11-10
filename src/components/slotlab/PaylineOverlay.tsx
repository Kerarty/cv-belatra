import { cellCenter } from '../../game/paylines'
import type { WinLine } from '../../game/types'

/** SVG-оверлей с выигравшими линиями поверх поля 5×3 (viewBox 100×60) */
export function PaylineOverlay({ wins }: { wins: WinLine[] }) {
  if (wins.length === 0) return null
  const shown = wins.slice(0, 4)
  return (
    <svg className="paylines" viewBox="0 0 100 60" preserveAspectRatio="none" aria-hidden="true">
      {shown.map((w, i) => (
        <polyline
          key={`${w.lineIndex}-${i}`}
          className="payline-line"
          points={w.cells
            .map((c) => {
              const [x, y] = cellCenter(c.reel, c.row)
              return `${x},${y}`
            })
            .join(' ')}
          fill="none"
          stroke="var(--gold-bright)"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ animationDelay: `${i * 140}ms` }}
        />
      ))}
    </svg>
  )
}
