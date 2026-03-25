import { AppProvider, useApp } from './context/AppContext.jsx';
import Shell from './components/Shell/Shell.jsx';
import CockpitStrip from './components/CockpitStrip/CockpitStrip.jsx';
import Queue from './components/Queue/Queue.jsx';
import FileReview from './components/FileReview/FileReview.jsx';
import Caseload from './components/Caseload/Caseload.jsx';
import TeamView from './components/TeamView/TeamView.jsx';
import EscalationQueue from './components/EscalationQueue/EscalationQueue.jsx';

function Dashboard() {
  const { state } = useApp();

  if (state.currentView === 'fileReview') {
    return <FileReview />;
  }

  return (
    <Shell>
      {(state.currentView === 'queue' || state.currentView === 'caseload') && (
        <CockpitStrip />
      )}

      {state.currentView === 'queue' && <Queue />}
      {state.currentView === 'caseload' && <Caseload />}
      {state.currentView === 'team' && <TeamView />}
      {state.currentView === 'escalations' && <EscalationQueue />}
      {state.currentView === 'wip' && (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          minHeight: '60vh', gap: '12px', color: 'var(--text-mut)', textAlign: 'center', padding: '40px'
        }}>
          <div style={{ fontSize: '48px' }}>🚧</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', color: 'var(--text)', fontWeight: 500 }}>Coming Soon</h2>
          <p style={{ fontSize: '14px', maxWidth: '360px', lineHeight: 1.6 }}>
            This view is currently under development. Switch to another role to explore the live prototype.
          </p>
        </div>
      )}
    </Shell>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Dashboard />
    </AppProvider>
  );
}
