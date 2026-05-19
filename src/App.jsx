import { useState, useEffect, useRef } from "react";

/* ── THEME ───────────────────────────────────────────────────────────
   Deep navy background  ·  Electric cyan accent  ·  Clean white text
   Inspired by modern dev portfolios (dark, sharp, no-fluff)
──────────────────────────────────────────────────────────────────── */

const COLORS = {
  bg:       "#0a0e1a",
  bgCard:   "#0f1628",
  bgCard2:  "#131929",
  surface:  "#1a2340",
  border:   "rgba(56,189,248,0.12)",
  cyan:     "#38bdf8",
  cyanDim:  "#7dd3fc",
  cyanPale: "rgba(56,189,248,0.08)",
  text:     "#e2e8f0",
  textMute: "#64748b",
  textSoft: "#94a3b8",
  white:    "#ffffff",
};

const injectStyles = () => {
  const id = "dj-global";
  if (document.getElementById(id)) return;
  const s = document.createElement("style");
  s.id = id;
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { background: #0a0e1a; color: #e2e8f0; font-family: 'DM Sans', sans-serif;
           font-weight: 300; overflow-x: hidden; }

    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: #0a0e1a; }
    ::-webkit-scrollbar-thumb { background: #38bdf8; border-radius: 4px; }

    @keyframes fadeUp   { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
    @keyframes fadeIn   { from { opacity:0; } to { opacity:1; } }
    @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0} }
    @keyframes barFill  { from { width:0; } to { width:var(--pct); } }
    @keyframes pulse    { 0%,100%{box-shadow:0 0 0 0 rgba(56,189,248,0.4)} 50%{box-shadow:0 0 0 8px rgba(56,189,248,0)} }
    @keyframes gridGlow { 0%,100%{opacity:0.03} 50%{opacity:0.07} }
    @keyframes float    { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }

    .reveal { opacity:0; transform:translateY(24px);
              transition: opacity 0.7s ease, transform 0.7s ease; }
    .reveal.on { opacity:1; transform:translateY(0); }
    .reveal.d1 { transition-delay:0.12s; }
    .reveal.d2 { transition-delay:0.22s; }

    .skill-bar { width:0; transition: width 1.3s cubic-bezier(.4,0,.2,1); }
    .skill-bar.run { width: var(--pct); }

    .project-card-hover {
      transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
    }
    .project-card-hover:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 60px rgba(0,0,0,0.5);
      border-color: rgba(56,189,248,0.35) !important;
    }

    .cert-card-hover {
      transition: background 0.22s, border-color 0.22s;
    }
    .cert-card-hover:hover {
      background: rgba(56,189,248,0.06) !important;
      border-color: rgba(56,189,248,0.3) !important;
    }

    .nav-link-item {
      position: relative;
      font-size: 0.72rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #64748b;
      text-decoration: none;
      transition: color 0.2s;
      cursor: pointer;
      background: none; border: none; font-family: inherit;
    }
    .nav-link-item::after {
      content:''; position:absolute; left:0; bottom:-4px;
      width:0; height:1px; background:#38bdf8; transition:width 0.3s;
    }
    .nav-link-item:hover { color:#e2e8f0; }
    .nav-link-item:hover::after { width:100%; }

    .mobile-menu { display:none; }
    @media(max-width:768px) {
      .nav-desktop { display:none !important; }
      .mobile-menu { display:flex; }
      
      /* Grid Fallbacks for Mobile */
      .hero-grid { grid-template-columns:1fr !important; gap: 3rem !important; }
      .about-grid { grid-template-columns:1fr !important; gap: 3rem !important; }
      .proj-grid-top { grid-template-columns:1fr !important; }
      .proj-grid-bot { grid-template-columns:1fr !important; }
      .cert-grid { grid-template-columns:1fr !important; }
      .contact-grid { grid-template-columns:1fr !important; gap: 3rem !important; }
      .skills-grid { grid-template-columns:1fr !important; gap: 2.5rem !important; }

      /* Spacing Fixes for Mobile */
      nav, section > div, footer, .reveal.github-strip { 
        padding-left: 1.5rem !important; 
        padding-right: 1.5rem !important; 
      }
      .project-card-hover, .cert-card-hover { 
        padding: 1.8rem !important; 
      }
      .section-header { 
        gap: 0.8rem !important; 
        margin-bottom: 2.5rem !important; 
      }
      .section-header span:first-child { 
        font-size: 2.5rem !important; 
      }
      
      /* Typography tweaks */
      .hero-title { font-size: clamp(2.5rem, 8vw, 4rem) !important; }
    }
  `;
  document.head.appendChild(s);
};

/* ── tiny hook — reveal on scroll ── */
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }),
      { threshold: 0.08 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

/* ── skill bars animate when section visible ── */
function useSkillBar(ref) {
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => {
            ref.current?.querySelectorAll(".skill-bar").forEach((b) => b.classList.add("run"));
          }, 300);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
}

/* ── data ── */
const SKILLS = [
  { cat: "Frontend", icon: "⌨️", items: [
    { name: "React.js", pct: 85 }, { name: "HTML5 & CSS3", pct: 92 },
    { name: "JavaScript (ES6+)", pct: 88 }, { name: "Tailwind CSS", pct: 80 },
  ]},
  { cat: "Languages", icon: "🖥️", items: [
    { name: "Python", pct: 80 }, { name: "Java", pct: 72 },
    { name: "SQL", pct: 78 }, { name: "C / C++", pct: 65 },
  ]},
  { cat: "Backend & DB", icon: "⚙️", items: [
    { name: "Node.js & Express", pct: 78 }, { name: "REST APIs", pct: 82 },
    { name: "PostgreSQL / MySQL", pct: 75 }, { name: "MongoDB", pct: 68 },
  ]},
  { cat: "Tools & Platforms", icon: "🛠️", items: [
    { name: "Git & GitHub", pct: 88 }, { name: "Netlify / Render", pct: 80 },
    { name: "VS Code / Linux", pct: 85 }, { name: "Agile / SDLC", pct: 72 },
  ]},
];

const PROJECTS_TOP = [
  {
    index: "01", badge: "Featured",
    name: "Netflix Clone — Full-Stack",
    problem: "Problem: Building a scalable streaming app with secure auth",
    desc: "Full-stack streaming platform with JWT authentication, dynamic movie catalog via TMDB API, and personalized watchlists. Node.js/Express backend deployed on Render + Netlify.",
    tags: ["React", "Node.js", "Express", "JWT Auth", "TMDB API", "Netlify"],
    link: "https://github.com/Deepika-2029/netflix-clone-fullstack",
  },
  {
    index: "02", badge: "Full-Stack",
    name: "GharKharcha — Budget Tracker",
    problem: "Problem: Helping families visualize household expenses",
    desc: "Family finance app with transaction logs, budget insights, and category-wise breakdowns. Migrated from SQLite to PostgreSQL for production-ready reliability.",
    tags: ["React", "PostgreSQL", "Node.js", "Render"],
    link: "https://github.com/Deepika-2029/gharkharcha",
  },
];

const PROJECTS_BOT = [
  {
    index: "03",
    name: "Ultimate Calculator Suite",
    problem: "One app for all everyday calculations",
    desc: "Multi-mode utility — standard, BMI, EMI & Age calculators with base converters and persistent LocalStorage history. Dark mode UI.",
    tags: ["React", "LocalStorage", "Netlify"],
    link: "https://github.com/Deepika-2029/ultimate-calculator",
  },
  {
    index: "04",
    name: "Spotify Clone — Music UI",
    problem: "Replicating a complex audio UI with pure web tech",
    desc: "Faithful Spotify interface recreation with core audio playback, playlist navigation, and fully responsive layout deployed on Render.",
    tags: ["HTML/CSS/JS", "Web Audio API", "Render"],
    link: "https://github.com/Deepika-2029/spotify-clone",
  },
];

const CERTS = [
  {
    issuer: "Coursera · Meta",
    name: "Frontend Developer Professional Certificate",
    desc: "Multi-course credential covering React, HTML/CSS, JavaScript, UI/UX design principles, and version control — from Meta's official developer curriculum.",
    meta: "Issued 2024 · No Expiration",
    link: "https://www.coursera.org",
  },
  {
    issuer: "Udemy",
    name: "Full-Stack Web Development Bootcamp",
    desc: "Complete web stack bootcamp — HTML to React on frontend, Node.js, Express, PostgreSQL, REST APIs on backend, with real-world project deployment.",
    meta: "Issued 2023 · No Expiration",
    link: "https://www.udemy.com",
  },
  {
    issuer: "HackerRank",
    name: "JavaScript (Intermediate) Certificate",
    desc: "Validates proficiency in closures, promises, async/await, event handling, and ES6+ features via HackerRank's skill assessment.",
    meta: "Issued 2023 · Credential ID: HR-JS-INT",
    link: "https://www.hackerrank.com/certificates",
  },
  {
    issuer: "Google · Coursera",
    name: "Technical Support Fundamentals",
    desc: "Covers IT fundamentals — hardware, software, internet, troubleshooting — forming strong foundation for development workflows and system understanding.",
    meta: "Issued 2023 · Google Certificate",
    link: "https://www.coursera.org/google-certificates",
  },
];

/* ── helpers ── */
const C = COLORS;
const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

const Tag = ({ label }) => (
  <span style={{
    fontSize: "0.58rem", letterSpacing: "0.14em", textTransform: "uppercase",
    color: C.cyan, border: `1px solid ${C.border}`, padding: "0.22rem 0.65rem",
    borderRadius: "100px", background: C.cyanPale,
  }}>{label}</span>
);

const Badge = ({ label }) => (
  <span style={{
    display: "inline-block", fontSize: "0.55rem", letterSpacing: "0.16em",
    textTransform: "uppercase", background: C.cyan, color: C.bg,
    padding: "0.18rem 0.6rem", borderRadius: "2px", fontWeight: 600,
    marginBottom: "0.7rem",
  }}>{label}</span>
);

const SectionHeader = ({ num, label, title, titleEm }) => (
  <div className="reveal section-header" style={{ display: "flex", alignItems: "center", gap: "1.4rem", marginBottom: "4rem" }}>
    <span style={{
      fontFamily: "'Syne', sans-serif", fontSize: "3.5rem", fontWeight: 800,
      color: "rgba(56,189,248,0.1)", lineHeight: 1, userSelect: "none",
    }}>{num}</span>
    <div style={{ flex: 1 }}>
      <p style={{ fontSize: "0.6rem", letterSpacing: "0.3em", textTransform: "uppercase", color: C.cyan, marginBottom: "0.25rem" }}>{label}</p>
      <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.7rem,3vw,2.5rem)", fontWeight: 700, color: C.white }}>
        {title} <em style={{ fontStyle: "italic", color: C.cyan, fontWeight: 400 }}>{titleEm}</em>
      </h2>
    </div>
    <div style={{ flex: 1, height: "1px", background: C.border }} />
  </div>
);

/* ── NAVBAR ── */
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "About", id: "about" },
    { label: "Projects", id: "projects" },
    { label: "Skills", id: "skills" },
    { label: "Certifications", id: "certifications" },
    { label: "Contact", id: "contact" },
  ];

  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: 64,
      background: scrolled ? "rgba(10,14,26,0.95)" : "rgba(10,14,26,0.7)",
      backdropFilter: "blur(16px)",
      borderBottom: `1px solid ${scrolled ? C.border : "transparent"}`,
      padding: "0 4rem",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      transition: "all 0.3s",
    }}>
      {/* Logo */}
      <button onClick={() => scrollTo("hero")} style={{
        background: "none", border: "none", cursor: "pointer",
        fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: "1.1rem",
        letterSpacing: "0.06em", color: C.white,
      }}>
        Deepika<span style={{ color: C.cyan }}>.</span>
      </button>

      {/* Desktop links */}
      <ul className="nav-desktop" style={{ listStyle: "none", display: "flex", gap: "2rem", alignItems: "center" }}>
        {links.map((l) => (
          <li key={l.id}>
            <button className="nav-link-item" onClick={() => scrollTo(l.id)}>{l.label}</button>
          </li>
        ))}
        <li>
          <a href="mailto:deepikajeena@email.com" style={{
            fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em",
            textTransform: "uppercase", textDecoration: "none",
            padding: "0.5rem 1.3rem", background: C.cyan, color: C.bg,
            borderRadius: "3px", transition: "opacity 0.2s", fontFamily: "'DM Sans', sans-serif",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >Hire Me</a>
        </li>
      </ul>

      {/* Hamburger */}
      <button className="mobile-menu" onClick={() => setMenuOpen(!menuOpen)} style={{
        background: "none", border: "none", cursor: "pointer", color: C.white,
        fontSize: "1.3rem",
      }}>{menuOpen ? "✕" : "☰"}</button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: "fixed", top: 64, left: 0, right: 0,
          background: "rgba(10,14,26,0.98)", borderBottom: `1px solid ${C.border}`,
          padding: "1.5rem 2rem",
          display: "flex", flexDirection: "column", gap: "1.2rem",
        }}>
          {links.map((l) => (
            <button key={l.id} className="nav-link-item" onClick={() => { scrollTo(l.id); setMenuOpen(false); }}
              style={{ textAlign: "left" }}>{l.label}</button>
          ))}
          <a href="mailto:deepikajeena@email.com" style={{
            fontSize: "0.7rem", fontWeight: 600, color: C.cyan,
            textDecoration: "none", letterSpacing: "0.15em",
          }}>Hire Me →</a>
        </div>
      )}
    </nav>
  );
};

/* ── HERO ── */
const Hero = () => {
  const [typed, setTyped] = useState("");
  const titles = ["Frontend Developer", "React Specialist", "UI/UX Enthusiast", "Problem Solver"];
  const tIdx = useRef(0);
  const cIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timer;
    const type = () => {
      const current = titles[tIdx.current];
      if (!deleting.current) {
        setTyped(current.slice(0, ++cIdx.current));
        if (cIdx.current === current.length) { deleting.current = true; timer = setTimeout(type, 1800); return; }
      } else {
        setTyped(current.slice(0, --cIdx.current));
        if (cIdx.current === 0) { deleting.current = false; tIdx.current = (tIdx.current + 1) % titles.length; }
      }
      timer = setTimeout(type, deleting.current ? 45 : 80);
    };
    timer = setTimeout(type, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="hero" style={{ minHeight: "100vh", paddingTop: 64, position: "relative", overflow: "hidden" }}>
      {/* Background grid */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`,
        backgroundSize: "60px 60px", animation: "gridGlow 4s ease-in-out infinite",
        pointerEvents: "none",
      }} />
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: "15%", right: "10%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div className="hero-grid" style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        minHeight: "calc(100vh - 64px)", maxWidth: 1080, margin: "0 auto", padding: "0 4rem",
        alignItems: "center", gap: "4rem", position: "relative",
      }}>
        {/* LEFT */}
        <div style={{ animation: "fadeUp 0.9s ease both" }}>
          <p style={{
            fontSize: "0.65rem", letterSpacing: "0.35em", textTransform: "uppercase",
            color: C.cyan, marginBottom: "1.5rem",
            display: "flex", alignItems: "center", gap: "0.8rem",
          }}>
            <span style={{ display: "inline-block", width: 28, height: 1, background: C.cyan }} />
            Hello, I'm
          </p>

          <h1 className="hero-title" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(3rem, 6vw, 5.5rem)", lineHeight: 1.05,
            color: C.white, marginBottom: "1rem",
          }}>
            Deepika<br />
            <span style={{ color: C.cyan }}>Jeena</span>
          </h1>

          <div style={{ height: "2.2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center" }}>
            <span style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: "1.15rem",
              color: C.textSoft,
            }}>
              {typed}
              <span style={{ animation: "blink 1s infinite", color: C.cyan }}>|</span>
            </span>
          </div>

          <p style={{ fontSize: "0.88rem", color: C.textSoft, lineHeight: 1.8, maxWidth: 420, marginBottom: "2.5rem" }}>
            Building clean, accessible, and visually compelling web experiences.
            I bridge design and functionality — turning complex requirements into
            elegant, user-friendly interfaces.
          </p>

          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button onClick={() => scrollTo("projects")} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 500,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "0.85rem 2rem", background: C.cyan, color: C.bg,
              border: "none", borderRadius: "3px", cursor: "pointer", transition: "opacity 0.2s",
            }}
              onMouseEnter={e => e.target.style.opacity = "0.85"}
              onMouseLeave={e => e.target.style.opacity = "1"}
            >View Projects</button>
            <button onClick={() => scrollTo("contact")} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.68rem", fontWeight: 400,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "0.85rem 2rem", background: "transparent", color: C.cyan,
              border: `1px solid rgba(56,189,248,0.35)`, borderRadius: "3px",
              cursor: "pointer", transition: "all 0.2s",
            }}
              onMouseEnter={e => { e.target.style.background = C.cyanPale; }}
              onMouseLeave={e => { e.target.style.background = "transparent"; }}
            >Get In Touch</button>
          </div>
        </div>

        {/* RIGHT — Photo placeholder + stats */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2rem", animation: "fadeUp 0.9s 0.2s ease both" }}>
          {/* Photo circle */}
          <div style={{
            width: 220, height: 220, borderRadius: "50%",
            background: `linear-gradient(135deg, ${C.surface} 0%, ${C.bgCard} 100%)`,
            border: `2px solid rgba(56,189,248,0.3)`,
            boxShadow: "0 0 60px rgba(56,189,248,0.15), 0 0 0 8px rgba(56,189,248,0.05)",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "float 4s ease-in-out infinite",
            position: "relative",
          }}>
            {/* 
              To add photo: replace this div's content with:
              <img src="your-photo.jpg" alt="Deepika Jeena"
                   style={{width:"100%",height:"100%",borderRadius:"50%",objectFit:"cover"}} />
            */}
            <span style={{
              fontFamily: "'Syne', sans-serif", fontSize: "4rem", fontWeight: 800,
              background: `linear-gradient(135deg, ${C.cyan}, ${C.cyanDim})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>DJ</span>
            {/* Orbit ring */}
            <div style={{
              position: "absolute", inset: -14,
              borderRadius: "50%", border: `1px dashed rgba(56,189,248,0.2)`,
            }} />
          </div>

          {/* Quick stat chips */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            {[
              { label: "Projects", val: "10+" },
              { label: "Certs", val: "4" },
              { label: "Status", val: "Open ✦" },
            ].map((s) => (
              <div key={s.label} style={{
                background: C.bgCard, border: `1px solid ${C.border}`,
                borderRadius: "8px", padding: "0.85rem 1.4rem", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: C.cyan }}>{s.val}</div>
                <div style={{ fontSize: "0.6rem", letterSpacing: "0.15em", textTransform: "uppercase", color: C.textMute, marginTop: "0.2rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <div style={{
        position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem",
        color: C.textMute, fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase",
      }}>
        scroll
        <div style={{ width: 1, height: 40, background: `linear-gradient(${C.cyan}, transparent)` }} />
      </div>
    </section>
  );
};

/* ── ABOUT ── */
const About = () => (
  <section id="about" style={{ background: C.bgCard, padding: "7rem 0" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 4rem" }}>
      <SectionHeader num="00" label="Who I Am" title="About" titleEm="Me" />
      <div className="about-grid reveal d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.15rem", fontWeight: 600, lineHeight: 1.7, color: C.text, marginBottom: "1.2rem" }}>
            I'm a Frontend Developer passionate about crafting clean, accessible, and visually compelling web experiences.
          </p>
          <p style={{ fontSize: "0.87rem", color: C.textSoft, lineHeight: 1.85, marginBottom: "2rem" }}>
            I bridge the gap between design and functionality — turning complex requirements into elegant, user-friendly interfaces. With hands-on experience in React, Node.js, and full-stack architecture, I enjoy solving real problems through thoughtful, maintainable code.
          </p>
          <div style={{ display: "flex", gap: "1rem" }}>
            <button onClick={() => scrollTo("contact")} style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 600,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "0.8rem 1.8rem", background: C.cyan, color: C.bg,
              border: "none", borderRadius: "3px", cursor: "pointer",
            }}>Hire Me</button>
            <a href="https://github.com/Deepika-2029" target="_blank" rel="noreferrer" style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: "0.65rem", fontWeight: 400,
              letterSpacing: "0.18em", textTransform: "uppercase",
              padding: "0.8rem 1.8rem", background: "transparent", color: C.cyan,
              border: `1px solid rgba(56,189,248,0.35)`, borderRadius: "3px",
              textDecoration: "none",
            }}>GitHub ↗</a>
          </div>
        </div>
        <div style={{ borderTop: `1px solid ${C.border}` }}>
          {[
            { label: "Role", value: "Frontend Developer" },
            { label: "Location", value: "India" },
            { label: "Focus", value: "React · UI/UX · Full-Stack" },
            { label: "Education", value: "B.Tech · Computer Science" },
            { label: "Email", value: "deepikajeena@email.com" },
            { label: "Status", value: "● Open to Opportunities", highlight: true },
          ].map((f) => (
            <div key={f.label} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "1.1rem 0", borderBottom: `1px solid ${C.border}`,
            }}>
              <span style={{ fontSize: "0.62rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMute }}>{f.label}</span>
              <span style={{ fontSize: "0.82rem", color: f.highlight ? C.cyan : C.text, fontWeight: f.highlight ? 500 : 300 }}>{f.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

/* ── PROJECTS ── */
const ProjectCard = ({ p, large }) => (
  <div className="project-card-hover" style={{
    background: C.bgCard2, border: `1px solid ${C.border}`,
    padding: large ? "3rem" : "2.4rem",
    position: "relative", display: "block",
  }}>
    {p.badge && <Badge label={p.badge} />}
    <div style={{
      fontFamily: "'Syne', sans-serif", fontStyle: "italic", fontSize: "0.82rem",
      color: C.cyan, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "0.7rem",
    }}>
      {p.index}
      <span style={{ flex: 1, height: 1, background: C.border, maxWidth: 36 }} />
    </div>
    <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: large ? "1.45rem" : "1.2rem", color: C.white, marginBottom: "0.6rem", lineHeight: 1.25 }}>{p.name}</h3>
    <p style={{ fontSize: "0.68rem", letterSpacing: "0.1em", color: C.cyan, marginBottom: "0.7rem", fontStyle: "italic" }}>{p.problem}</p>
    <p style={{ fontSize: "0.78rem", color: C.textSoft, lineHeight: 1.8, marginBottom: "1.3rem" }}>{p.desc}</p>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.45rem", marginBottom: "1.3rem" }}>
      {p.tags.map((t) => <Tag key={t} label={t} />)}
    </div>
    <a href={p.link} target="_blank" rel="noreferrer" style={{
      display: "inline-flex", alignItems: "center", gap: "0.4rem",
      fontSize: "0.63rem", letterSpacing: "0.18em", textTransform: "uppercase",
      color: C.cyan, textDecoration: "none",
      borderBottom: "1px solid rgba(56,189,248,0.25)", paddingBottom: "2px",
    }}>View on GitHub ↗</a>
    {/* Arrow hover */}
    <span style={{ position: "absolute", top: "1.8rem", right: "2rem", color: C.cyan, fontSize: "1.1rem", opacity: 0.3 }}>↗</span>
  </div>
);

const Projects = () => (
  <section id="projects" style={{ background: C.bg, padding: "7rem 0" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 4rem" }}>
      <SectionHeader num="01" label="Selected Work" title="Featured" titleEm="Projects" />

      <div className="proj-grid-top reveal d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: C.border, border: `1px solid ${C.border}`, marginBottom: "2px" }}>
        {PROJECTS_TOP.map((p) => <ProjectCard key={p.index} p={p} large />)}
      </div>

      <div className="proj-grid-bot reveal d2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: C.border, border: `1px solid ${C.border}`, borderTop: "none" }}>
        {PROJECTS_BOT.map((p) => <ProjectCard key={p.index} p={p} />)}
      </div>

      {/* View All */}
      <div className="reveal" style={{ marginTop: "2.5rem", display: "flex", alignItems: "center", gap: "2rem" }}>
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <a href="https://github.com/Deepika-2029" target="_blank" rel="noreferrer" style={{
          display: "inline-flex", alignItems: "center", gap: "0.6rem",
          fontSize: "0.64rem", letterSpacing: "0.2em", textTransform: "uppercase",
          color: C.cyan, textDecoration: "none",
          border: `1px solid rgba(56,189,248,0.25)`, padding: "0.75rem 1.8rem", borderRadius: "3px",
          whiteSpace: "nowrap", transition: "all 0.2s", fontFamily: "'DM Sans', sans-serif",
        }}
          onMouseEnter={e => { e.currentTarget.style.background = C.cyanPale; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
        >
          ⭐ View All My Works on GitHub
        </a>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
    </div>
  </section>
);

/* ── SKILLS ── */
const Skills = () => {
  const ref = useRef(null);
  useSkillBar(ref);
  return (
    <section id="skills" style={{ background: C.bgCard, padding: "7rem 0" }} ref={ref}>
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 4rem" }}>
        <SectionHeader num="02" label="Technical Expertise" title="Skills &" titleEm="Technologies" />
        <div className="skills-grid reveal d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem 5rem" }}>
          {SKILLS.map((grp) => (
            <div key={grp.cat}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.9rem",
                color: C.white, marginBottom: "1.5rem", paddingBottom: "0.65rem",
                borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: "0.6rem",
                letterSpacing: "0.04em",
              }}>
                {grp.icon} &nbsp; {grp.cat}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                {grp.items.map((sk) => (
                  <div key={sk.name}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.45rem" }}>
                      <span style={{ fontSize: "0.76rem", color: C.textSoft, fontWeight: 400 }}>{sk.name}</span>
                      <span style={{ fontSize: "0.65rem", color: C.cyan, fontWeight: 500, letterSpacing: "0.1em" }}>{sk.pct}%</span>
                    </div>
                    <div style={{ height: 4, background: "rgba(56,189,248,0.1)", borderRadius: 10, overflow: "hidden" }}>
                      <div className="skill-bar" style={{
                        "--pct": `${sk.pct}%`, height: "100%",
                        background: `linear-gradient(90deg, ${C.cyan} 0%, ${C.cyanDim} 100%)`,
                        borderRadius: 10,
                      }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ── CERTIFICATIONS ── */
const Certifications = () => (
  <section id="certifications" style={{ background: C.bg, padding: "7rem 0" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 4rem" }}>
      <SectionHeader num="03" label="Continuous Learning" title="Licenses &" titleEm="Certifications" />
      <div className="cert-grid reveal d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", background: C.border, border: `1px solid ${C.border}` }}>
        {CERTS.map((c) => (
          <div key={c.name} className="cert-card-hover" style={{
            background: C.bgCard2, border: `1px solid transparent`,
            padding: "2.4rem",
          }}>
            <p style={{ fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", color: C.cyan, marginBottom: "0.6rem" }}>{c.issuer}</p>
            <h3 style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.1rem", color: C.white, marginBottom: "0.8rem", lineHeight: 1.3 }}>{c.name}</h3>
            <p style={{ fontSize: "0.76rem", color: C.textSoft, lineHeight: 1.75, marginBottom: "1rem" }}>{c.desc}</p>
            <p style={{ fontSize: "0.62rem", letterSpacing: "0.1em", color: C.textMute, marginBottom: "1.2rem" }}>{c.meta}</p>
            <a href={c.link} target="_blank" rel="noreferrer" style={{
              display: "inline-flex", alignItems: "center", gap: "0.4rem",
              fontSize: "0.62rem", letterSpacing: "0.18em", textTransform: "uppercase",
              color: C.cyan, textDecoration: "none",
              borderBottom: "1px solid rgba(56,189,248,0.2)", paddingBottom: "1px",
            }}>View Certificate ↗</a>
          </div>
        ))}
      </div>
    </div>
  </section>
);

/* ── GITHUB STRIP ── */
const GithubStrip = () => (
  <div className="reveal github-strip" style={{ background: C.surface, padding: "3rem 4rem" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
      <div>
        <p style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "1.3rem", color: C.white, marginBottom: "0.2rem" }}>Explore all repositories</p>
        <p style={{ fontSize: "0.75rem", color: C.textMute, letterSpacing: "0.08em" }}>More projects, experiments, and open-source contributions</p>
      </div>
      <a href="https://github.com/Deepika-2029" target="_blank" rel="noreferrer" style={{
        color: C.cyan, textDecoration: "none", fontSize: "0.68rem",
        letterSpacing: "0.2em", textTransform: "uppercase",
        borderBottom: "1px solid rgba(56,189,248,0.25)", paddingBottom: "2px",
        whiteSpace: "nowrap",
      }}>github.com/Deepika-2029 ↗</a>
    </div>
  </div>
);

/* ── CONTACT ── */
const Contact = () => (
  <section id="contact" style={{ background: C.bgCard, padding: "7rem 0" }}>
    <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 4rem" }}>
      <SectionHeader num="04" label="Get In Touch" title="Let's" titleEm="Connect" />
      <div className="contact-grid reveal d1" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start" }}>
        <div>
          <p style={{ fontFamily: "'Syne', sans-serif", fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.75, color: C.text, marginBottom: "1.5rem" }}>
            I'm open to internships, full-time frontend roles, and meaningful collaborations. If you have a project or just want to connect — I'd love to hear from you.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <a href="mailto:deepikajeena@email.com" style={{
              fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.18em",
              textTransform: "uppercase", textDecoration: "none",
              padding: "0.85rem 2rem", background: C.cyan, color: C.bg,
              borderRadius: "3px", fontFamily: "'DM Sans', sans-serif",
            }}>Hire Me</a>
            <a href="https://www.linkedin.com/in/deepika-jeena-4069a2281" target="_blank" rel="noreferrer" style={{
              fontSize: "0.65rem", fontWeight: 400, letterSpacing: "0.18em",
              textTransform: "uppercase", textDecoration: "none",
              padding: "0.85rem 2rem", background: "transparent", color: C.cyan,
              border: `1px solid rgba(56,189,248,0.35)`, borderRadius: "3px",
              fontFamily: "'DM Sans', sans-serif",
            }}>LinkedIn ↗</a>
          </div>
        </div>
        <ul style={{ listStyle: "none", borderTop: `1px solid ${C.border}` }}>
          {[
            { label: "LinkedIn", val: "deepika-jeena-4069a2281", href: "https://www.linkedin.com/in/deepika-jeena-4069a2281" },
            { label: "GitHub", val: "Deepika-2029", href: "https://github.com/Deepika-2029" },
            { label: "Email", val: "deepikajeena@email.com", href: "mailto:deepikajeena@email.com" },
            { label: "Status", val: "● Available for Opportunities", static: true },
          ].map((item) => (
            <li key={item.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.2rem 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: "0.6rem", letterSpacing: "0.2em", textTransform: "uppercase", color: C.textMute }}>{item.label}</span>
              {item.static
                ? <span style={{ fontSize: "0.78rem", color: C.cyan }}>{item.val}</span>
                : <a href={item.href} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: C.text, textDecoration: "none" }}
                    onMouseEnter={e => e.target.style.color = C.cyan}
                    onMouseLeave={e => e.target.style.color = C.text}
                  >{item.val} ↗</a>
              }
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

/* ── FOOTER ── */
const Footer = () => (
  <footer style={{ background: "#070b15", padding: "2rem 4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: "0.95rem", color: "rgba(255,255,255,0.2)", letterSpacing: "0.06em" }}>
      Deepika<span style={{ color: "rgba(56,189,248,0.3)" }}>.</span>
    </span>
    <span style={{ fontSize: "0.6rem", letterSpacing: "0.15em", color: "rgba(255,255,255,0.15)", textTransform: "uppercase" }}>
      © 2025 · Frontend Developer
    </span>
  </footer>
);

/* ── ROOT ── */
export default function App() {
  useEffect(() => { injectStyles(); }, []);
  useReveal();

  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Skills />
      <Certifications />
      <GithubStrip />
      <Contact />
      <Footer />
    </>
  );
}
