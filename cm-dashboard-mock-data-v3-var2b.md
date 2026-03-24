# CM Dashboard — Mock Data Companion Document v2

**Version:** 2.0
**Date:** March 24, 2026
**Companion to:** cm-dashboard-prd-v2.md

This document contains all mock data for the CM Dashboard prototype. The PRD describes *what* to build; this document describes the *data* that populates it.

---

## Table of Contents

1. Staff
2. Client Overview
3. Victoria's Queue (sorted)
4. Client Detail — Full Specifications
5. Document Templates by Chain Type
6. Attorney Escalation Queue
7. David Chen's Caseload
8. Cockpit Strip Starting Values
9. Key Timestamps

---

## 1. Staff

| Name | Role | Notes |
|---|---|---|
| Victoria Rukaite | Case Manager | Primary demo user (logged-in CM) |
| David Chen | Case Manager | Secondary CM (supervisor drill-in, reassignment demo) |
| Tereza Monkova | Supervisor | Has Team view. Shares Victoria's data for My Queue / My Caseload. |
| Olivia Cohen | Attorney | Handles escalations |
| Sarah Park | Admin Assistant | Logs form receipt, AOR, government communications |

**Cohen Immigration Law office address (used for mailing/representative fields):**
123 Bay Street, Suite 1200, Toronto, ON M5J 2T2

**Representative on IMM 5476:**
Daniel Brian Levy, Cohen Immigration Law, Quebec law society member.

---

## 2. Client Overview — Victoria's Caseload (15 clients)

| # | Client | Type | State | Chain | Scenario |
|---|---|---|---|---|---|
| 1 | Iliana Vasquez | Single | `submitted_for_review` | 1st gen via mother (Toronto) | Clean file — happy path approval |
| 2 | Webb Family (Marcus, Elena, Olivia) | Family (3) | `submitted_for_review` | 1st gen via Marcus's father (Vancouver) | Family with 1 flag (Olivia's B&W birth cert) |
| 3 | James Thornton | Single | `client_resubmitted` | 1st gen via father (Halifax) | Re-review — 2 resolved flags |
| 4 | Aisha Patel | Single | `eligibility_hold` | Adopted by Canadian mother | Eligibility hold — adoption |
| 5 | Roberto Silva | Single | `submitted_for_review` | 2nd gen via grandfather (Toronto, 1938) | Edge case — pre-1947 ancestor |
| 6 | Sophie Laurent | Single | `changes_requested` | 1st gen via mother (Ottawa) | Waiting on client — 2 flags sent 3d ago |
| 7 | Daniel Kowalski | Single | `awaiting_documents` | 1st gen via mother (Winnipeg) | Dormant 18 days — partial docs |
| 8 | Yuki Tanaka | Single | `forms_received` | 1st gen via father (Victoria, BC) | Post-sub — verify signatures |
| 9 | Maria Gonzalez | Single | `aor_received` | 1st gen via father (Calgary) | Post-sub — AOR notification |
| 10 | Thomas Müller | Single | `government_processing` | 1st gen via mother (Montreal) | Passive — 4 months in processing |
| 11 | Clara Dupont | Single | `government_questions` | 2nd gen via grandfather (Montreal) | Post-sub — gov questions, needs attorney |
| 12 | William Chang | Single | `application_approved_gov` | 1st gen via father (Toronto) | Post-sub — approved, notify + pitch |
| 13 | Anna Petrova | Single | `approved` | 1st gen via father (Edmonton) | Awaiting signature — passive |
| 14 | Liam O'Brien | Single | `submitted_to_ircc` | 1st gen via mother (Vancouver) | Recently submitted — passive |
| 15 | Priya Sharma | Single | `closed` | 1st gen via father (Toronto) | Completed file |

### David Chen's Caseload (3 clients)

| # | Client | State | Notes |
|---|---|---|---|
| 16 | Jennifer Adams | `submitted_for_review` | Clean file |
| 17 | Carlos Rivera | `government_processing` | Passive |
| 18 | Emma Watson | `changes_requested` | Overdue — 3 days past SLA |

---

## 3. Victoria's Queue (sorted by priority)

| Rank | Client | State | Priority Bar | AI Summary (queue row) | Time |
|---|---|---|---|---|---|
| 1 | James Thornton | Re-submitted | Amber | "Re-submitted — reg number corrected, translation uploaded. Verify fixes." | 18h |
| 2 | Roberto Silva | Ready for Review | Amber | "1 system flag — pre-1947 ancestor detected. Needs attorney escalation." | 2d |
| 3 | Aisha Patel | Eligibility Hold | Amber | "Eligibility hold — client confirmed adoption. Escalate to attorney." | 1.5d |
| 4 | Webb Family (3) | Ready for Review | Green | "Family file — 1 flag on Olivia's birth cert (B&W). Marcus and Elena clean." | 3h |
| 5 | Iliana Vasquez | Ready for Review | Green | "Clean file — all checks passed. Ready to approve." | 2h |
| 6 | Clara Dupont | Gov Questions | Amber | "IRCC question about chain documentation. Escalate to attorney." | 1d |
| 7 | Yuki Tanaka | Forms Received | Green | "Signed forms received. Verify signatures and package completeness." | 1h |
| 8 | Maria Gonzalez | AOR Received | Blue | "AOR received — notify client." | 3h |
| 9 | William Chang | Gov Approved | Blue | "Application approved by IRCC — notify client and offer passport services." | 3.5h |
| 10 | Daniel Kowalski | Follow-up Due | Green | "Dormant 18 days — send check-in. Client stalled during document gathering." | 18d |

**Quick action eligible rows:** Maria Gonzalez (Notify →), William Chang (Notify →), Daniel Kowalski (Send →)

---

## 4. Client Detail — Full Specifications

### 4.1 Iliana Vasquez (Clean File)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Iliana Vasquez |
| DOB | 1992-03-15 |
| Place of Birth | Los Angeles, California |
| Country of Birth | United States |
| Gender | F |
| Height | 5'7" |
| Eye Color | Brown |
| Email | iliana@email.com |
| Phone | (310) 555-0147 |
| Address | 1842 Sunset Boulevard, Apt 4B, Los Angeles, CA 90026, US |
| Other names | None |
| Birth cert changed | No |
| Lived in Canada | No |

**Chain:** Iliana (applicant, born USA) → Maria Elena Torres (mother, born Toronto, Ontario) → Anchor

**Mother (Parent 1 — Canadian):**

| Field | Value |
|---|---|
| Full Name | Maria Elena Torres |
| Other names | Torres (maiden) |
| DOB | 1965-04-22 |
| Place/Country of Birth | Toronto, Ontario / Canada |
| Registration # | 1965-091-022891 |
| Relationship | Biological parent |
| How became Canadian | Born in Canada |
| Date of Marriage | September 14, 1988 |
| Place of Marriage | Toronto, Ontario |
| Date of Death | — (unknown) |

**Father (Parent 2 — Non-Canadian):**

| Field | Value |
|---|---|
| Full Name | Carlos Andres Vasquez |
| Other names | — (unknown) |
| DOB | 1963-08-10 |
| Country of Birth | Colombia |
| Citizenship Status | Not a Canadian citizen |
| Relationship | Biological parent |
| Date of Marriage | September 14, 1988 |
| Date of Death | — (unknown) |

**Documents (5):**

| Document | Type | Status | Key Extracted Data |
|---|---|---|---|
| Your birth certificate | Birth Certificate | ✓ Verified | Name: Iliana Vasquez, DOB: 1992-03-15, Place: Los Angeles, CA, Sex: F, Parent 1: Maria Elena Torres Vasquez, Parent 2: Carlos Andres Vasquez |
| Photo ID (primary) — Driver's license | Driver's License | ✓ Verified | Name: Iliana Vasquez, DOB: 1992-03-15, Height: 5'7", Eye Color: Brown, Expiry: 2028-03-15 |
| Photo ID (secondary) — US Passport | Passport | ✓ Verified | Name: Iliana Vasquez, DOB: 1992-03-15, Nationality: United States, Expiry: 2029-06-20 |
| Mother's birth certificate | Birth Certificate | ✓ Verified | Name: Maria Elena Torres, DOB: 1965-04-22, Place: Toronto, Ontario, Reg#: 1965-091-022891 |
| Parents' marriage certificate | Marriage Certificate | ✓ Verified | Party 1: Maria Elena Torres, Party 2: Carlos Andres Vasquez, Date: Sep 14, 1988, Place: Toronto, Ontario |

**System flags:** None. **Checklist:** 30/30 passed.

**File review speed:** Speed 1 (Glance). Right panel in summary sidebar mode.

---

### 4.2 Webb Family (Family File with Flag)

**Primary Applicant: Marcus Webb**

| Field | Value |
|---|---|
| Full Name | Marcus Webb |
| DOB | 1987-06-12 |
| Place of Birth | Boston, Massachusetts |
| Country of Birth | United States |
| Gender | M |
| Height | 6'0" |
| Eye Color | Green |
| Email | marcus.webb@email.com |
| Phone | (617) 555-0234 |
| Address | 45 Beacon Street, Apt 7, Boston, MA 02108, US |

**Additional Applicant: Elena Webb (spouse)**

| Field | Value |
|---|---|
| Full Name | Elena Webb |
| DOB | 1989-11-03 |
| Place of Birth | New York, New York |
| Country | United States |
| Gender | F |

**Additional Applicant: Olivia Webb (daughter, minor)**

| Field | Value |
|---|---|
| Full Name | Olivia Webb |
| DOB | 2019-08-21 |
| Place of Birth | Boston, Massachusetts |
| Country | United States |
| Gender | F |
| Note | Under 14 — parent/guardian signature required |

**Chain:** All three → Robert Webb (Marcus's father, born Vancouver, BC, 1958-03-15) → Anchor

**Canadian Parent (Robert Webb):**

| Field | Value |
|---|---|
| Full Name | Robert Webb |
| DOB | 1958-03-15 |
| Place of Birth | Vancouver, British Columbia |
| Registration # | 1958-034-011276 |
| How became Canadian | Born in Canada |
| Marriage | Susan Chen, June 3, 1985, Boston, MA |

**Non-Canadian Parent (Susan Chen Webb):**

| Field | Value |
|---|---|
| Full Name | Susan Chen Webb |
| DOB | 1960-09-18 |
| Country of Birth | United States |
| Not Canadian | — |

**Documents (per person):**

Marcus: birth cert, driver's license, US passport
Elena: birth cert, driver's license, US passport
Olivia: birth cert (B&W — flagged), health insurance card (as ID)
Shared: Robert's Canadian birth cert, parents' marriage cert

**System flags (1):**
- Title: "Birth certificate quality — grayscale bypass used"
- Applicant: Olivia Webb
- Severity: Warning
- requiresAttorney: false
- Description: "Olivia Webb's birth certificate was uploaded in black and white. IRCC requires color copies. The quality bypass was used, but the CM must decide whether the document is legible enough or if a color re-upload is needed."
- documentRef: Olivia's birth certificate

**Checklist:** 32/33 passed (1 document quality flag).

**File review speed:** Speed 2 (Scan).

---

### 4.3 James Thornton (Re-Review)

**Personal:**

| Field | Value |
|---|---|
| Full Name | James Gerald Thornton |
| DOB | 1978-05-22 |
| Place of Birth | Frankfurt, Germany (born while father was working abroad) |
| Country of Birth | Germany |
| Gender | M |
| Height | 5'11" |
| Eye Color | Blue |
| Email | james.thornton@email.com |
| Phone | (312) 555-0891 |
| Address | 2200 N Lincoln Ave, Unit 3C, Chicago, IL 60614, US |

**Chain:** James → Gerald Thornton (father, born Halifax, Nova Scotia, 1950-11-08) → Anchor

**Canadian Parent (Gerald Thornton):**

| Field | Value |
|---|---|
| Full Name | Gerald Thornton |
| DOB | 1950-11-08 |
| Place of Birth | Halifax, Nova Scotia |
| Registration # | 1950-045-018832 |
| How became Canadian | Born in Canada |
| Marriage | Margaret Schneider, August 20, 1976, Chicago, IL |

**Non-Canadian Parent (Margaret Schneider Thornton):**

| Field | Value |
|---|---|
| Full Name | Margaret Schneider Thornton |
| DOB | 1952-07-14 |
| Country of Birth | Germany |
| Not Canadian | — |

**Documents (6):**
Birth cert (German), certified English translation (NEW — with translator affidavit), driver's license, US passport, father's Canadian birth cert, parents' marriage cert.

**Previous flags (now resolved):**
1. Registration number verification — "Number appeared to be certificate number. Client corrected to registration number 1950-045-018832." Status: Resolved.
2. Missing translation — German birth certificate — "Client uploaded certified English translation with affidavit." Status: Resolved.

**Comms history:**
- Victoria (Mar 16, 11:00 AM): "Hi James, I've reviewed your file and found two items that need attention: 1. The registration number on your father's birth certificate appears to be the certificate number instead. Could you double-check? 2. Your German birth certificate needs a certified English translation with an affidavit from the translator. Please update and resubmit when ready."
- James (Mar 22, 3:30 PM): "Hi Victoria, you were right about the registration number — I confirmed with the Nova Scotia vital statistics office and corrected it. I've also uploaded the certified translation. Let me know if anything else is needed!"

**Checklist:** 30/30 passed. **File review speed:** Speed 2 (Scan — re-review).

---

### 4.4 Aisha Patel (Eligibility Hold)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Aisha Patel |
| DOB | 1995-09-14 |
| Place of Birth | London, United Kingdom |
| Email | aisha.patel@email.com |
| Phone | +44 20 7946 0958 |
| Address | 42 Camden High Street, London NW1 0JH, UK |

**Chain:** Aisha → Nadia Patel (mother, born Montreal, Quebec — adoptive parent) → Anchor

**Hold trigger:** Adoption confirmed during intake. CIT-0001 cannot be used. Section 5.1 direct grant process required.

**Documents:** None (client was stopped at intake).

**System flags (1):**
- Title: "Eligibility concern — adoption confirmed"
- Severity: Critical
- requiresAttorney: true
- Description: "Client confirmed during intake that she was adopted by her Canadian parent. Adopted persons cannot use CIT-0001 for initial citizenship applications. Alternative process (Section 5.1 direct grant) is required. Requires attorney review."

**Checklist:** 29/30 (eligibility flag). **File review speed:** Speed 3 (Investigate).

---

### 4.5 Roberto Silva (Edge Case — Pre-1947)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Roberto Miguel Silva |
| DOB | 1990-02-28 |
| Place of Birth | Buenos Aires, Argentina |
| Gender | M |
| Height | 5'10" |
| Eye Color | Brown |
| Email | roberto.silva@email.com |
| Phone | +54 11 4567-8901 |
| Address | Av. Corrientes 1234, Buenos Aires, Argentina |

**Chain:** Roberto → Lucia Silva (mother, born Buenos Aires, Argentina, 1962-06-15) → Eduardo Silva (grandfather, born Toronto, 1938) → Anchor

**This is a 2nd generation case.** Lucia was born in Argentina but has Canadian citizenship by descent through her father Eduardo, who was born in Toronto before the 1947 Citizenship Act.

**Mother (Parent 1 — Canadian by descent):**

| Field | Value |
|---|---|
| Full Name | Lucia Maria Silva |
| DOB | 1962-06-15 |
| Place of Birth | Buenos Aires, Argentina |
| Country of Birth | Argentina |
| How became Canadian | Canadian by descent (through Eduardo) |

**Father (Parent 2 — Non-Canadian):**

| Field | Value |
|---|---|
| Full Name | Miguel Silva |
| DOB | 1960-01-22 |
| Country of Birth | Argentina |
| Not Canadian | — |

**Grandfather (Eduardo Silva — Anchor):**

| Field | Value |
|---|---|
| Full Name | Eduardo Silva |
| DOB | 1938-03-15 |
| Place of Birth | Toronto, Ontario |
| Registration # | 1938-022-005431 |
| Date of Death | 2001-08-22 |

**Documents (7):**
Roberto's birth cert (Argentine), Argentine passport, Lucia's birth cert (Argentine, names Eduardo as father), Eduardo's Canadian birth cert (Toronto), parents' marriage cert (Lucia + Miguel), grandparents' marriage cert (Eduardo + grandmother), Eduardo's death certificate.

**System flags (1):**
- Title: "Pre-1947 ancestor — historical citizenship analysis required"
- Severity: Warning
- requiresAttorney: true
- Description: "Chain includes Eduardo Silva, born in Toronto in 1938, before the 1947 Citizenship Act. Pre-1947 British subject provisions may apply. Historical citizenship analysis by attorney is required before proceeding."
- documentRef: Eduardo's birth certificate

**Checklist:** 29/30 (edge case flag). **File review speed:** Speed 3 (Investigate).

---

### 4.6 Sophie Laurent (Changes Requested — Waiting)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Sophie Laurent |
| DOB | 1988-07-19 |
| Place of Birth | Paris, France |
| Email | sophie.laurent@email.com |
| Phone | +33 1 42 68 5300 |
| Address | 15 Rue de Rivoli, 75001 Paris, France |

**Chain:** Sophie → Catherine Laurent (mother, born Ottawa, Ontario, 1960-02-14) → Anchor

**Documents (5):** Birth cert (French), French passport, French driver's license, mother's Canadian birth cert, parents' marriage cert.

**Flags sent 3 days ago:**
1. "Expired passport" — Sophie's passport expired 2 months ago. Need a valid ID.
2. "Missing translation" — French birth certificate needs certified English translation.

**Comms history:**
- Victoria (Mar 20, 2:00 PM): "Hi Sophie, I've reviewed your file and found two items: 1. Your passport appears to have expired. Could you upload a current valid ID? 2. Your French birth certificate needs a certified English translation. Please update and resubmit when ready."
- (No response from Sophie yet)

**State:** `changes_requested` (3 days). Not in queue. Visible in caseload.

---

### 4.7 Daniel Kowalski (Dormant — Partial Docs)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Daniel Kowalski |
| DOB | 1985-04-10 |
| Place of Birth | Detroit, Michigan |
| Email | daniel.kowalski@email.com |
| Phone | (313) 555-7721 |
| Address | 1500 Woodward Ave, Apt 12, Detroit, MI 48226, US |

**Chain:** Daniel → Anna Kowalski (mother, born Winnipeg, Manitoba) → Anchor

**Documents (2 — partial, explains dormancy):**
Birth cert (US), driver's license. Missing: mother's birth cert, second photo ID.

**State:** `awaiting_documents` (18 days). Dormant trigger: `dormant_14`. In queue for follow-up.

---

### 4.8 Yuki Tanaka (Forms Received)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Yuki Tanaka |
| DOB | 1991-07-29 |
| Place of Birth | Seattle, Washington |
| Email | yuki.tanaka@email.com |
| Phone | (206) 555-3344 |
| Address | 820 Pine Street, Apt 5A, Seattle, WA 98101, US |

**Chain:** Yuki → Kenji Tanaka (father, born Victoria, British Columbia, 1962-08-03) → Anchor

**Documents (6):** Birth cert, driver's license, US passport, father's Canadian birth cert, parents' marriage cert, scanned signed forms (CIT-0001 + IMM 5476).

**State:** `forms_received`. Admin (Sarah Park) logged receipt on March 23, 2026.

**Signature verification checklist applies** (see PRD §11.4 — Forms Received).

---

### 4.9 Maria Gonzalez (AOR Received)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Maria Gonzalez |
| DOB | 1993-11-05 |
| Place of Birth | Phoenix, Arizona |
| Email | maria.gonzalez@email.com |
| Phone | (602) 555-8890 |
| Address | 3200 N Central Ave, Phoenix, AZ 85012, US |

**Chain:** Maria → Carlos Gonzalez (father, born Calgary, Alberta, 1965-03-22) → Anchor

**Documents (4):** Birth cert, driver's license, US passport, father's Canadian birth cert.

**State:** `aor_received`. AOR dated March 20, 2026. Expected decision: ~February 2027.

**Quick action eligible.** Pre-drafted AOR notification ready.

---

### 4.10 Thomas Müller (Government Processing — Passive)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Thomas Müller |
| DOB | 1979-12-03 |
| Place of Birth | Munich, Germany |
| Email | thomas.muller@email.com |
| Phone | +49 89 1234 5678 |
| Address | Maximilianstrasse 22, 80539 Munich, Germany |

**Chain:** Thomas → Ingrid Müller (mother, born Montreal, Quebec, 1955-06-18) → Anchor

**Documents (5):** Birth cert (German), German passport, German ID card, mother's Canadian birth cert, parents' marriage cert.

**State:** `government_processing` (121 days). Submitted to IRCC November 23, 2025. Fully passive. Not in queue.

---

### 4.11 Clara Dupont (Government Questions)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Clara Marie Dupont |
| DOB | 1994-06-18 |
| Place of Birth | Brussels, Belgium |
| Email | clara.dupont@email.com |
| Phone | +32 2 555 1234 |
| Address | 48 Avenue Louise, 1050 Brussels, Belgium |

**Chain:** Clara → Marie Dupont (mother, born Brussels, Belgium, 1968-09-12) → Jean-Pierre Dupont (grandfather, born Montreal, Quebec, 1940-03-07) → Anchor

**This is a 2nd generation case.** Marie was born in Belgium to a Canadian father.

**Documents (6):** Birth cert (Belgian), Belgian passport, Belgian ID card, mother's birth cert (Belgian), grandfather's Canadian birth cert (Montreal), parents' marriage cert.

**System flags (1):**
- Title: "IRCC question — additional chain documentation requested"
- Severity: Warning
- requiresAttorney: true
- Description: "IRCC has requested additional documentation to verify the chain of descent through Clara's grandmother. Attorney involvement needed to draft response."

**State:** `government_questions`. **File review speed:** Speed 3.

---

### 4.12 William Chang (Government Approved)

**Personal:**

| Field | Value |
|---|---|
| Full Name | William Chang |
| DOB | 1986-09-25 |
| Place of Birth | San Francisco, California |
| Email | william.chang@email.com |
| Phone | (415) 555-6677 |
| Address | 1200 Market Street, Apt 8B, San Francisco, CA 94102, US |

**Chain:** William → David Chang Sr. (father, born Toronto, Ontario, 1958-11-14) → Anchor

**Documents (4):** Birth cert, driver's license, US passport, father's Canadian birth cert.

**State:** `application_approved_gov`. Quick action eligible. Pre-drafted congratulations + passport pitch ready.

---

### 4.13 Anna Petrova (Approved — Awaiting Signature)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Anna Petrova |
| DOB | 1991-03-28 |
| Place of Birth | Moscow, Russia |
| Email | anna.petrova@email.com |
| Phone | +7 495 555 1234 |
| Address | 25 Tverskaya Street, Moscow 125009, Russia |

**Chain:** Anna → Viktor Petrov (father, born Edmonton, Alberta, 1963-07-11) → Anchor

**Documents (4):** Birth cert (Russian), Russian passport, Russian national ID, father's Canadian birth cert.

**State:** `approved` (5 days ago). Not in queue.

---

### 4.14 Liam O'Brien (Submitted to IRCC)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Liam O'Brien |
| DOB | 1990-01-15 |
| Place of Birth | Dublin, Ireland |
| Email | liam.obrien@email.com |
| Phone | +353 1 555 7890 |
| Address | 18 Grafton Street, Dublin 2, Ireland |

**Chain:** Liam → Siobhan O'Brien (mother, born Vancouver, BC, 1964-05-22) → Anchor

**Documents (4):** Birth cert (Irish), Irish passport, Irish driver's license, mother's Canadian birth cert.

**State:** `submitted_to_ircc` (7 days). AOR expected ~April 2026.

---

### 4.15 Priya Sharma (Closed)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Priya Sharma |
| DOB | 1987-08-12 |
| Place of Birth | New Delhi, India |
| Email | priya.sharma@email.com |
| Phone | +91 11 5555 6789 |
| Address | A-12 Vasant Kunj, New Delhi 110070, India |

**Chain:** Priya → Raj Sharma (father, born Toronto, Ontario, 1959-04-03) → Anchor

**Documents (4):** Birth cert (Indian), Indian passport, Aadhaar card (as second ID), father's Canadian birth cert.

**State:** `closed`. Citizenship certificate issued. Passport services pitched.

---

### 4.16 Jennifer Adams (David Chen — Clean File)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Jennifer Adams |
| DOB | 1993-05-17 |
| Place of Birth | Portland, Oregon |
| Email | jennifer.adams@email.com |
| Phone | (503) 555-2233 |
| Address | 900 SW Washington St, Portland, OR 97205, US |

**Chain:** Jennifer → Michael Adams (father, born Ottawa, Ontario, 1965-01-28) → Anchor

**Documents (4):** Birth cert, driver's license, US passport, father's Canadian birth cert.

**State:** `submitted_for_review`. Clean file. Assigned to David Chen.

---

### 4.17 Carlos Rivera (David Chen — Government Processing)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Carlos Rivera |
| DOB | 1982-12-08 |
| Place of Birth | Mexico City, Mexico |

**Chain:** Carlos → Patricia Rivera (mother, born Toronto, Ontario) → Anchor

**State:** `government_processing` (90 days). Assigned to David Chen.

---

### 4.18 Emma Watson (David Chen — Overdue)

**Personal:**

| Field | Value |
|---|---|
| Full Name | Emma Watson |
| DOB | 1996-03-22 |
| Place of Birth | London, United Kingdom |

**Chain:** Emma → Robert Watson (father, born Montreal, Quebec) → Anchor

**State:** `changes_requested` (5 days — 3 days past SLA). Assigned to David Chen. Shows as overdue in supervisor view.

---

## 5. Document Templates by Chain Type

Use these templates to generate consistent document sets. Each client should have documents matching their chain structure.

### 1st Generation Single (parent born in Canada)

| Document | Section | Required? |
|---|---|---|
| Applicant's birth certificate | About You | Required |
| Photo ID (primary) — driver's license or national ID | About You | Required |
| Photo ID (secondary) — passport | About You | Required |
| Canadian parent's birth certificate | Canadian Parent | Required |
| Parents' marriage certificate | Shared | Optional (include if married) |

### 2nd Generation Single (grandparent born in Canada)

All of the above, plus:

| Document | Section | Required? |
|---|---|---|
| Intermediate parent's birth certificate (foreign) | Canadian Parent | Required |
| Grandparent's Canadian birth certificate | Grandparent | Required |
| Grandparents' marriage certificate | Grandparent | Optional |

### Family Application

Same as above per chain type, with per-applicant documents for each family member:

| Document | Section | Per? |
|---|---|---|
| Each applicant's birth certificate | Per-applicant | Each |
| Each applicant's 2 IDs | Per-applicant | Each |
| Shared parent/grandparent docs | Shared | Once |

### Document Thumbnail Types

Generate 5 visually distinct placeholder images:
1. **Birth certificate** — green-tinted, official look, seal visible
2. **Passport** — dark cover, photo page layout
3. **Driver's license / ID card** — card format, horizontal
4. **Marriage certificate** — ornate border, certificate look
5. **Translation / certified document** — text-heavy, stamp visible

Each thumbnail should be recognizable at 40px height.

---

## 6. Attorney Escalation Queue

| Client | Source CM | Severity Badge | Reason |
|---|---|---|---|
| Aisha Patel | Victoria | "Eligibility" (red) | Adoption confirmed |
| Roberto Silva | Victoria | "Edge Case" (amber) | Pre-1947 ancestor |
| Clara Dupont | Victoria | "Gov Question" (amber) | IRCC documentation request |

**Important:** CM notes on escalation cards should ONLY appear after the CM has performed the escalation action during the current session. Pre-session, cards show no CM note.

---

## 7. Cockpit Strip Starting Values

| Element | Victoria | Tereza (Supervisor) |
|---|---|---|
| Reviewed today | 7 | 11 |
| Streak | 4-day | 4-day |
| Daily target | 20 | 20 |

### Supervisor Team Metrics

**Victoria Rukaite:**

| Metric | Value |
|---|---|
| Files | 15 |
| Queue depth | 9 |
| Reviewed today | 7/20 |
| Avg review time | 3.2m |
| SLA compliance | 98% |
| Flag rate | 22% |
| Re-review rate | 8% |

**David Chen:**

| Metric | Value |
|---|---|
| Files | 3 |
| Queue depth | 1 |
| Overdue | 1 |
| Reviewed today | 5/20 |
| Avg review time | 5.1m |
| SLA compliance | 91% |
| Flag rate | 35% |
| Re-review rate | 15% |

**Team aggregates:** 18 total files, 10 queue items, 1 overdue, 6/day review rate.

---

## 8. Key Timestamps

All timestamps are relative to "now" = March 24, 2026, ~11:00 AM.

| Client | State | Entered State | Time in State |
|---|---|---|---|
| Iliana Vasquez | `submitted_for_review` | Today 9:15 AM | ~2h |
| Webb Family | `submitted_for_review` | Today 8:30 AM | ~3h |
| James Thornton | `client_resubmitted` | Yesterday 4:00 PM | ~18h |
| Aisha Patel | `eligibility_hold` | Yesterday 11:00 AM | ~1.5d |
| Roberto Silva | `submitted_for_review` | 2 days ago | 2d |
| Sophie Laurent | `changes_requested` | 3 days ago | 3d |
| Daniel Kowalski | `awaiting_documents` | 18 days ago | 18d |
| Yuki Tanaka | `forms_received` | Today 10:00 AM | ~1h |
| Maria Gonzalez | `aor_received` | Today 8:00 AM | ~3h |
| Thomas Müller | `government_processing` | Nov 23, 2025 | ~121d |
| Clara Dupont | `government_questions` | Yesterday | ~1d |
| William Chang | `application_approved_gov` | Today 7:30 AM | ~3.5h |
| Anna Petrova | `approved` | 5 days ago | 5d |
| Liam O'Brien | `submitted_to_ircc` | 7 days ago | 7d |
| Priya Sharma | `closed` | 2 weeks ago | — |
| Jennifer Adams | `submitted_for_review` | Yesterday | ~1d |
| Carlos Rivera | `government_processing` | ~90 days ago | ~90d |
| Emma Watson | `changes_requested` | 5 days ago | 5d (3d past SLA) |

---

*End of Mock Data Companion Document — Version 2.0*
