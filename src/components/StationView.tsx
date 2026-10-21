import { useMemo, useRef, useState } from 'react'
import { useGame, useStats } from '../store'
import { monthDays, recentDays } from '../logic/stats'
import { today } from '../logic/dates'
import { Icon } from './Icon'

const WIN_LINE_PCT = ((2 + 8) / 16) * 100 // 成功线（≥2 分）高度位置

export const StationView = () => {
  const stats = useStats()
  const records = useGame((s) => s.records)
  const importData = useGame((s) => s.importData)
  const resetAll = useGame((s) => s.resetAll)
  const fileRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')

  const bars = useMemo(() => recentDays(records, 14), [records])
  const now = new Date()
  const strip = useMemo(
    () => monthDays(now.getFullYear(), now.getMonth(), records),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [records],
  )

  const doExport = () => {
    const blob = new Blob([JSON.stringify({ app: 'slim-stars', version: 1, records }, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `slim-stars-${today()}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg('遥测数据已导出')
    setTimeout(() => setMsg(''), 2500)
  }

  const doImport = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        importData(JSON.parse(String(reader.result)))
        setMsg('导入成功，任务数据已重算')
      } catch (e) {
        setMsg(e instanceof Error ? `导入失败：${e.message}` : '导入失败：文件格式不对')
      }
      setTimeout(() => setMsg(''), 3000)
    }
    reader.readAsText(file)
  }

  if (stats.totalDays === 0) {
    return (
      <div>
        <div className="card guide-card">
          <div className="g-title">地面站还没有数据</div>
          <p style={{ margin: '4px 0 0', color: 'var(--ink-2)', fontSize: 13.5 }}>
            先去「今夜」执行第一个任务，这里就会出现你的飞行日志、成功率和最长连飞纪录。
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="big-nums">
        <div className="big-num hero">
          <Icon name="rocket" size={42} style={{ color: 'var(--amber)' }} />
          <div>
            <div className="n">{stats.dayNumber}</div>
            <div className="l">
              任务第 <b>{stats.dayNumber}</b> 天 · 自 {stats.firstDate} 启程
            </div>
          </div>
        </div>
        <div className="big-num">
          <div className="n" style={{ color: 'var(--green)' }}>{stats.winDays}</div>
          <div className="l">成功夜</div>
        </div>
        <div className="big-num">
          <div className="n">{Math.round(stats.rate * 100)}<span style={{ fontSize: 14 }}>%</span></div>
          <div className="l">成功率</div>
        </div>
        <div className="big-num">
          <div className="n" style={{ color: 'var(--amber)' }}>{stats.curStreak}</div>
          <div className="l">当前连飞</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.maxStreak}</div>
          <div className="l">最长连飞</div>
        </div>
        <div className="big-num">
          <div className="n" style={{ color: 'var(--amber)' }}>{stats.perfectDays}</div>
          <div className="l">完美夜</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.exerciseCount}</div>
          <div className="l">运动次数</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.weekendPairs}</div>
          <div className="l">周末双任务</div>
        </div>
        <div className="big-num">
          <div className="n">{stats.earlyDinners}</div>
          <div className="l">早吃天数</div>
        </div>
      </div>

      <div className="sec-head">
        <h2>近 14 夜遥测</h2>
        <span className="note">虚线为成功线</span>
      </div>
      <div className="card">
        <div className="bars">
          {bars.map((b) => {
            const h = Math.max(3, ((Math.max(-8, Math.min(8, b.score)) + 8) / 16) * 100)
            const cls = b.score > 0 ? 'pos' : b.score < 0 ? 'neg' : 'zero'
            return (
              <div key={b.date} className={`bar-col${b.date === today() ? ' today-bar' : ''}`}>
                <span className="win-line" style={{ bottom: `${WIN_LINE_PCT}%` }} />
                <div className={`bar ${cls}`} style={{ height: `${h}%` }} title={`${b.date} ${b.score} 分`} />
              </div>
            )
          })}
        </div>
        <div className="bar-labels">
          {bars.filter((_, i) => i % 2 === 0).map((b) => (
            <span key={b.date}>{Number(b.date.slice(8))}</span>
          ))}
        </div>
      </div>

      <div className="sec-head">
        <h2>本月星图密度</h2>
        <span className="note">每格一夜</span>
      </div>
      <div className="card">
        <div className="month-strip">
          {strip.map((d) => (
            <span
              key={d.date}
              className={`ms-cell ${d.verdict === 'pending' ? '' : d.verdict === 'perfect' ? 'perfect' : d.win ? 'win' : d.verdict === 'fail' ? 'fail' : ''}${d.date === today() ? ' today' : ''}`}
              title={`${d.date} ${d.verdict === 'pending' ? '未执行' : d.score + ' 分'}`}
            />
          ))}
        </div>
        <div className="legend" style={{ marginTop: 10 }}>
          <span className="li"><span className="ms-cell perfect" style={{ width: 12, height: 12 }} /> 完美</span>
          <span className="li"><span className="ms-cell win" style={{ width: 12, height: 12 }} /> 成功</span>
          <span className="li"><span className="ms-cell fail" style={{ width: 12, height: 12 }} /> 偏航</span>
          <span className="li"><span className="ms-cell" style={{ width: 12, height: 12 }} /> 未执行</span>
        </div>
      </div>

      <div className="sec-head">
        <h2>数据下行 / 恢复</h2>
        <span className="note">都存在这台设备上</span>
      </div>
      <div className="card">
        <div className="data-btns">
          <button type="button" className="cta ghost" onClick={doExport}>
            <Icon name="download" size={17} /> 导出备份
          </button>
          <button type="button" className="cta ghost" onClick={() => fileRef.current?.click()}>
            <Icon name="upload" size={17} /> 导入恢复
          </button>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          style={{ display: 'none' }}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) doImport(f)
            e.target.value = ''
          }}
        />
        {msg && <p className="empty-tip" style={{ color: 'var(--green)' }}>{msg}</p>}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            className="ghost-link"
            onClick={() => {
              if (window.confirm('清空全部任务数据？此操作不可恢复（建议先导出备份）') && window.confirm('真的全部清空吗？')) {
                resetAll()
              }
            }}
          >
            <Icon name="trash" size={14} /> 清空所有数据
          </button>
        </div>
      </div>
    </div>
  )
}
