export const DEFAULT_TEAM_MEMBERS = [
  { id: 'pm', name: 'Project Manager', role: 'Project Management', color: '#3b82f6' },
  { id: 'legal', name: 'Legal Counsel', role: 'Legal', color: '#8b5cf6' },
  { id: 'compliance', name: 'Compliance Officer', role: 'Compliance', color: '#ef4444' },
  { id: 'finance', name: 'CFO / Finance', role: 'Finance', color: '#059669' },
  { id: 'ir', name: 'Investor Relations', role: 'IR / Fundraising', color: '#d97706' },
  { id: 'ops', name: 'Operations Manager', role: 'Operations', color: '#0891b2' },
  { id: 'tax', name: 'Tax Advisor', role: 'Tax', color: '#be185d' },
  { id: 'admin', name: 'Fund Administrator', role: 'Administration', color: '#6366f1' },
]

export const DEFAULT_PROJECT_TASKS = [
  // Phase 1: Fund Structuring (Weeks 1-4)
  { id: 't1', phase: 'Fund Structuring', name: 'Define fund strategy and investment thesis', owner: 'pm', status: 'not_started', startWeek: 1, duration: 2, dependencies: [] },
  { id: 't2', phase: 'Fund Structuring', name: 'Model fund economics (fees, carry, waterfall)', owner: 'finance', status: 'not_started', startWeek: 1, duration: 2, dependencies: [] },
  { id: 't3', phase: 'Fund Structuring', name: 'Determine legal structure and domicile', owner: 'legal', status: 'not_started', startWeek: 2, duration: 2, dependencies: ['t1'] },
  { id: 't4', phase: 'Fund Structuring', name: 'Prepare business case and go/no-go decision', owner: 'pm', status: 'not_started', startWeek: 3, duration: 2, dependencies: ['t1', 't2'] },
  { id: 't5', phase: 'Fund Structuring', name: 'Engage external legal counsel', owner: 'legal', status: 'not_started', startWeek: 3, duration: 1, dependencies: ['t3'] },

  // Phase 2: Legal & Regulatory (Weeks 4-12)
  { id: 't6', phase: 'Legal & Regulatory', name: 'Draft Limited Partnership Agreement / Trust Deed', owner: 'legal', status: 'not_started', startWeek: 5, duration: 6, dependencies: ['t4', 't5'] },
  { id: 't7', phase: 'Legal & Regulatory', name: 'Prepare Term Sheet', owner: 'legal', status: 'not_started', startWeek: 5, duration: 3, dependencies: ['t4'] },
  { id: 't8', phase: 'Legal & Regulatory', name: 'Draft Investment Management Agreement', owner: 'legal', status: 'not_started', startWeek: 6, duration: 4, dependencies: ['t5'] },
  { id: 't9', phase: 'Legal & Regulatory', name: 'Draft Subscription Agreement', owner: 'legal', status: 'not_started', startWeek: 7, duration: 3, dependencies: ['t6'] },
  { id: 't10', phase: 'Legal & Regulatory', name: 'AFSL application / authorised rep arrangement', owner: 'compliance', status: 'not_started', startWeek: 5, duration: 12, dependencies: ['t3'] },
  { id: 't11', phase: 'Legal & Regulatory', name: 'ASIC registration and filings', owner: 'compliance', status: 'not_started', startWeek: 5, duration: 4, dependencies: ['t3'] },
  { id: 't12', phase: 'Legal & Regulatory', name: 'Obtain tax structure opinion', owner: 'tax', status: 'not_started', startWeek: 5, duration: 3, dependencies: ['t3'] },
  { id: 't13', phase: 'Legal & Regulatory', name: 'Develop AML/CTF program', owner: 'compliance', status: 'not_started', startWeek: 6, duration: 4, dependencies: ['t11'] },
  { id: 't14', phase: 'Legal & Regulatory', name: 'Draft Side Letter template', owner: 'legal', status: 'not_started', startWeek: 8, duration: 2, dependencies: ['t6'] },

  // Phase 3: Service Provider Engagement (Weeks 6-12)
  { id: 't15', phase: 'Service Providers', name: 'Prepare Service Provider Brief', owner: 'ops', status: 'not_started', startWeek: 6, duration: 2, dependencies: ['t4'] },
  { id: 't16', phase: 'Service Providers', name: 'RFP process for fund administrator', owner: 'ops', status: 'not_started', startWeek: 8, duration: 3, dependencies: ['t15'] },
  { id: 't17', phase: 'Service Providers', name: 'Engage custodian', owner: 'ops', status: 'not_started', startWeek: 8, duration: 3, dependencies: ['t15'] },
  { id: 't18', phase: 'Service Providers', name: 'Engage auditor', owner: 'finance', status: 'not_started', startWeek: 8, duration: 2, dependencies: ['t15'] },
  { id: 't19', phase: 'Service Providers', name: 'Obtain PI and D&O insurance', owner: 'ops', status: 'not_started', startWeek: 9, duration: 3, dependencies: ['t5'] },

  // Phase 4: Fundraising (Weeks 8-24)
  { id: 't20', phase: 'Fundraising', name: 'Prepare Information Memorandum', owner: 'ir', status: 'not_started', startWeek: 8, duration: 4, dependencies: ['t7'] },
  { id: 't21', phase: 'Fundraising', name: 'Build target investor list and CRM', owner: 'ir', status: 'not_started', startWeek: 8, duration: 2, dependencies: ['t4'] },
  { id: 't22', phase: 'Fundraising', name: 'Investor outreach and roadshow', owner: 'ir', status: 'not_started', startWeek: 10, duration: 12, dependencies: ['t20', 't21'] },
  { id: 't23', phase: 'Fundraising', name: 'Manage investor due diligence requests', owner: 'ir', status: 'not_started', startWeek: 12, duration: 10, dependencies: ['t22'] },
  { id: 't24', phase: 'Fundraising', name: 'Negotiate and execute side letters', owner: 'legal', status: 'not_started', startWeek: 14, duration: 8, dependencies: ['t14', 't22'] },
  { id: 't25', phase: 'Fundraising', name: 'Process subscription agreements', owner: 'admin', status: 'not_started', startWeek: 16, duration: 8, dependencies: ['t9', 't22'] },

  // Phase 5: Operational Setup (Weeks 12-20)
  { id: 't26', phase: 'Operational Setup', name: 'Open fund bank accounts', owner: 'ops', status: 'not_started', startWeek: 12, duration: 2, dependencies: ['t11'] },
  { id: 't27', phase: 'Operational Setup', name: 'Configure fund admin systems and portal', owner: 'admin', status: 'not_started', startWeek: 12, duration: 4, dependencies: ['t16'] },
  { id: 't28', phase: 'Operational Setup', name: 'Set up portfolio management system', owner: 'ops', status: 'not_started', startWeek: 13, duration: 3, dependencies: ['t26'] },
  { id: 't29', phase: 'Operational Setup', name: 'Implement compliance monitoring', owner: 'compliance', status: 'not_started', startWeek: 14, duration: 3, dependencies: ['t13'] },
  { id: 't30', phase: 'Operational Setup', name: 'Draft operational procedures manual', owner: 'ops', status: 'not_started', startWeek: 14, duration: 4, dependencies: ['t27'] },
  { id: 't31', phase: 'Operational Setup', name: 'FATCA/CRS registration', owner: 'tax', status: 'not_started', startWeek: 12, duration: 2, dependencies: ['t12'] },

  // Phase 6: First Close & Launch (Weeks 20-24)
  { id: 't32', phase: 'Launch', name: 'Final legal document review and execution', owner: 'legal', status: 'not_started', startWeek: 20, duration: 2, dependencies: ['t6', 't8'] },
  { id: 't33', phase: 'Launch', name: 'Investor onboarding and KYC/AML checks', owner: 'admin', status: 'not_started', startWeek: 20, duration: 3, dependencies: ['t25', 't27'] },
  { id: 't34', phase: 'Launch', name: 'First close capital call', owner: 'finance', status: 'not_started', startWeek: 22, duration: 1, dependencies: ['t32', 't33'] },
  { id: 't35', phase: 'Launch', name: 'Go-live: commence investment activities', owner: 'pm', status: 'not_started', startWeek: 23, duration: 1, dependencies: ['t34'] },
  { id: 't36', phase: 'Launch', name: 'Post-close investor communication', owner: 'ir', status: 'not_started', startWeek: 23, duration: 2, dependencies: ['t34'] },
]

export const PHASE_COLORS = {
  'Fund Structuring': '#3b82f6',
  'Legal & Regulatory': '#8b5cf6',
  'Service Providers': '#0891b2',
  'Fundraising': '#d97706',
  'Operational Setup': '#059669',
  'Launch': '#ef4444',
}

export const TASK_STATUSES = [
  { value: 'not_started', label: 'Not Started', color: 'badge-gray' },
  { value: 'in_progress', label: 'In Progress', color: 'badge-blue' },
  { value: 'blocked', label: 'Blocked', color: 'badge-red' },
  { value: 'review', label: 'In Review', color: 'badge-yellow' },
  { value: 'complete', label: 'Complete', color: 'badge-green' },
]
