# Rise With Us Gaming — Website Requirements

**Client:** Rise With Us Gaming  
**Brand Colors:** Black (#0A0A0A), Gold (#C9952A), Silver/Chrome (#A8A9AD)  
**Contractor:** Noble Fir Web  
**Project Folder:** `riseWithusGaming-website`  
**Design Reference:** https://citadelctg.com/  

---

## Project Phases

### Release 1 — Due: June 5, 2026
Static website (no ecommerce). All pages live and mobile-responsive.

### Release 2 — TBD
Full merch storefront + live stream detection widget + Netlify deployment with serverless functions.

---

## Pages — Release 1

### 1. Homepage (`index.html`)
- Full-screen hero with logo, tagline, animated entrance (GSAP)
- Team highlights / featured streamers strip
- "Meet the Team" CTA section
- Latest streams / YouTube embed section — draggable GSAP slider, 5 placeholders (updated weekly on support retainer)
- Merch teaser — email capture + GSAP draggable product card slider (6 placeholders, swapped for real product photos when merch arrives)
- Infinite marquee ticker ("RISE WITH US") between merch and partners sections
- Partner/sponsor bar (placeholder logos)
- Newsletter signup (basic form, no backend yet)
- Social media links prominently featured
- CTA to Contact page

### 2. About Page (`pages/about.html`)
- Brand story / mission statement
- What is Rise With Us Gaming?
- Culture / community focus
- NFL player partnership mention (keep vague until announced publicly)
- Growth roadmap teaser (merch, events, etc.)

### 3. Team Page (`pages/team.html`)
- Grid of player cards (photo, gamer tag, game specialty)
- Hover effect reveals social links
- Click leads to individual player page
- Built to scale — more members can be added easily
- Filter by game (future-ready)

### 4. Individual Player Pages (`pages/players/[name].html`)
- 4 pages for Release 1 (names/details TBD from client)
- Layout: hero photo, gamer tag, real name (if they want), game specialty
- Social links: Twitch, YouTube, Twitter/X, Instagram, TikTok
- Stream embed or latest video section
- Stats / highlights (placeholder)
- Back to Team link

### 5. Contact Page (`pages/contact.html`)
- General inquiry form: Name, Email, Subject (dropdown: Partnership, Media, General, Other), Message
- Social links as alternative contact methods
- No backend needed for R1 — use Formspree or Netlify Forms

---

## Tech Stack

### Release 1 (CDN only, no build step)
- **HTML5** — semantic, accessible markup
- **Tailwind CSS** (CDN) — utility-first styling, dark theme
- **GSAP + Draggable** (CDN) — scroll animations, hero entrance, draggable sliders
- **Alpine.js** (CDN) — mobile nav toggle, tabs, interactive UI state

### Release 2 (adds backend capability)
- **Netlify** — hosting + serverless functions (replaces static file host)
- **Netlify Functions** — Node.js serverless functions for API calls (secrets never exposed to browser)
- **Netlify Environment Variables** — store Twitch Client ID, Twitch Secret, any third-party API keys
- **Node.js fetch** — used inside functions to call Twitch and TikTok APIs

---

## Release 2 — Full Feature Spec

### A. Merch Storefront
- Full ecommerce store integrated into the site (modeled after Citadel's store)
- Product pages, category filtering, cart, checkout
- `/pages/store/` folder structure already reserved in R1 file tree
- Store nav link already present in R1 nav (currently shows "Coming Soon")
- Platform TBD (Shopify Buy SDK embedded, or custom with Stripe)

### B. Live Stream Detection Widget
A persistent live indicator card on the homepage (top-right corner, similar to Citadel's implementation) that automatically detects when any team member is streaming live and links directly to their stream.

#### User Experience
- Card is **hidden** when no one is live
- When a member goes live, the card animates in (GSAP entrance)
- Card shows: streamer avatar, gamer tag, platform badge (Twitch/TikTok), viewer count, stream title
- Card is an **anchor link** — clicking opens the live stream directly in a new browser tab
- If **multiple members are live simultaneously**, the card cycles through them every 5 seconds
- If a streamer is live on **both Twitch and TikTok** at the same time, both platform links are shown on the card
- On mobile: card collapses to a compact pill (red dot + name only)
- Card pulses with a red glow animation while live

#### Architecture — Netlify Serverless Function
```
Browser polls /api/live-status every 60 seconds
    ↓
Netlify Function (netlify/functions/live-status.js)
    ├── Calls Twitch Helix API (official, free)
    │     Returns: is_live, viewer_count, stream_title, thumbnail_url per streamer
    └── Calls TikTok API (see TikTok section below)
    ↓
Returns unified JSON payload to browser:
[
  { platform: 'twitch', username: 'streamer1', live: true,  viewers: 1240, url: 'twitch.tv/streamer1' },
  { platform: 'tiktok', username: 'streamer1', live: true,  viewers: 340,  url: 'tiktok.com/@streamer1/live' },
  { platform: 'twitch', username: 'streamer2', live: false, viewers: 0,    url: 'twitch.tv/streamer2' },
  ...
]
```

#### Twitch Integration
- **API:** Twitch Helix API (official)
- **Auth:** App Access Token (Client Credentials flow) — generated server-side inside the Netlify function
- **Cost: Free** — no usage costs at reasonable scale
- **Reliability: ★★★★★** — official, actively maintained
- **Setup:** Register a free Twitch Developer App at dev.twitch.tv → get Client ID + Client Secret → store in Netlify env vars
- Polls all 4 streamer usernames in a single API call

#### TikTok Integration
TikTok does **not** have an official public API for live stream detection. Three options ranked by recommendation:

| Option | Cost | Reliability | Notes |
|---|---|---|---|
| **TikTok Official API** (apply now) | Free | ★★★★★ | Gated — requires business partnership application, takes weeks/months, minimum follower threshold. **Start the application process immediately.** |
| **Third-party TikTok API** (TikAPI, RapidAPI) | $15–50/mo | ★★★ | Wraps scraping behind a paid endpoint. More stable than DIY. |
| **DIY scraping** | Free | ★★ | Polls `tiktok.com/@username/live`, parses HTML. Breaks when TikTok updates markup. Requires rotating proxies ($20–50/mo) to avoid IP bans. |
| **Manual fallback** | Free | N/A | CMS/admin toggle per streamer — someone flips them live manually. Buys time while API approval is pending. |

**Recommended R2 approach:** Ship with Twitch detection first. Have all 4 streamers apply for TikTok Official API access immediately (approval is slow). Build the manual fallback toggle as a stopgap. Integrate TikTok API properly once credentials are approved.

#### Build Steps (R2)
1. [ ] Register Twitch Developer App — get Client ID + Secret
2. [ ] Create `netlify/functions/live-status.js` serverless function
3. [ ] Add env vars to Netlify dashboard (TWITCH_CLIENT_ID, TWITCH_SECRET)
4. [ ] Build front-end polling logic (`setInterval` every 60s)
5. [ ] Build live card UI component (GSAP animate in/out)
6. [ ] Build multi-streamer rotation (cycle every 5s if multiple live)
7. [ ] Apply for TikTok Official API access (begin immediately — long lead time)
8. [ ] Add TikTok branch to Netlify function once credentials received
9. [ ] Add manual TikTok fallback toggle in the interim

#### Estimated Cost (R2 ongoing)
| Item | Cost |
|---|---|
| Netlify Starter (functions included) | **Free** |
| Twitch API | **Free** |
| TikTok Official API (if approved) | **Free** |
| TikTok third-party API (if needed as fallback) | **$15–50/mo** |
| Rotating proxies (only if DIY scraping) | **$20–50/mo** |

---

## Scalability Notes
- File structure supports adding `/pages/store/` without restructuring
- Player pages follow a consistent template — easy to clone for new members
- Navigation includes placeholder Store link (disabled/coming soon for R1)
- CSS custom properties (vars) used for brand colors — easy to theme
- Image folder structure: `/images/team/`, `/images/merch/` (future), `/images/partners/`
- Netlify Functions architecture supports adding more API integrations (YouTube Live, Discord status, etc.) with zero infrastructure changes

---

## Brand Assets
- Logo: `/images/logos/rwug-logo.png` — shield badge, gold/silver metallic R with football
- Nav logo: `/images/logos/nav-logo2.png` — circular crop, transparent background
- Favicon: crop logo mark for `/images/logos/favicon.ico` (TBD)

---

## Key Stakeholders / Context
- Group of popular Madden streamers — all active on Twitch and TikTok
- NFL player signed to team — major brand awareness incoming (identity not yet public)
- Merch being produced — Release 2 storefront is a firm commitment
- Community/social engagement is the primary driver (Twitch, YouTube, TikTok)
- Support retainer planned — weekly content updates (stream clips, highlights)

---

## Build Order

### Release 1
1. [x] Project scaffold + requirements doc
2. [x] Homepage (`index.html`) — fully built
3. [ ] Team Page (`pages/team.html`)
4. [ ] Individual Player Pages (x4)
5. [ ] About Page (`pages/about.html`)
6. [ ] Contact Page (`pages/contact.html`)
7. [ ] Final QA, mobile review, deploy to Netlify

### Release 2
1. [ ] Netlify deployment + DNS setup
2. [ ] Merch storefront (`/pages/store/`)
3. [ ] Live stream detection widget (Twitch first, TikTok when API approved)
4. [ ] Manual TikTok live fallback toggle
5. [ ] YouTube Live detection (optional, same Netlify function pattern)
6. [ ] Performance audit + image optimization
