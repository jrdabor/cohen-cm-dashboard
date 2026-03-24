import { useApp } from '../../context/AppContext.jsx';
import { useEffect, useState } from 'react';
import './CockpitStrip.css';

function ProgressRing({ value, max }) {
  const size = 42;
  const stroke = 3;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(value / max, 1);
  const offset = circumference * (1 - progress);

  return (
    <svg width={size} height={size} className="progress-ring">
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--border-light)" strokeWidth={stroke}
      />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        fill="none" stroke="var(--accent)" strokeWidth={stroke}
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        style={{ transition: 'stroke-dashoffset 300ms ease-out' }}
      />
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central"
        style={{ fontSize: '12px', fontWeight: 600, fill: 'var(--text)' }}>
        {value}
      </text>
    </svg>
  );
}

function FlameIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" className="flame-icon" fill="none">
      <path d="M8 1C8 1 4 5.5 4 9C4 11.2 5.8 13 8 13C10.2 13 12 11.2 12 9C12 5.5 8 1 8 1Z"
        fill="var(--warn)" opacity="0.9" />
      <path d="M8 5C8 5 6 7.5 6 9.5C6 10.6 6.9 11.5 8 11.5C9.1 11.5 10 10.6 10 9.5C10 7.5 8 5 8 5Z"
        fill="#F59E0B" />
    </svg>
  );
}

export default function CockpitStrip() {
  const { state, dispatch, getQueueItems } = useApp();
  const [pulseClass, setPulseClass] = useState('');

  const role = state.currentRole === 'tereza' ? 'victoria' : state.currentRole;
  const cockpit = state.cockpit[role] || state.cockpit.victoria;
  const queueItems = getQueueItems();

  // Count queue categories
  const counts = { review: 0, resub: 0, hold: 0, postSub: 0 };
  queueItems.forEach(c => {
    if (!c) return;
    if (c.state === 'submitted_for_review') counts.review++;
    else if (c.state === 'client_resubmitted') counts.resub++;
    else if (c.state === 'eligibility_hold') counts.hold++;
    else if (['forms_received', 'aor_received', 'government_questions', 'application_approved_gov'].includes(c.state)) counts.postSub++;
  });

  // Watch items
  const overdue = state.clients.filter(c => c.isOverdue && c.assignedCm === (role)).length;
  const withAttorney = state.clients.filter(c => c.awaitingAttorney).length;
  const followUps = queueItems.filter(c => c && c.isDormant).length;

  // Counter pulse animation
  useEffect(() => {
    if (state.counterPulse) {
      setPulseClass('counter-pulse');
      const t = setTimeout(() => {
        setPulseClass('');
        dispatch({ type: 'COUNTER_PULSE_DONE' });
      }, 300);
      return () => clearTimeout(t);
    }
  }, [state.counterPulse, dispatch]);

  return (
    <div className="cockpit">
      {/* Cluster 1: My Day */}
      <div className="cockpit__cluster cockpit__my-day">
        <ProgressRing value={cockpit.reviewedToday} max={cockpit.target} />
        <div className="cockpit__day-info">
          <span className={`cockpit__reviewed ${pulseClass}`}>
            {cockpit.reviewedToday} reviewed
          </span>
          <span className="cockpit__streak">
            <FlameIcon />
            {cockpit.streak}-day streak
          </span>
        </div>
      </div>

      {/* Cluster 2: Needs Me */}
      <div className="cockpit__cluster cockpit__needs-me">
        {counts.review > 0 && (
          <button className="cockpit__badge" onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: 'review' })}>
            {counts.review} review
          </button>
        )}
        {counts.resub > 0 && (
          <button className="cockpit__badge cockpit__badge--accent" onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: 'resubmitted' })}>
            {counts.resub} re-sub
          </button>
        )}
        {counts.hold > 0 && (
          <button className="cockpit__badge cockpit__badge--warn" onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: 'holds' })}>
            {counts.hold} hold
          </button>
        )}
        {counts.postSub > 0 && (
          <button className="cockpit__badge" onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: 'post-sub' })}>
            {counts.postSub} post-sub
          </button>
        )}
        {counts.review + counts.resub + counts.hold + counts.postSub === 0 && (
          <span className="cockpit__all-clear">All clear ✓</span>
        )}
      </div>

      {/* Cluster 3: Watch */}
      <div className="cockpit__cluster cockpit__watch">
        {overdue > 0 && (
          <button className="cockpit__alert cockpit__alert--error" onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: 'overdue' })}>
            ⚠ {overdue} overdue
          </button>
        )}
        {withAttorney > 0 && (
          <span className="cockpit__alert cockpit__alert--info">
            {withAttorney} with attorney
          </span>
        )}
        {followUps > 0 && (
          <button className="cockpit__alert cockpit__alert--follow" onClick={() => dispatch({ type: 'SET_QUEUE_FILTER', filter: 'followups' })}>
            {followUps} follow-up due
          </button>
        )}
      </div>
    </div>
  );
}
