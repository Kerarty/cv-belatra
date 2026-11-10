import { FlaskConical, Play, RotateCcw } from 'lucide-react'
import { Section, Reveal } from '../ui/ui'
import { DEFAULT_BONUS_CONFIG, TUNING_LIMITS, TUNING_PARAMS } from '../../data/tuning'
import type { BonusConfig } from '../../game/types'

interface TuningPanelProps {
  config: BonusConfig
  onChange: (config: BonusConfig) => void
}

/**
 * Feature Tuning — интерактивная лаборатория параметров бонусной функции.
 * Меняет реальную конфигурацию, которую использует Slot Lab.
 */
export function TuningPanel({ config, onChange }: TuningPanelProps) {
  const set = <K extends keyof BonusConfig>(key: K, value: BonusConfig[K]) =>
    onChange({ ...config, [key]: value })

  return (
    <Section
      id="tuning"
      kicker="Feature Tuning"
      title="Лаборатория параметров"
      sub="Панель настройки бонусной функции Prize Parade. Значения применяются к живой игре в Slot Lab — можно крутить барабаны и наблюдать эффект."
    >
      <div className="tuning-grid">
        <Reveal className="tuning-controls">
          {TUNING_PARAMS.map((param) => {
            if (param.type === 'bool') {
              const value = config[param.key] as boolean
              return (
                <div key={param.key} className="tune-row">
                  <div className="tune-info">
                    <b>{param.label}</b>
                    <p>{param.desc}</p>
                    <p className="tune-impact">{param.impact}</p>
                  </div>
                  <button
                    className={`switch ${value ? 'switch-on' : ''}`}
                    role="switch"
                    aria-checked={value}
                    aria-label={param.label}
                    onClick={() => set(param.key, !value as never)}
                  >
                    <span className="switch-knob" />
                  </button>
                </div>
              )
            }

            const limits = TUNING_LIMITS[param.key]
            const value = config[param.key] as number
            return (
              <div key={param.key} className="tune-row">
                <div className="tune-info">
                  <div className="tune-label">
                    <b>{param.label}</b>
                    <span className="tune-value">{value}</span>
                  </div>
                  <p>{param.desc}</p>
                  <p className="tune-impact">{param.impact}</p>
                </div>
                <input
                  type="range"
                  className="range"
                  min={limits.min}
                  max={limits.max}
                  step={param.step ?? 1}
                  value={value}
                  aria-label={param.label}
                  onChange={(e) => set(param.key, Number(e.target.value) as never)}
                />
                <div className="range-bounds">
                  <span>{limits.min}</span>
                  <span>{limits.max}</span>
                </div>
              </div>
            )
          })}

          <div className="tuning-actions">
            <button className="btn btn-ghost" onClick={() => onChange(DEFAULT_BONUS_CONFIG)}>
              <RotateCcw size={16} />
              Сбросить к исходным
            </button>
            <a href="#slot-lab" className="btn btn-gold">
              <Play size={16} />
              Проверить в Slot Lab
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="tuning-readout-wrap">
          <div className="tuning-readout">
            <div className="readout-head">
              <FlaskConical size={16} />
              Текущая конфигурация
            </div>
            <pre className="readout-code">
{`bonus: {
  freeSpins: ${config.freeSpins},
  multiplier: ×${config.multiplier},
  wildShow: ${config.wildShow ? 'true' : 'false'},
  extraWildWeight: ${config.extraWildWeight},
  scatterToTrigger: ${config.scatterToTrigger},
}`}
            </pre>
            <p className="readout-note">
              Конфигурация передаётся в стейт-машину слота и действует со следующей сессии
              Prize Parade. Текущая бонусная сессия не прерывается.
            </p>
            <div className="readout-disclaimer">
              Это демонстрация работы с параметрами, а не расчёт RTP: вероятности оценены
              приближённо, без симуляций на миллионы спинов.
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  )
}
