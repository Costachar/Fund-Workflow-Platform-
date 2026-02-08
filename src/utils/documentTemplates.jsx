import { formatCurrency, formatPercent, formatDate } from './formatters'

export const DOCUMENT_TYPES = {
  termSheet: {
    id: 'termSheet',
    name: 'Term Sheet',
    description: 'Professional multi-page term sheet with all key commercial and legal terms',
    category: 'Legal',
  },
  ima: {
    id: 'ima',
    name: 'Investment Management Agreement',
    description: 'Outline of agreement between fund and investment manager',
    category: 'Legal',
  },
  lpa: {
    id: 'lpa',
    name: 'Limited Partnership Agreement',
    description: 'Key sections pre-populated with table of contents and key clauses',
    category: 'Legal',
  },
  subscription: {
    id: 'subscription',
    name: 'Subscription Agreement',
    description: 'Template for LP commitments with fund-specific terms',
    category: 'Legal',
  },
  sideLetter: {
    id: 'sideLetter',
    name: 'Side Letter Template',
    description: 'Standard provisions with customizable fields',
    category: 'Legal',
  },
  serviceProviderBrief: {
    id: 'serviceProviderBrief',
    name: 'Service Provider Brief',
    description: 'Summary document for fund administrator, custodian, auditor',
    category: 'Operational',
  },
  asicChecklist: {
    id: 'asicChecklist',
    name: 'ASIC Registration Checklist',
    description: 'Customized checklist based on fund type',
    category: 'Regulatory',
  },
  infoMemo: {
    id: 'infoMemo',
    name: 'Information Memorandum',
    description: 'Investor-facing document pre-populated with fund details',
    category: 'Fundraising',
  },
}

export function generateTermSheet(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[GP Name]'

  return (
    <div className="doc-preview">
      <div className="doc-confidential">CONFIDENTIAL</div>
      <div className="doc-header">
        <h1>{fundName}</h1>
        <p>Summary of Indicative Terms</p>
        <p>Prepared by {gpName}</p>
      </div>

      <p style={{ fontStyle: 'italic', fontSize: 12, color: 'var(--gray-500)', marginBottom: 20 }}>
        This Term Sheet is for discussion purposes only and does not constitute a binding agreement.
        It is intended to outline the principal terms upon which {gpName} proposes to establish and manage {fundName}.
        All terms are subject to negotiation and execution of definitive legal documentation.
      </p>

      <h2>1. Fund Overview</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Fund Name</td><td>{fundName}</td></tr>
        <tr><td style={{fontWeight:600}}>Legal Structure</td><td>{setup.legalEntityType || 'Limited Partnership'}</td></tr>
        <tr><td style={{fontWeight:600}}>Domicile</td><td>{setup.domicile || 'Australia'}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Type</td><td>{setup.fundType || 'Venture Capital'}</td></tr>
        <tr><td style={{fontWeight:600}}>General Partner</td><td>{gpName}</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Manager</td><td>{setup.investmentManager || '[Investment Manager]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Trustee / RE</td><td>{setup.trustee || '[Trustee]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Administrator</td><td>{setup.fundAdministrator || '[Fund Administrator]'}</td></tr>
      </tbody></table>

      <h2>2. Investment Strategy</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Asset Class</td><td>{setup.assetClass || 'Venture Capital'}</td></tr>
        <tr><td style={{fontWeight:600}}>Geography</td><td>{setup.geography || 'Australia & New Zealand'}</td></tr>
        <tr><td style={{fontWeight:600}}>Stage / Sector Focus</td><td>{setup.stageSectorFocus || '[To be determined]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Size Range</td><td>{setup.investmentSizeMin ? `${formatCurrency(setup.investmentSizeMin)} - ${formatCurrency(setup.investmentSizeMax)}` : '[TBD]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Diversification</td><td>{setup.diversificationLimits || 'No more than 15% of commitments in a single investment'}</td></tr>
      </tbody></table>

      <p style={{marginTop:12}}>
        <strong>Investment Thesis:</strong> {ideation.investmentThesis || 'The Fund will pursue a strategy of investing in high-growth companies within its target market, seeking to generate superior risk-adjusted returns through active portfolio management and strategic value creation.'}
      </p>

      <h2>3. Economic Terms</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Target Fund Size</td><td>{formatCurrency(ideation.fundSize)}</td></tr>
        <tr><td style={{fontWeight:600}}>Minimum Fund Size</td><td>{setup.fundSizeMin ? formatCurrency(setup.fundSizeMin) : '[TBD]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Maximum Fund Size</td><td>{setup.fundSizeMax ? formatCurrency(setup.fundSizeMax) : '[TBD]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Management Fee</td><td>{formatPercent(ideation.managementFee)} per annum</td></tr>
        <tr><td style={{fontWeight:600}}>Fee Basis</td><td>{setup.mgmtFeeStructure || 'Committed Capital during investment period, then invested capital'}</td></tr>
        <tr><td style={{fontWeight:600}}>Carried Interest</td><td>{formatPercent(setup.carryPerformanceFee || ideation.carryRate)} of net profits</td></tr>
        <tr><td style={{fontWeight:600}}>Hurdle Rate</td><td>{formatPercent(setup.hurdleRate || ideation.hurdleRate)} preferred return</td></tr>
        <tr><td style={{fontWeight:600}}>Catch-Up</td><td>{(setup.catchUp ?? ideation.catchUp) ? '100% to GP until carried interest equals ' + formatPercent(setup.carryPerformanceFee || ideation.carryRate) + ' of total profits' : 'None'}</td></tr>
        <tr><td style={{fontWeight:600}}>GP Commitment</td><td>{formatPercent(setup.gpCommit || ideation.gpCommitment)} of total commitments</td></tr>
        <tr><td style={{fontWeight:600}}>Preferred Return</td><td>{formatPercent(setup.preferredReturn)} per annum, compounded annually</td></tr>
      </tbody></table>

      <h2>4. Fund Terms & Structure</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Fund Term</td><td>{setup.fundTerm || ideation.fundTerm} years from final close</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Period</td><td>{setup.investmentPeriod || ideation.investmentPeriod} years from final close</td></tr>
        <tr><td style={{fontWeight:600}}>Extensions</td><td>{setup.extensionOptions || '2 x 1-year extensions subject to LPAC approval'}</td></tr>
        <tr><td style={{fontWeight:600}}>First Close</td><td>{setup.firstCloseDate ? formatDate(setup.firstCloseDate) : '[TBD]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Final Close</td><td>{setup.finalCloseDate ? formatDate(setup.finalCloseDate) : '12 months after first close'}</td></tr>
      </tbody></table>

      <h2>5. Distribution Waterfall</h2>
      <p>Distributions of net proceeds from investments shall be made in the following order of priority:</p>
      <p><strong>Step 1 - Return of Capital:</strong> 100% to all Partners pro rata until each Partner has received an amount equal to its aggregate capital contributions in respect of realized investments and fund expenses.</p>
      <p><strong>Step 2 - Preferred Return:</strong> 100% to Limited Partners until they have received a {formatPercent(setup.preferredReturn)} per annum preferred return on their capital contributions.</p>
      <p><strong>Step 3 - GP Catch-Up:</strong> {(setup.catchUp ?? ideation.catchUp) ? `100% to the General Partner until the General Partner has received ${formatPercent(setup.carryPerformanceFee || ideation.carryRate)} of all amounts distributed in Steps 2 and 3.` : 'Not applicable.'}</p>
      <p><strong>Step 4 - Carried Interest:</strong> {formatPercent(100 - (setup.carryPerformanceFee || ideation.carryRate))}% to Limited Partners and {formatPercent(setup.carryPerformanceFee || ideation.carryRate)}% to the General Partner.</p>

      <h2>6. Governance</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Advisory Board</td><td>{setup.advisoryBoardComposition || '3 LP representatives appointed by GP'}</td></tr>
        <tr><td style={{fontWeight:600}}>LP Consent Rights</td><td>{setup.lpConsentRights || 'Material amendments to LPA, changes to investment strategy, extensions, key person changes'}</td></tr>
        <tr><td style={{fontWeight:600}}>Key Person</td><td>{setup.keyPersonProvisions || 'Suspension of investment period if key persons cease to devote substantially all business time to the Fund'}</td></tr>
        <tr><td style={{fontWeight:600}}>GP Removal</td><td>{setup.removalRights || '75% in interest of LPs, with or without cause'}</td></tr>
      </tbody></table>

      <h2>7. Fees & Expenses</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Organizational Expenses</td><td>{setup.organizationalExpenses ? formatCurrency(setup.organizationalExpenses) : 'Capped at $500,000'}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Expenses</td><td>{setup.fundExpensesCap || 'All reasonable expenses incurred in connection with the operation of the Fund'}</td></tr>
        <tr><td style={{fontWeight:600}}>Fee Calculation</td><td>{setup.mgmtFeeCalcBasis || 'Committed Capital during investment period, then invested capital'}</td></tr>
      </tbody></table>

      <h2>8. Transfers & Reporting</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>LP Transfers</td><td>{setup.lpTransferRights || 'Subject to GP consent'}</td></tr>
        <tr><td style={{fontWeight:600}}>ROFR</td><td>{setup.rofrTagAlong || 'ROFR in favor of existing LPs'}</td></tr>
        <tr><td style={{fontWeight:600}}>Reporting</td><td>{setup.reportingFrequency || 'Quarterly'} reports including {setup.contentRequirements || 'NAV, portfolio summary, financial statements'}</td></tr>
        <tr><td style={{fontWeight:600}}>Audit</td><td>{setup.auditRequirements || 'Annual audit by Big 4 firm'}</td></tr>
      </tbody></table>

      <h2>9. Tax & Regulatory</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Tax Structure</td><td>{setup.taxStructure || 'Flow-through (tax transparent)'}</td></tr>
        <tr><td style={{fontWeight:600}}>Registrations</td><td>{setup.regulatoryRegistrations || 'AFSL, ASIC registration'}</td></tr>
      </tbody></table>

      <div className="doc-footer">
        <p>This document is strictly confidential and is intended solely for the use of the recipient.</p>
        <p>{fundName} | {gpName} | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateServiceProviderBrief(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'

  return (
    <div className="doc-preview">
      <div className="doc-header">
        <h1>Service Provider Brief</h1>
        <p>{fundName}</p>
      </div>

      <h2>1. Fund Overview</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Fund Name</td><td>{fundName}</td></tr>
        <tr><td style={{fontWeight:600}}>Structure</td><td>{setup.legalEntityType}</td></tr>
        <tr><td style={{fontWeight:600}}>Domicile</td><td>{setup.domicile}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Type</td><td>{setup.fundType}</td></tr>
        <tr><td style={{fontWeight:600}}>Target Size</td><td>{formatCurrency(ideation.fundSize)}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Term</td><td>{setup.fundTerm} years</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Period</td><td>{setup.investmentPeriod} years</td></tr>
      </tbody></table>

      <h2>2. Key Parties</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>General Partner</td><td>{setup.gpName || '[GP Name]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Manager</td><td>{setup.investmentManager || '[IM Name]'}</td></tr>
        <tr><td style={{fontWeight:600}}>Trustee / RE</td><td>{setup.trustee || '[Trustee]'}</td></tr>
      </tbody></table>

      <h2>3. Operational Requirements</h2>

      <h3>Fund Administration</h3>
      <p>The Fund Administrator will be required to provide the following services:</p>
      <ul style={{paddingLeft: 20, marginBottom: 12}}>
        <li>Investor onboarding and AML/KYC verification</li>
        <li>Capital call and distribution processing</li>
        <li>NAV calculation and reporting ({setup.reportingFrequency || 'Quarterly'})</li>
        <li>Investor communications and portal management</li>
        <li>Regulatory reporting (FATCA/CRS compliance)</li>
        <li>Partnership accounting and bookkeeping</li>
        <li>Waterfall and carry calculations</li>
      </ul>

      <h3>Custody</h3>
      <p>The Custodian will be required to:</p>
      <ul style={{paddingLeft: 20, marginBottom: 12}}>
        <li>Safekeep fund assets</li>
        <li>Process settlement of transactions</li>
        <li>Maintain segregated accounts</li>
        <li>Provide regular custody statements</li>
      </ul>

      <h3>Audit</h3>
      <p>The Auditor will be required to:</p>
      <ul style={{paddingLeft: 20, marginBottom: 12}}>
        <li>Conduct annual audit of the Fund financial statements</li>
        <li>Provide audit opinion in accordance with Australian Auditing Standards</li>
        <li>Tax compliance and advisory services</li>
        <li>Estimated number of investors: 20-50</li>
      </ul>

      <h2>4. Reporting Requirements</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Frequency</td><td>{setup.reportingFrequency || 'Quarterly'}</td></tr>
        <tr><td style={{fontWeight:600}}>Content</td><td>{setup.contentRequirements || 'NAV, portfolio summary, financial statements'}</td></tr>
        <tr><td style={{fontWeight:600}}>Audit</td><td>{setup.auditRequirements || 'Annual audit'}</td></tr>
        <tr><td style={{fontWeight:600}}>Regulatory</td><td>ASIC, ATO, FATCA/CRS as applicable</td></tr>
      </tbody></table>

      <h2>5. Expected Timeline</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Service Provider Selection</td><td>{setup.firstCloseDate ? 'Prior to first close' : 'TBD'}</td></tr>
        <tr><td style={{fontWeight:600}}>First Close Target</td><td>{setup.firstCloseDate ? formatDate(setup.firstCloseDate) : 'TBD'}</td></tr>
        <tr><td style={{fontWeight:600}}>Final Close</td><td>{setup.finalCloseDate ? formatDate(setup.finalCloseDate) : 'TBD'}</td></tr>
      </tbody></table>

      <div className="doc-footer">
        <p>{fundName} | Service Provider Brief | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateSubscriptionAgreement(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[GP Name]'

  return (
    <div className="doc-preview">
      <div className="doc-confidential">CONFIDENTIAL</div>
      <div className="doc-header">
        <h1>Subscription Agreement</h1>
        <p>{fundName}</p>
      </div>

      <p><strong>TO:</strong> {gpName} (the "General Partner")</p>
      <p><strong>RE:</strong> Subscription for interests in {fundName} (the "Fund")</p>

      <h2>1. Subscription</h2>
      <p>The undersigned (the "Investor") hereby irrevocably subscribes for limited partnership interests in the Fund and agrees to make a Capital Commitment to the Fund in the amount set forth below, subject to the terms and conditions of the Limited Partnership Agreement dated [__________] (the "Partnership Agreement").</p>

      <h3>Investor Details</h3>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Full Legal Name</td><td>___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>Entity Type</td><td>___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>ABN/ACN</td><td>___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>Registered Address</td><td>___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>Contact Person</td><td>___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>Email</td><td>___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>Phone</td><td>___________________________________</td></tr>
      </tbody></table>

      <h3>Commitment Amount</h3>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Capital Commitment (AUD)</td><td>$ ___________________________________</td></tr>
        <tr><td style={{fontWeight:600}}>Minimum Commitment</td><td>{formatCurrency(fundData.fundraising?.minimumCommitment || 1000000)}</td></tr>
      </tbody></table>

      <h2>2. Representations and Warranties</h2>
      <p>The Investor hereby represents and warrants to the General Partner as follows:</p>

      <p><strong>(a) Wholesale Client:</strong> The Investor is a "wholesale client" within the meaning of section 761G of the Corporations Act 2001 (Cth) and is not acquiring interests in the Fund as a retail client.</p>

      <p><strong>(b) Sophisticated Investor:</strong> The Investor qualifies as a "sophisticated investor" under section 708(8) of the Corporations Act 2001 (Cth), having net assets of at least $2.5 million or gross income for each of the last two financial years of at least $250,000.</p>

      <p><strong>(c) Authority:</strong> The Investor has full power and authority to execute and deliver this Subscription Agreement and to perform its obligations hereunder.</p>

      <p><strong>(d) Own Account:</strong> The Investor is acquiring interests in the Fund for its own account and not with a view to distribution or resale.</p>

      <p><strong>(e) AML/CTF:</strong> The Investor is not, and is not acting on behalf of, a person or entity that is subject to sanctions under Australian law or any applicable anti-money laundering legislation.</p>

      <p><strong>(f) Tax:</strong> The Investor has sought independent tax advice regarding the implications of investing in the Fund and understands that the Fund is structured as a {setup.taxStructure || 'flow-through'} entity for Australian tax purposes.</p>

      <p><strong>(g) Risks:</strong> The Investor has read and understood the Information Memorandum and is aware of the risks associated with investing in the Fund, including the risk of loss of the entire investment.</p>

      <h2>3. Capital Calls</h2>
      <p>The Investor acknowledges and agrees that:</p>
      <ul style={{paddingLeft: 20, marginBottom: 12}}>
        <li>Capital Contributions will be drawn down by the General Partner as needed during the Investment Period of {setup.investmentPeriod || ideation.investmentPeriod} years;</li>
        <li>The General Partner will provide not less than 10 business days' notice of each capital call;</li>
        <li>Failure to meet a capital call may result in default provisions being applied as set out in the Partnership Agreement.</li>
      </ul>

      <h2>4. Fund Terms Acknowledgment</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Management Fee</td><td>{formatPercent(ideation.managementFee)} per annum</td></tr>
        <tr><td style={{fontWeight:600}}>Carried Interest</td><td>{formatPercent(setup.carryPerformanceFee || ideation.carryRate)}</td></tr>
        <tr><td style={{fontWeight:600}}>Hurdle Rate</td><td>{formatPercent(setup.hurdleRate || ideation.hurdleRate)}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Term</td><td>{setup.fundTerm || ideation.fundTerm} years</td></tr>
        <tr><td style={{fontWeight:600}}>Distributions</td><td>{setup.distributionPolicy || 'Deal-by-deal with clawback'}</td></tr>
      </tbody></table>

      <h2>5. Governing Law</h2>
      <p>This Subscription Agreement shall be governed by and construed in accordance with the laws of {setup.domicile === 'Australia' ? 'New South Wales, Australia' : setup.domicile}. The parties submit to the non-exclusive jurisdiction of the courts of that jurisdiction.</p>

      <div className="signature-block">
        <div>
          <p><strong>INVESTOR</strong></p>
          <div className="signature-line">Signature</div>
          <div className="signature-line">Name</div>
          <div className="signature-line">Title</div>
          <div className="signature-line">Date</div>
        </div>
        <div>
          <p><strong>ACCEPTED BY GENERAL PARTNER</strong></p>
          <div className="signature-line">Signature</div>
          <div className="signature-line">Name: {gpName}</div>
          <div className="signature-line">Title</div>
          <div className="signature-line">Date</div>
        </div>
      </div>

      <div className="doc-footer">
        <p>{fundName} | Subscription Agreement | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateASICChecklist(fundData) {
  const { setup } = fundData
  const isRetail = setup.fundType === 'Retail'
  const fundName = setup.fundName || '[Fund Name]'

  const wholesaleChecklist = [
    { category: 'Entity Setup', items: [
      'Register the GP entity (company) with ASIC',
      'Obtain ABN and TFN for the fund entity',
      'Execute Limited Partnership Agreement / Trust Deed',
      'Register the limited partnership with the relevant state registry',
      'Appoint auditor and lodge notice with ASIC',
    ]},
    { category: 'AFSL Requirements', items: [
      'Determine if existing AFSL covers fund management activities',
      'If not, apply for AFSL or arrange for authorised representative status',
      'Ensure AFSL covers "dealing in" and "providing general/personal advice" for interests in managed investment schemes',
      'Prepare compliance framework and compliance plan',
      'Appoint compliance officer / responsible manager',
    ]},
    { category: 'Wholesale Client Verification', items: [
      'Prepare wholesale client assessment procedures',
      'Prepare Qualified Purchaser / Sophisticated Investor certification forms',
      'Ensure minimum investment amount meets wholesale threshold ($500,000)',
      'Document product is not offered to retail clients',
    ]},
    { category: 'AML/CTF', items: [
      'Register with AUSTRAC as a reporting entity',
      'Develop AML/CTF program (Parts A and B)',
      'Implement customer identification procedures (CIP)',
      'Establish ongoing customer due diligence processes',
      'Train staff on AML/CTF obligations',
    ]},
    { category: 'Tax Registrations', items: [
      'Register for GST (if applicable)',
      'Register for PAYG withholding (if applicable)',
      'Consider FATCA/CRS registration requirements',
      'Obtain legal opinion on tax transparency / flow-through status',
    ]},
    { category: 'Documentation', items: [
      'Prepare Information Memorandum (not PDS required for wholesale)',
      'Finalize Limited Partnership Agreement',
      'Prepare Subscription Agreement',
      'Prepare Side Letter template',
      'Engagement letters for all service providers',
    ]},
    { category: 'Operational Setup', items: [
      'Open fund bank accounts (AUD, multi-currency if needed)',
      'Engage fund administrator',
      'Engage custodian',
      'Set up investor reporting portal',
      'Implement compliance monitoring systems',
    ]},
  ]

  const retailAdditional = [
    { category: 'Managed Investment Scheme (Retail)', items: [
      'Register managed investment scheme with ASIC',
      'Prepare and lodge Product Disclosure Statement (PDS)',
      'Prepare Target Market Determination (TMD)',
      'Appoint responsible entity with appropriate AFSL',
      'Prepare compliance plan and lodge with ASIC',
      'Establish complaints handling procedures (IDR and EDR)',
      'Join Australian Financial Complaints Authority (AFCA)',
    ]},
  ]

  const checklist = isRetail ? [...wholesaleChecklist, ...retailAdditional] : wholesaleChecklist

  return (
    <div className="doc-preview">
      <div className="doc-header">
        <h1>ASIC Registration Checklist</h1>
        <p>{fundName}</p>
        <p style={{marginTop: 4}}>
          <span className={`badge ${isRetail ? 'badge-red' : 'badge-blue'}`}>
            {isRetail ? 'Retail Fund' : 'Wholesale Fund'}
          </span>
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--gray-500)', marginBottom: 20 }}>
        This checklist outlines the key regulatory and operational steps required to establish {fundName} as a
        {isRetail ? ' retail' : ' wholesale'} fund in {setup.domicile || 'Australia'}. Items should be completed in
        consultation with legal and compliance advisors.
      </p>

      {checklist.map((section, sIdx) => (
        <div key={sIdx} style={{marginBottom: 20}}>
          <h2>{section.category}</h2>
          {section.items.map((item, iIdx) => (
            <div key={iIdx} className="checklist-item">
              <input type="checkbox" id={`asic-${sIdx}-${iIdx}`} readOnly />
              <label htmlFor={`asic-${sIdx}-${iIdx}`}>{item}</label>
            </div>
          ))}
        </div>
      ))}

      <h2>Estimated Timeline</h2>
      <table><tbody>
        <tr><td style={{width:'50%', fontWeight:600}}>Entity Setup & Registrations</td><td>2-4 weeks</td></tr>
        <tr><td style={{fontWeight:600}}>AFSL Application (if new)</td><td>3-6 months</td></tr>
        <tr><td style={{fontWeight:600}}>AML/CTF Program</td><td>2-4 weeks</td></tr>
        <tr><td style={{fontWeight:600}}>Documentation Preparation</td><td>4-8 weeks</td></tr>
        {isRetail && <tr><td style={{fontWeight:600}}>MIS Registration & PDS</td><td>6-12 weeks</td></tr>}
        <tr><td style={{fontWeight:600}}>Operational Setup</td><td>2-4 weeks</td></tr>
        <tr style={{fontWeight:600}}><td>Total Estimated Timeline</td><td>{isRetail ? '4-8 months' : '2-4 months'}</td></tr>
      </tbody></table>

      <div className="doc-footer">
        <p>This checklist is for guidance purposes only. Consult with your legal and compliance advisors.</p>
        <p>{fundName} | ASIC Checklist | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateIMA(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[GP Name]'
  const imName = setup.investmentManager || '[Investment Manager]'

  return (
    <div className="doc-preview">
      <div className="doc-confidential">CONFIDENTIAL</div>
      <div className="doc-header">
        <h1>Investment Management Agreement</h1>
        <p>Outline of Key Terms</p>
        <p>Between {fundName} and {imName}</p>
      </div>

      <h2>1. Parties</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Fund / Trustee</td><td>{setup.trustee || gpName}</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Manager</td><td>{imName}</td></tr>
      </tbody></table>

      <h2>2. Appointment</h2>
      <p>The Fund hereby appoints {imName} as the investment manager of {fundName} to manage the investment portfolio in accordance with the investment strategy, guidelines, and restrictions set out in this Agreement and the Fund's constituent documents.</p>

      <h2>3. Investment Mandate</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Asset Class</td><td>{setup.assetClass}</td></tr>
        <tr><td style={{fontWeight:600}}>Geography</td><td>{setup.geography}</td></tr>
        <tr><td style={{fontWeight:600}}>Strategy Focus</td><td>{setup.stageSectorFocus || 'As determined by the Investment Committee'}</td></tr>
        <tr><td style={{fontWeight:600}}>Investment Size</td><td>{setup.investmentSizeMin ? `${formatCurrency(setup.investmentSizeMin)} - ${formatCurrency(setup.investmentSizeMax)}` : 'Per the Fund LPA'}</td></tr>
        <tr><td style={{fontWeight:600}}>Concentration Limits</td><td>{setup.diversificationLimits}</td></tr>
      </tbody></table>

      <h2>4. Duties and Powers</h2>
      <p>The Investment Manager shall:</p>
      <ul style={{paddingLeft: 20, marginBottom: 12}}>
        <li>Source, evaluate, and recommend investments consistent with the investment strategy</li>
        <li>Conduct due diligence on prospective investments</li>
        <li>Monitor and manage portfolio companies</li>
        <li>Make recommendations regarding follow-on investments and exits</li>
        <li>Provide regular reporting to the GP and LP Advisory Committee</li>
        <li>Comply with all applicable laws and regulations</li>
      </ul>

      <h2>5. Fees</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Management Fee</td><td>{formatPercent(ideation.managementFee)} per annum</td></tr>
        <tr><td style={{fontWeight:600}}>Performance Fee</td><td>{formatPercent(setup.carryPerformanceFee || ideation.carryRate)} carried interest</td></tr>
        <tr><td style={{fontWeight:600}}>Payment</td><td>Quarterly in advance (management fee)</td></tr>
      </tbody></table>

      <h2>6. Term</h2>
      <p>This Agreement shall commence on the date of the Fund's first close and shall continue for the term of the Fund, subject to earlier termination as provided herein.</p>

      <h2>7. Termination</h2>
      <p>This Agreement may be terminated by: (a) mutual written agreement; (b) the Fund, upon removal of the GP in accordance with the LPA; (c) either party, upon a material breach that remains uncured for 30 days after written notice.</p>

      <h2>8. Governing Law</h2>
      <p>This Agreement shall be governed by the laws of {setup.domicile === 'Australia' ? 'New South Wales, Australia' : setup.domicile}.</p>

      <div className="signature-block">
        <div>
          <p><strong>FUND / TRUSTEE</strong></p>
          <div className="signature-line">Signature</div>
          <div className="signature-line">Name</div>
          <div className="signature-line">Date</div>
        </div>
        <div>
          <p><strong>INVESTMENT MANAGER</strong></p>
          <div className="signature-line">Signature</div>
          <div className="signature-line">Name</div>
          <div className="signature-line">Date</div>
        </div>
      </div>

      <div className="doc-footer">
        <p>{fundName} | Investment Management Agreement | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateLPA(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'

  return (
    <div className="doc-preview">
      <div className="doc-confidential">CONFIDENTIAL DRAFT</div>
      <div className="doc-header">
        <h1>Limited Partnership Agreement</h1>
        <p>{fundName}</p>
        <p>Key Sections and Table of Contents</p>
      </div>

      <h2>Table of Contents</h2>
      <div style={{fontSize: 13}}>
        {[
          '1. Definitions and Interpretation',
          '2. Establishment of the Partnership',
          '3. Purpose and Business of the Partnership',
          '4. Capital Commitments and Contributions',
          '5. Management Fee and Expenses',
          '6. Allocation of Profits and Losses',
          '7. Distributions',
          '8. Investment Period and Fund Term',
          '9. Powers and Duties of the General Partner',
          '10. Limited Partners\' Rights',
          '11. LP Advisory Committee',
          '12. Key Person Provisions',
          '13. Removal of General Partner',
          '14. Transfer of Partnership Interests',
          '15. Reporting and Accounts',
          '16. Indemnification and Liability',
          '17. Confidentiality',
          '18. Dissolution and Winding Up',
          '19. Amendments',
          '20. Governing Law and Dispute Resolution',
        ].map((item, i) => (
          <p key={i} style={{padding: '4px 0', borderBottom: '1px dotted var(--gray-200)'}}>{item}</p>
        ))}
      </div>

      <h2>Key Clauses (Pre-Populated)</h2>

      <h3>2. Establishment of the Partnership</h3>
      <p>The Partners hereby form a limited partnership under the laws of {setup.domicile || 'Australia'}, to be known as "{fundName}". The General Partner shall be {setup.gpName || '[GP Name]'}.</p>

      <h3>4. Capital Commitments</h3>
      <p>The target aggregate Capital Commitments of the Partnership shall be {formatCurrency(ideation.fundSize)}{setup.fundSizeMin ? `, with a minimum of ${formatCurrency(setup.fundSizeMin)}` : ''}{setup.fundSizeMax ? ` and a maximum of ${formatCurrency(setup.fundSizeMax)}` : ''}. The General Partner shall commit not less than {formatPercent(setup.gpCommit || ideation.gpCommitment)} of total commitments.</p>

      <h3>5. Management Fee</h3>
      <p>The Partnership shall pay to the General Partner (or its designee) a management fee of {formatPercent(ideation.managementFee)} per annum, calculated on {setup.mgmtFeeCalcBasis || 'Committed Capital during the Investment Period and on Invested Capital thereafter'}.</p>

      <h3>7. Distributions</h3>
      <p>Distribution policy: {setup.distributionPolicy || 'Deal-by-deal with clawback'}. Timing: {setup.distributionTiming || 'Within 30 days of realization'}. The waterfall shall follow the priority set out in the Term Sheet.</p>

      <h3>8. Term</h3>
      <p>The Fund shall have an initial term of {setup.fundTerm || ideation.fundTerm} years from the Final Close, with an Investment Period of {setup.investmentPeriod || ideation.investmentPeriod} years. Extension: {setup.extensionOptions || '2 x 1-year extensions subject to LPAC approval'}.</p>

      <div className="doc-footer">
        <p>DRAFT - For Discussion Purposes Only</p>
        <p>{fundName} | LPA Outline | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateSideLetter(fundData) {
  const { setup } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[GP Name]'

  return (
    <div className="doc-preview">
      <div className="doc-confidential">CONFIDENTIAL</div>
      <div className="doc-header">
        <h1>Side Letter</h1>
        <p>{fundName}</p>
      </div>

      <p>Dear [Investor Name],</p>
      <p>This letter (the "Side Letter") is entered into in connection with the subscription by [Investor Name] (the "Investor") for limited partnership interests in {fundName} (the "Fund") pursuant to the Limited Partnership Agreement dated [__________] (the "LPA").</p>
      <p>The General Partner, {gpName}, hereby agrees to the following modifications to the terms of the LPA as they apply to the Investor:</p>

      <h2>1. Most Favoured Nation</h2>
      <p>The General Partner shall provide the Investor with copies of any side letters entered into with other Limited Partners that contain terms more favourable than those provided herein, and the Investor shall have the right to elect to receive any such more favourable terms.</p>

      <h2>2. Co-Investment Rights</h2>
      <p>[The Investor shall have the right to participate in co-investment opportunities alongside the Fund, subject to the General Partner's allocation policy. / Not applicable.]</p>

      <h2>3. Fee Arrangements</h2>
      <p>[Standard terms apply. / The management fee applicable to the Investor shall be [__]% per annum. / A fee rebate of [__]% shall apply.]</p>

      <h2>4. Reporting</h2>
      <p>[Standard reporting applies. / In addition to the standard reporting, the General Partner shall provide the Investor with [additional reporting requirements].]</p>

      <h2>5. Transfer</h2>
      <p>[Standard transfer restrictions apply. / The Investor shall have the right to transfer its interest to affiliates without the prior consent of the General Partner.]</p>

      <h2>6. Confidentiality</h2>
      <p>The terms of this Side Letter shall be treated as confidential, subject to the MFN provisions above and disclosures required by law or regulation.</p>

      <h2>7. Governing Law</h2>
      <p>This Side Letter shall be governed by the laws of {setup.domicile === 'Australia' ? 'New South Wales, Australia' : setup.domicile}.</p>

      <div className="signature-block">
        <div>
          <p><strong>GENERAL PARTNER</strong></p>
          <div className="signature-line">Signature</div>
          <div className="signature-line">{gpName}</div>
          <div className="signature-line">Date</div>
        </div>
        <div>
          <p><strong>INVESTOR</strong></p>
          <div className="signature-line">Signature</div>
          <div className="signature-line">Name</div>
          <div className="signature-line">Date</div>
        </div>
      </div>

      <div className="doc-footer">
        <p>{fundName} | Side Letter Template | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export function generateInfoMemo(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[GP Name]'

  return (
    <div className="doc-preview">
      <div className="doc-confidential">CONFIDENTIAL - FOR WHOLESALE INVESTORS ONLY</div>
      <div className="doc-header">
        <h1>{fundName}</h1>
        <p>Information Memorandum</p>
        <p>Prepared by {gpName}</p>
      </div>

      <h2>Important Notice</h2>
      <p style={{fontSize: 11, color: 'var(--gray-500)'}}>
        This Information Memorandum ("IM") has been prepared by {gpName} in connection with the private offering of interests in {fundName}. This IM is strictly confidential and is provided solely for the use of prospective wholesale investors. This is not a Product Disclosure Statement and has not been lodged with ASIC. The offering of interests is limited to wholesale clients as defined in the Corporations Act 2001 (Cth).
      </p>

      <h2>1. Executive Summary</h2>
      <p>{fundName} is a {setup.legalEntityType || 'limited partnership'} established in {setup.domicile || 'Australia'} focused on {setup.assetClass || 'venture capital'} investments. The Fund targets a total commitment of {formatCurrency(ideation.fundSize)} with a {setup.fundTerm || ideation.fundTerm}-year term.</p>

      <h2>2. Investment Strategy</h2>
      <p>{ideation.investmentThesis || 'The Fund will pursue investments in high-growth opportunities within its target market.'}</p>
      <p><strong>Strategy:</strong> {ideation.fundStrategy || 'To be detailed.'}</p>
      <p><strong>Geography:</strong> {setup.geography || 'Australia & New Zealand'}</p>
      <p><strong>Sector Focus:</strong> {setup.stageSectorFocus || 'Broad mandate within asset class'}</p>

      <h2>3. Fund Terms Summary</h2>
      <table><tbody>
        <tr><td style={{width:'40%', fontWeight:600}}>Fund Size</td><td>{formatCurrency(ideation.fundSize)}</td></tr>
        <tr><td style={{fontWeight:600}}>Management Fee</td><td>{formatPercent(ideation.managementFee)} p.a.</td></tr>
        <tr><td style={{fontWeight:600}}>Carried Interest</td><td>{formatPercent(setup.carryPerformanceFee || ideation.carryRate)}</td></tr>
        <tr><td style={{fontWeight:600}}>Hurdle Rate</td><td>{formatPercent(setup.hurdleRate || ideation.hurdleRate)}</td></tr>
        <tr><td style={{fontWeight:600}}>Fund Term</td><td>{setup.fundTerm || ideation.fundTerm} years</td></tr>
      </tbody></table>

      <h2>4. Risk Factors</h2>
      <p>An investment in the Fund involves significant risks. Prospective investors should carefully consider the following:</p>
      <ul style={{paddingLeft: 20}}>
        <li>Illiquidity risk - interests cannot be easily redeemed or transferred</li>
        <li>Market risk - portfolio investments are subject to market conditions</li>
        <li>Concentration risk - the Fund may hold concentrated positions</li>
        <li>Regulatory risk - changes in law may affect the Fund or its investments</li>
        <li>Key person risk - performance depends on key investment professionals</li>
      </ul>

      <div className="doc-footer">
        <p>{fundName} | Information Memorandum | {new Date().getFullYear()}</p>
      </div>
    </div>
  )
}

export const GENERATORS = {
  termSheet: generateTermSheet,
  ima: generateIMA,
  lpa: generateLPA,
  subscription: generateSubscriptionAgreement,
  sideLetter: generateSideLetter,
  serviceProviderBrief: generateServiceProviderBrief,
  asicChecklist: generateASICChecklist,
  infoMemo: generateInfoMemo,
}
