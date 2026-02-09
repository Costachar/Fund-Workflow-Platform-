import { useState } from 'react'
import { useFund, FUND_TYPES } from '../../context/FundContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { ArrowLeft, ArrowRight, Plus, Check, Building2, Users, Layers, Trash2 } from 'lucide-react'

const LEGAL_ENTITY_TYPES = ['Unit Trust', 'Limited Partnership', 'Company', 'Managed Investment Scheme']

const DOMICILES = ['Australia', 'Cayman Islands', 'Luxembourg', 'Singapore', 'New Zealand', 'Other']

const ASSET_CLASSES = ['Venture Capital', 'Private Equity', 'Real Estate', 'Credit / Debt', 'Infrastructure', 'Multi-Asset']

const GEOGRAPHIES = [
  'Australia & New Zealand',
  'Asia Pacific',
  'Global',
  'North America',
  'Europe',
  'Emerging Markets',
]

const FUND_TYPE_ICONS = {
  standard: Building2,
  single_manager_fof: Users,
  multi_manager_fof: Layers,
}

const emptyManager = {
  name: '',
  strategy: '',
  allocation: '',
  abn: '',
  afsl: '',
  managementFee: '',
  performanceFee: '',
}

export default function FundCreation() {
  const { dispatch } = useFund()

  const isFoFType = (type) => type === 'single_manager_fof' || type === 'multi_manager_fof'

  const totalSteps = (fundType) => isFoFType(fundType) ? 5 : 4

  const [currentStep, setCurrentStep] = useState(1)

  // Step 1 fields
  const [fundName, setFundName] = useState('')
  const [legalEntityType, setLegalEntityType] = useState('Unit Trust')
  const [domicile, setDomicile] = useState('Australia')

  // Step 2 fields
  const [fundType, setFundType] = useState('standard')

  // Step 3 fields
  const [fundSize, setFundSize] = useState(100000000)
  const [managementFee, setManagementFee] = useState(2.0)
  const [assetClass, setAssetClass] = useState('Venture Capital')
  const [geography, setGeography] = useState('Australia & New Zealand')
  const [targetInvestors, setTargetInvestors] = useState('')
  const [amitElection, setAmitElection] = useState(true)

  // Step 4 (FoF only) - initial managers
  const [initialManagers, setInitialManagers] = useState([{ ...emptyManager }])

  const steps = isFoFType(fundType)
    ? ['Fund Details', 'Fund Type', 'Quick Setup', 'Underlying Managers', 'Review & Create']
    : ['Fund Details', 'Fund Type', 'Quick Setup', 'Review & Create']

  const addManager = () => {
    setInitialManagers([...initialManagers, { ...emptyManager }])
  }

  const removeManager = (index) => {
    setInitialManagers(initialManagers.filter((_, i) => i !== index))
  }

  const updateManager = (index, field, value) => {
    const updated = [...initialManagers]
    updated[index] = { ...updated[index], [field]: value }
    setInitialManagers(updated)
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return fundName.trim().length > 0
      case 2:
        return !!fundType
      case 3:
        return fundSize > 0
      case 4:
        if (isFoFType(fundType)) {
          // Manager step for FoF - at least one manager with a name
          return initialManagers.some(m => m.name.trim().length > 0)
        }
        return true // Review step for standard
      case 5:
        return true // Review step for FoF
      default:
        return true
    }
  }

  const handleNext = () => {
    if (currentStep < totalSteps(fundType) && canProceed()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const isReviewStep = () => {
    return currentStep === totalSteps(fundType)
  }

  const handleCreate = () => {
    const managers = isFoFType(fundType)
      ? initialManagers
          .filter(m => m.name.trim().length > 0)
          .map((m, i) => ({
            ...m,
            id: 'mgr_' + Date.now() + '_' + i,
            allocation: Number(m.allocation) || 0,
            managementFee: Number(m.managementFee) || 0,
            performanceFee: Number(m.performanceFee) || 0,
            status: 'active',
            contactPerson: '',
            email: '',
            notes: '',
          }))
      : []

    dispatch({
      type: 'CREATE_FUND',
      payload: {
        fundName,
        fundType,
        managers,
        setup: {
          fundName,
          legalEntityType,
          domicile,
          assetClass,
          geography,
          amitElection,
        },
        ideation: {
          fundSize: Number(fundSize),
          managementFee: Number(managementFee),
          fundStrategy: assetClass,
        },
        fundraising: {
          targetInvestors,
        },
      },
    })
  }

  const totalAllocation = initialManagers.reduce((sum, m) => sum + (Number(m.allocation) || 0), 0)

  return (
    <div>
      {/* Step Indicator */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="card-body" style={{ padding: '16px 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {steps.map((step, i) => {
              const stepNum = i + 1
              const isActive = stepNum === currentStep
              const isCompleted = stepNum < currentStep
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', flex: i < steps.length - 1 ? 1 : 'none' }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: stepNum < currentStep ? 'pointer' : 'default',
                    }}
                    onClick={() => stepNum < currentStep && setCurrentStep(stepNum)}
                  >
                    <div style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      fontWeight: 600,
                      flexShrink: 0,
                      background: isCompleted ? 'var(--success)' : isActive ? 'var(--primary)' : 'var(--gray-200)',
                      color: isCompleted || isActive ? 'white' : 'var(--gray-500)',
                      transition: 'all 0.2s ease',
                    }}>
                      {isCompleted ? <Check size={14} /> : stepNum}
                    </div>
                    <span style={{
                      fontSize: 13,
                      fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--gray-900)' : 'var(--gray-500)',
                      whiteSpace: 'nowrap',
                    }}>
                      {step}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div style={{
                      flex: 1,
                      height: 2,
                      background: isCompleted ? 'var(--success)' : 'var(--gray-200)',
                      margin: '0 12px',
                      minWidth: 20,
                      transition: 'background 0.2s ease',
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="card">
        <div className="card-header">
          <h3>{steps[currentStep - 1]}</h3>
          <span className="badge badge-blue">Step {currentStep} of {totalSteps(fundType)}</span>
        </div>
        <div className="card-body">
          {currentStep === 1 && <StepFundDetails
            fundName={fundName}
            setFundName={setFundName}
            legalEntityType={legalEntityType}
            setLegalEntityType={setLegalEntityType}
            domicile={domicile}
            setDomicile={setDomicile}
          />}
          {currentStep === 2 && <StepFundType
            fundType={fundType}
            setFundType={setFundType}
          />}
          {currentStep === 3 && <StepQuickSetup
            fundSize={fundSize}
            setFundSize={setFundSize}
            managementFee={managementFee}
            setManagementFee={setManagementFee}
            assetClass={assetClass}
            setAssetClass={setAssetClass}
            geography={geography}
            setGeography={setGeography}
            targetInvestors={targetInvestors}
            setTargetInvestors={setTargetInvestors}
            amitElection={amitElection}
            setAmitElection={setAmitElection}
          />}
          {currentStep === 4 && isFoFType(fundType) && <StepManagers
            fundType={fundType}
            managers={initialManagers}
            addManager={addManager}
            removeManager={removeManager}
            updateManager={updateManager}
            totalAllocation={totalAllocation}
          />}
          {isReviewStep() && <StepReview
            fundName={fundName}
            legalEntityType={legalEntityType}
            domicile={domicile}
            fundType={fundType}
            fundSize={fundSize}
            managementFee={managementFee}
            assetClass={assetClass}
            geography={geography}
            targetInvestors={targetInvestors}
            amitElection={amitElection}
            managers={isFoFType(fundType) ? initialManagers.filter(m => m.name.trim()) : []}
          />}
        </div>
      </div>

      {/* Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 20 }}>
        <button
          className="btn btn-secondary"
          onClick={handleBack}
          disabled={currentStep === 1}
          style={{ opacity: currentStep === 1 ? 0.5 : 1 }}
        >
          <ArrowLeft size={16} /> Back
        </button>
        {isReviewStep() ? (
          <button
            className="btn btn-primary btn-lg"
            onClick={handleCreate}
            disabled={!canProceed()}
          >
            <Check size={18} /> Create Fund
          </button>
        ) : (
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!canProceed()}
            style={{ opacity: canProceed() ? 1 : 0.5 }}
          >
            Next <ArrowRight size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

function StepFundDetails({ fundName, setFundName, legalEntityType, setLegalEntityType, domicile, setDomicile }) {
  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>
        Enter the basic details for your new fund. These can be updated later in Fund Setup.
      </p>
      <div className="form-grid">
        <div className="form-group full-width">
          <label>Fund Name</label>
          <input
            value={fundName}
            onChange={(e) => setFundName(e.target.value)}
            placeholder="e.g., Apex Ventures Fund I"
            autoFocus
          />
          <span className="hint">Choose a distinctive name for your fund</span>
        </div>
        <div className="form-group">
          <label>Legal Entity Type</label>
          <select value={legalEntityType} onChange={(e) => setLegalEntityType(e.target.value)}>
            {LEGAL_ENTITY_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Domicile</label>
          <select value={domicile} onChange={(e) => setDomicile(e.target.value)}>
            {DOMICILES.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function StepFundType({ fundType, setFundType }) {
  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>
        Select the fund structure that best matches your investment strategy.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {Object.entries(FUND_TYPES).map(([key, typeInfo]) => {
          const isSelected = fundType === key
          const Icon = FUND_TYPE_ICONS[key]
          return (
            <div
              key={key}
              onClick={() => setFundType(key)}
              style={{
                border: `2px solid ${isSelected ? 'var(--primary)' : 'var(--gray-200)'}`,
                borderRadius: 'var(--radius)',
                padding: 24,
                cursor: 'pointer',
                background: isSelected ? 'var(--primary-50)' : 'white',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: isSelected ? 'var(--primary)' : 'var(--gray-100)',
                color: isSelected ? 'white' : 'var(--gray-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                transition: 'all 0.2s ease',
              }}>
                <Icon size={22} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <h4 style={{ fontSize: 15, fontWeight: 600, color: 'var(--gray-900)' }}>
                  {typeInfo.label}
                </h4>
                {isSelected && (
                  <span className="badge badge-blue">Selected</span>
                )}
              </div>
              <p style={{ fontSize: 13, color: 'var(--gray-500)', lineHeight: 1.5 }}>
                {typeInfo.description}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StepQuickSetup({
  fundSize, setFundSize,
  managementFee, setManagementFee,
  assetClass, setAssetClass,
  geography, setGeography,
  targetInvestors, setTargetInvestors,
  amitElection, setAmitElection,
}) {
  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>
        Configure the key parameters for your fund. All fields can be refined later.
      </p>
      <div className="form-grid">
        <div className="form-group">
          <label>Target Fund Size ($)</label>
          <input
            type="number"
            value={fundSize}
            onChange={(e) => setFundSize(Number(e.target.value))}
            placeholder="e.g., 100000000"
            min={0}
          />
          <span className="hint">{formatCurrency(fundSize)}</span>
        </div>
        <div className="form-group">
          <label>Management Fee (%)</label>
          <input
            type="number"
            value={managementFee}
            onChange={(e) => setManagementFee(Number(e.target.value))}
            min={0}
            max={10}
            step={0.1}
          />
          <span className="hint">{formatPercent(managementFee)} per annum</span>
        </div>
        <div className="form-group">
          <label>Asset Class</label>
          <select value={assetClass} onChange={(e) => setAssetClass(e.target.value)}>
            {ASSET_CLASSES.map(ac => (
              <option key={ac} value={ac}>{ac}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Geography</label>
          <select value={geography} onChange={(e) => setGeography(e.target.value)}>
            {GEOGRAPHIES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
        <div className="form-group full-width">
          <label>Target Investors</label>
          <input
            value={targetInvestors}
            onChange={(e) => setTargetInvestors(e.target.value)}
            placeholder="e.g., Superannuation funds, family offices, HNW individuals"
          />
        </div>
        <div className="form-group">
          <label>AMIT Election</label>
          <div className="toggle-group">
            <button
              className={`toggle ${amitElection ? 'active' : ''}`}
              onClick={() => setAmitElection(!amitElection)}
              type="button"
            />
            <span style={{ fontSize: 14, color: 'var(--gray-700)' }}>
              {amitElection ? 'Elected' : 'Not Elected'}
            </span>
          </div>
          <span className="hint">Attribution Managed Investment Trust election for tax purposes</span>
        </div>
      </div>
    </div>
  )
}

function StepManagers({ fundType, managers, addManager, removeManager, updateManager, totalAllocation }) {
  const isSingleManager = fundType === 'single_manager_fof'
  const showAddWarning = isSingleManager && managers.length >= 1 && managers.some(m => m.name.trim())

  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 16 }}>
        Add the initial underlying manager{isSingleManager ? '' : 's'} for your fund of funds structure.
        {!isSingleManager && ' You can add more managers later.'}
      </p>

      {totalAllocation > 100 && (
        <div style={{
          background: 'var(--danger-50)',
          border: '1px solid var(--danger)',
          borderRadius: 'var(--radius)',
          padding: '10px 16px',
          marginBottom: 16,
          fontSize: 13,
          color: 'var(--danger)',
          fontWeight: 500,
        }}>
          Total allocation is {formatPercent(totalAllocation)} -- exceeds 100%. Please adjust allocations.
        </div>
      )}

      {managers.map((manager, index) => (
        <div
          key={index}
          className="card"
          style={{ marginBottom: 16, border: '1px solid var(--gray-200)' }}
        >
          <div className="card-header">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Users size={16} />
              Underlying Manager {index + 1}
            </h3>
            {managers.length > 1 && (
              <button className="btn btn-danger btn-sm" onClick={() => removeManager(index)}>
                <Trash2 size={12} /> Remove
              </button>
            )}
          </div>
          <div className="card-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Manager Name</label>
                <input
                  value={manager.name}
                  onChange={(e) => updateManager(index, 'name', e.target.value)}
                  placeholder="e.g., Pinnacle Investment Management"
                />
              </div>
              <div className="form-group">
                <label>Strategy</label>
                <input
                  value={manager.strategy}
                  onChange={(e) => updateManager(index, 'strategy', e.target.value)}
                  placeholder="e.g., Australian Equities Growth"
                />
              </div>
              <div className="form-group">
                <label>Allocation (%)</label>
                <input
                  type="number"
                  value={manager.allocation}
                  onChange={(e) => updateManager(index, 'allocation', e.target.value)}
                  placeholder="e.g., 30"
                  min={0}
                  max={100}
                />
              </div>
              <div className="form-group">
                <label>ABN</label>
                <input
                  value={manager.abn}
                  onChange={(e) => updateManager(index, 'abn', e.target.value)}
                  placeholder="e.g., 12 345 678 901"
                />
              </div>
              <div className="form-group">
                <label>AFSL Number</label>
                <input
                  value={manager.afsl}
                  onChange={(e) => updateManager(index, 'afsl', e.target.value)}
                  placeholder="e.g., 123456"
                />
              </div>
              <div className="form-group">
                <label>Management Fee (%)</label>
                <input
                  type="number"
                  value={manager.managementFee}
                  onChange={(e) => updateManager(index, 'managementFee', e.target.value)}
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
                  value={manager.performanceFee}
                  onChange={(e) => updateManager(index, 'performanceFee', e.target.value)}
                  min={0}
                  max={50}
                  step={0.5}
                  placeholder="e.g., 20"
                />
              </div>
            </div>
          </div>
        </div>
      ))}

      {showAddWarning && (
        <div style={{
          background: 'var(--warning-50)',
          border: '1px solid var(--warning)',
          borderRadius: 'var(--radius)',
          padding: '10px 16px',
          marginBottom: 12,
          fontSize: 13,
          color: 'var(--warning)',
          fontWeight: 500,
        }}>
          Single Manager Fund of Funds structure is designed for one underlying manager.
          Consider using Multi-Manager FoF if you need multiple managers.
        </div>
      )}

      {(!isSingleManager || managers.length === 0) && (
        <button className="btn btn-secondary" onClick={addManager}>
          <Plus size={16} /> Add Another Manager
        </button>
      )}

      {managers.some(m => m.name.trim()) && (
        <div style={{ marginTop: 16, fontSize: 13, color: 'var(--gray-500)' }}>
          Total Allocation: <strong style={{ color: totalAllocation > 100 ? 'var(--danger)' : 'var(--gray-800)' }}>
            {formatPercent(totalAllocation)}
          </strong>
          {totalAllocation > 0 && totalAllocation <= 100 && (
            <span> -- {formatPercent(100 - totalAllocation)} unallocated</span>
          )}
        </div>
      )}
    </div>
  )
}

function StepReview({
  fundName, legalEntityType, domicile, fundType,
  fundSize, managementFee, assetClass, geography,
  targetInvestors, amitElection, managers,
}) {
  const typeInfo = FUND_TYPES[fundType]

  return (
    <div>
      <p style={{ fontSize: 14, color: 'var(--gray-500)', marginBottom: 20 }}>
        Review your fund configuration below. Click "Create Fund" to proceed.
      </p>

      {/* Fund Details Summary */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--gray-200)' }}>
          Fund Details
        </h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Fund Name</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{fundName}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Legal Entity</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{legalEntityType}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Domicile</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{domicile}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Fund Type</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{typeInfo.label}</div>
          </div>
        </div>
      </div>

      {/* Fund Parameters */}
      <div style={{ marginBottom: 24 }}>
        <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--gray-200)' }}>
          Fund Parameters
        </h4>
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-label">Target Fund Size</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{formatCurrency(fundSize)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Management Fee</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{formatPercent(managementFee)}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Asset Class</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{assetClass}</div>
          </div>
          <div className="metric-card">
            <div className="metric-label">Geography</div>
            <div className="metric-value" style={{ fontSize: 18 }}>{geography}</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 20, marginTop: 12 }}>
          {targetInvestors && (
            <div style={{ fontSize: 13 }}>
              <span style={{ color: 'var(--gray-500)' }}>Target Investors: </span>
              <span style={{ color: 'var(--gray-800)', fontWeight: 500 }}>{targetInvestors}</span>
            </div>
          )}
          <div style={{ fontSize: 13 }}>
            <span style={{ color: 'var(--gray-500)' }}>AMIT Election: </span>
            <span className={`badge ${amitElection ? 'badge-green' : 'badge-gray'}`}>
              {amitElection ? 'Elected' : 'Not Elected'}
            </span>
          </div>
        </div>
      </div>

      {/* Managers Summary (FoF only) */}
      {managers.length > 0 && (
        <div>
          <h4 style={{ fontSize: 14, fontWeight: 600, color: 'var(--gray-900)', marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--gray-200)' }}>
            Underlying Managers ({managers.length})
          </h4>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Manager Name</th>
                  <th>Strategy</th>
                  <th>Allocation</th>
                  <th>Management Fee</th>
                  <th>Performance Fee</th>
                  <th>ABN</th>
                  <th>AFSL</th>
                </tr>
              </thead>
              <tbody>
                {managers.map((m, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{m.name}</td>
                    <td>{m.strategy || '-'}</td>
                    <td>{m.allocation ? formatPercent(Number(m.allocation)) : '-'}</td>
                    <td>{m.managementFee ? formatPercent(Number(m.managementFee)) : '-'}</td>
                    <td>{m.performanceFee ? formatPercent(Number(m.performanceFee)) : '-'}</td>
                    <td style={{ fontSize: 13 }}>{m.abn || '-'}</td>
                    <td style={{ fontSize: 13 }}>{m.afsl || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--gray-500)' }}>
            Total Allocation: <strong>{formatPercent(managers.reduce((sum, m) => sum + (Number(m.allocation) || 0), 0))}</strong>
          </div>
        </div>
      )}
    </div>
  )
}
