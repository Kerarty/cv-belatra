import { useState } from 'react'
import { ArrowUpRight, ExternalLink } from 'lucide-react'
import { Section, Reveal, Modal } from '../ui/ui'
import { PROJECTS, type Project, type UnitRow } from '../../data/projects'

function UnitsTable({ units }: { units: UnitRow[] }) {
  return (
    <div className="gdd-table-wrap">
      <table className="gdd-table">
        <thead>
          <tr>
            <th>Юнит</th>
            <th>Фракция</th>
            <th>HP</th>
            <th>ATK</th>
            <th>DEF</th>
            <th>Цена</th>
            <th>Способность</th>
          </tr>
        </thead>
        <tbody>
          {units.map((u) => (
            <tr key={u.unit}>
              <td>{u.unit}</td>
              <td>{u.faction}</td>
              <td>{u.hp}</td>
              <td>{u.atk}</td>
              <td>{u.def}</td>
              <td className="text-gold">{u.cost}</td>
              <td>{u.note ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function ProjectExtra({ project }: { project: Project }) {
  const extra = project.extra
  switch (extra.kind) {
    case 'units-table':
      return (
        <>
          <p className="project-extra-intro">{extra.intro}</p>
          <UnitsTable units={extra.units} />
        </>
      )
    case 'cycle':
      return (
        <>
          <p className="project-extra-intro">{extra.intro}</p>
          <div className="cycle-scheme">
            {extra.steps.map((step, i) => (
              <div key={step} className="cycle-node">
                <span className="cycle-num">{i + 1}</span>
                <span>{step}</span>
                {i < extra.steps.length - 1 && <span className="cycle-arrow">→</span>}
              </div>
            ))}
            <div className="cycle-loop">↺ цикл замыкается: выручка → новые заказы</div>
          </div>
        </>
      )
    case 'playable':
      return <p className="project-extra-intro">{extra.intro}</p>
    case 'docs':
      return (
        <>
          <p className="project-extra-intro">{extra.intro}</p>
          <ul className="gdd-list">
            {extra.samples.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </>
      )
    case 'facts':
      return (
        <>
          <p className="project-extra-intro">{extra.intro}</p>
          <ul className="gdd-list">
            {extra.facts.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </>
      )
  }
}

function ProjectCard({ project, onOpen, delay }: { project: Project; onOpen: () => void; delay: number }) {
  const Icon = project.icon
  return (
    <Reveal delay={delay} className="h-full">
      <article className="project-card">
        <div className="project-head">
          <span className="project-icon" style={{ color: project.accent, borderColor: project.accent }}>
            <Icon size={22} />
          </span>
          <div>
            <h3>{project.title}</h3>
            <p className="project-year">
              {project.year} · {project.role}
            </p>
          </div>
        </div>
        <p className="project-summary">{project.summary}</p>
        <div className="project-tags">
          {project.tags.map((t) => (
            <span key={t} className="chip">
              {t}
            </span>
          ))}
        </div>
        <div className="project-metrics">
          {project.metrics.map((m) => (
            <div key={m.label} className="stat">
              <b>{m.value}</b>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
        <div className="project-actions">
          <button className="btn btn-outline" onClick={onOpen}>
            Разбор проекта
            <ArrowUpRight size={15} />
          </button>
          {project.links
            .filter((l) => l.external)
            .slice(0, 1)
            .map((l) => (
              <a key={l.label} className="btn btn-ghost" href={l.href} target="_blank" rel="noreferrer">
                {l.label}
                <ExternalLink size={15} />
              </a>
            ))}
        </div>
      </article>
    </Reveal>
  )
}

export function Portfolio() {
  const [openId, setOpenId] = useState<string | null>(null)
  const open = PROJECTS.find((p) => p.id === openId) ?? null

  return (
    <Section
      id="portfolio"
      kicker="Portfolio"
      title="Мои проекты"
      sub="Шесть работ: от настольной тактики и дипломного Unity-симулятора до HTML5-игр. У каждой — разбор решений и материалы."
    >
      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.id} project={p} delay={(i % 3) * 0.08} onOpen={() => setOpenId(p.id)} />
        ))}
      </div>

      <Modal open={open !== null} onClose={() => setOpenId(null)} title={open?.title ?? ''}>
        {open && (
          <div className="project-details">
            <p className="project-sub">{open.subtitle}</p>
            <div className="project-tags">
              {open.tags.map((t) => (
                <span key={t} className="chip">
                  {t}
                </span>
              ))}
            </div>
            <h4 className="project-h4">Ключевые решения и результат</h4>
            <ul className="gdd-list">
              {open.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <h4 className="project-h4">Материалы</h4>
            <ProjectExtra project={open} />
            {open.links.length > 0 && (
              <div className="project-actions">
                {open.links.map((l) =>
                  l.external ? (
                    <a key={l.label} className="btn btn-outline" href={l.href} target="_blank" rel="noreferrer">
                      {l.label}
                      <ExternalLink size={15} />
                    </a>
                  ) : null,
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Section>
  )
}
