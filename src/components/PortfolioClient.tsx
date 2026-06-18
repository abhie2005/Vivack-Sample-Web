"use client";

import { useEffect, useRef, useState } from "react";
import InkReveal from "@/components/ui/ink-reveal";

export default function PortfolioClient() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedSlot, setSelectedSlot] = useState("morning");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState(0);
  const [preloaderGone, setPreloaderGone] = useState(false);
  const heroAnimatedRef = useRef(false);

  const slides = [
    { quote: "Vivack has a rare ability to translate complex science into visuals that feel immediate and human. The whale conservation work resonated with audiences far beyond what we expected.", cite: "Dr. Amber Roegner, Estuary & Ocean Science Center, SFSU" },
    { quote: "What sets Vivack apart is the consistency. Whether it's a poster, a digital screen, or a social asset, everything feels like it belongs to the same thoughtful system.", cite: "Campus Recreation Marketing, SFSU" },
    { quote: "He just gets it — the brief, the constraints, the deadline, and somehow still finds room for something beautiful in the build. An absolute asset on the floor.", cite: "The Parade Guys, San Francisco" },
  ];

  // Preloader
  useEffect(() => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setPreloadProgress(100);
        setTimeout(() => setPreloaderGone(true), 400);
      } else {
        setPreloadProgress(progress);
      }
    }, 60);
    return () => clearInterval(interval);
  }, []);

  // Testimonials auto-advance
  useEffect(() => {
    const t = setInterval(() => setCurrentSlide((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  // GSAP + Lenis — runs after preloader gone
  useEffect(() => {
    if (!preloaderGone) return;

    let gsapInstance: typeof import("gsap").gsap;
    let lenisInstance: InstanceType<typeof import("lenis").default>;
    let rafId: number;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      const Lenis = (await import("lenis")).default;

      gsapInstance = gsap;
      gsap.registerPlugin(ScrollTrigger);

      // Smooth scroll
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        wheelMultiplier: 0.8,
      } as ConstructorParameters<typeof Lenis>[0]);

      const raf = (time: number) => {
        lenisInstance.raf(time);
        rafId = requestAnimationFrame(raf);
      };
      rafId = requestAnimationFrame(raf);

      lenisInstance.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => lenisInstance.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);

      // Nav scroll
      const nav = document.getElementById("nav");
      lenisInstance.on("scroll", ({ scroll }: { scroll: number }) => {
        nav?.classList.toggle("scrolled", scroll > 60);
      });

      // Hero animation
      if (!heroAnimatedRef.current) {
        heroAnimatedRef.current = true;
        const heroLines = document.querySelectorAll(".hero-line");
        const heroEyebrow = document.querySelector(".hero-eyebrow");
        const heroFooter = document.querySelector(".hero-footer");
        const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
        tl.to(heroLines, { y: "0%", duration: 1.1, stagger: 0.12 })
          .to(heroEyebrow, { opacity: 1, y: 0, duration: 0.7 }, "-=0.5")
          .to(heroFooter, { opacity: 1, y: 0, duration: 0.7 }, "-=0.4");
      }

      // Generic data-reveal
      document.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      // Section titles
      document.querySelectorAll<HTMLElement>(".section-title").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Story blocks
      document.querySelectorAll<HTMLElement>(".story-block").forEach((block, i) => {
        gsap.to(block, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: i * 0.08,
          scrollTrigger: { trigger: block, start: "top 85%" },
        });
      });

      // Process steps
      document.querySelectorAll<HTMLElement>(".process-step").forEach((step, i) => {
        gsap.to(step, {
          opacity: 1, y: 0, duration: 0.85, ease: "power3.out", delay: i * 0.08,
          scrollTrigger: { trigger: step, start: "top 88%" },
        });
      });

      // Project cards
      document.querySelectorAll<HTMLElement>(".project-card").forEach((card, i) => {
        gsap.fromTo(card, { opacity: 0, y: 60 }, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: (i % 2) * 0.12,
          scrollTrigger: { trigger: card, start: "top 88%" },
        });
      });

      // Discipline panels
      document.querySelectorAll<HTMLElement>(".discipline-content[data-reveal]").forEach((el) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });

      // About image parallax
      const aboutImg = document.querySelector<HTMLElement>(".about-img");
      if (aboutImg) {
        gsap.to(aboutImg, {
          yPercent: -10, ease: "none",
          scrollTrigger: { trigger: "#about", start: "top bottom", end: "bottom top", scrub: 1 },
        });
      }

      // Stats counter
      function animateCounter(el: HTMLElement, rawTarget: string) {
        const hasPlus = rawTarget.includes("+");
        const num = parseInt(rawTarget);
        let count = 0;
        const stepMs = Math.ceil(1400 / (num * 16));
        const iv = setInterval(() => {
          count++;
          el.textContent = count + (hasPlus ? "+" : "");
          if (count >= num) { el.textContent = rawTarget; clearInterval(iv); }
        }, stepMs);
      }

      let statsAnimated = false;
      ScrollTrigger.create({
        trigger: ".about-stats", start: "top 85%",
        onEnter: () => {
          if (!statsAnimated) {
            statsAnimated = true;
            document.querySelectorAll<HTMLElement>(".stat-num").forEach((el) => {
              animateCounter(el, el.textContent?.trim() ?? "0");
            });
          }
        },
      });

      // Schedule section
      document.querySelectorAll<HTMLElement>("#schedule [data-reveal]").forEach((el, i) => {
        gsap.to(el, {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out", delay: i * 0.15,
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });

      // Smooth anchor links
      document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          const href = anchor.getAttribute("href");
          if (!href || href === "#") return;
          const target = document.querySelector(href);
          if (target) {
            e.preventDefault();
            lenisInstance.scrollTo(target as HTMLElement, {
              offset: -80, duration: 1.4,
              easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            });
          }
        });
      });

      // Cursor
      const cursor = document.getElementById("cursor");
      const follower = document.getElementById("cursor-follower");
      if (cursor && follower) {
        let mouseX = 0, mouseY = 0, followerX = 0, followerY = 0;
        window.addEventListener("mousemove", (e) => {
          mouseX = e.clientX; mouseY = e.clientY;
          gsap.to(cursor, { x: mouseX, y: mouseY, duration: 0.1 });
        });
        const followCursor = () => {
          followerX += (mouseX - followerX) * 0.12;
          followerY += (mouseY - followerY) * 0.12;
          gsap.set(follower, { x: followerX, y: followerY });
          requestAnimationFrame(followCursor);
        };
        followCursor();
        document.querySelectorAll("a, button, .project-card, .time-slot, .dot").forEach((el) => {
          el.addEventListener("mouseenter", () => { cursor.classList.add("cursor-grow"); follower.classList.add("follower-grow"); });
          el.addEventListener("mouseleave", () => { cursor.classList.remove("cursor-grow"); follower.classList.remove("follower-grow"); });
        });
      }
    }

    init();

    return () => {
      cancelAnimationFrame(rafId);
      lenisInstance?.destroy();
      gsapInstance?.ticker?.remove?.(() => {});
    };
  }, [preloaderGone]);

  // Burger menu GSAP
  const toggleMenu = async () => {
    const { gsap } = await import("gsap");
    const newOpen = !menuOpen;
    setMenuOpen(newOpen);
    const spans = document.querySelectorAll<HTMLElement>(".nav-burger span");
    if (newOpen) {
      gsap.to(spans[0], { rotation: 45, y: 6, duration: 0.3 });
      gsap.to(spans[1], { rotation: -45, y: -6, duration: 0.3 });
    } else {
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    }
  };

  const closeMobileMenu = () => {
    setMenuOpen(false);
    const spans = document.querySelectorAll<HTMLElement>(".nav-burger span");
    import("gsap").then(({ gsap }) => {
      gsap.to(spans[0], { rotation: 0, y: 0, duration: 0.3 });
      gsap.to(spans[1], { rotation: 0, y: 0, duration: 0.3 });
    });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => { setSubmitting(false); setFormSubmitted(true); }, 1200);
  };

  return (
    <>
      {/* Preloader */}
      {!preloaderGone && (
        <div id="preloader">
          <div>
            <span className="preloader-text">Loading</span>
            <div className="preloader-bar">
              <div className="preloader-fill" style={{ width: `${preloadProgress}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Cursor */}
      <div id="cursor" />
      <div id="cursor-follower" />

      {/* Nav */}
      <nav id="nav">
        <a href="#" className="nav-logo">VC</a>
        <div className="nav-links">
          <a href="#work" className="nav-link">Work</a>
          <a href="#process" className="nav-link">Process</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#schedule" className="nav-link nav-cta">Schedule a Call</a>
        </div>
        <button className="nav-burger" aria-label="Menu" onClick={toggleMenu}>
          <span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div id="mobile-menu" className={menuOpen ? "open" : ""}>
        <a href="#work" className="mobile-link" onClick={closeMobileMenu}>Work</a>
        <a href="#process" className="mobile-link" onClick={closeMobileMenu}>Process</a>
        <a href="#about" className="mobile-link" onClick={closeMobileMenu}>About</a>
        <a href="#schedule" className="mobile-link" onClick={closeMobileMenu}>Schedule a Call</a>
      </div>

      {/* Hero */}
      <section id="hero">
        {/*
          Background photo that InkReveal uncovers as the cursor moves.
          Replace this src with Vivack's actual portrait or portfolio photo.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/vivack.jpg"
          alt="Vivack Chan"
          className="hero-bg-photo"
        />

        {/*
          InkReveal sits at z-index 1, masking the photo with the site's dark
          background color. Moving the cursor carves organic ink-stamp holes
          through the mask, revealing the photo beneath.
        */}
        <InkReveal
          maskColor={[12, 11, 9]}
          brushSize={190}
          lifetime={1100}
          rStart={12}
          rVary={0.5}
          stampStep={10}
          maxStamps={400}
          segments={40}
          wobble={[0.16, 0.09, 0.06]}
          gradientStops={[0.98, 0.9, 0]}
        />

        <div className="hero-content">
          <div className="hero-eyebrow">
            <span className="eyebrow-dot" />
            <span>Open to work · Based in San Francisco, CA</span>
          </div>
          <h1 className="hero-title">
            <span className="line-wrap"><em className="hero-line">Made</em></span>
            <span className="line-wrap"><span className="hero-line hero-line-2">to be <span className="hero-accent">seen.</span></span></span>
            <span className="line-wrap"><span className="hero-line">Built to</span></span>
            <span className="line-wrap"><span className="hero-line">last.</span></span>
          </h1>
          <div className="hero-footer">
            <p className="hero-desc">Vivack Chan — Visual Communication &amp; Industrial Designer who works from the screen to the shop floor.</p>
            <a href="#work" className="btn-scroll">
              <span>See the work</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 3v10M3 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </a>
          </div>
        </div>

        <div className="hero-marquee-wrap">
          <div className="hero-marquee">
            {["Visual Communication", "Industrial Design", "Scientific Illustration", "Fabrication", "Print & Digital",
              "Visual Communication", "Industrial Design", "Scientific Illustration", "Fabrication", "Print & Digital"].map((item, i) => (
              <span key={i}>{i % 5 !== 0 && <span className="sep"> · </span>}{item}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story">
        <div className="story-label">The Approach</div>
        <div className="story-blocks">
          {[
            { n: "01", text: <>Good design lives in two worlds — <em>the image</em> and <em>the object.</em> I build in both.</> },
            { n: "02", text: <>Whether it&apos;s a conservation poster or a parade float, the question is always the same: does this <em>communicate</em> clearly and <em>hold up</em> under pressure?</> },
            { n: "03", text: <>I believe the best creative work comes from people who know <em>why</em> something needs to exist before they decide <em>how</em> it should look.</> },
          ].map(({ n, text }) => (
            <div className="story-block" key={n}>
              <div className="story-number">{n}</div>
              <div className="story-text"><h2>{text}</h2></div>
            </div>
          ))}
        </div>
      </section>

      {/* Work */}
      <section id="work">
        <div className="section-header">
          <div className="section-label">Selected Work</div>
          <h2 className="section-title" data-reveal>Real projects. <em>Real constraints.</em></h2>
        </div>
        <div className="projects-grid">

          <article className="project-card project-large">
            <div className="project-img-wrap">
              <div className="project-img project-img-1" />
              <div className="project-overlay"><span className="project-view">View Project →</span></div>
            </div>
            <div className="project-meta">
              <div className="project-tags"><span className="tag">Scientific Illustration</span><span className="tag">Visual Communication</span></div>
              <h3 className="project-title">Gray Whale Watch — Conservation Illustration Series</h3>
              <p className="project-desc">Scientific illustrations for gray whale conservation in SF Bay, created with the Estuary &amp; Ocean Science Center at SFSU. Translating marine biology into public-facing graphics that drive awareness of vessel strikes.</p>
              <span className="project-year">2026</span>
            </div>
          </article>

          <article className="project-card">
            <div className="project-img-wrap">
              <div className="project-img project-img-2" />
              <div className="project-overlay"><span className="project-view">View Project →</span></div>
            </div>
            <div className="project-meta">
              <div className="project-tags"><span className="tag">Graphic Design</span><span className="tag">Print &amp; Digital</span></div>
              <h3 className="project-title">Mashouf Wellness Center — Campaign Design System</h3>
              <p className="project-desc">Full marketing design system for SFSU Campus Recreation — flyers, digital screens, posters, and social media keeping 35,000 students informed and on-brand.</p>
              <span className="project-year">2026</span>
            </div>
          </article>

          <article className="project-card">
            <div className="project-img-wrap">
              <div className="project-img project-img-3" />
              <div className="project-overlay"><span className="project-view">View Project →</span></div>
            </div>
            <div className="project-meta">
              <div className="project-tags"><span className="tag">Fabrication</span><span className="tag">Large-Scale Build</span></div>
              <h3 className="project-title">The Parade Guys — Float Construction & Finishing</h3>
              <p className="project-desc">Large-scale parade float builds and event installations for SF — painting, vinyl, fabric, and foam construction. Where creative direction meets power tools.</p>
              <span className="project-year">2025</span>
            </div>
          </article>

          <article className="project-card project-wide">
            <div className="project-img-wrap">
              <div className="project-img project-img-4" />
              <div className="project-overlay"><span className="project-view">View Project →</span></div>
            </div>
            <div className="project-meta">
              <div className="project-tags"><span className="tag">Industrial Design</span><span className="tag">Exhibition</span></div>
              <h3 className="project-title">SFSU ID Graduate Exhibition — Frame Production &amp; Installation</h3>
              <p className="project-desc">Executed large-scale fabrication and spatial installation of exhibition frames for the SFSU Industrial Design Graduate Exhibition — from production schedule to final spatial presentation.</p>
              <span className="project-year">2026</span>
            </div>
          </article>

        </div>
      </section>

      {/* Disciplines */}
      <section id="disciplines">
        <div className="disciplines-inner">
          <div className="discipline-panel discipline-graphic">
            <div className="discipline-content" data-reveal>
              <span className="discipline-label">Visual Communication Design</span>
              <h3>What you see <em>tells</em> what matters.</h3>
              <p>Scientific illustration, campus marketing, digital graphics, and print — every visual decision made with the audience in mind, not just the eye.</p>
              <ul className="discipline-list">
                {[
                  "Scientific & Nature Illustration",
                  "Print & Digital Marketing",
                  "Social Media & Screen Design",
                  "Typography & Color Theory",
                  "Adobe CC · Figma · Procreate",
                ].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
          <div className="discipline-divider" />
          <div className="discipline-panel discipline-industrial">
            <div className="discipline-content" data-reveal>
              <span className="discipline-label">Industrial Design</span>
              <h3>Objects made to <em>matter.</em></h3>
              <p>From exhibition frames to parade floats — fabrication and design working together, where the constraint of physical material makes the outcome more honest.</p>
              <ul className="discipline-list">
                {[
                  "Fabrication & Construction",
                  "Exhibition & Spatial Design",
                  "3D Modeling (SolidWorks)",
                  "Material Handling & Finishing",
                  "Power Tools · Laser Cutting · CNC",
                ].map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section id="process">
        <div className="section-header">
          <div className="section-label">How it works</div>
          <h2 className="section-title" data-reveal>From <em>brief</em> to <em>built.</em></h2>
        </div>
        <div className="process-steps">
          {[
            { n: "01", title: "Understand the Context", body: "I start with the why — who is the audience, what is the environment, what needs to survive contact with the real world. Good briefs lead to good work; unclear briefs get unpacked first.", line: true },
            { n: "02", title: "Sketch Across Directions", body: "Digital or analog, I explore multiple directions before committing. The point isn't quantity — it's finding the approach that holds up when you stress-test it.", line: true },
            { n: "03", title: "Refine Under Constraint", body: "I work inside deadlines, budgets, and material limits — not around them. Constraint is where design gets honest.", line: true },
            { n: "04", title: "Deliver & Hand Off Clean", body: "Final files, production-ready assets, or a finished build — delivered with documentation your team can actually act on.", line: false },
          ].map(({ n, title, body, line }) => (
            <div className="process-step" key={n}>
              <div className="step-number">{n}</div>
              <div className="step-body"><h3>{title}</h3><p>{body}</p></div>
              {line && <div className="step-line" />}
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about">
        <div className="about-inner">
          <div className="about-left" data-reveal>
            <div className="about-img-wrap">
              <div className="about-img" />
              <div className="about-img-caption">SFSU School of Design, San Francisco — 2025</div>
            </div>
          </div>
          <div className="about-right">
            <div className="section-label">About</div>
            <h2 className="about-title" data-reveal>I design for the screen <em>and</em> the shop floor.</h2>
            <div className="about-body" data-reveal>
              <p>I&apos;m Vivack Chan, a Visual Communication Design and Industrial Design student at San Francisco State University. My work spans scientific illustration, graphic design, fabrication, and exhibition — two disciplines that feel like one language when you use them together.</p>
              <p>I&apos;ve illustrated whale conservation campaigns for marine scientists, built parade floats from foam and fabric, designed campus-wide marketing systems, and produced exhibition frames for the SFSU ID Graduate Show. Each role taught me to design for a specific reality, not a hypothetical one.</p>
              <p>Before design school I led video production in Yangon — that background in storytelling, team direction, and client work still shapes how I approach every project.</p>
            </div>
            <div className="about-stats" data-reveal>
              <div className="stat"><span className="stat-num">7+</span><span className="stat-label">Years of creative work</span></div>
              <div className="stat"><span className="stat-num">6</span><span className="stat-label">Roles &amp; studios</span></div>
              <div className="stat"><span className="stat-num">2</span><span className="stat-label">Disciplines, one practice</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials">
        <div className="section-label">What collaborators say</div>
        <div className="testimonials-track">
          {slides.map((slide, i) => (
            <div key={i} className={`testimonial-slide${i === currentSlide ? " active" : ""}`}>
              <blockquote>&ldquo;{slide.quote}&rdquo;</blockquote>
              <cite>{slide.cite}</cite>
            </div>
          ))}
        </div>
        <div className="testimonial-controls">
          <button className="testimonial-prev" aria-label="Previous" onClick={() => setCurrentSlide((c) => (c - 1 + slides.length) % slides.length)}>←</button>
          <div className="testimonial-dots">
            {slides.map((_, i) => <span key={i} className={`dot${i === currentSlide ? " active" : ""}`} onClick={() => setCurrentSlide(i)} />)}
          </div>
          <button className="testimonial-next" aria-label="Next" onClick={() => setCurrentSlide((c) => (c + 1) % slides.length)}>→</button>
        </div>
      </section>

      {/* Schedule */}
      <section id="schedule">
        <div className="schedule-inner">
          <div className="schedule-left" data-reveal>
            <div className="section-label">Work Together</div>
            <h2 className="schedule-title">Let&apos;s talk <em>about what you&apos;re building.</em></h2>
            <p className="schedule-desc">Graphic design, illustration, fabrication, or something that crosses all three — book 30 minutes and let&apos;s figure out if I&apos;m the right fit.</p>
            <div className="schedule-perks">
              {["Free 30-min intro call", "Clear scope & honest timeline", "No pressure, just a conversation"].map((perk) => (
                <div className="perk" key={perk}>
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5" /><path d="M7 10l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <span>{perk}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="schedule-right" data-reveal>
            <div className="booking-form-card">
              <h3>Schedule a Meeting</h3>
              <p className="form-subtitle">Pick a time that works for you.</p>

              {!formSubmitted ? (
                <form className="booking-form" onSubmit={handleFormSubmit}>
                  <div className="form-row">
                    <div className="form-group"><label htmlFor="firstName">First Name</label><input type="text" id="firstName" placeholder="Your first name" required /></div>
                    <div className="form-group"><label htmlFor="lastName">Last Name</label><input type="text" id="lastName" placeholder="Your last name" required /></div>
                  </div>
                  <div className="form-group"><label htmlFor="email">Email</label><input type="email" id="email" placeholder="you@company.com" required /></div>
                  <div className="form-group"><label htmlFor="company">Company / Project Name</label><input type="text" id="company" placeholder="Optional" /></div>
                  <div className="form-group">
                    <label htmlFor="meetingType">What are you working on?</label>
                    <select id="meetingType" required defaultValue="">
                      <option value="" disabled>Select a project type</option>
                      <option value="illustration">Scientific or Editorial Illustration</option>
                      <option value="graphic">Graphic Design &amp; Print</option>
                      <option value="fabrication">Fabrication &amp; Physical Build</option>
                      <option value="exhibition">Exhibition &amp; Spatial Design</option>
                      <option value="digital">Digital &amp; Social Media</option>
                      <option value="other">Something else</option>
                    </select>
                  </div>
                  <div className="form-group"><label htmlFor="message">Tell me more (optional)</label><textarea id="message" rows={3} placeholder="Brief overview of your project, timeline, budget range..." /></div>
                  <div className="form-group time-slots-wrap">
                    <label>Preferred time slot (PST)</label>
                    <div className="time-slots">
                      {[{ key: "morning", label: "Morning", sub: "9–12 PST" }, { key: "afternoon", label: "Afternoon", sub: "12–4 PST" }, { key: "evening", label: "Evening", sub: "4–7 PST" }].map(({ key, label, sub }) => (
                        <button type="button" key={key} className={`time-slot${selectedSlot === key ? " active" : ""}`} onClick={() => setSelectedSlot(key)}>
                          {label}<small>{sub}</small>
                        </button>
                      ))}
                    </div>
                  </div>
                  <button type="submit" className="btn-submit" disabled={submitting}>
                    <span>{submitting ? "Sending…" : "Request Meeting"}</span>
                    {!submitting && <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M8 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  </button>
                </form>
              ) : (
                <div className="form-success">
                  <svg width="40" height="40" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="19" stroke="#c9b89a" strokeWidth="1.5" /><path d="M13 20l5 5 9-10" stroke="#c9b89a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                  <h4>Request sent!</h4>
                  <p>Vivack will be in touch within 24 hours to confirm your slot.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div className="footer-left">
              <span className="footer-logo">VC</span>
              <p>Visual Communication &amp; Industrial Design<br />San Francisco, CA</p>
            </div>
            <div className="footer-right">
              <a href="mailto:vivack@sfsu.edu" className="footer-email">vivack@sfsu.edu</a>
              <div className="footer-socials">
                <a href="#" aria-label="Behance">Bē</a>
                <a href="#" aria-label="LinkedIn">in</a>
                <a href="#" aria-label="Instagram">Ig</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2026 Vivack Chan. All rights reserved.</span>
            <span>Crafted with intention.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
