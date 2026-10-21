import type { DayRecord, Stats } from '../types'
import { addDays, daysBetween, isWeekend, parseYmd, today, weekendOf, ymd } from './dates'
import { evaluate, isPerfect, isWin } from './scoring'

export const computeStats = (records: Record<string, DayRecord>): Stats => {
  const dates = Object.keys(records).sort()
  let totalDays = 0
  let winDays = 0
  let perfectDays = 0
  let failDays = 0
  let exerciseCount = 0
  let earlyDinners = 0
  const winSet = new Set<string>()

  for (const d of dates) {
    const r = records[d]
    totalDays += 1
    exerciseCount += r.exercises.length
    if (r.slot === 'skip' || r.slot === '16' || r.slot === '17') earlyDinners += 1
    if (isWin(r)) {
      winDays += 1
      winSet.add(d)
    }
    if (isPerfect(r)) perfectDays += 1
    if (evaluate(r).verdict === 'fail') failDays += 1
  }

  // 最长连击
  let maxStreak = 0
  let run = 0
  let prev: string | null = null
  for (const d of dates) {
    if (winSet.has(d)) {
      run = prev && daysBetween(prev, d) === 1 ? run + 1 : 1
      maxStreak = Math.max(maxStreak, run)
    } else {
      run = 0
    }
    prev = d
  }

  // 当前连击：从今天往回数；今天没记录则从昨天起算
  const t = today()
  let curStreak = 0
  let cursor = winSet.has(t) ? t : addDays(t, -1)
  while (winSet.has(cursor)) {
    curStreak += 1
    cursor = addDays(cursor, -1)
  }
  const streakAliveToday = curStreak > 0

  // 周末双杀：完整打卡过的周末里，两天都成功
  const weekendsSeen = new Set<string>()
  let weekendPairs = 0
  for (const d of dates) {
    if (!isWeekend(d)) continue
    const [sat, sun] = weekendOf(d)
    const key = sat
    if (weekendsSeen.has(key)) continue
    weekendsSeen.add(key)
    if (winSet.has(sat) && winSet.has(sun)) weekendPairs += 1
  }

  const firstDate = dates[0] ?? null
  const dayNumber = firstDate ? daysBetween(firstDate, t) + 1 : 0

  return {
    totalDays,
    winDays,
    perfectDays,
    failDays,
    rate: totalDays > 0 ? winDays / totalDays : 0,
    curStreak,
    maxStreak: Math.max(maxStreak, curStreak),
    streakAliveToday,
    firstDate,
    dayNumber,
    weekendPairs,
    exerciseCount,
    earlyDinners,
  }
}

/**
 * 宝石链：从某天往前找连续成功日，返回从链头到该日的日期序列。
 * 连续 3 颗同色 = 一组「消除」，颜色按 floor(链内序号 / 3) 轮换。
 */
export const chainUpTo = (date: string, records: Record<string, DayRecord>): string[] => {
  const chain: string[] = []
  let cursor = date
  while (isWin(records[cursor])) {
    chain.unshift(cursor)
    cursor = addDays(cursor, -1)
  }
  return chain
}

/** 该日在其宝石链中的序号（0 起）；非成功日返回 -1 */
export const chainIndex = (date: string, records: Record<string, DayRecord>): number =>
  chainUpTo(date, records).indexOf(date)

/** 最近 N 天（含今天）的日期与评估，供统计条形场使用 */
export const recentDays = (
  records: Record<string, DayRecord>,
  n: number,
): { date: string; score: number; verdict: string }[] => {
  const t = today()
  const out: { date: string; score: number; verdict: string }[] = []
  for (let i = n - 1; i >= 0; i--) {
    const d = addDays(t, -i)
    const ev = evaluate(records[d])
    out.push({ date: d, score: ev.score, verdict: ev.verdict })
  }
  return out
}

/** 某年某月内每天的记录状态，供日历渲染 */
export const monthDays = (
  year: number,
  month: number,
  records: Record<string, DayRecord>,
) => {
  const days: { date: string; inMonth: boolean; record?: DayRecord; win: boolean; score: number; verdict: string }[] = []
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const totalCells = Math.ceil((first.getDay() + daysInMonth) / 7) * 7
  for (let i = 0; i < totalCells; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    const ds = ymd(d)
    const r = records[ds]
    const ev = evaluate(r)
    days.push({
      date: ds,
      inMonth: d.getMonth() === month,
      record: r,
      win: ev.verdict === 'win' || ev.verdict === 'perfect',
      score: ev.score,
      verdict: ev.verdict,
    })
  }
  return days
}

/** 月份摘要 */
export const monthSummary = (days: { win: boolean; verdict: string }[]) => {
  const recorded = days.filter((d) => d.verdict !== 'pending')
  const wins = days.filter((d) => d.win).length
  return { recorded: recorded.length, wins }
}

/** 从今天起第一个还没打卡的日期（用于「补打卡」引导），只往前找 7 天 */
export const missedRecent = (records: Record<string, DayRecord>): string | null => {
  const t = parseYmd(today())
  for (let i = 1; i <= 7; i++) {
    const d = new Date(t)
    d.setDate(t.getDate() - i)
    const ds = ymd(d)
    if (!records[ds]) return ds
  }
  return null
}
