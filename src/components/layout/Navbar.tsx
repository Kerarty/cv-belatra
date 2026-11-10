import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { id: 'start', label: 'Старт' },
  { id: 'profile', label: 'Профиль' },
  { id: 'slot-lab', label: 'Slot Lab' },
  { id: 'gdd', label: 'GDD', optional: true },
  { id: 'tuning', label: 'Тюнинг', optional: true },
  { id: 'portfolio', label: 'Портфолио' },
  { id: 'process', label: 'Процесс', optional: true },
  { id: 'why-belatra', label: 'Belatra', optional: true },
  { id: 'contact', label: 'Контакты' },
]

export function Navbar() {
  const [active, setActive] = useState('start')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id)
        }
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )
    LINKS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <header className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="container nav-inner">
        <a href="#start" className="nav-logo" aria-label="Наверх">
          <span className="nav-logo-mark">◆</span>
          <span>
            G<em>·</em>D<em>·</em>S
          </span>
          <span className="nav-logo-sub">Belatra</span>
        </a>

        <nav className="nav-links" aria-label="Разделы">
          {LINKS.map(({ id, label, optional }) => (
            <a
              key={id}
              href={`#${id}`}
              className={`nav-link ${active === id ? 'active' : ''} ${optional ? 'nav-optional' : ''}`}
            >
              {label}
            </a>
          ))}
        </nav>

        <button
          className="icon-btn nav-burger"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            className="nav-mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            aria-label="Мобильное меню"
          >
            {LINKS.map(({ id, label }) => (
              <a
                key={id}
                href={`#${id}`}
                className={`nav-mobile-link ${active === id ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                {label}
              </a>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  )
}
