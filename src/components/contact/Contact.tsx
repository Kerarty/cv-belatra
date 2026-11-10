import { Download, Github, Mail, Phone, Send } from 'lucide-react'
import { Section, Reveal } from '../ui/ui'
import { profile } from '../../data/profile'

const MAILTO = `mailto:${profile.belatraMail}?subject=${encodeURIComponent(
  'Отклик: Game Designer — Ярослав Кукар',
)}&body=${encodeURIComponent(
  `Здравствуйте!\n\nЯ — Ярослав Кукар, Junior Game Designer. Откликаюсь на вакансию Game Designer.\n\nИнтерактивное портфолио со слот-игрой Neon Carnival и бонусной механикой Prize Parade: https://kerarty.github.io/cv-belatra/\n\nPDF-резюме прикреплено.\n\nС уважением,\nЯрослав Кукар\n${profile.phone}\n${profile.email}`,
)}`

export function Contact() {
  return (
    <Section
      id="contact"
      kicker="Contact"
      title="Контакты"
      sub="Резюме, ссылки и быстрый способ написать мне — или сразу в Belatra."
    >
      <div className="contact-grid">
        <Reveal className="contact-cards">
          <a className="contact-card" href={`tel:${profile.phoneRaw}`}>
            <Phone size={20} />
            <div>
              <b>Телефон</b>
              <span>{profile.phone}</span>
            </div>
          </a>
          <a className="contact-card" href={`mailto:${profile.email}`}>
            <Mail size={20} />
            <div>
              <b>Email</b>
              <span>{profile.email}</span>
            </div>
          </a>
          <a className="contact-card" href={profile.telegram} target="_blank" rel="noreferrer">
            <Send size={20} />
            <div>
              <b>{profile.telegramLabel}</b>
              <span>Написать в Telegram</span>
            </div>
          </a>
          <a className="contact-card" href={profile.github} target="_blank" rel="noreferrer">
            <Github size={20} />
            <div>
              <b>GitHub</b>
              <span>{profile.githubLabel}</span>
            </div>
          </a>

          <div className="contact-actions">
            <a className="btn btn-gold btn-lg" href={profile.pdf} download>
              <Download size={18} />
              Скачать PDF-резюме
            </a>
            <a className="btn btn-outline btn-lg" href={MAILTO}>
              <Mail size={18} />
              Написать в Belatra
            </a>
          </div>
        </Reveal>

        {/* Финальный экран */}
        <Reveal delay={0.1} className="final-wrap">
          <div className="final-screen">
            <div className="divider-ornament">
              <span className="final-spark">◆</span>
            </div>
            <h3 className="final-title">
              LET&rsquo;S CREATE
              <br />
              SOMETHING <span className="final-gold">GREAT!</span>
            </h3>
            <p className="final-sub">
              {profile.name} · {profile.role}
            </p>
            <div className="divider-ornament">
              <span className="final-spark">◆</span>
            </div>
          </div>
        </Reveal>
      </div>

      <footer className="footer">
        <span>
          © 2026 {profile.name} · Game Design Studio
        </span>
        <span>
          React + TypeScript + Framer Motion ·{' '}
          <a href="https://github.com/Kerarty/cv-belatra" target="_blank" rel="noreferrer">
            исходники
          </a>
        </span>
      </footer>
    </Section>
  )
}
