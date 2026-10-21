export const ymd = (d: Date): string => {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export const today = (): string => ymd(new Date())

export const parseYmd = (s: string): Date => {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (s: string, n: number): string => {
  const d = parseYmd(s)
  d.setDate(d.getDate() + n)
  return ymd(d)
}

/** 该日期属于星期几（0=周日 … 6=周六） */
export const weekday = (s: string): number => parseYmd(s).getDay()

const WEEK_CN = ['日', '一', '二', '三', '四', '五', '六']
export const weekCn = (s: string): string => WEEK_CN[weekday(s)]

/** 包含 date 的那个周末（周六/周日），返回 [周六, 周日] */
export const weekendOf = (s: string): [string, string] => {
  const w = weekday(s)
  // 周日(0): 周六是 -1；周六(6): +0
  const deltaToSat = w === 0 ? -1 : 6 - w
  const sat = addDays(s, deltaToSat)
  return [sat, addDays(sat, 1)]
}

export const isWeekend = (s: string): boolean => {
  const w = weekday(s)
  return w === 0 || w === 6
}

/** 某月的日历矩阵：周日起，含上下月补位；每格 42 或 35 天 */
export const monthMatrix = (year: number, month: number): string[] => {
  const first = new Date(year, month, 1)
  const start = new Date(year, month, 1 - first.getDay())
  const days: string[] = []
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    days.push(ymd(d))
    // 月末周六收尾则提前停
    if (i >= 27 && d.getDay() === 6 && d.getMonth() !== month) break
  }
  return days
}

export const monthLabel = (year: number, month: number): string =>
  `${year} 年 ${month + 1} 月`

/** 两个 YYYY-MM-DD 之间隔了多少天（b - a） */
export const daysBetween = (a: string, b: string): number =>
  Math.round((parseYmd(b).getTime() - parseYmd(a).getTime()) / 86400000)

export const dateCn = (s: string): string =>
  `${parseYmd(s).getMonth() + 1} 月 ${parseYmd(s).getDate()} 日 · 周${weekCn(s)}`
