import { motion } from 'framer-motion'
import { Icon, type IconName } from './Icon'

export type TabId = 'tonight' | 'sky' | 'missions' | 'station'

const TABS: { id: TabId; label: string; icon: IconName }[] = [
  { id: 'tonight', label: '今夜', icon: 'sparkle' },
  { id: 'sky', label: '星图', icon: 'orbit' },
  { id: 'missions', label: '任务', icon: 'trophy' },
  { id: 'station', label: '地面站', icon: 'signal' },
]

export const TabBar = ({ tab, onTab }: { tab: TabId; onTab: (t: TabId) => void }) => (
  <nav className="tabbar" aria-label="主导航">
    {TABS.map((t) => (
      <motion.button
        key={t.id}
        type="button"
        className={`tab${tab === t.id ? ' on' : ''}`}
        whileTap={{ scale: 0.88 }}
        transition={{ type: 'spring', stiffness: 500, damping: 22 }}
        aria-current={tab === t.id ? 'page' : undefined}
        onClick={() => onTab(t.id)}
      >
        <Icon name={t.icon} size={20} />
        {t.label}
      </motion.button>
    ))}
  </nav>
)
