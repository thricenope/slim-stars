import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useGame, useStats } from '../store'
import { MISSIONS, ROUTE, nextRoute } from '../logic/missions'
import { chainUpTo } from '../logic/stats'
import { addDays, today } from '../logic/dates'
import { isWin } from '../logic/scoring'
import { Icon, type IconName } from './Icon'

const MISSION_ICON: Record<string, IconName> = {
  wk1: 'calendar', t10: 'star', t30: 'star', t100: 'star', t365: 'star',
  p3: 'trophy', p10: 'trophy', e10: 'hiit', e50: 'hiit', early20: 'sunset',
}
const iconOf = (id: string): IconName => MISSION_ICON[id] ?? 'rocket'
const colorOf = (kind: string, tier: number) =>
  kind === 'special' || kind === 'total' ? 'green' : tier >= 4 ? '' : 'green'

export const MissionView = () => {
  const unlocked = useGame((s) => s.unlocked)
  const stats = useStats()

  const next = nextRoute(stats, unlocked)
  const remain = next ? Math.max(0, next.goal - stats.maxStreak) : 0

  const routeTail = useMemo(() => {
    const t = today()
    const records = useGame.getState().records
    const end = isWin(records[t]) ? t : addDays(t, -1)
    const chain = chainUpTo(end, records)
    return chain.slice(-7)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stats.curStreak])

  const fillPct = useMemo(() => {
    const goals = ROUTE.map((r) => r.goal)
    const N = goals.length
    let idx = 0
    for (let i = 0; i < N; i++) {
      if (goals[i] <= stats.maxStreak) idx = i
    }
    const nextGoal = goals[Math.min(idx + 1, N - 1)]
    const prevGoal = goals[idx]
    const f = nextGoal > prevGoal ? (stats.maxStreak - prevGoal) / (nextGoal - prevGoal) : 0
    return Math.min(100, ((idx + Math.max(0, Math.min(1, f))) / (N - 1)) * 100)
  }, [stats.maxStreak])

  const unlockedCount = Object.keys(unlocked).length

  return (
    <div>
      <div className="card" style={{ background: 'linear-gradient(150deg,#131b3a,#0f1630)', borderColor: 'rgba(255,180,84,0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Icon name="flame" size={42} style={{ color: 'var(--amber)', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 21, lineHeight: 1.25 }}>
              连飞 <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 28 }}>{stats.curStreak}</span> 夜
            </div>
            <div style={{ fontSize: 12, color: 'var(--ink-2)', marginTop: 2, fontFamily: 'var(--font-mono)' }}>
              历史最长 {stats.maxStreak} 夜 · 已解锁 {unlockedCount}/{MISSIONS.length} 项任务
            </div>
          </div>
        </div>
        {routeTail.length > 0 && (
          <div style={{ display: 'flex', gap: 6, marginTop: 10, alignItems: 'center', overflow: 'hidden' }}>
            {routeTail.map((d, i) => (
              <motion.span
                key={d}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 420, damping: 15, delay: 0.05 * i }}
              >
                <WayDot i={i} />
              </motion.span>
            ))}
            <span style={{ fontSize: 11, color: 'var(--ink-3)', marginLeft: 4, fontFamily: 'var(--font-mono)' }}>
              连续夜
              <br />
              自动连线
            </span>
          </div>
        )}
      </div>

      {next && (
        <div className="card">
          <div className="next-node" style={{ marginBottom: 10 }}>
            <span className="emblem">
              <Icon name={iconOf(next.id)} size={24} />
            </span>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 19, lineHeight: 1.3 }}>
                「{next.name}」还差
                <span style={{ color: 'var(--amber)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: 23, margin: '0 4px' }}>{remain}</span>
                夜
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--ink-2)' }}>{next.desc}</div>
            </div>
          </div>
          <div className="prog-wrap">
            <div className="prog">
              <i style={{ width: `${Math.min(100, (stats.maxStreak / next.goal) * 100)}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
              <span className="got-date">最长连飞 {stats.maxStreak} 夜</span>
              <span className="got-date">目标 {next.goal} 夜</span>
            </div>
          </div>
        </div>
      )}

      <div className="sec-head">
        <h2>任务航线</h2>
        <span className="note">从 1 夜到 2 年</span>
      </div>
      <div className="card">
        <div className="route-wrap">
          <div className="route">
            <span className="fill" style={{ width: `calc(${fillPct}% )` }} />
            {ROUTE.map((r) => {
              const got = !!unlocked[r.id]
              const isNext = next?.id === r.id
              return (
                <div className={`route-node${got ? ' done' : ''}${isNext ? ' now' : ''}`} key={r.id}>
                  <span className="st">
                    <Icon name={got ? 'check' : iconOf(r.id)} size={23} />
                  </span>
                  <span className="lb">{got ? r.name : `${r.goal} 夜`}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="sec-head">
        <h2>任务徽章</h2>
        <span className="note">{unlockedCount}/{MISSIONS.length} 已解锁</span>
      </div>
      <div className="badges">
        {MISSIONS.map((m, i) => {
          const got = !!unlocked[m.id]
          const cur = Math.min(m.value(stats), m.goal)
          return (
            <motion.div
              key={m.id}
              className={`badge ${colorOf(m.kind, m.tier)} ${got ? 'unlocked' : 'locked'}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(i * 0.02, 0.3), duration: 0.25 }}
            >
              <span className="emblem">
                <Icon name={got ? iconOf(m.id) : 'lock'} size={23} />
              </span>
              <span className="name">{m.name}</span>
              <span className="desc">{m.desc}</span>
              {got ? (
                <span className="got-date">{unlocked[m.id]} 解锁</span>
              ) : (
                <>
                  <span className="prog">
                    <i style={{ width: `${(cur / m.goal) * 100}%` }} />
                  </span>
                  <span className="got-date">{cur}/{m.goal}</span>
                </>
              )}
            </motion.div>
          )
        })}
      </div>
      <p className="empty-tip" style={{ marginTop: 10 }}>解锁任务立刻奖励经验：稀有度 × 25</p>
    </div>
  )
}

/** 连航线尾部的小航点（金/绿交替） */
const WayDot = ({ i }: { i: number }) => (
  <svg width="22" height="22" viewBox="0 0 22 22" aria-hidden="true">
    <circle cx="11" cy="11" r="8" fill={i % 2 ? 'rgba(61,220,151,0.14)' : 'rgba(255,180,84,0.14)'} />
    <circle cx="11" cy="11" r="4.5" fill={i % 2 ? '#3DDC97' : '#FFB454'} />
  </svg>
)
