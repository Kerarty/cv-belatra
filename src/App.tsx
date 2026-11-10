import { useState } from 'react'
import { Navbar } from './components/layout/Navbar'
import { Hero } from './components/hero/Hero'
import { Profile } from './components/profile/Profile'
import { SlotLab } from './components/slotlab/SlotLab'
import { GddSection } from './components/gdd/GddSection'
import { TuningPanel } from './components/tuning/TuningPanel'
import { Portfolio } from './components/portfolio/Portfolio'
import { Process } from './components/process/Process'
import { WhyBelatra } from './components/why/WhyBelatra'
import { Contact } from './components/contact/Contact'
import { DEFAULT_BONUS_CONFIG } from './data/tuning'
import type { BonusConfig } from './game/types'

export default function App() {
  // Конфиг бонусной функции — общий для Slot Lab и Feature Tuning
  const [bonusConfig, setBonusConfig] = useState<BonusConfig>(DEFAULT_BONUS_CONFIG)

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Profile />
        <SlotLab config={bonusConfig} />
        <GddSection />
        <TuningPanel config={bonusConfig} onChange={setBonusConfig} />
        <Portfolio />
        <Process />
        <WhyBelatra />
        <Contact />
      </main>
    </>
  )
}
