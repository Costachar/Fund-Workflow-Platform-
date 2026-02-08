import { useFund } from '../../context/FundContext'
import { LayoutDashboard, Lightbulb, Settings, FileText, Users, Rocket, Activity, GanttChart, Check, X } from 'lucide-react'

const NAV_ITEMS = [
  { id: 0, label: 'Dashboard', icon: LayoutDashboard },
  { id: 1, label: 'Fund Ideation', icon: Lightbulb, stage: 0 },
  { id: 2, label: 'Fund Setup', icon: Settings, stage: 1 },
  { id: 3, label: 'Documents', icon: FileText },
  { id: 4, label: 'Fundraising', icon: Users, stage: 2 },
  { id: 5, label: 'Launch Prep', icon: Rocket, stage: 3 },
  { id: 6, label: 'Operations', icon: Activity, stage: 4 },
  { id: 7, label: 'Project Plan', icon: GanttChart },
]

export default function Sidebar({ isOpen, onClose }) {
  const { state, dispatch } = useFund()

  const handleNav = (id) => {
    dispatch({ type: 'SET_STAGE', payload: id })
    onClose()
  }

  return (
    <>
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icon">FF</div>
            <div>
              <h1>FundForge</h1>
              <span>Investment Fund Platform</span>
            </div>
          </div>
          <button className="sidebar-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Navigation</div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = state.currentStage === item.id
            const isCompleted = item.stage !== undefined && state.stageCompletion[item.stage]
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
