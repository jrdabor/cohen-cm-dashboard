import { useApp } from '../../context/AppContext.jsx';
import { TEAM_METRICS, TEAM_AGGREGATES, CLIENTS, STATUS_CONFIG } from '../../data/mockData.js';
import { TrendingUp, AlertTriangle, Clock, Users, FileCheck } from 'lucide-react';
import './TeamView.css';

const CM_NAMES = { victoria: 'Victoria Rukaite', david: 'David Chen' };

function MetricCard({ label, value, icon: Icon, color, subtitle }) {
  return (
    <div className="team-metric-card">
      <div className="team-metric-card__icon" style={{ color }}><Icon size={20} /></div>
      <div className="team-metric-card__data">
        <span className="team-metric-card__value">{value}</span>
        <span className="team-metric-card__label">{label}</span>
        {subtitle && <span className="team-metric-card__sub">{subtitle}</span>}
      </div>
    </div>
  );
}

function CMRow({ cmId, metrics, onClick }) {
  const name = CM_NAMES[cmId];
  const isWarn = metrics.slaCompliance < 95;

  // Compute file distribution
  const cmClients = CLIENTS.filter(c => c.assignedCm === cmId);
  const statusCounts = {};
  cmClients.forEach(c => {
    const cfg = STATUS_CONFIG[c.state];
    if (cfg) {
      const label = cfg.label;
      statusCounts[label] = (statusCounts[label] || 0) + 1;
    }
  });

  return (
    <div className="team-cm-row" onClick={onClick}>
      <div className="team-cm-row__avatar">{name.split(' ').map(n => n[0]).join('')}</div>
      <div className="team-cm-row__info">
        <span className="team-cm-row__name">{name}</span>
        <span className="team-cm-row__sub">{metrics.files} files · {metrics.queueDepth} in queue</span>
      </div>
      <div className="team-cm-row__stats">
        <div className="team-cm-row__stat">
          <span className="team-cm-row__stat-val">{metrics.reviewedToday}/{metrics.target}</span>
          <span className="team-cm-row__stat-label">Today</span>
        </div>
        <div className="team-cm-row__stat">
          <span className="team-cm-row__stat-val">{metrics.avgReviewTime}</span>
          <span className="team-cm-row__stat-label">Avg Time</span>
        </div>
        <div className="team-cm-row__stat">
          <span className={`team-cm-row__stat-val ${isWarn ? 'team-cm-row__stat-val--warn' : ''}`}>{metrics.slaCompliance}%</span>
          <span className="team-cm-row__stat-label">SLA</span>
        </div>
        <div className="team-cm-row__stat">
          <span className="team-cm-row__stat-val">{metrics.flagRate}%</span>
          <span className="team-cm-row__stat-label">Flag Rate</span>
        </div>
        {metrics.overdue > 0 && (
          <div className="team-cm-row__stat">
            <span className="team-cm-row__stat-val team-cm-row__stat-val--error">{metrics.overdue}</span>
            <span className="team-cm-row__stat-label">Overdue</span>
          </div>
        )}
      </div>
      {Object.keys(statusCounts).length > 0 && (
        <div className="team-cm-row__distribution">
          {Object.entries(statusCounts).map(([label, count]) => (
            <span key={label} className="team-cm-row__dist-pill">{label}: {count}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function TeamView() {
  const { dispatch } = useApp();
  const agg = TEAM_AGGREGATES;

  return (
    <div className="team">
      <h2 className="team__title display-font">Team Overview</h2>

      {/* Aggregate Cards */}
      <div className="team__aggregates">
        <MetricCard label="Total Files" value={agg.totalFiles} icon={FileCheck} color="var(--accent)" />
        <MetricCard label="In Queue" value={agg.queueItems} icon={Clock} color="var(--blue)" />
        <MetricCard label="Overdue" value={agg.overdue} icon={AlertTriangle} color={agg.overdue > 0 ? 'var(--error)' : 'var(--success)'} />
        <MetricCard label="Daily Rate" value={agg.dailyRate} icon={TrendingUp} color="var(--accent-light)" subtitle="files reviewed today" />
      </div>

      {/* CM Cards */}
      <div className="section-label" style={{ marginTop: 'var(--sp-lg)' }}>CASE MANAGERS</div>
      <div className="team__cm-list">
        {Object.entries(TEAM_METRICS).map(([cmId, metrics]) => (
          <CMRow
            key={cmId}
            cmId={cmId}
            metrics={metrics}
            onClick={() => {
              dispatch({ type: 'SET_VIEW', view: 'caseload' });
            }}
          />
        ))}
      </div>
    </div>
  );
}
