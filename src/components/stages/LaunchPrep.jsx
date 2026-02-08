import { useFund } from '../../context/FundContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { Check, FileText, Users, Building2, Shield } from 'lucide-react'

const GO_LIVE_ITEMS = [
  { id: 'bankAccounts', label: 'Open fund bank accounts (AUD operating, multi-currency)', icon: Building2 },
  { id: 'custody', label: 'Custodian engaged and accounts established', icon: Shield },
  { id: 'adminEngaged', label: 'Fund administrator onboarded and systems configured', icon: Building2 },
  { id: 'investorPortal', label: 'Investor reporting portal set up and tested', icon: Users },
  { id: 'complianceReg', label: 'All regulatory registrations completed (AFSL, ASIC, AUSTRAC)', icon: Shield },
  { id: 'amlProgram', label: 'AML/CTF program implemented and staff trained', icon: Shield },
  { id: 'legalDocs', label: 'All legal documents executed (LPA, IMA, side letters)', icon: FileText },
  { id: 'auditEngaged', label: 'Auditor engaged and audit timeline agreed', icon: Building2 },
  { id: 'insuranceObtained', label: 'Professional indemnity and D&O insurance obtained', icon: Shield },
  { id: 'systemsAccess', label: 'Portfolio management and accounting systems configured', icon: Building2 },
  { id: 'taxAdvice', label: 'Tax structure and FATCA/CRS compliance confirmed', icon: Shield },
  { id: 'operationalManual', label: 'Operational procedures manual drafted', icon: FileText },
]

export default function LaunchPrep() {
  const { state, dispatch } = useFund()
  const { launch, setup, ideation, fundraising } = state.fundData

  const checklist = launch.goLiveChecklist || []
  const completedItems = checklist.length
  const totalItems = GO_LIVE_ITEMS.length
  const progressPercent = (completedItems / totalItems) * 100

  const toggleItem = (id) => {
    const newChecklist = checklist.includes(id)
      ? checklist.filter(item => item !== id)
      : [...checklist, id]
    dispatch({ type: 'UPDATE_LAUNCH', payload: { goLiveChecklist: newChecklist } })
  }

  const investors = fundraising.investors || []
  const committedInvestors = investors.filter(i => i.status === 'committed')
  const totalCommitted = committedInvestors.reduce((sum, inv) => sum + (Number(inv.amount) || 0), 0)

  return (
    <div>
      {/* Progress */}
      <div className="card">
        <div className="card-header">
          <h3>Launch Readiness</h3>
          <button className="btn btn-success btn-sm" onClick={() => dispatch({ type: 'MARK_STAGE_COMPLETE', payload: 3 })}>
            <Check size={14} /> Mark Stage Complete
          </button>
        </div>
        <div className="card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 14, fontWeight: 500 }}>
              Go-Live Checklist: {completedItems} of {totalItems} complete
            </span>
            <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--primary)' }}>
              {progressPercent.toFixed(0)}%
            </span>
          </div>
          <div className="progress-bar" style={{ height: 10 }}>
            <div className="progress-bar-fill success" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Go-Live Checklist */}
        <div className="card">
          <div className="card-header"><h3>Go-Live Checklist</h3></div>
          <div className="card-body" style={{ padding: '8px 20px' }}>
            {GO_LIVE_ITEMS.map((item) => {
              const Icon = item.icon
              const isChecked = checklist.includes(item.id)
              return (
                <div key={item.id} className={`checklist-item ${isChecked ? 'checked' : ''}`}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(item.id)}
                  />
                  <Icon size={16} style={{ color: isChecked ? 'var(--success)' : 'var(--gray-400)', flexShrink: 0, marginTop: 2 }} />
                  <label onClick={() => toggleItem(item.id)}>{item.label}</label>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Panels */}
        <div>
          {/* First Close Summary */}
          <div className="card">
            <div className="card-header"><h3>First Close Summary</h3></div>
            <div className="card-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                <div>
                  <div className="metric-label">Capital Committed</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--gray-900)' }}>
                    {formatCurrency(totalCommitted)}
                  </div>
                  <div className="metric-sub">of {formatCurrency(ideation.fundSize)} target</div>
                </div>
                <div>
                  <div className="metric-label">Committed Investors</div>
                  <div style={{ fontSize: 18, fontWeight: 600 }}>{committedInvestors.length}</div>
                </div>
                {setup.firstCloseDate && (
                  <div>
                    <div className="metric-label">Target First Close</div>
                    <div style={{ fontSize: 15, fontWeight: 500 }}>{formatDate(setup.firstCloseDate)}</div>
                  </div>
                )}
              </div>

              {committedInvestors.length > 0 && (
                <div style={{ marginTop: 16 }}>
                  <div className="metric-label" style={{ marginBottom: 8 }}>Investor List</div>
                  {committedInvestors.map((inv) => (
                    <div key={inv.id} style={{
                      display: 'flex', justifyContent: 'space-between',
                      padding: '6px 0', borderBottom: '1px solid var(--gray-100)',
                      fontSize: 13,
                    }}>
                      <span>{inv.name}</span>
                      <span style={{ fontWeight: 500 }}>{formatCurrency(inv.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Key Contacts */}
          <div className="card">
            <div className="card-header"><h3>Service Provider Contacts</h3></div>
            <div className="card-body" style={{ fontSize: 13 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div>
                  <div className="metric-label">General Partner</div>
                  <div style={{ fontWeight: 500 }}>{setup.gpName || 'Not set'}</div>
                </div>
                <div>
                  <div className="metric-label">Investment Manager</div>
                  <div style={{ fontWeight: 500 }}>{setup.investmentManager || 'Not set'}</div>
                </div>
                <div>
                  <div className="metric-label">Fund Administrator</div>
                  <div style={{ fontWeight: 500 }}>{setup.fundAdministrator || 'Not set'}</div>
                </div>
                <div>
                  <div className="metric-label">Trustee / RE</div>
                  <div style={{ fontWeight: 500 }}>{setup.trustee || 'Not set'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
