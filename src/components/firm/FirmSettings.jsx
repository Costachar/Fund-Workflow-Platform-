import { useState } from 'react'
import { useFund } from '../../context/FundContext'
import {
  Building2,
  Palette,
  ShieldCheck,
  Save,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react'

export default function FirmSettings() {
  const { state, dispatch } = useFund()
  const { firm } = state
  const [saveStatus, setSaveStatus] = useState(null)

  const updateFirm = (field, value) => {
    dispatch({ type: 'UPDATE_FIRM', payload: { [field]: value } })
  }

  const updateBranding = (field, value) => {
    dispatch({ type: 'UPDATE_BRANDING', payload: { [field]: value } })
  }

  const handleSave = () => {
    setSaveStatus('saved')
    setTimeout(() => setSaveStatus(null), 2000)
  }

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => dispatch({ type: 'SET_VIEW', payload: 'firm_dashboard' })}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--gray-900)' }}>
                Firm Settings
              </h3>
            </div>
            <button className="btn btn-primary" onClick={handleSave}>
              {saveStatus === 'saved' ? (
                <><CheckCircle size={16} /> Saved</>
              ) : (
                <><Save size={16} /> Save Changes</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Firm Details */}
      <div className="card">
        <div className="card-header">
          <h3>
            <Building2 size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
            Firm Details
          </h3>
        </div>
        <div className="card-body">
          <div className="form-section">
            <h4 className="form-section-title">General Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Firm Name</label>
                <input
                  value={firm.firmName || ''}
                  onChange={(e) => updateFirm('firmName', e.target.value)}
                  placeholder="e.g., Apex Capital Partners"
                />
              </div>
              <div className="form-group">
                <label>Australian Business Number (ABN)</label>
                <input
                  value={firm.firmABN || ''}
                  onChange={(e) => updateFirm('firmABN', e.target.value)}
                  placeholder="e.g., 12 345 678 901"
                />
              </div>
              <div className="form-group">
                <label>AFSL Number</label>
                <input
                  value={firm.afslNumber || ''}
                  onChange={(e) => updateFirm('afslNumber', e.target.value)}
                  placeholder="e.g., 123456"
                />
              </div>
              <div className="form-group">
                <label>AFSL Holder</label>
                <input
                  value={firm.afslHolder || ''}
                  onChange={(e) => updateFirm('afslHolder', e.target.value)}
                  placeholder="e.g., Apex Capital Partners Pty Ltd"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Key Personnel</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Compliance Officer</label>
                <input
                  value={firm.complianceOfficer || ''}
                  onChange={(e) => updateFirm('complianceOfficer', e.target.value)}
                  placeholder="Full name of Compliance Officer"
                />
              </div>
              <div className="form-group">
                <label>Privacy Officer</label>
                <input
                  value={firm.privacyOfficer || ''}
                  onChange={(e) => updateFirm('privacyOfficer', e.target.value)}
                  placeholder="Full name of Privacy Officer"
                />
              </div>
            </div>
          </div>

          <div className="form-section" style={{ marginBottom: 0 }}>
            <h4 className="form-section-title">Contact</h4>
            <div className="form-grid">
              <div className="form-group full-width">
                <label>Registered Address</label>
                <textarea
                  value={firm.registeredAddress || ''}
                  onChange={(e) => updateFirm('registeredAddress', e.target.value)}
                  placeholder="e.g., Level 10, 100 Collins Street, Melbourne VIC 3000"
                  style={{ minHeight: 60 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Branding */}
      <div className="card">
        <div className="card-header">
          <h3>
            <Palette size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
            Branding
          </h3>
        </div>
        <div className="card-body">
          <div className="form-section" style={{ marginBottom: 0 }}>
            <h4 className="form-section-title">Platform Appearance</h4>
            <div className="form-grid">
              <div className="form-group">
                <label>Platform Name</label>
                <input
                  value={firm.branding?.platformName || ''}
                  onChange={(e) => updateBranding('platformName', e.target.value)}
                  placeholder="e.g., FundForge"
                />
              </div>
              <div className="form-group">
                <label>Tagline</label>
                <input
                  value={firm.branding?.tagline || ''}
                  onChange={(e) => updateBranding('tagline', e.target.value)}
                  placeholder="e.g., Investment Fund Platform"
                />
              </div>
              <div className="form-group">
                <label>Logo Text (2 letters)</label>
                <input
                  value={firm.branding?.logoText || ''}
                  onChange={(e) => updateBranding('logoText', e.target.value.slice(0, 2).toUpperCase())}
                  placeholder="e.g., FF"
                  maxLength={2}
                  style={{ width: 80 }}
                />
                <span className="hint">Displayed in the sidebar logo</span>
              </div>
              <div className="form-group">
                <label>Primary Colour</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="color"
                    value={firm.branding?.primaryColor || '#1e40af'}
                    onChange={(e) => updateBranding('primaryColor', e.target.value)}
                    style={{
                      width: 48,
                      height: 36,
                      padding: 2,
                      borderRadius: 6,
                      border: '1px solid var(--gray-300)',
                      cursor: 'pointer',
                    }}
                  />
                  <input
                    value={firm.branding?.primaryColor || '#1e40af'}
                    onChange={(e) => updateBranding('primaryColor', e.target.value)}
                    placeholder="#1e40af"
                    style={{ flex: 1 }}
                  />
                </div>
              </div>
            </div>

            {/* Branding Preview */}
            <div style={{
              marginTop: 20,
              padding: 20,
              background: 'var(--gray-50)',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--gray-200)',
            }}>
              <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-400)', textTransform: 'uppercase', marginBottom: 12 }}>
                Preview
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 36,
                  height: 36,
                  background: `linear-gradient(135deg, ${firm.branding?.primaryColor || '#1e40af'}, ${firm.branding?.primaryColor || '#1e40af'}cc)`,
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: 14,
                }}>
                  {firm.branding?.logoText || 'FF'}
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--gray-900)' }}>
                    {firm.branding?.platformName || 'FundForge'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: -2 }}>
                    {firm.branding?.tagline || 'Investment Fund Platform'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Australian Regulatory */}
      <div className="card">
        <div className="card-header">
          <h3>
            <ShieldCheck size={16} style={{ marginRight: 6, verticalAlign: 'text-bottom' }} />
            Australian Regulatory Compliance
          </h3>
        </div>
        <div className="card-body">
          <div className="form-section">
            <h4 className="form-section-title">AML/CTF Compliance</h4>
            <p className="form-section-desc">
              Anti-Money Laundering and Counter-Terrorism Financing obligations under the AML/CTF Act 2006.
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label>AML/CTF Program Status</label>
                <select
                  value={firm.amlCtfStatus || ''}
                  onChange={(e) => updateFirm('amlCtfStatus', e.target.value)}
                >
                  <option value="">Select status</option>
                  <option value="not_started">Not Started</option>
                  <option value="in_progress">In Progress</option>
                  <option value="implemented">Implemented</option>
                  <option value="under_review">Under Review</option>
                </select>
              </div>
              <div className="form-group">
                <label>AUSTRAC Registration Number</label>
                <input
                  value={firm.austracNumber || ''}
                  onChange={(e) => updateFirm('austracNumber', e.target.value)}
                  placeholder="e.g., 100123456"
                />
              </div>
            </div>
          </div>

          <div className="form-section" style={{ marginBottom: 0 }}>
            <h4 className="form-section-title">Policy & Framework Versions</h4>
            <p className="form-section-desc">
              Track the current versions of your compliance documentation and privacy policies.
            </p>
            <div className="form-grid">
              <div className="form-group">
                <label>Privacy Policy Version</label>
                <input
                  value={firm.privacyPolicyVersion || ''}
                  onChange={(e) => updateFirm('privacyPolicyVersion', e.target.value)}
                  placeholder="e.g., 3.1 - January 2026"
                />
              </div>
              <div className="form-group">
                <label>Compliance Framework Version</label>
                <input
                  value={firm.complianceFrameworkVersion || ''}
                  onChange={(e) => updateFirm('complianceFrameworkVersion', e.target.value)}
                  placeholder="e.g., 2.0 - December 2025"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
