import { Dices, TrendingUp, Wrench } from 'lucide-react'
import { Section, Reveal } from '../ui/ui'

const CARDS = [
  {
    icon: Dices,
    title: 'Game Creation',
    text: 'Belatra делает игры с 1993 года — за этим стоит проверенная фабрика слотов. Мне интересно входить в неё на этапе «механика рождается»: концепт, математика, подача — и видеть, как идея доезжает до живого барабана.',
  },
  {
    icon: Wrench,
    title: 'Mechanics',
    text: 'Слоты — чистый геймдизайн без сюжетных костылей: Wild, Scatter, множители и бонусные сцены, где каждое решение видно за один спин. Prize Parade на этом сайте — мой ответ на вопрос «как я проектирую бонусные функции».',
  },
  {
    icon: TrendingUp,
    title: 'Growth',
    text: 'Я junior и не притворяюсь мидлом: хочу учиться у команды, которая выпустила 150+ игр, вырасти от простых механик к полноценной математической модели слота и понять продакшн-уровень RTP и волатильности.',
  },
]

export function WhyBelatra() {
  return (
    <Section
      id="why-belatra"
      kicker="Why Belatra"
      title="Почему именно Belatra Games"
      sub="Не стандартное сопроводительное письмо — три конкретных причины."
    >
      <Reveal>
        <div className="why-intro">
          <p>
            Belatra для меня — не случайная строка в списке вакансий. Это компания, которая больше
            тридцати лет делает именно то, что мне интереснее всего проектировать: слоты, где
            механика, математика и подача работают вместе. Я собираю слот-игру сам — этот сайт и
            есть Neon Carnival с бонусом Prize Parade, — и хочу делать это в команде, для которой
            слоты не «ещё один жанр», а ремесло.
          </p>
        </div>
      </Reveal>

      <div className="why-grid">
        {CARDS.map((card, i) => {
          const Icon = card.icon
          return (
            <Reveal key={card.title} delay={i * 0.08} className="h-full">
              <article className="why-card">
                <span className="why-icon">
                  <Icon size={22} />
                </span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            </Reveal>
          )
        })}
      </div>
    </Section>
  )
}
