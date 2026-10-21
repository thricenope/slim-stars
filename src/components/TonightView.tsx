import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DayRecord, Verdict } from '../types'
import { useGame, useStats, useTodayRecord } from '../store'
import { EMPTY_RECORD, VERDICT_META, evaluate, isPerfect, isWin } from '../logic/scoring'
import { today, dateCn } from '../logic/dates'
import { computeStats, missedRecent } from '../logic/stats'
import { bigCelebration, burstAt, launchFrom } from '../celebrate'
import { titleFor } from '../logic/rank'
import { Orb } from './Orb'
import { DayEditor } from './DayEditor'
import { Icon } from './Icon'

const PRAISE: Record<Verdict, string[]> = {
  pending: ['飞控站就位，等你的晚饭遥测。', '下面选一选，我帮你算飞行姿态。', '今晚的任务参数还没录入哦。'],
  perfect: ['各系统满分！这是教科书级的一夜！', '完美入轨！指挥官，请收下我的敬意。', '今夜数据完美，轨道稳如钟。'],
  win: ['任务成功，今晚的星星已点亮。', '飞行姿态漂亮，继续保持这个节奏。', '又一个成功夜，星图上又亮一颗。'],
  plain: ['平稳巡航，没输也没赢。', '差一点点就成功了，明晚加个动作？'],
  fail: ['短暂偏航，不影响整个任务。', '一顿饭决定不了航向，明晚赢回来。', '已记录。明晚提前一点，我们重新点火。'],
}

const pick = (arr: string[], seed: string) =>
  arr[Math.abs([...seed].reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 0)) % arr.length]

const dayXp = (r: DayRecord | undefined | null): number =>
  (isWin(r) ? 20 : 0) + (isPerfect(r) ? 10 : 0) + Math.min(r?.exercises.length ?? 0, 2) * 2

const TITLES_CN = ['一', '两', '三', '四', '五', '六', '七', '八', '九', '十']

export const TonightView = ({ onGoSky }: { onGoSky: () => void }) => {
  const saved = useTodayRecord()
  const setDay = useGame((s) => s.setDay)
  const clearDay = useGame((s) => s.clearDay)
  const stats = useStats()

  const t = today()
  const [draft, setDraft] = useState<DayRecord>(saved ?? EMPTY_RECORD(t))
  const [xpFloat, setXpFloat] = useState<{ id: number; text: string } | null>(null)
  const [combo, setCombo] = useState<{ n: number } | null>(null)
  const [rankUp, setRankUp] = useState<number | null>(null)
  const ctaRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setDraft(saved ?? EMPTY_RECORD(t))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t, saved?.date])

  const ev = useMemo(() => evaluate(draft), [draft])
  const meta = VERDICT_META[ev.verdict]
  const touched = draft.slot !== null || draft.amount !== null || draft.drink !== null || draft.exercises.length > 0
  const recordedToday = !!saved
  const missed = useMemo(() => missedRecent(useGame.getState().records), [recordedToday, stats.totalDays])

  const doSave = () => {
    const oldXp = dayXp(saved)
    const result = setDay(t, draft)
    const gained = dayXp(draft) - oldXp

    if (result.verdict === 'win' || result.verdict === 'perfect') {
      launchFrom(ctaRef.current)
      bigCelebration()
      burstAt(ctaRef.current)
      const streak = computeStats(useGame.getState().records).curStreak
      if (streak >= 2) {
        setCombo({ n: streak })
        setTimeout(() => setCombo(null), 1900)
      }
    } else if (gained > 0) {
      burstAt(ctaRef.current)
    }

    if (gained > 0) {
      setXpFloat({ id: Date.now(), text: `+${gained} XP` })
      setTimeout(() => setXpFloat(null), 1500)
    }
    if (result.levelAfter > result.levelBefore) {
      setTimeout(() => setRankUp(result.levelAfter), 800)
    }
  }

  const meterLeft = Math.min(96, Math.max(4, 44 + ev.score * 6.5))
  const dotCls = ev.score > 0 ? ' dot-pos' : ev.score < 0 ? ' dot-neg' : ''
  const comboCn = combo ? (combo.n <= 10 ? TITLES_CN[combo.n - 1] : String(combo.n)) : ''

  return (
    <div>
      {stats.totalDays === 0 && (
        <div className="card guide-card">
          <div className="g-title">欢迎来到摘星计划</div>
          <ol>
            <li>每天晚饭后回来，<b>点几下</b>录入今晚遥测</li>
            <li>成功夜会在<b>星图</b>点亮一颗航点，连续的夜自动连成航线</li>
            <li>从 1 夜、一周到两年，<b>任务节点</b>等你逐一解锁</li>
          </ol>
        </div>
      )}

      {missed && !recordedToday && (
        <div className="done-banner" style={{ background: 'rgba(255,180,84,0.1)', borderColor: 'rgba(255,180,84,0.4)' }}>
          <Icon name="calendar" size={20} style={{ color: 'var(--amber)' }} />
          <span className="t" style={{ color: 'var(--amber)' }}>{dateCn(missed)}未执行任务</span>
          <button className="cal-today-btn" onClick={onGoSky}>去补录</button>
        </div>
      )}

      <div className="card orb-card">
        <div className="orb"><Orb mood={ev.verdict} /></div>
        <div className="bubble">
          <AnimatePresence mode="wait">
            <motion.div
              key={ev.verdict}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22 }}
            >
              <div className="hi">{pick(PRAISE[ev.verdict], t + ev.verdict)}</div>
              <div className="sub">
                {recordedToday ? '已执行 · 可随时修订' : dateCn(t)}
                {stats.curStreak > 0 && ` · 连飞 ${stats.curStreak} 夜`}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {recordedToday && (
        <div className="done-banner">
          <Icon name="check" size={20} style={{ color: 'var(--green)' }} />
          <span className="t">今夜已执行：{VERDICT_META[evaluate(saved).verdict].title}</span>
          <span className="s">{evaluate(saved).score} 分</span>
        </div>
      )}

      <DayEditor value={draft} onChange={(p) => setDraft((d) => ({ ...d, ...p }))} />

      <div className="card live-verdict">
        <div className="row">
          <span className={`vpill ${meta.cls}`}>{meta.title}</span>
          <span className={`score-num ${ev.score > 0 ? 'pos' : ev.score < 0 ? 'neg' : 'zero'}`} aria-label={`今夜 ${ev.score} 分`}>
            {ev.score > 0 ? `+${ev.score}` : ev.score}
          </span>
        </div>
        <div className="meter" aria-hidden="true">
          <span className="tick" />
          <span className={`dot${dotCls}`} style={{ left: `${meterLeft}%` }} />
        </div>
        <div className="parts">
          {ev.parts.map((p, i) => (
            <div className="p" key={i}>
              <span>{p.label}</span>
              <b className={p.pts > 0 ? 'plus' : p.pts < 0 ? 'minus' : 'zero'}>
                {p.pts > 0 ? `+${p.pts}` : p.pts}
              </b>
            </div>
          ))}
          <div className="p">
            <span style={{ color: 'var(--ink-3)' }}>≥ 2 分 = 成功夜 · ≥ 6 分 = 完美夜</span>
          </div>
        </div>
      </div>

      <motion.button
        ref={ctaRef}
        type="button"
        className={`cta${ev.verdict === 'fail' ? '' : ' mint'}`}
        whileTap={{ scale: 0.97 }}
        disabled={!touched}
        onClick={doSave}
      >
        <Icon name="rocket" size={21} />
        {recordedToday ? '确认修订' : '点火 · 执行今夜任务'}
      </motion.button>

      {recordedToday && (
        <div style={{ textAlign: 'center' }}>
          <button
            className="ghost-link"
            onClick={() => {
              if (window.confirm('清除今夜的记录吗？')) {
                clearDay(t)
                setDraft(EMPTY_RECORD(t))
              }
            }}
          >
            <Icon name="trash" size={14} /> 撤销今夜记录
          </button>
        </div>
      )}

      <AnimatePresence>
        {combo && (
          <motion.div
            className="combo-banner"
            initial={{ scale: 0.3, opacity: 0, rotate: -4 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.6, opacity: 0, y: -30 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            连飞 {combo.n} 夜
            <small>STREAK × {combo.n}{comboCn ? ` · ${comboCn}夜连航` : ''}</small>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {xpFloat && (
          <motion.div
            key={xpFloat.id}
            className="xp-float"
            style={{ left: '50%', top: '58%' }}
            initial={{ y: 0, opacity: 1, x: '-50%' }}
            animate={{ y: -70, opacity: 0, x: '-50%' }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.3, ease: 'easeOut' }}
          >
            {xpFloat.text}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rankUp !== null && (
          <motion.div
            className="cele-mask z-top"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setRankUp(null)}
          >
            <motion.div
              className="cele-card"
              initial={{ scale: 0.5, y: 60 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="rays" />
              <div className="cele-kind">职 级 晋 升</div>
              <motion.div
                className="cele-emoji"
                initial={{ rotate: -20, scale: 0.4 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 12, delay: 0.15 }}
              >
                <Icon name="crown" size={70} style={{ color: 'var(--amber)' }} />
              </motion.div>
              <div className="cele-title">LV {rankUp}</div>
              <div className="cele-desc">授衔「{titleFor(rankUp)}」</div>
              <button type="button" className="cta mint" onClick={() => setRankUp(null)}>
                收到，继续飞行
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
