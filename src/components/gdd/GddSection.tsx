import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Lightbulb } from 'lucide-react'
import { Section, Reveal, Tabs } from '../ui/ui'
import { GDD_SECTIONS, type GddBlock } from '../../data/gdd'
import { ROLE_LABELS, SYMBOL_ORDER, SYMBOLS } from '../../data/symbols'
import { SymbolArt } from '../slotlab/SymbolArt'

function SymbolsTable() {
  return (
    <div className="gdd-table-wrap">
      <table className="gdd-table gdd-table-symbols">
        <thead>
          <tr>
            <th>Символ</th>
            <th>Роль</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>Функция</th>
          </tr>
        </thead>
        <tbody>
          {SYMBOL_ORDER.map((id) => {
            const s = SYMBOLS[id]
            return (
              <tr key={id}>
                <td>
                  <span className="symbols-cell-name">
                    <SymbolArt id={id} size={26} />
                    <b>{s.name}</b>
                  </span>
                </td>
                <td>{ROLE_LABELS[s.role]}</td>
                <td>{s.pays[0]}</td>
                <td>{s.pays[1]}</td>
                <td>{s.pays[2]}</td>
                <td>{s.fn}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

function Block({ block }: { block: GddBlock }) {
  switch (block.kind) {
    case 'text':
      return <p className="gdd-text">{block.body}</p>
    case 'list':
      return (
        <ul className="gdd-list">
          {block.items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )
    case 'table':
      return (
        <div className="gdd-table-wrap">
          <table className="gdd-table">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, i) => (
                <tr key={i}>
                  {row.map((cell, j) => (
                    <td key={j}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    case 'flow':
      return (
        <div className="gdd-flow">
          {block.steps.map((step, i) => (
            <span key={step} className="flow-fragment">
              <span className="flow-step">{step}</span>
              {i < block.steps.length - 1 && <ArrowRight size={14} className="flow-arrow" />}
            </span>
          ))}
        </div>
      )
    case 'note':
      return (
        <div className="gdd-note">
          <Lightbulb size={16} />
          <p>{block.body}</p>
        </div>
      )
    case 'symbols-table':
      return <SymbolsTable />
  }
}

export function GddSection() {
  const [active, setActive] = useState(GDD_SECTIONS[0].id)
  const current = GDD_SECTIONS.find((s) => s.id === active) ?? GDD_SECTIONS[0]

  const plateNum = GDD_SECTIONS.findIndex((s) => s.id === current.id) + 1

  return (
    <Section
      id="gdd"
      kicker="Game Design Documentation"
      title="Документация Neon Carnival"
      sub="Не просто готовая игра, а процесс проектирования: концепция, правила, параметры, крайние случаи и обоснование решений."
    >
      <Reveal>
        <div className="gdd-plate" aria-label={`Лист документации ${plateNum} из ${GDD_SECTIONS.length}`}>
          <span>Лист {plateNum} / {GDD_SECTIONS.length}</span>
          <b>{current.label}</b>
          <span>утв. Я. Кукар</span>
        </div>
        <Tabs
          tabs={GDD_SECTIONS.map((s) => ({ id: s.id, label: s.label }))}
          active={active}
          onChange={setActive}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={current.id}
            className="gdd-panel"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {current.blocks.map((block, i) => (
              <Block key={i} block={block} />
            ))}
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </Section>
  )
}
