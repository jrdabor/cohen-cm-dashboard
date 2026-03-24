import { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { CLIENTS, VICTORIA_QUEUE_ORDER, COCKPIT_DEFAULTS, ATTORNEY_ESCALATIONS_DEFAULT, STAFF } from '../data/mockData.js';

const AppContext = createContext(null);

const STORAGE_KEY = 'cohen-cm-dashboard-state';

function getInitialState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) { /* ignore */ }
  return buildFreshState();
}

function buildFreshState() {
  return {
    currentRole: 'victoria',
    currentView: 'queue',        // queue | caseload | team | escalations | fileReview
    selectedFileId: null,
    previousView: null,
    clients: structuredClone(CLIENTS),
    victoriaQueue: [...VICTORIA_QUEUE_ORDER],
    cockpit: structuredClone(COCKPIT_DEFAULTS),
    attorneyEscalations: structuredClone(ATTORNEY_ESCALATIONS_DEFAULT),
    queueFilter: 'all',
    caseloadFilter: 'all',
    caseloadSearch: '',
    exitingRowId: null,
    counterPulse: false,
    stagedFlags: [],
    fileReviewTransition: null, // 'entering' | 'exiting' | null
  };
}

function reducer(state, action) {
  switch (action.type) {
    case 'SET_ROLE':
      return { ...state, currentRole: action.role, currentView: action.role === 'olivia' ? 'escalations' : 'queue', selectedFileId: null };
    
    case 'SET_VIEW':
      return { ...state, currentView: action.view, selectedFileId: null };
    
    case 'OPEN_FILE': {
      return {
        ...state,
        previousView: state.currentView,
        currentView: 'fileReview',
        selectedFileId: action.fileId,
        fileReviewTransition: 'entering',
      };
    }
    
    case 'CLOSE_FILE':
      return {
        ...state,
        currentView: state.previousView || 'queue',
        selectedFileId: null,
        previousView: null,
        fileReviewTransition: null,
        stagedFlags: [],
      };
    
    case 'FILE_TRANSITION_DONE':
      return { ...state, fileReviewTransition: null };
    
    case 'SET_QUEUE_FILTER':
      return { ...state, queueFilter: action.filter };
    
    case 'SET_CASELOAD_FILTER':
      return { ...state, caseloadFilter: action.filter };
    
    case 'SET_CASELOAD_SEARCH':
      return { ...state, caseloadSearch: action.search };
    
    case 'START_ROW_EXIT':
      return { ...state, exitingRowId: action.fileId };
    
    case 'COMPLETE_ROW_EXIT': {
      const newQueue = state.victoriaQueue.filter(id => id !== action.fileId);
      const newCockpit = { ...state.cockpit };
      const role = state.currentRole === 'tereza' ? 'victoria' : state.currentRole;
      if (newCockpit[role]) {
        newCockpit[role] = { ...newCockpit[role], reviewedToday: newCockpit[role].reviewedToday + 1 };
      }
      return { ...state, victoriaQueue: newQueue, cockpit: newCockpit, exitingRowId: null, counterPulse: true };
    }
    
    case 'COUNTER_PULSE_DONE':
      return { ...state, counterPulse: false };
    
    case 'APPROVE_FILE': {
      const clients = state.clients.map(c =>
        c.id === action.fileId ? { ...c, state: 'approved' } : c
      );
      return { ...state, clients };
    }
    
    case 'ESCALATE_TO_ATTORNEY': {
      const clients = state.clients.map(c =>
        c.id === action.fileId ? { ...c, awaitingAttorney: true } : c
      );
      const esc = [...state.attorneyEscalations];
      const existing = esc.findIndex(e => e.clientId === action.fileId);
      if (existing >= 0) {
        esc[existing] = { ...esc[existing], cmNote: action.note };
      } else {
        const client = state.clients.find(c => c.id === action.fileId);
        esc.push({
          clientId: action.fileId,
          sourceCm: state.currentRole,
          severityBadge: action.badge || 'Escalation',
          badgeColor: action.badgeColor || 'amber',
          reason: action.reason || '',
          escalatedDate: new Date().toISOString().split('T')[0],
          cmNote: action.note,
        });
      }
      return { ...state, clients, attorneyEscalations: esc };
    }
    
    case 'RETURN_TO_CM': {
      const clients = state.clients.map(c =>
        c.id === action.fileId ? { ...c, awaitingAttorney: false, attorneyReturned: true, attorneyDetermination: action.determination } : c
      );
      const esc = state.attorneyEscalations.filter(e => e.clientId !== action.fileId);
      const queue = [...state.victoriaQueue];
      if (!queue.includes(action.fileId)) queue.push(action.fileId);
      return { ...state, clients, attorneyEscalations: esc, victoriaQueue: queue };
    }
    
    case 'SEND_FLAGS': {
      const clients = state.clients.map(c =>
        c.id === action.fileId ? { ...c, state: 'changes_requested' } : c
      );
      return { ...state, clients, stagedFlags: [] };
    }
    
    case 'STAGE_FLAG':
      return { ...state, stagedFlags: [...state.stagedFlags, action.flag] };
    
    case 'REMOVE_STAGED_FLAG':
      return { ...state, stagedFlags: state.stagedFlags.filter((_, i) => i !== action.index) };
    
    case 'CONFIRM_RESOLVED_FLAG': {
      const clients = state.clients.map(c => {
        if (c.id !== action.fileId) return c;
        const prevFlags = (c.previousFlags || []).map(f =>
          f.id === action.flagId ? { ...f, confirmed: true } : f
        );
        return { ...c, previousFlags: prevFlags };
      });
      return { ...state, clients };
    }
    
    case 'ADD_COMM': {
      const clients = state.clients.map(c => {
        if (c.id !== action.fileId) return c;
        return { ...c, comms: [...(c.comms || []), action.comm] };
      });
      return { ...state, clients };
    }
    
    case 'SEND_QUICK_ACTION': {
      return { ...state, exitingRowId: action.fileId };
    }
    
    case 'RESET_DEMO':
      localStorage.removeItem(STORAGE_KEY);
      return buildFreshState();
    
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, getInitialState);

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) { /* ignore */ }
  }, [state]);

  const getClient = useCallback((id) => state.clients.find(c => c.id === id), [state.clients]);
  
  const getCurrentUser = useCallback(() => STAFF[state.currentRole], [state.currentRole]);

  const getQueueItems = useCallback(() => {
    return state.victoriaQueue
      .map(id => state.clients.find(c => c.id === id))
      .filter(Boolean);
  }, [state.victoriaQueue, state.clients]);

  const getCaseload = useCallback((cmId) => {
    const targetCm = cmId || (state.currentRole === 'tereza' ? 'victoria' : state.currentRole);
    return state.clients.filter(c => c.assignedCm === targetCm);
  }, [state.clients, state.currentRole]);

  return (
    <AppContext.Provider value={{ state, dispatch, getClient, getCurrentUser, getQueueItems, getCaseload }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export default AppContext;
