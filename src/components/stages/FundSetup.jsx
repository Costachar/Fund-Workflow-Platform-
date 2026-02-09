import { useState } from 'react'
import { useFund } from '../../context/FundContext'
import { Check } from 'lucide-react'

const SECTIONS = [
  'Fund Structure',
  'Key Parties',
  'Economic Terms',
  'Fund Terms',
  'Investment Strategy',
  'Governance',
  'Fees & Expenses',
  'Distributions',
  'Transfer Restrictions',
  'Reporting',
  'Tax & Regulatory',
]

export default function FundSetup() {
  const { state, dispatch } = useFund()
  const { setup } = state.fundData
  const [activeSection, setActiveSection] = useState(0)

  const update = (field, value) => {
    dispatch({ type: 'UPDATE_SETUP', payload: { [field]: value } })
  }

  const sections = [
    <FundStructure key={0} data={setup} update={update} />,
    <KeyParties key={1} data={setup} update={update} />,
    <EconomicTerms key={2} data={setup} update={update} />,
    <FundTerms key={3} data={setup} update={update} />,
    <InvestmentStrategy key={4} data={setup} update={update} />,
    <Governance key={5} data={setup} update={update} />,
    <FeesExpenses key={6} data={setup} update={update} />,
    <Distributions key={7} data={setup} update={update} />,
    <TransferRestrictions key={8} data={setup} update={update} />,
    <Reporting key={9} data={setup} update={update} />,
    <TaxRegulatory key={10} data={setup} update={update} />,
  ]

  return (
    <div>
      {/* Section Nav */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {SECTIONS.map((section, i) => (
              <button
                key={i}
                className={`btn ${activeSection === i ? 'btn-primary' : 'btn-secondary'} btn-sm`}
                onClick={() => setActiveSection(i)}
              >
                {section}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h3>{SECTIONS[activeSection]}</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            {activeSection > 0 && (
              <button className="btn btn-secondary btn-sm" onClick={() => setActiveSection(activeSection - 1)}>
                Previous
              </button>
            )}
            {activeSection < SECTIONS.length - 1 ? (
              <button className="btn btn-primary btn-sm" onClick={() => setActiveSection(activeSection + 1)}>
                Next Section
              </button>
            ) : (
              <button className="btn btn-success btn-sm" onClick={() => dispatch({ type: 'MARK_STAGE_COMPLETE', payload: 1 })}>
                <Check size={14} /> Mark Complete
              </button>
            )}
          </div>
        </div>
        <div className="card-body">
          {sections[activeSection]}
        </div>
      </div>
    </div>
  )
}

function FundStructure({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Fund Name</label>
        <input value={data.fundName} onChange={(e) => update('fundName', e.target.value)} placeholder="e.g., Apex Ventures Fund I" />
      </div>
      <div className="form-group">
        <label>Legal Entity Type</label>
        <select value={data.legalEntityType} onChange={(e) => update('legalEntityType', e.target.value)}>
          <option>Limited Partnership</option>
          <option>Unit Trust</option>
          <option>Company</option>
          <option>Managed Investment Scheme</option>
        </select>
      </div>
      <div className="form-group">
        <label>Domicile</label>
        <select value={data.domicile} onChange={(e) => update('domicile', e.target.value)}>
          <option>Australia</option>
          <option>Cayman Islands</option>
          <option>Luxembourg</option>
          <option>Singapore</option>
          <option>Other</option>
        </select>
      </div>
      <div className="form-group">
        <label>Fund Type</label>
        <select value={data.fundType} onChange={(e) => update('fundType', e.target.value)}>
          <option value="VC">Venture Capital</option>
          <option value="PE">Private Equity</option>
          <option value="Real Estate">Real Estate</option>
          <option value="Credit">Credit / Debt</option>
          <option value="Infrastructure">Infrastructure</option>
          <option value="Other">Other</option>
        </select>
      </div>
    </div>
  )
}

function KeyParties({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Fund Manager Name</label>
        <input value={data.gpName} onChange={(e) => update('gpName', e.target.value)} placeholder="e.g., Apex Capital Management Pty Ltd" />
      </div>
      <div className="form-group full-width">
        <label>GP Details</label>
        <textarea value={data.gpDetails} onChange={(e) => update('gpDetails', e.target.value)} placeholder="ACN, registered address, key personnel..." />
      </div>
      <div className="form-group">
        <label>Trustee / Responsible Entity</label>
        <input value={data.trustee} onChange={(e) => update('trustee', e.target.value)} placeholder="Entity name" />
      </div>
      <div className="form-group">
        <label>Investment Manager</label>
        <input value={data.investmentManager} onChange={(e) => update('investmentManager', e.target.value)} placeholder="Entity name" />
      </div>
      <div className="form-group">
        <label>Fund Administrator</label>
        <input value={data.fundAdministrator} onChange={(e) => update('fundAdministrator', e.target.value)} placeholder="e.g., Citco, Apex Group" />
      </div>
    </div>
  )
}

function EconomicTerms({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Management Fee Structure</label>
        <select value={data.mgmtFeeStructure} onChange={(e) => update('mgmtFeeStructure', e.target.value)}>
          <option>Committed Capital</option>
          <option>Invested Capital</option>
          <option>NAV</option>
          <option>Stepped (Committed then Invested)</option>
        </select>
      </div>
      <div className="form-group">
        <label>Carry / Performance Fee (%)</label>
        <input type="number" value={data.carryPerformanceFee} onChange={(e) => update('carryPerformanceFee', Number(e.target.value))} min={0} max={50} />
      </div>
      <div className="form-group">
        <label>Hurdle Rate (%)</label>
        <input type="number" value={data.hurdleRate} onChange={(e) => update('hurdleRate', Number(e.target.value))} min={0} max={20} step={0.5} />
      </div>
      <div className="form-group">
        <label>Catch-Up Provision</label>
        <select value={data.catchUp ? 'Yes' : 'No'} onChange={(e) => update('catchUp', e.target.value === 'Yes')}>
          <option>Yes</option>
          <option>No</option>
        </select>
      </div>
      <div className="form-group">
        <label>GP Commitment (%)</label>
        <input type="number" value={data.gpCommit} onChange={(e) => update('gpCommit', Number(e.target.value))} min={0} max={20} step={0.5} />
      </div>
      <div className="form-group">
        <label>Preferred Return (%)</label>
        <input type="number" value={data.preferredReturn} onChange={(e) => update('preferredReturn', Number(e.target.value))} min={0} max={20} step={0.5} />
      </div>
    </div>
  )
}

function FundTerms({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Minimum Fund Size ($)</label>
        <input type="number" value={data.fundSizeMin} onChange={(e) => update('fundSizeMin', e.target.value)} placeholder="e.g., 50000000" />
      </div>
      <div className="form-group">
        <label>Maximum Fund Size ($)</label>
        <input type="number" value={data.fundSizeMax} onChange={(e) => update('fundSizeMax', e.target.value)} placeholder="e.g., 150000000" />
      </div>
      <div className="form-group">
        <label>First Close Date</label>
        <input type="date" value={data.firstCloseDate} onChange={(e) => update('firstCloseDate', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Final Close Date</label>
        <input type="date" value={data.finalCloseDate} onChange={(e) => update('finalCloseDate', e.target.value)} />
      </div>
      <div className="form-group">
        <label>Fund Term (years)</label>
        <input type="number" value={data.fundTerm} onChange={(e) => update('fundTerm', Number(e.target.value))} min={1} max={25} />
      </div>
      <div className="form-group">
        <label>Investment Period (years)</label>
        <input type="number" value={data.investmentPeriod} onChange={(e) => update('investmentPeriod', Number(e.target.value))} min={1} max={15} />
      </div>
      <div className="form-group">
        <label>Extension Options</label>
        <input value={data.extensionOptions} onChange={(e) => update('extensionOptions', e.target.value)} placeholder="e.g., 2 x 1-year extensions" />
      </div>
    </div>
  )
}

function InvestmentStrategy({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Asset Class</label>
        <select value={data.assetClass} onChange={(e) => update('assetClass', e.target.value)}>
          <option>Venture Capital</option>
          <option>Private Equity</option>
          <option>Real Estate</option>
          <option>Credit / Debt</option>
          <option>Infrastructure</option>
          <option>Multi-Asset</option>
        </select>
      </div>
      <div className="form-group">
        <label>Geography</label>
        <input value={data.geography} onChange={(e) => update('geography', e.target.value)} placeholder="e.g., Australia & New Zealand" />
      </div>
      <div className="form-group full-width">
        <label>Stage / Sector Focus</label>
        <textarea value={data.stageSectorFocus} onChange={(e) => update('stageSectorFocus', e.target.value)} placeholder="e.g., Series A-B technology companies in enterprise SaaS, fintech, and healthtech" />
      </div>
      <div className="form-group">
        <label>Minimum Investment Size ($)</label>
        <input type="number" value={data.investmentSizeMin} onChange={(e) => update('investmentSizeMin', e.target.value)} placeholder="e.g., 2000000" />
      </div>
      <div className="form-group">
        <label>Maximum Investment Size ($)</label>
        <input type="number" value={data.investmentSizeMax} onChange={(e) => update('investmentSizeMax', e.target.value)} placeholder="e.g., 15000000" />
      </div>
      <div className="form-group full-width">
        <label>Diversification Limits</label>
        <input value={data.diversificationLimits} onChange={(e) => update('diversificationLimits', e.target.value)} placeholder="e.g., No more than 15% of commitments in a single investment" />
      </div>
    </div>
  )
}

function Governance({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Advisory Board Composition</label>
        <input value={data.advisoryBoardComposition} onChange={(e) => update('advisoryBoardComposition', e.target.value)} placeholder="e.g., 3 LP representatives" />
      </div>
      <div className="form-group full-width">
        <label>LP Consent Rights</label>
        <textarea value={data.lpConsentRights} onChange={(e) => update('lpConsentRights', e.target.value)} placeholder="Matters requiring LP approval: amendments to LPA, changes to investment strategy, extensions..." />
      </div>
      <div className="form-group full-width">
        <label>Key Person Provisions</label>
        <textarea value={data.keyPersonProvisions} onChange={(e) => update('keyPersonProvisions', e.target.value)} placeholder="Key persons, trigger events, and consequences (e.g., suspension of investment period)..." />
      </div>
      <div className="form-group full-width">
        <label>GP Removal Rights</label>
        <textarea value={data.removalRights} onChange={(e) => update('removalRights', e.target.value)} placeholder="Conditions for GP removal, voting thresholds, and process..." />
      </div>
    </div>
  )
}

function FeesExpenses({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group full-width">
        <label>Management Fee Calculation Basis</label>
        <textarea value={data.mgmtFeeCalcBasis} onChange={(e) => update('mgmtFeeCalcBasis', e.target.value)} placeholder="Describe fee basis during investment period and post-investment period..." />
      </div>
      <div className="form-group">
        <label>Organizational Expenses Cap ($)</label>
        <input value={data.organizationalExpenses} onChange={(e) => update('organizationalExpenses', e.target.value)} placeholder="e.g., 500000" />
      </div>
      <div className="form-group">
        <label>Annual Fund Expenses Cap</label>
        <input value={data.fundExpensesCap} onChange={(e) => update('fundExpensesCap', e.target.value)} placeholder="e.g., 0.5% of NAV or $250,000" />
      </div>
    </div>
  )
}

function Distributions({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Distribution Policy</label>
        <select value={data.distributionPolicy} onChange={(e) => update('distributionPolicy', e.target.value)}>
          <option>Deal-by-deal with clawback</option>
          <option>Whole-of-fund (European)</option>
          <option>Hybrid</option>
        </select>
      </div>
      <div className="form-group">
        <label>Distribution Timing</label>
        <input value={data.distributionTiming} onChange={(e) => update('distributionTiming', e.target.value)} placeholder="e.g., Within 30 days of realization" />
      </div>
      <div className="form-group full-width">
        <label>Reinvestment / Recycling Rights</label>
        <textarea value={data.reinvestmentRights} onChange={(e) => update('reinvestmentRights', e.target.value)} placeholder="Describe recycling provisions and limits..." />
      </div>
    </div>
  )
}

function TransferRestrictions({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>LP Transfer Rights</label>
        <select value={data.lpTransferRights} onChange={(e) => update('lpTransferRights', e.target.value)}>
          <option>Subject to GP consent</option>
          <option>Freely transferable</option>
          <option>Prohibited</option>
          <option>Subject to LPAC approval</option>
        </select>
      </div>
      <div className="form-group full-width">
        <label>ROFR / Tag-Along Provisions</label>
        <textarea value={data.rofrTagAlong} onChange={(e) => update('rofrTagAlong', e.target.value)} placeholder="Describe right of first refusal and tag-along provisions..." />
      </div>
      <div className="form-group full-width">
        <label>Assignment Conditions</label>
        <textarea value={data.assignmentConditions} onChange={(e) => update('assignmentConditions', e.target.value)} placeholder="Conditions for assignment of LP interests..." />
      </div>
    </div>
  )
}

function Reporting({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Reporting Frequency</label>
        <select value={data.reportingFrequency} onChange={(e) => update('reportingFrequency', e.target.value)}>
          <option>Monthly</option>
          <option>Quarterly</option>
          <option>Semi-Annual</option>
          <option>Annual</option>
        </select>
      </div>
      <div className="form-group full-width">
        <label>Content Requirements</label>
        <textarea value={data.contentRequirements} onChange={(e) => update('contentRequirements', e.target.value)} placeholder="NAV reports, portfolio summaries, financial statements, ESG reporting..." />
      </div>
      <div className="form-group">
        <label>Audit Requirements</label>
        <input value={data.auditRequirements} onChange={(e) => update('auditRequirements', e.target.value)} placeholder="e.g., Annual audit by Big 4 firm" />
      </div>
    </div>
  )
}

function TaxRegulatory({ data, update }) {
  return (
    <div className="form-grid">
      <div className="form-group">
        <label>Tax Structure</label>
        <select value={data.taxStructure} onChange={(e) => update('taxStructure', e.target.value)}>
          <option>Flow-through (tax transparent)</option>
          <option>Opaque (taxed at entity level)</option>
          <option>Hybrid</option>
        </select>
      </div>
      <div className="form-group">
        <label>Regulatory Registrations</label>
        <input value={data.regulatoryRegistrations} onChange={(e) => update('regulatoryRegistrations', e.target.value)} placeholder="e.g., AFSL, ASIC registration" />
      </div>
      <div className="form-group full-width">
        <label>Compliance Requirements</label>
        <textarea value={data.complianceRequirements} onChange={(e) => update('complianceRequirements', e.target.value)} placeholder="Anti-money laundering, privacy, FATCA/CRS reporting, ESG disclosure obligations..." />
      </div>
    </div>
  )
}
