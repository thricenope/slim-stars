import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useMemo } from 'react'
import type { Amount, DayRecord, Drink, ExerciseId, Stats, TimeSlot, Verdict } from './types'
import { today } from './logic/dates'
import { computeStats } from './logic/stats'
import { evaluate, isPerfect, isWin } from './logic/scoring'
import { MISSIONS, missionById } from './logic/missions'
import { rankFromXp } from './logic/rank'

export interface SaveResult {
  verdict: Verdict
  score: number
  newUnlocked: string[]
  levelBefore: number
  levelAfter: number
}

interface GameState {
  records: Record<string, DayRecord>
  unlocked: Record<string, string> // 成就 id -> 解锁日期
  celebrated: Record<string, true> // 已弹窗庆祝过的成就
  pendingCelebrate: string[] // 待庆祝的成就队列

  setDay: (date: string, rec: DayRecord) => SaveResult
  clearDay: (date: string) => void
  dismissOneCelebrate: () => void
  importData: (data: { records?: Record<string, DayRecord> }) => void
  resetAll: () => void
}

/** 每日经验：成功 +20，完美再 +10，运动每项 +2（每天封顶 +4）——全部由记录推导，改历史不会刷分 */
export const xpFromRecords = (records: Record<string, DayRecord>): number => {
  let xp = 0
  for (const r of Object.values(records)) {
    if (isWin(r)) xp += 20
    if (isPerfect(r)) xp += 10
    xp += Math.min(r.exercises.length, 2) * 2
  }
  return xp
}

export const xpFromUnlocked = (unlocked: Record<string, string>): number =>
  Object.keys(unlocked).reduce((sum, id) => {
    const a = missionById(id)
    return sum + (a ? a.tier * 25 : 0)
  }, 0)

export const useGame = create<GameState>()(
  persist(
    (set, get) => ({
      records: {},
      unlocked: {},
      celebrated: {},
      pendingCelebrate: [],

      setDay: (date, rec) => {
        const state = get()
        const records = { ...state.records, [date]: rec }
        const stats = computeStats(records)
        const xpBefore =
          xpFromRecords(state.records) + xpFromUnlocked(state.unlocked)
        const levelBefore = rankFromXp(xpBefore).level

        // 清掉空记录，避免脏数据
        if (!rec.slot && !rec.amount && !rec.drink && rec.exercises.length === 0) {
          delete records[date]
        }

        const newUnlocked: string[] = []
        const unlocked = { ...state.unlocked }
        const celebrated = { ...state.celebrated }
        const pendingCelebrate = [...state.pendingCelebrate]
        for (const a of MISSIONS) {
          if (unlocked[a.id]) continue
          if (a.value(stats) >= a.goal) {
            unlocked[a.id] = today()
            newUnlocked.push(a.id)
            if (!celebrated[a.id]) {
              celebrated[a.id] = true
              pendingCelebrate.push(a.id)
            }
          }
        }

        const xpAfter = xpFromRecords(records) + xpFromUnlocked(unlocked)
        const levelAfter = rankFromXp(xpAfter).level

        set({ records, unlocked, celebrated, pendingCelebrate })

        const ev = evaluate(rec)
        return {
          verdict: ev.verdict,
          score: ev.score,
          newUnlocked,
          levelBefore,
          levelAfter,
        }
      },

      clearDay: (date) => {
        const records = { ...get().records }
        delete records[date]
        set({ records })
      },

      dismissOneCelebrate: () => {
        const [, ...rest] = get().pendingCelebrate
        set({ pendingCelebrate: rest })
      },

      importData: (data) => {
        if (!data || typeof data !== 'object' || !data.records) throw new Error('格式不对')
        const records: Record<string, DayRecord> = {}
        for (const [date, r] of Object.entries(data.records)) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue
          records[date] = {
            date,
            slot: (r.slot ?? null) as TimeSlot | null,
            amount: (r.amount ?? null) as Amount | null,
            drink: (r.drink ?? null) as Drink | null,
            exercises: Array.isArray(r.exercises) ? (r.exercises as ExerciseId[]) : [],
          }
        }
        // 重算成就但不重复弹窗
        const stats = computeStats(records)
        const unlocked: Record<string, string> = {}
        for (const a of MISSIONS) {
          if (a.value(stats) >= a.goal) unlocked[a.id] = today()
        }
        set({ records, unlocked, celebrated: {}, pendingCelebrate: [] })
      },

      resetAll: () => set({ records: {}, unlocked: {}, celebrated: {}, pendingCelebrate: [] }),
    }),
    { name: 'slim-stars-v1' },
  ),
)

/** 便捷选择器（选择器必须返回稳定引用，派生数据用 useMemo 计算，避免无限重渲染） */
export const useStats = (): Stats => {
  const records = useGame((s) => s.records)
  return useMemo(() => computeStats(records), [records])
}
export const useTodayRecord = (): DayRecord | undefined =>
  useGame((s) => s.records[today()])
export const useTotalXp = (): number =>
  useGame((s) => xpFromRecords(s.records) + xpFromUnlocked(s.unlocked))
export const useRank = () => rankFromXp(useTotalXp())
