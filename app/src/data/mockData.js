// ─── STAFF ───
export const STAFF = {
  victoria: { id: 'victoria', name: 'Victoria Rukaite', role: 'cm', title: 'Case Manager' },
  david: { id: 'david', name: 'David Chen', role: 'cm', title: 'Case Manager' },
  tereza: { id: 'tereza', name: 'Tereza Monkova', role: 'supervisor', title: 'Supervisor' },
  olivia: { id: 'olivia', name: 'Olivia Cohen', role: 'attorney', title: 'Attorney' },
  sarah: { id: 'sarah', name: 'Sarah Park', role: 'admin', title: 'Admin Assistant' },
};

// ─── STATUS CONFIG ───
export const STATUS_CONFIG = {
  intake_in_progress:      { label: 'Intake in Progress',     pill: 'gray',       inQueue: false },
  eligibility_hold:        { label: 'Eligibility Hold',       pill: 'red',        inQueue: true },
  awaiting_documents:      { label: 'Awaiting Documents',     pill: 'gray',       inQueue: false },
  submitted_for_review:    { label: 'Ready for Review',       pill: 'accent',     inQueue: true },
  in_review:               { label: 'In Review',              pill: 'accent',     inQueue: false },
  changes_requested:       { label: 'Changes Requested',      pill: 'amber',      inQueue: false },
  client_resubmitted:      { label: 'Re-submitted',           pill: 'accent',     inQueue: true },
  approved:                { label: 'Approved',               pill: 'success',    inQueue: false },
  awaiting_signature:      { label: 'Awaiting Signed Forms',  pill: 'gray',       inQueue: false },
  forms_in_transit:        { label: 'Forms In Transit',       pill: 'gray',       inQueue: false },
  forms_received:          { label: 'Signed Forms Received',  pill: 'blue',       inQueue: true },
  submitted_to_ircc:       { label: 'Submitted to IRCC',      pill: 'blue',       inQueue: false },
  awaiting_aor:            { label: 'Awaiting AOR',           pill: 'gray',       inQueue: false },
  aor_received:            { label: 'AOR Received',           pill: 'blue',       inQueue: true },
  government_processing:   { label: 'Government Processing',  pill: 'gray',       inQueue: false },
  government_questions:    { label: 'Government Questions',   pill: 'red-outline',inQueue: true },
  application_approved_gov:{ label: 'Approved by Government', pill: 'success',    inQueue: true },
  closed:                  { label: 'Closed',                 pill: 'gray-muted', inQueue: false },
};

// ─── HELPERS ───
function doc(title, type, status, extractedData, section, flagged) {
  return { title, type, status: status || 'verified', extractedData: extractedData || {}, section: section || 'applicant', flagged: flagged || false };
}

// ─── CLIENTS ───
export const CLIENTS = [
  // 1. Iliana Vasquez — Clean file
  {
    id: 'iliana-vasquez',
    name: 'Iliana Vasquez',
    type: 'single',
    state: 'submitted_for_review',
    assignedCm: 'victoria',
    speed: 1,
    personal: {
      fullName: 'Iliana Vasquez', dob: '1992-03-15', pob: 'Los Angeles, California', country: 'United States',
      gender: 'F', height: '5\'7"', eyeColor: 'Brown', email: 'iliana@email.com', phone: '(310) 555-0147',
      address: '1842 Sunset Boulevard, Apt 4B, Los Angeles, CA 90026, US', otherNames: 'None', birthCertChanged: 'No', livedInCanada: 'No',
    },
    chain: 'Iliana (applicant, born USA) → Maria Elena Torres (mother, born Toronto, Ontario) → Anchor',
    chainShort: 'Iliana → Maria Elena Torres (Toronto) → Anchor',
    parents: {
      canadian: {
        fullName: 'Maria Elena Torres', otherNames: 'Torres (maiden)', dob: '1965-04-22',
        pob: 'Toronto, Ontario', country: 'Canada', regNumber: '1965-091-022891',
        relationship: 'Biological parent', howBecameCitizen: 'Born in Canada',
        marriageDate: 'September 14, 1988', marriagePlace: 'Toronto, Ontario', deathDate: null,
      },
      nonCanadian: {
        fullName: 'Carlos Andres Vasquez', otherNames: null, dob: '1963-08-10',
        country: 'Colombia', citizenshipStatus: 'Not a Canadian citizen',
        relationship: 'Biological parent', marriageDate: 'September 14, 1988', deathDate: null,
      },
    },
    documents: [
      doc('Your birth certificate', 'birth_cert', 'verified', { name: 'Iliana Vasquez', dob: '1992-03-15', pob: 'Los Angeles, CA', sex: 'F', parent1: 'Maria Elena Torres Vasquez', parent2: 'Carlos Andres Vasquez' }, 'applicant'),
      doc('Photo ID (primary) — Driver\'s license', 'drivers_license', 'verified', { name: 'Iliana Vasquez', dob: '1992-03-15', height: '5\'7"', eyeColor: 'Brown', expiry: '2028-03-15' }, 'applicant'),
      doc('Photo ID (secondary) — US Passport', 'passport', 'verified', { name: 'Iliana Vasquez', dob: '1992-03-15', nationality: 'United States', expiry: '2029-06-20' }, 'applicant'),
      doc('Mother\'s birth certificate', 'birth_cert', 'verified', { name: 'Maria Elena Torres', dob: '1965-04-22', pob: 'Toronto, Ontario', regNumber: '1965-091-022891' }, 'canadian_parent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', { party1: 'Maria Elena Torres', party2: 'Carlos Andres Vasquez', date: 'Sep 14, 1988', place: 'Toronto, Ontario' }, 'shared'),
    ],
    flags: [],
    checklist: { passed: 30, total: 30 },
    aiBrief: 'Iliana Vasquez is a single applicant claiming citizenship by descent through her mother, Maria Elena Torres, who was born in Toronto, Ontario. All 5 documents are uploaded and verified. Cross-document checks passed — names, dates, and chain linkage are consistent. No system flags. CIT-0001 and IMM 5476 are fully auto-filled. This file is ready to approve.',
    queueSummary: 'Clean file — all checks passed. Ready to approve.',
    priorityBar: 'green',
    timeInState: '2h',
    priorityScore: 15 + 2,
    fileOpened: '2026-03-10',
    submittedForReview: '2026-03-24T09:15:00',
    timesReviewed: 0,
    comms: [],
    stateEnteredAt: '2026-03-24T09:15:00',
  },

  // 2. Webb Family — Family file with flag
  {
    id: 'webb-family',
    name: 'Webb Family',
    displayName: 'Webb Family',
    type: 'family',
    familyCount: 3,
    applicants: [
      { name: 'Marcus Webb', dob: '1987-06-12', pob: 'Boston, Massachusetts', country: 'United States', gender: 'M', height: '6\'0"', eyeColor: 'Green', role: 'primary' },
      { name: 'Elena Webb', dob: '1989-11-03', pob: 'New York, New York', country: 'United States', gender: 'F', role: 'spouse' },
      { name: 'Olivia Webb', dob: '2019-08-21', pob: 'Boston, Massachusetts', country: 'United States', gender: 'F', role: 'child', note: 'Under 14 — parent/guardian signature required' },
    ],
    state: 'submitted_for_review',
    assignedCm: 'victoria',
    speed: 2,
    personal: {
      fullName: 'Marcus Webb', dob: '1987-06-12', pob: 'Boston, Massachusetts', country: 'United States',
      gender: 'M', height: '6\'0"', eyeColor: 'Green', email: 'marcus.webb@email.com', phone: '(617) 555-0234',
      address: '45 Beacon Street, Apt 7, Boston, MA 02108, US',
    },
    chain: 'All three → Robert Webb (Marcus\'s father, born Vancouver, BC, 1958-03-15) → Anchor',
    chainShort: 'Webb Family → Robert Webb (Vancouver) → Anchor',
    parents: {
      canadian: {
        fullName: 'Robert Webb', dob: '1958-03-15', pob: 'Vancouver, British Columbia', country: 'Canada',
        regNumber: '1958-034-011276', howBecameCitizen: 'Born in Canada', relationship: 'Biological parent',
        marriageDate: 'June 3, 1985', marriagePlace: 'Boston, MA', marriedTo: 'Susan Chen',
      },
      nonCanadian: {
        fullName: 'Susan Chen Webb', dob: '1960-09-18', country: 'United States',
        citizenshipStatus: 'Not a Canadian citizen', relationship: 'Biological parent',
      },
    },
    documents: [
      doc('Marcus — Birth certificate', 'birth_cert', 'verified', { name: 'Marcus Webb', dob: '1987-06-12', pob: 'Boston, MA' }, 'applicant_marcus'),
      doc('Marcus — Driver\'s license', 'drivers_license', 'verified', { name: 'Marcus Webb', dob: '1987-06-12' }, 'applicant_marcus'),
      doc('Marcus — US Passport', 'passport', 'verified', { name: 'Marcus Webb', dob: '1987-06-12' }, 'applicant_marcus'),
      doc('Elena — Birth certificate', 'birth_cert', 'verified', { name: 'Elena Webb', dob: '1989-11-03', pob: 'New York, NY' }, 'applicant_elena'),
      doc('Elena — Driver\'s license', 'drivers_license', 'verified', { name: 'Elena Webb', dob: '1989-11-03' }, 'applicant_elena'),
      doc('Elena — US Passport', 'passport', 'verified', { name: 'Elena Webb', dob: '1989-11-03' }, 'applicant_elena'),
      doc('Olivia — Birth certificate', 'birth_cert', 'flagged', { name: 'Olivia Webb', dob: '2019-08-21', pob: 'Boston, MA' }, 'applicant_olivia', true),
      doc('Olivia — Health insurance card', 'id_card', 'verified', { name: 'Olivia Webb', dob: '2019-08-21' }, 'applicant_olivia'),
      doc('Robert\'s Canadian birth certificate', 'birth_cert', 'verified', { name: 'Robert Webb', dob: '1958-03-15', pob: 'Vancouver, BC', regNumber: '1958-034-011276' }, 'canadian_parent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', { party1: 'Robert Webb', party2: 'Susan Chen', date: 'Jun 3, 1985', place: 'Boston, MA' }, 'shared'),
    ],
    flags: [{
      id: 'webb-bw-flag',
      title: 'Birth certificate quality — grayscale bypass used',
      applicant: 'Olivia Webb',
      severity: 'warning',
      requiresAttorney: false,
      description: 'Olivia Webb\'s birth certificate was uploaded in black and white. IRCC requires color copies. The quality bypass was used, but the CM must decide whether the document is legible enough or if a color re-upload is needed.',
      documentRef: 'Olivia — Birth certificate',
      suggestedTemplate: 'doc_bw',
    }],
    checklist: { passed: 32, total: 33 },
    aiBrief: 'Webb Family (3 applicants) — Marcus, Elena, and Olivia — are claiming citizenship through Marcus\'s father, Robert Webb, born in Vancouver, BC. 1 system flag needs your review: Olivia\'s birth certificate was uploaded in black and white (quality bypass used). Marcus and Elena\'s documents are clean. All other automated checks passed. Review the flag below, then approve or flag the client.',
    queueSummary: 'Family file — 1 flag on Olivia\'s birth cert (B&W). Marcus and Elena clean.',
    priorityBar: 'green',
    timeInState: '3h',
    priorityScore: 15 + 3,
    fileOpened: '2026-03-08',
    submittedForReview: '2026-03-24T08:30:00',
    timesReviewed: 0,
    comms: [],
    stateEnteredAt: '2026-03-24T08:30:00',
  },

  // 3. James Thornton — Re-review
  {
    id: 'james-thornton',
    name: 'James Gerald Thornton',
    displayName: 'James Thornton',
    type: 'single',
    state: 'client_resubmitted',
    assignedCm: 'victoria',
    speed: 2,
    personal: {
      fullName: 'James Gerald Thornton', dob: '1978-05-22', pob: 'Frankfurt, Germany', country: 'Germany',
      gender: 'M', height: '5\'11"', eyeColor: 'Blue', email: 'james.thornton@email.com', phone: '(312) 555-0891',
      address: '2200 N Lincoln Ave, Unit 3C, Chicago, IL 60614, US',
    },
    chain: 'James → Gerald Thornton (father, born Halifax, Nova Scotia, 1950-11-08) → Anchor',
    chainShort: 'James → Gerald Thornton (Halifax) → Anchor',
    parents: {
      canadian: {
        fullName: 'Gerald Thornton', dob: '1950-11-08', pob: 'Halifax, Nova Scotia', country: 'Canada',
        regNumber: '1950-045-018832', howBecameCitizen: 'Born in Canada', relationship: 'Biological parent',
        marriageDate: 'August 20, 1976', marriagePlace: 'Chicago, IL', marriedTo: 'Margaret Schneider',
      },
      nonCanadian: {
        fullName: 'Margaret Schneider Thornton', dob: '1952-07-14', country: 'Germany',
        citizenshipStatus: 'Not a Canadian citizen', relationship: 'Biological parent',
      },
    },
    documents: [
      doc('Birth certificate (German)', 'birth_cert', 'verified', { name: 'James Gerald Thornton', dob: '1978-05-22', pob: 'Frankfurt, Germany' }, 'applicant'),
      doc('Certified English translation', 'translation', 'verified', { note: 'Translator affidavit included' }, 'applicant'),
      doc('Driver\'s license', 'drivers_license', 'verified', { name: 'James Gerald Thornton', dob: '1978-05-22' }, 'applicant'),
      doc('US Passport', 'passport', 'verified', { name: 'James Gerald Thornton', dob: '1978-05-22' }, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', { name: 'Gerald Thornton', dob: '1950-11-08', pob: 'Halifax, Nova Scotia', regNumber: '1950-045-018832' }, 'canadian_parent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', { party1: 'Gerald Thornton', party2: 'Margaret Schneider', date: 'Aug 20, 1976', place: 'Chicago, IL' }, 'shared'),
    ],
    flags: [],
    previousFlags: [
      { id: 'thornton-reg', title: 'Registration number verification', status: 'resolved', resolution: 'Client confirmed and corrected to registration number 1950-045-018832.' },
      { id: 'thornton-translation', title: 'Missing translation — German birth certificate', status: 'resolved', resolution: 'Client uploaded certified English translation with affidavit.' },
    ],
    checklist: { passed: 30, total: 30 },
    aiBrief: 'James Thornton has resubmitted after resolving 2 flagged items. (1) Registration number: client confirmed and corrected to registration number 1950-045-018832. (2) Missing translation: client uploaded certified English translation with affidavit. No new system flags detected. Verify the fixes and approve, or re-flag if issues remain.',
    queueSummary: 'Re-submitted — reg number corrected, translation uploaded. Verify fixes.',
    priorityBar: 'amber',
    timeInState: '18h',
    priorityScore: 30 + 18,
    fileOpened: '2026-03-05',
    submittedForReview: '2026-03-23T16:00:00',
    timesReviewed: 1,
    comms: [
      { id: 'c1', from: 'Victoria Rukaite', type: 'outbound', date: '2026-03-16T11:00:00', text: 'Hi James, I\'ve reviewed your file and found two items that need attention: 1. The registration number on your father\'s birth certificate appears to be the certificate number instead. Could you double-check? 2. Your German birth certificate needs a certified English translation with an affidavit from the translator. Please update and resubmit when ready.' },
      { id: 'c2', from: 'James Thornton', type: 'inbound', date: '2026-03-22T15:30:00', text: 'Hi Victoria, you were right about the registration number — I confirmed with the Nova Scotia vital statistics office and corrected it. I\'ve also uploaded the certified translation. Let me know if anything else is needed!' },
    ],
    stateEnteredAt: '2026-03-23T16:00:00',
  },

  // 4. Aisha Patel — Eligibility hold
  {
    id: 'aisha-patel',
    name: 'Aisha Patel',
    type: 'single',
    state: 'eligibility_hold',
    assignedCm: 'victoria',
    speed: 3,
    personal: {
      fullName: 'Aisha Patel', dob: '1995-09-14', pob: 'London, United Kingdom', country: 'United Kingdom',
      email: 'aisha.patel@email.com', phone: '+44 20 7946 0958',
      address: '42 Camden High Street, London NW1 0JH, UK',
    },
    chain: 'Aisha → Nadia Patel (mother, born Montreal, Quebec — adoptive parent) → Anchor',
    chainShort: 'Aisha → Nadia Patel (Montreal) → Anchor',
    parents: { canadian: { fullName: 'Nadia Patel', pob: 'Montreal, Quebec', country: 'Canada', relationship: 'Adoptive parent' } },
    documents: [],
    flags: [{
      id: 'patel-adoption',
      title: 'Eligibility concern — adoption confirmed',
      severity: 'critical',
      requiresAttorney: true,
      description: 'Client confirmed during intake that she was adopted by her Canadian parent. Adopted persons cannot use CIT-0001 for initial citizenship applications. Alternative process (Section 5.1 direct grant) is required. Requires attorney review.',
    }],
    checklist: { passed: 29, total: 30 },
    aiBrief: 'Aisha Patel was flagged during intake for an eligibility concern: she confirmed that she was adopted by her Canadian parent. Adopted persons cannot use CIT-0001 for initial citizenship applications — a different process (Section 5.1 direct grant) is required. This requires attorney review before the client can proceed.',
    queueSummary: 'Eligibility hold — client confirmed adoption. Escalate to attorney.',
    priorityBar: 'amber',
    timeInState: '1.5d',
    priorityScore: 20 + 36,
    fileOpened: '2026-03-22',
    stateEnteredAt: '2026-03-22T23:00:00',
    comms: [],
  },

  // 5. Roberto Silva — Pre-1947 edge case
  {
    id: 'roberto-silva',
    name: 'Roberto Miguel Silva',
    displayName: 'Roberto Silva',
    type: 'single',
    state: 'submitted_for_review',
    assignedCm: 'victoria',
    speed: 3,
    personal: {
      fullName: 'Roberto Miguel Silva', dob: '1990-02-28', pob: 'Buenos Aires, Argentina', country: 'Argentina',
      gender: 'M', height: '5\'10"', eyeColor: 'Brown', email: 'roberto.silva@email.com', phone: '+54 11 4567-8901',
      address: 'Av. Corrientes 1234, Buenos Aires, Argentina',
    },
    chain: 'Roberto → Lucia Silva (mother, born Buenos Aires) → Eduardo Silva (grandfather, born Toronto, 1938) → Anchor',
    chainShort: 'Roberto → Lucia Silva (Buenos Aires) → Eduardo Silva (Toronto, 1938) → Anchor',
    is2ndGen: true,
    parents: {
      canadian: {
        fullName: 'Lucia Maria Silva', dob: '1962-06-15', pob: 'Buenos Aires, Argentina', country: 'Argentina',
        howBecameCitizen: 'Canadian by descent (through Eduardo)', relationship: 'Biological parent',
      },
      nonCanadian: {
        fullName: 'Miguel Silva', dob: '1960-01-22', country: 'Argentina',
        citizenshipStatus: 'Not a Canadian citizen', relationship: 'Biological parent',
      },
    },
    grandparent: {
      fullName: 'Eduardo Silva', dob: '1938-03-15', pob: 'Toronto, Ontario', country: 'Canada',
      regNumber: '1938-022-005431', deathDate: '2001-08-22',
    },
    documents: [
      doc('Birth certificate (Argentine)', 'birth_cert', 'verified', { name: 'Roberto Miguel Silva', dob: '1990-02-28', pob: 'Buenos Aires, Argentina' }, 'applicant'),
      doc('Argentine passport', 'passport', 'verified', { name: 'Roberto Miguel Silva', dob: '1990-02-28' }, 'applicant'),
      doc('Mother\'s birth certificate (Argentine)', 'birth_cert', 'verified', { name: 'Lucia Maria Silva', dob: '1962-06-15', fatherName: 'Eduardo Silva' }, 'canadian_parent'),
      doc('Grandfather\'s Canadian birth certificate', 'birth_cert', 'verified', { name: 'Eduardo Silva', dob: '1938-03-15', pob: 'Toronto, Ontario', regNumber: '1938-022-005431' }, 'grandparent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', { party1: 'Lucia Maria Silva', party2: 'Miguel Silva' }, 'shared'),
      doc('Grandparents\' marriage certificate', 'marriage_cert', 'verified', { party1: 'Eduardo Silva' }, 'grandparent'),
      doc('Eduardo\'s death certificate', 'death_cert', 'verified', { name: 'Eduardo Silva', date: '2001-08-22' }, 'grandparent'),
    ],
    flags: [{
      id: 'silva-pre1947',
      title: 'Pre-1947 ancestor — historical citizenship analysis required',
      severity: 'warning',
      requiresAttorney: true,
      description: 'Chain includes Eduardo Silva, born in Toronto in 1938, before the 1947 Citizenship Act. Pre-1947 British subject provisions may apply. Historical citizenship analysis by attorney is required before proceeding.',
      documentRef: 'Grandfather\'s Canadian birth certificate',
    }],
    checklist: { passed: 29, total: 30 },
    aiBrief: 'Roberto Silva is a single applicant claiming citizenship through his mother, Lucia Silva, who was born in Argentina to a Canadian father. The chain passes through Roberto\'s grandfather, Eduardo Silva, born in Toronto in 1938 — before the 1947 Citizenship Act. The system has flagged this for attorney review: pre-1947 British subject provisions may apply. Escalate to an attorney before proceeding.',
    queueSummary: '1 system flag — pre-1947 ancestor detected. Needs attorney escalation.',
    priorityBar: 'amber',
    timeInState: '2d',
    priorityScore: 15 + 48,
    fileOpened: '2026-03-15',
    submittedForReview: '2026-03-22T11:00:00',
    stateEnteredAt: '2026-03-22T11:00:00',
    comms: [],
  },

  // 6. Sophie Laurent — Changes requested (not in queue)
  {
    id: 'sophie-laurent',
    name: 'Sophie Laurent',
    type: 'single',
    state: 'changes_requested',
    assignedCm: 'victoria',
    personal: {
      fullName: 'Sophie Laurent', dob: '1988-07-19', pob: 'Paris, France', country: 'France',
      email: 'sophie.laurent@email.com', phone: '+33 1 42 68 5300',
      address: '15 Rue de Rivoli, 75001 Paris, France',
    },
    chain: 'Sophie → Catherine Laurent (mother, born Ottawa, Ontario) → Anchor',
    chainShort: 'Sophie → Catherine Laurent (Ottawa) → Anchor',
    documents: [
      doc('Birth certificate (French)', 'birth_cert', 'verified', {}, 'applicant'),
      doc('French passport', 'passport', 'flagged', { note: 'Expired' }, 'applicant', true),
      doc('French driver\'s license', 'drivers_license', 'verified', {}, 'applicant'),
      doc('Mother\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', {}, 'shared'),
    ],
    sentFlags: [
      { title: 'Expired passport', description: 'Sophie\'s passport expired 2 months ago. Need a valid ID.' },
      { title: 'Missing translation', description: 'French birth certificate needs certified English translation.' },
    ],
    comms: [
      { id: 'sl1', from: 'Victoria Rukaite', type: 'outbound', date: '2026-03-20T14:00:00', text: 'Hi Sophie, I\'ve reviewed your file and found two items: 1. Your passport appears to have expired. Could you upload a current valid ID? 2. Your French birth certificate needs a certified English translation. Please update and resubmit when ready.' },
    ],
    fileOpened: '2026-03-12',
    stateEnteredAt: '2026-03-21T00:00:00',
    timeInState: '3d',
    checklist: { passed: 28, total: 30 },
  },

  // 7. Daniel Kowalski — Dormant
  {
    id: 'daniel-kowalski',
    name: 'Daniel Kowalski',
    type: 'single',
    state: 'awaiting_documents',
    assignedCm: 'victoria',
    isDormant: true,
    dormantDays: 18,
    dormantTrigger: 'dormant_14',
    personal: {
      fullName: 'Daniel Kowalski', dob: '1985-04-10', pob: 'Detroit, Michigan', country: 'United States',
      email: 'daniel.kowalski@email.com', phone: '(313) 555-7721',
      address: '1500 Woodward Ave, Apt 12, Detroit, MI 48226, US',
    },
    chain: 'Daniel → Anna Kowalski (mother, born Winnipeg, Manitoba) → Anchor',
    chainShort: 'Daniel → Anna Kowalski (Winnipeg) → Anchor',
    documents: [
      doc('Birth certificate', 'birth_cert', 'verified', { name: 'Daniel Kowalski', dob: '1985-04-10', pob: 'Detroit, MI' }, 'applicant'),
      doc('Driver\'s license', 'drivers_license', 'verified', { name: 'Daniel Kowalski', dob: '1985-04-10' }, 'applicant'),
    ],
    missingDocs: ['Mother\'s birth certificate', 'Second photo ID'],
    aiBrief: 'Daniel Kowalski has been inactive for 18 days. He is currently in the document gathering stage — still waiting on: mother\'s birth certificate and a second piece of photo ID. Send a check-in message.',
    checklist: { passed: 12, total: 30 },
    queueSummary: 'Dormant 18 days — send check-in. Client stalled during document gathering.',
    priorityBar: 'green',
    timeInState: '18d',
    priorityScore: 3 + 18,
    fileOpened: '2026-03-01',
    stateEnteredAt: '2026-03-06T00:00:00',
    comms: [],
    quickAction: { label: 'Send →', type: 'dormant_followup' },
    preDraftedMessage: 'Hi Daniel, just checking in — we noticed your application is still waiting on a couple of documents (mother\'s birth certificate and a second piece of photo ID). Is there anything we can help with to move things forward?',
  },

  // 8. Yuki Tanaka — Forms received
  {
    id: 'yuki-tanaka',
    name: 'Yuki Tanaka',
    type: 'single',
    state: 'forms_received',
    assignedCm: 'victoria',
    personal: {
      fullName: 'Yuki Tanaka', dob: '1991-07-29', pob: 'Seattle, Washington', country: 'United States',
      email: 'yuki.tanaka@email.com', phone: '(206) 555-3344',
      address: '820 Pine Street, Apt 5A, Seattle, WA 98101, US',
    },
    chain: 'Yuki → Kenji Tanaka (father, born Victoria, British Columbia) → Anchor',
    chainShort: 'Yuki → Kenji Tanaka (Victoria, BC) → Anchor',
    parents: {
      canadian: {
        fullName: 'Kenji Tanaka', dob: '1962-08-03', pob: 'Victoria, British Columbia', country: 'Canada',
        howBecameCitizen: 'Born in Canada', relationship: 'Biological parent',
      },
    },
    documents: [
      doc('Birth certificate', 'birth_cert', 'verified', { name: 'Yuki Tanaka', dob: '1991-07-29', pob: 'Seattle, WA' }, 'applicant'),
      doc('Driver\'s license', 'drivers_license', 'verified', { name: 'Yuki Tanaka' }, 'applicant'),
      doc('US Passport', 'passport', 'verified', { name: 'Yuki Tanaka' }, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', { name: 'Kenji Tanaka', dob: '1962-08-03', pob: 'Victoria, BC' }, 'canadian_parent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', {}, 'shared'),
      doc('Scanned signed forms (CIT-0001 + IMM 5476)', 'signed_forms', 'pending_verification', {}, 'forms'),
    ],
    aiBrief: 'Signed forms for Yuki Tanaka were received at the office on March 23, 2026 and scanned by Sarah Park. Verify the signatures and package completeness using the checklist below, then submit to IRCC.',
    checklist: { passed: 30, total: 30 },
    queueSummary: 'Signed forms received. Verify signatures and package completeness.',
    priorityBar: 'green',
    timeInState: '1h',
    priorityScore: 10 + 1,
    fileOpened: '2026-02-20',
    stateEnteredAt: '2026-03-24T10:00:00',
    comms: [],
  },

  // 9. Maria Gonzalez — AOR received
  {
    id: 'maria-gonzalez',
    name: 'Maria Gonzalez',
    type: 'single',
    state: 'aor_received',
    assignedCm: 'victoria',
    personal: {
      fullName: 'Maria Gonzalez', dob: '1993-11-05', pob: 'Phoenix, Arizona', country: 'United States',
      email: 'maria.gonzalez@email.com', phone: '(602) 555-8890',
      address: '3200 N Central Ave, Phoenix, AZ 85012, US',
    },
    chain: 'Maria → Carlos Gonzalez (father, born Calgary, Alberta) → Anchor',
    chainShort: 'Maria → Carlos Gonzalez (Calgary) → Anchor',
    documents: [
      doc('Birth certificate', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Driver\'s license', 'drivers_license', 'verified', {}, 'applicant'),
      doc('US Passport', 'passport', 'verified', {}, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
    ],
    aiBrief: 'IRCC has acknowledged receipt of Maria Gonzalez\'s application. AOR dated March 20, 2026. Notify the client. Based on current processing times, we expect a decision by approximately February 2027.',
    checklist: { passed: 30, total: 30 },
    queueSummary: 'AOR received — notify client.',
    priorityBar: 'blue',
    timeInState: '3h',
    priorityScore: 5 + 3,
    aorDate: '2026-03-20',
    expectedDecision: 'February 2027',
    fileOpened: '2026-01-15',
    stateEnteredAt: '2026-03-24T08:00:00',
    comms: [],
    quickAction: { label: 'Notify →', type: 'aor_notify' },
    preDraftedMessage: 'Great news — we\'ve received confirmation that IRCC has received your application. Based on current processing times, we expect a decision by approximately February 2027. We\'ll keep you updated.',
  },

  // 10. Thomas Müller — Government processing (passive)
  {
    id: 'thomas-muller',
    name: 'Thomas Müller',
    type: 'single',
    state: 'government_processing',
    assignedCm: 'victoria',
    personal: {
      fullName: 'Thomas Müller', dob: '1979-12-03', pob: 'Munich, Germany', country: 'Germany',
      email: 'thomas.muller@email.com', phone: '+49 89 1234 5678',
      address: 'Maximilianstrasse 22, 80539 Munich, Germany',
    },
    chain: 'Thomas → Ingrid Müller (mother, born Montreal, Quebec) → Anchor',
    chainShort: 'Thomas → Ingrid Müller (Montreal) → Anchor',
    documents: [
      doc('Birth certificate (German)', 'birth_cert', 'verified', {}, 'applicant'),
      doc('German passport', 'passport', 'verified', {}, 'applicant'),
      doc('German ID card', 'id_card', 'verified', {}, 'applicant'),
      doc('Mother\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', {}, 'shared'),
    ],
    fileOpened: '2025-09-10',
    stateEnteredAt: '2025-11-23T00:00:00',
    timeInState: '121d',
    checklist: { passed: 30, total: 30 },
    comms: [],
  },

  // 11. Clara Dupont — Government questions
  {
    id: 'clara-dupont',
    name: 'Clara Marie Dupont',
    displayName: 'Clara Dupont',
    type: 'single',
    state: 'government_questions',
    assignedCm: 'victoria',
    speed: 3,
    is2ndGen: true,
    personal: {
      fullName: 'Clara Marie Dupont', dob: '1994-06-18', pob: 'Brussels, Belgium', country: 'Belgium',
      email: 'clara.dupont@email.com', phone: '+32 2 555 1234',
      address: '48 Avenue Louise, 1050 Brussels, Belgium',
    },
    chain: 'Clara → Marie Dupont (mother, born Brussels) → Jean-Pierre Dupont (grandfather, born Montreal, 1940) → Anchor',
    chainShort: 'Clara → Marie Dupont (Brussels) → Jean-Pierre Dupont (Montreal) → Anchor',
    grandparent: {
      fullName: 'Jean-Pierre Dupont', dob: '1940-03-07', pob: 'Montreal, Quebec', country: 'Canada',
    },
    documents: [
      doc('Birth certificate (Belgian)', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Belgian passport', 'passport', 'verified', {}, 'applicant'),
      doc('Belgian ID card', 'id_card', 'verified', {}, 'applicant'),
      doc('Mother\'s birth certificate (Belgian)', 'birth_cert', 'verified', {}, 'canadian_parent'),
      doc('Grandfather\'s Canadian birth certificate', 'birth_cert', 'verified', { name: 'Jean-Pierre Dupont', pob: 'Montreal, Quebec' }, 'grandparent'),
      doc('Parents\' marriage certificate', 'marriage_cert', 'verified', {}, 'shared'),
    ],
    flags: [{
      id: 'dupont-gov-q',
      title: 'IRCC question — additional chain documentation requested',
      severity: 'warning',
      requiresAttorney: true,
      description: 'IRCC has requested additional documentation to verify the chain of descent through Clara\'s grandmother. Attorney involvement needed to draft response.',
    }],
    aiBrief: 'IRCC has raised a question about Clara Dupont\'s application, requesting additional documentation to verify the chain of descent through her grandmother. This requires attorney involvement to draft a response. Escalate with the government correspondence attached.',
    checklist: { passed: 29, total: 30 },
    queueSummary: 'IRCC question about chain documentation. Escalate to attorney.',
    priorityBar: 'amber',
    timeInState: '1d',
    priorityScore: 15 + 24,
    fileOpened: '2025-10-20',
    stateEnteredAt: '2026-03-23T00:00:00',
    comms: [],
  },

  // 12. William Chang — Government approved
  {
    id: 'william-chang',
    name: 'William Chang',
    type: 'single',
    state: 'application_approved_gov',
    assignedCm: 'victoria',
    personal: {
      fullName: 'William Chang', dob: '1986-09-25', pob: 'San Francisco, California', country: 'United States',
      email: 'william.chang@email.com', phone: '(415) 555-6677',
      address: '1200 Market Street, Apt 8B, San Francisco, CA 94102, US',
    },
    chain: 'William → David Chang Sr. (father, born Toronto, Ontario) → Anchor',
    chainShort: 'William → David Chang Sr. (Toronto) → Anchor',
    documents: [
      doc('Birth certificate', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Driver\'s license', 'drivers_license', 'verified', {}, 'applicant'),
      doc('US Passport', 'passport', 'verified', {}, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
    ],
    aiBrief: 'Great news — IRCC has approved William Chang\'s citizenship application. The citizenship certificate will be issued by mail. Notify the client and congratulate them. This is also a good opportunity to offer Canadian passport services.',
    checklist: { passed: 30, total: 30 },
    queueSummary: 'Application approved by IRCC — notify client and offer passport services.',
    priorityBar: 'blue',
    timeInState: '3.5h',
    priorityScore: 5 + 3,
    fileOpened: '2025-08-15',
    stateEnteredAt: '2026-03-24T07:30:00',
    comms: [],
    quickAction: { label: 'Notify →', type: 'gov_approved_notify' },
    preDraftedMessage: 'Congratulations! Your Canadian citizenship has been officially confirmed by IRCC. Your citizenship certificate will be issued shortly. You\'re now eligible to apply for a Canadian passport — would you like us to help with that?',
  },

  // 13. Anna Petrova — Approved (passive)
  {
    id: 'anna-petrova',
    name: 'Anna Petrova',
    type: 'single',
    state: 'approved',
    assignedCm: 'victoria',
    personal: {
      fullName: 'Anna Petrova', dob: '1991-03-28', pob: 'Moscow, Russia', country: 'Russia',
      email: 'anna.petrova@email.com', phone: '+7 495 555 1234',
      address: '25 Tverskaya Street, Moscow 125009, Russia',
    },
    chain: 'Anna → Viktor Petrov (father, born Edmonton, Alberta) → Anchor',
    chainShort: 'Anna → Viktor Petrov (Edmonton) → Anchor',
    documents: [
      doc('Birth certificate (Russian)', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Russian passport', 'passport', 'verified', {}, 'applicant'),
      doc('Russian national ID', 'id_card', 'verified', {}, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
    ],
    fileOpened: '2026-02-01',
    stateEnteredAt: '2026-03-19T00:00:00',
    timeInState: '5d',
    checklist: { passed: 30, total: 30 },
    comms: [],
  },

  // 14. Liam O'Brien — Submitted to IRCC
  {
    id: 'liam-obrien',
    name: "Liam O'Brien",
    type: 'single',
    state: 'submitted_to_ircc',
    assignedCm: 'victoria',
    personal: {
      fullName: "Liam O'Brien", dob: '1990-01-15', pob: 'Dublin, Ireland', country: 'Ireland',
      email: 'liam.obrien@email.com', phone: '+353 1 555 7890',
      address: '18 Grafton Street, Dublin 2, Ireland',
    },
    chain: "Liam → Siobhan O'Brien (mother, born Vancouver, BC) → Anchor",
    chainShort: "Liam → Siobhan O'Brien (Vancouver) → Anchor",
    documents: [
      doc('Birth certificate (Irish)', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Irish passport', 'passport', 'verified', {}, 'applicant'),
      doc('Irish driver\'s license', 'drivers_license', 'verified', {}, 'applicant'),
      doc('Mother\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
    ],
    fileOpened: '2026-01-20',
    stateEnteredAt: '2026-03-17T00:00:00',
    timeInState: '7d',
    checklist: { passed: 30, total: 30 },
    comms: [],
  },

  // 15. Priya Sharma — Closed
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    type: 'single',
    state: 'closed',
    assignedCm: 'victoria',
    personal: {
      fullName: 'Priya Sharma', dob: '1987-08-12', pob: 'New Delhi, India', country: 'India',
      email: 'priya.sharma@email.com', phone: '+91 11 5555 6789',
      address: 'A-12 Vasant Kunj, New Delhi 110070, India',
    },
    chain: 'Priya → Raj Sharma (father, born Toronto, Ontario) → Anchor',
    chainShort: 'Priya → Raj Sharma (Toronto) → Anchor',
    documents: [
      doc('Birth certificate (Indian)', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Indian passport', 'passport', 'verified', {}, 'applicant'),
      doc('Aadhaar card', 'id_card', 'verified', {}, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
    ],
    fileOpened: '2025-12-01',
    stateEnteredAt: '2026-03-10T00:00:00',
    checklist: { passed: 30, total: 30 },
    comms: [],
  },

  // 16. Jennifer Adams — David Chen's clean file
  {
    id: 'jennifer-adams',
    name: 'Jennifer Adams',
    type: 'single',
    state: 'submitted_for_review',
    assignedCm: 'david',
    speed: 1,
    personal: {
      fullName: 'Jennifer Adams', dob: '1993-05-17', pob: 'Portland, Oregon', country: 'United States',
      email: 'jennifer.adams@email.com', phone: '(503) 555-2233',
      address: '900 SW Washington St, Portland, OR 97205, US',
    },
    chain: 'Jennifer → Michael Adams (father, born Ottawa, Ontario) → Anchor',
    chainShort: 'Jennifer → Michael Adams (Ottawa) → Anchor',
    documents: [
      doc('Birth certificate', 'birth_cert', 'verified', {}, 'applicant'),
      doc('Driver\'s license', 'drivers_license', 'verified', {}, 'applicant'),
      doc('US Passport', 'passport', 'verified', {}, 'applicant'),
      doc('Father\'s Canadian birth certificate', 'birth_cert', 'verified', {}, 'canadian_parent'),
    ],
    fileOpened: '2026-03-18',
    stateEnteredAt: '2026-03-23T00:00:00',
    checklist: { passed: 30, total: 30 },
    comms: [],
  },

  // 17. Carlos Rivera — David Chen's gov processing
  {
    id: 'carlos-rivera',
    name: 'Carlos Rivera',
    type: 'single',
    state: 'government_processing',
    assignedCm: 'david',
    personal: {
      fullName: 'Carlos Rivera', dob: '1982-12-08', pob: 'Mexico City, Mexico', country: 'Mexico',
    },
    chain: 'Carlos → Patricia Rivera (mother, born Toronto, Ontario) → Anchor',
    chainShort: 'Carlos → Patricia Rivera (Toronto) → Anchor',
    documents: [],
    fileOpened: '2025-10-01',
    stateEnteredAt: '2025-12-24T00:00:00',
    timeInState: '90d',
    checklist: { passed: 30, total: 30 },
    comms: [],
  },

  // 18. Emma Watson — David Chen's overdue
  {
    id: 'emma-watson',
    name: 'Emma Watson',
    type: 'single',
    state: 'changes_requested',
    assignedCm: 'david',
    isOverdue: true,
    overdueDays: 3,
    personal: {
      fullName: 'Emma Watson', dob: '1996-03-22', pob: 'London, United Kingdom', country: 'United Kingdom',
    },
    chain: 'Emma → Robert Watson (father, born Montreal, Quebec) → Anchor',
    chainShort: 'Emma → Robert Watson (Montreal) → Anchor',
    documents: [],
    fileOpened: '2026-02-15',
    stateEnteredAt: '2026-03-19T00:00:00',
    timeInState: '5d',
    checklist: { passed: 27, total: 30 },
    comms: [],
  },
];

// ─── VICTORIA'S QUEUE (pre-sorted by priority) ───
export const VICTORIA_QUEUE_ORDER = [
  'james-thornton',      // 1. Re-submitted (amber) 48
  'roberto-silva',       // 2. Ready for Review (amber) 63
  'aisha-patel',         // 3. Eligibility Hold (amber) 56
  'webb-family',         // 4. Ready for Review (green) 18
  'iliana-vasquez',      // 5. Ready for Review (green) 17
  'clara-dupont',        // 6. Gov Questions (amber) 39
  'yuki-tanaka',         // 7. Forms Received (green) 11
  'maria-gonzalez',      // 8. AOR Received (blue) 8
  'william-chang',       // 9. Gov Approved (blue) 8
  'daniel-kowalski',     // 10. Follow-up Due (green) 21
];

// ─── COCKPIT STARTING VALUES ───
export const COCKPIT_DEFAULTS = {
  victoria: { reviewedToday: 7, streak: 4, target: 20 },
  tereza: { reviewedToday: 11, streak: 4, target: 20 },
};

// ─── TEAM METRICS ───
export const TEAM_METRICS = {
  victoria: {
    files: 15, queueDepth: 9, overdue: 0, reviewedToday: 7, target: 20,
    avgReviewTime: '3.2m', slaCompliance: 98, flagRate: 22, reReviewRate: 8,
  },
  david: {
    files: 3, queueDepth: 1, overdue: 1, reviewedToday: 5, target: 20,
    avgReviewTime: '5.1m', slaCompliance: 91, flagRate: 35, reReviewRate: 15,
  },
};

export const TEAM_AGGREGATES = { totalFiles: 18, queueItems: 10, overdue: 1, dailyRate: 6 };

// ─── FLAG TEMPLATES ───
export const FLAG_TEMPLATES = {
  doc_illegible:    { title: 'Document illegible', severity: 'correction', instructions: 'Part of your [document] is difficult to read. Could you upload a clearer scan or photo?' },
  doc_bw:           { title: 'Document — black & white', severity: 'correction', instructions: 'Your [document] appears to be in black and white. IRCC requires color copies. Could you upload a color version?' },
  reg_number:       { title: 'Registration number verification', severity: 'clarification', instructions: 'We need to confirm the registration number on [parent]\'s birth certificate. Could you double-check?' },
  name_change_doc:  { title: 'Missing name change documentation', severity: 'correction', instructions: '[Person]\'s name appears differently across documents. Please upload a name change document.' },
  translation:      { title: 'Missing translation', severity: 'correction', instructions: 'Your [document] appears to be in [language]. IRCC requires a certified English or French translation.' },
  longform_bc:      { title: 'Long-form birth certificate needed', severity: 'correction', instructions: 'Your birth certificate doesn\'t include your parents\' names. Please obtain a long-form version.' },
  additional_id:    { title: 'Additional ID needed', severity: 'correction', instructions: 'One of your ID documents doesn\'t meet requirements. Please upload a different government-issued ID.' },
  quebec_replacement: { title: 'Quebec certificate replacement', severity: 'correction', instructions: 'Your [parent]\'s Quebec certificate was issued before 1994 and needs to be replaced.' },
  supplementary_docs: { title: 'Supplementary parentage docs', severity: 'correction', instructions: 'We need additional documentation to confirm your parents\' names.' },
  general:          { title: 'General correction', severity: null, instructions: 'Please review and correct the information in the [section name] section.' },
};

// ─── PRE-DRAFTED MESSAGES ───
export const PRE_DRAFTED_MESSAGES = {
  aor_notify: (name, date) => `Great news — we've received confirmation that IRCC has received your application. Based on current processing times, we expect a decision by approximately ${date}. We'll keep you updated.`,
  gov_approved: (name) => `Congratulations! Your Canadian citizenship has been officially confirmed by IRCC. Your citizenship certificate will be issued shortly. You're now eligible to apply for a Canadian passport — would you like us to help with that?`,
  dormant_14: (name) => `Hi ${name}, just checking in — we noticed your application is still in progress. Is there anything we can help with?`,
  dormant_30: (name, items) => `Hi ${name}, we wanted to follow up. We're still waiting on ${items} to move forward. If you need guidance, we're happy to help.`,
  dormant_60: (name) => `Hi ${name}, your application has been on hold for a while. Could you let us know if you're still planning to proceed?`,
};

// ─── ATTORNEY ESCALATION QUEUE ───
export const ATTORNEY_ESCALATIONS_DEFAULT = [
  { clientId: 'aisha-patel', sourceCm: 'victoria', severityBadge: 'Eligibility', badgeColor: 'red', reason: 'Adoption confirmed', escalatedDate: '2026-03-22', cmNote: null },
  { clientId: 'roberto-silva', sourceCm: 'victoria', severityBadge: 'Edge Case', badgeColor: 'amber', reason: 'Pre-1947 ancestor', escalatedDate: '2026-03-22', cmNote: null },
  { clientId: 'clara-dupont', sourceCm: 'victoria', severityBadge: 'Gov Question', badgeColor: 'amber', reason: 'IRCC documentation request', escalatedDate: '2026-03-23', cmNote: null },
];
