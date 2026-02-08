import { useState, useMemo } from 'react'
import { useFund } from '../../context/FundContext'
import { DEFAULT_PROJECT_TASKS, DEFAULT_TEAM_MEMBERS, PHASE_COLORS, TASK_STATUSES } from '../../utils/projectData'
import GanttChart from './GanttChart'
import TaskBoard from './TaskBoard'
import TeamPanel from './TeamPanel'
import { exportProjectPDF, exportProjectCSV } from '../../utils/projectExport'
import { Download, BarChart3, LayoutList, Users as UsersIcon } from 'lucide-react'

export default function ProjectManagement() {
  const { state, dispatch } = useFund()
  const pm = state.fundData.projectManagement || {}
  const tasks = pm.tasks || DEFAULT_PROJECT_TASKS
  const team = pm.team || DEFAULT_TEAM_MEMBERS

  const [activeTab, setActiveTab] = useState('gantt')

  const updateTasks = (newTasks) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { tasks: newTasks } })
  }

  const updateTeam = (newTeam) => {
    dispatch({ type: 'UPDATE_PROJECT', payload: { team: newTeam } })
  }

  const updateTask = (taskId, updates) => {
    updateTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t))
  }

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length
    const complete = tasks.filter(t => t.status === 'complete').length
    const inProgress = tasks.filter(t => t.status === 'in_progress').length
    const blocked = tasks.filter(t => t.status === 'blocked').length
    const totalWeeks = Math.max(...tasks.map(t => t.startWeek + t.duration))
    const phases = [...new Set(tasks.map(t => t.phase))]
    return { total, complete, inProgress, blocked, totalWeeks, phases, progressPercent: total > 0 ? (complete / total) * 100 : 0 }
  }, [tasks])

  return (
    <div>
      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Tasks</div>
          <div className="metric-value">{stats.total}</div>
          <div className="metric-sub">{stats.phases.length} phases</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Completed</div>
          <div className="metric-value" style={{ color: 'var(--success)' }}>{stats.complete}</div>
          <div className="metric-sub">{stats.progressPercent.toFixed(0)}% done</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">In Progress</div>
          <div className="metric-value" style={{ color: 'var(--primary)' }}>{stats.inProgress}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Blocked</div>
          <div className="metric-value" style={{ color: stats.blocked > 0 ? 'var(--danger)' : 'var(--gray-400)' }}>{stats.blocked}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Timeline</div>
          <div className="metric-value">{stats.totalWeeks}w</div>
          <div className="metric-sub">~{Math.ceil(stats.totalWeeks / 4)} months</div>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="card">
        <div className="card-body" style={{ padding: '12px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 13, fontWeight: 500, whiteSpace: 'nowrap' }}>Overall Progress</span>
            <div className="progress-bar" style={{ flex: 1, height: 10 }}>
              <div className="progress-bar-fill success" style={{ width: `${stats.progressPercent}%` }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--success)', whiteSpace: 'nowrap' }}>
              {stats.complete}/{stats.total}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs + Export */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 0 }}>
        <div className="tabs" style={{ marginBottom: 0, flex: 1 }}>
          <button className={`tab ${activeTab === 'gantt' ? 'active' : ''}`} onClick={() => setActiveTab('gantt')}>
            <BarChart3 size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Timeline
          </button>
          <button className={`tab ${activeTab === 'board' ? 'active' : ''}`} onClick={() => setActiveTab('board')}>
            <LayoutList size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Task Board
          </button>
          <button className={`tab ${activeTab === 'team' ? 'active' : ''}`} onClick={() => setActiveTab('team')}>
            <UsersIcon size={14} style={{ marginRight: 6, verticalAlign: -2 }} /> Team
          </button>
        </div>
        <div style={{ display: 'flex', gap: 6, paddingBottom: 10 }}>
          <button className="btn btn-secondary btn-sm" onClick={() => exportProjectCSV(tasks, team)}>
            <Download size={13} /> CSV
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => exportProjectPDF(tasks, team, state.fundData)}>
            <Download size={13} /> PDF
          </button>
        </div>
      </div>

      {activeTab === 'gantt' && (
        <GanttChart tasks={tasks} team={team} updateTask={updateTask} />
      )}
      {activeTab === 'board' && (
        <TaskBoard tasks={tasks} team={team} updateTask={updateTask} updateTasks={updateTasks} />
      )}
      {activeTab === 'team' && (
        <TeamPanel tasks={tasks} team={team} updateTeam={updateTeam} updateTask={updateTask} />
      )}
    </div>
  )
}
