# Technical Architecture - Nancy Lyons Garden Design Estimate Tool

**Date:** February 25, 2026
**Updated:** February 25, 2026 (scope change: separate Estimate and Contract documents)
**Status:** Proposed

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Tech Stack](#2-tech-stack)
3. [Application Structure](#3-application-structure)
4. [Data Architecture](#4-data-architecture)
5. [PDF Generation](#5-pdf-generation)
6. [Autocomplete & Pre-Populated Data](#6-autocomplete--pre-populated-data)
7. [State Management](#7-state-management)
8. [Logo & Branding](#8-logo--branding)
9. [Print Support](#9-print-support)
10. [Deployment](#10-deployment)
11. [File & Component Structure](#11-file--component-structure)
12. [Future Considerations](#12-future-considerations)

---

## 1. Design Philosophy

**Core principle: A single HTML application with zero backend.**

Nancy is a solo landscape designer, not a software engineer. The tool must:

- Run entirely in the browser (no server to maintain)
- Store data locally in the browser (localStorage / IndexedDB)
- Be deployable as a single static site (one command or drag-and-drop)
- Require zero ongoing maintenance (no databases, no server processes, no Docker)
- Work on desktop (Mac/Windows) and iPad Safari
- Produce beautiful, professional PDFs that match her brand

This is a **client-side single-page application (SPA)** -- not a SaaS product. One user, one browser, local data.

---

## 2. Tech Stack

### Chosen Stack

| Layer | Technology | Rationale |
|---|---|---|
| **Framework** | React 18+ with Vite | Fast dev experience, huge ecosystem, simple build. Vite is zero-config and fast. |
| **Language** | TypeScript | Catches bugs early, excellent autocomplete in editors. Small overhead for large safety gain. |
| **Styling** | Tailwind CSS | Utility-first, rapid styling, excellent responsive support. No separate CSS files to manage. |
| **UI Components** | shadcn/ui | Copy-paste component library built on Radix UI. Not a dependency -- components are owned in the project. Professional look out of the box. |
| **PDF Generation** | `@react-pdf/renderer` | React-based PDF generation. Write PDF layouts as React components. Produces real vector PDFs (not screenshots). |
| **Data Storage** | localStorage (primary) + JSON file export/import | Simple, no database. Export/import for backup and transfer. |
| **Autocomplete** | Custom component using shadcn/ui Combobox (built on Radix Popover + Command) | No external autocomplete library needed. |
| **State Management** | React Context + `useReducer` | Simple, built-in, no extra dependency. The form state is the only complex state. |
| **Routing** | None (single page) or React Router (minimal, 2-3 views at most) | Keep it simple -- the app is essentially one form with a preview. |
| **Build Tool** | Vite | Fast, simple config, excellent defaults, outputs static files. |
| **Package Manager** | npm | Standard, no extra tooling. |

### Why NOT other options

- **Next.js / Remix**: Overkill. These are server-oriented frameworks. Nancy does not need SSR, API routes, or server components.
- **Vue / Svelte**: Fine choices, but React has the largest component ecosystem (shadcn/ui, react-pdf) which is critical for this project.
- **Electron / Tauri**: Desktop app adds deployment complexity. A web app hosted on a simple static host is easier to access from any device including iPad.
- **Google Sheets / Airtable**: Cannot produce the branded, beautiful PDF output Nancy needs. Also harder to customize autocomplete and UX.
- **Full database (Postgres, SQLite, Supabase)**: Single user with modest data. localStorage handles this with zero ops burden. JSON export/import covers backup.

---

## 3. Application Structure

### Two-Document Model

The tool produces **two separate documents**:

1. **Estimate** -- Clean pricing document. The main build focus. Dynamic, data-driven.
2. **Contract** -- Separate template that references an Estimate by number. Mostly static boilerplate with a few fill-in fields.

This separation keeps the estimate clean and focused on pricing, while the contract handles all legal/terms/payment language independently.

### Views / Screens

The app has **4 main views**, navigable by tabs or simple routing:

```
1. ESTIMATE FORM        -- The main workspace: create/edit an estimate
2. ESTIMATE LIST        -- View, search, duplicate, delete saved estimates
3. CONTRACT FORM        -- Generate a contract referencing an existing estimate
4. SETTINGS             -- Company info, logo, tax rate, catalog management
```

### Estimate Form Layout (Primary View)

The estimate is **pricing only** -- no terms, warranty, exclusions, payment schedule, or signature block.

```
+------------------------------------------------------------------+
|  [Nancy Lyons Garden Design]              [Save] [Preview] [PDF] |
+------------------------------------------------------------------+
|                                                                    |
|  ESTIMATE #NL-2026-001          Date: [02/25/2026]               |
|                                                                    |
|  CLIENT INFORMATION                                               |
|  Name: [________________________]                                 |
|  Address: [_____________________]                                 |
|  City/State/Zip: [_____________]                                  |
|  Project Address: [____________]  [ ] Same as above               |
|                                                                    |
|  PROJECT DESCRIPTION                                              |
|  [Multi-line text area for scope narrative]                       |
|                                                                    |
|  PLANT MATERIAL                                                   |
|  +--------------------------------------------------------------+ |
|  | Description (autocomplete)      | Qty | Size   | $/Unit| Tot | |
|  | Japanese Maple (Acer palmatum)  |  2  | 15 gal | 350.00| 700 | |
|  | Lavender (Lavandula angustif.)  |  12 | #5     |  35.00| 420 | |
|  | Star Jasmine                    |  6  | #5     |  28.00| 168 | |
|  |                          [+ Add Plant]                        | |
|  +--------------------------------------------------------------+ |
|                                     Plant Material Subtotal: $1,288|
|                                                                    |
|  LABOR                                                            |
|  +--------------------------------------------------------------+ |
|  | Description                     | Qty | Unit   | $/Unit| Tot | |
|  | Irrigation installation          |  1  | lot    |3200.00|3200 | |
|  | Planting labor                   | 16  | hr     | 100.00|1600 | |
|  |                          [+ Add Labor]                        | |
|  +--------------------------------------------------------------+ |
|                                            Labor Subtotal: $4,800  |
|                                                                    |
|  OTHER MATERIALS                                                  |
|  +--------------------------------------------------------------+ |
|  | Description                     | Qty | Unit   | $/Unit| Tot | |
|  | Flagstone - irregular           | 180 | sqft   |  45.00|8100 | |
|  | Bark mulch                      |  8  | cuyd   |  55.00| 440 | |
|  |                       [+ Add Material]                        | |
|  +--------------------------------------------------------------+ |
|                                     Other Materials Subtotal: $8,540|
|                                                                    |
|  DESIGN FEE                                                       |
|  +--------------------------------------------------------------+ |
|  | Design consultation & planning  | 12  | hr     | 195.00|2340 | |
|  |                     [+ Add Design Fee]                        | |
|  +--------------------------------------------------------------+ |
|                                        Design Fee Subtotal: $2,340 |
|                                                                    |
|  INSTALLATION SUPERVISION & MEETINGS                              |
|  +--------------------------------------------------------------+ |
|  | On-site supervision             |  8  | hr     | 195.00|1560 | |
|  |                    [+ Add Supervision]                        | |
|  +--------------------------------------------------------------+ |
|                                       Supervision Subtotal: $1,560 |
|                                                                    |
|  ================================================================  |
|  SUMMARY                                                          |
|  Plant Material:                                       $1,288.00  |
|  Other Materials:                                      $8,540.00  |
|  Tax on Materials (8.5%):                                $835.38  |
|  Labor:                                                $4,800.00  |
|  Design Fee:                                           $2,340.00  |
|  Installation Supervision & Meetings:                  $1,560.00  |
|  ----------------------------------------------------------------  |
|  TOTAL:                                               $19,363.38  |
|                                                                    |
+------------------------------------------------------------------+
```

### Contract Form Layout (Secondary View)

The contract is a mostly-static template with fill-in fields. It references an existing estimate.

```
+------------------------------------------------------------------+
|  CONTRACT GENERATOR                         [Preview] [Download]  |
+------------------------------------------------------------------+
|                                                                    |
|  Linked Estimate: [NL-2026-001 - Smith Residence v]              |
|  (Auto-fills client name, address, total from estimate)           |
|                                                                    |
|  PAYMENT SCHEDULE                                                 |
|  [ ] Plant material due at time of ordering                       |
|  [ ] 50% design deposit                                           |
|  [ ] Hardscape/irrigation materials due at ordering               |
|  [ ] Remainder due upon completion                                |
|  [Custom milestone editor if needed]                              |
|                                                                    |
|  TERMS & CONDITIONS                                               |
|  [Pre-populated text, editable per contract]                      |
|                                                                    |
|  WARRANTY                                                         |
|  [Pre-populated: 30-day plants w/ irrigation, 1-yr hardscape]    |
|                                                                    |
|  EXCLUSIONS                                                       |
|  [Pre-populated text, editable per contract]                      |
|                                                                    |
|  CHANGE ORDER PROCESS                                             |
|  [Pre-populated text]                                             |
|                                                                    |
+------------------------------------------------------------------+
```

---

## 4. Data Architecture

### 4.1 Storage Strategy

```
localStorage
  ├── nlgd_estimates        → Array of saved estimate objects (JSON)
  ├── nlgd_contracts        → Array of saved contract objects (JSON)
  ├── nlgd_settings         → Company info, logo (base64), tax rate, contract defaults
  ├── nlgd_plant_catalog    → Plant catalog (built-in + user additions)
  ├── nlgd_service_catalog  → Service catalog (built-in + user additions)
  └── nlgd_material_catalog → Materials catalog (built-in + user additions)
```

**Storage limits:** localStorage provides ~5-10MB. A typical estimate is ~5-20KB of JSON. This supports hundreds of estimates comfortably. For the unlikely case of exceeding limits, the app will show a warning and prompt the user to export and archive old estimates.

**Backup strategy:** One-click "Export All Data" button in Settings that downloads a single `.json` file. "Import Data" button to restore. This is the backup, migration, and device-transfer mechanism.

### 4.2 Data Models

#### Estimate (pricing document only)

```typescript
interface Estimate {
  id: string;                    // UUID
  estimateNumber: string;        // "NL-2026-001" (auto-generated, editable)
  status: "draft" | "sent";
  createdAt: string;             // ISO date
  updatedAt: string;             // ISO date

  // Client
  client: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    projectAddress: string;      // Empty = same as client address
    projectAddressSameAsClient: boolean;
  };

  // Project
  projectDescription: string;    // Plain text narrative

  // Line Items -- organized by fixed sections
  plantMaterial: LineItem[];
  labor: LineItem[];
  otherMaterials: LineItem[];
  designFee: LineItem[];
  supervisionAndMeetings: LineItem[];

  // Financial
  taxRate: number;               // Percentage, e.g., 8.5 (applied to plant + other materials only)
}
```

**Key change:** Line items are now organized into **5 fixed sections** rather than a single flat list with category tags. This matches the specific sections Nancy uses and simplifies the form -- each section has its own "Add" button and subtotal. Tax applies only to plant material and other materials sections.

```typescript
interface LineItem {
  id: string;                    // UUID for React key and reordering
  description: string;
  quantity: number;
  unit: string;                  // "ea", "sqft", "lnft", "cuyd", "hr", "lot", "flat"
  unitPrice: number;
  // total is computed: quantity * unitPrice (not stored)
}

// Note: LineItem no longer needs a `category` field because the section
// it belongs to (plantMaterial, labor, etc.) provides the category implicitly.
```

#### Contract (separate document referencing an estimate)

```typescript
interface Contract {
  id: string;                    // UUID
  estimateId: string;            // Links to the Estimate it references
  estimateNumber: string;        // Denormalized for display: "NL-2026-001"
  createdAt: string;             // ISO date
  updatedAt: string;             // ISO date

  // Payment schedule (Nancy's typical structure)
  paymentSchedule: {
    plantMaterialDueAtOrdering: boolean;
    designDeposit50Percent: boolean;
    hardscapeIrrigationDueAtOrdering: boolean;
    remainderOnCompletion: boolean;
    customMilestones: PaymentMilestone[];  // For any additional custom terms
  };

  // Text sections (pre-populated from settings defaults, editable per contract)
  terms: string;                 // Terms & conditions (friendly tone)
  warranty: string;              // 30-day plants w/ irrigation, 1-year hardscape
  exclusions: string;
  changeOrderProcess: string;
}

interface PaymentMilestone {
  description: string;
  amount: number;                // Dollar amount or percentage -- flexible
}
```

#### Settings

```typescript
interface Settings {
  company: {
    name: string;                // "Nancy Lyons Garden Design"
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    website: string;
    licenseNumber: string;       // CSLB# for California
    logo: string;                // Base64-encoded image or data URL
  };

  defaults: {
    taxRate: number;
    designFeeRate: number;       // $195/hr
    supervisionRate: number;     // $195/hr
  };

  // Contract template defaults (pre-populated text)
  contractDefaults: {
    terms: string;
    warranty: string;
    exclusions: string;
    changeOrderProcess: string;
  };

  estimateNumberPrefix: string;  // "NL" -- auto-increments: NL-2026-001, NL-2026-002
  nextEstimateNumber: number;    // Auto-incremented
}
```

#### Catalog Item (for autocomplete data)

```typescript
interface CatalogItem {
  id: string;
  category: LineItemCategory;
  name: string;                  // "Japanese Maple (Acer palmatum)"
  description: string;           // Optional longer description
  defaultUnit: string;           // "ea", "sqft", etc.
  defaultUnitPrice: number;      // Suggested price (user can override)
  tags: string[];                // For search: ["tree", "shade", "japanese", "maple"]
  isBuiltIn: boolean;            // true = shipped with app, false = user-added
}
```

### 4.3 Pre-Populated Data

The app ships with **built-in catalog data** compiled from the research:

- **~100 common California plants** with botanical names, common names, typical container sizes, and price ranges
- **~30 common services** (irrigation install, hardscaping, grading, lighting, etc.) with typical units and price ranges
- **~40 common materials** (pavers, mulch, soil, edging, etc.) with typical units and price ranges

This data is stored as a **static JSON file** bundled with the app (`src/data/default-catalog.json`). On first launch, it is copied into localStorage. The user can then modify prices, add items, or remove items. The built-in data serves as a starting point only.

A "Reset to Defaults" button in Settings restores the original catalog while preserving user-added items (marked `isBuiltIn: false`).

---

## 5. PDF Generation

### Approach: `@react-pdf/renderer`

This library lets us define PDF layouts as React components. The PDF is generated entirely in the browser -- no server needed.

**Why this approach:**
- Real vector PDF output (not a screenshot or print-to-PDF hack)
- Full control over layout, fonts, colors, margins
- Can embed the company logo
- Page breaks are handled properly
- Consistent output across browsers and devices
- The PDF can be previewed in-app before downloading

**Why NOT other approaches:**
- `window.print()` / CSS `@media print`: Browser inconsistencies, poor control over page breaks, cannot reliably reproduce across browsers.
- `html2canvas` + `jsPDF`: Screenshot-based, blurry at zoom, large file sizes, poor text selection in resulting PDF.
- Server-side PDF (Puppeteer, wkhtmltopdf): Requires a server. Violates the zero-backend constraint.

### PDF Layout: Estimate (clean pricing only)

The estimate PDF is intentionally concise -- pricing and scope only. No legal language, no signature block.

```
Page 1:
  ┌──────────────────────────────────────────────┐
  │  [LOGO]   Nancy Lyons Garden Design          │
  │           123 Garden Way, City, CA 95XXX     │
  │           (555) 123-4567 | nancy@nlgd.com   │
  │           CSLB# 1234567                      │
  ├──────────────────────────────────────────────┤
  │  LANDSCAPE ESTIMATE                          │
  │  Estimate #NL-2026-001  |  Date: 02/25/2026 │
  ├──────────────────────────────────────────────┤
  │  PREPARED FOR:                               │
  │  Client Name                                 │
  │  Client Address                              │
  │                                              │
  │  PROJECT LOCATION: (if different)            │
  │  Project Address                             │
  ├──────────────────────────────────────────────┤
  │  PROJECT DESCRIPTION                         │
  │  [Narrative text...]                         │
  ├──────────────────────────────────────────────┤
  │                                              │
  │  PLANT MATERIAL                              │
  │  Description            Qty  Size  Price Tot │
  │  Japanese Maple          2   15gal 350   700 │
  │  Lavender               12   #5     35   420 │
  │  Star Jasmine             6   #5     28   168 │
  │                         Subtotal:      1,288 │
  │                                              │
  │  LABOR                                       │
  │  Description            Qty  Unit  Price Tot │
  │  Irrigation install      1   lot   3200 3200 │
  │  Planting labor         16   hr     100 1600 │
  │                         Subtotal:      4,800 │
  │                                              │
  │  OTHER MATERIALS                             │
  │  Flagstone - irregular 180   sqft    45 8100 │
  │  Bark mulch              8   cuyd    55  440 │
  │                         Subtotal:      8,540 │
  │                                              │
  │  DESIGN FEE                                  │
  │  Design consultation    12   hr     195 2340 │
  │                         Subtotal:      2,340 │
  │                                              │
  │  INSTALLATION SUPERVISION & MEETINGS         │
  │  On-site supervision     8   hr     195 1560 │
  │                         Subtotal:      1,560 │
  │                                              │
  ├──────────────────────────────────────────────┤
  │  ESTIMATE SUMMARY                            │
  │                                              │
  │  Plant Material:                   $1,288.00 │
  │  Other Materials:                  $8,540.00 │
  │  Tax on Materials (8.5%):            $835.38 │
  │  Labor:                            $4,800.00 │
  │  Design Fee:                       $2,340.00 │
  │  Installation Supervision:         $1,560.00 │
  │  ────────────────────────────────────────     │
  │  TOTAL:                           $19,363.38 │
  │                                              │
  └──────────────────────────────────────────────┘
```

That is it. No terms, no warranty, no payment schedule, no signature block. Clean and focused.

### PDF Layout: Contract (separate document)

The contract PDF references the estimate and contains all legal/terms content.

```
Page 1:
  ┌──────────────────────────────────────────────┐
  │  [LOGO]   Nancy Lyons Garden Design          │
  │           123 Garden Way, City, CA 95XXX     │
  │           (555) 123-4567 | nancy@nlgd.com   │
  │           CSLB# 1234567                      │
  ├──────────────────────────────────────────────┤
  │  LANDSCAPE DESIGN & INSTALLATION CONTRACT    │
  │  Date: 02/25/2026                            │
  │                                              │
  │  Client: John Smith                          │
  │  Project: 456 Oak Street, City, CA           │
  │  Reference: Estimate #NL-2026-001            │
  │  Estimated Total: $19,363.38                 │
  ├──────────────────────────────────────────────┤
  │  PAYMENT SCHEDULE                            │
  │                                              │
  │  - Plant material cost ($1,288.00) due at    │
  │    time of ordering                          │
  │  - 50% design deposit ($1,170.00) due upon   │
  │    acceptance                                │
  │  - Hardscape/irrigation materials due at     │
  │    time of ordering                          │
  │  - Remainder due upon project completion     │
  ├──────────────────────────────────────────────┤
  │  TERMS & CONDITIONS                          │
  │  [Friendly-tone terms text...]               │
  ├──────────────────────────────────────────────┤
  │  WARRANTY                                    │
  │  - Plants: 30 days, contingent on functional │
  │    irrigation and adherence to watering      │
  │    schedule                                  │
  │  - Hardscape: 1 year against workmanship     │
  │    defects                                   │
  ├──────────────────────────────────────────────┤
  │  EXCLUSIONS                                  │
  │  [Exclusions text...]                        │
  ├──────────────────────────────────────────────┤
  │  CHANGE ORDERS                               │
  │  [Change order process text...]              │
  ├──────────────────────────────────────────────┤
  │  ACCEPTANCE                                  │
  │                                              │
  │  Signature: ___________________________      │
  │  Printed Name: ________________________     │
  │  Date: _________________________________    │
  │                                              │
  │  By signing, you authorize Nancy Lyons       │
  │  Garden Design to proceed per the attached   │
  │  Estimate #NL-2026-001.                      │
  └──────────────────────────────────────────────┘
```

### PDF Styling

- Clean, professional typography (use a bundled font like Inter or Source Sans for consistency)
- Nancy's brand colors as accents (configurable in Settings)
- Logo prominently placed in the header
- Generous whitespace, clear visual hierarchy
- Table lines for line items, no heavy borders elsewhere
- Page numbers in the footer

---

## 6. Autocomplete & Pre-Populated Data

### Implementation

The autocomplete uses **shadcn/ui's Combobox** component (Radix Popover + cmdk Command palette pattern):

1. User starts typing in the Description field of a line item
2. The component filters the catalog data in real-time (fuzzy matching on name + tags)
3. Results are grouped by category and show: name, default size/unit, and suggested price
4. Selecting an item auto-fills: description, unit, and unit price (all editable)
5. User can also type a completely custom description (not limited to catalog items)

### Search/Filter Logic

```typescript
function filterCatalog(query: string, category: LineItemCategory | null): CatalogItem[] {
  const normalizedQuery = query.toLowerCase().trim();
  return catalog
    .filter(item => {
      // Filter by category if one is selected
      if (category && item.category !== category) return false;
      // Match against name, description, and tags
      const searchText = [item.name, item.description, ...item.tags].join(" ").toLowerCase();
      // Simple substring match (sufficient for ~170 items)
      return normalizedQuery.split(" ").every(word => searchText.includes(word));
    })
    .slice(0, 20); // Limit results for performance
}
```

For a catalog of ~170 items, simple substring matching is perfectly adequate. No need for a fuzzy search library like Fuse.js. If the catalog grows significantly in the future, Fuse.js could be added as a drop-in replacement.

### Autocomplete UX Flow

```
User types: "jap"
  → Shows: "Japanese Maple (Acer palmatum) - 15 gal - $350.00/ea"
           "Japanese Maple (Acer palmatum) - 24" box - $650.00/ea"
           "Star Jasmine (Trachelospermum jasminoides) - #5 - $35.00/ea"

User selects "Japanese Maple (Acer palmatum) - 15 gal"
  → Auto-fills: Description="Japanese Maple (Acer palmatum) - 15 gal", Unit="ea", UnitPrice=350.00
  → User adjusts quantity and can override any field
```

---

## 7. State Management

### Approach: React Context + `useReducer`

A single `EstimateContext` manages the current estimate being edited. A reducer handles all mutations. The section-based line item structure means actions specify which section they target.

```typescript
type EstimateSection =
  | "plantMaterial"
  | "labor"
  | "otherMaterials"
  | "designFee"
  | "supervisionAndMeetings";

type EstimateAction =
  | { type: "SET_CLIENT_FIELD"; field: string; value: string }
  | { type: "SET_PROJECT_DESCRIPTION"; value: string }
  | { type: "ADD_LINE_ITEM"; section: EstimateSection }
  | { type: "UPDATE_LINE_ITEM"; section: EstimateSection; id: string; field: string; value: string | number }
  | { type: "REMOVE_LINE_ITEM"; section: EstimateSection; id: string }
  | { type: "REORDER_LINE_ITEMS"; section: EstimateSection; fromIndex: number; toIndex: number }
  | { type: "SET_TAX_RATE"; value: number }
  | { type: "LOAD_ESTIMATE"; estimate: Estimate }
  | { type: "RESET" };
```

### Auto-Save

The estimate auto-saves to localStorage on every change (debounced at 1 second). No explicit "Save" action is needed for draft preservation, but a "Save" button is provided for explicit save-with-feedback.

### Computed Values

Derived values (section subtotals, tax, grand total) are computed on render, not stored in state. Tax applies only to plant material and other materials.

```typescript
function sectionSubtotal(items: LineItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
}

// In component:
const plantTotal = useMemo(() => sectionSubtotal(estimate.plantMaterial), [estimate.plantMaterial]);
const laborTotal = useMemo(() => sectionSubtotal(estimate.labor), [estimate.labor]);
const otherMaterialsTotal = useMemo(() => sectionSubtotal(estimate.otherMaterials), [estimate.otherMaterials]);
const designFeeTotal = useMemo(() => sectionSubtotal(estimate.designFee), [estimate.designFee]);
const supervisionTotal = useMemo(() => sectionSubtotal(estimate.supervisionAndMeetings), [estimate.supervisionAndMeetings]);

// Tax applies to materials only (plant material + other materials)
const taxableTotal = plantTotal + otherMaterialsTotal;
const taxAmount = taxableTotal * (estimate.taxRate / 100);

const grandTotal = plantTotal + otherMaterialsTotal + taxAmount + laborTotal + designFeeTotal + supervisionTotal;
```

---

## 8. Logo & Branding

### Logo Storage

- The user uploads their logo in **Settings**
- The image is resized client-side (max 400px wide, maintaining aspect ratio) using an `<canvas>` element
- Stored as a **base64 data URL** in localStorage under `nlgd_settings.company.logo`
- Base64 ensures the logo is embedded in the data -- no external file dependencies
- The same base64 string is used in both the on-screen preview and the PDF output

### Brand Colors

Settings includes a simple color picker for:
- **Primary color** (used for headings, accents in the PDF)
- **Secondary color** (used for subtle accents, table headers)

Defaults to a tasteful green palette appropriate for a garden design business.

---

## 9. Print Support

### Two-Pronged Approach

**Primary: PDF Download**
- The "Download PDF" button generates a PDF via `@react-pdf/renderer` and triggers a browser download
- This is the recommended path for sharing with clients (email attachment, print from PDF viewer)
- Consistent output regardless of browser or device

**Secondary: Browser Print**
- A "Print" button triggers `window.print()` on a print-optimized view
- CSS `@media print` styles hide the UI chrome and format the estimate for printing
- This is a convenience for quick prints from the browser, not the primary output method
- Less consistent than PDF but useful for quick reference prints

### Print Stylesheet

```css
@media print {
  /* Hide all UI controls */
  .no-print { display: none !important; }

  /* Reset page margins */
  @page { margin: 0.75in; size: letter; }

  /* Ensure page breaks in sensible places */
  .page-break-before { page-break-before: always; }
  .no-break { page-break-inside: avoid; }
}
```

---

## 10. Deployment

### Recommended: Vercel (Static Site)

**Why Vercel:**
- Free tier is more than sufficient for a single-user static site
- Zero-config deployment from a Git repository
- Automatic HTTPS
- Custom domain support (e.g., estimates.nancylyons.com)
- No server to manage, no database, no runtime costs

**Deployment process:**
1. Push code to a GitHub repository (can be private)
2. Connect the repository to Vercel (one-time setup)
3. Every push to `main` auto-deploys

**Alternative options (if Vercel is not preferred):**
- **Netlify**: Equivalent to Vercel, also free tier
- **GitHub Pages**: Free, slightly more manual setup
- **Cloudflare Pages**: Free, fast global CDN

All of these host static files. The app is a Vite build that produces a `dist/` folder with `index.html`, JS bundles, and CSS. Any static hosting works.

### Local Development

```bash
npm install        # Install dependencies
npm run dev        # Start dev server at localhost:5173
npm run build      # Build for production → dist/
npm run preview    # Preview production build locally
```

---

## 11. File & Component Structure

```
src/
├── main.tsx                      # App entry point
├── App.tsx                       # Root component, routing, context providers
├── index.css                     # Tailwind imports, global styles, print styles
│
├── components/
│   ├── ui/                       # shadcn/ui primitives (button, input, dialog, etc.)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── combobox.tsx          # Autocomplete base component
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── textarea.tsx
│   │   ├── table.tsx
│   │   └── ...
│   │
│   ├── estimate-form/            # Estimate form components (pricing only)
│   │   ├── EstimateForm.tsx      # Main form container
│   │   ├── ClientInfoSection.tsx
│   │   ├── ProjectDescriptionSection.tsx
│   │   ├── LineItemSection.tsx   # Reusable section (used for each of the 5 sections)
│   │   ├── LineItemRow.tsx       # Single line item with autocomplete
│   │   ├── LineItemAutocomplete.tsx  # Catalog-aware autocomplete
│   │   └── SummarySection.tsx    # Section subtotals, tax, grand total
│   │
│   ├── contract-form/            # Contract form components (terms/legal)
│   │   ├── ContractForm.tsx      # Main contract form
│   │   ├── EstimateSelector.tsx  # Dropdown to link to an existing estimate
│   │   ├── PaymentScheduleSection.tsx
│   │   ├── TermsSection.tsx
│   │   ├── WarrantySection.tsx
│   │   ├── ExclusionsSection.tsx
│   │   └── ChangeOrderSection.tsx
│   │
│   ├── estimate-list/            # Saved estimates list
│   │   ├── EstimateList.tsx
│   │   └── EstimateCard.tsx      # Summary card for each estimate
│   │
│   ├── settings/                 # Settings page
│   │   ├── SettingsPage.tsx
│   │   ├── CompanyInfoForm.tsx
│   │   ├── LogoUpload.tsx
│   │   ├── ContractDefaultsForm.tsx  # Default terms, warranty, exclusions text
│   │   └── CatalogManager.tsx    # View/edit/add catalog items
│   │
│   ├── pdf/                      # PDF template components
│   │   ├── estimate/             # Estimate PDF (clean pricing)
│   │   │   ├── EstimatePDF.tsx   # Root estimate PDF document
│   │   │   ├── PDFHeader.tsx     # Logo + company info
│   │   │   ├── PDFClientInfo.tsx
│   │   │   ├── PDFLineItems.tsx  # Itemized cost tables by section
│   │   │   └── PDFSummary.tsx    # Section subtotals, tax, grand total
│   │   │
│   │   ├── contract/             # Contract PDF (terms/legal)
│   │   │   ├── ContractPDF.tsx   # Root contract PDF document
│   │   │   ├── PDFContractHeader.tsx
│   │   │   ├── PDFPaymentSchedule.tsx
│   │   │   ├── PDFTerms.tsx
│   │   │   ├── PDFWarranty.tsx
│   │   │   └── PDFSignature.tsx  # Acceptance/signature block
│   │   │
│   │   └── shared/               # Shared PDF components
│   │       ├── pdf-styles.ts     # Shared stylesheet, fonts, colors
│   │       └── PDFPageFooter.tsx # Page numbers, company name
│   │
│   └── layout/                   # Shell / layout components
│       ├── Header.tsx
│       ├── Navigation.tsx        # Tab bar: Estimates | New Estimate | Contract | Settings
│       └── Footer.tsx
│
├── context/
│   ├── EstimateContext.tsx        # Current estimate state + reducer
│   ├── ContractContext.tsx        # Current contract state + reducer
│   └── SettingsContext.tsx        # Company settings state
│
├── hooks/
│   ├── useLocalStorage.ts        # Generic localStorage hook with JSON serialization
│   ├── useAutoSave.ts            # Debounced auto-save logic
│   └── useCatalog.ts             # Catalog data access + filtering
│
├── lib/
│   ├── storage.ts                # localStorage read/write helpers, export/import
│   ├── estimate-utils.ts         # Compute totals, format currency, generate estimate numbers
│   ├── catalog-filter.ts         # Catalog search/filter logic
│   └── format.ts                 # Number formatting, date formatting
│
├── data/
│   ├── default-catalog.json      # Pre-populated plant, service, and material catalog
│   └── contract-defaults.json    # Default terms, warranty, exclusions, change order text
│
└── types/
    └── index.ts                  # All TypeScript interfaces (Estimate, Contract, LineItem, Settings, CatalogItem)
```

### Key Decisions on Structure

- **`components/ui/`**: shadcn/ui components are copied into the project (not installed as a package). This is by design -- they are owned, customizable, and have no version dependency.
- **`components/pdf/estimate/` and `components/pdf/contract/`**: Two separate PDF document trees. They share styles via `pdf/shared/` but are otherwise independent. `@react-pdf/renderer` uses its own primitives (`<Document>`, `<Page>`, `<View>`, `<Text>`) that are not interchangeable with HTML/React DOM elements.
- **`components/estimate-form/LineItemSection.tsx`**: A single reusable component used 5 times (Plant Material, Labor, Other Materials, Design Fee, Supervision). Each instance receives its section key, title, and catalog filter category.
- **`data/contract-defaults.json`**: Pre-populated contract boilerplate text (terms, warranty, exclusions, change orders) in a friendly, non-legalese tone. Loaded into Settings on first launch.
- **Flat, shallow hierarchy**: No deeply nested folders. Every file is at most 3 levels deep from `src/`. Easy to navigate.

---

## 12. Future Considerations

These are explicitly **out of scope** for v1 but noted for awareness:

- **Client database**: v1 stores client info per-estimate. A future version could add a client list with autocomplete.
- **Photo attachments**: Embedding site photos in the PDF estimate.
- **E-signature**: Canvas-based signature capture or DocuSign integration for the contract.
- **Email sending**: Sending PDFs directly from the app (would require a backend or email API).
- **Multi-device sync**: Using a cloud database (Supabase, Firebase) instead of localStorage.
- **Estimate templates**: Save an estimate as a template for similar projects.
- **QuickBooks / accounting integration**: Export estimates in a format compatible with accounting software.
- **Progressive Web App (PWA)**: Add service worker for offline support and "install to home screen" on iPad.
- **Material cost tracking**: Track wholesale cost vs. client price for profit margin visibility.

---

## Summary of Key Architectural Decisions

| Decision | Choice | Key Reason |
|---|---|---|
| **Document model** | **Two separate PDFs: Estimate (pricing) + Contract (terms)** | **Clean separation; estimate is focused, contract is mostly static** |
| Framework | React + Vite + TypeScript | Best ecosystem for PDF generation and UI components |
| Styling | Tailwind CSS + shadcn/ui | Professional look with minimal CSS effort |
| PDF | `@react-pdf/renderer` | True vector PDFs, React-based, no server needed |
| Storage | localStorage + JSON export/import | Zero ops, sufficient for single user |
| Autocomplete | shadcn/ui Combobox + static catalog JSON | Simple, fast, no external dependencies |
| State | React Context + useReducer | Built-in, adequate for single-form app |
| Hosting | Vercel (free tier, static) | Zero-config, auto-deploy, HTTPS, custom domain |
| Print | PDF download (primary) + CSS @media print (secondary) | PDF for consistency, print for convenience |
| Logo | Base64 in localStorage | Portable, embedded in data, no file server needed |
| Line item structure | 5 fixed sections (not flat list with categories) | Matches Nancy's workflow: Plant Material, Labor, Other Materials, Design Fee, Supervision |
| Tax | Applied to Plant Material + Other Materials only | Standard practice: tax on materials, not on labor/design fees |
