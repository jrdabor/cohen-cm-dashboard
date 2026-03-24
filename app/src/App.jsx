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
