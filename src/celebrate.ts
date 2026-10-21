import confetti from 'canvas-confetti'
import type { DayRecord } from './types'
import { isWin } from './logic/scoring'

const SIGNALS = ['#FFB454', '#3DDC97', '#E9EDFF', '#FFD98A', '#7EE8C9']

const reduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** 任务成功的小簇星火 */
export const burst = (origin = { x: 0.5, y: 0.45 }) => {
  if (reduced()) return
  confetti({
    particleCount: 70,
    spread: 75,
    startVelocity: 38,
    scalar: 0.9,
    ticks: 190,
    origin,
    colors: SIGNALS,
    shapes: ['star', 'circle'],
    disableForReducedMotion: true,
  })
}

/** 大成功：中央爆 + 两侧礼炮 */
export const bigCelebration = () => {
  if (reduced()) return
  confetti({
    particleCount: 120,
    spread: 100,
    startVelocity: 45,
    origin: { x: 0.5, y: 0.4 },
    colors: SIGNALS,
    shapes: ['star', 'circle'],
    disableForReducedMotion: true,
  })
  const end = Date.now() + 650
  const frame = () => {
    confetti({
      particleCount: 4,
      angle: 60,
      spread: 60,
      startVelocity: 52,
      origin: { x: 0, y: 0.75 },
      colors: SIGNALS,
      shapes: ['star', 'circle'],
      disableForReducedMotion: true,
    })
    confetti({
      particleCount: 4,
      angle: 120,
      spread: 60,
      startVelocity: 52,
      origin: { x: 1, y: 0.75 },
      colors: SIGNALS,
      shapes: ['star', 'circle'],
      disableForReducedMotion: true,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  requestAnimationFrame(frame)
}

/** 在某个元素位置炸开一簇 */
export const burstAt = (el: HTMLElement | null) => {
  if (!el || reduced()) return
  const rect = el.getBoundingClientRect()
  burst({
    x: (rect.left + rect.width / 2) / window.innerWidth,
    y: (rect.top + rect.height / 2) / window.innerHeight,
  })
}

/** 升空的小火箭：从按钮位置划一道尾迹飞出屏幕顶 */
export const launchFrom = (el: HTMLElement | null) => {
  if (!el || reduced()) return
  const rect = el.getBoundingClientRect()
  const x0 = rect.left + rect.width / 2
  const y0 = rect.top
  const rocket = document.createElement('div')
  rocket.className = 'launch-rocket'
  rocket.style.left = `${x0}px`
  rocket.style.top = `${y0}px`
  rocket.innerHTML =
    '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFB454" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2.5 c3.2 2 5 5.4 5 9 l-2.2 4.5 h-5.6 L7 11.5 c0 -3.6 1.8 -7 5 -9 z"/><path d="M12 10.5 a1.8 1.8 0 1 0 .01 0"/><path d="M9.2 16 L7.5 19 l3 -.8"/><path d="M14.8 16 L16.5 19 l-3 -.8"/></svg>'
  const trail = document.createElement('div')
  trail.className = 'launch-trail'
  trail.style.left = `${x0}px`
  trail.style.top = `${y0}px`
  document.body.appendChild(rocket)
  document.body.appendChild(trail)
  requestAnimationFrame(() => {
    rocket.style.transform = `translate(-50%, -${y0 + 140}px)`
    rocket.style.opacity = '0'
    trail.style.height = `${Math.min(y0, 300)}px`
    trail.style.opacity = '0'
  })
  setTimeout(() => {
    rocket.remove()
    trail.remove()
  }, 1200)
}

/** 任务是否值得发射动画 */
export const isLaunch = (r: DayRecord | undefined | null): boolean => isWin(r)
