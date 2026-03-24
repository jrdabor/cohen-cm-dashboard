# Cohen Immigration Law — Case Manager Dashboard PRD v2

**Version:** 2.0
**Date:** March 24, 2026
**Status:** Ready for Build

---

## Table of Contents

1. Domain Context
2. Product Overview
3. Design Principles & Success Metrics
4. Roles & Permissions
5. Creative Direction
6. Navigation Architecture
7. File Lifecycle & State Machine
8. Cockpit Strip
9. Queue (Mode 1)
10. Caseload (Mode 2)
11. File Review (Mode 3) — Three-Speed Model
12. Flagging & Communication Flows
13. Supervisor — Team View
14. Attorney — Escalations View
15. Golden Checklist
16. CIT-0001 Field Structure
17. IMM 5476 Field Structure
18. AI Brief Patterns
19. Key Demo Flows
20. Acceptance Criteria

Mock data is provided in a separate companion document: `cm-dashboard-mock-data-v2.md`

---

## 1. Domain Context

### What Cohen Immigration Law Does

Cohen Immigration Law is a Canadian immigration law firm based in Montreal, Quebec. Their fastest-growing practice area is **Citizenship by Descent (CBD)** — helping people born outside Canada prove they are already Canadian citizens through their family line.

### What Is Citizenship by Descent?

A person born outside Canada to a Canadian citizen parent (or grandparent) may already be a Canadian citizen **by birth**. They don't need to *apply* to become a citizen — they need to apply for **proof** of a citizenship they already hold. The proof comes in the form of a **citizenship certificate**, issued by the Canadian government agency IRCC (Immigration, Refugees and Citizenship Canada).

### Bill C-3 (December 15, 2025)

A new Canadian law called Bill C-3 came into force on December 15, 2025. It retroactively eliminated the previous "first-generation limit" on citizenship by descent. Before this law, if your Canadian parent was themselves born outside Canada, you could not claim citizenship. Now you can — as long as there is an unbroken chain of descent from a Canadian ancestor ("anchor ancestor") who was born or naturalized in Canada.

This created a surge of applications, primarily from Americans discovering they are already Canadian through a parent, grandparent, or even great-grandparent.

### The Two Government Forms

Every citizenship by descent application requires two government forms, submitted on paper:

1. **CIT-0001** — "Application for Citizenship Certificate for Adults and Minors (Proof of Citizenship)." 14-page main application form collecting the applicant's personal details, parent information, grandparent information (if applicable), and historical citizenship questions.

2. **IMM 5476** — "Use of a Representative." Authorizes Cohen Immigration Law to act on the client's behalf with the government.

### The Application Lifecycle

1. Client signs up and pays Cohen ($1,500 USD per applicant)
2. Client completes a guided intake questionnaire
3. Client uploads supporting documents (birth certificates, IDs, marriage certificates, etc.)
4. Client reviews a pre-filled application
5. **Case Manager reviews the file** — this is what the dashboard is for
6. Client prints, signs, and mails the physical forms to Cohen's office
7. Cohen submits to IRCC on the client's behalf
8. IRCC processes (~9–11 months) and issues the citizenship certificate

### Key Domain Concepts

- **Chain of descent:** The family tree from the applicant back to the "anchor ancestor" (person born or naturalized in Canada). Every link must be documented.
- **Anchor ancestor:** The person born in Canada, naturalized in Canada, or became a citizen when the first Canadian Citizenship Act took effect (January 1, 1947; April 1, 1949 for Newfoundland).
- **First generation born abroad:** Person born outside Canada to a Canadian parent born *in* Canada. Straightforward case.
- **Second+ generation born abroad:** Person born outside Canada whose Canadian parent was *also* born outside Canada. Made possible by Bill C-3.
- **Registration number vs. certificate number:** Canadian birth certificates display two numbers. CIT-0001 requires the *registration* number, not the certificate number. A common source of errors.
- **Quebec pre-1994 rule:** IRCC does not accept Quebec birth or marriage certificates issued before January 1, 1994. Replacements must be obtained.
- **90-day signature rule:** The signed application must be received by IRCC within 90 days of the signature date.
- **AOR (Acknowledgement of Receipt):** Confirmation from IRCC that they received the application.

### Historical Edge Cases

- **Pre-1977 gender/wedlock discrimination:** Before 1977, only fathers (in wedlock) or mothers (out of wedlock) could transmit citizenship. Bill C-3 retroactively restores gender-neutral transmission.
- **Pre-1947 British subject:** Ancestors born in Canada before 1947 were British subjects, not Canadian citizens. Transitional provisions apply. Always requires attorney analysis.
- **Section 8 Lost Canadian:** Persons born abroad 1977–1981 who lost citizenship at age 28. Restored by Bill C-3.
- **Adoption:** Adopted persons cannot use CIT-0001 for initial applications — requires a different process (Section 5.1 direct grant).
- **Deceased ancestor:** Does not break the chain (Section 3(1.5)), but documentation chain must be complete.

### The Client Portal (Context Only)

Cohen is separately building a client-facing portal where clients complete intake, upload documents, and track their application. The portal does extensive automated processing before a file reaches the CM:

**Document level:** Quality validation, type classification, data extraction, ID validation (two types, name + DOB, photo, not expired), authenticity markers, language detection, Quebec pre-1994 detection.

**Cross-document level:** Name cross-validation with auto-resolution via name change/marriage docs, DOB consistency, parent name matching, registration vs. certificate number distinction, chain linkage verification.

**Form level:** CIT-0001 and IMM 5476 auto-filled from structured data, conditional sections resolved from DOB, all fields explicitly answered.

**Edge case level:** Gender/wedlock, Section 8, deceased ancestor auto-analyzed. Clean cases auto-resolved. Complex cases flagged with escalation reasons.

By the time a file reaches the CM, the system has verified ~34 of ~44 checklist items. The CM provides judgment on the remaining ~10.

---

## 2. Product Overview

### What We're Building

A **Case Manager Dashboard** — a standalone web application serving as the primary workspace for Cohen's Case Managers, supervisors, and attorneys to review, manage, and process citizenship by descent files.

### What It Replaces

An email-based process where CMs receive documents via email, review manually, communicate via email, and track in spreadsheets. The main problem: heavy context-switching. CMs must re-read entire email histories when returning to a file.

### Prototype Constraints

- **Standalone project.** No shared codebase with the client portal. Start from scratch.
- **Static mock data.** No backend, no database, no API. All data hardcoded. Mock data provided in a companion document.
- **Functional prototype** for stakeholder demos and early user testing with real Case Managers.
- **Desktop-only.** Optimized for 1280px+ viewports (1440px–1920px target).

---

## 3. Design Principles & Success Metrics

### Design Principles

1. **Design for the 60% case first.** 60% of files are clean — no flags, no edge cases, approve and move on. The clean file experience should be a 30-second confirmation, not a 3-minute workbench session. Complexity layers on progressively.

2. **The queue is the product.** The CM opens the dashboard and the queue tells them exactly what to do next. Processing the queue should feel like a rhythm — item appears, CM acts, item slides away, next item is ready.

3. **AI Brief kills context-switching.** Every file opens with a 3–5 sentence summary that gives the CM full context in 10 seconds. The CM never needs to re-read histories or dig through documents to understand what a file needs.

4. **Communication is templates, not composition.** Flag instructions, notifications, and follow-ups are pre-drafted. The CM adds judgment, not prose.

5. **Same palette as the client portal, different energy.** The client portal feels like a concierge service. The dashboard feels like a professional instrument — precise, dense, purposeful. Same forest green and warm cream, applied with more restraint and structure.

### Success Metrics

| Metric | Target |
|---|---|
| Clean file review time | ≤ 60 seconds |
| Flagged file review time | ≤ 5 minutes |
| Re-review time | ≤ 2 minutes |
| Context switch cost | ≤ 10 seconds |
| Daily throughput | 20–30 files/day |

---

## 4. Roles & Permissions

### Case Manager (CM)

Primary user. Manages ~100+ files. Spends ~80% of active time on primary review and re-review.

| Capability | Access |
|---|---|
| View own queue and caseload | ✅ |
| Review files (full read/write) | Own files only |
| Approve files | ✅ |
| Create and send client flags | ✅ |
| Direct-edit form fields | ✅ |
| Upload/replace documents | ✅ |
| Message clients | ✅ |
| Add internal notes | ✅ |
| Escalate to attorney | ✅ |
| View other CMs' files | Read-only, on demand |
| Reassign files | ❌ |

### Supervisor

A CM who also has management oversight. Has their own caseload plus team visibility.

| Capability | Access |
|---|---|
| Everything a CM can do | ✅ |
| View "Team" dashboard | ✅ |
| See all CMs' queues and caseloads | Read-only |
| Reassign files between CMs | ✅ |
| View per-CM performance metrics | ✅ |

### Attorney

Handles legal escalations. Does not manage ongoing files.

| Capability | Access |
|---|---|
| View escalation queue | ✅ |
| Review escalated files (full read) | ✅ |
| Add internal notes | ✅ |
| Return file to CM with determination | ✅ |
| Request more information from CM | ✅ |
| Message client directly (rare) | ✅ |
| Approve or flag clients directly | ❌ |

---

## 5. Creative Direction

### Read This First

Before writing any code, read the `frontend-design` skill file at `/mnt/skills/public/frontend-design/SKILL.md`. It contains critical guidance on creating distinctive, production-grade interfaces that avoid generic AI aesthetics. The principles in that skill should inform every visual decision you make.

### The Aesthetic: "Editorial Utility"

This dashboard sits at the intersection of two aesthetics: the **editorial precision** of a premium financial terminal and the **warm materiality** of a well-designed law office. It is not a startup SaaS tool. It is not a consumer app. It is a bespoke instrument built for professionals who use it 8 hours a day.

**The one thing someone should remember:** "It felt like the back office of a place that has a beautiful front office."

### Tone

Refined minimalism with controlled density. Every element earns its pixels. No decorative padding, no gratuitous whitespace, no generic card-stack layouts. But also not brutalist — there's warmth in the typography, materiality in the surfaces, and subtlety in the depth layers.

### Color Palette

The palette comes from the client-facing portal but is applied with more restraint. Forest green is the dominant accent — used for primary actions, active states, and the most important interactive elements. The warm cream background creates surface texture. Red and amber are reserved for signal states only.

```
Core:
  bg:           #F6F5F0       Warm cream — primary background
  bgDeep:       #EDECEA       Slightly deeper — left panel in File Review, cockpit strip
  card:         #FFFFFF       Card and right panel background
  border:       #E0DED8       Borders and dividers
  borderLight:  #EEEDE8       Subtle dividers within cards

Accent:
  accent:       #1B3A2D       Forest green — primary actions, active states
  accentMid:    #2D5F45       Hover states
  accentLight:  #3A7D5C       Secondary accents
  accentPale:   #E2F0E8       Success backgrounds, selected states

Signal:
  success:      #1A7D46       Verified, approved, complete
  successBg:    #E6F5ED       Success tint
  warn:         #B45309       Amber — flags, attention needed
  warnBg:       #FEF7E6       Warning tint
  error:        #C41E3A       Red — overdue, errors, eligibility blocks
  errorBg:      #FDE8EC       Error tint
  blue:         #1E56A0       Post-submission informational states
  blueBg:       #E8F0FA       Info tint

Text:
  text:         #1C1C1A       Primary text
  textSec:      #5C5C56       Secondary text
  textMut:      #9C9C94       Muted (timestamps, metadata, labels)
```

### Typography

Choose fonts with intention. Do not use Inter, Roboto, Arial, or system-ui. The body font must be highly legible at 13–14px in dense data contexts (checklists, extracted fields, table rows). The display font should feel authoritative and warm — it appears on page titles, the AI Brief text, and the "Team Overview" heading.

**Suggestions (not requirements):** Fraunces or Newsreader for display. DM Sans or Source Sans 3 for body. But if you find something better that serves the "editorial utility" aesthetic, use it. Commit fully to your choice.

| Context | Size | Weight |
|---|---|---|
| Page titles | 28–32px | Display font |
| AI Brief text | 15–16px | Body font, regular |
| Section headers (left panel) | 11–12px | Body font, uppercase, 0.08em letter-spacing |
| Body text | 14px | Body font, regular |
| Small text / metadata | 12–13px | Body font, regular, `textMut` color |
| Monospace (registration numbers, IDs) | 13px | System monospace |

### Depth & Surface

The dashboard uses depth layering to create visual hierarchy:

**Layer 0 (deepest):** The background (`bg: #F6F5F0`). Visible in the queue view and around content areas.

**Layer 1:** The cockpit strip (`bgDeep: #EDECEA`). Sits slightly above the background with a bottom border. Feels like an instrument panel.

**Layer 2:** The queue rows and caseload table. White cards or rows on the cream background.

**Layer 3 (File Review):** The left panel (`bgDeep: #EDECEA`) and right panel (`card: #FFFFFF`) sit side by side with a crisp `1px solid #E0DED8` border and soft `box-shadow: 2px 0 8px rgba(0,0,0,0.04)` between them. The left panel is the "decision surface" (warmer, deeper). The right panel is the "evidence surface" (clean, bright).

**Layer 4:** Modals and overlays float above everything with backdrop blur.

Do not flatten these layers. The visual difference between left and right panels in File Review should be immediately obvious — a CM's eyes should instantly parse "my decisions live left, my evidence lives right" without conscious effort.

### Motion

Motion is used for **feedback and flow**, not decoration. Every animation should make the dashboard feel faster, not slower.

| Moment | Treatment |
|---|---|
| Queue → File Review transition | Slide-in from right (translateX(20px) → 0), 250ms |
| File Review → Queue (back) | Reverse: slide-out, queue fades in |
| Queue row exit (after approval/action) | Row fades + slides left over 250ms, remaining rows slide up over 200ms |
| Clean file approval | Button transforms to "Confirmed ✓" with green pulse, then auto-navigates back after 800ms |
| Cockpit counter increment | Number scales up 1.0→1.15→1.0 with accent color flash, 300ms |
| Right panel expand/collapse | Smooth width transition, 300ms ease |
| Document card expand/collapse | Height transition, 200ms |
| Hover on queue rows | Subtle background tint, no shadow lift |

Do not add: loading spinners (mock data is instant), parallax, scroll-jacking, gratuitous hover effects, or blocking animations.

### Icons

Use a consistent stroke-based icon library (Lucide recommended). 18–20px default. `textSec` color unless active. No emojis in the UI.

---

## 6. Navigation Architecture

### Shell

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                                                          │
│  [Cohen Logo + "Case Manager Dashboard"]  [Reset Demo] [Role] [User ▾] │
├──────────────────────────────────────────────────────────────────┤
│  NAV TABS (role-adaptive)                                        │
│  CM:         [My Queue]  [My Caseload]                           │
│  Supervisor: [My Queue]  [My Caseload]  [Team]                   │
│  Attorney:   [My Escalations]                                    │
├──────────────────────────────────────────────────────────────────┤
│  COCKPIT STRIP                                                   │
├──────────────────────────────────────────────────────────────────┤
│  MAIN CONTENT (Queue, Caseload, Team, or File Review)            │
└──────────────────────────────────────────────────────────────────┘
```

### Role Switcher

Dropdown in the header. Switches between:
- Victoria Rukaite (Case Manager)
- Tereza Monkova (Supervisor)
- Olivia Cohen (Attorney)

Switching immediately adapts tabs, cockpit, and content. No login screen.

### Reset Demo

Button in the header. Restores all data to initial state. For repeated demos.

### File Review Takeover

When a file is opened, the nav tabs and cockpit strip are replaced by a file-specific header bar. Back button returns to the previous view, preserving filters and scroll position.

---

## 7. File Lifecycle & State Machine

### States

Every file exists in exactly one primary state.

#### Pre-Submission

| State | CM Label | In Queue? | Description |
|---|---|---|---|
| `intake_in_progress` | Intake in Progress | ❌ | Client working through intake |
| `eligibility_hold` | Eligibility Hold | ✅ | Intake flagged eligibility concern |
| `awaiting_documents` | Awaiting Documents | ❌ | Client uploading documents |
| `submitted_for_review` | Ready for Review | ✅ | Client submitted, automated checks complete |
| `in_review` | In Review | ❌ | CM actively reviewing |
| `changes_requested` | Changes Requested | ❌ | CM sent flags, waiting for client |
| `client_resubmitted` | Re-submitted | ✅ | Client resolved flags, resubmitted |
| `approved` | Approved | ❌ | CM approved, client can sign |
| `awaiting_signature` | Awaiting Signed Forms | ❌ | Client printing/signing/mailing |

#### Submission

| State | CM Label | In Queue? | Description |
|---|---|---|---|
| `forms_in_transit` | Forms In Transit | ❌ | Client confirmed mailing |
| `forms_received` | Signed Forms Received | ✅ | Admin logged receipt |
| `submitted_to_ircc` | Submitted to IRCC | ❌ | Package mailed to government |

#### Post-Submission

| State | CM Label | In Queue? | Description |
|---|---|---|---|
| `awaiting_aor` | Awaiting AOR | ❌* | Waiting for IRCC acknowledgement |
| `aor_received` | AOR Received | ✅ | Admin logged AOR |
| `government_processing` | Government Processing | ❌ | IRCC processing (passive) |
| `government_questions` | Government Questions | ✅ | IRCC raised questions |
| `application_approved_gov` | Approved by Government | ✅ | IRCC approved |
| `closed` | Closed | ❌ | Complete |

*`awaiting_aor` enters queue if overdue (4+ weeks)

#### Overlay Sub-States

| Sub-State | Description |
|---|---|
| `awaiting_attorney` | Escalated to attorney, awaiting determination |
| `attorney_returned` | Attorney returned file with determination — re-enters CM queue |
| `dormant_14` through `dormant_90` | File inactive 14/30/60/90+ days |
| `dcca_pending/submitted/received` | Quebec replacement process (parallel) |

### State Transitions

```
intake_in_progress → eligibility_hold | awaiting_documents
eligibility_hold → awaiting_documents | closed
awaiting_documents → submitted_for_review
submitted_for_review → in_review
in_review → changes_requested | approved | submitted_for_review (auto-release)
changes_requested → client_resubmitted
client_resubmitted → in_review
approved → awaiting_signature
awaiting_signature → forms_in_transit
forms_in_transit → forms_received
forms_received → submitted_to_ircc
submitted_to_ircc → awaiting_aor
awaiting_aor → aor_received
aor_received → government_processing
government_processing → government_questions | application_approved_gov
government_questions → government_processing | application_approved_gov
application_approved_gov → closed
```

### Status Pill Color Mapping

| State | Color | Style |
|---|---|---|
| `intake_in_progress` | Gray | Filled |
| `eligibility_hold` | Red | Filled |
| `awaiting_documents` | Gray | Filled |
| `submitted_for_review` | Accent green | Filled |
| `in_review` | Accent green | Filled |
| `changes_requested` | Amber | Filled |
| `client_resubmitted` | Accent green | Filled |
| `approved` | Success green | Filled |
| `awaiting_signature` | Gray | Filled |
| `forms_in_transit` | Gray | Filled |
| `forms_received` | Blue | Filled |
| `submitted_to_ircc` | Blue | Filled |
| `awaiting_aor` | Gray | Filled |
| `aor_received` | Blue | Filled |
| `government_processing` | Gray | Filled |
| `government_questions` | Red | Outlined (red text + red border, white bg) |
| `application_approved_gov` | Success green | Filled |
| `closed` | Gray muted | Filled |

Note: `eligibility_hold` uses filled red, `government_questions` uses outlined red — both signal "attention" but are visually distinguishable.

---

## 8. Cockpit Strip

Thin horizontal bar below nav tabs. Visible on Queue and Caseload views. Hidden in File Review.

```
┌──────────────────────────────────────────────────────────────────────┐
│  [◐ 7 reviewed · 🔥 4-day streak]  [3 review · 1 re-sub · 1 hold · 4 post-sub]  [⚠ 1 overdue · 1 follow-up due] │
│        Cluster 1: My Day                Cluster 2: Needs Me                   Cluster 3: Watch          │
└──────────────────────────────────────────────────────────────────────┘
```

**Visual treatment:** Background `bgDeep`, `border-bottom: 1px solid var(--border)`. Feels like a distinct instrument panel.

### Cluster 1: "My Day" (left)

| Element | Spec |
|---|---|
| Progress ring | 42px diameter, 3px stroke. Filled portion = `accent`, unfilled = light gray. Full circle at daily target (20). |
| Files actioned | Count of terminal actions taken today |
| Streak | "X-day streak" — consecutive business days hitting target |
| Streak icon | Styled SVG flame in `warn` color (not emoji) |
| Counter animation | On increment: scale 1→1.15→1, accent color flash, 300ms |

### Cluster 2: "Needs Me" (center)

| Element | Spec |
|---|---|
| Badges | "[N] review · [N] re-sub · [N] hold · [N] post-sub" |
| Interaction | Each badge is clickable — filters the queue to that type |
| Zero state | Types with 0 are hidden. All clear: "All clear ✓" |

### Cluster 3: "Watch" (right)

| Element | Spec |
|---|---|
| Overdue | "⚠ [N] overdue" — red text, clickable |
| With attorney | "[N] with attorney" — informational |
| Follow-ups | "[N] follow-up due" — clickable |
| Quiet state | Nothing shown if no alerts |

---

## 9. Queue (Mode 1)

The CM's primary workspace. A prioritized list of files needing action. Only actionable files appear — passive/waiting files live in Caseload.

### Queue Row

```
┌─────────────────────────────────────────────────────────────────┐
│▌ [Family·3]  Client Name          AI summary text         [2h] │
└─────────────────────────────────────────────────────────────────┘
```

| Element | Spec |
|---|---|
| Priority bar | 5px wide, left edge, full height. Red = SLA breach. Amber = high priority. Green = standard. Blue = informational. |
| Family badge | "Family · N" if family file. Nothing for single. |
| Client name | Bold. Primary applicant or "[Last Name] Family." |
| AI summary | One sentence, imperative. `textSec` color. |
| Time badge | Right-aligned. Time since entering queue state. Amber at SLA warning, red at breach. |
| Quick action | For `aor_received`, `application_approved_gov`, and dormant follow-ups: a small action button ("Notify →" or "Send →") appears on hover. Clicking sends the pre-drafted message directly without opening File Review. Row then exits. |

**Density:** Rows should be tight — single visual line if possible, or two tight lines at most. No individual card borders or shadows. Rows separated by `1px solid var(--borderLight)` bottom borders. Hover: subtle `bgDeep` background tint.

### Priority Scoring

| Factor | Score |
|---|---|
| SLA breach | +100 |
| SLA warning (within 4h) | +50 |
| Re-submitted (`client_resubmitted`) | +30 |
| Attorney returned (`attorney_returned`) | +25 |
| Eligibility hold | +20 |
| Ready for review | +15 |
| Government questions | +15 |
| Forms received | +10 |
| AOR received | +5 |
| Government approved | +5 |
| Dormant nudge due | +3 |
| Time waiting | +1/hour |

### SLA Targets

| Action | Target |
|---|---|
| Primary review | 2 business days |
| Re-review | 1 business day |
| Client message response | 1 business day |
| Eligibility hold first action | 1 business day |
| AOR notification | Same business day |
| Government approval notification | Same business day |

### Filter Pills

All Actionable (default) · Ready for Review · Re-submitted · Eligibility Holds · Post-Submission · Overdue · Follow-ups

### Queue Row Exit Animation

When a row is removed (approval, escalation, notification sent), it fades + slides left over 250ms, then remaining rows slide up over 200ms to fill the gap.

### Batch Actions

When the queue is filtered to "Follow-ups" and shows multiple dormant files: display a "Send All Follow-ups" button above the queue that dispatches all pre-drafted nudge messages at once, then removes all those rows with staggered exit animations.

---

## 10. Caseload (Mode 2)

Full portfolio view. Every file assigned to this CM, in every state.

### Portfolio Summary (above the table)

A horizontal bar at the top showing file distribution by lifecycle phase:

```
┌─────────────────────────────────────────────────────────────────┐
│  [Pre-Sub ██████░░ 5]  [Active ████ 3]  [Post-Sub ████████ 5]  [Dormant █ 1]  [Complete █ 1]  │
└─────────────────────────────────────────────────────────────────┘
```

Each segment is color-coded. The CM glances at this and immediately sees portfolio health: "most of my files are in post-submission, 1 dormant, nothing alarming." Clicking a segment filters the table below.

### Table

| Column | Sortable? | Width |
|---|---|---|
| Client (+ family badge) | Yes (alpha) | 18% |
| Status (color pill) | Yes (by state) | 14% |
| Opened (date) | Yes | 10% |
| Last Activity (description + date) | Yes (by date) | 22% |
| Days in Stage | Yes (numeric) | 10% |
| Next Expected | No | 26% |

**Days in Stage:** Computed from state entry timestamp. Normal text <14 days. `warn` color 14–29 days. `error` color 30+ days.

**Filter pills:** All Files · Pre-Submission · Active (in review states) · Post-Submission · Dormant · Complete — with counts.

**Search:** Free-text across client names.

**Row click:** Opens File Review.

---

## 11. File Review (Mode 3) — Three-Speed Model

File Review adapts its layout based on complexity. Three tiers:

### Speed 1: Glance (Clean Files — 60% of cases)

**Trigger:** Zero action items AND all system checks passed.

**Layout:** Left panel expands to ~70% width. Right panel renders as a **narrow summary sidebar at ~30%** showing a compact vertical list of document titles with small status badges (green checks). No thumbnails, no extracted data, no tabs.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Queue    Client Name                  [Status Pill]   │
├───────────────────────────────────────────┬──────────────────────┤
│                                           │                      │
│  ┌─ AI Brief ──────────────────────────┐  │  DOCUMENTS           │
│  │  3-5 sentences, 15-16px             │  │  ✓ Birth certificate │
│  └─────────────────────────────────────┘  │  ✓ Driver's license  │
│                                           │  ✓ US Passport       │
│  ┌─ Action Items ──────────────────────┐  │  ✓ Mother's BC       │
│  │  ✓ All checks passed.              │  │  ✓ Marriage cert     │
│  └─────────────────────────────────────┘  │                      │
│                                           │  [Expand →]          │
│  ┌─ Checklist ─────────────────────────┐  │                      │
│  │  ▶ GOLDEN CHECKLIST  30/30 PASSED   │  │                      │
│  └─────────────────────────────────────┘  │                      │
│                                           │                      │
│  ┌─ File Info ─────────────────────────┐  │                      │
│  │  CM, dates, chain                   │  │                      │
│  └─────────────────────────────────────┘  │                      │
│                                           │                      │
│  [Flag Client]          [Approve ✓]       │                      │
│                                           │                      │
├───────────────────────────────────────────┴──────────────────────┤
```

**Clicking "Expand →"** (or clicking any document title) transitions smoothly to the full two-panel layout (Speed 2/3 view) with the right panel at 55%.

**Approval:** Single click. No confirmation modal. Button transforms to "Confirmed ✓" with green pulse animation. After 800ms, auto-navigates back to queue. Queue row exit animation plays.

**Primary actions float below content** — the action bar sits directly below File Info with `24px` gap, not pinned to the panel bottom. For clean files with minimal content, the Approve button is right below the brief.

### Speed 2: Scan (Flagged Files — 30% of cases)

**Trigger:** File has 1-3 action items but no attorney escalation required.

**Layout:** Full two-panel layout. Left at 45%, right at 55%.

```
┌──────────────────────────────────────────────────────────────────┐
│  ← Back to Queue    Client Name                  [Status Pill]   │
├──────────────────────────────┬───────────────────────────────────┤
│     LEFT (45%)               │       RIGHT (55%)                 │
│                              │                                   │
│  ┌─ AI Brief ─────────────┐ │  ┌─ Tab Bar ──────────────────┐  │
│  └─────────────────────────┘ │  │ Documents │ Forms │ Comms   │  │
│                              │  └─────────────────────────────┘  │
│  ┌─ Action Items ──────────┐ │                                   │
│  │  [flags with actions]   │ │  [Tab content — scrollable]       │
│  └─────────────────────────┘ │                                   │
│                              │                                   │
│  ┌─ Checklist (expanded) ──┐ │                                   │
│  └─────────────────────────┘ │                                   │
│                              │                                   │
│  ┌─ File Info ─────────────┐ │                                   │
│  └─────────────────────────┘ │                                   │
│                              │                                   │
│  [Flag Client]  [Approve ✓]  │                                   │
└──────────────────────────────┴───────────────────────────────────┘
```

**Panels scroll independently.** The CM reads a checklist item on the left while viewing the relevant document on the right.

**Approval requires confirmation modal** (for files that had action items).

### Speed 3: Investigate (Complex Files — 10% of cases)

**Trigger:** Edge cases requiring attorney escalation, eligibility holds, government questions, family files with multiple flags.

**Layout:** Same two-panel layout as Speed 2. Content is richer:
- AI Brief is longer (includes legal context or escalation history)
- Multiple action items, some requiring attorney escalation
- Checklist shows amber items requiring CM judgment
- Right panel has more documents (multi-generation chains)

**Primary actions adapt per state** (see state-specific actions table below).

### Header Bar (All Speeds)

| Element | Spec |
|---|---|
| Back button | "← Back to Queue" or "← Back to Caseload." Preserves filters. |
| Client name | Primary applicant. Families: "[Name] Family" + "N applicants" badge. |
| Status pill | Current state, color-coded per mapping. |

### Left Panel Components

#### AI Brief

**Position:** Top of left panel. Always visible.
**Visual:** 3px left border in `accent` color. Subtle background tint (`#F8F7F3` or similar — slightly lighter than the left panel background). No label — the visual treatment identifies it.
**Content:** 3–5 sentences. 15–16px font size. Patterns detailed in Section 18.

#### Action Items

**Header:** "ACTION ITEMS [N]" in 11–12px uppercase, `textMut` color. Or "ACTION ITEMS" with green check when empty.

**Empty state:** Green-tinted banner: "✓ All system checks passed. No items need your attention."

**Populated:** Vertical list of cards, each with:

```
┌─────────────────────────────────────────────────────────────┐
│  [⚠] Flag Title                                [Applicant] │
│  Description (1-2 sentences, textSec)                       │
│  [Dismiss]  [Escalate to Attorney] or [Convert to Client Flag] │
└─────────────────────────────────────────────────────────────┘
```

**Action item buttons depend on flag type:**
- Flags with `requiresAttorney: true` → "Dismiss" + "Escalate to Attorney"
- Flags with `requiresAttorney: false` → "Dismiss" + "Convert to Client Flag"
- "Direct Edit" only appears on form-field-correctable flags (not document quality issues)

**For re-reviews:** Previous flags shown with "Resolved" badge (green border, dimmed). Each has "Confirm Resolved" + "Re-flag" buttons. After confirming, shows "Confirmed" badge.

#### Golden Checklist

**Header:** "GOLDEN CHECKLIST [N/N] PASSED" in 11–12px uppercase.
**Default state:** Collapsed for clean files. Expanded for files with action items.
**Content:** ~44 items organized into sections (full spec in Section 15). Green check = system-verified. Amber = needs CM judgment.
**Cross-panel interaction:** Clicking a checklist item that references a document should open the right panel (if collapsed), switch to Documents tab, scroll to the referenced document, expand it (if compact), and apply a brief highlight animation (gold border flash, 500ms).

#### File Info

**Header:** "File Information" in 11–12px uppercase.
**Content:**

| Field | Value |
|---|---|
| Assigned CM | Name |
| File opened | Date |
| Submitted for review | Date/time |
| Times reviewed | Count |
| Chain of descent | Compact: "Name → Parent (place) → anchor" |
| Family members | If family: all names |
| Escalation history | If any |

#### Primary Actions

**Position:** Below File Info with `24px` gap. Flows with content (not pinned to panel bottom).

**Default (review states):**

| Left | Right |
|---|---|
| Flag Client (amber outline) | Approve ✓ (green solid) |

**State-specific:**

| State | Left | Right |
|---|---|---|
| `submitted_for_review` / `client_resubmitted` | Flag Client | Approve ✓ |
| `eligibility_hold` | Message Client | Escalate to Attorney |
| `forms_received` | Flag Issue | Confirm — Submit to IRCC |
| `aor_received` | — | Notify Client (full width) |
| `government_questions` | Message Client | Escalate to Attorney |
| `application_approved_gov` | — | Notify & Congratulate (full width) |
| `attorney_returned` | (varies) | (varies) |

**For families:** "Approve Family ✓" — disabled until all per-applicant items resolved.

### Right Panel Components

#### Document Summary Sidebar (Speed 1 — Clean Files)

A narrow (~30% width) panel showing:
- "DOCUMENTS" header in uppercase
- Compact list: each document is a single row with small status icon (✓ green check), document title, and nothing else
- "Expand →" button at bottom to transition to full panel

#### Full Right Panel (Speed 2/3)

**Tab bar:** Documents · Forms · Comms

**Default tab:** Documents for review states. Comms for communication states (`aor_received`, `application_approved_gov`, `eligibility_hold`).

##### Documents Tab

**Family filter (if family):** Pills: "All · [Name1] · [Name2] · ... · Shared"

**Document cards — compact by default:**

```
┌─────────────────────────────────────────────────────────────┐
│  [40px thumb]  Document Title        [✓ Verified]    [▾]    │
└─────────────────────────────────────────────────────────────┘
```

Compact: thumbnail (40px), title, status badge, expand chevron — all on one row.

**Expanded (click to expand, or auto-expanded for flagged/new docs):**

```
┌─────────────────────────────────────────────────────────────┐
│  [60px thumb]  Document Title        [✓ Verified] [New]     │
│                                                             │
│  Full Name:              Iliana Vasquez                      │
│  Date of Birth:          1992-03-15                          │
│  Place of Birth:         Los Angeles, California             │
│  ...                                                        │
│                                                             │
│  [View Full]  [Replace]                                     │
└─────────────────────────────────────────────────────────────┘
```

Documents grouped by person: "ABOUT YOU" → "CANADIAN PARENT" → "NON-CANADIAN PARENT" → "GRANDPARENT" (if applicable).

##### Forms Tab

**Family filter (if family).**

Read-only preview of auto-filled CIT-0001 and IMM 5476 as structured key-value data organized by section. Full field spec in Sections 16–17.

Each field shows: label (`textMut`), value (`text`, bold), and source badge. Source badges:
- "Birth cert" (green pill)
- "Driver's license" / "Passport" (green pill)
- "Marriage cert" (green pill)
- "Intake" (blue pill)
- "Client input" (blue pill)
- "CM edit" (amber pill)
- "Default" (gray pill)

**CM edit:** Clicking any field opens inline edit. Changes logged with CM name + timestamp.

##### Comms Tab

Chronological timeline with two content types:

| Type | Visual |
|---|---|
| Client messages | Default card styling, client name + timestamp |
| Internal notes | Distinct tinted background (`warnBg` or similar), "Internal" badge |

**Compose area:** Text input at bottom with toggle: "Client Message" / "Internal Note."

**Pre-drafted messages:** For certain states, the compose area is pre-populated. See Section 18 for message patterns.

### Family File Behavior

| Element | Family Adaptation |
|---|---|
| AI Brief | Covers family. Per-applicant status lines. |
| Action Items | Flat list with applicant name tags. Not tabbed. |
| Checklist | Includes "Family Consistency" section |
| Documents | Person filter pills. "Shared" for parent/grandparent docs. |
| Forms | Person filter pills. Per-applicant CIT-0001 + IMM 5476. |
| Approve | "Approve Family ✓" — disabled until all items resolved |

---

## 12. Flagging & Communication Flows

### System Flag → CM Decision

```
System detects issue → creates flag with:
  - title, description, severity, relevant document, requiresAttorney

CM sees flags as Action Items:
  → [Dismiss] — acceptable, removed, logged
  → [Escalate to Attorney] (if requiresAttorney) — opens escalation modal
  → [Convert to Client Flag] (if !requiresAttorney) — opens flag form
  → [Direct Edit] (if applicable) — inline field edit
```

### Client Flag Creation

```
┌─────────────────────────────────────────────────┐
│  Create Flag                                    │
│                                                 │
│  Template:     [Dropdown ▾]                     │
│  Title:        [Auto-populated, editable]       │
│  Applicant:    [Dropdown — families only]       │
│  Severity:     ○ Correction  ○ Clarification    │
│  Instructions: [Auto-populated textarea]        │
│                                                 │
│  [Cancel]                    [Stage Flag]       │
└─────────────────────────────────────────────────┘
```

### Flag Templates

| ID | Title | Severity | Instructions |
|---|---|---|---|
| `doc_illegible` | Document illegible | Correction | "Part of your [document] is difficult to read. Could you upload a clearer scan or photo?" |
| `doc_bw` | Document — black & white | Correction | "Your [document] appears to be in black and white. IRCC requires color copies." |
| `reg_number` | Registration number verification | Clarification | "We need to confirm the registration number on [parent]'s birth certificate. Could you double-check?" |
| `name_change_doc` | Missing name change documentation | Correction | "[Person]'s name appears differently across documents. Please upload a name change document." |
| `translation` | Missing translation | Correction | "Your [document] appears to be in [language]. IRCC requires a certified English or French translation." |
| `longform_bc` | Long-form birth certificate needed | Correction | "Your birth certificate doesn't include your parents' names. Please obtain a long-form version." |
| `additional_id` | Additional ID needed | Correction | "One of your ID documents doesn't meet requirements. Please upload a different government-issued ID." |
| `quebec_replacement` | Quebec certificate replacement | Correction | "Your [parent]'s Quebec certificate was issued before 1994 and needs to be replaced." |
| `supplementary_docs` | Supplementary parentage docs | Correction | "We need additional documentation to confirm your parents' names." |
| `general` | General correction | (CM selects) | "Please review and correct the information in the [section name] section." |

### Staging & Sending

1. CM stages 1+ flags
2. Action bar updates: "Send [N] Flags to Client"
3. Confirmation modal: "Send [N] flags to [Name]?"
4. On confirm: state → `changes_requested`, CM returns to queue
5. Navigating away with unsent flags: warning modal

### Escalation Flow

1. CM clicks "Escalate to Attorney" (on action item or footer button)
2. Modal: "Escalate to Attorney?" with required textarea ("Internal note — context for the attorney")
3. Note pre-populated from flag context (editable)
4. On confirm: `awaiting_attorney` sub-state set, note added to Comms as internal note
5. File appears in attorney's escalation queue

### Flag Resolution Cycle

```
CM sends flags → state: changes_requested
Client resolves + resubmits → state: client_resubmitted (enters queue)
CM opens re-review:
  → Previous flags shown as "Resolved" (green, dimmed)
  → CM: [Confirm Resolved] or [Re-flag] per flag
  → All confirmed → Approve enabled
```

### Pre-Drafted Messages

| State | Message |
|---|---|
| `aor_received` | "Great news — we've received confirmation that IRCC has received your application. Based on current processing times, we expect a decision by approximately [date]. We'll keep you updated." |
| `application_approved_gov` | "Congratulations! Your Canadian citizenship has been officially confirmed by IRCC. Your citizenship certificate will be issued shortly. You're now eligible to apply for a Canadian passport — would you like us to help with that?" |
| Dormant 14-day | "Hi [Name], just checking in — we noticed your application is still in progress. Is there anything we can help with?" |
| Dormant 30-day | "Hi [Name], we wanted to follow up. We're still waiting on [items] to move forward. If you need guidance, we're happy to help." |
| Dormant 60-day | "Hi [Name], your application has been on hold for a while. Could you let us know if you're still planning to proceed?" |

---

## 13. Supervisor — Team View

### Team Overview

```
┌──────────────────────────────────────────────────────────────────┐
│  Team Overview                                                    │
│                                                                   │
│  [18 Active Files]  [10 Queue Items]  [1 Overdue]  [6/day Rate]  │
│                                                                   │
│  ┌─ Victoria Rukaite ─────────────────────────────────────────┐  │
│  │  15 files · 9 in queue                                      │  │
│  │  [7/20 Today] [3.2m Avg] [98% SLA] [22% Flag] [8% Re-rev]  │  │
│  │  FILE DISTRIBUTION: [pill] [pill] [pill] ...                 │  │
│  │  [View Queue →]  [View Caseload →]                          │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌─ David Chen ───────────────────────────────────────────────┐  │
│  │  3 files · 1 in queue · ⚠ 1 overdue                        │  │
│  │  ...                                                        │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

### CM Card Metrics

| Metric | Health Thresholds |
|---|---|
| Reviewed today (X/20) | — |
| Avg review time | Amber >7m, Red >10m |
| SLA compliance % | Amber <95%, Red <90% |
| Flag rate % | Informational |
| Re-review rate % | Informational |

### Drill-In

Click "View Queue" or "View Caseload" → read-only view of that CM's data. Blue banner: "Viewing [Name]'s queue — Read only."

### Reassignment

Select file(s) via checkboxes → "Reassign" → select target CM → optional handoff note → confirm.

---

## 14. Attorney — Escalations View

### Navigation

Single tab: "My Escalations." No cockpit strip.

### Escalation Queue

Cards (not table rows) for each escalated file:

```
┌─────────────────────────────────────────────────────────────┐
│  Client Name                              [Severity Badge]   │
│  Assigned CM: Victoria Rukaite                               │
│  Escalated on [date]                                         │
│  [CM Note: "..." — if escalation has been performed]         │
│  [Review File →]                                            │
└─────────────────────────────────────────────────────────────┘
```

CM Note only appears if the CM has actually escalated and provided a note during the current session.

### Attorney File Review

Same two-panel layout as CM. Key differences:

**AI Brief:** Attorney-focused with visual structure:
- **Context line** (small, `textMut`): "Escalated by [CM] on [date]"
- **Client:** (bold label) chain summary
- **Legal Question:** (bold label, accent left border) the specific issue
- **CM's Analysis:** (tinted block, `#F6F5F0` background) the CM's quoted notes
- **Relevant Documents:** (compact, `textSec`) comma-separated list

**Action items:** Displayed as **read-only context** — no Dismiss/Convert/Direct Edit buttons.

**Primary actions:**

| Left | Right |
|---|---|
| Request More Info (outline) | Return to CM (solid green) |

**"Return to CM"** opens modal with required "Attorney Determination" textarea. On submit: note added to Comms as internal note, `awaiting_attorney` → `attorney_returned`, CM notified, file re-enters CM queue.

**"Request More Info"** sends message to CM (not client) via Comms. File stays in `awaiting_attorney`.

---

## 15. Golden Checklist

~44 items across 6 sections. 🤖 = system-verified, 👤 = CM judgment.

### Eligibility

| # | Type | Check |
|---|---|---|
| 1 | 🤖 | Applicant is not adopted |
| 2 | 🤖 | Chain of descent established |
| 3 | 🤖 | Not born in Canada to foreign diplomat parents |
| 4 | 🤖 | Pre-1977 gender/wedlock — auto-resolved by Bill C-3 (if applicable) |
| 5 | 🤖 | Section 8 Lost Canadian — auto-resolved by Bill C-3 (if applicable) |
| 6 | 🤖 | Deceased ancestor — Section 3(1.5) applied (if applicable) |
| 7 | 🤖 | Quebec pre-1994 — replacement initiated (if applicable) |
| 8 | 👤 | Pre-1977 edge case with complications → escalated (if applicable) |
| 9 | 👤 | Pre-1947 ancestor → escalated (if applicable) |
| 10 | 👤 | "I'm not sure" intake answers → resolved from evidence (if applicable) |

### Documents

| # | Type | Check |
|---|---|---|
| 11 | 🤖 | All required documents uploaded |
| 12 | 🤖 | Document quality passed (color, resolution, completeness) |
| 13 | 🤖 | Document types correctly classified |
| 14 | 🤖 | IDs: two different types provided |
| 15 | 🤖 | IDs: both show name and date of birth |
| 16 | 🤖 | IDs: at least one has photo |
| 17 | 🤖 | IDs: not expired |
| 18 | 🤖 | Authenticity markers present |
| 19 | 🤖 | Language: English/French or translation provided |
| 20 | 👤 | System-generated document flags reviewed |
| 21 | 👤 | Low-confidence documents reviewed |

### Cross-Document Consistency

| # | Type | Check |
|---|---|---|
| 22 | 🤖 | Applicant name consistent (or auto-resolved) |
| 23 | 🤖 | Applicant DOB consistent |
| 24 | 🤖 | Parent names matched across docs (or auto-resolved) |
| 25 | 🤖 | Registration numbers distinguished from certificate numbers |
| 26 | 🤖 | Chain linkage verified |
| 27 | 👤 | Remaining unresolved discrepancies |

### Form Accuracy — CIT-0001

| # | Type | Check |
|---|---|---|
| 28 | 🤖 | §1–4 auto-filled (language, UCI, reason, certificate type) |
| 29 | 🤖 | §5 personal info from birth certificate |
| 30 | 🤖 | §6 name/DOB/gender change per intake |
| 31 | 🤖 | §7 birth certificate status |
| 32 | 🤖 | §8 Canadian parent — all fields populated |
| 33 | 🤖 | §8 Non-Canadian parent — basic fields complete |
| 34 | 🤖 | §8 Pre-1977 fields collected (if applicable) |
| 35 | 🤖 | §9 Grandparents present (if 2+ gen chain) |
| 36 | 🤖 | §10–13 auto-resolved from DOB |
| 37 | 🤖 | §14 Contact info; mailing = representative |
| 38 | 🤖 | §15 Representative hard-coded |
| 39 | 🤖 | §3 screening checkbox auto-determined |
| 40 | 👤 | Quick sanity check: overall file narrative |

### Form Accuracy — IMM 5476

| # | Type | Check |
|---|---|---|
| 41 | 🤖 | All fields synced from CIT-0001 and client profile |

### Family Consistency (if applicable)

| # | Type | Check |
|---|---|---|
| 42 | 🤖 | Shared fields identical across all applicants |
| 43 | 🤖 | Per-applicant fields unique and correct |
| 44 | 👤 | All applicants' files satisfactory |

---

## 16. CIT-0001 Field Structure

The Forms tab renders the auto-filled CIT-0001 as structured data by section.

### §1 Language
| Field | Type |
|---|---|
| Language of service | English / French |

### §2 UCI
| Field | Type |
|---|---|
| Unique Client Identifier | Text or "NA" |

### §3 Reason
| Field | Type |
|---|---|
| Replacing existing certificate? | Yes / No |
| Screening checkbox | Which scenario applies (auto-determined) |

### §4 Certificate Type
| Field | Type |
|---|---|
| Certificate type | Paper / Electronic |

### §5 About the Applicant
| Field | Source |
|---|---|
| Surname/Last name | Birth certificate |
| Given name(s) | Birth certificate |
| Date of birth | Birth certificate |
| Place of birth | Birth certificate |
| Country of birth | Birth certificate |
| Gender (F/M/X) | Birth certificate |
| Height | Photo ID / Client input |
| Natural eye colour | Photo ID / Client input |
| Other names used | Client input |

### §6 Change Request (conditional)
| Field | Type |
|---|---|
| Requesting change? | Yes / No |
| Requested surname | Text |
| Requested given names | Text |
| New date of birth | Date |
| Requested gender | F / M / X |

### §7 Birth Certificate Details
| Field | Type |
|---|---|
| Changed or replaced? | Yes / No / Don't know |
| Explanation | Text |

### §8 Parent 1 (Canadian Parent)

**Personal:**
| Field | Source |
|---|---|
| Surname | Parent's birth certificate |
| Given name(s) | Parent's birth certificate |
| Other names | Client input / Marriage cert |
| Country of birth | Parent's birth certificate |
| Date of birth | Parent's birth certificate |
| Birth cert registration # | Parent's birth certificate |
| Date of marriage | Marriage cert / Client input |
| Place of marriage | Marriage cert / Client input |
| Date of death | Client input (if applicable) |

**Relationship:** Biological / Adoptive / Legal parent at birth

**Citizenship:** Status, how obtained, certificate #, date entered Canada

**Pre-1977 (if parent DOB < Feb 15, 1977):**
| Field | Type |
|---|---|
| Left Canada 1+ years before 1977? | Yes/No → repeatable: From, To, Destination |
| Citizen of another country before 1977? | Yes/No → Country, Date, How obtained |
| Born in Canada before Jan 1, 1947? | Yes/No |
| Naturalized as British subject before 1947? | Yes/No |
| British subject in Canada on Jan 1, 1947? | Yes/No |

**Foreign Gov Employment:** Was parent employed by foreign gov in Canada at time of birth? Was grandparent?

### §8 Parent 2 (Non-Canadian Parent)
Same structure as Parent 1.

### §9 Grandparents (if 2+ gen chain)
For each grandparent: Surname, Given names, Other names, Country of birth, DOB, Birth cert reg #, Citizenship cert #, How obtained citizenship, Date of death.

### §10 Additional Citizenship
| Field | Type |
|---|---|
| Ever lived in Canada? | Yes/No → date or "Born in Canada" |

### §11 Born Before 1977 (conditional)
Absences from Canada 1+ years, citizenship of other countries.

### §12 Born Before 1950 (conditional)
British subject questions, pre-1947 marriage.

### §13 Born On/After Dec 15, 2025 (conditional)
Born in Canada? Parents born in Canada? Crown servant? 1,095 days physical presence?

### §14 Contact Information
Surname, given names, email, home address, mailing address (= representative), phone.

### §15 Representative
Hard-coded: Olivia Cohen, Cohen Immigration Law. Paid representative, law society member.

### §16 Declarations
Six declaration checkboxes (all checked). Signature fields left blank (physical signing).

---

## 17. IMM 5476 Field Structure

### §A Applicant Information
Family name, given names, DOB, email, type of application ("Proof of Citizenship (CIT-0001)"), UCI.

### §B Representative
Representative name: Daniel Brian Levy. Paid, law society member (Quebec). Cohen Immigration Law, 123 Bay Street, Suite 1200, Toronto, ON M5J 2T2.

### §E Declaration
Signature fields (blank — physical signing).

---

## 18. AI Brief Patterns

### Design Principles
- Natural language, 3–5 sentences
- 15–16px font, slightly larger than body text
- Starts with the most actionable information
- CM audience: operational. Attorney audience: legal question first.
- Re-reviews: lead with delta (what changed)

### By State

**Clean file:**
> **Iliana Vasquez** is a single applicant claiming citizenship by descent through her mother, Maria Elena Torres, who was born in Toronto, Ontario. All 5 documents are uploaded and verified. Cross-document checks passed — names, dates, and chain linkage are consistent. No system flags. CIT-0001 and IMM 5476 are fully auto-filled. This file is ready to approve.

**File with flags:**
> **Webb Family (3 applicants)** — Marcus, Elena, and Olivia — are claiming citizenship through Marcus's father, Robert Webb, born in Vancouver, BC. 1 system flag needs your review: Olivia's birth certificate was uploaded in black and white (quality bypass used). Marcus and Elena's documents are clean. All other automated checks passed. Review the flag below, then approve or flag the client.

**Edge case:**
> **Roberto Silva** is a single applicant claiming citizenship through his mother, Lucia Silva, who was born in Argentina to a Canadian father. The chain passes through Roberto's grandfather, Eduardo Silva, born in Toronto in 1938 — before the 1947 Citizenship Act. The system has flagged this for attorney review: pre-1947 British subject provisions may apply. Escalate to an attorney before proceeding.

**Eligibility hold:**
> **Aisha Patel** was flagged during intake for an eligibility concern: she confirmed that she was adopted by her Canadian parent. Adopted persons cannot use CIT-0001 for initial citizenship applications — a different process (Section 5.1 direct grant) is required. This requires attorney review before the client can proceed.

**Re-review:**
> **James Thornton** has resubmitted after resolving 2 flagged items. (1) Registration number: client confirmed and corrected to registration number 1950-045-018832. (2) Missing translation: client uploaded certified English translation with affidavit. No new system flags detected. Verify the fixes and approve, or re-flag if issues remain.

**Forms received:**
> Signed forms for **Yuki Tanaka** were received at the office on March 23, 2026 and scanned by Sarah Park. Verify the signatures and package completeness using the checklist below, then submit to IRCC.

**AOR received:**
> IRCC has acknowledged receipt of **Maria Gonzalez**'s application. AOR dated March 20, 2026. Notify the client. Based on current processing times, we expect a decision by approximately February 2027.

**Government questions:**
> IRCC has raised a question about **Clara Dupont**'s application, requesting additional documentation to verify the chain of descent through her grandmother. This requires attorney involvement to draft a response. Escalate with the government correspondence attached.

**Government approved:**
> Great news — IRCC has approved **William Chang**'s citizenship application. The citizenship certificate will be issued by mail. Notify the client and congratulate them. This is also a good opportunity to offer Canadian passport services.

**Dormant:**
> **Daniel Kowalski** has been inactive for 18 days. He is currently in the document gathering stage — still waiting on: mother's birth certificate and a second piece of photo ID. Send a check-in message.

**Attorney brief (structured):**
> *Escalated by Victoria Rukaite on March 23, 2026.*
>
> **Client:** Roberto Silva, single applicant. Chain: Roberto (born Argentina) → Lucia Silva (mother, born Argentina) → Eduardo Silva (grandfather, born Toronto, 1938) → anchor.
>
> **Legal Question:** Eduardo Silva was born in Canada in 1938, before the 1947 Citizenship Act. Need determination on whether he qualifies as a citizen under the transitional provisions (§3(1)(k)–(r)), whether his Canadian citizenship passed to Lucia, and whether the chain to Roberto is intact under Bill C-3.
>
> **CM's Analysis:** "All documents in chain are present. Eduardo's Toronto birth certificate is verified (reg# 1938-022-005431). No indication of foreign citizenship acquisition before 1977. Pre-1947 cases always need attorney sign-off per our protocol."
>
> **Relevant Documents:** Eduardo's birth certificate, Lucia's birth certificate, Roberto's birth certificate, parents' marriage certificate.

---

## 19. Key Demo Flows

These 8 flows must work end-to-end. If a stakeholder can walk through all 8 smoothly, the prototype is complete.

1. **Clean file approval:** Victoria → Queue → Iliana Vasquez → read brief (narrow sidebar shows docs) → click Approve → "Confirmed ✓" pulse → auto-return to queue → row slides away → counter ticks

2. **Flagged family file:** Victoria → Webb Family → see B&W flag on Olivia → Convert to Client Flag (template) → Stage → Send → returns to queue → row exits

3. **Re-review:** Victoria → James Thornton → see resolved flags → Confirm both → Approve → modal confirm → return

4. **Attorney escalation:** Victoria → Roberto Silva → read pre-1947 flag → click "Escalate to Attorney" on action item → enter note → confirm → switch to Olivia Cohen (Attorney) → see Roberto in escalation queue → Review File → read structured attorney brief → click "Return to CM" → enter determination → confirm → switch back to Victoria → Roberto in queue with `attorney_returned`

5. **Eligibility hold:** Victoria → Aisha Patel → read adoption hold → Escalate to Attorney

6. **Post-submission quick actions:** Victoria → queue → Maria Gonzalez row → click "Notify →" quick action on row (or open file → Notify Client) → row exits. Same for William Chang.

7. **Supervisor overview:** Switch to Tereza → Team tab → see CM cards → notice David has 1 overdue → drill into David's queue → browse read-only → return

8. **Caseload search:** Victoria → My Caseload → see portfolio summary bar → search "Müller" → find Thomas in government processing → click → see file details

---

## 20. Acceptance Criteria

### Navigation & Shell
- [ ] Header: Cohen logo, "Case Manager Dashboard", Reset Demo, role badge, user dropdown
- [ ] Role switcher: Victoria (CM), Tereza (Supervisor), Olivia (Attorney)
- [ ] Tabs adapt per role
- [ ] Cockpit strip visible on Queue/Caseload, hidden in File Review
- [ ] Reset Demo restores all state

### Cockpit Strip
- [ ] Progress ring (42px, animates), streak with flame SVG, counter with increment animation
- [ ] Needs Me badges filter queue on click
- [ ] Watch cluster shows overdue (red), follow-ups, attorney counts
- [ ] Bottom border separates from content

### Queue
- [ ] 10 items for Victoria, sorted by priority score
- [ ] Tight rows: 5px priority bars, bottom borders (no card shadows)
- [ ] Filter pills (7 filters)
- [ ] Quick action buttons on hover for AOR/approval/dormant rows
- [ ] Row exit animation (fade + slide left, remaining slide up)
- [ ] Batch "Send All Follow-ups" when filtered to follow-ups

### Caseload
- [ ] Portfolio summary bar above table (clickable segments)
- [ ] 6-column table with "Days in Stage" (color thresholds)
- [ ] "Dormant" filter pill
- [ ] Search bar
- [ ] All 15 of Victoria's files listed

### File Review — Speed 1 (Clean)
- [ ] Right panel renders as narrow summary sidebar (~30%)
- [ ] Document list compact (title + check only)
- [ ] "Expand →" transitions to full panel
- [ ] Primary actions float below content (not pinned to bottom)
- [ ] Approve: no modal, inline "Confirmed ✓" + auto-return after 800ms
- [ ] Iliana Vasquez demonstrates this flow

### File Review — Speed 2/3 (Flagged/Complex)
- [ ] Full two-panel layout (45/55)
- [ ] Independent scrolling
- [ ] AI Brief with accent left border, no label, 15–16px text
- [ ] Action items with correct buttons per flag type (requiresAttorney)
- [ ] Checklist with cross-panel document highlighting
- [ ] Compact document cards (expand on click, auto-expand if flagged)
- [ ] Forms tab with CIT-0001 + IMM 5476, source badges, click-to-edit
- [ ] Comms tab with message history + internal notes + compose

### Flagging
- [ ] Template dropdown auto-populates
- [ ] Staged flags panel
- [ ] Send confirmation modal
- [ ] Re-review: resolved flags with Confirm/Re-flag

### Escalation
- [ ] "Escalate to Attorney" modal with required note (pre-populated)
- [ ] File appears in attorney queue after escalation
- [ ] Attorney "Return to CM" modal with required determination
- [ ] File returns to CM queue with `attorney_returned` — demoable round-trip

### State-Specific Actions
- [ ] Review states: Flag Client + Approve
- [ ] Eligibility hold: Message Client + Escalate to Attorney
- [ ] Forms received: Flag Issue + Confirm — Submit to IRCC
- [ ] AOR: Notify Client (full width)
- [ ] Gov questions: Message Client + Escalate to Attorney
- [ ] Gov approved: Notify & Congratulate (full width)

### Supervisor
- [ ] Team Overview: aggregate stats + CM cards with health metrics
- [ ] CM cards: file distribution pills, View Queue / View Caseload links
- [ ] Drill-in: read-only with blue banner
- [ ] Reassignment flow

### Attorney
- [ ] Escalation queue with severity badges
- [ ] Structured AI Brief (context line, client, legal question, CM analysis, relevant docs)
- [ ] Read-only action items (no buttons)
- [ ] Return to CM + Request More Info actions
- [ ] CM note only shown after escalation has occurred

### Visual
- [ ] Design follows creative direction (editorial utility, depth layering, intentional typography)
- [ ] Status pills match color mapping
- [ ] Eligibility hold (filled red) vs government questions (outlined red) differentiated
- [ ] Left panel visually distinct from right panel (bgDeep vs white, border, shadow)
- [ ] All animations implemented per motion spec

### Mock Data
- [ ] All data matches companion mock data document
- [ ] All 18 clients present with complete document sets
- [ ] AI briefs match patterns in Section 18
- [ ] State persistence within session
- [ ] Role switching flows data correctly (attorney round-trip works)

---

*End of CM Dashboard PRD — Version 2.0*
