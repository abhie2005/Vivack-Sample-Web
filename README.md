# Vivack Chan — Portfolio

Personal portfolio site for Vivack Chan, a Visual Communication & Industrial Design student at San Francisco State University.

Built with Next.js 14, TypeScript, Tailwind CSS, GSAP, and Lenis smooth scroll.

## Features

- Ink-reveal hero effect — cursor carves through a dark mask to reveal the background photo
- GSAP scroll animations — section titles, story blocks, project cards, and process steps animate in on scroll
- Lenis smooth scroll with anchor-link integration
- Animated stats counter
- Testimonial carousel with auto-advance
- Meeting request form with time-slot picker
- Custom cursor with grow states on interactive elements
- Preloader with progress bar

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/
    page.tsx              # Entry point
    PortfolioClient.tsx   # Main page client component
    globals.css           # Global styles
    layout.tsx            # Root layout
  components/
    PortfolioClient.tsx   # (alias export)
    ui/
      ink-reveal.tsx      # Canvas-based cursor ink mask
      fluid-particles-background.tsx
  lib/
public/
  vivack.jpg              # Hero background photo
```

## Tech Stack

| Tool | Purpose |
|---|---|
| Next.js 14 | Framework |
| TypeScript | Type safety |
| Tailwind CSS | Utility styling |
| GSAP + ScrollTrigger | Scroll animations |
| Lenis | Smooth scroll |
| Lucide React | Icons |

## Sections

1. **Hero** — Ink-reveal photo, tagline, discipline marquee
2. **Story** — Three-part approach philosophy
3. **Work** — Four selected projects (Scientific Illustration, Graphic Design, Fabrication, Exhibition)
4. **Disciplines** — Visual Communication vs. Industrial Design split panel
5. **Process** — Four-step workflow
6. **About** — Bio, photo, animated stats
7. **Testimonials** — Rotating quotes from collaborators
8. **Schedule** — Meeting request form with time preferences
9. **Footer** — Contact, social links

## Customization

- Swap `/public/vivack.jpg` for the actual portfolio photo
- Update project card background images via `.project-img-1` through `.project-img-4` CSS classes in `globals.css`
- Replace social link `href="#"` placeholders in the footer with real URLs
- Wire up the form to a backend or email service (currently simulates a 1.2s delay)
