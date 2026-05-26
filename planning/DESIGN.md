# UI/UX Design Specification
## Nancy Lyons Garden Design - Estimate Builder

**Version:** 2.0
**Date:** February 25, 2026
**Author:** Design Agent
**Change from v1:** Scope split into two documents (Estimate + Contract).
Nancy's feedback incorporated: section order, free-form input, custom sections,
container sizes, warranty, payment terms, revision tracking, and tone.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Two-Document Architecture](#2-two-document-architecture)
3. [Brand Identity](#3-brand-identity)
4. [Estimate Editor View](#4-estimate-editor-view)
5. [Estimate PDF Output](#5-estimate-pdf-output)
6. [Contract Template](#6-contract-template)
7. [Component Specifications](#7-component-specifications)
8. [Interaction Patterns](#8-interaction-patterns)
9. [Responsive Considerations](#9-responsive-considerations)

---

## 1. Design Philosophy

The tool produces two separate documents with different purposes:

**ESTIMATE** -- A clean pricing document. This is the main interactive build.
Nancy creates it in an editor and exports it as a beautiful branded PDF. It
contains ONLY: company header, client info, project description, itemized
pricing by section, tax, and grand total. No terms, no warranty, no legalese.

**CONTRACT** -- A separate agreement document. Mostly static template text
with a few fill-in fields. References the Estimate by number. Contains payment
schedule, terms & conditions, warranty, exclusions, and signature block.

Within the Estimate, there are two views:

**EDITOR VIEW** -- Nancy's workspace. Optimized for speed and efficiency.
- Free-form text input is the primary mode (every project is unique)
- Autocomplete suggestions assist but never constrain
- Real-time calculations as she types
- Quick add/remove/reorder of items
- Custom sections (front yard, back yard, etc.)

**PDF OUTPUT VIEW** -- What the client receives. Optimized for beauty and trust.
- Reflects Nancy's design sensibility: elegant, natural, refined
- The estimate is a sales tool -- it should feel like a premium experience
- Clean typography, generous whitespace, earthy color palette
- Pricing only -- no legal text cluttering the presentation

---

## 2. Two-Document Architecture

### Document 1: Estimate (interactive build)

The primary product. Nancy builds this in the editor.

**Contents:**
- Company header / logo
- Client name, address, date, estimate number
- Project description (free text)
- Pricing sections (in Nancy's preferred order):
  1. Plant Material
  2. Labor
  3. Other Materials
  4. Design Fee ($195/hr)
  5. Installation Supervision & Meetings ($195/hr)
  6. (Plus any custom sections Nancy adds)
- Subtotals per section
- Sales tax on materials only
- Grand total
- Optional discount

**NOT included in estimate:** Payment terms, warranty, exclusions, terms &
conditions, signature block. These all live in the Contract.

### Document 2: Contract (template with fill-ins)

A mostly-static document. Nancy fills in a few fields; the rest is pre-written
template text in a warm, friendly tone.

**Fill-in fields:**
- Estimate number and date (auto-linked from Estimate)
- Client name and address (auto-linked from Estimate)
- Grand total (auto-linked from Estimate)

**Template sections (pre-written, editable):**
- Payment schedule:
  - All plant material payment due at time of ordering
  - Hardscape materials and irrigation supplies due at time of ordering
  - 50% of design fee due as deposit
  - Remaining balance due upon completion
- Terms & conditions (friendly, warm tone)
- Warranty:
  - 30-day plant warranty, contingent on proper irrigation
  - 1-year hardscape warranty
- Exclusions
- Change order process
- Digital signature / acceptance block

### How They Connect

```
  [Estimate Editor] --builds--> [Estimate PDF]
         |                            |
         |  (links by est. number)    |
         v                            v
  [Contract Editor] --builds--> [Contract PDF]
         |
         +-- auto-fills: client info, est. #, date, total
         +-- template text: payment, terms, warranty, exclusions
         +-- signature block with digital signature
```

---

## 3. Brand Identity

### Color Palette

Evokes California natural landscapes -- earth, stone, foliage -- while feeling
refined and contemporary.

```
PRIMARY COLORS
-------------------------------------------------------
Sage Green      #6B7F5E    Primary brand / headings / accents
Deep Forest     #2D3B2D    Dark text, headers on PDF
Warm Stone      #A89F91    Secondary accent, borders, rules

BACKGROUND & NEUTRAL
-------------------------------------------------------
Parchment       #F5F1EB    PDF background, light warm off-white
Linen           #FAF8F5    Editor background
Pure White      #FFFFFF    Cards, input fields, table cells
Warm Gray       #E8E4DE    Subtle borders, section dividers

ACCENT & FUNCTIONAL
-------------------------------------------------------
Terracotta      #C4745A    Call-to-action, totals highlight
Gold Leaf       #B8973A    Subtle accent for premium feel
Soft Blue       #7A9BB5    Links, info states
Alert Red       #C45A5A    Errors, delete actions
```

### Typography

**PDF Output (print/export):**
- Headings: **Cormorant Garamond** (serif) - elegant, editorial, garden-catalogue feel
  - H1: 28pt, Deep Forest, 600 weight
  - H2: 18pt, Sage Green, 600 weight
  - H3: 14pt, Deep Forest, 500 weight
- Body text: **Source Sans 3** (sans-serif) - highly legible, warm, professional
  - Body: 10pt, Deep Forest, 400 weight
  - Table data: 9.5pt
  - Small text: 8pt, Warm Stone

**Editor View (screen):**
- All UI text: **Inter** (sans-serif) - optimized for screen, great at small sizes
  - Labels: 12px, 500 weight
  - Input text: 14px, 400 weight
  - Section headers: 16px, 600 weight
  - Small helper text: 11px, 400 weight, Warm Stone

**Font Loading:** All fonts available via Google Fonts. Use `font-display: swap`.

### Logo

Nancy wants a botanical illustration of a California native plant.
Recommended: **California Poppy (Eschscholzia californica)** -- state flower,
iconic, elegant silhouette, scales well from favicon to PDF header.

- **PDF header:** Top-left, max 200px wide x 60px tall
- **Editor navbar:** Top-left, max 140px wide x 36px tall
- Format: SVG for crisp rendering at all sizes
- Fallback: Styled text "Nancy Lyons Garden Design" in Cormorant Garamond

---

## 4. Estimate Editor View

### Overall Layout

Single-column layout with a fixed top bar. Feels like a modern form builder.

### Default Section Order (Nancy's preference)

1. Client Info (header fields)
2. Project Info (name, address, date, description)
3. **Plant Material** (FIRST pricing section -- this is Nancy's primary focus)
4. **Labor**
5. **Other Materials**
6. **Design Fee** ($195/hr default)
7. **Installation Supervision & Meetings** ($195/hr default)
8. (Custom sections Nancy adds: e.g., "Front Yard Plants", "Back Yard Labor")
9. Totals (auto-calculated, always last)

### ASCII Mockup: Estimate Editor

```
+==================================================================+
| [Logo]  Nancy Lyons Garden Design     [Estimates v] [+ New] [?]  |
+==================================================================+
|                                                                    |
|  ESTIMATE #1042  (v1)                        Status: DRAFT [v]    |
|  Last saved 2:34 PM                                                |
|  _______________________________________________________________   |
|                                                                    |
|  +--- CLIENT & PROJECT INFO ------------------------------+       |
|  |                                                         |       |
|  |  Client Name    [Sarah & Tom Mitchell_____]             |       |
|  |  Address        [742 Hillside Drive_______]             |       |
|  |  City/State/Zip [Sausalito______] [CA] [94965]          |       |
|  |  Phone          [(415) 555-0234___]                     |       |
|  |  Email          [smitchell@email.com]                   |       |
|  |                                                         |       |
|  |  Project Name   [Front Yard Renovation____]             |       |
|  |  Site Address   [________________________]  [x] Same    |       |
|  |  Date           [02/25/2026]                            |       |
|  |  Valid Until     [03/27/2026]   (30 days)               |       |
|  |                                                         |       |
|  |  Project Description                                    |       |
|  |  [Complete front yard renovation including drought-   ] |       |
|  |  [tolerant planting, flagstone pathway, drip          ] |       |
|  |  [irrigation, and landscape lighting.                 ] |       |
|  |                                                         |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- PLANT MATERIAL ---------[+ Add Item]---[collapse ^]-+       |
|  |                                                         |       |
|  |  ::  Lavandula angustifolia 'Hidcote'                   |       |
|  |      Size [#5 v]  Qty [12]  Each [$28.00]  = $336.00   |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  Acer palmatum 'Bloodgood'                          |       |
|  |      Size [24"box v] Qty [1] Each [$450.00] = $450.00  |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  Ceanothus 'Dark Star'                              |       |
|  |      Size [#5 v]  Qty [6]  Each [$32.00]   = $192.00   |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Type description or search plants...      ]       |       |
|  |                                                         |       |
|  |                        Subtotal:          $978.00       |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- LABOR ----------------------------[+ Add Item]------+       |
|  |                                                         |       |
|  |  ::  [Irrigation installation - drip, 3 zones  ]        |       |
|  |      Qty [1]  Unit [lot v]  Rate [$8,400]  = $8,400.00 |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Grading and drainage along north fence   ]        |       |
|  |      Qty [450]  Unit [sq ft v] Rate [$2.50]= $1,125.00 |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Flagstone pathway installation, dry-laid ]        |       |
|  |      Qty [120]  Unit [sq ft v] Rate [$35]  = $4,200.00 |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Type description...                       ]       |       |
|  |                                                         |       |
|  |                        Subtotal:       $13,725.00       |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- OTHER MATERIALS --------------------[+ Add Item]----+       |
|  |                                                         |       |
|  |  ::  [Flagstone, Arizona buff irregular ]               |       |
|  |      Qty [120]  Unit [sq ft v] Rate [$12] = $1,440.00  |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [DG with stabilizer                ]               |       |
|  |      Qty [3]  Unit [cu yd v]  Rate [$225] = $675.00    |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Path lights, brass, 8-pack       ]                |       |
|  |      Qty [1]  Unit [lot v]  Rate [$1,400] = $1,400.00  |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Type description...                       ]       |       |
|  |                                                         |       |
|  |                        Subtotal:        $3,515.00       |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- DESIGN FEE ---------------------[+ Add Item]--------+       |
|  |                                                         |       |
|  |  ::  [Design development and plan set   ]               |       |
|  |      Qty [14]  Unit [hr v]  Rate [$195]  = $2,730.00   |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Type description...                       ]       |       |
|  |                                                         |       |
|  |                        Subtotal:        $2,730.00       |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- INSTALLATION SUPERVISION & MEETINGS -[+ Add Item]---+       |
|  |                                                         |       |
|  |  ::  [On-site supervision during installation   ]       |       |
|  |      Qty [8]  Unit [hr v]  Rate [$195]   = $1,560.00   |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Client walkthrough meetings       ]               |       |
|  |      Qty [3]  Unit [hr v]  Rate [$195]   = $585.00     |       |
|  |                                                   [x]   |       |
|  |                                                         |       |
|  |  ::  [Type description...                       ]       |       |
|  |                                                         |       |
|  |                        Subtotal:        $2,145.00       |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  [+ Add Custom Section]                                            |
|                                                                    |
|  +--- TOTALS -------------------------------------------------+   |
|  |                                                             |   |
|  |   Plant Material:                           $978.00        |   |
|  |   Labor:                                 $13,725.00        |   |
|  |   Other Materials:                        $3,515.00        |   |
|  |   Design Fee:                             $2,730.00        |   |
|  |   Installation Supervision & Meetings:    $2,145.00        |   |
|  |                                         ___________        |   |
|  |   Subtotal:                              $23,093.00        |   |
|  |                                                             |   |
|  |   Tax on Materials (8.25%):  [x]          $  370.67        |   |
|  |     Taxable: Plant Material, Other Materials                |   |
|  |   Discount:  [$ ____] or [___ %]         $    0.00         |   |
|  |                                         ===========        |   |
|  |   GRAND TOTAL:                           $23,463.67        |   |
|  |                                                             |   |
|  +-------------------------------------------------------------+  |
|                                                                    |
|  [Save Draft]    [Preview PDF]    [Export PDF]                     |
|                                                                    |
+====================================================================+
```

### Section Behavior Details

**Default sections (5):**
1. Plant Material -- Size dropdown + Qty + Each + total
2. Labor -- free-form description + Qty + Unit + Rate + total
3. Other Materials -- free-form description + Qty + Unit + Rate + total
4. Design Fee -- defaults unit to "hr", rate to $195
5. Installation Supervision & Meetings -- defaults unit to "hr", rate to $195

**Custom sections:**
Nancy clicks [+ Add Custom Section] and:
1. Types a section name (e.g., "Front Yard Plants" or "Back Yard Labor")
2. Chooses a section type that determines the line item structure:
   - "Plant" type: has Size dropdown (same as Plant Material)
   - "Standard" type: has Qty / Unit / Rate (same as Labor, Other Materials)
   - "Hourly" type: defaults unit to "hr" (same as Design Fee)
3. Chooses whether the section is taxable (materials) or non-taxable (labor/fees)
4. Section appears above the Totals block, can be reordered by dragging

**Section reordering:** Sections themselves can be drag-reordered (not just
items within sections). The Totals block always stays at the bottom.

**Each section is collapsible.** Collapsed view shows: SECTION NAME ..... $subtotal

**Free-form input is primary.** The description/name field in every line item
is a plain text input. Nancy types whatever she wants. Autocomplete suggestions
appear as a helpful overlay but the field always accepts free text. Pressing
Enter or Tab with typed text (even with no autocomplete match) creates the item.

### What Was Removed from Editor (moved to Contract)

The following sections from v1 are NO LONGER in the Estimate editor:
- Payment Schedule selector
- Warranty section
- Exclusions section
- Terms & conditions
- Notes to client
- Signature / acceptance block

This makes the editor significantly simpler and more focused.

---

## 5. Estimate PDF Output

The Estimate PDF is now a clean pricing document only. No terms, no signature,
no legal text. This makes it visually cleaner and more focused as a sales piece.

### PDF Page Layout

- **Page size:** US Letter (8.5" x 11")
- **Margins:** 0.75" left/right, 0.6" top, 0.8" bottom
- **Content width:** 7.0"
- **Background:** Parchment (#F5F1EB)

### ASCII Mockup: Estimate PDF - Page 1

```
.--------------------------------------------------------------------.
|                                                                      |
|   [LOGO - California Poppy botanical illustration]                   |
|   Nancy Lyons Garden Design                                          |
|   123 Oak Street, Mill Valley, CA 94941                              |
|   (415) 555-0192  |  nancy@nancylyons.com                           |
|   CSLB# 1054789  |  nancylyonsgardendesign.com                      |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|                                                                      |
|           L A N D S C A P E    E S T I M A T E                       |
|                                                                      |
|                                                                      |
|   Prepared for                         Estimate #1042                |
|   ____________                         Date: February 25, 2026       |
|   Sarah & Tom Mitchell                 Valid through: March 27, 2026 |
|   742 Hillside Drive                                                 |
|   Sausalito, CA 94965                                                |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|                                                                      |
|   PROJECT DESCRIPTION                                                |
|                                                                      |
|   Complete front yard renovation including drought-tolerant           |
|   planting design, new flagstone pathway with decomposed granite     |
|   borders, drip irrigation system, and landscape lighting.           |
|                                                                      |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|                                                                      |
|   PLANT MATERIAL                                                     |
|   ................................................................   |
|                                                                      |
|   Plant                     Size    Qty    Each       Amount         |
|   -----------------------   ------  ----   --------  ---------       |
|   Lavandula angustifolia      #5     12      $28.00    $336.00       |
|     'Hidcote'                                                        |
|                                                                      |
|   Acer palmatum             24"box    1     $450.00    $450.00       |
|     'Bloodgood'                                                      |
|                                                                      |
|   Ceanothus 'Dark Star'      #5      6      $32.00    $192.00       |
|                                                                      |
|                                              Subtotal      $978.00   |
|                                                          _________   |
|                                                                      |
|                                                                      |
|   LABOR                                                              |
|   ................................................................   |
|                                                                      |
|   Description                    Qty   Unit    Rate       Amount     |
|   ----------------------------   ----  ------  --------  ---------   |
|   Irrigation installation          1   lot    $8,400    $8,400.00    |
|     Drip system, 3 zones                                             |
|                                                                      |
|   Grading and drainage           450   sq ft     $2.50  $1,125.00   |
|     Along north fence                                                |
|                                                                      |
|   Flagstone pathway              120   sq ft    $35.00  $4,200.00   |
|     Installation, dry-laid                                           |
|                                                                      |
|                                             Subtotal   $13,725.00   |
|                                                          _________   |
|                                                                      |
|                                                                      |
|   _________________________                                          |
|   Nancy Lyons Garden Design               Page 1 of 2               |
|                                                                      |
.--------------------------------------------------------------------.
```

### ASCII Mockup: Estimate PDF - Final Page (Totals)

```
.--------------------------------------------------------------------.
|                                                                      |
|   [small logo]          Nancy Lyons Garden Design   Est. #1042       |
|   ________________________________________________________________   |
|                                                                      |
|                                                                      |
|   OTHER MATERIALS                                                    |
|   ................................................................   |
|                                                                      |
|   Description                    Qty   Unit    Rate       Amount     |
|   ----------------------------   ----  ------  --------  ---------   |
|   Flagstone, Arizona buff        120   sq ft    $12.00   $1,440.00   |
|     Irregular                                                        |
|                                                                      |
|   DG with stabilizer               3   cu yd  $225.00     $675.00   |
|                                                                      |
|   Path lights, brass                1   lot  $1,400.00   $1,400.00   |
|                                                                      |
|                                              Subtotal    $3,515.00   |
|                                                          _________   |
|                                                                      |
|                                                                      |
|   DESIGN FEE                                                         |
|   ................................................................   |
|                                                                      |
|   Design development               14   hr    $195.00   $2,730.00   |
|     and plan set                                                     |
|                                                                      |
|                                              Subtotal    $2,730.00   |
|                                                          _________   |
|                                                                      |
|                                                                      |
|   INSTALLATION SUPERVISION & MEETINGS                                |
|   ................................................................   |
|                                                                      |
|   On-site supervision                8   hr    $195.00   $1,560.00   |
|   Client walkthrough mtgs            3   hr    $195.00     $585.00   |
|                                                                      |
|                                              Subtotal    $2,145.00   |
|                                                          _________   |
|                                                                      |
|                                                                      |
|   +------------------------------------------------------+          |
|   |                                                      |          |
|   |   PROJECT SUMMARY                                    |          |
|   |   ................................................   |          |
|   |                                                      |          |
|   |   Plant Material                       $978.00       |          |
|   |   Labor                             $13,725.00       |          |
|   |   Other Materials                    $3,515.00       |          |
|   |   Design Fee                         $2,730.00       |          |
|   |   Installation Supervision           $2,145.00       |          |
|   |                                     __________       |          |
|   |   Subtotal                          $23,093.00       |          |
|   |   Sales Tax on Materials (8.25%)       $370.67       |          |
|   |                                     ==========       |          |
|   |   TOTAL                             $23,463.67       |          |
|   |                                                      |          |
|   +------------------------------------------------------+          |
|                                                                      |
|                                                                      |
|   This estimate is valid for 30 days from the date above.            |
|   A separate contract with payment terms, warranty, and              |
|   conditions will accompany this estimate.                           |
|                                                                      |
|                                                                      |
|   _________________________                                          |
|   Nancy Lyons Garden Design               Page 2 of 2               |
|                                                                      |
.--------------------------------------------------------------------.
```

### PDF Design Details

**Header (Page 1):**
- Logo top-left, roughly 2" wide
- Company name in Cormorant Garamond, 22pt, Deep Forest
- Contact info in Source Sans 3, 9pt, Warm Stone
- CSLB# displayed prominently (California legal requirement)

**Header (Pages 2+):**
- Condensed: small logo left, company name center, estimate # right
- Thin Sage Green rule (0.5pt) separating header from content

**Title Block:**
- "LANDSCAPE ESTIMATE" in Cormorant Garamond, letterspaced, centered
- Client info left-aligned, estimate metadata right-aligned
- For revised estimates: "REVISED ESTIMATE (v2)" with original date noted

**Section Headers:**
- Cormorant Garamond, 14pt, Sage Green, all caps, letterspaced
- Dotted leader line beneath in Warm Stone

**Table Formatting:**
- No visible cell borders -- alignment and whitespace only
- Column headers: Source Sans 3, 9pt, Warm Stone, right-aligned for numbers
- Data rows: Source Sans 3, 10pt, Deep Forest
- Notes/sub-descriptions: indented, italic, Warm Stone, 9pt
- Subtotal: right-aligned, preceded by thin rule

**Totals Box:**
- 1pt Sage Green border, White background
- "TOTAL" in Cormorant Garamond, bold, Terracotta
- Grand total amount in 16pt, Terracotta

**Closing Note:**
- Brief note that a separate contract accompanies the estimate
- No terms, warranty, or signature on the estimate PDF

**Footer:**
- Company name left, page number right, thin Warm Stone rule above

**Multi-Page Handling:**
- Never break mid-item; move entire item to next page if it won't fit
- Section headers must not orphan at bottom of page (1.5" threshold)
- Totals box should appear on the final page; push to new page if needed

---

## 6. Contract Template

The Contract is a separate document, mostly pre-written template text with
auto-filled fields from the linked Estimate.

### Contract Editor

Much simpler than the Estimate editor. It is a form with pre-populated
template text that Nancy can review and customize per project.

```
+==================================================================+
| [Logo]  Nancy Lyons Garden Design          [Contracts v] [+ New] |
+==================================================================+
|                                                                    |
|  CONTRACT for Estimate #1042                                       |
|  Client: Sarah & Tom Mitchell                                      |
|  _______________________________________________________________   |
|                                                                    |
|  +--- LINKED ESTIMATE ------------------------------------+       |
|  |  Estimate #1042  |  Feb 25, 2026  |  $23,463.67        |       |
|  |  [Change linked estimate v]                             |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- PAYMENT SCHEDULE (editable) ------------------------+       |
|  |                                                         |       |
|  |  [All plant material payment ($978.00) due at time   ]  |       |
|  |  [of ordering plants.                                ]  |       |
|  |                                                         |       |
|  |  [Hardscape materials and irrigation supplies        ]  |       |
|  |  [($3,515.00) due at time of ordering.               ]  |       |
|  |                                                         |       |
|  |  [50% of design fee ($1,365.00) due as deposit.      ]  |       |
|  |                                                         |       |
|  |  [Remaining balance due upon project completion.     ]  |       |
|  |                                                         |       |
|  |  Accepted methods: [Check, Venmo, Zelle______]          |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- TERMS & CONDITIONS (editable) ----------------------+       |
|  |                                                         |       |
|  |  [We're excited to bring your garden vision to life!  ] |       |
|  |  [Here's what you can expect from working with us:    ] |       |
|  |  [                                                    ] |       |
|  |  [This agreement covers the scope of work described   ] |       |
|  |  [in Estimate #1042. Any changes or additions to the  ] |       |
|  |  [project will be discussed with you first and        ] |       |
|  |  [confirmed in a written change order before work     ] |       |
|  |  [proceeds...                                         ] |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- WARRANTY (editable) --------------------------------+       |
|  |                                                         |       |
|  |  [We stand behind our plants! All plant material is   ] |       |
|  |  [covered for 30 days from installation, as long as   ] |       |
|  |  [the irrigation system is running and the watering   ] |       |
|  |  [schedule we provide is followed. If a plant doesn't ] |       |
|  |  [make it, we'll replace it -- just the plant itself, ] |       |
|  |  [not the labor for replanting.                       ] |       |
|  |  [                                                    ] |       |
|  |  [Hardscape work (patios, walkways, walls) is covered ] |       |
|  |  [for 1 year against defects in workmanship.          ] |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- EXCLUSIONS (editable) ------------------------------+       |
|  |                                                         |       |
|  |  [A few things that aren't included in this project:  ] |       |
|  |  [- Utility locates and any underground surprises     ] |       |
|  |  [- Permit fees (if required)                         ] |       |
|  |  [- Hauling soil beyond what's specified              ] |       |
|  |  [- Ongoing maintenance after installation            ] |       |
|  |  [- Pest or disease treatment after planting          ] |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- CHANGE ORDERS (editable) ---------------------------+       |
|  |                                                         |       |
|  |  [Gardens evolve! If you'd like to add or change      ] |       |
|  |  [anything during the project, we'll talk it through  ] |       |
|  |  [and provide a written change order with updated     ] |       |
|  |  [pricing before any additional work begins.          ] |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  +--- SIGNATURE BLOCK ------------------------------------+       |
|  |                                                         |       |
|  |  By signing, you agree to the terms above and          |       |
|  |  authorize Nancy Lyons Garden Design to proceed.       |       |
|  |                                                         |       |
|  |  Client Signature:  [digital signature pad area]        |       |
|  |  Printed Name:      [________________________]          |       |
|  |  Date:              [auto-filled, editable___]          |       |
|  |                                                         |       |
|  |  Designer:          [Nancy's saved signature]           |       |
|  |  Date:              [auto-filled_____________]          |       |
|  +---------------------------------------------------------+       |
|                                                                    |
|  [Save Draft]    [Preview PDF]    [Export PDF]    [Send for Sig.]  |
|                                                                    |
+====================================================================+
```

### Contract PDF Output

The Contract PDF uses the same brand styling as the Estimate PDF (same fonts,
colors, logo) but is a text-heavy document rather than a table-heavy one.

The Contract PDF is simpler to generate -- it is mostly rendered text blocks
with the signature area at the bottom.

### Digital Signature

The [Send for Signature] flow:
1. Nancy previews the contract PDF
2. Clicks "Send for Signature" -- enters client email
3. Client receives a link to view the contract in-browser
4. Client sees a clean rendered view with a signature pad at the bottom
5. Client draws/types their signature, clicks "Accept & Sign"
6. Signed PDF is generated and stored; both parties receive a copy
7. Contract status updates to SIGNED

For v1, a simpler approach is acceptable: Nancy exports the PDF, client
signs physically or via a third-party e-sign tool, and Nancy marks the
contract as signed manually.

---

## 7. Component Specifications

### 7.1 Line Item Input (Free-Form Primary)

The description field is a plain text input. Nancy types whatever she wants.
Autocomplete suggestions appear as an optional overlay.

**Behavior:**
1. Nancy types freely in the description field
2. After 2+ characters, if matches exist in the database, a suggestion
   dropdown appears *below* the input
3. Nancy can IGNORE suggestions entirely and just keep typing + Tab/Enter
4. OR she can arrow-down into the dropdown and select a suggestion
5. Selecting a suggestion fills in the description and populates default
   unit/rate values
6. At no point is Nancy forced to select from the dropdown

This is the critical design change from v1: **free text first, suggestions
second.**

```
  Description field with optional suggestions:

  +--------------------------------------------------+
  | [Lavender, Hidcote, 5-gal___       ]             |  <-- Nancy types freely
  +--------------------------------------------------+
  |  Lavandula angustifolia 'Hidcote'     #5  $28    |  <-- optional dropdown
  |  Lavandula angustifolia 'Munstead'    #5  $26    |
  |  .................................................|
  |  (press Tab or Enter to use your own description) |
  +--------------------------------------------------+

  Pressing Tab with "Lavender, Hidcote, 5-gal" typed:
  --> Creates line item with that exact text as description
  --> Cursor moves to Size or Qty field
  --> No database lookup needed
```

### 7.2 Line Item Structures by Section Type

**Plant-type sections** (Plant Material and custom plant sections):
```
  [drag] [Description_______________]  Size [___v]  Qty [___]  Each [$_____]  = $total  [x]
```

**Standard-type sections** (Labor, Other Materials, and custom standard sections):
```
  [drag] [Description_______________]  Qty [___]  Unit [____v]  Rate [$_____]  = $total  [x]
```

**Hourly-type sections** (Design Fee, Installation Supervision):
```
  [drag] [Description_______________]  Hrs [___]  Rate [$195.00]              = $total  [x]
```
- Rate pre-filled with $195, editable
- Unit locked to "hr" (no dropdown)

**Container Size dropdown** (plant-type only):
4", 6", #1, #2, #3, #5, #7, #10, #15, #25, 24" box, 36" box, flat

(Removed from v1: bare root, 48" box)

### 7.3 Section Component

```
  +--- SECTION NAME -----[collapse ^]---[+ Add Item]---[...]-+
  |                                                           |
  |  [line item 1]                                            |
  |  [line item 2]                                            |
  |  [line item 3]                                            |
  |  [input field for new item]                               |
  |                                                           |
  |                          Subtotal:       $X,XXX.XX        |
  +-----------------------------------------------------------+
```

- Section header: 16px, Inter, 600 weight, Deep Forest, uppercase
- Left border: 3px solid Sage Green
- Collapse toggle: chevron rotates on collapse
- Collapsed: SECTION NAME ..... $subtotal
- [...] menu: Rename section, Change type, Toggle taxable, Delete section
- Sections are drag-reorderable (handle on the section header)

### 7.4 Totals Component

```
  +--- TOTALS --------------------------------------------------+
  |                                                               |
  |   Plant Material:                            $978.00         |
  |   Labor:                                  $13,725.00         |
  |   Other Materials:                         $3,515.00         |
  |   Design Fee:                              $2,730.00         |
  |   Installation Supervision & Meetings:     $2,145.00         |
  |                                          ___________         |
  |   Subtotal:                               $23,093.00         |
  |                                                               |
  |   Tax on Materials (8.25%):  [x on] [rate]   $370.67         |
  |     Applied to: Plant Material, Other Materials               |
  |   Discount:  [$ ____] or [___ %]             ($0.00)         |
  |                                          ===========         |
  |   GRAND TOTAL:                            $23,463.67         |
  |                                                               |
  +---------------------------------------------------------------+
```

- Dynamically lists all sections (including custom ones)
- Tax checkbox: on/off, with editable rate (default 8.25%)
- Shows which sections are taxable (sections flagged as material-type)
- Discount: toggle flat $ or percentage
- Grand total: Terracotta, 20px, bold

### 7.5 Revision Indicator

When an estimate has been revised:
```
  ESTIMATE #1042  (v2 - revised)              Status: DRAFT [v]
  Original: v1, Feb 20, 2026  [view v1]
  Last saved 2:34 PM
```

- Version number displayed next to estimate number
- Link to view previous versions (read-only)
- PDF header shows "REVISED ESTIMATE (v2)" when version > 1

---

## 8. Interaction Patterns

### 8.1 Adding a Line Item

1. Nancy clicks [+ Add Item] or tabs into the input at section bottom
2. She types a free-form description (e.g., "Lavender, Hidcote, 5-gal")
3. If suggestions exist, they appear below -- she can ignore them
4. She presses Tab or Enter to commit the description
5. Cursor moves to the next field (Size for plants, Qty for standard)
6. She fills in Qty, Rate/Each
7. Line total and subtotals update immediately

**Key principle:** Tab/Enter always works. Nancy never has to interact with
the dropdown. It is help, not a gate.

### 8.2 Reordering

- **Line items within a section:** drag via :: handle
- **Sections:** drag via section header handle
- Totals always remain at bottom, not draggable

### 8.3 Deleting

- Line items: click [x], fade out, undo toast (8 seconds)
- Sections: [...] menu > Delete section (confirms if section has items)

### 8.4 Real-Time Calculations

- Line total = Qty x Rate (or Hrs x Rate for hourly)
- Section subtotal = sum of line totals
- Overall subtotal = sum of all section subtotals
- Tax = sum of taxable section subtotals x tax rate
- Grand total = subtotal + tax - discount

### 8.5 Saving and Versioning

- Auto-save every 30 seconds and on field blur
- Manual [Save Draft] always available
- "Last saved" timestamp displayed
- **Revision flow:**
  1. Nancy sends estimate to client (status: SENT)
  2. Client requests changes
  3. Nancy opens the estimate and clicks [Create Revision]
  4. System duplicates estimate as v2, archives v1 (read-only)
  5. Nancy edits v2 freely
  6. Previous versions viewable via [view v1] link

### 8.6 Template / Reuse

- From the estimate list: [...] menu > "Duplicate" or "Use as Template"
- Creates a new estimate with same sections and line items
- Clears: client info, date, estimate number (generates new)
- Keeps: all line items, section structure, pricing

### 8.7 PDF Export

- [Preview PDF] opens a modal showing the formatted Estimate PDF
- [Export PDF] downloads the file
- Estimate PDF contains pricing only -- clean and focused
- Contract PDF is generated separately from the Contract editor

---

## 9. Responsive Considerations

**Desktop (1024px+):** Full editor layout as designed.

**Tablet (768-1023px):** Single column, compressed. Section collapse is important.

**Mobile (below 768px):** Read-only view of estimates. No editing in v1.

---

## Appendix A: Page Flow

```
  ESTIMATES                          CONTRACTS
  ---------                          ---------
  [List] --> [Editor] --> [PDF]      [List] --> [Editor] --> [PDF]
                |                                  |
                +--- auto-save                     +--- auto-fill from estimate
                |                                  +--- template text
                +--- revision tracking             +--- digital signature
```

## Appendix B: Estimate Status Flow

```
  DRAFT --> SENT --> ACCEPTED
    |         |
    |         +---> REVISED (creates new version)
    |                  |
    |                  +--> SENT (v2) --> ACCEPTED
    |
    +---> DECLINED
```

## Appendix C: Tax Rules

- Sales tax applies to materials only, not labor or professional fees
- Default rate: 8.25% (editable per county)
- Taxable by default: Plant Material, Other Materials
- Non-taxable by default: Labor, Design Fee, Installation Supervision
- Custom sections: Nancy chooses taxable/non-taxable when creating
- Tax displayed as a separate line in Totals

## Appendix D: Section Type Reference

| Section Type | Fields per Line Item         | Default Unit | Taxable? |
|-------------|------------------------------|-------------|----------|
| Plant       | Description, Size, Qty, Each | (size dropdown) | Yes |
| Standard    | Description, Qty, Unit, Rate | ea          | Varies   |
| Hourly      | Description, Hrs, Rate       | hr          | No       |

Default sections and their types:
| Section Name                        | Type     | Taxable | Default Rate |
|-------------------------------------|----------|---------|-------------|
| Plant Material                      | Plant    | Yes     | --          |
| Labor                               | Standard | No      | --          |
| Other Materials                     | Standard | Yes     | --          |
| Design Fee                          | Hourly   | No      | $195        |
| Installation Supervision & Meetings | Hourly   | No      | $195        |
