import { useApp } from '../../context/AppContext.jsx';
import { STATUS_CONFIG } from '../../data/mockData.js';
import { ArrowLeft, ArrowRight, Users, CheckCircle2, AlertTriangle, ChevronDown, ChevronRight, FileText, MessageSquare, ClipboardList, Shield, Send, ExternalLink } from 'lucide-react';
import { useState, useCallback, useEffect } from 'react';
import './FileReview.css';

// ─── STATUS PILL ───
function StatusPill({ fileState }) {
  const config = STATUS_CONFIG[fileState];
  if (!config) return null;
  return <span className={`status-pill status-pill--${config.pill}`}>{config.label}</span>;
}

// ─── DOC THUMBNAIL ───
function DocThumbnail({ type, size = 40 }) {
  const configs = {
    birth_cert:      { bg: '#E6F5ED', icon: '📋', border: '#B7E0C8' },
    drivers_license: { bg: '#FEF7E6', icon: '🪪', border: '#F5DFA6' },
    passport:        { bg: '#E0E8F0', icon: '📕', border: '#B8C8DA' },
    marriage_cert:   { bg: '#F5E6F0', icon: '💍', border: '#DEB8D0' },
    translation:     { bg: '#E8F0FA', icon: '📄', border: '#B0C8E8' },
    id_card:         { bg: '#FEF7E6', icon: '🪪', border: '#F5DFA6' },
    signed_forms:    { bg: '#E8F0FA', icon: '✍️', border: '#B0C8E8' },
    death_cert:      { bg: '#F0EDEA', icon: '📋', border: '#D0CCC5' },
    default:         { bg: '#F0F0EC', icon: '📄', border: '#E0DED8' },
  };
  const c = configs[type] || configs.default;
  return (
    <div className="doc-thumb" style={{ width: size, height: size, background: c.bg, border: `1px solid ${c.border}` }}>
      <span style={{ fontSize: size * 0.45 }}>{c.icon}</span>
    </div>
  );
}

// ─── AI BRIEF ───
function AIBrief({ text }) {
  return (
    <div className="fr-ai-brief">
      <p>{text}</p>
    </div>
  );
}

// ─── ACTION ITEMS ───
function ActionItems({ client, onEscalate, onConvertFlag, onDismissFlag, isReadOnly, onHighlightDoc }) {
  const flags = client.flags || [];
  const previousFlags = client.previousFlags || [];
  const { dispatch } = useApp();

  if (flags.length === 0 && previousFlags.length === 0) {
    return (
      <div className="fr-section">
        <div className="section-label">ACTION ITEMS</div>
        <div className="fr-action-items--empty">
          <CheckCircle2 size={16} color="var(--success)" />
          <span>All system checks passed. No items need your attention.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fr-section">
      <div className="section-label">ACTION ITEMS {flags.length > 0 && <span className="fr-count">{flags.length}</span>}</div>

      {/* Previous resolved flags (re-review) */}
      {previousFlags.map(flag => (
        <div key={flag.id} className={`fr-flag-card ${flag.confirmed ? 'fr-flag-card--confirmed' : ''}`}>
          <div className="fr-flag-card__header">
            <div className="fr-flag-card__header-left">
              <CheckCircle2 size={15} color="var(--success)" />
              <span className="fr-flag-card__title">{flag.title}</span>
            </div>
            <span className="badge badge--resolved">{flag.confirmed ? 'Confirmed' : 'Resolved'}</span>
          </div>
          <p className="fr-flag-card__desc">{flag.resolution}</p>
          {!flag.confirmed && !isReadOnly && (
            <div className="fr-flag-card__actions">
              <button className="btn btn--primary btn--sm" onClick={() => dispatch({ type: 'CONFIRM_RESOLVED_FLAG', fileId: client.id, flagId: flag.id })}>
                Confirm Resolved
              </button>
              <button className="btn btn--outline btn--sm">Re-flag</button>
            </div>
          )}
        </div>
      ))}

      {/* Active flags */}
      {flags.map(flag => (
        <div key={flag.id} className="fr-flag-card" style={{ cursor: flag.documentRef ? 'pointer' : 'default' }} onClick={() => { if (flag.documentRef && onHighlightDoc) onHighlightDoc(flag.documentRef); }}>
          <div className="fr-flag-card__header">
            <div className="fr-flag-card__header-left">
              <AlertTriangle size={15} color="var(--warn)" />
              <span className="fr-flag-card__title">{flag.title}</span>
            </div>
            {flag.applicant && <span className="fr-flag-card__applicant">{flag.applicant}</span>}
          </div>
          <p className="fr-flag-card__desc">{flag.description}</p>
          {!isReadOnly && (
            <div className="fr-flag-card__actions">
              <button className="btn btn--outline btn--sm" onClick={(e) => { e.stopPropagation(); onDismissFlag && onDismissFlag(flag.id); }}>Dismiss</button>
              {flag.requiresAttorney ? (
                <button className="btn btn--primary btn--sm" onClick={(e) => { e.stopPropagation(); onEscalate && onEscalate(flag); }}>Escalate to Attorney</button>
              ) : (
                <button className="btn btn--warn-outline btn--sm" onClick={(e) => { e.stopPropagation(); onConvertFlag && onConvertFlag(flag); }}>Convert to Client Flag</button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── CHECKLIST (static bar) ───
function Checklist({ client }) {
  const ck = client.checklist || { passed: 0, total: 0 };
  const allPassed = ck.passed === ck.total;

  return (
    <div className="fr-section">
      <div className="fr-checklist-bar">
        <span className="section-label">GOLDEN CHECKLIST</span>
        <span className={`fr-checklist-count ${allPassed ? 'fr-checklist-count--pass' : ''}`}>
          {ck.passed}/{ck.total} PASSED
        </span>
      </div>
    </div>
  );
}

// ─── FILE INFO ───
function FileInfo({ client }) {
  return (
    <div className="fr-section">
      <div className="section-label">FILE INFORMATION</div>
      <div className="fr-file-info">
        <div className="fr-info-row"><span className="fr-info-label">Assigned CM</span><span>Victoria Rukaite</span></div>
        <div className="fr-info-row"><span className="fr-info-label">File opened</span><span>{client.fileOpened}</span></div>
        {client.submittedForReview && <div className="fr-info-row"><span className="fr-info-label">Submitted for review</span><span>{new Date(client.submittedForReview).toLocaleString()}</span></div>}
        <div className="fr-info-row"><span className="fr-info-label">Times reviewed</span><span>{client.timesReviewed || 0}</span></div>
        <div className="fr-info-row"><span className="fr-info-label">Chain of descent</span><span className="fr-info-chain">{client.chainShort || client.chain}</span></div>
        {client.type === 'family' && client.applicants && (
          <div className="fr-info-row"><span className="fr-info-label">Family members</span><span>{client.applicants.map(a => a.name).join(', ')}</span></div>
        )}
      </div>
    </div>
  );
}

// ─── DOCUMENT SIDEBAR (Speed 1) ───
function DocumentSidebar({ client, onExpand }) {
  const docs = client.documents || [];
  return (
    <div className="fr-doc-sidebar">
      <div className="section-label" style={{ padding: '0 0 var(--sp-md)' }}>DOCUMENTS</div>
      <div className="fr-doc-sidebar__list">
        {docs.map((doc, i) => (
          <div key={i} className="fr-doc-sidebar__item" onClick={onExpand}>
            <CheckCircle2 size={14} color={doc.flagged ? 'var(--warn)' : 'var(--success)'} />
            <span className="fr-doc-sidebar__title">{doc.title}</span>
          </div>
        ))}
      </div>
      <button className="fr-doc-sidebar__expand" onClick={onExpand}>
        Expand <ChevronRight size={14} />
      </button>
    </div>
  );
}

// ─── DOCUMENTS TAB (Full) ───
function DocumentsTab({ client, highlightedDoc }) {
  const docs = client.documents || [];
  const [expandedDocs, setExpandedDocs] = useState(() => {
    return docs.reduce((acc, d, i) => { if (d.flagged) acc[i] = true; return acc; }, {});
  });
  const [familyFilter, setFamilyFilter] = useState('all');

  const toggleDoc = (i) => setExpandedDocs(prev => ({ ...prev, [i]: !prev[i] }));

  // Group docs by section
  const sections = {};
  docs.forEach((doc, i) => {
    const sectionLabel = doc.section?.startsWith('applicant') ? 'About You' :
      doc.section === 'canadian_parent' ? 'Canadian Parent' :
      doc.section === 'grandparent' ? 'Grandparent' :
      doc.section === 'shared' ? 'Shared Documents' :
      doc.section === 'forms' ? 'Signed Forms' : 'Documents';
    if (!sections[sectionLabel]) sections[sectionLabel] = [];
    sections[sectionLabel].push({ ...doc, _index: i });
  });

  return (
    <div className="fr-docs-full">
      {client.type === 'family' && client.applicants && (
        <div className="fr-docs-family-filter">
          <button className={`filter-pill ${familyFilter === 'all' ? 'filter-pill--active' : ''}`} onClick={() => setFamilyFilter('all')}>All</button>
          {client.applicants.map(a => (
            <button key={a.name} className={`filter-pill ${familyFilter === a.name ? 'filter-pill--active' : ''}`} onClick={() => setFamilyFilter(a.name)}>
              {a.name.split(' ')[0]}
            </button>
          ))}
          <button className={`filter-pill ${familyFilter === 'shared' ? 'filter-pill--active' : ''}`} onClick={() => setFamilyFilter('shared')}>Shared</button>
        </div>
      )}
      {Object.entries(sections).map(([sectionName, sectionDocs]) => (
        <div key={sectionName} className="fr-docs-section">
          <div className="section-label">{sectionName}</div>
          {sectionDocs.map(doc => {
            const isExpanded = expandedDocs[doc._index];
            return (
              <div key={doc._index} className={`fr-doc-card ${doc.flagged ? 'fr-doc-card--flagged' : ''} ${highlightedDoc && doc.title === highlightedDoc ? 'fr-doc-card--highlight' : ''}`}>
                <div className="fr-doc-card__header" onClick={() => toggleDoc(doc._index)}>
                  <DocThumbnail type={doc.type} size={isExpanded ? 52 : 40} />
                  <div className="fr-doc-card__info">
                    <span className="fr-doc-card__title">{doc.title}</span>
                    {doc.flagged && <span className="badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)', fontSize: 10 }}>⚠ Flagged</span>}
                  </div>
                  <span className={`status-pill status-pill--${doc.status === 'verified' ? 'success' : doc.status === 'flagged' ? 'amber' : 'gray'}`} style={{ fontSize: 11 }}>
                    {doc.status === 'verified' ? '✓ Verified' : doc.status === 'flagged' ? '⚠ Flagged' : doc.status === 'pending_verification' ? 'Pending' : doc.status}
                  </span>
                  <ChevronDown size={16} className={`fr-doc-card__chevron ${isExpanded ? 'open' : ''}`} />
                </div>
                {isExpanded && doc.extractedData && Object.keys(doc.extractedData).length > 0 && (
                  <div className="fr-doc-card__body">
                    {Object.entries(doc.extractedData).map(([key, val]) => (
                      <div key={key} className="fr-doc-card__field">
                        <span className="fr-doc-card__field-label">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ').replace(/^\w/, c => c.toUpperCase())}</span>
                        <span className="fr-doc-card__field-value">{val}</span>
                      </div>
                    ))}
                    <div className="fr-doc-card__actions">
                      <button className="btn btn--ghost btn--sm"><ExternalLink size={13} /> View Full</button>
                      <button className="btn btn--ghost btn--sm">Replace</button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

// ─── FORMS TAB ───
function FormsTab({ client }) {
  if (!client.personal) return <div className="fr-tab-empty">No form data available</div>;
  const p = client.personal;
  const cp = client.parents?.canadian;

  const SourceBadge = ({ type }) => {
    const cls = type === 'Birth cert' || type === 'Marriage cert' || type === 'Passport' ? 'source-badge--doc' :
      type === 'Intake' || type === 'Client input' ? 'source-badge--input' :
      type === 'CM edit' ? 'source-badge--cm' : 'source-badge--default';
    return <span className={`source-badge ${cls}`}>{type}</span>;
  };

  const Field = ({ label, value, source }) => (
    <div className="fr-form-field">
      <span className="fr-form-field__label">{label}</span>
      <span className="fr-form-field__value">{value || '—'}</span>
      {source && <SourceBadge type={source} />}
    </div>
  );

  return (
    <div className="fr-forms-tab">
      <div className="fr-forms-section">
        <div className="section-label">CIT-0001 — §5 ABOUT THE APPLICANT</div>
        <Field label="Surname" value={p.fullName?.split(' ').pop()} source="Birth cert" />
        <Field label="Given name(s)" value={p.fullName?.split(' ').slice(0, -1).join(' ')} source="Birth cert" />
        <Field label="Date of birth" value={p.dob} source="Birth cert" />
        <Field label="Place of birth" value={p.pob} source="Birth cert" />
        <Field label="Country of birth" value={p.country} source="Birth cert" />
        <Field label="Gender" value={p.gender} source="Birth cert" />
        {p.height && <Field label="Height" value={p.height} source="Client input" />}
        {p.eyeColor && <Field label="Eye colour" value={p.eyeColor} source="Client input" />}
      </div>
      {cp && (
        <div className="fr-forms-section">
          <div className="section-label">CIT-0001 — §8 CANADIAN PARENT</div>
          <Field label="Surname" value={cp.fullName?.split(' ').pop()} source="Birth cert" />
          <Field label="Given name(s)" value={cp.fullName?.split(' ').slice(0, -1).join(' ')} source="Birth cert" />
          <Field label="Date of birth" value={cp.dob} source="Birth cert" />
          <Field label="Place of birth" value={cp.pob} source="Birth cert" />
          {cp.regNumber && <Field label="Registration #" value={cp.regNumber} source="Birth cert" />}
          <Field label="How became Canadian" value={cp.howBecameCitizen} source="Intake" />
          {cp.marriageDate && <Field label="Date of marriage" value={cp.marriageDate} source="Marriage cert" />}
        </div>
      )}
      <div className="fr-forms-section">
        <div className="section-label">CIT-0001 — §14 CONTACT</div>
        <Field label="Email" value={p.email} source="Client input" />
        <Field label="Phone" value={p.phone} source="Client input" />
        <Field label="Address" value={p.address} source="Client input" />
        <Field label="Mailing address" value="Cohen Immigration Law, 123 Bay Street, Suite 1200, Toronto, ON M5J 2T2" source="Default" />
      </div>
      <div className="fr-forms-section">
        <div className="section-label">CIT-0001 — §15 REPRESENTATIVE</div>
        <Field label="Representative" value="Olivia Cohen, Cohen Immigration Law" source="Default" />
        <Field label="Paid representative" value="Yes" source="Default" />
      </div>
      <div className="fr-forms-section">
        <div className="section-label">IMM 5476 — USE OF A REPRESENTATIVE</div>
        <Field label="Family name" value={p.fullName?.split(' ').pop()} source="Birth cert" />
        <Field label="Given names" value={p.fullName?.split(' ').slice(0, -1).join(' ')} source="Birth cert" />
        <Field label="DOB" value={p.dob} source="Birth cert" />
        <Field label="Representative" value="Daniel Brian Levy, Cohen Immigration Law" source="Default" />
      </div>
    </div>
  );
}

// ─── COMMS TAB ───
function CommsTab({ client }) {
  const comms = client.comms || [];
  const [message, setMessage] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const { dispatch } = useApp();

  // Pre-draft message
  const preDraft = client.preDraftedMessage || '';
  useEffect(() => {
    if (preDraft && comms.length === 0) setMessage(preDraft);
  }, [preDraft]);

  const handleSend = () => {
    if (!message.trim()) return;
    dispatch({
      type: 'ADD_COMM',
      fileId: client.id,
      comm: {
        id: `c-${Date.now()}`,
        from: isInternal ? 'Victoria Rukaite (Internal)' : 'Victoria Rukaite',
        type: isInternal ? 'internal' : 'outbound',
        date: new Date().toISOString(),
        text: message,
      },
    });
    setMessage('');
  };

  return (
    <div className="fr-comms-tab">
      <div className="fr-comms-timeline">
        {comms.length === 0 && <div className="fr-tab-empty">No messages yet</div>}
        {comms.map(comm => (
          <div key={comm.id} className={`fr-comm ${comm.type === 'internal' ? 'fr-comm--internal' : comm.type === 'inbound' ? 'fr-comm--inbound' : ''}`}>
            <div className="fr-comm__header">
              <span className="fr-comm__from">{comm.from}</span>
              {comm.type === 'internal' && <span className="badge" style={{ background: 'var(--warn-bg)', color: 'var(--warn)', fontSize: 10 }}>Internal</span>}
              <span className="fr-comm__date">{new Date(comm.date).toLocaleString()}</span>
            </div>
            <p className="fr-comm__text">{comm.text}</p>
          </div>
        ))}
      </div>
      <div className="fr-comms-compose">
        <div className="fr-comms-compose__toggle">
          <button className={`filter-pill ${!isInternal ? 'filter-pill--active' : ''}`} onClick={() => setIsInternal(false)}>Client Message</button>
          <button className={`filter-pill ${isInternal ? 'filter-pill--active' : ''}`} onClick={() => setIsInternal(true)}>Internal Note</button>
        </div>
        <textarea className="fr-comms-compose__input" value={message} onChange={e => setMessage(e.target.value)} placeholder={isInternal ? 'Add an internal note...' : 'Write a message to the client...'} rows={3} />
        <button className="btn btn--primary btn--sm" onClick={handleSend} disabled={!message.trim()}>
          <Send size={13} /> Send
        </button>
      </div>
    </div>
  );
}

// ─── ESCALATION MODAL ───
function EscalationModal({ flag, client, onClose, onConfirm }) {
  const [note, setNote] = useState(flag ? `All documents in chain are present. ${flag.description} Per our protocol, this requires attorney sign-off.` : '');
  return (
    <div className="fr-modal-overlay modal-overlay" onClick={onClose}>
      <div className="fr-modal modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="fr-modal__title">Escalate to Attorney</h3>
        <p className="fr-modal__desc">This file will be sent to Olivia Cohen for legal review.</p>
        <label className="fr-modal__label">Internal note — context for the attorney <span style={{ color: 'var(--error)' }}>*</span></label>
        <textarea className="fr-modal__textarea" value={note} onChange={e => setNote(e.target.value)} rows={4} />
        <div className="fr-modal__actions">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button className="btn btn--primary" disabled={!note.trim()} onClick={() => onConfirm(note)}>
            Escalate
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── FLAG FORM MODAL ───
function FlagFormModal({ flag, client, onClose, onStage }) {
  const [title, setTitle] = useState(flag?.title || '');
  const [instructions, setInstructions] = useState(flag?.suggestedTemplate ? '' : '');
  const [severity, setSeverity] = useState('correction');

  return (
    <div className="fr-modal-overlay modal-overlay" onClick={onClose}>
      <div className="fr-modal modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="fr-modal__title">Create Client Flag</h3>
        <label className="fr-modal__label">Title</label>
        <input className="fr-modal__input" value={title} onChange={e => setTitle(e.target.value)} />
        {flag?.applicant && (
          <><label className="fr-modal__label">Applicant</label><input className="fr-modal__input" value={flag.applicant} readOnly /></>
        )}
        <label className="fr-modal__label">Severity</label>
        <div className="fr-modal__radio-group">
          <label><input type="radio" name="severity" checked={severity === 'correction'} onChange={() => setSeverity('correction')} /> Correction</label>
          <label><input type="radio" name="severity" checked={severity === 'clarification'} onChange={() => setSeverity('clarification')} /> Clarification</label>
        </div>
        <label className="fr-modal__label">Instructions to client</label>
        <textarea className="fr-modal__textarea" value={instructions} onChange={e => setInstructions(e.target.value)} rows={3} placeholder={flag?.description || 'Describe what the client needs to do...'} />
        <div className="fr-modal__actions">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button className="btn btn--warn-outline" onClick={() => { onStage({ title, severity, instructions: instructions || flag?.description }); onClose(); }}>
            Stage Flag
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN FILE REVIEW ───
export default function FileReview() {
  const { state, dispatch, getClient } = useApp();
  const client = getClient(state.selectedFileId);
  const [rightPanelExpanded, setRightPanelExpanded] = useState(false);
  const [rightTab, setRightTab] = useState('documents');
  const [approveState, setApproveState] = useState(null); // null | 'confirmed'
  const [showEscalationModal, setShowEscalationModal] = useState(null);
  const [showFlagModal, setShowFlagModal] = useState(null);
  const [highlightedDoc, setHighlightedDoc] = useState(null);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnNote, setReturnNote] = useState('');

  if (!client) return null;

  const isAttorney = state.currentRole === 'olivia';
  const isClean = (client.flags || []).length === 0 && (client.previousFlags || []).length === 0;
  const allChecksPassed = client.checklist && client.checklist.passed === client.checklist.total;
  const isSpeed1 = client.speed === 1 || (isClean && !rightPanelExpanded);
  const showNarrowSidebar = isSpeed1 && !rightPanelExpanded;
  const hasRequiresAttorneyFlag = (client.flags || []).some(f => f.requiresAttorney);

  // Determine primary actions based on state
  const getActions = () => {
    // Attorney views file as read-only context — no CM actions
    if (isAttorney) {
      return { left: null, right: null };
    }

    switch (client.state) {
      case 'eligibility_hold':
        return { left: { label: 'Message Client', style: 'btn--outline' }, right: { label: 'Escalate to Attorney', style: 'btn--primary' } };
      case 'forms_received':
        return { left: { label: 'Flag Issue', style: 'btn--warn-outline' }, right: { label: 'Confirm — Submit to IRCC', style: 'btn--primary' } };
      case 'aor_received':
        return { left: null, right: { label: 'Notify Client', style: 'btn--primary btn--full' } };
      case 'government_questions':
        return { left: { label: 'Message Client', style: 'btn--outline' }, right: { label: 'Escalate to Attorney', style: 'btn--primary' } };
      case 'application_approved_gov':
        return { left: null, right: { label: 'Notify & Congratulate', style: 'btn--primary btn--full' } };
      case 'awaiting_documents':
        return { left: null, right: { label: 'Send Follow-up', style: 'btn--primary btn--full' } };
      default:
        // If any flag requiresAttorney, show Escalate instead of Approve
        if (hasRequiresAttorneyFlag) {
          return {
            left: { label: 'Message Client', style: 'btn--outline' },
            right: { label: 'Escalate to Attorney', style: 'btn--primary' },
          };
        }
        return {
          left: { label: 'Flag Client', style: 'btn--warn-outline' },
          right: {
            label: client.type === 'family' ? 'Approve Family ✓' : 'Approve ✓',
            style: 'btn--primary',
          },
        };
    }
  };

  const actions = getActions();

  const handleApprove = () => {
    setApproveState('confirmed');
    dispatch({ type: 'APPROVE_FILE', fileId: client.id });
    setTimeout(() => {
      dispatch({ type: 'CLOSE_FILE' });
      dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
      setTimeout(() => {
        dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id });
      }, 450);
    }, 800);
  };

  const handlePrimaryRight = () => {
    if (actions.right?.label?.includes('Approve')) {
      handleApprove();
    } else if (actions.right?.label?.includes('Escalate')) {
      setShowEscalationModal({});
    } else if (actions.right?.label?.includes('Notify') || actions.right?.label?.includes('Congratulate')) {
      dispatch({ type: 'CLOSE_FILE' });
      dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
      setTimeout(() => dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id }), 450);
    } else if (actions.right?.label?.includes('Submit')) {
      dispatch({ type: 'CLOSE_FILE' });
      dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
      setTimeout(() => dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id }), 450);
    } else if (actions.right?.label?.includes('Follow-up')) {
      // Send a follow-up message and remove from queue
      dispatch({
        type: 'ADD_COMM',
        fileId: client.id,
        comm: {
          id: `c-${Date.now()}`,
          from: 'Victoria Rukaite',
          type: 'outbound',
          date: new Date().toISOString(),
          text: 'Hi — just checking in on document gathering. Please let us know if you need any help with the outstanding items.',
        },
      });
      dispatch({ type: 'CLOSE_FILE' });
      dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
      setTimeout(() => dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id }), 450);
    }
  };

  const handleEscalateConfirm = (note) => {
    const flag = showEscalationModal?.flag || (client.flags && client.flags[0]);
    dispatch({
      type: 'ESCALATE_TO_ATTORNEY',
      fileId: client.id,
      note,
      badge: flag?.severity === 'critical' ? 'Eligibility' : 'Edge Case',
      badgeColor: flag?.severity === 'critical' ? 'red' : 'amber',
      reason: flag?.title || '',
    });
    setShowEscalationModal(null);
    dispatch({ type: 'CLOSE_FILE' });
    dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
    setTimeout(() => dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id }), 450);
  };

  const handleConvertFlag = (flag) => {
    setShowFlagModal(flag);
  };

  const handleStageFlag = (flagData) => {
    dispatch({ type: 'STAGE_FLAG', flag: flagData });
  };

  const handleSendFlags = () => {
    dispatch({ type: 'SEND_FLAGS', fileId: client.id });
    dispatch({ type: 'CLOSE_FILE' });
    dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
    setTimeout(() => dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id }), 450);
  };

  const displayName = client.displayName || client.name;
  const defaultTab = ['aor_received', 'application_approved_gov', 'eligibility_hold'].includes(client.state) ? 'comms' : 'documents';

  return (
    <div className={`fr file-review-enter`}>
      {/* Header bar */}
      <header className="fr-header">
        <button className="fr-header__back" onClick={() => dispatch({ type: 'CLOSE_FILE' })}>
          <ArrowLeft size={18} />
          <span>Back to {state.previousView === 'caseload' ? 'Caseload' : 'Queue'}</span>
        </button>
        <div className="fr-header__center">
          <h1 className="fr-header__name">
            {displayName}
            {client.type === 'family' && (
              <span className="badge badge--family" style={{ marginLeft: 8 }}>
                <Users size={11} style={{ marginRight: 3 }} />
                {client.familyCount} applicants
              </span>
            )}
          </h1>
        </div>
        <StatusPill fileState={client.state} />
      </header>

      {/* Panels */}
      <div className="fr-panels">
        {/* Left Panel */}
        <div className={`fr-left panel-transition ${showNarrowSidebar ? 'fr-left--wide' : ''}`}>
          <div className="fr-left__scroll">
            <AIBrief text={client.aiBrief || 'No brief available.'} />
            <Checklist client={client} />
            <ActionItems
              client={client}
              onEscalate={(flag) => setShowEscalationModal({ flag })}
              onConvertFlag={handleConvertFlag}
              isReadOnly={isAttorney}
              onHighlightDoc={(docTitle) => {
                setRightPanelExpanded(true);
                setRightTab('documents');
                setHighlightedDoc(docTitle);
                setTimeout(() => setHighlightedDoc(null), 1500);
              }}
            />
            <FileInfo client={client} />

            {/* Staged flags */}
            {state.stagedFlags.length > 0 && (
              <div className="fr-section">
                <div className="section-label">STAGED FLAGS ({state.stagedFlags.length})</div>
                {state.stagedFlags.map((f, i) => (
                  <div key={i} className="fr-flag-card" style={{ borderColor: 'var(--warn)' }}>
                    <span>{f.title}</span>
                    <button className="btn btn--ghost btn--sm" onClick={() => dispatch({ type: 'REMOVE_STAGED_FLAG', index: i })}>Remove</button>
                  </div>
                ))}
                <button className="btn btn--warn-outline" style={{ marginTop: 8 }} onClick={handleSendFlags}>
                  Send {state.stagedFlags.length} Flag{state.stagedFlags.length > 1 ? 's' : ''} to Client
                </button>
              </div>
            )}

            {/* Attorney actions when viewing full file */}
            {isAttorney && (
              <div className="fr-primary-actions">
                <button className="btn btn--outline" onClick={() => { setRightPanelExpanded(true); setRightTab('comms'); }}>
                  Message Client
                </button>
                <button className="btn btn--primary" onClick={() => setShowReturnModal(true)}>
                  Return to CM <ArrowRight size={14} />
                </button>
              </div>
            )}

            {/* Primary actions — hidden for attorney read-only view */}
            {!isAttorney && (actions.left || actions.right) && (
              <div className="fr-primary-actions">
                {actions.left && (
                  <button className={`btn ${actions.left.style}`} onClick={() => {
                    if (actions.left.label === 'Flag Client') setShowFlagModal({});
                    else if (actions.left.label === 'Flag Issue') setShowFlagModal({});
                    else if (actions.left.label === 'Message Client') { setRightPanelExpanded(true); setRightTab('comms'); }
                  }}>
                    {actions.left.label}
                  </button>
                )}
                {actions.right && (
                  <button
                    className={`btn ${actions.right.style} ${approveState === 'confirmed' ? 'approval-confirmed' : ''}`}
                    onClick={handlePrimaryRight}
                    disabled={approveState === 'confirmed'}
                  >
                    {approveState === 'confirmed' ? 'Confirmed ✓' : actions.right.label}
                  </button>
                )}
              </div>
            )}
            {/* Monogram watermark */}
            <div className="fr-watermark" aria-hidden="true">C</div>
          </div>
        </div>

        {/* Right Panel */}
        <div className={`fr-right panel-transition ${showNarrowSidebar ? 'fr-right--narrow' : ''}`}>
          {showNarrowSidebar ? (
            <DocumentSidebar client={client} onExpand={() => setRightPanelExpanded(true)} />
          ) : (
            <div className="fr-right__full">
              <div className="fr-right__tabs">
                <button className={`fr-right__tab ${rightTab === 'documents' ? 'active' : ''}`} onClick={() => setRightTab('documents')}>
                  <FileText size={15} /> Documents
                </button>
                <button className={`fr-right__tab ${rightTab === 'forms' ? 'active' : ''}`} onClick={() => setRightTab('forms')}>
                  <ClipboardList size={15} /> Forms
                </button>
                <button className={`fr-right__tab ${rightTab === 'comms' ? 'active' : ''}`} onClick={() => setRightTab('comms')}>
                  <MessageSquare size={15} /> Comms
                </button>
              </div>
              <div className="fr-right__content">
                {rightTab === 'documents' && <DocumentsTab client={client} highlightedDoc={highlightedDoc} />}
                {rightTab === 'forms' && <FormsTab client={client} />}
                {rightTab === 'comms' && <CommsTab client={client} />}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showEscalationModal && (
        <EscalationModal
          flag={showEscalationModal.flag}
          client={client}
          onClose={() => setShowEscalationModal(null)}
          onConfirm={handleEscalateConfirm}
        />
      )}
      {showFlagModal && (
        <FlagFormModal
          flag={showFlagModal}
          client={client}
          onClose={() => setShowFlagModal(null)}
          onStage={handleStageFlag}
        />
      )}
      {showReturnModal && (
        <div className="fr-modal-overlay modal-overlay" onClick={() => setShowReturnModal(false)}>
          <div className="fr-modal fr-modal--wide modal-content" onClick={e => e.stopPropagation()}>
            <h3 className="fr-modal__title">Return to Case Manager</h3>
            <p className="fr-modal__desc">This file (<strong>{displayName}</strong>) will be returned to the assigned CM with your determination.</p>
            <label className="fr-modal__label">Attorney determination <span style={{ color: 'var(--error)' }}>*</span></label>
            <textarea className="fr-modal__textarea" value={returnNote} onChange={e => setReturnNote(e.target.value)} rows={4} placeholder='e.g. "Proceed — adoption exemption applies under Section 5.1"' />
            <div className="fr-modal__actions">
              <button className="btn btn--outline" onClick={() => setShowReturnModal(false)}>Cancel</button>
              <button className="btn btn--primary" disabled={!returnNote.trim()} onClick={() => {
                dispatch({ type: 'RETURN_TO_CM', fileId: client.id, determination: returnNote });
                setShowReturnModal(false);
                dispatch({ type: 'CLOSE_FILE' });
              }}>
                Return to CM <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
