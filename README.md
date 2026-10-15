# Charles Viray — Developer Portfolio

> Smart software, end to end.

Hi, I'm **Charles Dwayne Viray** — a BS Computer Science student at Holy Angel University, AI/ML Lead of Google Developer Groups on Campus HAU, and an AI & full-stack software engineer based in Pampanga, Philippines.

This repository holds the code for my personal developer portfolio, built as Phase 1 (Midterm) of my Web Development coursework and structured to expand into Phase 2 (Finals).

I went with a **retro-modern design direction** inspired by vintage editorial print: bold slab serif display type, subtle halftone dot textures, sunbursts, rubber stamps, and crisp offset shadows with a warm cream, ink, and mustard color palette.

---

## Pages Overview

| Page | File | Description |
|---|---|---|
| **Home** | `index.html` | Hero introduction with retro workstation art, live tech stack ticker, workshop bio, featured case study spotlight, core skills, and client/peer testimonials. |
| **About** | `about.html` | Full bio, three core engineering rules, career & education progression timeline (including my FlyRank AI engineering internship), hackathon achievements, 23 verified certifications, and categorized tools directory. |
| **Projects** | `projects.html` | Interactive project catalog featuring client-side search and category filtering chips (AI/ML, Mobile, Web & XR, Systems). |
| **Case Study** | `case-study.html` | Deep dive into **Seguri**, my hybrid-AI mobile security app: problem framing, 5-stage processing flow, local ML vs cloud LLM architecture, and hackathon test metrics (<200 ms latency, 98% accuracy). |
| **Contact** | `contact.html` | Direct email, availability indicators, and an accessible contact form with client-side modal confirmation. |

---

## Project Structure

```
developer-portfolio/
│
├── index.html                    # Home page
├── about.html                    # About story, timeline & credentials
├── projects.html                 # Projects catalog with live filtering
├── case-study.html               # Seguri hybrid-AI case study
├── contact.html                  # Contact form & dialog
│
├── css/
│   └── style.css                 # Complete design system (tokens, components, pages, media queries)
│
├── js/
│   └── main.js                   # Navigation drawer, project filter/search, modal dialogs
│
├── images/
│   ├── charles-viray.png         # Profile portrait
│   ├── illustrations/            # Retro PC illustration and swoosh banners (SVG)
│   └── projects/                 # Project banners and flow diagram (SVG)
│
└── assets/
    ├── charles-viray-resume.pdf  # Downloadable résumé
    └── certificates/             # 23 PDF certificates (DataCamp, CompTIA, etc.)
```

---

## How to Run Locally

You can preview the portfolio by opening `index.html` directly in any modern browser, or by spinning up a lightweight local server:

```bash
# Using Python
python -m http.server 5500
```

Then navigate to `http://localhost:5500` in your browser.

---

## Design System & Tokens (Figma ➔ Code)

I mapped every Figma style directly to CSS custom properties in `css/style.css`:

- **Colors:** Warm cream surfaces (`#F4EEE3`, `#FBF7F0`), deep ink body text (`#2B2A30`), vintage brick red (`#BA423C`), mustard accent (`#EDB843`), and teal (`#2E6E6B`).
- **Typography:** *Alfa Slab One* (display headers), *Shrikhand* (retro script accents), *Space Mono* (labels & metadata), and *Work Sans* (clean readable body copy).
- **Hard Offset Shadows:** Vintage 2px/3px solid ink offset shadows (`--shadow-sm`, `--shadow-md`, `--shadow-lg`) without blurry box-shadows.
- **Responsive Viewports:** Built with mobile-first CSS rules adapting across 1440px desktop, 768px tablet, and 390px mobile screens.

---

## Accessibility (a11y)

- Semantic HTML5 landmark structure (`header`, `nav`, `main`, `section`, `footer`) with a single `h1` per page.
- Keyboard-accessible **"Skip to content"** link that bypasses header links for screen readers and keyboard navigation.
- High-contrast color ratios aligned with WCAG AA standards.
- Visible focus rings (`:focus-visible`) across all interactive controls.
- `prefers-reduced-motion` support that halts the marquee animation for users sensitive to motion.

---

## Plans for Finals (Phase 2)

- [x] Connect the contact form to a live backend endpoint (Formspree).
- [x] Add interactive scroll-spy navigation to the case study table of contents.
- [ ] Deploy the production build to GitHub Pages with a custom domain.

---

## Credits & Acknowledgments

- **Typography:** *Alfa Slab One*, *Shrikhand*, *Space Mono*, and *Work Sans* sourced from Google Fonts under the SIL Open Font License.
- **Artwork & Graphics:** Custom vector illustrations and flow diagrams created for this portfolio.
- **Credentials & Media:** Profile photography, hackathon milestones, and certificate documentation reflect my personal academic work at Holy Angel University and Google Developer Groups on Campus.
