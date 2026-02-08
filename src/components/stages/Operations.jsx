import { useState } from 'react'
import { useFund } from '../../context/FundContext'
import { FileText, Calendar, Plus, Check, Trash2, X } from 'lucide-react'

const DEFAULT_CALENDAR = [
  { id: '1', title: 'Quarterly NAV Report', frequency: 'Quarterly', nextDue: '2026-03-31', category: 'Reporting' },
  { id: '2', title: 'Annual Financial Statements', frequency: 'Annual', nextDue: '2026-09-30', category: 'Reporting' },
  { id: '3', title: 'Annual Audit', frequency: 'Annual', nextDue: '2026-09-30', category: 'Compliance' },
  { id: '4', title: 'AFSL Annual Statement', frequency: 'Annual', nextDue: '2026-06-30', category: 'Regulatory' },
  { id: '5', title: 'FATCA/CRS Reporting', frequency: 'Annual', nextDue: '2026-07-31', category: 'Tax' },
  { id: '6', title: 'AML/CTF Program Review', frequency: 'Annual', nextDue: '2026-12-31', category: 'Compliance' },
  { id: '7', title: 'Insurance Renewal', frequency: 'Annual', nextDue: '2026-12-31', category: 'Operational' },
  { id: '8', title: 'Investor Update', frequency: 'Quarterly', nextDue: '2026-03-31', category: 'Reporting' },
]

export default function Operations() {
  const { state, dispatch } = useFund()
  const { operations } = state.fundData
  const [activeTab, setActiveTab] = useState('calendar')
  const [calendar, setCalendar] = useState(operations.complianceCalendar?.length > 0 ? operations.complianceCalendar : DEFAULT_CALENDAR)
  const [showAddEvent, setShowAddEvent] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', frequency: 'Quarterly', nextDue: '', category: 'Reporting' })

  const [docs, setDocs] = useState(operations.documents || [])
  const [showAddDoc, setShowAddDoc] = useState(false)
  const [newDoc, setNewDoc] = useState({ name: '', version: '1.0', status: 'Current', notes: '' })

  const saveCalendar = (updated) => {
    setCalendar(updated)
    dispatch({ type: 'UPDATE_OPERATIONS', payload: { complianceCalendar: updated } })
  }

  const addEvent = () => {
    if (!newEvent.title) return
    const updated = [...calendar, { ...newEvent, id: Date.now().toString() }]
    saveCalendar(updated)
    setShowAddEvent(false)
    setNewEvent({ title: '', frequency: 'Quarterly', nextDue: '', category: 'Reporting' })
  }

  const removeEvent = (id) => {
    saveCalendar(calendar.filter(e => e.id !== id))
  }

  const saveDocs = (updated) => {
    setDocs(updated)
    dispatch({ type: 'UPDATE_OPERATIONS', payload: { documents: updated } })
  }

  const addDoc = () => {
    if (!newDoc.name) return
    const updated = [...docs, { ...newDoc, id: Date.now().toString(), createdAt: new Date().toISOString() }]
    saveDocs(updated)
    setShowAddDoc(false)
    setNewDoc({ name: '', version: '1.0', status: 'Current', notes: '' })
  }

  const removeDoc = (id) => {
    saveDocs(docs.filter(d => d.id !== id))
  }

  const sortedCalendar = [...calendar].sort((a, b) => (a.nextDue || '').localeCompare(b.nextDue || ''))
  const categories = [...new Set(calendar.map(e => e.category))]

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${activeTab === 'calendar' ? 'active' : ''}`} onClick={() => setActiveTab('calendar')}>
          Compliance Calendar
        </button>
        <button className={`tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
          Document Repository
        </button>
      </div>

      {activeTab === 'calendar' && (
        <div>
          {/* Summary by Category */}
          <div className="metrics-grid">
            {categories.map(cat => (
              <div key={cat} className="metric-card">
                <div className="metric-label">{cat}</div>
                <div className="metric-value">{calendar.filter(e => e.category === cat).length}</div>
                <div className="metric-sub">upcoming items</div>
              </div>
            ))}
          </div>

          <div className="card">
            <div className="card-header">
              <h3>Compliance Calendar</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-primary btn-sm" onClick={() => setShowAddEvent(true)}>
                  <Plus size={14} /> Add Event
                </button>
                <button className="btn btn-success btn-sm" onClick={() => dispatch({ type: 'MARK_STAGE_COMPLETE', payload: 4 })}>
                  <Check size={14} /> Mark Complete
                </button>
              </div>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Category</th>
                    <th>Frequency</th>
                    <th>Next Due</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedCalendar.map((event) => (
                    <tr key={event.id}>
                      <td style={{ fontWeight: 500 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <Calendar size={14} style={{ color: 'var(--gray-400)' }} />
                          {event.title}
                        </div>
                      </td>
                      <td><span className="badge badge-blue">{event.category}</span></td>
                      <td>{event.frequency}</td>
                      <td>{event.nextDue || '-'}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => removeEvent(event.id)}>
                          <Trash2 size={12} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Event Modal */}
          {showAddEvent && (
            <div className="modal-overlay" onClick={() => setShowAddEvent(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add Calendar Event</h3>
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowAddEvent(false)}><X size={14} /></button>
                </div>
                <div className="modal-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="form-group">
                      <label>Event Title</label>
                      <input value={newEvent.title} onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })} placeholder="e.g., Quarterly compliance review" />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={newEvent.category} onChange={(e) => setNewEvent({ ...newEvent, category: e.target.value })}>
                        <option>Reporting</option>
                        <option>Compliance</option>
                        <option>Regulatory</option>
                        <option>Tax</option>
                        <option>Operational</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Frequency</label>
                      <select value={newEvent.frequency} onChange={(e) => setNewEvent({ ...newEvent, frequency: e.target.value })}>
                        <option>Monthly</option>
                        <option>Quarterly</option>
                        <option>Semi-Annual</option>
                        <option>Annual</option>
                        <option>One-off</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Next Due Date</label>
                      <input type="date" value={newEvent.nextDue} onChange={(e) => setNewEvent({ ...newEvent, nextDue: e.target.value })} />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddEvent(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={addEvent}>Add Event</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'documents' && (
        <div>
          <div className="card">
            <div className="card-header">
              <h3>Document Repository</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowAddDoc(true)}>
                <Plus size={14} /> Add Document
              </button>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              {docs.length === 0 ? (
                <div className="empty-state">
                  <FileText size={40} style={{ opacity: 0.3 }} />
                  <h3>No documents uploaded</h3>
                  <p>Track PDS/TMD updates and other operational documents here.</p>
                  <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => setShowAddDoc(true)}>
                    <Plus size={16} /> Add Document
                  </button>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Document</th>
                      <th>Version</th>
                      <th>Status</th>
                      <th>Notes</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((doc) => (
                      <tr key={doc.id}>
                        <td style={{ fontWeight: 500 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <FileText size={14} style={{ color: 'var(--gray-400)' }} />
                            {doc.name}
                          </div>
                        </td>
                        <td>{doc.version}</td>
                        <td>
                          <span className={`badge ${doc.status === 'Current' ? 'badge-green' : doc.status === 'Draft' ? 'badge-yellow' : 'badge-gray'}`}>
                            {doc.status}
                          </span>
                        </td>
                        <td style={{ fontSize: 13 }}>{doc.notes}</td>
                        <td>
                          <button className="btn btn-danger btn-sm" onClick={() => removeDoc(doc.id)}>
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Add Doc Modal */}
          {showAddDoc && (
            <div className="modal-overlay" onClick={() => setShowAddDoc(false)}>
              <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Add Document</h3>
                  <button className="btn btn-sm btn-secondary" onClick={() => setShowAddDoc(false)}><X size={14} /></button>
                </div>
                <div className="modal-body">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <div className="form-group">
                      <label>Document Name</label>
                      <input value={newDoc.name} onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })} placeholder="e.g., Product Disclosure Statement" />
                    </div>
                    <div className="form-group">
                      <label>Version</label>
                      <input value={newDoc.version} onChange={(e) => setNewDoc({ ...newDoc, version: e.target.value })} placeholder="e.g., 1.0" />
                    </div>
                    <div className="form-group">
                      <label>Status</label>
                      <select value={newDoc.status} onChange={(e) => setNewDoc({ ...newDoc, status: e.target.value })}>
                        <option>Current</option>
                        <option>Draft</option>
                        <option>Superseded</option>
                        <option>Archived</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Notes</label>
                      <textarea value={newDoc.notes} onChange={(e) => setNewDoc({ ...newDoc, notes: e.target.value })} placeholder="Notes about this version..." />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowAddDoc(false)}>Cancel</button>
                  <button className="btn btn-primary" onClick={addDoc}>Add Document</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
