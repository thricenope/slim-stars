import type { Amount, DayEval, DayRecord, Drink, ExerciseId, ScorePart, TimeSlot, Verdict } from '../types'

export const TIME_OPTIONS: { id: TimeSlot; label: string; hint: string }[] = [
  { id: 'skip', label: '没吃晚饭', hint: '今晚直接跳过' },
  { id: '16', label: '16 点前', hint: '传说中的干饭王者' },
  { id: '17', label: '17 点', hint: '黄金晚餐时间' },
  { id: '18', label: '18 点', hint: '还不错，稳住' },
  { id: '19', label: '19 点', hint: '有一点点晚啦' },
  { id: '20+', label: '20 点以后', hint: '夜宵危险区' },
]

const TIME_PTS: Record<TimeSlot, number> = { skip: 3, '16': 3, '17': 2, '18': 1, '19': 0, '20+': -2 }

export const AMOUNT_OPTIONS: { id: Amount; label: string; hint: string }[] = [
  { id: 'tiny', label: '微微吃', hint: '垫吧两口就停' },
  { id: 'light', label: '少吃', hint: '七分饱，刚刚好' },
  { id: 'ok', label: '适中', hint: '正常一碗' },
  { id: 'much', label: '多吃', hint: '有点收不住了' },
  { id: 'alot', label: '吃的很多', hint: '干了一大桌' },
  { id: 'tons', label: '吃的非常多', hint: '吃到扶墙走' },
]

const AMOUNT_PTS: Record<Amount, number> = { tiny: 3, light: 2, ok: 0, much: -2, alot: -3, tons: -4 }

export const DRINK_OPTIONS: { id: Drink; label: string; hint: string }[] = [
  { id: 'none', label: '没喝饮料', hint: '只喝了水，respect' },
  { id: 'free', label: '无糖饮料', hint: '快乐水 0 卡版' },
  { id: 'small', label: '含糖 · 小杯', hint: '半糖奶茶这种' },
  { id: 'big', label: '含糖 · 大杯', hint: '全糖大杯，痛快但…' },
]

const DRINK_PTS: Record<Drink, number> = { none: 1, free: 0, small: -1, big: -2 }

export const EXERCISE_OPTIONS: { id: ExerciseId; label: string }[] = [
  { id: 'gym', label: '健身房' },
  { id: 'run', label: '跑步' },
  { id: 'walk', label: '快走' },
  { id: 'swim', label: '游泳' },
  { id: 'bike', label: '骑行' },
  { id: 'yoga', label: '瑜伽' },
  { id: 'ball', label: '球类' },
  { id: 'hiit', label: '跳操' },
]

export const EXERCISE_LABEL: Record<ExerciseId, string> = Object.fromEntries(
  EXERCISE_OPTIONS.map((o) => [o.id, o.label]),
) as Record<ExerciseId, string>

export const EMPTY_RECORD = (date: string): DayRecord => ({
  date,
  slot: null,
  amount: null,
  drink: null,
  exercises: [],
})

export const isRecorded = (r: DayRecord | undefined | null): boolean =>
  !!r && (r.slot !== null || r.amount !== null || r.drink !== null || r.exercises.length > 0)

/** 评分：规则全透明，UI 会原样展示 parts */
export const evaluate = (r: DayRecord | undefined | null): DayEval => {
  if (!r || !isRecorded(r)) return { score: 0, parts: [], verdict: 'pending' }

  const parts: ScorePart[] = []
  let score = 0

  if (r.slot) {
    const time = TIME_OPTIONS.find((t) => t.id === r.slot)!
    parts.push({ label: `晚饭 ${time.label}`, pts: TIME_PTS[r.slot] })
    score += TIME_PTS[r.slot]
  }
  if (r.slot === 'skip') {
    parts.push({ label: '跳过晚饭', pts: 2 })
    score += 2
  } else if (r.amount) {
    const amt = AMOUNT_OPTIONS.find((a) => a.id === r.amount)!
    parts.push({ label: `食量 ${amt.label}`, pts: AMOUNT_PTS[r.amount] })
    score += AMOUNT_PTS[r.amount]
  }
  if (r.drink) {
    const dr = DRINK_OPTIONS.find((d) => d.id === r.drink)!
    parts.push({ label: dr.label, pts: DRINK_PTS[r.drink] })
    score += DRINK_PTS[r.drink]
  }
  if (r.exercises.length > 0) {
    const cap = Math.min(r.exercises.length, 2)
    const pts = cap * 2
    parts.push({
      label: `运动 ${r.exercises.map((e) => EXERCISE_LABEL[e]).join('、')}`,
      pts,
    })
    score += pts
  }

  return { score, parts, verdict: verdictOf(score) }
}

export const verdictOf = (score: number): Verdict =>
  score >= 6 ? 'perfect' : score >= 2 ? 'win' : score >= 0 ? 'plain' : 'fail'

export const VERDICT_META: Record<Verdict, { title: string; sub: string; cls: string }> = {
  pending: { title: '等待点火', sub: '记完晚饭，任务才算执行', cls: 'v-pending' },
  perfect: { title: '完美任务夜', sub: '教科书级执行，各系统满分！', cls: 'v-perfect' },
  win: { title: '任务成功夜', sub: '今晚的星星已点亮', cls: 'v-win' },
  plain: { title: '平稳巡航夜', sub: '没输也没赢，明天加把劲', cls: 'v-plain' },
  fail: { title: '短暂偏航', sub: '没关系！明晚早点吃，一把赢回来', cls: 'v-fail' },
}

export const isWin = (r: DayRecord | undefined | null): boolean => {
  const v = evaluate(r).verdict
  return v === 'win' || v === 'perfect'
}

export const isPerfect = (r: DayRecord | undefined | null): boolean =>
  evaluate(r).verdict === 'perfect'
