import { useRank, useStats } from '../store'
import { Icon } from './Icon'

/** 顶栏：任务铭牌 + 连飞计数 + 职级 + 经验轨 */
export const TopBar = () => {
  const streak = useStats().curStreak
  const rank = useRank()

  return (
    <div>
      <header className="topbar">
        <div className="logo">
          <Icon name="rocket" size={26} style={{ color: 'var(--amber)' }} />
          <span className="name">摘星计划</span>
        </div>
        <div className="spacer" />
        <span className="chip-stat flame" title="连续成功夜数">
          <Icon name="flame" size={16} />
          <span>{streak}</span>
        </span>
        <span className="chip-stat" title={`${rank.title} · 距下一级 ${rank.need - rank.into} 经验`}>
          <Icon name="crown" size={16} style={{ color: 'var(--amber)' }} />
          <span>LV{rank.level}</span>
        </span>
      </header>
      <div
        className="xp-line"
        role="progressbar"
        aria-label="职级经验"
        aria-valuemin={0}
        aria-valuemax={rank.need}
        aria-valuenow={rank.into}
      >
        <i style={{ width: `${rank.into > 0 ? Math.max(4, rank.progress * 100) : 0}%` }} />
      </div>
    </div>
  )
}
