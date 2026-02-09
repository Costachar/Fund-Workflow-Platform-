import { useState, useEffect, lazy, Suspense } from 'react'
import { useFund } from './context/FundContext'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './components/dashboard/Dashboard'
import FundIdeation from './components/stages/FundIdeation'
import FundSetup from './components/stages/FundSetup'
import DocumentLibrary from './components/documents/DocumentLibrary'
import Fundraising from './components/stages/Fundraising'
import LaunchPrep from './components/stages/LaunchPrep'
import Operations from './components/stages/Operations'
import ProjectManagement from './components/project/ProjectManagement'
import FirmDashboard from './components/firm/FirmDashboard'
import FirmSettings from './components/firm/FirmSettings'
import FundCreation from './components/firm/FundCreation'
import ManagerManagement from './components/firm/ManagerManagement'
import { Menu } from 'lucide-react'
import './App.css'

const PAGES = {
  // Firm-level views
  firm_dashboard: { component: FirmDashboard, title: 'Fund Repository', subtitle: 'Manage all funds across your firm' },
  firm_settings: { component: FirmSettings, title: 'Firm Settings', subtitle: 'Configure firm details, branding, and regulatory information' },
  create_fund: { component: FundCreation, title: 'Create New Fund', subtitle: 'Set up a new fund with guided workflow' },

  // Fund-level views
  fund_dashboard: { component: Dashboard, title: 'Fund Dashboard', subtitle: 'Overview of your fund setup progress' },
  fund_ideation: { component: FundIdeation, title: 'Fund Ideation & Business Case', subtitle: 'Define your fund strategy and model the economics' },
  fund_setup: { component: FundSetup, title: 'Fund Setup & Registration', subtitle: 'Complete all fund details and generate legal documents' },
  documents: { component: DocumentLibrary, title: 'Document Library', subtitle: 'View, download, and manage all fund documents' },
  fundraising: { component: Fundraising, title: 'Fundraising', subtitle: 'Track investor pipeline and manage commitments' },
  launch_prep: { component: LaunchPrep, title: 'Launch Preparation', subtitle: 'Finalise operational readiness for fund launch' },
  operations: { component: Operations, title: 'Ongoing Operations', subtitle: 'Manage documents, compliance calendar, and reporting' },
  project_plan: { component: ProjectManagement, title: 'Project Management', subtitle: 'Track tasks, timelines, and team workload across all workstreams' },
  manager_management: { component: ManagerManagement, title: 'Underlying Managers', subtitle: 'Manage underlying manager relationships and allocations' },
}

// Views that require an active fund
const FUND_VIEWS = new Set([
  'fund_dashboard', 'fund_ideation', 'fund_setup', 'documents',
  'fundraising', 'launch_prep', 'operations', 'project_plan', 'manager_management',
])

function App() {
  const { state, dispatch, activeFund } = useFund()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // If trying to access a fund view without an active fund, redirect to firm dashboard
  const currentView = (FUND_VIEWS.has(state.currentView) && !activeFund)
    ? 'firm_dashboard'
    : state.currentView

  const page = PAGES[currentView] || PAGES.firm_dashboard
  const PageComponent = page.component

  // Build dynamic title for fund views
  const fundName = activeFund?.setup?.fundName
  const title = FUND_VIEWS.has(currentView) && fundName
    ? `${page.title}`
    : page.title

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false)
  }, [state.currentView])

  return (
    <div className="app-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <main className="main-content">
        <div className="mobile-header">
          <button className="hamburger-btn" onClick={() => setSidebarOpen(true)}>
            <Menu size={22} />
          </button>
          <div className="mobile-header-logo">
            <div className="sidebar-logo-icon" style={{ width: 28, height: 28, fontSize: 12 }}>
              {state.firm.branding?.logoText || 'FF'}
            </div>
            <span>{state.firm.branding?.platformName || 'FundForge'}</span>
          </div>
        </div>
        <div className="page-header">
          {FUND_VIEWS.has(currentView) && fundName && (
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--primary)', marginBottom: 2 }}>
              {fundName}
            </div>
          )}
          <h2>{title}</h2>
          <p>{page.subtitle}</p>
        </div>
        <div className="page-content">
          <PageComponent />
        </div>
      </main>
    </div>
  )
}

export default App
