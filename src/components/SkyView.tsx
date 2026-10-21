import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useGame } from '../store'
import { monthDays, monthSummary } from '../logic/stats'
import { monthLabel, parseYmd, today } from '../logic/dates'
import type { WaypointKind } from './Waypoint'
import { Waypoint } from './Waypoint'
import { Icon } from './Icon'
import { DaySheet } from './DaySheet'

const WEEK = ['日', '一', '二', '三', '四', '五', '六']

const kindOf = (d: { win: boolean; verdict: string }): WaypointKind =>
  d.verdict === 'perfect' ? 'perfect' : d.win ? 'win' : d.verdict === 'fail' ? 'fail' : d.verdict === 'plain' ? 'plain' : 'empty'

/** 星图月视图：成功夜 = 航点，相邻成功夜自动连线成航线 */
export const SkyView = () => {
  const records = useGame((s) => s.records)
  const now = new Date()
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [sel, setSel] = useState<string | null>(null)

  const days = useMemo(() => monthDays(ym.y, ym.m, records), [ym, records])
  const summary = useMemo(() => monthSummary(days), [days])
  const t = today()
  const rows = days.length / 7

  const lines = useMemo(() => {
    const segs: { x1: number; y1: number; x2: number; y2: number; key: string }[] = []
    for (let i = 1; i < days.length; i++) {
      const a = days[i - 1]
      const b = days[i]
      if (!a.inMonth || !b.inMonth) continue
      if (!(a.win && b.win)) continue
      segs.push({
        x1: ((i - 1) % 7) + 0.5,
        y1: Math.floor((i - 1) / 7) + 0.5,
        x2: (i % 7) + 0.5,
        y2: Math.floor(i / 7) + 0.5,
        key: a.date,
      })
    }
    return segs
  }, [days])

  const shift = (delta: number) => {
    setYm(({ y, m }) => {
      const d = new Date(y, m + delta, 1)
      return { y: d.getFullYear(), m: d.getMonth() }
    })
  }

  const canFuture = ym.y < now.getFullYear() || (ym.y === now.getFullYear() && ym.m > now.getMonth())

  return (
    <div>
      <div className="cal-head">
        <button type="button" className="cal-nav" aria-label="上个月" onClick={() => shift(-1)}>
          <Icon name="left" size={19} />
        </button>
        <div className="title">{monthLabel(ym.y, ym.m)}</div>
        {canFuture ? (
          <div style={{ width: 38 }} />
        ) : (
          <button type="button" className="cal-nav" aria-label="下个月" onClick={() => shift(1)}>
            <Icon name="right" size={19} />
          </button>
        )}
        <button type="button" className="cal-today-btn" onClick={() => setYm({ y: now.getFullYear(), m: now.getMonth() })}>
          回今夜
        </button>
      </div>

      <div className="card">
        <div className="cal-week" aria-hidden="true">
          {WEEK.map((w, i) => (
            <span key={w} className={i === 0 || i === 6 ? 'wend' : ''}>{w}</span>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={`${ym.y}-${ym.m}`}
            className="sky-board"
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
          >
            <svg
              className="sky-lines"
              viewBox={`0 0 7 ${rows}`}
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {lines.map((l) => (
                <line key={l.key} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <div className="cal-grid">
              {days.map((d) => {
                const dayNum = parseYmd(d.date).getDate()
                const isToday = d.date === t
                const marked = d.verdict !== 'pending'
                return (
                  <button
                    type="button"
                    key={d.date}
                    className={[
                      'cal-cell',
                      d.inMonth ? '' : 'dim',
                      isToday ? 'today' : '',
                      sel === d.date ? 'sel' : '',
                    ].join(' ')}
                    aria-label={`${d.date} ${d.verdict === 'pending' ? '未执行' : d.verdict === 'fail' ? '偏航夜' : d.win ? '成功夜' : '平稳夜'}`}
                    onClick={() => setSel(d.date)}
                  >
                    <span className="dnum" aria-hidden="true" style={marked ? { display: 'none' } : undefined}>
                      {dayNum}
                    </span>
                    <Waypoint kind={kindOf(d)} size={d.win ? 30 : 22} delay={d.inMonth ? (dayNum % 7) * 0.03 : 0} inMonth={d.inMonth} />
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="month-sum">
          本月执行 <b>{summary.recorded}</b> 夜 · 成功 <b>{summary.wins}</b> 夜
        </div>
      </div>

      <div className="legend">
        <span className="li"><Waypoint kind="win" size={16} /> 成功夜</span>
        <span className="li"><Waypoint kind="perfect" size={16} /> 完美夜</span>
        <span className="li"><Waypoint kind="plain" size={14} /> 平稳夜</span>
        <span className="li"><Waypoint kind="fail" size={15} /> 偏航夜</span>
        <span className="li"><Waypoint kind="empty" size={14} /> 未执行</span>
      </div>

      <p className="empty-tip">连续的成功夜会自动连成航线 · 点任意日期可补录</p>

      <AnimatePresence>
        {sel && <DaySheet date={sel} onClose={() => setSel(null)} />}
      </AnimatePresence>
    </div>
  )
}
