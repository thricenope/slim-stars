import { motion } from 'framer-motion'
import type { Verdict } from '../types'

export type Mood = 'pending' | 'perfect' | 'win' | 'plain' | 'fail'

export const moodOf = (v: Verdict): Mood => v

/** 伴飞 AI「阿控」——圆头小机器人，屏幕状态随当日判定变化 */
export const Orb = ({ mood, size = 112 }: { mood: Mood; size?: number }) => {
  const shell = mood === 'fail' ? '#8E96B8' : '#B9C1E2'
  const shellDark = mood === 'fail' ? '#6B7394' : '#8C95BE'
  const glow = mood === 'perfect' ? '#FFB454' : mood === 'win' ? '#3DDC97' : '#5A648F'

  const face = () => {
    switch (mood) {
      case 'perfect':
        return (
          <g>
            <path d="M38 56 l7 -7 7 7 7 -7 7 7" stroke="#0A0F1E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M61 56 l7 -7 7 7 7 -7 7 7" stroke="#0A0F1E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
            <path d="M50 72 q12 10 24 0" stroke="#0A0F1E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
        )
      case 'win':
        return (
          <g>
            <path d="M40 56 q6 -8 12 0" stroke="#0A0F1E" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M70 56 q6 -8 12 0" stroke="#0A0F1E" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M52 72 q10 8 20 0" stroke="#0A0F1E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
        )
      case 'fail':
        return (
          <g>
            <path d="M40 58 q6 7 12 0" stroke="#0A0F1E" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M70 58 q6 7 12 0" stroke="#0A0F1E" strokeWidth="3.6" strokeLinecap="round" fill="none" />
            <path d="M53 76 q9 -7 18 0" stroke="#0A0F1E" strokeWidth="3.4" strokeLinecap="round" fill="none" />
          </g>
        )
      case 'plain':
        return (
          <g fill="#0A0F1E">
            <rect x="42" y="50" width="10" height="10" rx="4" />
            <rect x="70" y="50" width="10" height="10" rx="4" />
            <rect x="50" y="70" width="24" height="4" rx="2" />
          </g>
        )
      default:
        return (
          <g fill="#0A0F1E">
            <circle cx="47" cy="55" r="5.5" />
            <circle cx="75" cy="55" r="5.5" />
            <circle cx="49" cy="53" r="2" fill="#fff" />
            <circle cx="77" cy="53" r="2" fill="#fff" />
            <ellipse cx="61" cy="72" rx="4.5" ry="5.5" />
          </g>
        )
    }
  }

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 122 122"
      aria-hidden="true"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
    >
      {/* 天线 */}
      <line x1="61" y1="12" x2="61" y2="24" stroke={shellDark} strokeWidth="3.4" strokeLinecap="round" />
      <circle cx="61" cy="10" r="5" fill={glow} opacity="0.95" className="orb-antenna" />
      {/* 耳侧 */}
      <rect x="8" y="52" width="12" height="24" rx="6" fill={shellDark} />
      <rect x="102" y="52" width="12" height="24" rx="6" fill={shellDark} />
      {/* 头 */}
      <rect x="18" y="24" width="86" height="76" rx="30" fill={shell} stroke={shellDark} strokeWidth="3" />
      {/* 面罩 */}
      <rect x="28" y="38" width="66" height="48" rx="22" fill="#E7EBFA" stroke={shellDark} strokeWidth="2" />
      <rect x="34" y="44" width="24" height="10" rx="5" fill="#fff" opacity="0.7" />
      {face()}
      {/* 腮红 */}
      <circle cx="34" cy="82" r="4.5" fill={mood === 'fail' ? '#FF8FA3' : '#FFB4C0'} opacity="0.75" />
      <circle cx="88" cy="82" r="4.5" fill={mood === 'fail' ? '#FF8FA3' : '#FFB4C0'} opacity="0.75" />
      {mood === 'perfect' && (
        <g stroke="#FFB454" strokeWidth="2.6" strokeLinecap="round" fill="none">
          <path d="M14 20 l4 4 M18 20 l-4 4" />
          <path d="M104 18 l5 5 M109 18 l-5 5" />
        </g>
      )}
    </motion.svg>
  )
}
