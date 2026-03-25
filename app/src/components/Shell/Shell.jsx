import { useApp } from '../../context/AppContext.jsx';
import { STAFF } from '../../data/mockData.js';
import { ChevronDown, RotateCcw } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import './Shell.css';

const ROLES = [
  { id: 'victoria', label: 'Victoria Rukaite', subtitle: 'Case Manager' },
  { id: 'tereza', label: 'Tereza Monkova', subtitle: 'Supervisor' },
  { id: 'olivia', label: 'Olivia Cohen', subtitle: 'Attorney' },
];

const NAV_TABS = {
  victoria: [
    { id: 'queue', label: 'My Queue' },
    { id: 'caseload', label: 'My Caseload' },
  ],
  tereza: [
    { id: 'queue', label: 'My Queue' },
    { id: 'caseload', label: 'My Caseload' },
    { id: 'team', label: 'Team' },
  ],
  olivia: [
    { id: 'escalations', label: 'My Escalations' },
  ],
};

export default function Shell({ children }) {
  const { state, dispatch } = useApp();
  const [roleDropdown, setRoleDropdown] = useState(false);
  const dropdownRef = useRef(null);

  const currentUser = ROLES.find(r => r.id === state.currentRole) || ROLES[0];
  const tabs = NAV_TABS[state.currentRole] || NAV_TABS.victoria;

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setRoleDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (state.currentView === 'fileReview') {
    return <>{children}</>;
  }

  return (
    <div className="shell">
      {/* Header */}
      <header className="shell-header">
        <div className="shell-header__left">
          <div className="shell-logo">
            <span className="shell-logo__mark">C</span>
            <div className="shell-logo__text">
              <span className="shell-logo__firm">Cohen Immigration Law</span>
              <span className="shell-logo__product">Case Manager Dashboard</span>
            </div>
          </div>
        </div>
        <div className="shell-header__right">
          <button
            className="btn btn--ghost btn--sm shell-reset"
            onClick={() => dispatch({ type: 'RESET_DEMO' })}
          >
            <RotateCcw size={14} />
            Reset Demo
          </button>

          <div className="shell-role-switcher" ref={dropdownRef}>
            <button
              className="shell-role-btn"
              onClick={() => setRoleDropdown(!roleDropdown)}
            >
              <div className="shell-role-avatar">
                {currentUser.label.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="shell-role-info">
                <span className="shell-role-name">{currentUser.label}</span>
                <span className="shell-role-subtitle">{currentUser.subtitle}</span>
              </div>
              <ChevronDown size={16} className={`shell-role-chevron ${roleDropdown ? 'open' : ''}`} />
            </button>

            {roleDropdown && (
              <div className="shell-role-dropdown">
                {ROLES.map(role => (
                  <button
                    key={role.id}
                    className={`shell-role-option ${role.id === state.currentRole ? 'active' : ''}`}
                    onClick={() => {
                      dispatch({ type: 'SET_ROLE', role: role.id });
                      setRoleDropdown(false);
                    }}
                  >
                    <div className="shell-role-avatar shell-role-avatar--sm">
                      {role.label.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="shell-role-option__name">{role.label}</div>
                      <div className="shell-role-option__subtitle">{role.subtitle}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Nav Tabs */}
      <nav className="shell-nav">
        <div className="shell-nav__tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`shell-nav__tab ${state.currentView === tab.id ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_VIEW', view: tab.id })}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Content */}
      <main className="shell-content">
        {children}
      </main>
    </div>
  );
}
