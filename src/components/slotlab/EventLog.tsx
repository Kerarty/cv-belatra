import { AnimatePresence, motion } from 'framer-motion'
import type { GameEvent } from '../../game/types'

const KIND_CLASS: Record<GameEvent['kind'], string> = {
  info: 'ev-info',
  win: 'ev-win',
  bonus: 'ev-bonus',
  lose: 'ev-lose',
}

/** История игровых событий */
export function EventLog({ events }: { events: GameEvent[] }) {
  return (
    <div className="event-log" aria-label="История событий">
      <div className="event-log-head">
        <span>Event Log</span>
        <span className="event-log-hint">последние события</span>
      </div>
      <ul className="event-list">
        <AnimatePresence initial={false}>
          {events.map((e) => (
            <motion.li
              key={e.id}
              className={`event-item ${KIND_CLASS[e.kind]}`}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {e.text}
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </div>
  )
}
