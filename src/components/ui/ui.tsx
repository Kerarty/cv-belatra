import { useEffect, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'

/* ---------- Появление при скролле ---------- */

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}

/* ---------- Секция ---------- */

export function Section({
  id,
  kicker,
  title,
  sub,
  children,
  className,
}: {
  id: string
  kicker: string
  title: string
  sub?: string
  children: ReactNode
  className?: string
}) {
  return (
    <section id={id} className={`section ${className ?? ''}`}>
      <div className="container">
        <Reveal className="section-head">
          <span className="section-kicker">{kicker}</span>
          <h2 className="section-title">{title}</h2>
          {sub && <p className="section-sub">{sub}</p>}
        </Reveal>
        {children}
      </div>
    </section>
  )
}

/* ---------- Модальное окно ---------- */

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}) {
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
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <motion.div
            className="modal-window"
            initial={{ opacity: 0, y: 32, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-head">
              <h3>{title}</h3>
              <button className="icon-btn" onClick={onClose} aria-label="Закрыть">
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ---------- Вкладки ---------- */

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: Array<{ id: string; label: string }>
  active: string
  onChange: (id: string) => void
}) {
  return (
    <div className="tabs" role="tablist">
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={active === t.id}
          className={`tab ${active === t.id ? 'active' : ''}`}
          onClick={() => onChange(t.id)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- Бейдж / чип ---------- */

export function Chip({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <span className="chip" style={color ? { color, borderColor: color } : undefined}>
      {children}
    </span>
  )
}
