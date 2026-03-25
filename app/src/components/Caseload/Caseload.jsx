import { useApp } from '../../context/AppContext.jsx';
import { STATUS_CONFIG } from '../../data/mockData.js';
import { Search, ArrowUpDown } from 'lucide-react';
import { useState, useMemo } from 'react';
import './Caseload.css';

const LIFECYCLE_PHASES = {
  'pre-sub':  { label: 'Pre-Sub', color: 'var(--accent-light)', states: ['intake_in_progress','eligibility_hold','awaiting_documents','submitted_for_review','in_review','changes_requested','client_resubmitted'] },
  'active':   { label: 'Active', color: 'var(--success)', states: ['approved','awaiting_signature'] },
  'post-sub': { label: 'Post-Sub', color: 'var(--blue)', states: ['forms_in_transit','forms_received','submitted_to_ircc','awaiting_aor','aor_received','government_processing','government_questions','application_approved_gov'] },
  'dormant':  { label: 'Dormant', color: 'var(--warn)', isDormant: true },
  'complete': { label: 'Complete', color: 'var(--text-mut)', states: ['closed'] },
};

const CASELOAD_FILTERS = [
  { id: 'all', label: 'All Files' },
  { id: 'pre-sub', label: 'Pre-Submission' },
  { id: 'active', label: 'Active' },
  { id: 'post-sub', label: 'Post-Submission' },
  { id: 'dormant', label: 'Dormant' },
  { id: 'complete', label: 'Complete' },
];

function getPhase(client) {
  if (client.isDormant) return 'dormant';
  for (const [key, phase] of Object.entries(LIFECYCLE_PHASES)) {
    if (phase.states && phase.states.includes(client.state)) return key;
  }
  return 'pre-sub';
}

function getDaysInStage(client) {
  const t = client.timeInState;
  if (!t) return 0;
  if (t.includes('d')) return parseInt(t);
  if (t.includes('h')) return 0;
  return 0;
}

function StatusPill({ state }) {
  const config = STATUS_CONFIG[state];
  if (!config) return null;
  return <span className={`status-pill status-pill--${config.pill}`}>{config.label}</span>;
}

export default function Caseload({ readOnly, cmName }) {
  const { state, dispatch, getCaseload } = useApp();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortCol, setSortCol] = useState('client');
  const [sortDir, setSortDir] = useState('asc');

  const caseload = getCaseload();

  // Phase counts
  const phaseCounts = useMemo(() => {
    const counts = {};
    caseload.forEach(c => {
      const phase = getPhase(c);
      counts[phase] = (counts[phase] || 0) + 1;
    });
    return counts;
  }, [caseload]);

  // Filter
  const filtered = useMemo(() => {
    let list = caseload;
    if (filter !== 'all') {
      list = list.filter(c => getPhase(c) === filter);
    }
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(c => (c.displayName || c.name).toLowerCase().includes(s));
    }
    return list;
  }, [caseload, filter, search]);

  // Sort
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let cmp = 0;
      switch (sortCol) {
        case 'client': cmp = (a.displayName || a.name).localeCompare(b.displayName || b.name); break;
        case 'status': cmp = a.state.localeCompare(b.state); break;
        case 'opened': cmp = (a.fileOpened || '').localeCompare(b.fileOpened || ''); break;
        case 'days': cmp = getDaysInStage(a) - getDaysInStage(b); break;
        default: cmp = 0;
      }
      return sortDir === 'desc' ? -cmp : cmp;
    });
  }, [filtered, sortCol, sortDir]);

  const handleSort = (col) => {
    if (sortCol === col) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortCol(col); setSortDir('asc'); }
  };

  const totalBar = Object.entries(LIFECYCLE_PHASES).map(([key, phase]) => {
    const count = phaseCounts[key] || 0;
    if (count === 0) return null;
    const pct = (count / caseload.length) * 100;
    return { key, label: phase.label, color: phase.color, count, pct };
  }).filter(Boolean);

  return (
    <div className="caseload">
      {readOnly && (
        <div className="caseload__readonly-banner">Viewing {cmName}'s caseload — Read only</div>
      )}




      {/* Filters + Search */}
      <div className="caseload__toolbar">
        <div className="caseload__filters">
          {CASELOAD_FILTERS.map(f => (
            <button key={f.id} className={`filter-pill ${filter === f.id ? 'filter-pill--active' : ''}`}
              onClick={() => setFilter(f.id)}>{f.label}</button>
          ))}
        </div>
        <div className="caseload__search">
          <Search size={15} color="var(--text-mut)" />
          <input type="text" placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="caseload__table-wrap">
        <table className="caseload__table">
          <thead>
            <tr>
              <th onClick={() => handleSort('client')} style={{ width: '18%' }}>Client <ArrowUpDown size={12} /></th>
              <th onClick={() => handleSort('status')} style={{ width: '14%' }}>Status <ArrowUpDown size={12} /></th>
              <th onClick={() => handleSort('opened')} style={{ width: '10%' }}>Opened <ArrowUpDown size={12} /></th>
              <th style={{ width: '22%' }}>Last Activity</th>
              <th onClick={() => handleSort('days')} style={{ width: '10%' }}>Days in Stage <ArrowUpDown size={12} /></th>
              <th style={{ width: '26%' }}>Next Expected</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map(client => {
              const days = getDaysInStage(client);
              const daysCls = days >= 30 ? 'caseload__days--error' : days >= 14 ? 'caseload__days--warn' : '';
              return (
                <tr key={client.id} onClick={() => !readOnly && dispatch({ type: 'OPEN_FILE', fileId: client.id })} className={readOnly ? '' : 'clickable'}>
                  <td className="caseload__client-cell">
                    <span className="caseload__client-name">{client.displayName || client.name}</span>
                    {client.type === 'family' && <span className="badge badge--family" style={{ fontSize: 10 }}>Family · {client.familyCount}</span>}
                  </td>
                  <td><StatusPill state={client.state} /></td>
                  <td className="caseload__date">{client.fileOpened || '—'}</td>
                  <td className="caseload__activity">{client.queueSummary || '—'}</td>
                  <td className={`caseload__days ${daysCls}`}>{client.timeInState || '—'}</td>
                  <td className="caseload__next">{getNextExpected(client)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {sorted.length === 0 && <div className="caseload__empty">No files match this filter.</div>}
      </div>
    </div>
  );
}

function getNextExpected(client) {
  switch (client.state) {
    case 'submitted_for_review': case 'client_resubmitted': return 'CM review';
    case 'changes_requested': return 'Client response';
    case 'approved': return 'Client prints & signs forms';
    case 'awaiting_documents': return 'Client uploads documents';
    case 'forms_received': return 'CM verifies signatures';
    case 'submitted_to_ircc': return 'AOR from IRCC (~4 weeks)';
    case 'government_processing': return 'IRCC decision (~9-11 months)';
    case 'government_questions': return 'Attorney response to IRCC';
    case 'aor_received': return 'Notify client';
    case 'application_approved_gov': return 'Notify client';
    case 'eligibility_hold': return 'Attorney review';
    case 'closed': return 'Complete';
    default: return '—';
  }
}
