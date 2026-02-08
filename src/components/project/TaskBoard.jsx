import { useState } from 'react'
import { PHASE_COLORS, TASK_STATUSES } from '../../utils/projectData'
import { Plus, X, Edit2, Trash2, Clock, Link2, AlertCircle } from 'lucide-react'

export default function TaskBoard({ tasks, team, updateTask, updateTasks }) {
  const [filter, setFilter] = useState('all')
  const [ownerFilter, setOwnerFilter] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [form, setForm] = useState({ name: '', phase: 'Fund Structuring', owner: 'pm', startWeek: 1, duration: 2, dependencies: [] })

  const phases = [...new Set(tasks.map(t => t.phase))]

  const filteredTasks = tasks.filter(t => {
    if (filter !== 'all' && t.phase !== filter) return false
    if (ownerFilter !== 'all' && t.owner !== ownerFilter) return false
    return true
  })

  const getOwner = (ownerId) => team.find(m => m.id === ownerId)

  const openEdit = (task) => {
    setForm({ ...task })
    setEditingId(task.id)
    setShowAdd(true)
  }

  const openAdd = () => {
    setForm({ name: '', phase: filter !== 'all' ? filter : 'Fund Structuring', owner: 'pm', startWeek: 1, duration: 2, status: 'not_started', dependencies: [] })
    setEditingId(null)
    setShowAdd(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return
    if (editingId) {
      updateTask(editingId, form)
    } else {
      const newTask = { ...form, id: 't' + Date.now(), status: 'not_started' }
      updateTasks([...tasks, newTask])
    }
    setShowAdd(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Delete this task?')) {
      updateTasks(tasks.filter(t => t.id !== id))
    }
  }

  // Group by status for kanban view
  const columns = TASK_STATUSES.map(s => ({
    ...s,
    tasks: filteredTasks.filter(t => t.status === s.value),
  }))

  return (
    <div>
      {/* Filters */}
      <div className="card">
        <div className="card-body" style={{ padding: '10px 16px', display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)' }}>Phase:</span>
          <select className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--gray-300)' }}
            value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All Phases</option>
            {phases.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-500)', marginLeft: 8 }}>Owner:</span>
          <select className="btn btn-secondary btn-sm" style={{ border: '1px solid var(--gray-300)' }}
            value={ownerFilter} onChange={(e) => setOwnerFilter(e.target.value)}>
            <option value="all">All Owners</option>
            {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
          <button className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }} onClick={openAdd}>
            <Plus size={13} /> Add Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${TASK_STATUSES.length}, 1fr)`, gap: 12, marginTop: 16 }}>
        {columns.map((col) => (
          <div key={col.value}>
            <div style={{
              padding: '8px 12px', marginBottom: 8, borderRadius: 6,
              background: 'var(--gray-100)', fontSize: 12, fontWeight: 600,
              color: 'var(--gray-600)', display: 'flex', justifyContent: 'space-between',
            }}>
              <span>{col.label}</span>
              <span className={`badge ${col.color}`}>{col.tasks.length}</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minHeight: 100 }}>
              {col.tasks.map((task) => {
                const owner = getOwner(task.owner)
                return (
                  <div key={task.id} style={{
                    background: 'white', border: '1px solid var(--gray-200)',
                    borderRadius: 6, padding: 12, borderLeft: `3px solid ${PHASE_COLORS[task.phase] || 'var(--gray-300)'}`,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--gray-800)', marginBottom: 6 }}>
                      {task.status === 'blocked' && <AlertCircle size={12} style={{ color: 'var(--danger)', marginRight: 4, verticalAlign: -2 }} />}
                      {task.name}
                    </div>
                    <div style={{ fontSize: 11, color: PHASE_COLORS[task.phase], fontWeight: 500, marginBottom: 6 }}>
                      {task.phase}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        {owner && (
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            fontSize: 11, color: 'var(--gray-500)',
                          }}>
                            <span style={{
                              width: 18, height: 18, borderRadius: '50%',
                              background: owner.color, color: 'white',
                              fontSize: 8, fontWeight: 600, display: 'inline-flex',
                              alignItems: 'center', justifyContent: 'center',
                            }}>
                              {owner.name.split(' ').map(w => w[0]).join('').slice(0, 2)}
                            </span>
                            {owner.name}
                          </span>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <span style={{ fontSize: 10, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Clock size={10} /> {task.duration}w
                        </span>
                        {task.dependencies.length > 0 && (
                          <span style={{ fontSize: 10, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 2 }} title={`Depends on: ${task.dependencies.join(', ')}`}>
                            <Link2 size={10} /> {task.dependencies.length}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 4, marginTop: 8, borderTop: '1px solid var(--gray-100)', paddingTop: 8 }}>
                      <select
                        value={task.status}
                        onChange={(e) => updateTask(task.id, { status: e.target.value })}
                        style={{ flex: 1, fontSize: 11, padding: '2px 4px', border: '1px solid var(--gray-200)', borderRadius: 4, background: 'white', cursor: 'pointer' }}
                      >
                        {TASK_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                      <button onClick={() => openEdit(task)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: 'var(--gray-400)' }}>
                        <Edit2 size={12} />
                      </button>
                      <button onClick={() => handleDelete(task.id)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 2, color: 'var(--gray-400)' }}>
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Task' : 'Add Task'}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowAdd(false)}><X size={14} /></button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label>Task Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Describe the task..." />
                </div>
                <div className="form-group">
                  <label>Phase</label>
                  <select value={form.phase} onChange={(e) => setForm({ ...form, phase: e.target.value })}>
                    {Object.keys(PHASE_COLORS).map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Owner</label>
                  <select value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })}>
                    {team.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label>Start Week</label>
                    <input type="number" min={1} max={52} value={form.startWeek} onChange={(e) => setForm({ ...form, startWeek: Number(e.target.value) })} />
                  </div>
                  <div className="form-group">
                    <label>Duration (weeks)</label>
                    <input type="number" min={1} max={26} value={form.duration} onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })} />
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowAdd(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>{editingId ? 'Update' : 'Add Task'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
