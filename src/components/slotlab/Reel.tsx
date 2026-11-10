import { useEffect, useRef, useState } from 'react'
import { SYMBOLS, SYMBOL_ORDER } from '../../data/symbols'
import type { SymbolId } from '../../game/types'
import { SymbolArt } from './SymbolArt'

function randomSymbolId(): SymbolId {
  return SYMBOL_ORDER[Math.floor(Math.random() * SYMBOL_ORDER.length)]
}

interface ReelProps {
  index: number
  /** Финальные символы 3 рядов (обновляются родителем на SPIN_START) */
  symbols: SymbolId[]
  spinning: boolean
  /** Задержка остановки этого барабана, мс */
  stopDelay: number
  onStopped: () => void
  highlight: Set<string>
  dim: boolean
}

/**
 * Один барабан: во время спина быстро перебирает случайные символы,
 * в свой stopDelay останавливается и показывает финальные символы.
 */
export function Reel({ index, symbols, spinning, stopDelay, onStopped, highlight, dim }: ReelProps) {
  const [display, setDisplay] = useState<SymbolId[]>(symbols)
  const [selfSpinning, setSelfSpinning] = useState(false)
  const wasSpinning = useRef(false)

  // Запуск/остановка по расписанию
  useEffect(() => {
    if (!spinning) return
    setSelfSpinning(true)
    const t = window.setTimeout(() => setSelfSpinning(false), stopDelay)
    return () => window.clearTimeout(t)
  }, [spinning, stopDelay])

  // Перебор символов во время вращения
  useEffect(() => {
    if (!selfSpinning) return
    const tick = window.setInterval(() => {
      setDisplay([randomSymbolId(), randomSymbolId(), randomSymbolId()])
    }, 75)
    return () => window.clearInterval(tick)
  }, [selfSpinning])

  // Остановка: показать финальные символы и сообщить родителю
  useEffect(() => {
    if (selfSpinning) {
      wasSpinning.current = true
      return
    }
    if (wasSpinning.current) {
      wasSpinning.current = false
      setDisplay(symbols)
      onStopped()
    } else {
      setDisplay(symbols)
    }
    // symbols и onStopped читаются только в момент остановки
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selfSpinning])

  const spinningClass = selfSpinning ? 'reel-spinning' : ''

  return (
    <div className={`reel ${spinningClass}`} data-reel={index}>
      {[0, 1, 2].map((row) => {
        const id = display[row]
        const sym = SYMBOLS[id]
        const isWin = highlight.has(`${index}-${row}`)
        return (
          <div
            key={row}
            className={[
              'reel-cell',
              isWin ? 'cell-win' : '',
              dim && !isWin ? 'cell-dim' : '',
              selfSpinning ? 'cell-blur' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            aria-label={sym.name}
          >
            <SymbolArt id={id} className={selfSpinning ? 'cell-blur' : ''} />
          </div>
        )
      })}
    </div>
  )
}
