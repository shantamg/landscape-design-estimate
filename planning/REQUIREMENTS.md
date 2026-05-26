# Product Requirements Document
## Nancy Lyons Garden Design -- Estimate & Contract Tools

**Version:** 3.0
**Date:** February 25, 2026
**Author:** Product Manager
**Changelog:**
- v3.0: SCOPE CHANGE -- Split into two separate documents (Estimate + Contract). Estimate is now clean pricing only. All terms, warranty, payment schedule, exclusions, and signature moved to Contract.
- v2.0: Incorporated Nancy's direct feedback (see NANCY-FEEDBACK.md)
- v1.0: Initial requirements

---

## 1. Overview

We are building **two separate documents**, not one combined estimate/contract:

**Document 1: Estimate** (the main interactive tool)
A browser-based tool for creating professional, branded landscape estimates with line items, auto-calculations, and PDF export. This is a **clean pricing document** -- no terms, no warranty, no legal language, no signature block.

**Document 2: Contract** (a mostly-static template)
A separate document that references an Estimate by number and date, and contains all the contractual elements: payment schedule, terms & conditions, warranty, exclusions, change order process, and client signature/acceptance block.

Both are for **Nancy Lyons Garden Design** -- a single business, not a SaaS product.

### Why Two Documents

Separating estimate from contract:
- Keeps the estimate clean and focused on pricing -- easier for clients to scan and understand
- Allows Nancy to revise pricing without re-executing a contract
- Contract language stays stable across projects; estimates are unique every time
- Matches common industry practice where the estimate is an attachment to the contract

### Problem Statement

Nancy is a solo landscape designer in California. She currently creates estimates using spreadsheets or word processors, which is slow, error-prone, and produces inconsistent-looking documents. Existing landscape estimating software is either too expensive ($50-$500+/mo), too complex, or not tailored to a solo designer's workflow.

### Solution

A lightweight, self-contained web application for building estimates, paired with a fillable contract template. Both produce professional, branded PDFs.

### Workflow

1. Nancy visits a client site and takes notes (pen/paper or phone)
2. Back at her desk, she opens the estimate tool in her browser
3. She enters client info, selects/types plants and services, adjusts quantities and prices
4. The tool auto-calculates subtotals, tax on materials, and the grand total
5. She exports the estimate to PDF
6. She fills in the contract template referencing that estimate
7. She sends both PDFs to the client
8. The client signs the contract to accept
9. As the project evolves, Nancy creates revised estimate versions while preserving the original

---

## 2. User Personas

### Primary: Nancy Lyons -- Solo Landscape Designer

- **Role:** Owner/operator of Nancy Lyons Garden Design
- **Location:** California
- **Tech comfort:** Low to moderate. Uses email, basic web browsing, and simple apps. Not comfortable with complex software or technical setup.
- **Current tools:** Spreadsheets, word processor, pen and paper
- **Goals:**
  - Create professional-looking estimates quickly
  - Look credible and polished to clients
  - Avoid math errors on estimates
  - Reuse common plants and services without retyping
  - Revise estimates easily as projects evolve
  - Save and reuse estimates as templates for similar projects
  - Have a clean, professional contract separate from pricing
- **Frustrations:**
  - Formatting estimates takes too long
  - Easy to make calculation errors
  - Existing software is overkill and expensive
  - Estimates don't look as professional as her design work
  - Revisions are tedious and error-prone

### Secondary: Nancy's Clients (View-Only)

- **Role:** Homeowners receiving estimates and contracts as PDF
- **Interaction:** Receives PDFs via email or printed copies; signs contract to accept
- **Needs:** Clear, readable breakdown of costs; professional appearance; easy to understand what they're paying for; separate, clear contract terms

---

# DOCUMENT 1: ESTIMATE

## 3. Estimate User Stories

### Epic 1: Client Information

**US-1.1: Enter client details**
> As Nancy, I want to enter a client's name, address, and the estimate date, so that each estimate is properly addressed and dated.

Acceptance Criteria:
- Form fields for: client name, street address, city, state, zip
- Date field defaults to today, can be changed
- Fields persist while working on the estimate
- Client info appears in the correct location on the PDF output

**US-1.2: Enter project address**
> As Nancy, I want to optionally enter a project/site address if it differs from the client's address.

Acceptance Criteria:
- Optional "project address" fields appear when toggled
- If left empty, project address section is omitted from output

### Epic 2: Company Branding

**US-2.1: Display company logo and info**
> As Nancy, I want my company logo, name, and contact info to appear on every estimate, so the document looks professional.

Acceptance Criteria:
- Company logo displays prominently at the top of the estimate
- Logo style: botanical illustration of a California native plant
- Company name, phone, email, and CSLB license number are shown
- Branding is consistent across screen view and PDF output
- Logo and company info are pre-configured (hardcoded for this single business)

### Epic 3: Plant Material Section (FIRST content section)

**US-3.1: Add plant line items**
> As Nancy, I want to add plant material line items with plant name, container size, quantity, unit price, and line total, so I can detail the planting costs.

Acceptance Criteria:
- Section header labeled "Plant Material"
- Plant Material is the FIRST content section in the estimate (before Labor)
- Each row has: plant name, container size (dropdown or text), quantity (number), unit price (currency), and line total (auto-calculated: qty x unit price)
- Can add new rows dynamically
- Can remove any row
- Line total updates automatically when quantity or unit price changes

**US-3.2: Autocomplete plants from a pre-populated list**
> As Nancy, I want to search or select from a pre-populated list of common California landscape plants when adding a plant line item, so I can quickly find the right plant.

Acceptance Criteria:
- Typing in the plant name field shows matching suggestions from a plant catalog
- Catalog includes common California plants: natives, Mediterranean, shade, screening, trees, ground covers (per research)
- Both common name and botanical name are searchable
- Selecting a plant populates the name; container size and price are filled by Nancy
- Nancy can type a fully custom plant name if needed

**US-3.3: Auto-sum plant material subtotal**
> As Nancy, I want the plant material section to automatically sum all line totals into a subtotal.

Acceptance Criteria:
- Subtotal = sum of all (quantity x unit price) for each row
- Updates in real-time
- Displayed below the plant material section

### Epic 4: Labor & Services Section (SECOND content section)

**US-4.1: Add labor/service line items**
> As Nancy, I want to add flexible, free-form line items for labor and services, each with a description and price, so I can itemize the work for each unique project.

Acceptance Criteria:
- Section header labeled "Labor & Services"
- Labor section appears AFTER Plant Material
- Each row has: description (free-form text) and price (currency)
- Descriptions are fully flexible -- NOT tied to fixed categories. Each project is unique.
- Can add new rows dynamically (no fixed limit)
- Can remove any row

**US-4.2: Autocomplete services from a pre-populated list**
> As Nancy, I want to optionally search or select from a pre-populated list of common services, while always being able to type fully custom descriptions.

Acceptance Criteria:
- Typing in the description field shows matching suggestions from a service catalog
- Suggestions are optional helpers -- Nancy can always type any custom description
- Catalog includes common services: irrigation, hardscaping, grading, lighting, planting labor, pruning, etc.
- Selecting a suggestion populates the description (price left for Nancy to fill in, since labor prices vary per project)

**US-4.3: Auto-sum labor subtotal**
> As Nancy, I want the labor section to automatically sum all line item prices into a subtotal.

Acceptance Criteria:
- Subtotal updates in real-time as prices are entered or rows are added/removed
- Subtotal is clearly displayed below the labor section
- Subtotal is formatted as currency

### Epic 5: Other Materials Section (THIRD content section)

**US-5.1: Add other material line items**
> As Nancy, I want a separate section for non-plant materials (hardscape, soil amendments, irrigation supplies, etc.) with quantity, unit price, and line totals.

Acceptance Criteria:
- Section header labeled "Other Materials" (or similar)
- Appears AFTER Labor & Services
- Each row has: description (free-form text), quantity (number), unit price (currency), line total (auto-calculated)
- Can add new rows dynamically
- Can remove any row
- Auto-summing subtotal

### Epic 6: Design Fee Section (FOURTH content section -- separate)

**US-6.1: Design fee as a separate section**
> As Nancy, I want Design Fee listed as its own distinct section, separate from labor, because it represents a different type of charge.

Acceptance Criteria:
- Section header labeled "Design Fee"
- Appears AFTER Other Materials
- Each row has: description (free-form text) and price (currency)
- Can add multiple line items (e.g., "Design Development", "Planting Plan")
- Auto-summing subtotal

### Epic 7: Installation Supervision & Meetings Section (FIFTH content section -- separate)

**US-7.1: Installation supervision and meetings as a separate section**
> As Nancy, I want Installation Supervision & Meetings listed as its own section at $195/hour, separate from Design Fee.

Acceptance Criteria:
- Section header labeled "Installation Supervision & Meetings"
- Appears AFTER Design Fee
- Each row has: description (free-form text) and price (currency)
- Default rate of $195/hr can be pre-populated as a suggestion
- Can specify hours and calculate total (hours x rate), or enter a flat amount
- Auto-summing subtotal

### Epic 8: Project Sections (Front Yard / Back Yard)

**US-8.1: Multiple named sections within an estimate**
> As Nancy, I want to organize an estimate into multiple named sections (e.g., "Front Yard", "Back Yard", "Side Garden"), because different areas of a project have different scope.

Acceptance Criteria:
- Nancy can add named project sections/areas
- Each section contains its own set of Plant Material, Labor, Other Materials, Design Fee, and Installation Supervision sub-sections
- Each section has its own subtotals
- Grand total sums across all sections
- Sections can be added and removed
- Section names are editable free-form text

### Epic 9: Tax Calculation

**US-9.1: Sales tax on materials only**
> As Nancy, I want sales tax calculated automatically on materials only (not on labor or design fees), so the estimate is tax-accurate.

Acceptance Criteria:
- Tax is applied to Plant Material subtotal + Other Materials subtotal
- Tax is NOT applied to Labor & Services, Design Fee, or Installation Supervision subtotals
- Tax rate is configurable (default to local California rate)
- Tax amount is displayed as a separate line item before the grand total
- Grand total includes tax

### Epic 10: Grand Total

**US-10.1: Display grand total**
> As Nancy, I want to see a grand total that sums all section subtotals plus tax, so I can see the complete estimate amount at a glance.

Acceptance Criteria:
- Grand total = Plant Material + Labor + Other Materials + Design Fee + Installation Supervision + Tax
- If multiple project sections exist, grand total sums across all of them
- Displayed prominently at the bottom of the estimate
- Updates in real-time as any value changes
- Formatted as currency

### Epic 11: PDF Export & Print

**US-11.1: Export estimate as PDF**
> As Nancy, I want to export the completed estimate as a PDF file, so I can email it to my client.

Acceptance Criteria:
- Single button click generates a PDF
- PDF includes: company branding, client info, date, estimate number, project description, all line items, subtotals, tax, grand total
- PDF does NOT include: payment terms, warranty, terms & conditions, signature block (those are in the Contract)
- PDF is well-formatted and professional-looking
- PDF file name includes client name and/or date for easy identification
- Layout fits standard US Letter paper

**US-11.2: Print estimate**
> As Nancy, I want to print the estimate directly from the browser.

Acceptance Criteria:
- Print button (or Ctrl+P / Cmd+P) produces a clean, print-optimized layout
- Same professional formatting as PDF output
- No browser UI elements (nav bars, buttons) appear in print

### Epic 12: Save, Load & Templates

**US-12.1: Save and load estimates**
> As Nancy, I want to save estimates and load them later, so I can revisit and edit past work.

Acceptance Criteria:
- Save current estimate to local storage or as a downloadable file
- Load a previously saved estimate back into the editor
- Saved estimates include all data: client info, all line items, notes

**US-12.2: Reuse estimate as template**
> As Nancy, I want to save an estimate as a template and reuse it for similar projects, so I don't start from scratch every time.

Acceptance Criteria:
- "Save as Template" option that saves the estimate structure without client-specific info
- "New from Template" option that loads a template as a starting point
- Templates preserve: section structure, common line items
- Templates clear: client name, address, date, estimate number

### Epic 13: Revision Tracking

**US-13.1: Create and track revisions**
> As Nancy, I want to create revised versions of an estimate while keeping the original intact, because clients often add items as projects progress.

Acceptance Criteria:
- "Create Revision" action that duplicates the current estimate as a new version
- Original estimate is preserved unchanged
- Revision number is tracked (e.g., "Estimate #1234 - Rev 2")
- Both original and revisions are accessible
- PDF output clearly shows revision number and date

### Epic 14: Estimate Metadata

**US-14.1: Estimate number and notes**
> As Nancy, I want each estimate to have an estimate number and optional notes field, so I can track estimates and add project-specific information.

Acceptance Criteria:
- Estimate number field (auto-incrementing or manually editable)
- Optional free-text notes/description area for project scope
- Both appear on the PDF output

---

# DOCUMENT 2: CONTRACT

## 4. Contract Requirements

The contract is a **separate, mostly-static template** with a few fill-in fields. It is NOT an interactive builder like the estimate -- it is closer to a fillable PDF or a simple form that generates a branded document.

### What the Contract Contains

1. **Company Header** -- Same branding as the estimate (logo, name, contact, CSLB#)
2. **Client Information** -- Name, address (can be pre-filled from the estimate)
3. **Estimate Reference** -- "This contract is for the work described in Estimate #____ dated ____"
4. **Payment Schedule:**
   - All plant material payment due at time of ordering
   - 50% of design fee due as deposit upon acceptance
   - Hardscape materials and irrigation supplies due at time of ordering
   - Remaining balance due upon project completion
5. **Terms & Conditions** -- Professional but friendly and warm tone (per Nancy's style). Covers:
   - Scope of work (by reference to estimate)
   - Change order process and pricing
   - Scheduling and access
   - Client responsibilities
6. **Warranty:**
   - 30-day plant warranty, contingent on proper irrigation being installed and used
   - 1-year hardscape warranty
7. **Exclusions** -- What is NOT included (standard landscape exclusions)
8. **Client Acceptance / Digital Signature:**
   - Client signature (drawn or typed)
   - Date of acceptance
   - Authorization to proceed statement

### Contract User Stories

**US-C.1: Fill in contract details**
> As Nancy, I want to fill in the client name, estimate reference number, and date on a contract template, so I can pair it with my estimate.

Acceptance Criteria:
- Form fields for: client name, address, estimate number, estimate date
- Can optionally pre-fill from a saved estimate
- Rest of the contract is pre-populated with standard language

**US-C.2: Edit contract language per project**
> As Nancy, I want to optionally edit the terms, warranty, or exclusions for a specific project if needed.

Acceptance Criteria:
- All text sections are editable (but have good defaults so Nancy rarely needs to change them)
- Edits apply to this contract only, not the defaults

**US-C.3: Export contract as PDF**
> As Nancy, I want to export the contract as a professional PDF to send alongside the estimate.

Acceptance Criteria:
- Single button click generates a PDF
- Same branding and visual quality as the estimate PDF
- Includes all contract sections plus signature block
- PDF file name includes client name

**US-C.4: Client digital signature**
> As Nancy, I want clients to be able to sign the contract digitally.

Acceptance Criteria:
- Signature area at the bottom of the contract
- Client can sign digitally (draw signature or type name)
- Date of signature is captured automatically
- Signed version can be saved/exported as PDF

---

## 5. MVP Feature List (Build First)

### Document 1: Estimate (Primary Build)

| # | Feature | Priority |
|---|---------|----------|
| 1 | Company branding header (logo, name, contact, CSLB#) | Must Have |
| 2 | Client info fields (name, address) | Must Have |
| 3 | Estimate date (defaults to today) | Must Have |
| 4 | Estimate number | Must Have |
| 5 | Notes / project description field | Must Have |
| 6 | **Plant Material section** (FIRST) with qty, size, unit price, line total, add/remove rows | Must Have |
| 7 | **Labor & Services section** (SECOND) with flexible free-form line items, add/remove rows | Must Have |
| 8 | **Other Materials section** (THIRD) with qty, unit price, line total, add/remove rows | Must Have |
| 9 | **Design Fee section** (FOURTH, separate) | Must Have |
| 10 | **Installation Supervision & Meetings section** (FIFTH, $195/hr) | Must Have |
| 11 | Autocomplete/search for plant names (optional helper, never blocking) | Must Have |
| 12 | Autocomplete/search for service descriptions (optional helper, never blocking) | Must Have |
| 13 | **Multiple project sections** (front yard, back yard, etc.) | Must Have |
| 14 | Auto-calculating subtotals per section | Must Have |
| 15 | **Sales tax on materials only** (not labor/design fees) | Must Have |
| 16 | Auto-calculating grand total (all subtotals + tax) | Must Have |
| 17 | PDF export with professional formatting (pricing only -- no terms/signature) | Must Have |
| 18 | Print-friendly layout | Must Have |
| 19 | **Save/load estimates** (local storage or file) | Must Have |
| 20 | **Save/reuse estimates as templates** | Must Have |
| 21 | **Revision tracking** (keep originals + revised versions) | Must Have |
| 22 | Responsive, clean UI that a non-technical user can operate | Must Have |

### Document 2: Contract (Secondary Build)

| # | Feature | Priority |
|---|---------|----------|
| 23 | Contract template with company branding | Must Have |
| 24 | Fill-in fields: client name, address, estimate reference # and date | Must Have |
| 25 | Pre-populated payment schedule (editable) | Must Have |
| 26 | Pre-populated terms & conditions in friendly tone (editable) | Must Have |
| 27 | Pre-populated warranty: 30-day plants + 1-year hardscape (editable) | Must Have |
| 28 | Pre-populated exclusions (editable) | Must Have |
| 29 | Change order process section | Must Have |
| 30 | Digital signature (client acceptance) | Must Have |
| 31 | PDF export with professional formatting | Must Have |

---

## 6. Future Features (Nice-to-Haves -- Not in MVP)

| Feature | Rationale |
|---------|-----------|
| **Row reordering** (drag-and-drop) | Let Nancy arrange line items in preferred order |
| **Duplicate/clone an estimate** (without template) | Quick copy for similar one-off projects |
| **Editable plant/service catalog** | Let Nancy add, edit, or remove items from the pre-populated lists without editing code |
| **Multiple estimate templates** | Different default layouts for different project types |
| **Logo upload** | Let Nancy change her logo without editing code |
| **Estimate validity period** | "This estimate is valid for 30 days" auto-text |
| **Project address** (separate from client address) | For projects at a different location |
| **Photo attachments** | Attach site photos or reference images to estimates |
| **Client contact info** (phone, email) | Capture beyond just name and address |
| **Estimate status tracking** | Draft, Sent, Accepted, Declined, Revised |
| **Email integration** | Send PDF directly from the tool |
| **Auto-link contract to estimate** | Auto-populate contract fields from a selected saved estimate |

---

## 7. Non-Functional Requirements

### Usability
- **No training required:** The interface must be intuitive enough that Nancy can use it on first visit without instructions.
- **Minimal clicks:** Creating a basic estimate should take under 5 minutes once familiar.
- **Clear visual hierarchy:** Sections, totals, and actions should be immediately obvious.
- **Error prevention:** Numeric fields should only accept numbers; required fields should be clearly indicated.
- **Forgiving input:** Autocomplete should be fuzzy (handle typos) and non-blocking (can always type custom text).
- **Free-form flexibility:** Line item descriptions must never be constrained to fixed categories. Every project is unique.

### Performance
- **Instant feedback:** Calculations (subtotals, totals, tax) update with no perceptible delay.
- **Fast PDF generation:** PDF export completes within 2-3 seconds.
- **No loading spinners for core interactions:** The app should feel instantaneous.

### Compatibility
- **Browser:** Works in modern browsers (Chrome, Safari, Firefox). Optimized for desktop/laptop use.
- **No backend required:** Runs entirely in the browser (static HTML/CSS/JS). No server, database, or login.
- **Offline-capable:** Should work without an internet connection (after initial load).

### Visual Design
- **Professional and clean:** Reflects a design-oriented business. Not utilitarian -- it should feel crafted.
- **Brand-aligned:** Uses Nancy's branding colors, logo (botanical illustration style), and typography feel.
- **Print/PDF parity:** The screen layout and PDF output should look consistent and equally professional.
- **Warm tone:** The overall feel should be approachable and personal, not corporate.
- **Visual consistency:** Both estimate and contract PDFs should share the same branding, fonts, and design language.

### Maintainability
- **Simple codebase:** Easy for a developer to update plant/service catalogs, adjust branding, or add sections.
- **Data-driven catalogs:** Plant and service lists stored in separate data files (JSON or similar) for easy editing.
- **No build step required (ideal):** Prefer a solution that can be opened directly in a browser, or at most requires a simple local server.

---

## 8. Information Architecture

### Document 1: Estimate

The estimate tool is a **single-page form** with a clear top-to-bottom flow mirroring the final PDF output. Estimates can contain **multiple named project sections** (e.g., Front Yard, Back Yard), each with its own set of line item tables.

#### Section Order Within Each Project Section

1. Plant Material
2. Labor & Services
3. Other Materials
4. Design Fee
5. Installation Supervision & Meetings ($195/hr)

#### Estimate Page Layout

```
+--------------------------------------------------+
|  [Company Logo]   Nancy Lyons Garden Design       |
|  Phone | Email | CSLB# | Website                  |
+--------------------------------------------------+
|                                                    |
|  ESTIMATE #: ____   DATE: ____   REVISION: ____   |
|                                                    |
|  CLIENT INFO                                       |
|  Name: ________   Address: _______________         |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  PROJECT DESCRIPTION                               |
|  [ Free-text area ]                                |
|                                                    |
+==================================================+
|                                                    |
|  >> FRONT YARD  [section name, editable]           |
|                                                    |
|  PLANT MATERIAL                                    |
|  +--------------------+------+-----+-------+-----+ |
|  | Plant (autocomplete)| Size | Qty | Price | Tot | |
|  +--------------------+------+-----+-------+-----+ |
|  | Camellia japonica   | 5gal |  3  |  45   | 135 | |
|  | Lavender angustif.  | 1gal | 12  |   8   |  96 | |
|  | [+ Add Row]                    Subtotal: | 231 | |
|  +--------------------+------+-----+-------+-----+ |
|                                                    |
|  LABOR & SERVICES                                  |
|  +--------------------------------------+------+   |
|  | Description (free-form/autocomplete) | Price|   |
|  +--------------------------------------+------+   |
|  | Irrigation - drip system install     | 3500 |   |
|  | Grading and soil prep                | 1200 |   |
|  | [+ Add Row]              Subtotal:   | 4700 |   |
|  +--------------------------------------+------+   |
|                                                    |
|  OTHER MATERIALS                                   |
|  +---------------------------+-----+-------+-----+ |
|  | Description               | Qty | Price | Tot | |
|  +---------------------------+-----+-------+-----+ |
|  | Decomposed granite (DG)   |  3  |  120  | 360 | |
|  | [+ Add Row]                   Subtotal: | 360 | |
|  +---------------------------+-----+-------+-----+ |
|                                                    |
|  DESIGN FEE                                        |
|  +--------------------------------------+------+   |
|  | Description                          | Price|   |
|  +--------------------------------------+------+   |
|  | Planting design                      | 1500 |   |
|  | [+ Add Row]              Subtotal:   | 1500 |   |
|  +--------------------------------------+------+   |
|                                                    |
|  INSTALLATION SUPERVISION & MEETINGS               |
|  +--------------------------------------+------+   |
|  | Description                          | Price|   |
|  +--------------------------------------+------+   |
|  | Installation supervision (8hr @195)  | 1560 |   |
|  | [+ Add Row]              Subtotal:   | 1560 |   |
|  +--------------------------------------+------+   |
|                                                    |
|  >> Section Subtotal:                    $8,351    |
|                                                    |
+==================================================+
|                                                    |
|  >> BACK YARD  [+ Add Another Section]             |
|  (same structure repeats)                          |
|                                                    |
+==================================================+
|                                                    |
|  SUMMARY                                           |
|  Plant Material:                   $  231          |
|  Other Materials:                  $  360          |
|  Labor & Services:                 $4,700          |
|  Design Fee:                       $1,500          |
|  Installation Supervision:         $1,560          |
|  Tax (on materials @ X.XX%):       $   XX          |
|                                                    |
|  GRAND TOTAL                       $8,3XX          |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  [ Save ] [ Save as Template ] [ Export PDF ]      |
|  [ Print ] [ Create Revision ]                     |
|                                                    |
+--------------------------------------------------+
```

**Note:** No payment terms, no warranty, no terms & conditions, no signature block on the estimate. Those are all in the Contract.

#### Estimate Sections (Top to Bottom)

1. **Company Header** -- Logo (botanical illustration), business name, contact info (static/pre-configured)
2. **Estimate Metadata** -- Estimate number, date, revision number
3. **Client Information** -- Name, address fields
4. **Project Description** -- Free-text area
5. **Project Sections** (repeatable, named -- e.g., "Front Yard", "Back Yard"):
   - a. Plant Material table (name, size, qty, unit price, line total; subtotal)
   - b. Labor & Services table (description, price; subtotal)
   - c. Other Materials table (description, qty, unit price, line total; subtotal)
   - d. Design Fee table (description, price; subtotal)
   - e. Installation Supervision & Meetings table (description, price; subtotal)
   - f. Section subtotal
6. **Summary** -- All subtotals aggregated, tax on materials only, grand total
7. **Action Buttons** -- Save, Save as Template, Export PDF, Print, Create Revision (do not appear in PDF/print)

### Document 2: Contract

The contract is a **simple fillable template** -- mostly pre-populated text with a few fields to complete.

#### Contract Page Layout

```
+--------------------------------------------------+
|  [Company Logo]   Nancy Lyons Garden Design       |
|  Phone | Email | CSLB# | Website                  |
+--------------------------------------------------+
|                                                    |
|  LANDSCAPE DESIGN & INSTALLATION CONTRACT          |
|                                                    |
|  Client: _______________                           |
|  Address: ______________                           |
|  Date: ________________                            |
|                                                    |
|  This contract is for the work described in        |
|  Estimate #____ dated _________.                   |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  PAYMENT SCHEDULE                                  |
|  (pre-populated, editable)                         |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  TERMS & CONDITIONS                                |
|  (friendly tone, pre-populated, editable)          |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  WARRANTY                                          |
|  - 30-day plant warranty (irrigation contingency)  |
|  - 1-year hardscape workmanship warranty           |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  EXCLUSIONS                                        |
|  (pre-populated, editable)                         |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CHANGE ORDERS                                     |
|  (process description)                             |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  CLIENT ACCEPTANCE                                 |
|  Signature: _______________  Date: ___________     |
|  (Digital signature capture)                       |
|                                                    |
+--------------------------------------------------+
|                                                    |
|  [ Export PDF ] [ Print ]                          |
|                                                    |
+--------------------------------------------------+
```

### Key Interaction Patterns (Estimate)

- **Adding rows:** Click "+ Add Row" button at the bottom of each table. New row appears with empty fields, cursor focuses on the first field.
- **Removing rows:** Each row has a small delete/remove button (X or trash icon) on the right side. Clicking removes the row and recalculates totals.
- **Adding project sections:** Click "+ Add Section" button. New named section appears with all five sub-tables. Section name is editable.
- **Removing project sections:** Each section has a remove option (with confirmation).
- **Autocomplete:** Typing in description or plant name fields shows a dropdown of matching items from the catalog. These are optional suggestions only -- Nancy can always type freely. Arrow keys or click to select. Escape or continued typing dismisses suggestions.
- **Currency formatting:** Price fields display as currency on blur (e.g., "$1,200.00") but allow plain number entry.
- **Free-form descriptions:** All description fields accept any text. The autocomplete catalog is a convenience, never a constraint.

---

## 9. Data Requirements

### Pre-Populated Service Catalog

A JSON or JS data file containing common landscape services as **suggestions only** (Nancy can always type custom descriptions):

- Irrigation Installation, Irrigation Repair, Drip System
- Hardscaping (patios, walkways), Retaining Walls
- Grading & Drainage, French Drain
- Landscape Lighting
- Planting Labor (trees, shrubs, perennials, ground cover)
- Tree Removal, Transplanting
- Mulching, Sod/Lawn Installation
- Pruning/Maintenance
- Soil Preparation & Amendments
- Fence/Gate Installation
- Water Features
- Deck/Patio Construction
- Edging Installation
- Plant/Debris Disposal

Each entry: `{ name: string, category: string }`
(No prices in catalog -- prices vary per project and are entered by Nancy.)

### Pre-Populated Design Fee / Supervision Catalog

Suggestions for the Design Fee and Installation Supervision sections:

- Design Development
- Planting Plan
- Construction Documentation
- Irrigation Design
- Lighting Design
- Installation Supervision ($195/hr)
- Client Meetings ($195/hr)
- Site Visits ($195/hr)

Each entry: `{ name: string, defaultRate: number | null }`

### Pre-Populated Plant Catalog

A JSON or JS data file containing common California landscape plants:

Each entry: `{ commonName: string, botanicalName: string, category: string }`

Categories: Native/Drought-Tolerant, Mediterranean, Shade/Woodland, Screening/Hedging, Trees, Ground Covers

The plant list from the research document (Section 2) forms the initial catalog -- approximately 60+ plants.

### Container Size Options

Standard sizes for the plant material size field (per Nancy -- no bare root, max 36" box):
- 4" pot, 6" pot
- 1 gal, 2 gal, 3 gal, 5 gal, 7 gal, 10 gal, 15 gal, 25 gal
- 24" box, 36" box
- Flat

### Default Contract Text

Payment schedule, terms & conditions, warranty, and exclusions text to be drafted (see Task #13). Requirements for tone:
- Professional but friendly and warm
- Reflects Nancy's personality -- approachable, not corporate
- Not stiff legal boilerplate

Key content:
- **Payment:** Plant material at ordering, 50% design deposit, hardscape/irrigation at ordering, balance on completion
- **Warranty:** 30-day plants (with irrigation contingency), 1-year hardscape workmanship
- **Exclusions:** Standard landscape exclusions (utilities, permits, excess hauling, adjacent properties, ongoing maintenance, pest treatment)
- **Change orders:** Process for scope changes with written approval and pricing

---

## 10. Technical Constraints

- **No backend / no database:** Entirely client-side. HTML + CSS + JavaScript.
- **No user accounts or auth:** Single-user tool, no login.
- **No build tool required (preferred):** Ideally works by opening an HTML file or running a minimal local server. If a build step is used, keep it simple (e.g., Vite with minimal config).
- **PDF generation:** Use a client-side library (e.g., html2pdf.js, jsPDF, or browser print-to-PDF) -- no server-side rendering.
- **Data stored in files:** Plant and service catalogs as JSON/JS modules, not fetched from APIs at runtime.
- **Local persistence:** Save/load estimates using browser localStorage or downloadable JSON files. No cloud storage.
- **Digital signature:** Client-side signature capture (canvas-based drawing or typed name). No third-party e-signature service required for MVP.
- **Two documents, one app:** Both the estimate builder and contract template can live in the same web application (e.g., as two tabs/views), sharing branding and data.

---

## 11. Success Metrics

Since this is a personal tool (not a SaaS), success is measured qualitatively:

1. **Nancy can create a complete estimate in under 5 minutes** after initial familiarity.
2. **The PDF output looks professional** -- clients comment positively or at least don't question its quality.
3. **Zero math errors** -- all totals and tax are automatically and correctly calculated.
4. **Nancy uses it instead of going back to spreadsheets** -- the tool is less friction, not more.
5. **No technical support needed** -- Nancy can operate it independently after a brief walkthrough.
6. **Revisions are painless** -- Nancy can update an estimate in under 2 minutes, with the original preserved.
7. **Templates save time** -- Similar projects can be started from a template instead of from scratch.
8. **Clean separation** -- Clients receive a clear pricing document (estimate) and a clear agreement (contract), not one confusing hybrid.
