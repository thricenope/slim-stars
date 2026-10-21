import type { Stats } from '../types'

export type MissionKind = 'streak' | 'total' | 'special'

export interface Mission {
  id: string
  badge: string // 任务徽章代号（展示用装饰符号）
  name: string
  desc: string
  kind: MissionKind
  tier: number // 奖励经验 = tier * 25
  goal: number
  value: (s: Stats) => number
  /** 航线节点（连续类，按用户点名的阶梯） */
  onRoute?: boolean
}

export const MISSIONS: Mission[] = [
  // —— 连续夜数（用户点名的阶梯：1/2/3/4/5/周末/一周/两周/一月/一年/两年…）
  { id: 's1', badge: '🚀', name: '首飞成功', desc: '第 1 个任务夜，任务序列启动', kind: 'streak', tier: 1, goal: 1, value: (s) => s.maxStreak, onRoute: true },
  { id: 's2', badge: '🛰️', name: '连续两夜', desc: '连飞 x2，姿态稳定', kind: 'streak', tier: 1, goal: 2, value: (s) => s.maxStreak, onRoute: true },
  { id: 's3', badge: '🌟', name: '三日入轨', desc: '连续 3 夜，飞行器进入稳定轨道', kind: 'streak', tier: 1, goal: 3, value: (s) => s.maxStreak, onRoute: true },
  { id: 's4', badge: '🌟', name: '四夜稳态', desc: '连续 4 夜，各系统运转正常', kind: 'streak', tier: 1, goal: 4, value: (s) => s.maxStreak, onRoute: true },
  { id: 's5', badge: '🔥', name: '五夜巡航', desc: '连续 5 夜，工作日全航段通关', kind: 'streak', tier: 2, goal: 5, value: (s) => s.maxStreak, onRoute: true },
  { id: 'wk1', badge: '🌙', name: '周末双任务', desc: '周六周日两个任务夜都成功，休息日不脱轨', kind: 'special', tier: 2, goal: 1, value: (s) => s.weekendPairs },
  { id: 's7', badge: '🏆', name: '七天在轨', desc: '整整一周连续成功，绕地一圈', kind: 'streak', tier: 2, goal: 7, value: (s) => s.maxStreak, onRoute: true },
  { id: 's14', badge: '🏆', name: '双周远航', desc: '连续 14 夜，远离舒适区引力', kind: 'streak', tier: 3, goal: 14, value: (s) => s.maxStreak, onRoute: true },
  { id: 's21', badge: '💠', name: '摆脱旧引力', desc: '21 夜连续，新习惯已经点火', kind: 'streak', tier: 3, goal: 21, value: (s) => s.maxStreak, onRoute: true },
  { id: 's30', badge: '👑', name: '满月任务', desc: '连续 30 夜，绕月一圈凯旋', kind: 'streak', tier: 4, goal: 30, value: (s) => s.maxStreak, onRoute: true },
  { id: 's100', badge: '👑', name: '百日深空', desc: '连续 100 夜，进入深空巡航', kind: 'streak', tier: 5, goal: 100, value: (s) => s.maxStreak, onRoute: true },
  { id: 's365', badge: '🪐', name: '周年环绕', desc: '连续 365 夜，环绕恒星一整圈', kind: 'streak', tier: 6, goal: 365, value: (s) => s.maxStreak, onRoute: true },
  { id: 's730', badge: '🌌', name: '双年星际', desc: '连续 730 夜，星际任务达成', kind: 'streak', tier: 7, goal: 730, value: (s) => s.maxStreak, onRoute: true },

  // —— 累计成功夜
  { id: 't10', badge: '✨', name: '十夜微光', desc: '累计 10 个成功夜', kind: 'total', tier: 1, goal: 10, value: (s) => s.winDays },
  { id: 't30', badge: '🌠', name: '三十夜星带', desc: '累计 30 个成功夜，连成一条星带', kind: 'total', tier: 2, goal: 30, value: (s) => s.winDays },
  { id: 't100', badge: '💫', name: '百夜星河', desc: '累计 100 个成功夜', kind: 'total', tier: 4, goal: 100, value: (s) => s.winDays },
  { id: 't365', badge: '🌑', name: '年轮星轨', desc: '累计 365 个成功夜', kind: 'total', tier: 6, goal: 365, value: (s) => s.winDays },

  // —— 特色任务
  { id: 'p3', badge: '🎯', name: '三次精准入轨', desc: '拿下 3 个完美夜（≥6 分）', kind: 'special', tier: 2, goal: 3, value: (s) => s.perfectDays },
  { id: 'p10', badge: '🎯', name: '精准标兵', desc: '拿下 10 个完美夜', kind: 'special', tier: 3, goal: 10, value: (s) => s.perfectDays },
  { id: 'e10', badge: '💪', name: '体能训练开始', desc: '累计运动打卡 10 次', kind: 'special', tier: 1, goal: 10, value: (s) => s.exerciseCount },
  { id: 'e50', badge: '💪', name: '离心机常客', desc: '累计运动打卡 50 次', kind: 'special', tier: 3, goal: 50, value: (s) => s.exerciseCount },
  { id: 'early20', badge: '⏰', name: '黄金窗口期', desc: '20 次 17 点前解决晚饭', kind: 'special', tier: 2, goal: 20, value: (s) => s.earlyDinners },
]

export const missionById = (id: string): Mission | undefined =>
  MISSIONS.find((m) => m.id === id)

/** 航线：只放连续类节点 */
export const ROUTE = MISSIONS.filter((m) => m.onRoute)

/** 找到下一个未解锁的航线节点（用于「还差 N 夜」） */
export const nextRoute = (s: Stats, unlocked: Record<string, string>): Mission | undefined =>
  ROUTE.find((m) => !unlocked[m.id] && m.goal > s.maxStreak) ?? ROUTE.find((m) => !unlocked[m.id])
