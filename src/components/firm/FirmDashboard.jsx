import { useMemo } from 'react'
import { useFund, FUND_TYPES } from '../../context/FundContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import {
  Building2,
  ShieldCheck,
  Plus,
  TrendingUp,
  Users,
  Briefcase,
  BarChart3,
  ArrowRight,
  Calendar,
} from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts'

const TYPE_COLORS = {
  standard: '#1e40af',
  single_manager_fof: '#3b82f6',
  multi_manager_fof: '#60a5fa',
}

const STATUS_BADGE = {
  setup: { className: 'badge badge-yellow', label: 'Setup' },
  active: { className: 'badge badge-green', label: 'Active' },
  closed: { className: 'badge badge-gray', label: 'Closed' },
}

const TYPE_BADGE = {
  standard: { className: 'badge badge-blue', label: 'Standard' },
  single_manager_fof: { className: 'badge badge-blue', label: 'Single Manager FoF' },
  multi_manager_fof: { className: 'badge badge-blue', label: 'Multi-Manager FoF' },
}

export default function FirmDashboard() {
  const { state, dispatch } = useFund()
  const { firm, funds } = state

  const metrics = useMemo(() => {
    const totalFunds = funds.length
    const totalAUM = funds.reduce((sum, f) => sum + (Number(f.ideation?.fundSize) || 0), 0)
    const fundsInSetup = funds.filter(f => f.status === 'setup').length
    const fundsActive = funds.filter(f => f.status === 'active').length
    const fundsClosed = funds.filter(f => f.status === 'closed').length
    const totalInvestors = funds.reduce(
      (sum, f) => sum + (f.fundraising?.investors?.length || 0),
      0
    )
    return { totalFunds, totalAUM, fundsInSetup, fundsActive, fundsClosed, totalInvestors }
  }, [funds])

  const allocationData = useMemo(() => {
    const grouped = {}
    funds.forEach(f => {
      const type = f.fundType || 'standard'
      const label = FUND_TYPES[type]?.label || 'Standard Fund'
      if (!grouped[type]) {
        grouped[type] = { name: label, value: 0, type }
      }
      grouped[type].value += Number(f.ideation?.fundSize) || 0
    })
    const data = Object.values(grouped).filter(d => d.value > 0)
    return data
  }, [funds])

  const handleFundClick = (fundId) => {
    dispatch({ type: 'SET_ACTIVE_FUND', payload: fundId })
  }

  const handleCreateFund = () => {
    dispatch({ type: 'SET_VIEW', payload: 'create_fund' })
  }

  const getFundProgress = (fund) => {
    const completion = fund.stageCompletion || [false, false, false, false, false]
    const completed = completion.filter(Boolean).length
    return (completed / 5) * 100
  }

  const getFundInvestorCount = (fund) => {
    return fund.fundraising?.investors?.length || 0
  }

  const getFundName = (fund) => {
    return fund.setup?.fundName || fund.fundName || 'Unnamed Fund'
  }

  return (
    <div>
      {/* Firm Overview Header */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{
                width: 48, height: 48, borderRadius: 12,
                background: 'linear-gradient(135deg, var(--primary), var(--primary-light))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: 18, flexShrink: 0,
              }}>
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: 20, fontWeight: 700, color: 'var(--gray-900)', marginBottom: 4 }}>
                  {firm.firmName || 'Your Firm'}
                </h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 13, color: 'var(--gray-500)' }}>
                  {firm.firmABN && (
                    <span>ABN: {firm.firmABN}</span>
                  )}
                  {firm.afslNumber && (
                    <span>AFSL: {firm.afslNumber}</span>
                  )}
                  {firm.afslHolder && (
                    <span>Holder: {firm.afslHolder}</span>
                  )}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                className="btn btn-secondary"
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'firm_settings' })}
              >
                <ShieldCheck size={16} /> Firm Settings
              </button>
              <button className="btn btn-primary" onClick={handleCreateFund}>
                <Plus size={16} /> Create New Fund
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Portfolio Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Funds</div>
          <div className="metric-value">{metrics.totalFunds}</div>
          <div className="metric-sub">
            {metrics.fundsActive} active, {metrics.fundsInSetup} in setup
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total AUM</div>
          <div className="metric-value">{formatCurrency(metrics.totalAUM)}</div>
          <div className="metric-sub">Across all funds</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Investors</div>
          <div className="metric-value">{metrics.totalInvestors}</div>
          <div className="metric-sub">Across all funds</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Fund Status</div>
          <div className="metric-value" style={{ fontSize: 16, display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
            <span className="badge badge-yellow">{metrics.fundsInSetup} Setup</span>
            <span className="badge badge-green">{metrics.fundsActive} Active</span>
            <span className="badge badge-gray">{metrics.fundsClosed} Closed</span>
          </div>
          <div className="metric-sub">&nbsp;</div>
        </div>
      </div>

      {/* Fund Allocation Chart + Summary */}
      {funds.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: allocationData.length > 0 ? '1fr 1fr' : '1fr', gap: 20, marginBottom: 20 }}>
          {allocationData.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3><BarChart3 size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />Fund Allocation by Type</h3>
              </div>
              <div className="card-body">
                <div style={{ height: 250 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        innerRadius={55}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        nameKey="name"
                      >
                        {allocationData.map((entry) => (
                          <Cell
                            key={entry.type}
                            fill={TYPE_COLORS[entry.type] || '#93c5fd'}
                          />
                        ))}
                      </Pie>
                      <Tooltip formatter={(val) => formatCurrency(val)} />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        formatter={(value) => (
                          <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>{value}</span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-header">
              <h3><TrendingUp size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />Portfolio Summary</h3>
            </div>
            <div className="card-body" style={{ padding: 0 }}>
              <table>
                <thead>
                  <tr>
                    <th>Fund Type</th>
                    <th>Count</th>
                    <th>Total Size</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(FUND_TYPES).map(([key, typeInfo]) => {
                    const typeFunds = funds.filter(f => (f.fundType || 'standard') === key)
                    const typeAUM = typeFunds.reduce((sum, f) => sum + (Number(f.ideation?.fundSize) || 0), 0)
                    return (
                      <tr key={key}>
                        <td style={{ fontWeight: 500 }}>{typeInfo.label}</td>
                        <td>{typeFunds.length}</td>
                        <td>{formatCurrency(typeAUM)}</td>
                      </tr>
                    )
                  })}
                  <tr style={{ fontWeight: 600, background: 'var(--gray-50)' }}>
                    <td>Total</td>
                    <td>{funds.length}</td>
                    <td>{formatCurrency(metrics.totalAUM)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Fund Repository */}
      <div className="card">
        <div className="card-header">
          <h3><Briefcase size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />Fund Repository</h3>
          <button className="btn btn-primary btn-sm" onClick={handleCreateFund}>
            <Plus size={14} /> New Fund
          </button>
        </div>
        <div className="card-body">
          {funds.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <h3>No Funds Yet</h3>
              <p>Create your first fund to get started with the platform.</p>
              <button
                className="btn btn-primary"
                style={{ marginTop: 16 }}
                onClick={handleCreateFund}
              >
                <Plus size={16} /> Create New Fund
              </button>
            </div>
          ) : (
            <div className="doc-grid">
              {funds.map((fund) => {
                const fundName = getFundName(fund)
                const progress = getFundProgress(fund)
                const investorCount = getFundInvestorCount(fund)
                const statusInfo = STATUS_BADGE[fund.status] || STATUS_BADGE.setup
                const typeInfo = TYPE_BADGE[fund.fundType] || TYPE_BADGE.standard
                const completedStages = (fund.stageCompletion || []).filter(Boolean).length

                return (
                  <div
                    key={fund.id}
                    className="doc-card"
                    onClick={() => handleFundClick(fund.id)}
                    style={{ display: 'flex', flexDirection: 'column' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div className="doc-card-icon" style={{ marginBottom: 0 }}>
                        <Briefcase size={20} />
                      </div>
                      <span className={statusInfo.className}>{statusInfo.label}</span>
                    </div>

                    <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 6 }}>
                      {fundName}
                    </h4>

                    <div style={{ marginBottom: 12 }}>
                      <span className={typeInfo.className}>{typeInfo.label}</span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, fontSize: 13, color: 'var(--gray-600)', marginBottom: 12 }}>
                      <div>
                        <div style={{ color: 'var(--gray-400)', fontSize: 11, textTransform: 'uppercase', fontWeight: 500 }}>
                          Fund Size
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-800)' }}>
                          {formatCurrency(fund.ideation?.fundSize || 0)}
                        </div>
                      </div>
                      <div>
                        <div style={{ color: 'var(--gray-400)', fontSize: 11, textTransform: 'uppercase', fontWeight: 500 }}>
                          Investors
                        </div>
                        <div style={{ fontWeight: 600, color: 'var(--gray-800)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Users size={13} /> {investorCount}
                        </div>
                      </div>
                    </div>

                    <div style={{ marginTop: 'auto' }}>
                      {/* Stage progress bar */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--gray-400)', fontWeight: 500 }}>
                          Progress
                        </span>
                        <span style={{ fontSize: 11, color: 'var(--gray-500)', fontWeight: 600 }}>
                          {completedStages}/5 stages
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className={`progress-bar-fill${progress === 100 ? ' success' : ''}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="doc-card-footer" style={{ marginTop: 12 }}>
                        <span style={{ fontSize: 12, color: 'var(--gray-400)', display: 'flex', alignItems: 'center', gap: 4 }}>
                          <Calendar size={12} /> {formatDate(fund.createdAt)}
                        </span>
                        <span style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}>
                          Open <ArrowRight size={12} />
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
