import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../store'
import { missionById } from '../logic/missions'
import { burst } from '../celebrate'
import { Icon, type IconName } from './Icon'

const MISSION_ICON: Record<string, IconName> = {
  wk1: 'calendar', t10: 'star', t30: 'star', t100: 'star', t365: 'star',
  p3: 'trophy', p10: 'trophy', e10: 'hiit', e50: 'hiit', early20: 'sunset',
}
const iconOf = (id: string): IconName => MISSION_ICON[id] ?? 'rocket'

/** 任务解锁弹窗队列（全应用唯一挂载） */
export const CelebrationLayer = () => {
  const queue = useGame((s) => s.pendingCelebrate)
  const dismiss = useGame((s) => s.dismissOneCelebrate)
  const mission = queue.length > 0 ? missionById(queue[0]) : undefined

  return (
    <AnimatePresence>
      {mission && (
        <motion.div
          className="cele-mask"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          key={mission.id}
        >
          <motion.div
            className="cele-card"
            initial={{ scale: 0.4, y: 80, rotate: -2 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.7, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            role="dialog"
            aria-modal="true"
            aria-label={`解锁任务 ${mission.name}`}
          >
            <div className="rays" />
            <div className="cele-kind">任 务 达 成</div>
            <motion.div
              className="cele-emoji"
              initial={{ scale: 0.2, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 11, delay: 0.12 }}
            >
              <Icon name={iconOf(mission.id)} size={72} style={{ color: 'var(--amber)' }} />
            </motion.div>
            <div className="cele-title">{mission.name}</div>
            <div className="cele-desc">{mission.desc}</div>
            <div className="cele-xp">
              <Icon name="sparkle" size={16} /> +{mission.tier * 25} XP
            </div>
            <div>
              <motion.button
                type="button"
                className="cta mint"
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  burst({ x: 0.5, y: 0.6 })
                  dismiss()
                }}
              >
                收下！
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
