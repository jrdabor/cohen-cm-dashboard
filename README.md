# Cohen Immigration Law — Case Manager Dashboard

A high-fidelity, interactive prototype of a queue-driven workspace designed for immigration Case Managers processing Citizenship by Descent applications. 

This dashboard is built to optimize high-throughput case processing by providing a "cockpit" experience—surfacing the most critical information instantly, minimizing clicks, and supporting smooth delegation to attorneys when complex historical citizenship laws are involved.

## Overview

The Cohen CM Dashboard is a bespoke internal tool prototype that handles the end-to-end lifecycle of an immigration file. It focuses on a **"Tri-Speed" review model**:
1. **Speed 1 (Clean Files):** AI-validated files with no system flags. Handled with 1-click approvals via an inline quick-action layout.
2. **Speed 2 (Minor Flags):** Files requiring manual validation of specific documents (e.g., matching a name variation or checking an ID translation). Utilizes the Golden Checklist.
3. **Speed 3 (Complex Cases):** Files requiring historical analysis or deep legal interpretation (e.g., pre-1947 British Subject provisions). Handled seamlessly via attorney escalation.

## Key Features

- **Kinetic Queue:** A dynamically sorted workspace that prioritizes actionable files (re-submissions, follow-ups) over dormant ones. Priority is visualized with saturated color bars (Green = active, Amber = blocked/hold, Blue = external dependency).
- **The Golden Checklist:** A comprehensive file validation system mapped to IRCC (Immigration, Refugees and Citizenship Canada) requirements. Generates automated passes while surfacing specific flags for human review.
- **Deep Review Panel:** Contextual split-pane viewer for examining application data alongside source documents side-by-side, augmented by AI briefs.
- **Cross-Panel Highlighting:** Interactive action items that temporarily highlight the referenced document in the adjacent panel for rapid visual discovery.
- **Role-Based Workflows:**
  - **Case Manager (Victoria):** Primary queue management and file processing.
  - **Supervisor (Tereza):** "Team" view for managing caseload distribution, identifying bottlenecks, and monitoring volume metrics.
  - **Attorney (Olivia):** "Escalation" view for reviewing complex files, appending legal context, and returning them to the CM.

## Tech Stack

- **Framework:** React + Vite (JSX)
- **Styling:** Vanilla CSS with custom properties (CSS variables) for strict design token management and semantic theming.
- **Icons:** `lucide-react`
- **State Management:** Centralized `AppContext` (`useReducer` + Context API) simulating a persistent datastore via `localStorage`.
- **Data:** 100% static JSON payload (`mockData.js`). No external backend, API, or database is required to run this prototype.

## Running Locally

To run the application locally:

1. Navigate to the `app/` directory:
   ```bash
   cd app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173/` (or the port specified by Vite) in your browser.

## Using the Prototype Demo

The prototype is pre-loaded with a controlled dataset representing 18 clients in various lifecycle states.

- **Demo Reset:** Use the "Reset Demo" button in the top right header to flush `localStorage` and revert all file states back to their original mock configuration.
- **Role Switcher:** Use the dropdown menu in the top right (next to the user profile) to toggle between the Case Manager, Supervisor, and Attorney roles to view role-specific flows.
- **Visual Polish:** The UI uses *Fraunces* for editorial-grade display typography and *DM Sans/Inter* (or system sans-serif) for high-density data tables.

## Repository Structure

- `/app/src/components/`: Modular, feature-based React components (Queue, FileReview, Shell, CockpitStrip).
- `/app/src/styles/`: Global CSS tokens (`tokens.css`), base styles (`global.css`), and animations (`animations.css`).
- `/app/src/context/`: Core business logic, reducer actions, and state persistence.
- `/app/src/data/`: `mockData.js`—the single source of truth for the prototype's domain model.
- `cm-dashboard-prd-v3-var2b.md`: The original Product Requirements Document outlining the specs.
