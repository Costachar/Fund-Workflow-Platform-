import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { formatCurrency, formatPercent, formatDate } from './formatters'

export function generateTermSheetPDF(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[Fund Manager Name]'
  const doc = new jsPDF()
  let y = 20

  // Header
  doc.setFontSize(8)
  doc.setTextColor(220, 38, 38)
  doc.text('CONFIDENTIAL', 105, y, { align: 'center' })
  y += 10

  doc.setFontSize(20)
  doc.setTextColor(30, 41, 59)
  doc.text(fundName, 105, y, { align: 'center' })
  y += 8
  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text('Summary of Indicative Terms', 105, y, { align: 'center' })
  y += 6
  doc.text(`Prepared by ${gpName}`, 105, y, { align: 'center' })
  y += 4
  doc.setDrawColor(30, 41, 59)
  doc.setLineWidth(0.5)
  doc.line(20, y, 190, y)
  y += 10

  doc.setFontSize(9)
  doc.setTextColor(100, 116, 139)
  doc.text('This Term Sheet is for discussion purposes only and does not constitute a binding agreement.', 20, y, { maxWidth: 170 })
  y += 10

  // Section helper
  const addSection = (title) => {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(13)
    doc.setTextColor(30, 41, 59)
    doc.text(title, 20, y)
    y += 2
    doc.setDrawColor(229, 231, 235)
    doc.line(20, y, 190, y)
    y += 6
  }

  const addTable = (rows) => {
    if (y > 240) { doc.addPage(); y = 20 }
    doc.autoTable({
      startY: y,
      body: rows,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } },
      margin: { left: 20, right: 20 },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  addSection('1. Fund Overview')
  addTable([
    ['Fund Name', fundName],
    ['Legal Structure', setup.legalEntityType],
    ['Domicile', setup.domicile],
    ['Fund Type', setup.fundType],
    ['Fund Manager', gpName],
    ['Investment Manager', setup.investmentManager || '[TBD]'],
    ['Fund Administrator', setup.fundAdministrator || '[TBD]'],
  ])

  addSection('2. Investment Strategy')
  addTable([
    ['Asset Class', setup.assetClass],
    ['Geography', setup.geography],
    ['Focus', setup.stageSectorFocus || '[TBD]'],
    ['Investment Size', setup.investmentSizeMin ? `${formatCurrency(setup.investmentSizeMin)} - ${formatCurrency(setup.investmentSizeMax)}` : '[TBD]'],
    ['Diversification', setup.diversificationLimits],
  ])

  addSection('3. Economic Terms')
  addTable([
    ['Target Fund Size', formatCurrency(ideation.fundSize)],
    ['Management Fee', `${formatPercent(ideation.managementFee)} per annum`],
    ['Fee Basis', setup.mgmtFeeStructure],
    ['Carried Interest', `${formatPercent(setup.carryPerformanceFee || ideation.carryRate)} of net profits`],
    ['Hurdle Rate', `${formatPercent(setup.hurdleRate || ideation.hurdleRate)} preferred return`],
    ['Catch-Up', (setup.catchUp ?? ideation.catchUp) ? 'Yes - 100% to Fund Manager' : 'None'],
    ['GP Commitment', `${formatPercent(setup.gpCommit || ideation.gpCommitment)} of commitments`],
  ])

  addSection('4. Fund Terms')
  addTable([
    ['Fund Term', `${setup.fundTerm || ideation.fundTerm} years`],
    ['Investment Period', `${setup.investmentPeriod || ideation.investmentPeriod} years`],
    ['Extensions', setup.extensionOptions || '2 x 1-year'],
    ['First Close', setup.firstCloseDate ? formatDate(setup.firstCloseDate) : '[TBD]'],
    ['Final Close', setup.finalCloseDate ? formatDate(setup.finalCloseDate) : '[TBD]'],
  ])

  addSection('5. Governance')
  addTable([
    ['Advisory Board', setup.advisoryBoardComposition || '3 LP representatives'],
    ['LP Consent', setup.lpConsentRights || 'Material amendments, strategy changes'],
    ['Key Person', setup.keyPersonProvisions || 'Suspension upon departure'],
    ['GP Removal', setup.removalRights || '75% LP vote'],
  ])

  addSection('6. Distributions & Transfers')
  addTable([
    ['Distribution Policy', setup.distributionPolicy],
    ['Timing', setup.distributionTiming],
    ['LP Transfers', setup.lpTransferRights],
    ['Reporting', `${setup.reportingFrequency} - ${setup.contentRequirements}`],
    ['Audit', setup.auditRequirements],
  ])

  // Footer
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(`${fundName} | Term Sheet | Confidential`, 20, 287)
    doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' })
  }

  return doc
}

export function generateServiceProviderPDF(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const doc = new jsPDF()
  let y = 20

  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text('Service Provider Brief', 105, y, { align: 'center' })
  y += 8
  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text(fundName, 105, y, { align: 'center' })
  y += 4
  doc.line(20, y, 190, y)
  y += 10

  const addSection = (title) => {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(13)
    doc.setTextColor(30, 41, 59)
    doc.text(title, 20, y)
    y += 2
    doc.setDrawColor(229, 231, 235)
    doc.line(20, y, 190, y)
    y += 6
  }

  const addTable = (rows) => {
    if (y > 240) { doc.addPage(); y = 20 }
    doc.autoTable({
      startY: y,
      body: rows,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 3 },
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 70 } },
      margin: { left: 20, right: 20 },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  addSection('Fund Overview')
  addTable([
    ['Fund Name', fundName],
    ['Structure', setup.legalEntityType],
    ['Target Size', formatCurrency(ideation.fundSize)],
    ['Fund Term', `${setup.fundTerm} years`],
    ['Fund Type', setup.fundType],
  ])

  addSection('Key Parties')
  addTable([
    ['Fund Manager', setup.gpName || '[Fund Manager Name]'],
    ['Investment Manager', setup.investmentManager || '[TBD]'],
    ['Trustee', setup.trustee || '[TBD]'],
  ])

  addSection('Service Requirements')
  doc.setFontSize(9)
  doc.setTextColor(55, 65, 81)
  const services = [
    'Fund Administration: Investor onboarding, capital calls, NAV calculation, reporting',
    'Custody: Asset safekeeping, settlement, segregated accounts',
    'Audit: Annual audit, tax compliance, regulatory reporting',
    `Reporting: ${setup.reportingFrequency} reports - ${setup.contentRequirements}`,
  ]
  services.forEach(s => {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.text(`• ${s}`, 24, y, { maxWidth: 160 })
    y += 8
  })

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(`${fundName} | Service Provider Brief`, 20, 287)
    doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' })
  }

  return doc
}

export function generateSubscriptionPDF(fundData) {
  const { setup, ideation } = fundData
  const fundName = setup.fundName || '[Fund Name]'
  const gpName = setup.gpName || '[Fund Manager Name]'
  const doc = new jsPDF()
  let y = 20

  doc.setFontSize(8)
  doc.setTextColor(220, 38, 38)
  doc.text('CONFIDENTIAL', 105, y, { align: 'center' })
  y += 10
  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text('Subscription Agreement', 105, y, { align: 'center' })
  y += 8
  doc.setFontSize(12)
  doc.setTextColor(100, 116, 139)
  doc.text(fundName, 105, y, { align: 'center' })
  y += 4
  doc.line(20, y, 190, y)
  y += 10

  doc.setFontSize(10)
  doc.setTextColor(55, 65, 81)
  doc.text(`TO: ${gpName} (the "Fund Manager")`, 20, y)
  y += 6
  doc.text(`RE: Subscription for interests in ${fundName}`, 20, y)
  y += 10

  const addSection = (title) => {
    if (y > 260) { doc.addPage(); y = 20 }
    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text(title, 20, y)
    y += 2
    doc.line(20, y, 190, y)
    y += 6
  }

  addSection('1. Subscription')
  doc.setFontSize(9)
  doc.setTextColor(55, 65, 81)
  doc.text('The undersigned hereby irrevocably subscribes for limited partnership interests in the Fund.', 20, y, { maxWidth: 170 })
  y += 12

  addSection('2. Investor Details')
  doc.autoTable({
    startY: y,
    body: [
      ['Full Legal Name', '____________________________________'],
      ['Entity Type', '____________________________________'],
      ['ABN/ACN', '____________________________________'],
      ['Address', '____________________________________'],
      ['Contact', '____________________________________'],
      ['Commitment (AUD)', '$___________________________________'],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    margin: { left: 20, right: 20 },
  })
  y = doc.lastAutoTable.finalY + 8

  addSection('3. Fund Terms')
  doc.autoTable({
    startY: y,
    body: [
      ['Management Fee', `${formatPercent(ideation.managementFee)} p.a.`],
      ['Carry', formatPercent(setup.carryPerformanceFee || ideation.carryRate)],
      ['Hurdle', formatPercent(setup.hurdleRate || ideation.hurdleRate)],
      ['Fund Term', `${setup.fundTerm || ideation.fundTerm} years`],
    ],
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: { 0: { fontStyle: 'bold', cellWidth: 60 } },
    margin: { left: 20, right: 20 },
  })
  y = doc.lastAutoTable.finalY + 8

  addSection('4. Representations')
  const reps = [
    'The Investor is a wholesale client under the Corporations Act 2001.',
    'The Investor has full authority to execute this agreement.',
    'The Investor is acquiring interests for its own account.',
    'The Investor is not subject to any applicable sanctions.',
  ]
  doc.setFontSize(9)
  doc.setTextColor(55, 65, 81)
  reps.forEach(r => {
    if (y > 270) { doc.addPage(); y = 20 }
    doc.text(`• ${r}`, 24, y, { maxWidth: 160 })
    y += 7
  })
  y += 10

  // Signature
  if (y > 230) { doc.addPage(); y = 20 }
  doc.setFontSize(10)
  doc.setTextColor(30, 41, 59)
  doc.text('INVESTOR', 30, y)
  doc.text('GENERAL PARTNER', 120, y)
  y += 25
  doc.line(30, y, 90, y)
  doc.line(120, y, 180, y)
  y += 5
  doc.setFontSize(8)
  doc.text('Signature', 30, y)
  doc.text('Signature', 120, y)

  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(156, 163, 175)
    doc.text(`${fundName} | Subscription Agreement | Confidential`, 20, 287)
    doc.text(`Page ${i} of ${pageCount}`, 190, 287, { align: 'right' })
  }

  return doc
}

export const PDF_GENERATORS = {
  termSheet: generateTermSheetPDF,
  serviceProviderBrief: generateServiceProviderPDF,
  subscription: generateSubscriptionPDF,
}
