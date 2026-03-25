import { useApp } from '../../context/AppContext.jsx';
import { ArrowRight, Gavel } from 'lucide-react';
import { useState } from 'react';
import './EscalationQueue.css';

// ─── RETURN TO CM MODAL ───
function ReturnModal({ client, onClose, onConfirm }) {
  const [determination, setDetermination] = useState('');
  const displayName = client.displayName || client.name;

  return (
    <div className="fr-modal-overlay modal-overlay" onClick={onClose}>
      <div className="esc-return-modal modal-content" onClick={e => e.stopPropagation()}>
        <h3 className="esc-return-modal__title">Return to Case Manager</h3>
        <p className="esc-return-modal__desc">
          This file (<strong>{displayName}</strong>) will be returned to the assigned CM with your determination attached.
        </p>
        <label className="esc-return-modal__label">
          Attorney determination <span style={{ color: 'var(--error)' }}>*</span>
        </label>
        <textarea
          className="esc-return-modal__textarea"
          value={determination}
          onChange={e => setDetermination(e.target.value)}
          rows={4}
          placeholder='e.g. "Proceed — adoption exemption applies under Section 5.1"'
        />
        <div className="esc-return-modal__actions">
          <button className="btn btn--outline" onClick={onClose}>Cancel</button>
          <button
            className="btn btn--primary"
            disabled={!determination.trim()}
            onClick={() => onConfirm(determination)}
          >
            Return to CM <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EscalationQueue() {
  const { state, dispatch, getClient } = useApp();
  const escalations = state.attorneyEscalations || [];
  const [returnModalClient, setReturnModalClient] = useState(null);

  const handleReturnConfirm = (determination) => {
    dispatch({ type: 'RETURN_TO_CM', fileId: returnModalClient.id, determination });
    setReturnModalClient(null);
  };

  return (
    <div className="esc-queue">
      <h2 className="esc-queue__title display-font">My Escalations</h2>
      <p className="esc-queue__subtitle">{escalations.length} file{escalations.length !== 1 ? 's' : ''} awaiting your review</p>

      {escalations.length === 0 && (
        <div className="esc-queue__empty">
          <Gavel size={32} color="var(--text-mut)" />
          <p>No escalations pending. All clear.</p>
        </div>
      )}

      <div className="esc-queue__list">
        {escalations.map(esc => {
          const client = getClient(esc.clientId);
          if (!client) return null;
          const displayName = client.displayName || client.name;

          return (
            <div key={esc.clientId} className="esc-card">
              <div className="esc-card__header">
                <span className={`esc-card__badge esc-card__badge--${esc.badgeColor}`}>{esc.severityBadge}</span>
                <span className="esc-card__name">{displayName}</span>
                <span className="esc-card__date">Escalated: {esc.escalatedDate}</span>
              </div>
              <div className="esc-card__body">
                <div className="esc-card__row">
                  <span className="esc-card__label">Reason</span>
                  <span>{esc.reason}</span>
                </div>
                <div className="esc-card__row">
                  <span className="esc-card__label">Source CM</span>
                  <span>{esc.sourceCm === 'victoria' ? 'Victoria Rukaite' : esc.sourceCm}</span>
                </div>
                {esc.cmNote && (
                  <div className="esc-card__row esc-card__note">
                    <span className="esc-card__label">CM Note</span>
                    <span>{esc.cmNote}</span>
                  </div>
                )}
                <div className="esc-card__row">
                  <span className="esc-card__label">Chain</span>
                  <span className="mono">{client.chainShort || client.chain || '—'}</span>
                </div>
                {client.flags && client.flags.length > 0 && (
                  <div className="esc-card__flag">
                    <span className="esc-card__flag-title">{client.flags[0].title}</span>
                    <p className="esc-card__flag-desc">{client.flags[0].description}</p>
                  </div>
                )}
              </div>
              <div className="esc-card__actions">
                <button className="btn btn--outline" onClick={() => setReturnModalClient(client)}>
                  Return to CM
                </button>
                <button className="btn btn--primary" onClick={() => dispatch({ type: 'OPEN_FILE', fileId: esc.clientId })}>
                  View Full File <ArrowRight size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Return to CM Modal */}
      {returnModalClient && (
        <ReturnModal
          client={returnModalClient}
          onClose={() => setReturnModalClient(null)}
          onConfirm={handleReturnConfirm}
        />
      )}
    </div>
  );
}
