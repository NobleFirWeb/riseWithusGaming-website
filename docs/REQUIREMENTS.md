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
Full merch storefront integrated into the site (similar to Citadel's store).

---

## Pages — Release 1

### 1. Homepage (`index.html`)
- Full-screen hero with logo, tagline, animated entrance (GSAP)
- Team highlights / featured streamers strip
- "Meet the Team" CTA section
- Latest streams / YouTube embed section (placeholder for now)
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
- **HTML5** — semantic, accessible markup
- **Tailwind CSS** (CDN) — utility-first styling, dark theme
- **GSAP** (CDN) — scroll animations, hero entrance, page transitions
- **Alpine.js** (CDN) — mobile nav toggle, tabs, interactive UI state
- **No build step for R1** — all via CDN for speed of delivery

---

## Scalability Notes (Release 2 Planning)
- File structure supports adding `/pages/store/` without restructuring
- Player pages follow a consistent template — easy to clone for new members
- Navigation includes placeholder Store link (disabled/coming soon for R1)
- CSS custom properties (vars) used for brand colors — easy to theme
- Image folder structure: `/images/team/`, `/images/merch/` (future), `/images/partners/`

---

## Brand Assets
- Logo provided (black background, gold/silver metallic "R" with football, shield badge)
- Logo file: `/images/logos/rwug-logo.png` (place here when provided in full res)
- Favicon: crop logo mark for `/images/logos/favicon.ico`

---

## Key Stakeholders / Context
- Group of popular Madden streamers
- NFL player signed to team — major brand awareness incoming
- Merch being produced — Release 2 storefront is a firm commitment
- Community/social engagement is the primary driver (Twitch, YouTube, TikTok)

---

## Build Order (Page by Page)
1. [x] Project scaffold + requirements doc
2. [ ] Homepage (`index.html`)
3. [ ] Team Page (`pages/team.html`)
4. [ ] Individual Player Pages (x4)
5. [ ] About Page (`pages/about.html`)
6. [ ] Contact Page (`pages/contact.html`)
7. [ ] Final QA, mobile review, deploy
