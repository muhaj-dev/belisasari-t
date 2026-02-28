## Stitch Instructions

Get the images and code for the following Stitch project's screens:

## Project

Title: Belisasari Intelligence Dashboard
ID: 8740206210098794208

## Screens:

1. Belisasari Terminal Dashboard
   ID: aa5628db828a492dbeb6af04e94f800f

Use a utility like `curl -L` to download the hosted URLs.

---

Once you have retrieved the Stitch screen above, use it as your SOLE visual
reference for the redesign. Do not invent new sections or remove existing ones.
Replicate the layout, structure, and all sections exactly as shown in the
Stitch design — then apply it to the live codebase as UI-only changes.

---

CRITICAL RULE — READ BEFORE TOUCHING ANY FILE:
You are working on the Dashboard page UI ONLY.

DO NOT touch, modify, remove, or refactor ANY of the following:

- API calls or data fetching logic
- useState, useEffect, useCallback, useMemo, useRef hooks
- Redux, Zustand, or any context/state management
- Event handlers (onClick, onChange, onSubmit, onToggle)
- Backend integrations (TikTok scraper, Telegram, AI pattern analysis,
  Jupiter trading, Twitter posting)
- Data processing or transformation functions
- Authentication and session logic
- Environment variables or config files
- Component props and their data flow between parent and child
- Import statements for data/logic modules
- Any file outside the Dashboard page UI layer

Your ONLY job is to make the Dashboard look exactly like the Stitch design.
Change how things LOOK. Never change how things WORK.

---

FILES TO WORK ON:

- Dashboard page component and its direct UI child components only
- Only modify className, style props, and JSX layout structure
- Do not touch any shared layout component unless it is a pure style change
  with zero functional impact

---

DESIGN SYSTEM TO APPLY (match the Stitch screen exactly):

Colors:

- Page background: #0A0A0F
- Card background: #111118
- Border: 1px solid rgba(255,255,255,0.08)
- Primary accent: #00D4FF (cyan)
- Positive/Live/Active: #00FF88 (green)
- Negative/Inactive: #FF3B3B (red)
- AI/Premium: #A855F7 (purple)
- Muted text: #6B7280
- White text: #F9FAFB
- Price/value accent: #00D4FF (cyan numbers)
- Score/rank accent: #00FF88 (green numbers)

Typography:

- Page header: 24px, font-weight 700, white
- Section headers: 18px, font-weight 600, white
- Table column headers: 11px, uppercase, letter-spacing 0.08em, #6B7280
- Primary data: 15–16px, font-weight 600, white
- Accent numbers (prices, changes, scores): colored, 14–16px, font-weight 600
- Timestamps/labels: 12–13px, font-weight 400, #6B7280

---

SECTION-BY-SECTION UI INSTRUCTIONS
(match the Stitch screen, preserve all data and logic):

NAVBAR:

- Background: #0A0A0F, bottom border 1px solid #ffffff10
- Logo: "S" icon in cyan + "Belisasari" bold white
- Nav links: Trending | Feed | Dashboard | Trading | Portfolio | NFTs | Discover
- Active link "Dashboard": white text, 2px cyan underline
- Search bar: dark pill (#111118 bg), magnifier icon, "Search" placeholder,
  ⌘K badge in grey on right
- Right: user avatar with dropdown chevron
- Keep all routing and link hrefs untouched

PAGE HEADER:

- Left: "Belisasari Dashboard" 24px bold white
- Subtitle: "Real-time memecoin analytics from TikTok, Telegram, and AI analysis."
  in #6B7280 13px
- Right: "Post summary to Twitter" button — dark bg, X icon left,
  white text, cyan border, 8px radius
- Below header: thin full-width cyan-to-transparent gradient line as a divider

REAL-TIME DATA OVERVIEW (3 cards):

- Section title: "Real-Time Data Overview" 18px 600 white
- 3 cards in a row, equal width, #111118 bg, 1px border #ffffff15, 12px radius
- Each card header: platform name bold white left + pulsing green dot right
- TikTok Analytics card:
  - "Total Views:" grey label — value in cyan bold right-aligned
  - "Recent Videos:" grey label — value in cyan bold right-aligned
- Telegram Analytics card:
  - "Active Channels:" grey label — value in cyan bold right-aligned
  - "Recent Messages:" grey label — value in cyan bold right-aligned
- AI Pattern Analysis card:
  - "Correlations:" grey label — value in cyan bold right-aligned
  - "Recommendations:" grey label — value in purple bold right-aligned
  - "Last Analysis:" grey label — value in grey right-aligned
- Keep all data variables rendering inside these cards

AI-POWERED FEATURES:

- Section title: "AI-Powered Features" 18px 600 white
- Two panels side by side:

PATTERN RECOGNITION panel (left):

- Header: "Pattern Recognition" bold white left + "Start Analysis" button
  right (cyan outline, 8px radius, cyan text)
- Tab bar: Summary | Detections | Insights —
  active tab: cyan underline + white text, inactive: #6B7280
- Panel body: renders a preview screenshot/thumbnail of the dashboard
  (keep whatever image or component is already rendering here)
- Panel bg: #111118, 1px border, 12px radius

BACKEND SERVICES panel (right):

- Header: "Backend Services" bold white left + "Start All" button right
  (same style as Start Analysis)
- 2x2 grid of service cards:
  - ADK Workflow — Active (green pill badge, green dot pulse)
  - Pattern Recognition — Active (green pill badge)
  - Jupiter Token & Price Data — Inactive (red pill badge, red dot)
  - Decision Agent — Active (green pill badge)
- Each service card:
  - Status badge top-left: pill with dot + text
    (Active: #00FF8820 bg, #00FF88 text | Inactive: #FF3B3B20 bg, #FF3B3B text)
  - Live indicator top-right: green or red dot
  - Service name: bold white 14px
  - Status text below name: green "Active" or red "Inactive" 13px
  - "Last checked" timestamp: grey 11px
  - Play button: circular dark button, right side
  - Active card: subtle green left border glow
  - Inactive card: subtle red left border glow
- Keep all service toggle and start handlers

TRENDING COINS ANALYTICS TABLE:

- Section header row:
  - Left: "Trending Coins Analytics" 18px 600 white + cyan badge "50"
    (cyan bg, dark text, 6px radius) + "Total Coins Analyzed" grey +
    "Active tokens in last 24h" grey smaller
  - No extra controls needed in header
- Tab bar below header: Overview | Correlation | Social | Market Data —
  underline style tabs, active = white text + cyan 2px underline
- Table:
  - Header row: RANK ↕ | TOKEN ↕ | MARKET CAP ↕ | PRICE ↕ |
    24H CHANGE ↕ | VOLUME ↕ | SCORE ↕
    (11px uppercase, #6B7280, sort arrows in grey)
  - Each data row (52px height):
    - Rank: grey number 14px
    - Token: coin avatar (32px circle image) + coin name bold white 15px
    - Market Cap: white 14px
    - Price: cyan 14px font-weight 600
    - 24H Change: green percentage if positive, red if negative, 14px 600
    - Volume: white 14px
    - Score: green number bold 14px
  - Row 3 active state (as shown in Stitch):
    left cyan 3px border + #1A1A24 bg highlight
  - Row hover: #1A1A24 bg + left 2px cyan border flash
  - Alternating rows: #ffffff03 on even rows
  - Table bg: #111118, 1px border, 8px radius
- Keep all sorting, filtering, pagination, and data fetching

SYSTEM STATUS (4 cards at bottom):

- Section title: "System Status" 18px 600 white
- 4 equal cards in a row: TikTok Integration | Telegram Integration |
  Pattern Analysis | Twitter Integration
- Each card (#111118 bg, 1px border #00FF8815, 12px radius, subtle green glow):
  - Card header: service name bold white 14px + live green dot top-right
  - Two metric rows:
    - "Total [label]" grey label left — cyan number right
    - "Today" grey label left — cyan number right
  - Bottom: "Last Run [timestamp] EST" grey 11px with clock icon
- Keep all status data variables and refresh logic

---

RESPONSIVE:

- Mobile: all 3 stat cards stack to single column
- Backend Services 2x2 grid stacks to 1 column on mobile
- Table becomes horizontally scrollable on tablet,
  card list on mobile (keep data intact)
- System Status 4 cards wrap to 2x2 on tablet, single column on mobile

---

FINAL CHECKLIST — VERIFY BEFORE SUBMITTING:
[ ] Stitch design screen retrieved and used as visual reference
[ ] All API calls still fire correctly
[ ] All useState/useEffect hooks completely untouched
[ ] All event handlers preserved (Start Analysis, Start All, tab switches,
Post to Twitter, table sorting)
[ ] All props passed to child components unchanged
[ ] No import statements removed or broken
[ ] Live data still renders in every card, table row, and status widget
[ ] Only className, style, and JSX structure changed
[ ] Active row highlight on table row 3 matches Stitch design
[ ] Green glow on System Status cards matches Stitch design
[ ] Cyan underline on Dashboard nav link is active
[ ] Page is fully responsive on desktop, tablet, and mobile
