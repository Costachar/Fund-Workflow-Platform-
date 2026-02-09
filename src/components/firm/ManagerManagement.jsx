import { useState } from 'react'
import { useFund } from '../../context/FundContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { Plus, Edit2, Trash2, X, Users, AlertTriangle, BarChart3 } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const MANAGER_STATUSES = [
  { value: 'active', label: 'Active', color: 'badge-green' },
  { value: 'pending', label: 'Pending', color: 'badge-yellow' },
  { value: 'terminated', label: 'Terminated', color: 'badge-red' },
]

const PIE_COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#059669', '#10b981', '#d97706', '#f59e0b', '#dc2626']

const emptyForm = {
  name: '',
  strategy: '',
  allocation: '',
  status: 'active',
  abn: '',
  afsl: '',
  contactPerson: '',
  email: '',
  managementFee: '',
  performanceFee: '',
  notes: '',
}

export default function ManagerManagement() {
  const { activeFund, dispatch } = useFund()
  const managers = activeFund?.managers || []
  const fundType = activeFund?.fundType || 'standard'
  const isSingleManager = fundType === 'single_manager_fof'
  const isMultiManager = fundType === 'multi_manager_fof'

  const [showModal, setShowModal] = useState(false)
  const [editingManagerId, setEditingManagerId] = useState(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null)

  // Metrics calculations
  const activeManagers = managers.filter(m => m.status !== 'terminated')
  const totalAllocation = activeManagers.reduce((sum, m) => sum + (Number(m.allocation) || 0), 0)
  const avgMgmtFee = activeManagers.length > 0
    ? activeManagers.reduce((sum, m) => sum + (Number(m.managementFee) || 0), 0) / activeManagers.length
    : 0
  const avgPerfFee = activeManagers.length > 0
    ? activeManagers.reduce((sum, m) => sum + (Number(m.performanceFee) || 0), 0) / activeManagers.length
    : 0

  // Pie chart data
  const allocationData = activeManagers
    .filter(m => Number(m.allocation) > 0)
    .map(m => ({
      name: m.name || 'Unnamed',
      value: Number(m.allocation) || 0,
    }))
  const unallocated = 100 - totalAllocation
  if (unallocated > 0 && allocationData.length > 0) {
    allocationData.push({ name: 'Unallocated', value: unallocated })
  }

  const openAdd = () => {
    if (isSingleManager && activeManagers.length >= 1) {
      // Show warning - don't block, just warn
    }
    setForm({ ...emptyForm })
    setEditingManagerId(null)
    setShowModal(true)
  }

  const openEdit = (manager) => {
    setForm({
      name: manager.name || '',
      strategy: manager.strategy || '',
      allocation: manager.allocation || '',
      status: manager.status || 'active',
      abn: manager.abn || '',
      afsl: manager.afsl || '',
      contactPerson: manager.contactPerson || '',
      email: manager.email || '',
      managementFee: manager.managementFee || '',
      performanceFee: manager.performanceFee || '',
      notes: manager.notes || '',
    })
    setEditingManagerId(manager.id)
    setShowModal(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return

    const managerData = {
      ...form,
      allocation: Number(form.allocation) || 0,
      managementFee: Number(form.managementFee) || 0,
      performanceFee: Number(form.performanceFee) || 0,
    }

    // Check allocation limit
    const otherAllocation = activeManagers
      .filter(m => m.id !== editingManagerId)
      .reduce((sum, m) => sum + (Number(m.allocation) || 0), 0)

    if (otherAllocation + managerData.allocation > 100) {
      alert('Total allocation across all active managers cannot exceed 100%. Currently ' + formatPercent(otherAllocation) + ' is allocated to other managers.')
      return
    }

    if (editingManagerId) {
      dispatch({ type: 'UPDATE_MANAGER', payload: { ...managerData, id: editingManagerId } })
    } else {
      dispatch({
        type: 'ADD_MANAGER',
        payload: {
          ...managerData,
          id: 'mgr_' + Date.now(),
        },
      })
    }
    setShowModal(false)
  }

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_MANAGER', payload: id })
    setShowDeleteConfirm(null)
  }

  const updateField = (field, value) => {
    setForm({ ...form, [field]: value })
  }

  // Guard: only show for FoF types
  if (!isSingleManager && !isMultiManager) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="empty-state">
            <Users size={40} style={{ opacity: 0.3 }} />
            <h3>Manager Management Not Available</h3>
            <p>This feature is only available for Fund of Funds structures (Single Manager or Multi-Manager FoF).</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Single Manager Warning */}
      {isSingleManager && activeManagers.length >= 1 && (
        <div style={{
          background: 'var(--warning-50)',
          border: '1px solid var(--warning)',
          borderRadius: 'var(--radius)',
          padding: '12px 16px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13,
          color: 'var(--warning)',
        }}>
          <AlertTriangle size={18} />
          <span>
            <strong>Single Manager FoF:</strong> This fund structure is designed for one underlying manager.
            Adding additional managers may require restructuring to a Multi-Manager FoF.
          </span>
        </div>
      )}

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Managers</div>
          <div className="metric-value">{activeManagers.length}</div>
          <div className="metric-sub">
            {managers.filter(m => m.status === 'terminated').length > 0 &&
              `${managers.filter(m => m.status === 'terminated').length} terminated`
            }
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Allocation</div>
          <div className="metric-value" style={{ color: totalAllocation > 100 ? 'var(--danger)' : undefined }}>
            {formatPercent(totalAllocation)}
          </div>
          <div className="metric-sub">
            {totalAllocation < 100 ? `${formatPercent(100 - totalAllocation)} unallocated` : totalAllocation === 100 ? 'Fully allocated' : 'Over-allocated'}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Management Fee</div>
          <div className="metric-value">{formatPercent(avgMgmtFee)}</div>
          <div className="metric-sub">Across active managers</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Avg Performance Fee</div>
          <div className="metric-value">{formatPercent(avgPerfFee)}</div>
          <div className="metric-sub">Across active managers</div>
        </div>
      </div>

      {/* Allocation Chart (Multi-Manager only) */}
      {isMultiManager && allocationData.length > 0 && (
        <div className="card">
          <div className="card-header">
            <h3>Allocation Breakdown</h3>
            <span className="badge badge-blue">{activeManagers.length} active managers</span>
          </div>
          <div className="card-body">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {allocationData.map((_, index) => (
                      <Cell
                        key={index}
                        fill={index === allocationData.length - 1 && unallocated > 0
                          ? 'var(--gray-200)'
                          : PIE_COLORS[index % PIE_COLORS.length]
                        }
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val) => `${val}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <div>
                {activeManagers.map((m, i) => (
                  <div key={m.id} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '8px 0',
                    borderBottom: '1px solid var(--gray-100)',
                  }}>
                    <div style={{
                      width: 12,
                      height: 12,
                      borderRadius: 3,
                      background: PIE_COLORS[i % PIE_COLORS.length],
                      flexShrink: 0,
                    }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--gray-800)' }}>
                        {m.name}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--gray-500)' }}>
                        {m.strategy || 'No strategy specified'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)' }}>
                        {formatPercent(Number(m.allocation) || 0)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Manager Table */}
      <div className="card">
        <div className="card-header">
          <h3>Underlying Managers ({managers.length})</h3>
          <button className="btn btn-primary btn-sm" onClick={openAdd}>
            <Plus size={14} /> Add Manager
          </button>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {managers.length === 0 ? (
            <div className="empty-state">
              <Users size={40} style={{ opacity: 0.3 }} />
              <h3>No underlying managers</h3>
              <p>Add your first underlying manager to get started with your fund of funds.</p>
              <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={openAdd}>
                <Plus size={16} /> Add First Manager
              </button>
            </div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Manager Name</th>
                    <th>Strategy</th>
                    <th>Allocation</th>
                    <th>Status</th>
                    <th>Management Fee</th>
                    <th>Performance Fee</th>
                    <th>ABN</th>
                    <th>AFSL</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {managers.map((manager) => {
                    const status = MANAGER_STATUSES.find(s => s.value === manager.status) || MANAGER_STATUSES[0]
                    return (
                      <tr key={manager.id}>
                        <td style={{ fontWeight: 500 }}>{manager.name}</td>
                        <td>{manager.strategy || '-'}</td>
                        <td>{formatPercent(Number(manager.allocation) || 0)}</td>
                        <td><span className={`badge ${status.color}`}>{status.label}</span></td>
                        <td>{formatPercent(Number(manager.managementFee) || 0)}</td>
                        <td>{formatPercent(Number(manager.performanceFee) || 0)}</td>
                        <td style={{ fontSize: 13 }}>{manager.abn || '-'}</td>
                        <td style={{ fontSize: 13 }}>{manager.afsl || '-'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 4 }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => openEdit(manager)}>
                              <Edit2 size={12} />
                            </button>
                            <button className="btn btn-danger btn-sm" onClick={() => setShowDeleteConfirm(manager.id)}>
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

      {/* Manager Benchmarking (Multi-Manager only) */}
      {isMultiManager && activeManagers.length >= 2 && (
        <div className="card">
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={16} />
              Manager Benchmarking
            </h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Manager</th>
                    <th>Allocation</th>
                    <th>Management Fee</th>
                    <th>Performance Fee</th>
                    <th>Total Fee Load</th>
                    <th>Fee vs Average</th>
                  </tr>
                </thead>
                <tbody>
                  {activeManagers.map((manager) => {
                    const mgmtFee = Number(manager.managementFee) || 0
                    const perfFee = Number(manager.performanceFee) || 0
                    const totalFee = mgmtFee + perfFee
                    const avgTotal = avgMgmtFee + avgPerfFee
                    const feeVsAvg = avgTotal > 0 ? ((totalFee - avgTotal) / avgTotal) * 100 : 0

                    return (
                      <tr key={manager.id}>
                        <td style={{ fontWeight: 500 }}>{manager.name}</td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div className="progress-bar" style={{ width: 80, height: 6 }}>
                              <div
                                className="progress-bar-fill"
                                style={{ width: `${Math.min(Number(manager.allocation) || 0, 100)}%` }}
                              />
                            </div>
                            <span>{formatPercent(Number(manager.allocation) || 0)}</span>
                          </div>
                        </td>
                        <td>{formatPercent(mgmtFee)}</td>
                        <td>{formatPercent(perfFee)}</td>
                        <td style={{ fontWeight: 600 }}>{formatPercent(totalFee)}</td>
                        <td>
                          <span className={`badge ${feeVsAvg > 0 ? 'badge-red' : feeVsAvg < 0 ? 'badge-green' : 'badge-gray'}`}>
                            {feeVsAvg > 0 ? '+' : ''}{feeVsAvg.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                  <tr style={{ background: 'var(--gray-50)' }}>
                    <td style={{ fontWeight: 600 }}>Average</td>
                    <td>{formatPercent(activeManagers.length > 0 ? totalAllocation / activeManagers.length : 0)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPercent(avgMgmtFee)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPercent(avgPerfFee)}</td>
                    <td style={{ fontWeight: 600 }}>{formatPercent(avgMgmtFee + avgPerfFee)}</td>
                    <td><span className="badge badge-gray">Baseline</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Manager Comparison Summary (Multi-Manager only) */}
      {isMultiManager && activeManagers.length >= 2 && (
        <div className="card">
          <div className="card-header">
            <h3>Manager Comparison</h3>
          </div>
          <div className="card-body">
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Lowest Mgmt Fee</div>
                <div className="metric-value" style={{ fontSize: 18, color: 'var(--success)' }}>
                  {formatPercent(Math.min(...activeManagers.map(m => Number(m.managementFee) || 0)))}
                </div>
                <div className="metric-sub">
                  {activeManagers.reduce((lowest, m) =>
                    (Number(m.managementFee) || 0) < (Number(lowest.managementFee) || 0) ? m : lowest
                  ).name}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Highest Mgmt Fee</div>
                <div className="metric-value" style={{ fontSize: 18, color: 'var(--warning)' }}>
                  {formatPercent(Math.max(...activeManagers.map(m => Number(m.managementFee) || 0)))}
                </div>
                <div className="metric-sub">
                  {activeManagers.reduce((highest, m) =>
                    (Number(m.managementFee) || 0) > (Number(highest.managementFee) || 0) ? m : highest
                  ).name}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Largest Allocation</div>
                <div className="metric-value" style={{ fontSize: 18 }}>
                  {formatPercent(Math.max(...activeManagers.map(m => Number(m.allocation) || 0)))}
                </div>
                <div className="metric-sub">
                  {activeManagers.reduce((largest, m) =>
                    (Number(m.allocation) || 0) > (Number(largest.allocation) || 0) ? m : largest
                  ).name}
                </div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Weighted Avg Fee</div>
                <div className="metric-value" style={{ fontSize: 18 }}>
                  {formatPercent(
                    totalAllocation > 0
                      ? activeManagers.reduce((sum, m) =>
                          sum + ((Number(m.managementFee) || 0) * (Number(m.allocation) || 0)), 0
                        ) / totalAllocation
                      : 0
                  )}
                </div>
                <div className="metric-sub">Allocation-weighted management fee</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingManagerId ? 'Edit Underlying Manager' : 'Add Underlying Manager'}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-body">
              {isSingleManager && !editingManagerId && activeManagers.length >= 1 && (
                <div style={{
                  background: 'var(--warning-50)',
                  border: '1px solid var(--warning)',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  marginBottom: 16,
                  fontSize: 13,
                  color: 'var(--warning)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                  <AlertTriangle size={16} />
                  <span>This fund is structured as a Single Manager FoF. Adding multiple managers may not align with the fund structure.</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Manager Name</label>
                    <input
                      value={form.name}
                      onChange={(e) => updateField('name', e.target.value)}
                      placeholder="e.g., Pinnacle Investment Management"
                      autoFocus
                    />
                  </div>
                  <div className="form-group">
                    <label>Strategy</label>
                    <input
                      value={form.strategy}
                      onChange={(e) => updateField('strategy', e.target.value)}
                      placeholder="e.g., Australian Equities Growth"
                    />
                  </div>
                  <div className="form-group">
                    <label>Allocation (%)</label>
                    <input
                      type="number"
                      value={form.allocation}
                      onChange={(e) => updateField('allocation', e.target.value)}
                      placeholder="e.g., 30"
                      min={0}
                      max={100}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select value={form.status} onChange={(e) => updateField('status', e.target.value)}>
                      {MANAGER_STATUSES.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>ABN</label>
                    <input
                      value={form.abn}
                      onChange={(e) => updateField('abn', e.target.value)}
                      placeholder="e.g., 12 345 678 901"
                    />
                  </div>
                  <div className="form-group">
                    <label>AFSL Number</label>
                    <input
                      value={form.afsl}
                      onChange={(e) => updateField('afsl', e.target.value)}
                      placeholder="e.g., 123456"
                    />
                  </div>
                  <div className="form-group">
                    <label>Contact Person</label>
                    <input
                      value={form.contactPerson}
                      onChange={(e) => updateField('contactPerson', e.target.value)}
                      placeholder="e.g., Jane Smith"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="e.g., jane@example.com.au"
                    />
                  </div>
                  <div className="form-group">
                    <label>Management Fee (%)</label>
                    <input
                      type="number"
                      value={form.managementFee}
                      onChange={(e) => updateField('managementFee', e.target.value)}
                      min={0}
                      max={10}
                      step={0.1}
                      placeholder="e.g., 1.5"
                    />
                  </div>
                  <div className="form-group">
                    <label>Performance Fee (%)</label>
                    <input
                      type="number"
                      value={form.performanceFee}
                      onChange={(e) => updateField('performanceFee', e.target.value)}
                      min={0}
                      max={50}
                      step={0.5}
                      placeholder="e.g., 20"
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Any relevant notes about this underlying manager..."
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button
                className="btn btn-primary"
                onClick={handleSave}
                disabled={!form.name.trim()}
                style={{ opacity: form.name.trim() ? 1 : 0.5 }}
              >
                {editingManagerId ? 'Update Manager' : 'Add Manager'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
            <div className="modal-header">
              <h3>Confirm Removal</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowDeleteConfirm(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: 14, color: 'var(--gray-700)', marginBottom: 8 }}>
                Are you sure you want to remove this underlying manager?
              </p>
              <p style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                <strong>{managers.find(m => m.id === showDeleteConfirm)?.name}</strong> will be permanently removed
                from this fund. Their allocation of{' '}
                <strong>{formatPercent(Number(managers.find(m => m.id === showDeleteConfirm)?.allocation) || 0)}</strong>{' '}
                will become unallocated.
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={() => handleDelete(showDeleteConfirm)}>
                <Trash2 size={14} /> Remove Manager
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
