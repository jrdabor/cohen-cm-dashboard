import { useApp } from '../../context/AppContext.jsx';
import { STATUS_CONFIG } from '../../data/mockData.js';
import { ArrowRight, Send, Users } from 'lucide-react';
import { useState, useCallback } from 'react';
import './Queue.css';

const FILTERS = [
  { id: 'all', label: 'All Actionable' },
  { id: 'review', label: 'Ready for Review' },
  { id: 'resubmitted', label: 'Re-submitted' },
  { id: 'holds', label: 'Eligibility Holds' },
  { id: 'post-sub', label: 'Post-Submission' },
  { id: 'overdue', label: 'Overdue' },
  { id: 'followups', label: 'Follow-ups' },
];

function PriorityBar({ color }) {
  const colorMap = {
    red: '#C41E3A',
    amber: '#B45309',
    green: '#1A7D46',
    blue: '#1E56A0',
  };
  return <div className="queue-row__priority" style={{ background: colorMap[color] || colorMap.green }} />;
}

function StatusPill({ state: fileState }) {
  const config = STATUS_CONFIG[fileState];
  if (!config) return null;
  return <span className={`status-pill status-pill--${config.pill}`}>{config.label}</span>;
}

function TimeBadge({ time, state }) {
  let className = 'queue-row__time';
  // Color warnings for SLA
  if (time && (time.includes('d') && parseInt(time) >= 2)) className += ' queue-row__time--warn';
  return <span className={className}>{time}</span>;
}

export default function Queue() {
  const { state, dispatch, getQueueItems } = useApp();
  const [hoveredRow, setHoveredRow] = useState(null);

  const queueItems = getQueueItems();

  // Apply filter
  const filtered = queueItems.filter(client => {
    if (!client) return false;
    switch (state.queueFilter) {
      case 'review': return client.state === 'submitted_for_review';
      case 'resubmitted': return client.state === 'client_resubmitted';
      case 'holds': return client.state === 'eligibility_hold';
      case 'post-sub': return ['forms_received', 'aor_received', 'government_questions', 'application_approved_gov'].includes(client.state);
      case 'overdue': return client.isOverdue;
      case 'followups': return client.isDormant;
      default: return true;
    }
  });

  const handleRowClick = useCallback((clientId) => {
    if (state.exitingRowId === clientId) return;
    dispatch({ type: 'OPEN_FILE', fileId: clientId });
  }, [dispatch, state.exitingRowId]);

  const handleQuickAction = useCallback((e, client) => {
    e.stopPropagation();
    dispatch({ type: 'START_ROW_EXIT', fileId: client.id });
    setTimeout(() => {
      dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: client.id });
    }, 450);
  }, [dispatch]);

  const handleBatchFollowups = useCallback(() => {
    const dormantItems = filtered.filter(c => c.isDormant);
    dormantItems.forEach((c, i) => {
      setTimeout(() => {
        dispatch({ type: 'START_ROW_EXIT', fileId: c.id });
        setTimeout(() => {
          dispatch({ type: 'COMPLETE_ROW_EXIT', fileId: c.id });
        }, 450);
      }, i * 150);
    });
  }, [filtered, dispatch]);

  const showBatchButton = state.queueFilter === 'followups' && filtered.some(c => c.isDormant);

  return (
    <div className="queue">
      {/* Filter Pills */}
      <div className="queue__filters">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-pill ${state.queueFilter === f.id ? 'filter-pill--active' : ''}`}
            onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: f.id })}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Batch Action */}
      {showBatchButton && (
        <div className="queue__batch">
          <button className="btn btn--primary btn--sm" onClick={handleBatchFollowups}>
            <Send size={14} /> Send All Follow-ups
          </button>
        </div>
      )}

      {/* Queue Rows */}
      <div className="queue__list">
        {filtered.map(client => {
          if (!client) return null;
          const isExiting = state.exitingRowId === client.id;
          const displayName = client.displayName || client.name;

          return (
            <div
              key={client.id}
              className={`queue-row ${isExiting ? 'row-exiting' : ''}`}
              onClick={() => handleRowClick(client.id)}
              onMouseEnter={() => setHoveredRow(client.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <PriorityBar color={client.priorityBar} />

              <div className="queue-row__content">
                <div className="queue-row__left">
                  {client.type === 'family' && (
                    <span className="badge badge--family">
                      <Users size={11} style={{ marginRight: 3 }} />
                      Family · {client.familyCount}
                    </span>
                  )}
                  <span className="queue-row__name">{displayName}</span>
                </div>

                <div className="queue-row__center">
                  <span className="queue-row__summary">{client.queueSummary}</span>
                </div>

                <div className="queue-row__right">
                  {client.quickAction && hoveredRow === client.id && !isExiting && (
                    <button
                      className="queue-row__quick-action"
                      onClick={(e) => handleQuickAction(e, client)}
                    >
                      {client.quickAction.label}
                    </button>
                  )}
                  <TimeBadge time={client.timeInState} state={client.state} />
                </div>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="queue__empty">
            <p>No items match this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
