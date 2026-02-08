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
import './App.css'

const PAGES = {
  0: { component: Dashboard, title: 'Dashboard', subtitle: 'Overview of your fund setup progress' },
  1: { component: FundIdeation, title: 'Fund Ideation & Business Case', subtitle: 'Define your fund strategy and model the economics' },
  2: { component: FundSetup, title: 'Fund Setup & Registration', subtitle: 'Complete all fund details and generate legal documents' },
  3: { component: DocumentLibrary, title: 'Document Library', subtitle: 'View, download, and manage all fund documents' },
  4: { component: Fundraising, title: 'Fundraising', subtitle: 'Track investor pipeline and manage commitments' },
  5: { component: LaunchPrep, title: 'Launch Preparation', subtitle: 'Finalize operational readiness for fund launch' },
  6: { component: Operations, title: 'Ongoing Operations', subtitle: 'Manage documents, compliance calendar, and reporting' },
  7: { component: ProjectManagement, title: 'Project Management', subtitle: 'Track tasks, timelines, and team workload across all workstreams' },
}

function App() {
  const { state } = useFund()
  const page = PAGES[state.currentStage] || PAGES[0]
  const PageComponent = page.component

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h2>{page.title}</h2>
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
