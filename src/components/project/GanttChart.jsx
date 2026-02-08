import { useState, useMemo } from 'react'
import { PHASE_COLORS, TASK_STATUSES } from '../../utils/projectData'
import { ChevronDown, ChevronRight, AlertCircle } from 'lucide-react'

const WEEK_WIDTH = 36
const ROW_HEIGHT = 36

export default function GanttChart({ tasks, team, updateTask }) {
  const [collapsedPhases, setCollapsedPhases] = useState({})
  const [hoveredTask, setHoveredTask] = useState(null)
  const [editingTask, setEditingTask] = useState(null)

  const totalWeeks = Math.max(...tasks.map(t => t.startWeek + t.duration), 24)
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1)
  const months = useMemo(() => {
    const m = []
    for (let w = 1; w <= totalWeeks; w += 4) {
      m.push({ label: `Month ${Math.ceil(w / 4)}`, startWeek: w, weeks: Math.min(4, totalWeeks - w + 1) })
    }
    return m
  }, [totalWeeks])

  const phases = useMemo(() => {
    const phaseMap = {}
    tasks.forEach(t => {
      if (!phaseMap[t.phase]) phaseMap[t.phase] = []
      phaseMap[t.phase].push(t)
    })
    return Object.entries(phaseMap)
  }, [tasks])

  const togglePhase = (phase) => {
    setCollapsedPhases(prev => ({ ...prev, [phase]: !prev[phase] }))
  }

  const getOwner = (ownerId) => team.find(m => m.id === ownerId)

  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'var(--success)'
      case 'in_progress': return 'var(--primary-light)'
      case 'blocked': return 'var(--danger)'
      case 'review': return 'var(--warning)'
      default: return 'var(--gray-300)'
    }
  }

  const getBarColor = (task) => {
    if (task.status === 'complete') return 'var(--success)'
    if (task.status === 'blocked') return 'var(--danger)'
    return PHASE_COLORS[task.phase] || 'var(--primary)'
  }

  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <div className="gantt-wrapper" style={{ overflow: 'auto', maxHeight: 'calc(100vh - 340px)' }}>
        <div style={{ display: 'flex', minWidth: WEEK_WIDTH * totalWeeks + 340 }}>
          {/* Left panel - task list */}
          <div style={{ width: 340, flexShrink: 0, borderRight: '2px solid var(--gray-200)', background: 'white', position: 'sticky', left: 0, zIndex: 5 }}>
            {/* Header */}
            <div style={{ display: 'flex', height: 28, borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
              <div style={{ flex: 1, padding: '4px 12px', fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase' }}>Task</div>
              <div style={{ width: 80, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', textAlign: 'center' }}>Owner</div>
              <div style={{ width: 70, padding: '4px 8px', fontSize: 11, fontWeight: 600, color: 'var(--gray-500)', textTransform: 'uppercase', textAlign: 'center' }}>Status</div>
            </div>
            {/* Months row spacer */}
            <div style={{ height: 24, borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }} />

            {/* Tasks */}
            {phases.map(([phase, phaseTasks]) => (
              <div key={phase}>
                {/* Phase header */}
                <div
                  onClick={() => togglePhase(phase)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 12px',
                    height: ROW_HEIGHT, cursor: 'pointer', background: 'var(--gray-50)',
                    borderBottom: '1px solid var(--gray-200)', fontWeight: 600, fontSize: 12,
                    color: PHASE_COLORS[phase] || 'var(--gray-700)',
                  }}
                >
                  {collapsedPhases[phase] ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
                  <span style={{ width: 10, height: 10, borderRadius: 2, background: PHASE_COLORS[phase], flexShrink: 0 }} />
                  {phase}
                  <span style={{ marginLeft: 'auto', fontSize: 11, fontWeight: 500, color: 'var(--gray-400)' }}>
                    {phaseTasks.filter(t => t.status === 'complete').length}/{phaseTasks.length}
                  </span>
                </div>

                {!collapsedPhases[phase] && phaseTasks.map((task) => {
                  const owner = getOwner(task.owner)
                  const statusObj = TASK_STATUSES.find(s => s.value === task.status)
                  return (
                    <div
                      key={task.id}
                      style={{
                        display: 'flex', alignItems: 'center', height: ROW_HEIGHT,
                        borderBottom: '1px solid var(--gray-100)',
                        background: hoveredTask === task.id ? 'var(--primary-50)' : 'white',
                      }}
                      onMouseEnter={() => setHoveredTask(task.id)}
                      onMouseLeave={() => setHoveredTask(null)}
                    >
                      <div style={{ flex: 1, padding: '0 12px 0 28px', fontSize: 12, color: 'var(--gray-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        title={task.name}
                      >
                        {task.status === 'blocked' && <AlertCircle size={12} style={{ color: 'var(--danger)', marginRight: 4, verticalAlign: -2 }} />}
                        {task.name}
                      </div>
                      <div style={{ width: 80, textAlign: 'center' }}>
                        {owner && (
                          <span style={{
                            display: 'inline-block', width: 22, height: 22, borderRadius: '50%',
                            background: owner.color, color: 'white', fontSize: 9, fontWeight: 600,
                            lineHeight: '22px', textAlign: 'center',
                          }} title={owner.name}>
                            {owner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                          </span>
                        )}
                      </div>
                      <div style={{ width: 70, textAlign: 'center' }}>
                        <select
                          value={task.status}
                          onChange={(e) => updateTask(task.id, { status: e.target.value })}
                          style={{
                            fontSize: 10, padding: '1px 2px', border: '1px solid var(--gray-200)',
                            borderRadius: 4, background: 'white', color: getStatusColor(task.status),
                            fontWeight: 600, cursor: 'pointer', width: 62,
                          }}
                        >
                          {TASK_STATUSES.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Right panel - Gantt bars */}
          <div style={{ flex: 1 }}>
            {/* Week headers */}
            <div style={{ display: 'flex', height: 28, borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
              {weeks.map(w => (
                <div key={w} style={{
                  width: WEEK_WIDTH, flexShrink: 0, textAlign: 'center',
                  fontSize: 10, color: 'var(--gray-400)', lineHeight: '28px',
                  borderRight: '1px solid var(--gray-100)',
                }}>
                  W{w}
                </div>
              ))}
            </div>
            {/* Month headers */}
            <div style={{ display: 'flex', height: 24, borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
              {months.map((m, i) => (
                <div key={i} style={{
                  width: m.weeks * WEEK_WIDTH, flexShrink: 0, textAlign: 'center',
                  fontSize: 11, fontWeight: 600, color: 'var(--gray-600)', lineHeight: '24px',
                  borderRight: '1px solid var(--gray-200)',
                }}>
                  {m.label}
                </div>
              ))}
            </div>

            {/* Bars */}
            {phases.map(([phase, phaseTasks]) => (
              <div key={phase}>
                {/* Phase summary bar */}
                <div style={{ height: ROW_HEIGHT, position: 'relative', borderBottom: '1px solid var(--gray-200)', background: 'var(--gray-50)' }}>
                  {(() => {
                    const minW = Math.min(...phaseTasks.map(t => t.startWeek))
                    const maxW = Math.max(...phaseTasks.map(t => t.startWeek + t.duration))
                    return (
                      <div style={{
                        position: 'absolute', top: 12, height: 12, borderRadius: 6,
                        left: (minW - 1) * WEEK_WIDTH + 4,
                        width: (maxW - minW) * WEEK_WIDTH - 8,
                        background: PHASE_COLORS[phase], opacity: 0.2,
                      }} />
                    )
                  })()}
                </div>

                {!collapsedPhases[phase] && phaseTasks.map((task) => (
                  <div
                    key={task.id}
                    style={{
                      height: ROW_HEIGHT, position: 'relative',
                      borderBottom: '1px solid var(--gray-100)',
                      background: hoveredTask === task.id ? 'var(--primary-50)' : 'white',
                    }}
                    onMouseEnter={() => setHoveredTask(task.id)}
                    onMouseLeave={() => setHoveredTask(null)}
                  >
                    {/* Grid lines */}
                    {weeks.map(w => (
                      <div key={w} style={{
                        position: 'absolute', left: (w - 1) * WEEK_WIDTH, top: 0, bottom: 0,
                        width: 1, background: w % 4 === 0 ? 'var(--gray-200)' : 'var(--gray-100)',
                      }} />
                    ))}

                    {/* Dependency lines */}
                    {task.dependencies?.map(depId => {
                      const dep = tasks.find(t => t.id === depId)
                      if (!dep) return null
                      const depEnd = (dep.startWeek + dep.duration - 1) * WEEK_WIDTH + WEEK_WIDTH / 2
                      const taskStart = (task.startWeek - 1) * WEEK_WIDTH
                      return (
                        <div key={depId} style={{
                          position: 'absolute', top: ROW_HEIGHT / 2, height: 1,
                          left: depEnd, width: Math.max(0, taskStart - depEnd),
                          borderBottom: '1px dashed var(--gray-300)',
                        }} />
                      )
                    })}

                    {/* Task bar */}
                    <div
                      onClick={() => setEditingTask(editingTask === task.id ? null : task.id)}
                      style={{
                        position: 'absolute',
                        left: (task.startWeek - 1) * WEEK_WIDTH + 2,
                        width: task.duration * WEEK_WIDTH - 4,
                        top: 7, height: ROW_HEIGHT - 14,
                        borderRadius: 4,
                        background: getBarColor(task),
                        opacity: task.status === 'not_started' ? 0.5 : task.status === 'complete' ? 0.8 : 1,
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', paddingLeft: 6,
                        transition: 'opacity 0.15s',
                      }}
                      title={`${task.name}\n${task.duration} weeks (W${task.startWeek}-W${task.startWeek + task.duration - 1})`}
                    >
                      {task.duration >= 2 && (
                        <span style={{ fontSize: 10, color: 'white', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {task.duration}w
                        </span>
                      )}
                      {task.status === 'complete' && (
                        <span style={{ marginLeft: 'auto', marginRight: 4, fontSize: 10, color: 'white' }}>&#10003;</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Task detail popover */}
      {editingTask && (() => {
        const task = tasks.find(t => t.id === editingTask)
        if (!task) return null
        const owner = getOwner(task.owner)
        return (
          <div style={{ borderTop: '1px solid var(--gray-200)', padding: 16, background: 'var(--gray-50)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{task.name}</h4>
                <span style={{ fontSize: 12, color: PHASE_COLORS[task.phase], fontWeight: 500 }}>{task.phase}</span>
              </div>
              <button className="btn btn-secondary btn-sm" onClick={() => setEditingTask(null)}>Close</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              <div className="form-group">
                <label>Owner</label>
                <select value={task.owner} onChange={(e) => updateTask(task.id, { owner: e.target.value })}>
                  {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={task.status} onChange={(e) => updateTask(task.id, { status: e.target.value })}>
                  {TASK_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Start Week</label>
                <input type="number" min={1} max={52} value={task.startWeek} onChange={(e) => updateTask(task.id, { startWeek: Number(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Duration (weeks)</label>
                <input type="number" min={1} max={26} value={task.duration} onChange={(e) => updateTask(task.id, { duration: Number(e.target.value) })} />
              </div>
            </div>
            {task.dependencies.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: 'var(--gray-500)' }}>
                Dependencies: {task.dependencies.map(d => tasks.find(t => t.id === d)?.name || d).join(', ')}
              </div>
            )}
          </div>
        )
      })()}

      {/* Legend */}
      <div style={{ padding: '12px 20px', borderTop: '1px solid var(--gray-200)', display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 11, color: 'var(--gray-500)' }}>
        {Object.entries(PHASE_COLORS).map(([phase, color]) => (
          <div key={phase} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
            {phase}
          </div>
        ))}
      </div>
    </div>
  )
}
