import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bot, Code2, Gamepad2, GraduationCap, Languages, Palette, Terminal, Globe } from 'lucide-react'
import { Section, Reveal, Chip } from '../ui/ui'
import { profile } from '../../data/profile'
import { GAME_DESIGN_SKILLS, TECH_SKILLS, type TechSkill } from '../../data/skills'

const TECH_ICONS: Record<TechSkill['icon'], typeof Code2> = {
  unity: Gamepad2,
  csharp: Code2,
  python: Terminal,
  ai: Bot,
  web: Globe,
  design: Palette,
}

const CHIP_EDGE_DASH = '15 6.72' // 12 сегментов по окружности r=41.5

/** Жетон игрока: лицевая сторона — инициалы, обратная — демо-ставка из Slot Lab */
function PlayerChip() {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      type="button"
      className="player-chip"
      onClick={() => setFlipped((v) => !v)}
      aria-label={
        flipped ? 'Жетон игрока. Показать инициалы' : 'Жетон игрока. Показать ставку'
      }
      title="Жетон игрока — нажми, чтобы перевернуть"
    >
      <motion.div
        className="chip-flip"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="chip-face">
          <svg viewBox="0 0 96 96" aria-hidden="true">
            <circle cx="48" cy="48" r="47" fill="var(--gold-deep)" />
            <circle cx="48" cy="48" r="41.5" fill="none" stroke="var(--ivory)" strokeWidth="7" strokeDasharray={CHIP_EDGE_DASH} />
            <circle cx="48" cy="48" r="33" fill="var(--ivory)" />
            <circle cx="48" cy="48" r="33" fill="none" stroke="var(--gold-deep)" strokeWidth="1.2" opacity="0.55" />
            <text x="48" y="57" textAnchor="middle" fontFamily="var(--font-display-ru)" fontSize="25" letterSpacing="1" fill="var(--gold-ink)">
              ЯК
            </text>
          </svg>
        </span>
        <span className="chip-face chip-back">
          <svg viewBox="0 0 96 96" aria-hidden="true">
            <circle cx="48" cy="48" r="47" fill="var(--gold-deep)" />
            <circle cx="48" cy="48" r="41.5" fill="none" stroke="var(--ivory)" strokeWidth="7" strokeDasharray={CHIP_EDGE_DASH} />
            <circle cx="48" cy="48" r="33" fill="var(--ivory)" />
            <circle cx="48" cy="48" r="33" fill="none" stroke="var(--gold-deep)" strokeWidth="1.2" opacity="0.55" />
            <path d="M48 27.5 L50 31.5 L54 32 L51 34.8 L51.8 38.8 L48 36.8 L44.2 38.8 L45 34.8 L42 32 L46 31.5 Z" fill="var(--gold)" opacity="0.9" />
            <text x="48" y="62" textAnchor="middle" fontFamily="var(--font-display)" fontSize="24" fontWeight="700" letterSpacing="1" fill="var(--gold-ink)">
              20
            </text>
            <text x="48" y="73" textAnchor="middle" fontFamily="var(--font-body)" fontSize="6.5" fontWeight="700" letterSpacing="2.4" fill="var(--gold-mid)">
              ДЕМО-СТАВКА
            </text>
          </svg>
        </span>
      </motion.div>
    </button>
  )
}

export function Profile() {
  return (
    <Section
      id="profile"
      kicker="Player Profile"
      title="Обо мне"
      sub="Профиль игрока: образование, компетенции и то, где они применены на этом сайте."
    >
      <div className="profile-grid">
        {/* ---- Левая колонка: карточка игрока ---- */}
        <Reveal className="player-card">
          <PlayerChip />
          <h3 className="player-name">{profile.name}</h3>
          <p className="player-role">{profile.role}</p>

          <div className="education">
            <div className="education-head">
              <GraduationCap size={18} className="text-gold" />
              <span>Образование</span>
            </div>
            <p className="education-years">{profile.education.years}</p>
            <p className="education-uni">{profile.education.uni}</p>
            <p className="education-full">{profile.education.uniFull}</p>
            <p className="education-program">{profile.education.program}</p>
            <p className="education-degree">{profile.education.degree}</p>
          </div>

          <div className="player-langs">
            <Languages size={16} className="text-gold" />
            {profile.languages.map((l) => (
              <span key={l.name}>
                {l.name} — {l.level}
              </span>
            ))}
          </div>

          <p className="player-note">
            6 проектов, 15+ плейтестов, 9 слот-механик в демо — статистика живая, всё можно
            проверить в разделах ниже.
          </p>
        </Reveal>

        {/* ---- Правая колонка ---- */}
        <div className="profile-main">
          <Reveal>
            <h3 className="profile-subtitle">About Me</h3>
            {profile.about.map((p, i) => (
              <p key={i} className="profile-para">
                {p}
              </p>
            ))}
          </Reveal>

          <Reveal delay={0.08}>
            <h3 className="profile-subtitle">Game Design Skills</h3>
            <div className="skills-grid">
              {GAME_DESIGN_SKILLS.map((skill) => (
                <div key={skill.name} className="skill-card">
                  <div className="skill-top">
                    <b>{skill.name}</b>
                    <span className="skill-level">{skill.level}%</span>
                  </div>
                  <div className="skill-bar" role="presentation">
                    <motion.div
                      className="skill-bar-fill"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <p className="skill-note">{skill.note}</p>
                  <div className="skill-applied">
                    {skill.applied.map((a) => (
                      <a key={a.label} href={a.href} className="chip chip-link">
                        {a.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.12}>
            <h3 className="profile-subtitle">Technical Skills</h3>
            <div className="tech-grid">
              {TECH_SKILLS.map((tech) => {
                const Icon = TECH_ICONS[tech.icon]
                return (
                  <div key={tech.name} className="tech-card">
                    <Icon size={20} className="tech-icon" />
                    <div>
                      <b>{tech.name}</b>
                      <p>{tech.note}</p>
                      {tech.applied && (
                        <div className="skill-applied">
                          {tech.applied.map((a) => (
                            <a key={a.label} href={a.href} className="chip chip-link">
                              {a.label}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="profile-footer-chips">
              <Chip color="var(--gold)">Баланс</Chip>
              <Chip color="var(--violet-soft)">Мат. статистика</Chip>
              <Chip color="var(--turquoise)">Теория вероятностей</Chip>
              <Chip color="var(--violet-soft)">Level Design</Chip>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  )
}
