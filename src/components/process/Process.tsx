import { Section, Reveal } from '../ui/ui'
import { PROJECTS } from '../../data/projects'

const STAGES = [
  {
    num: '01',
    title: 'Research & Analysis',
    desc: 'Изучение жанра, механик конкурентов и поведения игроков до первого решения.',
    example: 'Разбор слотов Belatra: как подаются бонусы и сколько решений игрок делает за спин.',
  },
  {
    num: '02',
    title: 'Concept & Design',
    desc: 'Формулировка ядра: что игрок делает каждую минуту и почему это интересно.',
    example: 'Neon Carnival: «читаемый карнавал» — каждый символ понятен за один взгляд.',
  },
  {
    num: '03',
    title: 'Documentation',
    desc: 'GDD как передаточный документ: правила, параметры, состояния, edge cases.',
    example: '12 разделов документации Neon Carnival — см. раздел GDD выше.',
  },
  {
    num: '04',
    title: 'Prototyping',
    desc: 'Играбельный билд как можно раньше: механика проверяется руками, не в голове.',
    example: 'Runner — прототип за неделю; Prize Parade собран сразу на этом сайте.',
  },
  {
    num: '05',
    title: 'Testing & Iteration',
    desc: 'Плейтесты → замер → правка → повторный замер. Баланс — процесс, а не документ.',
    example: '15+ плейтест-сессий по «Королевствам Эридора» с правками характеристик.',
  },
]

const BONUS_PIPELINE = [
  'Idea',
  'Trigger',
  'Feature Flow',
  'Rules',
  'Parameters',
  'Prototype',
  'Testing',
]

export function Process() {
  const gddProject = PROJECTS.find((p) => p.id === 'gdd')
  const tactics = PROJECTS.find((p) => p.id === 'tactics')

  return (
    <Section
      id="process"
      kicker="Design Process"
      title="Как я проектирую"
      sub="Системный подход: каждый этап заканчивается артефактом, который можно проверить."
    >
      <div className="process-steps">
        {STAGES.map((stage, i) => (
          <Reveal key={stage.num} delay={i * 0.07} className="process-step">
            <span className="process-num">{stage.num}</span>
            <h3>{stage.title}</h3>
            <p>{stage.desc}</p>
            <div className="process-example">
              <span>Из практики</span>
              {stage.example}
            </div>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1}>
        <div className="pipeline">
          <div className="pipeline-head">
            <h3>Проектирование бонусной механики — на примере Prize Parade</h3>
            <p>
              Тот же процесс в миниатюре: от идеи до плейтеста. Все шаги видны в этом сайте —
              триггер в Slot Lab, правила и параметры в GDD, живой тюнинг в Feature Tuning.
            </p>
          </div>
          <div className="gdd-flow pipeline-flow">
            {BONUS_PIPELINE.map((step, i) => (
              <span key={step} className="flow-fragment">
                <span className="flow-step">{step}</span>
                {i < BONUS_PIPELINE.length - 1 && <span className="flow-arrow">→</span>}
              </span>
            ))}
          </div>
          <div className="pipeline-links">
            {tactics && gddProject && (
              <span>
                Документация приёмов: <a href="#gdd">GDD Neon Carnival</a> · плейтесты:{' '}
                <a href="#portfolio">{tactics.title}</a>
              </span>
            )}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
