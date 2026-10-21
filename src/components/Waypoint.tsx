import { motion } from 'framer-motion'

export type WaypointKind = 'perfect' | 'win' | 'plain' | 'fail' | 'empty'

export interface WaypointProps {
  kind: WaypointKind
  size?: number
  delay?: number
  inMonth?: boolean
}

/** 星图航点：成功夜 = 亮星（完美 = 超新星），偏航 = 红色异常点，平稳 = 暗点 */
export const Waypoint = ({ kind, size = 30, delay = 0, inMonth = true }: WaypointProps) => {
  if (kind === 'empty') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="2" fill="#39406B" opacity={inMonth ? 1 : 0.35} />
      </svg>
    )
  }
  if (kind === 'plain') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="5.5" fill="#39406B" stroke="#4A5488" strokeWidth="1.6" />
        <circle cx="14" cy="14" r="1.6" fill="#5A648F" />
      </svg>
    )
  }
  if (kind === 'fail') {
    return (
      <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true">
        <circle cx="16" cy="16" r="6" fill="#4A2340" stroke="#FF6B81" strokeWidth="2" />
        <path d="M11 11 L21 21 M21 11 L11 21" stroke="#FF8FA3" strokeWidth="2" strokeLinecap="round" />
      </svg>
    )
  }
  const perfect = kind === 'perfect'
  const core = perfect ? '#FFF3D6' : '#FFE9B8'
  const ring = perfect ? '#FFB454' : '#3DDC97'
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      initial={inMonth ? { scale: 0, rotate: -40, opacity: 0 } : false}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 420, damping: 15, delay }}
    >
      <circle cx="16" cy="16" r="13" fill={ring} opacity="0.16" />
      <circle cx="16" cy="16" r="8.6" fill={ring} opacity="0.3" />
      {perfect ? (
        <g>
          <path
            d="M16 4 L18.4 13.6 L28 16 L18.4 18.4 L16 28 L13.6 18.4 L4 16 L13.6 13.6 z"
            fill={core}
            stroke={ring}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </g>
      ) : (
        <circle cx="16" cy="16" r="6.2" fill={core} stroke={ring} strokeWidth="2" />
      )}
      <circle cx="13" cy="13" r="1.8" fill="#fff" opacity="0.9" />
    </motion.svg>
  )
}
