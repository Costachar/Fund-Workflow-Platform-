import { useState } from 'react'
import { PHASE_COLORS, TASK_STATUSES } from '../../utils/projectData'
import { Plus, X, Edit2, Trash2, User } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'

const MEMBER_COLORS = ['#3b82f6', '#8b5cf6', '#ef4444', '#059669', '#d97706', '#0891b2', '#be185d', '#6366f1', '#4f46e5', '#0d9488']

export default function TeamPanel({ tasks, team, updateTeam, updateTask }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', role: '', color: '#3b82f6' })
  const [selectedMember, setSelectedMember] = useState(null)

  const openAdd = () => {
    setForm({ name: '', role: '', color: MEMBER_COLORS[team.length % MEMBER_COLORS.length] })
    setEditingId(null)
    setShowAdd(true)
  }

  const openEdit = (member) => {
    setForm({ ...member })
    setEditingId(member.id)
    setShowAdd(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingId) {
      updateTeam(team.map(m => m.id === editingId ? { ...m, ...form } : m))
    } else {
      updateTeam([...team, { ...form, id: 'tm_' + Date.now() }])
    }
    setShowAdd(false)
  }

  const handleDelete = (id) => {
    if (tasks.some(t => t.owner === id)) {
      alert('Cannot remove a team member with assigned tasks. Reassign their tasks first.')
      return
    }
    if (window.confirm('Remove this team member?')) {
      updateTeam(team.filter(m => m.id !== id))
    }
  }

  // Workload data
  const workloadData = team.map(m => {
    const memberTasks = tasks.filter(t => t.owner === m.id)
    const totalWeeks = memberTasks.reduce((sum, t) => sum + t.duration, 0)
    const complete = memberTasks.filter(t => t.status === 'complete').length
    const incomplete = memberTasks.length - complete
    return { ...m, taskCount: memberTasks.length, totalWeeks, complete, incomplete, tasks: memberTasks }
  }).sort((a, b) => b.totalWeeks - a.totalWeeks)

  // Phase distribution for selected member
  const selectedMemberData = selectedMember ? (() => {
    const member = team.find(m => m.id === selectedMember)
    const memberTasks = tasks.filter(t => t.owner === selectedMember)
    const phaseBreakdown = {}
    memberTasks.forEach(t => {
      if (!phaseBreakdown[t.phase]) phaseBreakdown[t.phase] = { phase: t.phase, count: 0, weeks: 0 }
      phaseBreakdown[t.phase].count++
      phaseBreakdown[t.phase].weeks += t.duration
    })
    return { member, tasks: memberTasks, phases: Object.values(phaseBreakdown) }
  })() : null

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: selectedMember ? '2fr 1fr' : '1fr', gap: 20 }}>
        <div>
          {/* Workload Chart */}
          <div className="card">
            <div className="card-header">
              <h3>Team Workload (weeks)</h3>
              <button className="btn btn-primary btn-sm" onClick={openAdd}>
                <Plus size={13} /> Add Member
              </button>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={Math.max(200, team.length * 40)}>
                <BarChart data={workloadData} layout="vertical" margin={{ left: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" label={{ value: 'Weeks', position: 'insideBottom', offset: -5 }} />
                  <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(v) => `${v} weeks`} />
                  <Bar dataKey="totalWeeks" name="Total Weeks" radius={[0, 4, 4, 0]}>
                    {workloadData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} opacity={0.8} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Team Table */}
          <div className="card">
            <div className="card-header"><h3>Team Members</h3></div>
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Member</th>
                    <th>Role</th>
                    <th style={{ textAlign: 'center' }}>Tasks</th>
                    <th style={{ textAlign: 'center' }}>Weeks</th>
                    <th style={{ textAlign: 'center' }}>Complete</th>
                    <th style={{ textAlign: 'center' }}>Progress</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {workloadData.map((m) => {
                    const progressPercent = m.taskCount > 0 ? (m.complete / m.taskCount) * 100 : 0
                    return (
                      <tr key={m.id}
                        style={{ cursor: 'pointer', background: selectedMember === m.id ? 'var(--primary-50)' : undefined }}
                        onClick={() => setSelectedMember(selectedMember === m.id ? null : m.id)}
                      >
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{
                              width: 28, height: 28, borderRadius: '50%',
                              background: m.color, color: 'white',
                              fontSize: 10, fontWeight: 600, display: 'inline-flex',
                              alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                              {m.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </span>
                            <span style={{ fontWeight: 500 }}>{m.name}</span>
                          </div>
                        </td>
                        <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{m.role}</td>
                        <td style={{ textAlign: 'center' }}>{m.taskCount}</td>
                        <td style={{ textAlign: 'center' }}>{m.totalWeeks}</td>
                        <td style={{ textAlign: 'center' }}>
                          <span style={{ color: 'var(--success)', fontWeight: 500 }}>{m.complete}</span>
                          <span style={{ color: 'var(--gray-400)' }}>/{m.taskCount}</span>
                        </td>
                        <td style={{ textAlign: 'center', width: 120 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div className="progress-bar" style={{ flex: 1, height: 6 }}>
                              <div className="progress-bar-fill success" style={{ width: `${progressPercent}%` }} />
                            </div>
                            <span style={{ fontSize: 11, color: 'var(--gray-500)', width: 30 }}>{progressPercent.toFixed(0)}%</span>
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(m)}><Edit2 size={12} /></button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(m.id)}><Trash2 size={12} /></button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Selected Member Detail */}
        {selectedMemberData && (
          <div>
            <div className="card">
              <div className="card-header">
                <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: selectedMemberData.member.color, color: 'white',
                    fontSize: 9, fontWeight: 600, display: 'inline-flex',
                    alignItems: 'center', justifyContent: 'center',
                  }}>
                    {selectedMemberData.member.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                  </span>
                  {selectedMemberData.member.name}
                </h3>
                <button className="btn btn-secondary btn-sm" onClick={() => setSelectedMember(null)}><X size={14} /></button>
              </div>
              <div className="card-body">
                <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 16 }}>{selectedMemberData.member.role}</div>

                {/* Phase breakdown pie */}
                {selectedMemberData.phases.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>WORKLOAD BY PHASE</div>
                    <ResponsiveContainer width="100%" height={160}>
                      <PieChart>
                        <Pie
                          data={selectedMemberData.phases}
                          dataKey="weeks"
                          nameKey="phase"
                          cx="50%" cy="50%"
                          outerRadius={60}
                          label={({ phase, weeks }) => `${weeks}w`}
                        >
                          {selectedMemberData.phases.map((entry, i) => (
                            <Cell key={i} fill={PHASE_COLORS[entry.phase] || '#888'} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(v) => `${v} weeks`} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* Task list */}
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginBottom: 8 }}>ASSIGNED TASKS</div>
                {selectedMemberData.tasks.map(task => {
                  const statusObj = TASK_STATUSES.find(s => s.value === task.status)
                  return (
                    <div key={task.id} style={{
                      padding: '8px 0', borderBottom: '1px solid var(--gray-100)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{task.name}</div>
                        <div style={{ fontSize: 11, color: PHASE_COLORS[task.phase] }}>{task.phase} - W{task.startWeek} ({task.duration}w)</div>
                      </div>
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value })}
                        style={{ fontSize: 10, padding: '2px 4px', border: '1px solid var(--gray-200)', borderRadius: 4 }}
                      >
                        {TASK_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Team Member' : 'Add Team Member'}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowAdd(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label>Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., Jane Smith" />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="e.g., Legal Counsel" />
                </div>
                <div className="form-group">
                  <label>Color</label>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {MEMBER_COLORS.map(c => (
                      <button
                        key={c}
                        onClick={() => setForm({ ...form, color: c })}
                        style={{
                          width: 28, height: 28, borderRadius: '50%', background: c, border: form.color === c ? '3px solid var(--gray-900)' : '3px solid transparent',
                          cursor: 'pointer',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Update' : 'Add Member'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
