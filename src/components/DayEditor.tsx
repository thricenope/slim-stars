import { AnimatePresence, motion } from 'framer-motion'
import type { Amount, DayRecord, Drink, ExerciseId, TimeSlot } from '../types'
import {
  AMOUNT_OPTIONS, DRINK_OPTIONS, EXERCISE_OPTIONS, TIME_OPTIONS,
} from '../logic/scoring'
import { Icon, type IconName } from './Icon'

const TIME_ICON: Record<TimeSlot, IconName> = {
  skip: 'skip', '16': 'sun', '17': 'sunset', '18': 'dusk', '19': 'night', '20+': 'moon',
}
const AMOUNT_ICON: Record<Amount, IconName> = {
  tiny: 'bowl-tiny', light: 'bowl-light', ok: 'bowl-ok', much: 'bowl-much', alot: 'bowl-alot', tons: 'bowl-tons',
}
const DRINK_ICON: Record<Drink, IconName> = {
  none: 'drop-none', free: 'cup-free', small: 'cup-small', big: 'cup-big',
}
const EX_ICON: Record<ExerciseId, IconName> = {
  gym: 'gym', run: 'run', walk: 'walk', swim: 'swim', bike: 'bike', yoga: 'yoga', ball: 'ball', hiit: 'hiit',
}

export interface DayEditorProps {
  value: DayRecord
  onChange: (patch: Partial<DayRecord>) => void
}

/** 四组点选编辑器：时间 / 食量 / 饮料 / 运动 */
export const DayEditor = ({ value, onChange }: DayEditorProps) => {
  const toggleEx = (id: ExerciseId) => {
    const has = value.exercises.includes(id)
    onChange({
      exercises: has ? value.exercises.filter((e) => e !== id) : [...value.exercises, id],
    })
  }

  const timeHint = TIME_OPTIONS.find((o) => o.id === value.slot)?.hint
  const amtHint = AMOUNT_OPTIONS.find((o) => o.id === value.amount)?.hint
  const drinkHint = DRINK_OPTIONS.find((o) => o.id === value.drink)?.hint

  return (
    <div>
      <section className="sec">
        <div className="sec-head">
          <h2>几点吃的晚饭</h2>
          <span className="note">越早越赚</span>
        </div>
        <div className="chips">
          {TIME_OPTIONS.map((o) => (
            <motion.button
              key={o.id}
              type="button"
              className={`chip${value.slot === o.id ? ' on' : ''}`}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              aria-pressed={value.slot === o.id}
              onClick={() => onChange({ slot: o.id, ...(o.id === 'skip' ? { amount: null } : {}) })}
            >
              <Icon name={TIME_ICON[o.id]} size={20} />
              {o.label}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {timeHint && (
            <motion.p
              key={value.slot}
              className="chip-hint"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <b>{TIME_OPTIONS.find((o) => o.id === value.slot)!.label}</b> · {timeHint}
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {value.slot !== 'skip' && (
        <section className="sec">
          <div className="sec-head">
            <h2>吃了多少</h2>
            <span className="note">凭感觉选就行</span>
          </div>
          <div className="chips">
            {AMOUNT_OPTIONS.map((o) => (
              <motion.button
                key={o.id}
                type="button"
                className={`chip${value.amount === o.id ? ' on' : ''}`}
                whileTap={{ scale: 0.9 }}
                transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                aria-pressed={value.amount === o.id}
                onClick={() => onChange({ amount: o.id })}
              >
                <Icon name={AMOUNT_ICON[o.id]} size={20} />
                {o.label}
              </motion.button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            {amtHint && (
              <motion.p
                key={value.amount}
                className="chip-hint"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
              >
                <b>{AMOUNT_OPTIONS.find((o) => o.id === value.amount)!.label}</b> · {amtHint}
              </motion.p>
            )}
          </AnimatePresence>
        </section>
      )}

      <section className="sec">
        <div className="sec-head">
          <h2>喝了饮料吗</h2>
          <span className="note">奶茶也算</span>
        </div>
        <div className="chips">
          {DRINK_OPTIONS.map((o) => (
            <motion.button
              key={o.id}
              type="button"
              className={`chip mint${value.drink === o.id ? ' on' : ''}`}
              whileTap={{ scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 500, damping: 22 }}
              aria-pressed={value.drink === o.id}
              onClick={() => onChange({ drink: o.id })}
            >
              <Icon name={DRINK_ICON[o.id]} size={20} />
              {o.label}
            </motion.button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {drinkHint && (
            <motion.p
              key={value.drink}
              className="chip-hint"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
            >
              <b>{DRINK_OPTIONS.find((o) => o.id === value.drink)!.label}</b> · {drinkHint}
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      <section className="sec">
        <div className="sec-head">
          <h2>运动了吗</h2>
          <span className="note">点多选，加分的</span>
        </div>
        <div className="ex-grid">
          {EXERCISE_OPTIONS.map((o) => {
            const on = value.exercises.includes(o.id)
            return (
              <motion.button
                key={o.id}
                type="button"
                className={`ex-cell${on ? ' on' : ''}`}
                whileTap={{ scale: 0.86 }}
                whileHover={{ y: -2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                aria-pressed={on}
                onClick={() => toggleEx(o.id)}
              >
                <motion.span
                  key={on ? 'on' : 'off'}
                  initial={on ? { scale: 0.4, rotate: -30 } : false}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                  style={{ display: 'flex' }}
                >
                  <Icon name={EX_ICON[o.id]} size={26} />
                </motion.span>
                {o.label}
              </motion.button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
