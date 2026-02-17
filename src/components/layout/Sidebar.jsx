import { useFund, FUND_TYPES } from '../../context/FundContext'
import {
  LayoutDashboard, Lightbulb, Settings, FileText, Users, Rocket,
  Activity, GanttChart, Check, X, Building2, Palette, Plus, ChevronDown, Layers
} from 'lucide-react'
import { useState } from 'react'

const FIRM_NAV = [
  { id: 'firm_dashboard', label: 'Fund Repository', icon: Building2 },
  { id: 'firm_settings', label: 'Firm Settings', icon: Palette },
]

const FUND_NAV = [
  { id: 'fund_dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'fund_ideation', label: 'Fund Ideation', icon: Lightbulb, stage: 0 },
  { id: 'fund_setup', label: 'Fund Setup', icon: Settings, stage: 1 },
  { id: 'documents', label: 'Documents', icon: FileText },
  { id: 'fundraising', label: 'Fundraising', icon: Users, stage: 2 },
  { id: 'launch_prep', label: 'Launch Prep', icon: Rocket, stage: 3 },
  { id: 'operations', label: 'Operations', icon: Activity, stage: 4 },
  { id: 'project_plan', label: 'Project Plan', icon: GanttChart },
]

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch, activeFund } = useFund()
  const [fundDropdown, setFundDropdown] = useState(false)

  const handleNav = (viewId) => {
    dispatch({ type: 'SET_VIEW', payload: viewId })
    onClose()
  }

  const handleSelectFund = (fundId) => {
    dispatch({ type: 'SET_ACTIVE_FUND', payload: fundId })
    setFundDropdown(false)
    onClose()
  }

  const isFoF = activeFund?.fundType === 'single_manager_fof' || activeFund?.fundType === 'multi_manager_fof'

  const fundNav = isFoF
    ? [...FUND_NAV.slice(0, 4), { id: 'manager_management', label: 'Managers', icon: Layers }, ...FUND_NAV.slice(4)]
    : FUND_NAV

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">
              {state.firm.branding?.logoText || 'FF'}
            </div>
            <div>
              <h1>{state.firm.branding?.platformName || 'FundForge'}</h1>
              <span>{state.firm.branding?.tagline || 'Investment Fund Platform'}</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {/* Firm Section */}
          <div className="nav-section-label">Platform</div>
          {FIRM_NAV.map((item) => {
            const Icon = item.icon
            const isActive = state.currentView === item.id
            return (
              <button
                key={item.id}
                className={`nav-item ${isActive ? 'active' : ''}`}
                onClick={() => handleNav(item.id)}
              >
                <div className="nav-item-number"><Icon size={14} /></div>
                <span className="nav-item-label">{item.label}</span>
              </button>
            )
          })}

          {/* Fund Selector */}
          {state.funds.length > 0 && (
            <>
              <div className="nav-section-label" style={{ marginTop: 16 }}>Active Fund</div>
              <div style={{ position: 'relative', margin: '0 0 8px' }}>
                <button
                  className="fund-selector-btn"
                  onClick={() => setFundDropdown(!fundDropdown)}
                >
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--gray-800)' }}>
                      {activeFund?.setup?.fundName || 'Select a fund'}
                    </div>
                    {activeFund && (
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>
                        {FUND_TYPES[activeFund.fundType]?.label || 'Standard Fund'}
                      </div>
                    )}
                  </div>
                  <ChevronDown size={16} style={{ color: 'var(--gray-400)', transition: 'transform 0.2s', transform: fundDropdown ? 'rotate(180deg)' : 'none' }} />
                </button>

                {fundDropdown && (
                  <div className="fund-selector-dropdown">
                    {state.funds.map(f => (
                      <button
                        key={f.id}
                        className={`fund-selector-option ${f.id === state.activeFundId ? 'active' : ''}`}
                        onClick={() => handleSelectFund(f.id)}
                      >
                        <span>{f.setup.fundName || 'Unnamed Fund'}</span>
                        <span className={`badge ${f.status === 'active' ? 'badge-green' : f.status === 'closed' ? 'badge-gray' : 'badge-blue'}`}>
                          {f.status}
                        </span>
                      </button>
                    ))}
                    <button
                      className="fund-selector-option"
                      style={{ color: 'var(--primary)', fontWeight: 500 }}
                      onClick={() => { handleNav('create_fund'); setFundDropdown(false) }}
                    >
                      <Plus size={14} /> Create New Fund
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Fund Navigation (only when a fund is selected) */}
          {activeFund && (
            <>
              <div className="nav-section-label" style={{ marginTop: 4 }}>Fund Workflow</div>
              {fundNav.map((item) => {
                const Icon = item.icon
                const isActive = state.currentView === item.id
                const isCompleted = item.stage !== undefined && activeFund.stageCompletion[item.stage]
                return (
                  <button
                    key={item.id}
                    className={`nav-item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleNav(item.id)}
                  >
                    <div className="nav-item-number">
                      {isCompleted ? <Check size={12} /> : item.stage !== undefined ? item.stage + 1 : <Icon size={14} />}
                    </div>
                    <span className="nav-item-label">{item.label}</span>
                  </button>
                )
              })}
            </>
          )}
        </nav>

        <div className="sidebar-footer">
          <button onClick={() => {
            if (window.confirm('Reset all data? This cannot be undone.')) {
              dispatch({ type: 'RESET_STATE' })
            }
          }}>
            Reset All Data
          </button>
        </div>
      </aside>
    </>
  )
}
