import { useState } from 'react'
import { useFund } from '../../context/FundContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { Plus, Edit2, Trash2, X, Check, Users } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const STATUSES = [
  { value: 'initial_contact', label: 'Initial Contact', color: 'badge-gray' },
  { value: 'nda_signed', label: 'NDA Signed', color: 'badge-blue' },
  { value: 'diligence', label: 'Due Diligence', color: 'badge-yellow' },
  { value: 'committed', label: 'Committed', color: 'badge-green' },
  { value: 'declined', label: 'Declined', color: 'badge-red' },
]

const STATUS_COLORS = {
  initial_contact: '#9ca3af',
  nda_signed: '#3b82f6',
  diligence: '#d97706',
  committed: '#059669',
  declined: '#dc2626',
}

export default function Fundraising() {
  const { state, dispatch } = useFund()
  const { fundraising, ideation } = state.fundData
  const [showModal, setShowModal] = useState(false)
  const [editingInvestor, setEditingInvestor] = useState(null)
  const [form, setForm] = useState({ name: '', type: '', amount: '', status: 'initial_contact', contact: '', notes: '' })

  const investors = fundraising.investors || []
  const totalCommitted = investors.reduce((sum, inv) => inv.status === 'committed' ? sum + (Number(inv.amount) || 0) : sum, 0)
  const totalPipeline = investors.reduce((sum, inv) => inv.status !== 'declined' ? sum + (Number(inv.amount) || 0) : sum, 0)
  const targetSize = ideation.fundSize || 100000000
  const progressPercent = Math.min((totalCommitted / targetSize) * 100, 100)

  const statusCounts = STATUSES.map(s => ({
    name: s.label,
    count: investors.filter(inv => inv.status === s.value).length,
    amount: investors.filter(inv => inv.status === s.value).reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0),
    fill: STATUS_COLORS[s.value],
  }))

  const openAdd = () => {
    setForm({ name: '', type: 'Institutional', amount: '', status: 'initial_contact', contact: '', notes: '' })
    setEditingInvestor(null)
    setShowModal(true)
  }

  const openEdit = (investor) => {
    setForm({ ...investor })
    setEditingInvestor(investor.id)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name) return
    if (editingInvestor) {
      dispatch({ type: 'UPDATE_INVESTOR', payload: { ...form, id: editingInvestor } })
    } else {
      dispatch({ type: 'ADD_INVESTOR', payload: { ...form, id: Date.now().toString(), createdAt: new Date().toISOString() } })
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (window.confirm('Remove this investor from the pipeline?')) {
      dispatch({ type: 'DELETE_INVESTOR', payload: id })
    }
  }

  return (
    <div>
      {/* Fundraising Settings */}
      <div className="card">
        <div className="card-header"><h3>Fundraising Target</h3></div>
        <div className="card-body">
          <div className="form-grid" style={{ marginBottom: 16 }}>
            <div className="form-group">
              <label>Target Investors</label>
              <input
                value={fundraising.targetInvestors}
                onChange={(e) => dispatch({ type: 'UPDATE_FUNDRAISING', payload: { targetInvestors: e.target.value } })}
                placeholder="e.g., Superannuation funds, family offices, HNW individuals"
              />
            </div>
            <div className="form-group">
              <label>Minimum Commitment ($)</label>
              <input
                type="number"
                value={fundraising.minimumCommitment}
                onChange={(e) => dispatch({ type: 'UPDATE_FUNDRAISING', payload: { minimumCommitment: Number(e.target.value) } })}
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 500 }}>
                Fundraising Progress: {formatCurrency(totalCommitted)} of {formatCurrency(targetSize)}
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
                {formatPercent(progressPercent)}
              </span>
            </div>
            <div className="progress-bar" style={{ height: 12 }}>
              <div className="progress-bar-fill success" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Committed</div>
          <div className="metric-value">{formatCurrency(totalCommitted)}</div>
          <div className="metric-sub">{investors.filter(i => i.status === 'committed').length} investors</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Pipeline</div>
          <div className="metric-value">{formatCurrency(totalPipeline)}</div>
          <div className="metric-sub">{investors.filter(i => i.status !== 'declined').length} active</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">In Diligence</div>
          <div className="metric-value">{formatCurrency(investors.filter(i => i.status === 'diligence').reduce((s, i) => s + (Number(i.amount) || 0), 0))}</div>
          <div className="metric-sub">{investors.filter(i => i.status === 'diligence').length} investors</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Remaining to Target</div>
          <div className="metric-value">{formatCurrency(Math.max(0, targetSize - totalCommitted))}</div>
        </div>
      </div>

      {/* Pipeline Chart */}
      {investors.length > 0 && (
        <div className="card">
          <div className="card-header"><h3>Pipeline by Status</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusCounts.filter(s => s.amount > 0)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => formatCurrency(v)} />
                <Tooltip formatter={(v) => formatCurrency(v)} />
                <Bar dataKey="amount" name="Amount" radius={[4, 4, 0, 0]}>
                  {statusCounts.filter(s => s.amount > 0).map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Investor Table */}
      <div className="card">
        <div className="card-header">
          <h3>Investor Pipeline ({investors.length})</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-primary btn-sm" onClick={openAdd}>
              <Plus size={14} /> Add Investor
            </button>
            <button className="btn btn-success btn-sm" onClick={() => dispatch({ type: 'MARK_STAGE_COMPLETE', payload: 2 })}>
              <Check size={14} /> Mark Complete
            </button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {investors.length === 0 ? (
            <div className="empty-state">
              <Users size={40} style={{ opacity: 0.3 }} />
              <h3>No investors yet</h3>
              <p>Start building your pipeline by adding prospective investors.</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openAdd}>
                <Plus size={16} /> Add First Investor
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Investor Name</th>
                    <th>Type</th>
                    <th>Commitment</th>
                    <th>Status</th>
                    <th>Contact</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((inv) => {
                    const status = STATUSES.find(s => s.value === inv.status) || STATUSES[0]
                    return (
                      <tr key={inv.id}>
                        <td style={{ fontWeight: 500 }}>{inv.name}</td>
                        <td>{inv.type}</td>
                        <td>{formatCurrency(inv.amount)}</td>
                        <td><span className={`badge ${status.color}`}>{status.label}</span></td>
                        <td style={{ fontSize: 13 }}>{inv.contact}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(inv)}>
                              <Edit2 size={12} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => handleDelete(inv.id)}>
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingInvestor ? 'Edit Investor' : 'Add Investor'}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-group">
                  <label>Investor Name</label>
                  <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g., AustralianSuper" />
                </div>
                <div className="form-group">
                  <label>Investor Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                    <option>Institutional</option>
                    <option>Family Office</option>
                    <option>HNW Individual</option>
                    <option>Fund of Funds</option>
                    <option>Sovereign Wealth</option>
                    <option>Corporate</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Expected Commitment ($)</label>
                  <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="e.g., 10000000" />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Contact Person</label>
                  <input value={form.contact} onChange={(e) => setForm({ ...form, contact: e.target.value })} placeholder="Name / email" />
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any relevant notes..." />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSave}>
                {editingInvestor ? 'Update' : 'Add Investor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
