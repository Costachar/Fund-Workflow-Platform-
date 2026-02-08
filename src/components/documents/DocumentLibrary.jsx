import { useState } from 'react'
import { useFund } from '../../context/FundContext'
import { DOCUMENT_TYPES, GENERATORS } from '../../utils/documentTemplates'
import { PDF_GENERATORS } from '../../utils/pdfGenerator'
import { FileText, Download, Eye, Check, MessageSquare, X } from 'lucide-react'

export default function DocumentLibrary() {
  const { state, dispatch } = useFund()
  const { fundData } = state
  const { documents } = fundData
  const [previewDoc, setPreviewDoc] = useState(null)
  const [commentDoc, setCommentDoc] = useState(null)
  const [commentText, setCommentText] = useState('')

  const docList = Object.values(DOCUMENT_TYPES)

  const handleDownloadPDF = (docId) => {
    const generator = PDF_GENERATORS[docId]
    if (generator) {
      const pdf = generator(fundData)
      const fundName = fundData.setup.fundName || 'Fund'
      pdf.save(`${fundName}_${DOCUMENT_TYPES[docId].name.replace(/\s+/g, '_')}.pdf`)
    }
  }

  const handlePreview = (docId) => {
    setPreviewDoc(docId)
  }

  const handleReview = (docId) => {
    dispatch({
      type: 'MARK_DOCUMENT_REVIEWED',
      payload: { docId, reviewed: !documents.reviewed[docId] },
    })
  }

  const handleSaveComment = (docId) => {
    dispatch({
      type: 'SET_DOCUMENT_COMMENT',
      payload: { docId, comment: commentText },
    })
    setCommentDoc(null)
    setCommentText('')
  }

  const openComment = (docId) => {
    setCommentText(documents.comments?.[docId] || '')
    setCommentDoc(docId)
  }

  const categories = [...new Set(docList.map(d => d.category))]

  return (
    <div>
      {/* Stats */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-label">Total Documents</div>
          <div className="metric-value">{docList.length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">Reviewed</div>
          <div className="metric-value">{Object.values(documents.reviewed || {}).filter(Boolean).length}</div>
          <div className="metric-sub">of {docList.length} documents</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">With Comments</div>
          <div className="metric-value">{Object.values(documents.comments || {}).filter(c => c && c.trim()).length}</div>
        </div>
        <div className="metric-card">
          <div className="metric-label">PDF Available</div>
          <div className="metric-value">{Object.keys(PDF_GENERATORS).length}</div>
          <div className="metric-sub">Ready for download</div>
        </div>
      </div>

      {/* Document Grid by Category */}
      {categories.map(category => (
        <div key={category} style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12, color: 'var(--gray-800)' }}>
            {category} Documents
          </h3>
          <div className="doc-grid">
            {docList.filter(d => d.category === category).map((docType) => {
              const isReviewed = documents.reviewed?.[docType.id]
              const hasComment = documents.comments?.[docType.id]
              const hasPDF = !!PDF_GENERATORS[docType.id]

              return (
                <div key={docType.id} className="doc-card" onClick={() => handlePreview(docType.id)}>
                  <div className="doc-card-icon">
                    <FileText size={20} />
                  </div>
                  <h4>{docType.name}</h4>
                  <p>{docType.description}</p>
                  <div className="doc-card-footer">
                    <div style={{ display: 'flex', gap: 6 }}>
                      {isReviewed && <span className="badge badge-green">Reviewed</span>}
                      {hasComment && <span className="badge badge-blue">Notes</span>}
                    </div>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {hasPDF && (
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={(e) => { e.stopPropagation(); handleDownloadPDF(docType.id) }}
                          title="Download PDF"
                        >
                          <Download size={14} />
                        </button>
                      )}
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={(e) => { e.stopPropagation(); handlePreview(docType.id) }}
                        title="Preview"
                      >
                        <Eye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      ))}

      {/* Preview Modal */}
      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div style={{
            background: 'white', borderRadius: 'var(--radius)',
            maxWidth: 900, width: '100%', maxHeight: '90vh', overflow: 'auto',
            boxShadow: 'var(--shadow-lg)',
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{
              position: 'sticky', top: 0, background: 'white',
              padding: '16px 24px', borderBottom: '1px solid var(--gray-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              zIndex: 10,
            }}>
              <h3 style={{ fontSize: 16, fontWeight: 600 }}>{DOCUMENT_TYPES[previewDoc]?.name}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  className={`btn btn-sm ${documents.reviewed?.[previewDoc] ? 'btn-success' : 'btn-secondary'}`}
                  onClick={() => handleReview(previewDoc)}
                >
                  <Check size={14} /> {documents.reviewed?.[previewDoc] ? 'Reviewed' : 'Mark Reviewed'}
                </button>
                <button className="btn btn-sm btn-secondary" onClick={() => openComment(previewDoc)}>
                  <MessageSquare size={14} /> Notes
                </button>
                {PDF_GENERATORS[previewDoc] && (
                  <button className="btn btn-sm btn-primary" onClick={() => handleDownloadPDF(previewDoc)}>
                    <Download size={14} /> Download PDF
                  </button>
                )}
                <button className="btn btn-sm btn-secondary" onClick={() => setPreviewDoc(null)}>
                  <X size={14} />
                </button>
              </div>
            </div>
            <div style={{ padding: 24 }}>
              {GENERATORS[previewDoc] ? GENERATORS[previewDoc](fundData) : (
                <div className="empty-state">
                  <p>Document preview not available. Complete the Fund Setup stage to generate this document.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Comment Modal */}
      {commentDoc && (
        <div className="modal-overlay" onClick={() => setCommentDoc(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Notes - {DOCUMENT_TYPES[commentDoc]?.name}</h3>
              <button className="btn btn-sm btn-secondary" onClick={() => setCommentDoc(null)}>
                <X size={14} />
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Comments / Feedback</label>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add comments, feedback, or notes about this document..."
                  style={{ minHeight: 120 }}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setCommentDoc(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => handleSaveComment(commentDoc)}>Save Notes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
