export type TimeSlot = 'skip' | '16' | '17' | '18' | '19' | '20+'
export type Amount = 'tiny' | 'light' | 'ok' | 'much' | 'alot' | 'tons'
export type Drink = 'none' | 'free' | 'small' | 'big'
export type ExerciseId = 'gym' | 'run' | 'walk' | 'swim' | 'bike' | 'yoga' | 'ball' | 'hiit'

export interface DayRecord {
  date: string // YYYY-MM-DD
  slot: TimeSlot | null
  amount: Amount | null
  drink: Drink | null
  exercises: ExerciseId[]
}

export type Verdict = 'pending' | 'perfect' | 'win' | 'plain' | 'fail'

export interface ScorePart {
  label: string
  pts: number
}

export interface DayEval {
  score: number
  parts: ScorePart[]
  verdict: Verdict
}

export interface Stats {
  totalDays: number
  winDays: number
  perfectDays: number
  failDays: number
  rate: number // 0~1 成功率（有记录的日子里成功日占比）
  curStreak: number
  maxStreak: number
  streakAliveToday: boolean // 今天已成功，或昨天成功且今天未记录
  firstDate: string | null
  dayNumber: number // 坚持第 N 天（自首条记录）
  weekendPairs: number // 周末双杀次数
  exerciseCount: number
  earlyDinners: number // 17点前（含）吃完的天数
}
