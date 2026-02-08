import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { PHASE_COLORS, TASK_STATUSES } from './projectData'

export function exportProjectCSV(tasks, team) {
  const headers = ['Phase', 'Task', 'Owner', 'Role', 'Status', 'Start Week', 'Duration (weeks)', 'End Week', 'Dependencies']

  const rows = tasks.map(t => {
    const owner = team.find(m => m.id === t.owner)
    const statusLabel = TASK_STATUSES.find(s => s.value === t.status)?.label || t.status
    const depNames = t.dependencies.map(d => {
      const dep = tasks.find(dt => dt.id === d)
      return dep ? dep.name : d
    }).join('; ')

    return [
      t.phase,
      t.name,
      owner?.name || '',
      owner?.role || '',
      statusLabel,
      t.startWeek,
      t.duration,
      t.startWeek + t.duration - 1,
      depNames,
    ]
  })

  const csvContent = [headers, ...rows]
    .map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'fund_project_plan.csv'
  link.click()
  URL.revokeObjectURL(url)
}

export function exportProjectPDF(tasks, team, fundData) {
  const doc = new jsPDF({ orientation: 'landscape' })
  const fundName = fundData?.setup?.fundName || 'Fund Setup'
  let y = 20

  // Title
  doc.setFontSize(18)
  doc.setTextColor(30, 41, 59)
  doc.text(`${fundName} - Project Plan`, 148, y, { align: 'center' })
  y += 8
  doc.setFontSize(10)
  doc.setTextColor(100, 116, 139)
  doc.text(`Generated ${new Date().toLocaleDateString('en-AU')}`, 148, y, { align: 'center' })
  y += 4
  doc.setDrawColor(229, 231, 235)
  doc.line(14, y, 283, y)
  y += 8

  // Summary stats
  const total = tasks.length
  const complete = tasks.filter(t => t.status === 'complete').length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const blocked = tasks.filter(t => t.status === 'blocked').length
  const totalWeeks = Math.max(...tasks.map(t => t.startWeek + t.duration))
  const phases = [...new Set(tasks.map(t => t.phase))]

  doc.setFontSize(10)
  doc.setTextColor(55, 65, 81)
  doc.text(`Total Tasks: ${total}   |   Complete: ${complete}   |   In Progress: ${inProgress}   |   Blocked: ${blocked}   |   Timeline: ${totalWeeks} weeks (~${Math.ceil(totalWeeks / 4)} months)`, 14, y)
  y += 8

  // Progress bar
  doc.setFillColor(229, 231, 235)
  doc.rect(14, y, 260, 5, 'F')
  if (total > 0) {
    doc.setFillColor(5, 150, 105) // success green
    doc.rect(14, y, 260 * (complete / total), 5, 'F')
  }
  y += 10

  // Task table by phase
  phases.forEach((phase, phaseIdx) => {
    const phaseTasks = tasks.filter(t => t.phase === phase)
    const phaseComplete = phaseTasks.filter(t => t.status === 'complete').length

    if (y > 170) { doc.addPage(); y = 20 }

    // Phase header
    doc.setFontSize(12)
    doc.setTextColor(30, 41, 59)
    doc.text(`${phase} (${phaseComplete}/${phaseTasks.length})`, 14, y)
    y += 2
    doc.setDrawColor(229, 231, 235)
    doc.line(14, y, 283, y)
    y += 4

    const tableBody = phaseTasks.map(t => {
      const owner = team.find(m => m.id === t.owner)
      const statusLabel = TASK_STATUSES.find(s => s.value === t.status)?.label || t.status
      return [
        t.name,
        owner?.name || '',
        owner?.role || '',
        statusLabel,
        `W${t.startWeek}`,
        `${t.duration}w`,
        `W${t.startWeek + t.duration - 1}`,
      ]
    })

    doc.autoTable({
      startY: y,
      head: [['Task', 'Owner', 'Role', 'Status', 'Start', 'Duration', 'End']],
      body: tableBody,
      theme: 'striped',
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 90 },
        1: { cellWidth: 35 },
        2: { cellWidth: 35 },
        3: { cellWidth: 25 },
        4: { cellWidth: 18 },
        5: { cellWidth: 20 },
        6: { cellWidth: 18 },
      },
      margin: { left: 14, right: 14 },
    })
    y = doc.lastAutoTable.finalY + 8
  })

  // Team Summary page
  doc.addPage()
  y = 20
  doc.setFontSize(14)
  doc.setTextColor(30, 41, 59)
  doc.text('Team Workload Summary', 14, y)
  y += 4
  doc.line(14, y, 283, y)
  y += 6

  const teamBody = team.map(m => {
    const memberTasks = tasks.filter(t => t.owner === m.id)
    const totalW = memberTasks.reduce((sum, t) => sum + t.duration, 0)
    const comp = memberTasks.filter(t => t.status === 'complete').length
    return [
      m.name,
      m.role,
      memberTasks.length.toString(),
      `${totalW}w`,
      `${comp}/${memberTasks.length}`,
      memberTasks.length > 0 ? `${((comp / memberTasks.length) * 100).toFixed(0)}%` : '-',
    ]
  })

  doc.autoTable({
    startY: y,
    head: [['Team Member', 'Role', 'Tasks', 'Total Weeks', 'Completed', 'Progress']],
    body: teamBody,
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [30, 64, 175], textColor: 255, fontSize: 9 },
    margin: { left: 14, right: 14 },
  })

  // Footer on all pages
  const pageCount = doc.internal.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(7)
    doc.setTextColor(156, 163, 175)
    doc.text(`${fundName} | Project Plan`, 14, 200)
    doc.text(`Page ${i} of ${pageCount}`, 283, 200, { align: 'right' })
  }

  doc.save(`${fundName.replace(/\s+/g, '_')}_Project_Plan.pdf`)
}
