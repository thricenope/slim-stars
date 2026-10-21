import { useState } from 'react'
import { AnimatePresence, MotionConfig, motion } from 'framer-motion'
import { TopBar } from './components/TopBar'
import { TabBar, type TabId } from './components/TabBar'
import { TonightView } from './components/TonightView'
import { SkyView } from './components/SkyView'
import { MissionView } from './components/MissionView'
import { StationView } from './components/StationView'
import { CelebrationLayer } from './components/CelebrationLayer'

export default function App() {
  const [tab, setTab] = useState<TabId>('tonight')

  return (
    <MotionConfig reducedMotion="user">
      <div className="app">
        <TopBar />
        <main aria-live="polite">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {tab === 'tonight' && <TonightView onGoSky={() => setTab('sky')} />}
              {tab === 'sky' && <SkyView />}
              {tab === 'missions' && <MissionView />}
              {tab === 'station' && <StationView />}
            </motion.div>
          </AnimatePresence>
        </main>
        <TabBar tab={tab} onTab={setTab} />
        <CelebrationLayer />
      </div>
    </MotionConfig>
  )
}
