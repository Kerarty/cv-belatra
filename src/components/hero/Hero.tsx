import { motion } from 'framer-motion'
import { Briefcase, ChevronDown, Download, Play } from 'lucide-react'
import { profile } from '../../data/profile'
import { MiniSlot } from './MiniSlot'

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section id="start" className="hero">
      <div className="glow-orb" style={{ width: 480, height: 480, top: -120, left: '50%', transform: 'translateX(-50%)', background: 'rgba(212,175,55,0.14)' }} />
      <div className="glow-orb" style={{ width: 340, height: 340, bottom: -40, right: '4%', background: 'rgba(143,107,29,0.12)' }} />

      {/* Угловые орнаменты ар-деко */}
      <span className="hero-corner tl" aria-hidden="true" />
      <span className="hero-corner tr" aria-hidden="true" />
      <span className="hero-corner bl" aria-hidden="true" />
      <span className="hero-corner br" aria-hidden="true" />

      <div className="container hero-inner">
        <motion.span className="section-kicker hero-kicker" {...fadeUp} transition={{ duration: 0.5 }}>
          Interactive Game Designer Portfolio
        </motion.span>

        <motion.h1 className="hero-title" {...fadeUp} transition={{ duration: 0.6, delay: 0.08 }}>
          GAME DESIGN <span className="hero-title-gold">STUDIO</span>
        </motion.h1>

        <motion.p className="hero-name" {...fadeUp} transition={{ duration: 0.6, delay: 0.16 }}>
          {profile.name} · <span className="text-gold">{profile.role}</span>
        </motion.p>

        <motion.div className="hero-row" {...fadeUp} transition={{ duration: 0.65, delay: 0.24 }}>
          <div className="hero-slot">
            <MiniSlot />
          </div>

          <div className="hero-copy">
            <p className="hero-tagline">{profile.tagline}</p>

            <div className="hero-actions">
              <a href="#slot-lab" className="btn btn-gold btn-lg">
                <Play size={18} />
                Slot Lab — играть
              </a>
              <a href="#portfolio" className="btn btn-outline btn-lg">
                <Briefcase size={18} />
                Портфолио
              </a>
              <a href={profile.pdf} className="btn btn-ghost btn-lg" download>
                <Download size={18} />
                PDF-резюме
              </a>
            </div>

            <div className="hero-stats">
              {profile.stats.map((s) => (
                <div key={s.label} className="stat">
                  <b>{s.value}</b>
                  <span>{s.label}</span>
                </div>
              ))}
            </div>

            <div className="hero-meta">
              <span>{profile.location}</span>
              <span className="dot">◆</span>
              <span>БГУИР 2023—2027</span>
              <span className="dot">◆</span>
              <span>Слоты · Механики · Баланс</span>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.a
        href="#profile"
        className="hero-scroll"
        aria-label="К профилю"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown size={22} />
      </motion.a>
    </section>
  )
}
