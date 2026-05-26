# Nancy Lyons Garden Design - Estimate Builder Tool
### Full Proposal for Review

**Prepared:** February 25, 2026
**Version:** 2 (Updated with design mockups and team review)

---

## What We're Building

A custom estimate builder designed specifically for your landscape design business. You'll be able to quickly create professional, beautifully branded estimates, export them as PDFs, and print them — all without needing any technical skills.

No monthly subscription fees. No complex software to learn. Just open it in your browser, build an estimate, and send a beautiful PDF to your client.

---

## How It Would Work

1. **Open the tool** in your web browser (works on desktop and iPad)
2. **Fill in client info** — name, address, estimate date
3. **Add labor/services** — type a description like "Remove bamboo to let in more light" and set the price
4. **Add plant materials** — start typing a plant name and pick from a pre-loaded list (or type your own). Set quantity and unit price — the line total calculates automatically
5. **Add more sections as needed** — hardscape materials, irrigation supplies, soil/mulch, etc.
6. **Review** — subtotals and grand total calculate automatically
7. **Export as PDF** or **Print** — beautiful, branded output with your logo

---

## The Design

### Brand Colors

We chose an earthy, natural palette that evokes California landscapes — elegant and contemporary, not rustic:

| Color | Hex | Use |
|---|---|---|
| Sage Green | `#6B7F5E` | Primary brand color, headings, accents |
| Deep Forest | `#2D3B2D` | Text and headers |
| Warm Stone | `#A89F91` | Secondary accent, borders, subtle details |
| Parchment | `#F5F1EB` | PDF background (warm off-white) |
| Terracotta | `#C4745A` | Totals, call-to-action highlights |

### Typography

- **Headings on PDF:** Cormorant Garamond (serif) — elegant, editorial, garden-catalog feel
- **Body text on PDF:** Source Sans 3 — highly legible, warm, professional
- **Editor interface:** Inter — clean and modern for screen use

---

## What the Editor Looks Like

This is where you build your estimates. It's designed for speed — type, tab, type, tab. Everything calculates automatically as you go.

```
+==================================================================+
| [Logo]  Nancy Lyons Garden Design        [Estimates] [+ New] [?]  |
+==================================================================+
|                                                                    |
|  ESTIMATE #NL-2026-001                   Date: [02/25/2026]       |
|                                                                    |
|  CLIENT INFO                                                       |
|  Name:     [Sarah & Tom Mitchell          ]                        |
|  Address:  [742 Hillside Drive            ]                        |
|  City:     [Sausalito    ] State: [CA] Zip: [94965]               |
|                                                                    |
|  PROJECT DESCRIPTION                                               |
|  [Complete front yard renovation including drought-tolerant        ]|
|  [planting, new flagstone pathway, drip irrigation, and lighting. ]|
|                                                                    |
|  +--- LABOR & SERVICES --------------------------[+ Add Item]----+ |
|  |                                                                | |
|  |  Irrigation - Drip System (3 zones)                            | |
|  |    Qty [3]  Unit [zone]  Rate [$2,800]         = $8,400.00    | |
|  |                                                                | |
|  |  Grading & Drainage                                            | |
|  |    Qty [450]  Unit [sq ft]  Rate [$2.50]       = $1,125.00    | |
|  |                                                                | |
|  |  [Start typing to add service...          ]                    | |
|  |                                                                | |
|  |                              Subtotal:          $9,525.00      | |
|  +----------------------------------------------------------------+ |
|                                                                    |
|  +--- PLANT MATERIALS ---------------------------[+ Add Item]----+ |
|  |                                                                | |
|  |  Lavandula angustifolia 'Hidcote'                              | |
|  |    Size [#5]  Qty [12]  Unit Price [$28]        = $336.00     | |
|  |                                                                | |
|  |  Acer palmatum 'Bloodgood'                                     | |
|  |    Size [24"box]  Qty [1]  Unit Price [$450]    = $450.00     | |
|  |                                                                | |
|  |  [Start typing plant name...               ]                  | |
|  |                                                                | |
|  |                              Subtotal:            $786.00      | |
|  +----------------------------------------------------------------+ |
|                                                                    |
|  +--- HARDSCAPE & MATERIALS ---------------------[+ Add Item]----+ |
|  |                                                                | |
|  |  Flagstone, Arizona Buff (dry-laid pathway)                    | |
|  |    Qty [120]  Unit [sq ft]  Rate [$45]         = $5,400.00    | |
|  |                                                                | |
|  |  Decomposed Granite w/ Stabilizer                              | |
|  |    Qty [3]  Unit [cu yd]  Rate [$225]            = $675.00    | |
|  |                                                                | |
|  |                              Subtotal:          $6,075.00      | |
|  +----------------------------------------------------------------+ |
|                                                                    |
|  +--- TOTALS ------------------------------------------------+    |
|  |                                                            |    |
|  |  Labor & Services:                         $9,525.00      |    |
|  |  Plant Materials:                            $786.00      |    |
|  |  Hardscape & Materials:                    $6,075.00      |    |
|  |                                          ___________      |    |
|  |  Subtotal:                                $16,386.00      |    |
|  |  Tax on Materials (8.25%):                   $565.53      |    |
|  |                                          ===========      |    |
|  |  GRAND TOTAL:                             $16,951.53      |    |
|  |                                                            |    |
|  +------------------------------------------------------------+   |
|                                                                    |
|  Payment Schedule:  [50/50]                                        |
|    Deposit (50%):  $8,475.77  due upon acceptance                  |
|    Balance (50%):  $8,475.76  due upon completion                  |
|                                                                    |
|  [Save Draft]    [Preview PDF]    [Export PDF]    [Print]          |
|                                                                    |
+====================================================================+
```

### How the Autocomplete Works

When you type in the plant name or service field, a dropdown appears with matches:

```
  +--------------------------------------------------+
  | [lav                                    ]         |
  +--------------------------------------------------+
  |  Lavandula angustifolia 'Hidcote'     #5  $28    |
  |  Lavandula angustifolia 'Munstead'    #5  $26    |  <-- highlighted
  |  Lavandula x intermedia 'Grosso'      #5  $30    |
  |  Lavandula stoechas 'Anouk'           #1  $12    |
  |  ................................................ |
  |  + Create custom item "lav..."                    |
  +--------------------------------------------------+
```

- Searches happen automatically as you type
- Both common and botanical names are searchable
- You can always type something custom if it's not in the list
- Selecting an item pre-fills the name, unit, and suggested price (all editable)

---

## What the PDF Looks Like

This is what your client receives. It's designed to be beautiful — a reflection of your design sensibility.

```
.--------------------------------------------------------------------.
|                                                                      |
|   [LOGO]                                                             |
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
|   Prepared for                         Estimate #NL-2026-001        |
|   ____________                         Date: February 25, 2026       |
|   Sarah & Tom Mitchell                 Valid through: March 27, 2026 |
|   742 Hillside Drive                                                 |
|   Sausalito, CA 94965                                                |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|   PROJECT DESCRIPTION                                                |
|                                                                      |
|   Complete front yard renovation including drought-tolerant           |
|   planting design, new flagstone pathway with decomposed granite     |
|   borders, drip irrigation system, and landscape lighting.           |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|   LABOR & SERVICES                                                   |
|   ................................................................   |
|                                                                      |
|   Description                    Qty   Unit    Rate       Amount     |
|   ----------------------------   ----  ------  --------  ---------   |
|   Irrigation - Drip System         3   zone    $2,800    $8,400.00   |
|     Front yard zones 1-3                                             |
|                                                                      |
|   Grading & Drainage             450   sq ft     $2.50   $1,125.00   |
|     Regrade along north fence                                        |
|                                                                      |
|                                              Subtotal    $9,525.00   |
|                                                                      |
|                                                                      |
|   PLANT MATERIALS                                                    |
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
|                                              Subtotal      $786.00   |
|                                                                      |
|   _________________________                                          |
|   Nancy Lyons Garden Design               Page 1 of 2               |
.--------------------------------------------------------------------.
```

```
.--------------------------------------------------------------------.
|                                                                      |
|   [small logo]          Nancy Lyons Garden Design   Est. #1042       |
|   ________________________________________________________________   |
|                                                                      |
|   HARDSCAPE & MATERIALS                                              |
|   ................................................................   |
|                                                                      |
|   Description                    Qty   Unit    Rate       Amount     |
|   ----------------------------   ----  ------  --------  ---------   |
|   Flagstone, Arizona Buff        120   sq ft    $45.00   $5,400.00   |
|     Irregular, dry-laid pathway                                      |
|                                                                      |
|   Decomposed Granite               3   cu yd  $225.00     $675.00   |
|     With stabilizer                                                  |
|                                                                      |
|                                              Subtotal    $6,075.00   |
|                                                                      |
|                                                                      |
|   +------------------------------------------------------+          |
|   |                                                      |          |
|   |   PROJECT SUMMARY                                    |          |
|   |                                                      |          |
|   |   Labor & Services                     $9,525.00     |          |
|   |   Plant Materials                        $786.00     |          |
|   |   Hardscape & Materials                $6,075.00     |          |
|   |                                       __________     |          |
|   |   Subtotal                           $16,386.00      |          |
|   |   Sales Tax (8.25%)                     $565.53      |          |
|   |                                       ==========     |          |
|   |   TOTAL                              $16,951.53      |          |
|   |                                                      |          |
|   +------------------------------------------------------+          |
|                                                                      |
|   PAYMENT SCHEDULE                                                   |
|   ................................................................   |
|                                                                      |
|   Deposit (50%)       $8,475.77     Due upon acceptance              |
|   Final Payment (50%) $8,475.76     Due upon completion              |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|   WARRANTY                                                           |
|                                                                      |
|   All plant material is warranted for 90 days from installation      |
|   date, provided the irrigation system is operational and the        |
|   prescribed watering schedule is followed. Hardscape work is        |
|   warranted for 2 years against defects in workmanship.              |
|                                                                      |
|   EXCLUSIONS                                                         |
|                                                                      |
|   This estimate does not include: utility locates, permit fees,      |
|   hauling of excess soil, work on adjacent properties, ongoing       |
|   maintenance, or pest/disease treatment post-installation.          |
|                                                                      |
|   ________________________________________________________________   |
|                                                                      |
|   ACCEPTANCE                                                         |
|                                                                      |
|   By signing below, you authorize Nancy Lyons Garden Design to       |
|   proceed with the work described in this estimate.                  |
|                                                                      |
|   ___________________________________      __________________        |
|   Client Signature                         Date                      |
|                                                                      |
|   ___________________________________                                |
|   Printed Name                                                       |
|                                                                      |
|   _________________________                                          |
|   Nancy Lyons Garden Design               Page 2 of 2               |
.--------------------------------------------------------------------.
```

---

## Pre-Loaded Lists

### Plant Categories (100+ California plants)

| Category | Examples |
|---|---|
| **Native / Drought-Tolerant** | California Lilac, Manzanita, Sage varieties, Toyon, Coffeeberry, Deer Grass, Pacific Coast Iris, Buckwheat, Coyote Brush, Western Redbud |
| **Mediterranean** | Lavender, Rosemary, Olive, Bougainvillea, Agapanthus, Grevillea, Westringia, New Zealand Flax, Society Garlic, Star Jasmine |
| **Shade/Woodland** | Camellia, Japanese Maple, Hydrangea, Ferns, Heuchera, Azalea, Fatsia |
| **Screening/Hedging** | Bamboo (clumping), Privet, Photinia, Podocarpus, Pittosporum |
| **Trees** | Coast Live Oak, Crepe Myrtle, Jacaranda, Chinese Elm, Olive, Citrus, Magnolia |
| **Ground Covers** | Dymondia, Myoporum, Creeping Thyme, Lantana, Native Sedges |

### Service Categories (30+)

| Category | Example Services |
|---|---|
| **Planting** | Plant trees, shrubs, perennials, ground cover, annuals |
| **Irrigation** | Install drip system, spray system, smart controller, repair/modify existing |
| **Hardscape** | Install patio, walkway, retaining wall, stepping stones |
| **Grading & Drainage** | Grade site, install French drain, improve drainage |
| **Lighting** | Install path lights, uplights, moonlighting, transformer |
| **Removal** | Remove trees, shrubs, bamboo, stumps, old irrigation |
| **Transplanting** | Move existing plants, repot specimens |
| **Soil Prep** | Amend soil, install raised beds, add topsoil |
| **Mulching** | Apply bark mulch, wood chips, DG |
| **Fencing** | Install wood fence, repair existing fence |
| **Structures** | Build deck, pergola, arbor |
| **Maintenance** | Pruning, cleanup, seasonal maintenance |
| **Design** | Design consultation, design plans, site analysis |

### Container Sizes

4" pot, 6" pot, 1 gal, 2 gal, 3 gal, 5 gal, 7 gal, 10 gal, 15 gal, 25 gal, 24" box, 36" box, 48" box, Flat, Bare root

---

## What About Existing Tools?

We researched the landscape estimating software market. Here's why a custom tool makes sense:

| Tool | Monthly Cost | Why It May Not Fit |
|---|---|---|
| **LMN** | $297-$557/mo | Expensive, complex, built for crews not solo designers |
| **Aspire** | Enterprise pricing | Way too complex, built for large companies |
| **Jobber** | $49-$129/mo | Good for scheduling, but weak on beautiful estimates |
| **SingleOps** | $220-$385/mo | Built for tree care/maintenance, not design |
| **Bonsai** | $21/mo | Nice proposals, but not landscape-specific |

**The gap**: There's no affordable, beautiful, simple tool purpose-built for a solo landscape designer. The big tools are designed for companies managing crews and trucks — not a designer creating custom proposals.

A custom-built tool means:
- No monthly subscription fees
- Exactly the features you need, nothing you don't
- Beautiful output that matches your brand
- Pre-loaded with plants and services you actually use
- Simple enough to use without training

---

## Technical Approach

The tool would be:
- **A web app** you open in your browser (Chrome, Safari, etc.)
- **No software to install** — just go to a web address (like estimates.nancylyons.com)
- **Works on desktop and iPad**
- **Your data is saved automatically** as you work
- **No monthly fees** — hosted for free on a static site
- **Generates real PDFs** — not screenshots, but crisp, professional documents

---

## Questions for Nancy

We'd love your feedback on all of this. Here are the key questions:

### About the Estimate Layout

1. **Sections**: Are the sections (Labor & Services, Plant Material, Hardscape & Materials, Notes) the right breakdown? Would you organize differently? Do you ever need to break things into sub-areas like "Front Yard" and "Back Yard"?

2. **Plant list**: Is the California plant list relevant to your work? What plants or categories do you use most frequently?

3. **Container sizes**: We have 4" pot through 48" box plus flats and bare root. Are there sizes you use that aren't listed?

4. **Service descriptions**: Do the labor/service categories match how you think about your work? What's missing?

### About Business Details

5. **Payment terms**: What's your typical payment structure? 50/50? Deposit + balance? Does it vary by project size?

6. **Tax**: Do you charge sales tax on materials? On labor? What rate do you use? (California varies by county from 7.25% to 10.75%)

7. **Material markup**: When you buy plants wholesale, how do you handle the markup to the client? Do you want the tool to track your cost vs. what you charge, or just show the client price?

8. **Design fees**: Do you list design fees separately or roll them into the estimate?

9. **Contingency**: Do you ever add a contingency percentage to estimates for unexpected costs?

### About Workflow

10. **Revisions**: How often do you revise estimates? Would version tracking be useful?

11. **Past estimates**: Would you want to save estimates and re-use them as templates?

12. **Invoices**: Do you also need to create invoices (bills for completed work), or just estimates (proposals for upcoming work)? These are different documents with different requirements.

13. **Access**: Do you ever need to look at estimates from your phone while at a client's site?

### About Branding

14. **Logo**: You mentioned needing a new logo. Any preferences? (Modern/minimal, botanical illustration, hand-drawn feel, etc.)

15. **Terms & conditions**: Do you have existing terms language, or should we draft standard language for you?

16. **Warranty**: Do you offer plant/hardscape warranties? What are your current terms?

17. **Signature**: Do clients sign in person, or would electronic signatures be useful?

---

## What Happens Next

1. **Nancy reviews this proposal** and answers the questions above
2. **We refine the plan** based on her feedback
3. **We build a working prototype** of the core estimate form + PDF export
4. **Nancy tests it** with a real estimate and gives feedback
5. **We iterate** until it matches exactly what she needs
6. **We launch** — Nancy starts using it with clients

The goal is simple: build the tool Nancy will actually open instead of going back to her spreadsheet.

---

*Prepared by our research, product, design, and engineering team. We welcome feedback on everything — the goal is to build exactly the tool you need.*
