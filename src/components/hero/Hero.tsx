import { motion } from 'framer-motion'
import { Briefcase, ChevronDown, Download, Play } from 'lucide-react'
import { profile } from '../../data/profile'
import { MiniSlot } from './MiniSlot'

const fadeUp = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
}

export function Hero() {
  return (
    <section id="start" className="hero">
      <div className="glow-orb" style={{ width: 420, height: 420, top: -80, right: '8%', background: 'rgba(160,107,255,0.25)' }} />
      <div className="glow-orb" style={{ width: 360, height: 360, bottom: -60, left: '4%', background: 'rgba(240,195,78,0.16)' }} />

      <div className="container hero-grid">
        <div className="hero-copy">
          <motion.span
            className="section-kicker"
            {...fadeUp}
            transition={{ duration: 0.5 }}
          >
            Interactive Game Designer Portfolio
          </motion.span>

          <motion.h1
            className="hero-title"
            {...fadeUp}
            transition={{ duration: 0.6, delay: 0.08 }}
          >
            GAME DESIGN
            <br />
            <span className="hero-title-gold">STUDIO</span>
          </motion.h1>

          <motion.p className="hero-name" {...fadeUp} transition={{ duration: 0.6, delay: 0.16 }}>
            {profile.name} · <span className="text-gold">{profile.role}</span>
          </motion.p>

          <motion.p className="hero-tagline" {...fadeUp} transition={{ duration: 0.6, delay: 0.22 }}>
            {profile.tagline}
          </motion.p>

          <motion.div className="hero-actions" {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }}>
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
          </motion.div>

          <motion.div className="hero-meta" {...fadeUp} transition={{ duration: 0.6, delay: 0.38 }}>
            <span>{profile.location}</span>
            <span className="dot">·</span>
            <span>БГУИР 2023—2027</span>
            <span className="dot">·</span>
            <span>Слоты · Механики · Баланс</span>
          </motion.div>
        </div>

        <motion.div
          className="hero-slot"
          initial={{ opacity: 0, scale: 0.92, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <MiniSlot />
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
