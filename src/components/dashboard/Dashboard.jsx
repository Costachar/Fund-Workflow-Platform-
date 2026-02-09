import { useFund } from '../../context/FundContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { calculateFundEconomics } from '../../utils/economics'
import { Lightbulb, Settings, FileText, Users, Rocket, Activity, ArrowRight, Check, Layers } from 'lucide-react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const STAGES = [
  { id: 1, label: 'Fund Ideation', icon: Lightbulb, stageIdx: 0, nav: 'fund_ideation' },
  { id: 2, label: 'Fund Setup', icon: Settings, stageIdx: 1, nav: 'fund_setup' },
  { id: 3, label: 'Fundraising', icon: Users, stageIdx: 2, nav: 'fundraising' },
  { id: 4, label: 'Launch Prep', icon: Rocket, stageIdx: 3, nav: 'launch_prep' },
  { id: 5, label: 'Operations', icon: Activity, stageIdx: 4, nav: 'operations' },
]

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd']

export default function Dashboard() {
  const { state, dispatch, activeFund } = useFund()
  const { fundData, stageCompletion } = state
  const { ideation, fundraising, documents } = fundData

  const economics = calculateFundEconomics(ideation)
  const completedStages = stageCompletion.filter(Boolean).length
  const totalDocs = Object.keys(documents.generated || {}).length
  const reviewedDocs = Object.values(documents.reviewed || {}).filter(Boolean).length

  const totalCommitted = fundraising.investors.reduce((sum, inv) => {
    return inv.status === 'committed' ? sum + (Number(inv.amount) || 0) : sum
  }, 0)

  const fundName = fundData.setup.fundName || 'Your Fund'
  const progressPercent = (completedStages / 5) * 100
  const isFoF = activeFund?.fundType === 'single_manager_fof' || activeFund?.fundType === 'multi_manager_fof'
  const managerCount = activeFund?.managers?.length || 0

  return (
    <div>
      {/* Welcome */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <h3 style={{ fontSize: 18 }}>
              {fundData.setup.fundName ? `${fundName} - Setup Progress` : 'Welcome to FundForge'}
            </h3>
            {isFoF && (
              <span className="badge badge-blue" style={{ fontSize: 11 }}>
                {activeFund.fundType === 'single_manager_fof' ? 'Single Manager FoF' : 'Multi-Manager FoF'}
              </span>
            )}
          </div>
          <p className="text-muted text-sm" style={{ marginBottom: 16 }}>
            {fundData.setup.fundName
              ? 'Track your fund setup progress across all stages below.'
              : 'Get started by completing the Fund Ideation stage to define your strategy and economics.'}
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <div className="progress-bar" style={{ flex: 1 }}>
              <div className="progress-bar-fill success" style={{ width: `${progressPercent}%` }} />
            </div>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-600)' }}>
              {completedStages}/5 stages
            </span>
          </div>
        </div>
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Fund Size</div>
          <div className="metric-value">{formatCurrency(ideation.fundSize)}</div>
          <div className="metric-sub">{ideation.fundType || 'Not set'}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Mgmt Fees</div>
          <div className="metric-value">{formatCurrency(economics.totalMgmtFees)}</div>
          <div className="metric-sub">Over {ideation.fundTerm} year term</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Documents</div>
          <div className="metric-value">{totalDocs}</div>
          <div className="metric-sub">{reviewedDocs} reviewed</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Capital Committed</div>
          <div className="metric-value">{formatCurrency(totalCommitted)}</div>
          <div className="metric-sub">
            {ideation.fundSize > 0 ? formatPercent((totalCommitted / ideation.fundSize) * 100) : '0%'} of target
          </div>
        </div>
        {isFoF && (
          <div className="metric-card">
            <div className="metric-label">Underlying Managers</div>
            <div className="metric-value">{managerCount}</div>
            <div className="metric-sub">
              {activeFund.fundType === 'single_manager_fof' ? 'Single manager' : 'Multi-manager'} structure
            </div>
          </div>
        )}
      </div>

      {/* Stage Progress Cards + Quick Economics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <h3>Workflow Stages</h3>
          </div>
          <div className="card-body" style={{ padding: 0 }}>
            {STAGES.map((stage) => {
              const Icon = stage.icon
              const completed = stageCompletion[stage.stageIdx]
              return (
                <button
                  key={stage.id}
                  className="nav-item"
                  style={{ padding: '14px 20px', borderRadius: 0, borderBottom: '1px solid var(--gray-100)' }}
                  onClick={() => dispatch({ type: 'SET_VIEW', payload: stage.nav })}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 8,
                    background: completed ? 'var(--success-50)' : 'var(--gray-100)',
                    color: completed ? 'var(--success)' : 'var(--gray-400)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {completed ? <Check size={16} /> : <Icon size={16} />}
                  </div>
                  <span className="nav-item-label" style={{ fontWeight: 500 }}>
                    {stage.label}
                  </span>
                  {completed
                    ? <span className="badge badge-green">Complete</span>
                    : <ArrowRight size={16} style={{ color: 'var(--gray-400)' }} />
                  }
                </button>
              )
            })}
            {isFoF && (
              <button
                className="nav-item"
                style={{ padding: '14px 20px', borderRadius: 0 }}
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'manager_management' })}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: managerCount > 0 ? 'var(--success-50)' : 'var(--gray-100)',
                  color: managerCount > 0 ? 'var(--success)' : 'var(--gray-400)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Layers size={16} />
                </div>
                <span className="nav-item-label" style={{ fontWeight: 500 }}>
                  Underlying Managers
                </span>
                <span className="badge badge-blue">{managerCount}</span>
              </button>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Fund Manager vs Investor Returns</h3>
          </div>
          <div className="card-body">
            {economics.expectedWaterfall && (
              <>
                <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Investor Proceeds', value: economics.expectedWaterfall.lpProceeds },
                          { name: 'Fund Manager Proceeds', value: economics.expectedWaterfall.gpProceeds },
                        ]}
                        cx="50%" cy="50%" innerRadius={50} outerRadius={80}
                        paddingAngle={2} dataKey="value"
                      >
                        <Cell fill={COLORS[0]} />
                        <Cell fill={COLORS[2]} />
                      </Pie>
                      <Tooltip formatter={(val) => formatCurrency(val)} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[0] }} />
                    Investors: {formatCurrency(economics.expectedWaterfall.lpProceeds)}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
                    <div style={{ width: 12, height: 12, borderRadius: 3, background: COLORS[2] }} />
                    Fund Manager: {formatCurrency(economics.expectedWaterfall.gpProceeds)}
                  </div>
                </div>
                <div style={{ marginTop: 16, fontSize: 13, color: 'var(--gray-500)', textAlign: 'center' }}>
                  Based on {formatPercent(ideation.expectedGrossReturns)} expected gross returns
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-header">
          <h3>Quick Actions</h3>
        </div>
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'fund_ideation' })}>
            <Lightbulb size={16} /> Model Economics
          </button>
          <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'fund_setup' })}>
            <Settings size={16} /> Setup Fund Details
          </button>
          <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'documents' })}>
            <FileText size={16} /> View Documents
          </button>
          <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'fundraising' })}>
            <Users size={16} /> Manage Investors
          </button>
          {isFoF && (
            <button className="btn btn-secondary" onClick={() => dispatch({ type: 'SET_VIEW', payload: 'manager_management' })}>
              <Layers size={16} /> Manage Underlying Managers
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
