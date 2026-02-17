import { useState, useMemo } from 'react'
import { useFund } from '../../context/FundContext'
import { calculateFundEconomics } from '../../utils/economics'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

const COLORS = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd']

export default function FundIdeation() {
  const { state, dispatch } = useFund()
  const { ideation } = state.fundData
  const [activeTab, setActiveTab] = useState('inputs')

  const update = (field, value) => {
    dispatch({ type: 'UPDATE_IDEATION', payload: { [field]: value } })
  }

  const economics = useMemo(() => calculateFundEconomics(ideation), [ideation])

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${activeTab === 'inputs' ? 'active' : ''}`} onClick={() => setActiveTab('inputs')}>
          Strategy & Inputs
        </button>
        <button className={`tab ${activeTab === 'economics' ? 'active' : ''}`} onClick={() => setActiveTab('economics')}>
          Economics Calculator
        </button>
        <button className={`tab ${activeTab === 'scenarios' ? 'active' : ''}`} onClick={() => setActiveTab('scenarios')}>
          Scenario Analysis
        </button>
        <button className={`tab ${activeTab === 'summary' ? 'active' : ''}`} onClick={() => setActiveTab('summary')}>
          Business Case Summary
        </button>
      </div>

      {activeTab === 'inputs' && <StrategyInputs ideation={ideation} update={update} />}
      {activeTab === 'economics' && <EconomicsCalculator ideation={ideation} update={update} economics={economics} />}
      {activeTab === 'scenarios' && <ScenarioAnalysis ideation={ideation} update={update} economics={economics} />}
      {activeTab === 'summary' && <BusinessCaseSummary ideation={ideation} economics={economics} dispatch={dispatch} />}
    </div>
  )
}

function StrategyInputs({ ideation, update }) {
  return (
    <div>
      <div className="card">
        <div className="card-header"><h3>Fund Strategy</h3></div>
        <div className="card-body">
          <div className="form-grid">
            <div className="form-group full-width">
              <label>Fund Strategy / Mandate</label>
              <textarea
                value={ideation.fundStrategy}
                onChange={(e) => update('fundStrategy', e.target.value)}
                placeholder="Describe the fund's investment strategy, thesis, and competitive advantages..."
              />
            </div>
            <div className="form-group full-width">
              <label>Investment Thesis</label>
              <textarea
                value={ideation.investmentThesis}
                onChange={(e) => update('investmentThesis', e.target.value)}
                placeholder="Detail the core investment thesis, market opportunity, and return drivers..."
              />
            </div>
            <div className="form-group">
              <label>Target Fund Size ($)</label>
              <input
                type="number"
                value={ideation.fundSize}
                onChange={(e) => update('fundSize', Number(e.target.value))}
              />
              <span className="hint">{formatCurrency(ideation.fundSize)}</span>
            </div>
            <div className="form-group">
              <label>Fund Term (years)</label>
              <input
                type="number"
                value={ideation.fundTerm}
                onChange={(e) => update('fundTerm', Number(e.target.value))}
                min={1} max={25}
              />
            </div>
            <div className="form-group">
              <label>Investment Period (years)</label>
              <input
                type="number"
                value={ideation.investmentPeriod}
                onChange={(e) => update('investmentPeriod', Number(e.target.value))}
                min={1} max={15}
              />
            </div>
            <div className="form-group">
              <label>Target Size</label>
              <input
                value={ideation.targetSize}
                onChange={(e) => update('targetSize', e.target.value)}
                placeholder="e.g., $100M - $150M"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function EconomicsCalculator({ ideation, update, economics }) {
  return (
    <div>
      {/* Interactive Sliders */}
      <div className="card">
        <div className="card-header"><h3>Fund Economics Parameters</h3></div>
        <div className="card-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
            <div className="slider-group">
              <div className="slider-header">
                <label>Management Fee</label>
                <span className="slider-value">{ideation.managementFee}%</span>
              </div>
              <input type="range" min={0} max={5} step={0.1}
                value={ideation.managementFee}
                onChange={(e) => update('managementFee', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Carry Rate</label>
                <span className="slider-value">{ideation.carryRate}%</span>
              </div>
              <input type="range" min={0} max={40} step={1}
                value={ideation.carryRate}
                onChange={(e) => update('carryRate', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Hurdle Rate</label>
                <span className="slider-value">{ideation.hurdleRate}%</span>
              </div>
              <input type="range" min={0} max={15} step={0.5}
                value={ideation.hurdleRate}
                onChange={(e) => update('hurdleRate', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Fund Manager Commitment</label>
                <span className="slider-value">{ideation.gpCommitment}%</span>
              </div>
              <input type="range" min={0} max={10} step={0.5}
                value={ideation.gpCommitment}
                onChange={(e) => update('gpCommitment', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Fund Size</label>
                <span className="slider-value">{formatCurrency(ideation.fundSize)}</span>
              </div>
              <input type="range" min={10000000} max={1000000000} step={5000000}
                value={ideation.fundSize}
                onChange={(e) => update('fundSize', Number(e.target.value))}
              />
            </div>

            <div className="slider-group">
              <div className="slider-header">
                <label>Expected Gross Returns</label>
                <span className="slider-value">{ideation.expectedGrossReturns}%</span>
              </div>
              <input type="range" min={0} max={40} step={0.5}
                value={ideation.expectedGrossReturns}
                onChange={(e) => update('expectedGrossReturns', Number(e.target.value))}
              />
            </div>

            <div className="toggle-group">
              <button
                className={`toggle ${ideation.catchUp ? 'active' : ''}`}
                onClick={() => update('catchUp', !ideation.catchUp)}
              />
              <label style={{ fontSize: 13, fontWeight: 500 }}>Fund Manager Catch-Up Provision</label>
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid" style={{ marginTop: 20 }}>
        <div className="metric-card">
          <div className="metric-label">Total Management Fees</div>
          <div className="metric-value">{formatCurrency(economics.totalMgmtFees)}</div>
          <div className="metric-sub">Over {ideation.fundTerm} year term</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Expected Carry</div>
          <div className="metric-value">{formatCurrency(economics.expectedWaterfall.carry)}</div>
          <div className="metric-sub">At {formatPercent(ideation.expectedGrossReturns)} gross return</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Total Fund Manager Revenue</div>
          <div className="metric-value">{formatCurrency(economics.effectiveGPEconomics.totalGPRevenue)}</div>
          <div className="metric-sub">{formatPercent(economics.effectiveGPEconomics.gpRevenueAsPercentOfFund)} of fund</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Fund Manager Commitment</div>
          <div className="metric-value">{formatCurrency(economics.gpCommitAmount)}</div>
          <div className="metric-sub">{formatPercent(ideation.gpCommitment)} of fund</div>
        </div>
      </div>

      {/* Management Fee Chart */}
      <div className="card">
        <div className="card-header"><h3>Management Fee Accumulation Over Fund Life</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={economics.annualMgmtFees}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="year" label={{ value: 'Year', position: 'insideBottom', offset: -5 }} />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Line type="monotone" dataKey="fee" name="Annual Fee" stroke={COLORS[1]} strokeWidth={2} dot={{ r: 4 }} />
              <Line type="monotone" dataKey="cumulativeFee" name="Cumulative Fees" stroke={COLORS[0]} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Waterfall Distribution */}
      <div className="card">
        <div className="card-header"><h3>Waterfall Distribution (Expected Returns)</h3></div>
        <div className="card-body">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Distribution Step</th>
                  <th className="text-right">Investor Amount</th>
                  <th className="text-right">Fund Manager Amount</th>
                </tr>
              </thead>
              <tbody>
                {economics.expectedWaterfall.waterfall.map((step) => (
                  <tr key={step.step}>
                    <td>{step.step}</td>
                    <td className="text-right">{formatCurrency(step.lp)}</td>
                    <td className="text-right">{formatCurrency(step.gp)}</td>
                  </tr>
                ))}
                <tr style={{ fontWeight: 600 }}>
                  <td>Total</td>
                  <td className="text-right">{formatCurrency(economics.expectedWaterfall.lpProceeds)}</td>
                  <td className="text-right">{formatCurrency(economics.expectedWaterfall.gpProceeds)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

function ScenarioAnalysis({ ideation, update, economics }) {
  return (
    <div>
      <div className="card">
        <div className="card-header"><h3>Adjust Return Scenario</h3></div>
        <div className="card-body">
          <div className="slider-group" style={{ maxWidth: 400 }}>
            <div className="slider-header">
              <label>Expected Gross Returns (Annual)</label>
              <span className="slider-value">{ideation.expectedGrossReturns}%</span>
            </div>
            <input type="range" min={0} max={40} step={0.5}
              value={ideation.expectedGrossReturns}
              onChange={(e) => update('expectedGrossReturns', Number(e.target.value))}
            />
          </div>
        </div>
      </div>

      {/* Carry Under Different Scenarios */}
      <div className="card">
        <div className="card-header"><h3>Carried Interest Under Different Return Scenarios</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={economics.scenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="carry" name="Carried Interest" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* GP vs LP Returns */}
      <div className="card">
        <div className="card-header"><h3>Fund Manager vs Investor Returns</h3></div>
        <div className="card-body">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={economics.scenarios}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="label" />
              <YAxis tickFormatter={(v) => formatCurrency(v)} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="lpProceeds" name="Investor Proceeds" fill={COLORS[0]} radius={[4, 4, 0, 0]} />
              <Bar dataKey="gpProceeds" name="Fund Manager Proceeds" fill={COLORS[2]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Scenario Table */}
      <div className="card">
        <div className="card-header"><h3>Scenario Comparison Table</h3></div>
        <div className="card-body">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th className="text-right">Total Proceeds</th>
                  <th className="text-right">Investor Proceeds</th>
                  <th className="text-right">Fund Manager Proceeds</th>
                  <th className="text-right">Carry</th>
                  <th className="text-right">Investor Multiple</th>
                  <th className="text-right">Fund Manager Multiple</th>
                </tr>
              </thead>
              <tbody>
                {economics.scenarios.map((s) => (
                  <tr key={s.label}>
                    <td>{s.label}</td>
                    <td className="text-right">{formatCurrency(s.totalProceeds)}</td>
                    <td className="text-right">{formatCurrency(s.lpProceeds)}</td>
                    <td className="text-right">{formatCurrency(s.gpProceeds)}</td>
                    <td className="text-right">{formatCurrency(s.carry)}</td>
                    <td className="text-right">{s.lpMultiple.toFixed(2)}x</td>
                    <td className="text-right">{s.gpMultiple.toFixed(2)}x</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GP Economics Pie */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header"><h3>Fund Manager Revenue Breakdown</h3></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Management Fees', value: economics.totalMgmtFees },
                    { name: 'Carried Interest', value: economics.expectedWaterfall.carry },
                  ]}
                  cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill={COLORS[0]} />
                  <Cell fill={COLORS[2]} />
                </Pie>
                <Tooltip formatter={(v) => formatCurrency(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-header"><h3>Effective Fund Manager Economics</h3></div>
          <div className="card-body">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div className="metric-label">Total Management Fees</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(economics.totalMgmtFees)}</div>
                <div className="metric-sub">{formatPercent(economics.effectiveGPEconomics.mgmtFeeAsPercentOfFund)} of fund size</div>
              </div>
              <div>
                <div className="metric-label">Expected Carry</div>
                <div style={{ fontSize: 18, fontWeight: 600 }}>{formatCurrency(economics.expectedWaterfall.carry)}</div>
              </div>
              <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: 12 }}>
                <div className="metric-label">Total Fund Manager Revenue</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--primary)' }}>
                  {formatCurrency(economics.effectiveGPEconomics.totalGPRevenue)}
                </div>
                <div className="metric-sub">{formatPercent(economics.effectiveGPEconomics.gpRevenueAsPercentOfFund)} of fund size</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function BusinessCaseSummary({ ideation, economics, dispatch }) {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h3>Business Case Summary</h3>
          <button className="btn btn-success btn-sm" onClick={() => dispatch({ type: 'MARK_STAGE_COMPLETE', payload: 0 })}>
            Mark Stage Complete
          </button>
        </div>
        <div className="card-body">
          <div className="form-section">
            <h4 className="form-section-title">Fund Overview</h4>
            <div className="form-grid">
              <div><strong>Strategy:</strong> {ideation.fundStrategy || 'Not specified'}</div>
              <div><strong>Target Size:</strong> {formatCurrency(ideation.fundSize)}</div>
              <div><strong>Fund Term:</strong> {ideation.fundTerm} years</div>
              <div><strong>Investment Period:</strong> {ideation.investmentPeriod} years</div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Investment Thesis</h4>
            <p style={{ fontSize: 14, color: 'var(--gray-700)' }}>
              {ideation.investmentThesis || 'Not yet defined. Go to Strategy & Inputs to add your investment thesis.'}
            </p>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Economics Summary</h4>
            <div className="table-container">
              <table>
                <tbody>
                  <tr><td>Management Fee</td><td>{formatPercent(ideation.managementFee)}</td></tr>
                  <tr><td>Carry Rate</td><td>{formatPercent(ideation.carryRate)}</td></tr>
                  <tr><td>Hurdle Rate</td><td>{formatPercent(ideation.hurdleRate)}</td></tr>
                  <tr><td>Fund Manager Catch-Up</td><td>{ideation.catchUp ? 'Yes' : 'No'}</td></tr>
                  <tr><td>Fund Manager Commitment</td><td>{formatPercent(ideation.gpCommitment)} ({formatCurrency(economics.gpCommitAmount)})</td></tr>
                  <tr><td>Total Management Fees</td><td>{formatCurrency(economics.totalMgmtFees)}</td></tr>
                  <tr><td>Expected Carry</td><td>{formatCurrency(economics.expectedWaterfall.carry)}</td></tr>
                  <tr style={{ fontWeight: 600 }}><td>Total Fund Manager Revenue (Expected)</td><td>{formatCurrency(economics.effectiveGPEconomics.totalGPRevenue)}</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Additional Notes</h4>
            <textarea
              className="form-group"
              style={{ width: '100%', minHeight: 100, padding: 12, border: '1px solid var(--gray-300)', borderRadius: 6, fontFamily: 'inherit', fontSize: 14 }}
              value={ideation.businessCaseSummary}
              onChange={(e) => dispatch({ type: 'UPDATE_IDEATION', payload: { businessCaseSummary: e.target.value } })}
              placeholder="Add any additional notes for the business case..."
            />
          </div>
        </div>
      </div>
    </div>
  )
}
