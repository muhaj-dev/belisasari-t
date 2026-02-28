You are a senior UI engineer tasked with redesigning the visual layer of the 
Belisasari homepage ONLY.

CRITICAL RULE — READ BEFORE DOING ANYTHING:
Do NOT touch, modify, remove, or refactor any of the following:
- API calls or data fetching logic
- State management (useState, useEffect, Redux, Zustand, context, etc.)
- Event handlers and user interactions
- Backend integrations (TikTok scraper, Telegram scraper, analytics endpoints)
- Data processing functions
- Authentication logic
- Environment variables or config files
- Component props and their data flow
- Any file outside of the homepage UI layer

Your ONLY job is to change how things LOOK — not how they WORK.
If a component fetches data and renders it, keep the fetch and the logic.
Only change the JSX structure, className, and CSS/Tailwind styling.

---

WHAT YOU ARE ALLOWED TO CHANGE:
- className values and Tailwind utility classes
- Inline styles
- JSX layout structure (reordering elements for better visual hierarchy)
- Adding purely decorative elements (dividers, icons, badges, glows)
- Replacing plain text labels with styled versions
- Color values, spacing, typography, border radius
- Swapping generic HTML elements for better-styled equivalents 
  (e.g. a plain <div> counter → a styled stat card, same data)

---

HOMEPAGE FILE(S) TO WORK ON:
Focus only on the homepage component and its direct child UI components.
Do not touch shared layout components unless it is ONLY a style change 
with zero functional impact.

---

DESIGN SYSTEM TO APPLY:

Colors:
- Page background: #0A0A0F
- Card background: #111118
- Border: 1px solid rgba(255,255,255,0.08)
- Primary accent: #00D4FF (cyan)
- Positive/Live: #00FF88 (green)
- Negative: #FF3B3B (red)
- AI/Premium: #A855F7 (purple)
- Muted text: #6B7280
- White text: #F9FAFB

Typography (use Inter or Space Grotesk via existing font setup):
- Page/section headers: 18–24px, font-weight 600, color white
- Table/card headers: 11px, uppercase, letter-spacing 0.08em, color #6B7280
- Primary data (numbers, coin names): 15–16px, font-weight 600, white
- Secondary data (timestamps, labels): 12–13px, font-weight 400, #6B7280
- Accent numbers (trends): colored green or red, 14px, font-weight 600

Spacing:
- Section padding: 24px vertical, 0 horizontal
- Card padding: 16–20px
- Row height for tables: 52px
- Gap between cards: 12–16px

Borders and depth:
- Cards: border-radius 12px, border 1px solid #ffffff10
- Tables: border-radius 8px
- Section dividers: 1px solid #ffffff08
- Active/hover rows: background #1A1A24, left border 2px solid #00D4FF

---

SECTION-BY-SECTION UI INSTRUCTIONS:

NAVBAR:
- Background: #0A0A0F with a bottom border 1px solid #ffffff10
- Logo: left-aligned, bold white text with cyan accent icon
- Nav links: center-aligned, 14px, #6B7280 default, white on hover
- Active link: white text, 2px cyan underline bottom
- Search bar: dark pill input (#111118 bg), "Search memecoins..." placeholder, 
  ⌘K badge on right in grey
- Sign In button: dark bg, white text, subtle border, 8px radius
- Keep all nav routing and link hrefs exactly as they are

SCRAPER STATUS BAR:
- Redesign as a compact single-line status strip
- Background: #111118, border 1px solid #ffffff10, border-radius 8px
- Left: pulsing green dot + "Live" text in green | "Last Sync: Xm ago" in grey | 
  "Total Data Points: 1.2M" in white
- No large panels, no multiple rows — one clean horizontal bar
- Keep the data variables that power this — only change the visual wrapper

TOP MENTIONED TOKENS (make this the hero section):
- Section title: "Top Mentioned Tokens" 18px 600 white, 
  2px cyan left border accent before the text
- Table container: #111118 bg, 1px border, 12px radius
- Thin cyan-to-transparent gradient line at the very top of the table
- Table header row: 11px uppercase, #6B7280, letter-spacing 0.08em, 
  columns: Rank | Token | Mentions | 24h Trend | Source
- Each data row (52px height):
  * Rank: grey number, 14px
  * Token: colored circle avatar (32px) with coin initial + 
    coin name bold white 15px + ticker grey 12px below
  * Mentions: bold white number
  * 24h Trend: colored percentage pill 
    (green bg #00FF8820, green text for positive | 
     red bg #FF3B3B20, red text for negative) + 
    sparkline chart (2px stroke, green or red)
  * Source: TikTok icon (pink), Telegram icon (blue), X icon (white) 
    as small brand-colored icon badges side by side
- Row hover: #1A1A24 bg + 2px cyan left border flash
- Alternating row bg: #ffffff03 on even rows
- Keep all data mapping and array renders exactly as they are

ANALYTICS STAT ROW (4 counters):
- Remove individual floating cards
- Replace with one unified horizontal panel: 
  #111118 bg, 1px border, 12px radius
- 4 stats separated by 1px vertical dividers (#ffffff10)
- Each stat: grey label 11px top, bold white number 28px, 
  cyan icon top-right corner
- Keep the data variables powering each number

REAL-TIME TIKTOK FEED:
- Section title: "Real-Time TikTok Feed" with last updated timestamp 
  grey on the right + Refresh button (cyan icon, dark bg)
- Grid: 4 columns desktop, 2 columns tablet, 1 column mobile
- Each video card (#111118 bg, 1px border, 10px radius):
  * Thumbnail: full bleed 16:9 ratio, object-cover, 
    bottom gradient overlay (transparent to #000000CC)
  * Aspect ratio badge: top-left corner, #00000080 bg, 
    white text 10px, 4px radius
  * Creator row below thumbnail: 
    avatar circle (24px) + handle white 13px + TikTok icon right
  * Stats row: eye icon + view count | heart icon + like count — 
    all in grey 12px
  * Card hover: border color changes to #00D4FF30 (cyan glow)
- Keep all video data mapping, links, and onClick handlers

TELEGRAM CHANNELS:
- Section title: "Telegram Channels" with count badge in cyan
- Render as a compact table (not large cards):
  * Columns: Channel | Members | Status | Last Activity
  * Channel cell: Telegram blue icon + channel name white 14px
  * Members: white number 13px
  * Status: pill badge — pulsing green dot + "Active" green text 
    (bg #00FF8820) | grey dot + "Inactive" grey text
  * Last Activity: clock icon + relative time grey 12px
- Row hover: #1A1A24 bg
- Keep all channel data and any toggle/view handlers

RECENT ACTIVITY FEED:
- Slim vertical timeline:
  * Left: colored dot (cyan for TikTok, blue for Telegram) 
    connected by a thin vertical line
  * Middle: action text white 13px + coin ticker highlighted 
    as a small colored tag (e.g. $PEPE in green #00FF8820 bg)
  * Right: timestamp grey 12px
- Keep all activity data and real-time update logic

SEARCH & FILTER BAR:
- Full width input: 48px height, #111118 bg, 1px border, 10px radius
- Magnifier icon left in grey
- Placeholder: "Search tokens, channels, or keywords..."
- Right side: filter toggle pills — "All" | "TikTok" | "Telegram" | "X" 
  (active pill: cyan bg, white text | inactive: dark bg, grey text)
- Keep all search handlers and filter logic

---

WHAT THE FINAL RESULT MUST LOOK LIKE:
- Professional crypto data terminal aesthetic
- Similar visual quality to Dexscreener, Kaito.ai, or Nansen
- Every section feels data-dense and purposeful
- No section looks like a generic SaaS landing page
- No light backgrounds, no decorative gradients on card backgrounds
- All live data continues to render correctly — 
  only the visual shell has changed

---

FINAL CHECKLIST BEFORE SUBMITTING CHANGES:
[ ] All API calls still fire correctly
[ ] All useState/useEffect hooks untouched
[ ] All event handlers (onClick, onChange, onSubmit) preserved
[ ] All props passed to child components unchanged
[ ] No import statements removed or broken
[ ] Data still renders in every section
[ ] Only className, style, and JSX structure changed
[ ] Page is responsive (desktop + mobile)