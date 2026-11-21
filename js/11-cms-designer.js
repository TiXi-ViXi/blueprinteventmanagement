/* ==========================================================================
   11-CMS-DESIGNER // VISUAL CMS, TEXT/PHOTO CUSTOMIZER & DESIGN ENGINE
   The Blueprint Event Management — Khulna, Bangladesh
   Allows Super Admin to customize all texts, images, team photos,
   colors, fonts, layout styles, and arbitrary CSS.
   ========================================================================== */

(function () {
  'use strict';

  const STORAGE_KEY = 'bp_site_cms_v1';
  const App = window.BlueprintApp || {};

  /* ==================== 1. DEFAULT FACTORY CONTENT ==================== */
  const DEFAULT_CONTENT = {
    branding: {
      agencyName: 'THE BLUEPRINT EVENT MANAGEMENT',
      tagline: 'Architects of Moments',
      location: 'Khulna, Bangladesh',
      hotline1: { label: 'HOTLINE 01 // PRIMARY', display: '+880 1788-706868', tel: '+8801788706868', wa: '8801788706868' },
      hotline2: { label: 'HOTLINE 02 // COMMAND', display: '+880 1703-700799', tel: '+8801703700799', wa: '8801703700799' },
      announcement: { enabled: false, text: '★ ACCEPTING 2026 EVENT COMMISSIONS IN KHULNA & NATIONWIDE', link: '#comms' }
    },
    hero: {
      badge: 'ARCHITECTS OF MOMENTS // KHULNA, BANGLADESH',
      titleLine1: 'DRAFTING THE VISION.',
      titleLine2: 'THE EXPERIENCE.',
      paragraph: 'The Blueprint Event Management bridges bold creative vision with precision stage architecture, audio-visual production, and seamless logistics across Khulna and nationwide.',
      ctaPrimaryText: 'OPEN BLUEPRINT LAB',
      ctaPrimaryLink: '#blueprint-lab',
      ctaSecondaryText: 'QUICK EVENT WIZARD',
      heroImage: ''
    },
    about: {
      sectionTag: '// SECTION 01 : ABOUT US',
      sectionTitle: "WE DON'T LEAVE MOMENTS TO CHANCE. <span class=\"bp-accent-text bp-text-glow\">WE ENGINEER THEM.</span>",
      philosophyTitle: 'Bold Creative Vision Meets Precision Execution',
      philosophyP1: 'Every landmark event begins with a master plan. <strong>The Blueprint Event Management</strong> was founded in Khulna to transform ambitious concepts into seamlessly executed concerts, corporate galas, brand activations, and luxury celebrations.',
      philosophyP2: 'Led by Founding Panel members <strong>Abdullah Bin Murshed Fattah</strong> and <strong>Nibir Guha Roy</strong> alongside our Executive Command team, we engineer every stage, sound check, lighting cue, and VIP pass with zero guesswork.',
      standardsTitle: 'Zero-Failure Redundancy & Show Calling',
      standardsP1: 'Every production runs on pre-drafted CAD floorplans, 3-phase backup power readiness, ring-out acoustic soundchecks, and real-time cue-to-cue show direction.',
      footprintTitle: 'Khulna HQ & Nationwide Deployment',
      footprintP1: 'Serving Khulna Club, Hotel Castle Salam, City Inn, CSS Ava Center, KUET, Khulna University, and destination venues across Jessore, Mongla, and Dhaka.',
      hqAgency: 'THE BLUEPRINT EVENT MGMT',
      hqBase: 'KHULNA, BANGLADESH',
      hqFounders: 'A.B.M. FATTAH & N.G. ROY',
      hqMotto: '"YOUR VISION. OUR BLUEPRINT."',
      hqMottoSub: 'Precision planning and artistic live production across every scale.',
      phases: [
        { step: '01', title: 'CONCEPT & CAD', desc: 'Spatial floorplans, 3D stage renders & custom visual identity.', icon: 'fa-compass-drafting' },
        { step: '02', title: 'STAGE & AV RIGGING', desc: 'Box trussing, line-array audio, DMX lighting & P3 LED screens.', icon: 'fa-bolt-lightning' },
        { step: '03', title: 'ACCESS & LOGISTICS', desc: 'VIP passes, security perimeter, crowd flow & hospitality.', icon: 'fa-id-badge' },
        { step: '04', title: 'SHOWCALL DIRECTION', desc: 'Zero-latency live show calling, cue matrices & crisis mitigation.', icon: 'fa-tower-broadcast' }
      ]
    },
    team: [
      {
        id: 'fattah',
        tier: 'founder',
        code: 'FOUNDING_PANEL // 01',
        clearance: 'LEVEL_ALPHA',
        name: 'Abdullah Bin Murshed Fattah',
        initials: 'AF',
        photo: { src: 'IMG_4350.JPG.jpeg', posX: 48, posY: 0 },
        role: 'Founder & Chief Architect',
        sector: 'STRATEGY & CAD',
        bio: 'Spearheading strategic event architecture, master concept drafting, and executive client partnerships across Khulna. Dedicated to turning high-stakes visions into landmark live productions.',
        specialties: ['Strategic Direction', 'Master CAD Planning', 'Client Architecture', 'Executive Coordination'],
        stats: { Architecture: 98, Logistics: 92, Production: 90, ClientCmd: 97, CrisisOps: 94 }
      },
      {
        id: 'nibir',
        tier: 'founder',
        code: 'FOUNDING_PANEL // 02',
        clearance: 'LEVEL_ALPHA',
        name: 'Nibir Guha Roy',
        initials: 'NR',
        photo: { src: 'IMG_1632.JPG.jpeg', posX: 50, posY: 16 },
        role: 'Founder & Production Director',
        sector: 'TECHNICAL & SHOW CALL',
        bio: 'Commanding full-scale technical production, stage fabrication, audio-visual engineering, and live show calling. Ensuring every event operates with zero-latency precision.',
        specialties: ['Technical Production', 'Live Show Command', 'Line-Array Audio', 'DMX Matrix Sync'],
        stats: { Architecture: 94, Logistics: 95, Production: 99, ClientCmd: 91, CrisisOps: 96 }
      },
      {
        id: 'mashukul',
        tier: 'executive',
        code: 'EXEC_ID // 01',
        clearance: 'OPS_COMMAND',
        name: 'Mashukul Islam',
        initials: 'MI',
        photo: { src: 'WhatsApp Image 2026-11-11 at 1.19.01 AM.jpeg', posX: 46, posY: 8 },
        role: 'Executive Member — Venue Operations',
        sector: 'LOGISTICS',
        bio: 'Directs on-ground venue operations, structural truss rigging coordination, power load balancing, and rapid tactical logistics deployment across Khulna.',
        specialties: ['Truss & Rigging', '3-Phase Power Grid', 'Vendor Mobilization', 'Load-In Scheduling'],
        stats: { Architecture: 86, Logistics: 97, Production: 93, ClientCmd: 85, CrisisOps: 94 }
      },
      {
        id: 'alif',
        tier: 'executive',
        code: 'EXEC_ID // 02',
        clearance: 'EXEC_OPS',
        name: 'Alif Rahman',
        initials: 'AR',
        photo: { src: 'WhatsApp Image 2026-11-11 at 2.51.32 AM.jpeg', posX: 54, posY: 22 },
        role: 'Executive Member — Guest & VIP Protocol',
        sector: 'PROTOCOL',
        bio: 'Leads VIP hospitality engineering, corporate executive protocol, greenroom artist management, and high-touch banquet execution.',
        specialties: ['VIP Hospitality', 'Artist Relations', 'Corporate Protocol', 'Reception Choreography'],
        stats: { Architecture: 84, Logistics: 90, Production: 85, ClientCmd: 98, CrisisOps: 91 }
      },
      {
        id: 'shommo',
        tier: 'executive',
        code: 'EXEC_ID // 03',
        clearance: 'CREATIVE_SYS',
        name: 'Shommo Dip Saha',
        initials: 'SS',
        photo: { src: 'WhatsApp Image 2026-11-11 at 1.20.03 AM.jpeg', posX: 44, posY: 18 },
        role: 'Executive Member — Creative & Visual Systems',
        sector: 'CREATIVE',
        bio: 'Oversees visual identity systems, bespoke stage aesthetics, 3D entry gate design, experiential branding, and synchronized media cues.',
        specialties: ['Visual Identity', 'Stage Aesthetics', 'Print & Merch CAD', 'LED Motion Graphics'],
        stats: { Architecture: 96, Logistics: 82, Production: 92, ClientCmd: 88, CrisisOps: 85 }
      },
      {
        id: 'rafi',
        tier: 'executive',
        code: 'EXEC_ID // 04',
        clearance: 'FIELD_CONTROL',
        name: 'Ahnaf Shahriar Rafi',
        initials: 'ASR',
        photo: { src: 'WhatsApp Image 2026-11-12 at 2.01.42 AM.jpeg', posX: 50, posY: 22 },
        role: 'Executive Member — Access & Security Flow',
        sector: 'SECURITY & FLOW',
        bio: 'Manages access control matrices, security perimeter grids, serialized ticketing/raffle architecture, and zero-bottleneck crowd flow dynamics.',
        specialties: ['Access Matrices', 'Perimeter Security', 'Ticketing & Raffle Tech', 'Crowd Flow Control'],
        stats: { Architecture: 85, Logistics: 94, Production: 88, ClientCmd: 89, CrisisOps: 97 }
      }
    ],
    services: [
      {
        id: 'srv-corporate',
        code: 'SYS_MOD // 01',
        category: 'corporate',
        icon: 'fa-building-columns',
        title: 'Corporate & Club Galas',
        protocol: 'EXECUTIVE',
        summary: 'AGM summits, executive banquets, Khulna Club nights, formal farewells, and institutional award ceremonies.',
        leadTime: '14–30 Days',
        linkedSubsystems: ['stage-truss', 'line-array', 'vip-lounge', 'passes-security'],
        inventory: ['Executive Podium & Stage Backdrop', 'Broadcast-Clear Wireless Mics', 'Table Spotlighting & Ambient Wash', 'Serialized VIP Invitations & Lanyards', 'Protocol Usher & Hospitality Team']
      },
      {
        id: 'srv-concert',
        code: 'SYS_MOD // 02',
        category: 'concert',
        icon: 'fa-music',
        title: 'Concerts & Cultural Fests',
        protocol: 'HIGH-DECIBEL',
        summary: 'Arena-grade live music production, university fests (KUET/KU), artist tech riders, and dual-hang line-array acoustics.',
        leadTime: '21–45 Days',
        linkedSubsystems: ['stage-truss', 'line-array', 'led-dmx', 'laser-pyro', 'passes-security', 'dual-gen'],
        inventory: ['Box Truss Goalpost Roof Rig', 'Dual-Hang Line-Array + Subwoofers', 'Digital FOH Console & Stage Monitors', 'Mojo Crowd Barricades & Pit Crew', 'Artist Backstage & Rider Fulfillment']
      },
      {
        id: 'srv-av',
        code: 'SYS_MOD // 03',
        category: 'av',
        icon: 'fa-cubes',
        title: 'Stage & AV Architecture',
        protocol: 'STRUCTURAL',
        summary: 'Custom 3D stage fabrication, P3/P2.5 LED matrix walls, intelligent beam/wash DMX arrays, lasers, and cold pyro.',
        leadTime: '10–21 Days',
        linkedSubsystems: ['stage-truss', 'led-dmx', 'laser-pyro', 'dual-gen'],
        inventory: ['CAD 3D Stage Elevation & Render', 'Seamless P3/P2.5 LED Backdrop Wall', 'Moving-Head Beam & Wash DMX Grid', 'Timecoded Cold Spark & CO2 Jets', 'Synchronized Dual 3-Phase Generators']
      },
      {
        id: 'srv-branding',
        code: 'SYS_MOD // 04',
        category: 'branding',
        icon: 'fa-pen-ruler',
        title: 'Visual Identity & Passes',
        protocol: 'CREATIVE CAD',
        summary: 'Monumental 3D entry arches, experiential photo zones, PVC VIP passes, serialized raffle draw systems, and crew apparel.',
        leadTime: '7–14 Days',
        linkedSubsystems: ['branding-print', 'passes-security', 'raffle-reg'],
        inventory: ['Monumental Branded Entry Arch', 'UV-Printed PVC VIP & Crew Badges', 'Anti-Counterfeit Hologram Tickets', 'Digital Live Raffle Draw Software', 'Custom Crew Polos & Directional Signage']
      },
      {
        id: 'srv-brand',
        code: 'SYS_MOD // 05',
        category: 'brand',
        icon: 'fa-rocket',
        title: 'Brand Activations & Expos',
        protocol: 'EXPERIENTIAL',
        summary: 'High-impact product unveilings, trade exhibition pavilions, interactive tech demo booths, and roadshows in Khulna.',
        leadTime: '14–28 Days',
        linkedSubsystems: ['branding-print', 'led-dmx', 'broadcast-cam', 'raffle-reg'],
        inventory: ['Modular Aluminum Expo Booths', 'Product Reveal Kinetic Drop / Screen', 'QR Lead-Capture Kiosks', 'Multi-Cam Highlight Reel & Drone', 'Brand Ambassador Briefing & Ops']
      },
      {
        id: 'srv-luxury',
        code: 'SYS_MOD // 06',
        category: 'luxury',
        icon: 'fa-gem',
        title: 'Bespoke Luxury Receptions',
        protocol: 'BESPOKE',
        summary: 'Architectural wedding receptions, milestone private galas, custom ambient lighting canopies, and curated hospitality.',
        leadTime: '21–60 Days',
        linkedSubsystems: ['stage-truss', 'vip-lounge', 'led-dmx', 'branding-print'],
        inventory: ['Architectural Floral & Acrylic Stage', 'Warm Fairy & Pin-Spot Table Lighting', 'Acoustic Duo / Live Ensemble Audio', 'Valet & VIP Family Escort Desk', 'Full Timeline & Ceremony Calling']
      }
    ],
    portfolio: [
      {
        id: 'naksa-cultural-fest',
        code: 'EXECUTED // 01',
        category: 'cultural',
        title: 'NAKSA CULTURAL FEST',
        subtitle: 'CULTURAL FESTIVAL // KHULNA',
        scale: 'Cultural Fest',
        power: 'Stage & AV Rig',
        crew: 'Full Ops Crew',
        tags: ['Stage & Lighting', 'Live Sound', 'Event Production'],
        summary: 'Complete cultural festival production featuring stage engineering, live audio-visual orchestration, crowd coordination, and cue-to-cue show calling.',
        metrics: { Production: 'Turnkey Live', Execution: 'Stage & AV', Status: 'Executed' },
        photo: ''
      },
      {
        id: 'bsaa-family-night',
        code: 'EXECUTED // 02',
        category: 'corporate',
        title: 'BSAA FAMILY NIGHT CORPORATE EVENT',
        subtitle: 'CORPORATE GALA & FAMILY NIGHT',
        scale: 'Corporate Gala',
        power: 'Ballroom AV Setup',
        crew: 'Protocol & Tech',
        tags: ['Corporate Event', 'Guest Protocol', 'Audio & Lighting'],
        summary: 'Executive corporate & family evening engineered with custom stage aesthetics, ambient lighting, balanced acoustics, and curated guest hospitality.',
        metrics: { Format: 'Corporate Gala', Focus: 'Guest Flow', Status: 'Executed' },
        photo: ''
      },
      {
        id: 'naksa-iftar',
        code: 'EXECUTED // 03',
        category: 'community',
        title: 'NAKSA IFTAR',
        subtitle: 'IFTAR GATHERING // KHULNA',
        scale: 'Iftar Gathering',
        power: 'Audio & Ambient',
        crew: 'Hospitality Ops',
        tags: ['Hospitality Flow', 'Warm Lighting', 'Event Audio'],
        summary: 'Thoughtfully coordinated Iftar gathering featuring smooth guest reception, dining zone logistics, warm ambient lighting, and clear event audio.',
        metrics: { Format: 'Community Iftar', Focus: 'Hospitality', Status: 'Executed' },
        photo: ''
      }
    ],
    testimonials: [
      {
        quote: 'Their CAD planning before load-in meant our Khulna Club evening had zero audio feedback, crisp lighting transitions, and effortless VIP entry.',
        author: 'Executive Gala Committee Representative',
        org: 'Khulna Club Evening Production',
        rating: '5.0 // VERIFIED OPS'
      },
      {
        quote: 'From heavy box-truss rigging in unpredictable weather to serialized digital passes for over two thousand attendees, Nibir & Fattah’s crew ran like clockwork.',
        author: 'Cultural Fest Organizing Lead',
        org: 'Khulna Campus Festival Series',
        rating: '5.0 // HIGH-SPL LIVE'
      },
      {
        quote: 'Rare to find an event team in Bangladesh that bridges architectural aesthetics with genuine electrical, acoustic, and crowd-safety engineering.',
        author: 'Regional Brand Activation Manager',
        org: 'Corporate Product Unveiling',
        rating: '5.0 // TURNKEY BRIEF'
      }
    ],
    faqs: [
      { q: 'How far in advance should we book The Blueprint Event Management?', cat: 'timeline', a: 'For corporate galas and branding activations (100–800 guests), 14–21 days is optimal. For full-scale concerts, university fests, or luxury weddings, 30–60 days ensures priority truss, LED wall, and generator allocation. Fast-track emergency builds within 5–7 days can be requested directly on +880 1788-706868.' },
      { q: 'Do you operate exclusively in Khulna or across Bangladesh?', cat: 'venues', a: 'Our engineering headquarters and core crew are based in Khulna (serving Khulna Club, Hotel Castle Salam, City Inn, CSS Ava Center, KUET, and Khulna University). We also deploy turnkey mobile production rigs to Jessore, Mongla, Satkhira, Barishal, and Dhaka.' },
      { q: 'What happens if an outdoor event faces sudden rain or power outages?', cat: 'technical', a: 'Every outdoor blueprint includes optional waterproof box-truss canopies, elevated cable ramps, IP-rated stage lighting protection, and twin synchronized 3-phase backup generators with instant transfer switches so the show never drops.' },
      { q: 'Can we book only Stage/AV or Branding & Passes without full event planning?', cat: 'booking', a: 'Yes! Our modular architecture lets you engage individual systems—such as 3D stage & P3 LED walls, concert line-array audio, or custom VIP PVC passes & digital raffle software—or combine everything into a turnkey package.' },
      { q: 'How do we receive a tailored proposal after configuring Blueprint Lab?', cat: 'booking', a: 'Once you select your event format, guest scale, and subsystems in Blueprint Lab, click Dispatch via WhatsApp or submit the Project Brief. Our Founding Panel will conduct a quick venue survey and send a tailored proposal.' },
      { q: 'Do you handle artist tech riders and live show calling?', cat: 'technical', a: 'Yes. Founder Nibir Guha Roy and our production crew execute complete technical riders (digital FOH mixers, IEMs, backline, monitor mixes) alongside cue-to-cue live show calling.' },
      { q: 'Can you print serialized raffle tickets, QR passes, and crew merchandise?', cat: 'booking', a: 'Yes! Our Creative & Access sectors produce anti-counterfeit numbered raffle books, digital live-draw screens, UV-printed PVC VIP passes with custom lanyards, 3D entry arches, and branded crew polos.' },
      { q: 'How do I send my custom CAD floorplan or spec sheet to your team?', cat: 'timeline', a: 'Once configured in Blueprint Lab, click "Dispatch to Hotline 01 (+880 1788-706868)" or "Hotline 02 (+880 1703-700799)" to send your full spec directly via WhatsApp, or export your PNG floorplan and attach it.' }
    ],
    contact: {
      sectionTag: '// SECTION 06 : COMMUNICATIONS',
      sectionTitle: 'INITIATE EVENT PROTOCOL',
      subtitle: 'Connect with our Founding Panel and Executive Command for venue surveys, technical riders, and tailored proposals.',
      address: 'Khulna Headquarters, Khulna, Bangladesh',
      email: 'info@blueprinteventmanagement.shop',
      whatsapp: '+880 1788-706868',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      youtube: 'https://youtube.com',
      copyright: '© 2026 THE BLUEPRINT EVENT MANAGEMENT. ALL RIGHTS RESERVED.',
      footerSlogan: 'ARCHITECTS OF MOMENTS // KHULNA, BANGLADESH'
    }
  };

  /* ==================== 2. DEFAULT DESIGN ==================== */
  const DEFAULT_DESIGN = {
    themePreset: 'cyan', // cyan, gold, crimson, emerald, violet, obsidian, blue, amber
    primaryAccent: '#00f0ff',
    secondaryAccent: '#7df9ff',
    backgroundColor: '#030712',
    surfaceColor: 'rgba(10, 20, 36, 0.84)',
    textColor: '#f8fafc',
    fontDisplay: "'Space Grotesk', 'Orbitron', sans-serif",
    fontTech: "'Orbitron', sans-serif",
    fontBody: "'Inter', system-ui, -apple-system, sans-serif",
    fontMono: "'JetBrains Mono', monospace",
    borderRadius: '16px', // 4px, 8px, 16px, 24px
    glowIntensity: 'medium', // off, subtle, medium, intense
    scanlines: true,
    canvasGrid: true,
    canvasGridOpacity: 0.6,
    customCss: ''
  };

  /* ==================== 3. STATE & PERSISTENCE ==================== */
  let currentContent = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
  let currentDesign = JSON.parse(JSON.stringify(DEFAULT_DESIGN));
  let activeSubTab = 'design';

  function deepMerge(target, source) {
    if (!source || typeof source !== 'object') return target;
    const out = Object.assign({}, target);
    Object.keys(source).forEach(key => {
      if (Array.isArray(source[key])) {
        out[key] = source[key].slice();
      } else if (source[key] && typeof source[key] === 'object' && target[key] && typeof target[key] === 'object') {
        out[key] = deepMerge(target[key], source[key]);
      } else {
        out[key] = source[key];
      }
    });
    return out;
  }

  function loadLocal() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.content) currentContent = deepMerge(DEFAULT_CONTENT, parsed.content);
        if (parsed.design) currentDesign = deepMerge(DEFAULT_DESIGN, parsed.design);
      }
    } catch (e) {
      console.warn('[CMS] Failed to read local storage:', e);
    }
  }

  function saveLocal() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        content: currentContent,
        design: currentDesign,
        savedAt: new Date().toISOString()
      }));
    } catch (e) {
      console.warn('[CMS] Failed to save to local storage:', e);
    }
  }

  /* ==================== 4. LIVE DESIGN APPLIER ==================== */
  function hexToRgb(hex) {
    if (!hex) return '0, 240, 255';
    const clean = hex.replace('#', '');
    if (clean.length === 3) {
      return `${parseInt(clean[0] + clean[0], 16)}, ${parseInt(clean[1] + clean[1], 16)}, ${parseInt(clean[2] + clean[2], 16)}`;
    } else if (clean.length === 6) {
      return `${parseInt(clean.slice(0, 2), 16)}, ${parseInt(clean.slice(2, 4), 16)}, ${parseInt(clean.slice(4, 6), 16)}`;
    }
    return '0, 240, 255';
  }

  function applyDesign(design) {
    if (!design) return;
    if (design.themePreset) {
      document.documentElement.setAttribute('data-theme', design.themePreset);
    }

    let styleEl = document.getElementById('bpCustomDesignStyle');
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = 'bpCustomDesignStyle';
      document.head.appendChild(styleEl);
    }

    const primaryRgb = design.primaryAccent ? hexToRgb(design.primaryAccent) : '0, 240, 255';
    const glowMap = {
      off: 'none',
      subtle: `0 0 8px rgba(${primaryRgb}, 0.25)`,
      medium: `0 0 16px rgba(${primaryRgb}, 0.45)`,
      intense: `0 0 28px rgba(${primaryRgb}, 0.8), 0 0 50px rgba(${primaryRgb}, 0.4)`
    };
    const glowVal = glowMap[design.glowIntensity] || glowMap.medium;

    let css = `
      :root {
        ${design.primaryAccent ? `--bp-accent: ${design.primaryAccent} !important;` : ''}
        ${design.secondaryAccent ? `--bp-accent-2: ${design.secondaryAccent} !important;` : ''}
        --bp-accent-rgb: ${primaryRgb} !important;
        ${design.backgroundColor ? `--bp-bg: ${design.backgroundColor} !important;` : ''}
        ${design.surfaceColor ? `--bp-surface: ${design.surfaceColor} !important;` : ''}
        ${design.textColor ? `--bp-text: ${design.textColor} !important;` : ''}
        --bp-glow: ${glowVal} !important;
      }
      ${design.fontDisplay ? `.font-display { font-family: ${design.fontDisplay} !important; }` : ''}
      ${design.fontTech ? `.font-tech { font-family: ${design.fontTech} !important; }` : ''}
      ${design.fontBody ? `body { font-family: ${design.fontBody} !important; }` : ''}
      ${design.fontMono ? `.font-mono-cad { font-family: ${design.fontMono} !important; }` : ''}
      ${design.borderRadius ? `.bp-card, .bp-card-tilt { border-radius: ${design.borderRadius} !important; }` : ''}
      ${design.scanlines === false ? `.bp-scanline { display: none !important; }` : ''}
      ${design.customCss ? design.customCss : ''}
    `;

    styleEl.textContent = css;

    const canvas = document.getElementById('cadBgCanvas');
    if (canvas) {
      if (design.canvasGrid === false) {
        canvas.style.display = 'none';
      } else {
        canvas.style.display = 'block';
        canvas.style.opacity = design.canvasGridOpacity != null ? design.canvasGridOpacity : 0.6;
      }
    }
  }

  /* ==================== 5. LIVE CONTENT APPLIER ==================== */
  function applyContent(content) {
    if (!content) return;

    // Hotlines & Branding
    if (content.branding) {
      const b = content.branding;
      if (b.hotline1) {
        document.querySelectorAll('[data-cms="hotline1-display"]').forEach(el => el.textContent = b.hotline1.display);
        document.querySelectorAll('[data-cms="hotline1-link"]').forEach(el => el.href = `tel:${b.hotline1.tel}`);
        document.querySelectorAll('[data-cms="hotline1-wa"]').forEach(el => el.href = `https://wa.me/${b.hotline1.wa}`);
      }
      if (b.hotline2) {
        document.querySelectorAll('[data-cms="hotline2-display"]').forEach(el => el.textContent = b.hotline2.display);
        document.querySelectorAll('[data-cms="hotline2-link"]').forEach(el => el.href = `tel:${b.hotline2.tel}`);
        document.querySelectorAll('[data-cms="hotline2-wa"]').forEach(el => el.href = `https://wa.me/${b.hotline2.wa}`);
      }
      if (b.agencyName) {
        document.querySelectorAll('[data-cms="agency-name"]').forEach(el => el.textContent = b.agencyName);
      }
    }

    // Hero Section
    if (content.hero) {
      const h = content.hero;
      const badge = document.querySelector('[data-cms="hero-badge"]');
      if (badge && h.badge) badge.textContent = h.badge;
      const t1 = document.querySelector('[data-cms="hero-title1"]');
      if (t1 && h.titleLine1) t1.textContent = h.titleLine1;
      const t2 = document.querySelector('[data-cms="hero-title2"]');
      if (t2 && h.titleLine2) t2.textContent = h.titleLine2;
      const p = document.querySelector('[data-cms="hero-p"]');
      if (p && h.paragraph) p.innerHTML = h.paragraph;
      const b1 = document.querySelector('[data-cms="hero-btn1"]');
      if (b1 && h.ctaPrimaryText) {
        b1.textContent = h.ctaPrimaryText;
        if (h.ctaPrimaryLink) b1.href = h.ctaPrimaryLink;
      }
      const b2 = document.querySelector('[data-cms="hero-btn2"]');
      if (b2 && h.ctaSecondaryText) b2.textContent = h.ctaSecondaryText;
    }

    // About Section
    if (content.about) {
      const a = content.about;
      const h2 = document.querySelector('[data-cms="about-heading"]');
      if (h2 && a.sectionTitle) h2.innerHTML = a.sectionTitle;
      const pTitle = document.querySelector('[data-cms="about-phil-title"]');
      if (pTitle && a.philosophyTitle) pTitle.textContent = a.philosophyTitle;
      const p1 = document.querySelector('[data-cms="about-phil-p1"]');
      if (p1 && a.philosophyP1) p1.innerHTML = a.philosophyP1;
      const p2 = document.querySelector('[data-cms="about-phil-p2"]');
      if (p2 && a.philosophyP2) p2.innerHTML = a.philosophyP2;
      const sTitle = document.querySelector('[data-cms="about-std-title"]');
      if (sTitle && a.standardsTitle) sTitle.textContent = a.standardsTitle;
      const s1 = document.querySelector('[data-cms="about-std-p1"]');
      if (s1 && a.standardsP1) s1.innerHTML = a.standardsP1;
      const fTitle = document.querySelector('[data-cms="about-foot-title"]');
      if (fTitle && a.footprintTitle) fTitle.textContent = a.footprintTitle;
      const f1 = document.querySelector('[data-cms="about-foot-p1"]');
      if (f1 && a.footprintP1) f1.innerHTML = a.footprintP1;

      const hqFounders = document.querySelector('[data-cms="about-hq-founders"]');
      if (hqFounders && a.hqFounders) hqFounders.textContent = a.hqFounders;
      const hqMotto = document.querySelector('[data-cms="about-hq-motto"]');
      if (hqMotto && a.hqMotto) hqMotto.textContent = a.hqMotto;
      const hqMottoSub = document.querySelector('[data-cms="about-hq-mottosub"]');
      if (hqMottoSub && a.hqMottoSub) hqMottoSub.textContent = a.hqMottoSub;
    }

    // Contact & Footer
    if (content.contact) {
      const c = content.contact;
      const copy = document.querySelector('[data-cms="footer-copyright"]');
      if (copy && c.copyright) copy.textContent = c.copyright;
      const slog = document.querySelector('[data-cms="footer-slogan"]');
      if (slog && c.footerSlogan) slog.textContent = c.footerSlogan;
    }

    // Update global App.data structures
    if (window.BlueprintApp && window.BlueprintApp.data) {
      if (content.team && Array.isArray(content.team)) window.BlueprintApp.data.team = content.team;
      if (content.services && Array.isArray(content.services)) window.BlueprintApp.data.services = content.services;
      if (content.portfolio && Array.isArray(content.portfolio)) window.BlueprintApp.data.portfolio = content.portfolio;
      if (content.testimonials && Array.isArray(content.testimonials)) window.BlueprintApp.data.testimonials = content.testimonials;
      if (content.faqs && Array.isArray(content.faqs)) window.BlueprintApp.data.faqs = content.faqs;
    }

    // Re-render team roster & portfolio if functions exist
    if (window.BlueprintApp && typeof window.BlueprintApp.emit === 'function') {
      window.BlueprintApp.emit('cms:content-updated', content);
    }
  }

  /* ==================== 6. SERVER SYNC & PUBLISH ==================== */
  async function fetchFromServer() {
    try {
      const res = await fetch('/api/cms');
      if (!res.ok) return;
      const json = await res.json();
      if (json && json.success && json.data) {
        if (json.data.content) {
          currentContent = deepMerge(DEFAULT_CONTENT, json.data.content);
        }
        if (json.data.design) {
          currentDesign = deepMerge(DEFAULT_DESIGN, json.data.design);
        }
        saveLocal();
        applyDesign(currentDesign);
        applyContent(currentContent);
      }
    } catch (e) {
      console.warn('[CMS] Server fetch error (using local cache):', e);
    }
  }

  function getSuperAdminAuth() {
    let auth = { userId: 'superadmin' };
    try {
      const sessionRaw = localStorage.getItem('bp_admin_session_v5');
      if (sessionRaw) {
        const s = JSON.parse(sessionRaw);
        if (s.user) {
          auth.userId = s.user.id || s.user.username || 'superadmin';
          auth.passwordHash = s.user.passwordHash || '';
        }
        if (s.token) auth.token = s.token;
      }
    } catch (_) {}
    return auth;
  }

  async function publishToServer() {
    const auth = getSuperAdminAuth();
    try {
      const res = await fetch('/api/cms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          auth,
          content: currentContent,
          design: currentDesign
        })
      });

      const json = await res.json();
      if (res.ok && json.success) {
        saveLocal();
        applyDesign(currentDesign);
        applyContent(currentContent);
        if (App.toast) App.toast('Website content & design published live!', 'success', 'CMS PUBLISHED');
        else alert('Website content and design published successfully!');
        return true;
      } else {
        const err = json.error || 'Failed to publish changes';
        if (App.toast) App.toast(err, 'danger', 'ACCESS DENIED');
        else alert('Error: ' + err);
        return false;
      }
    } catch (e) {
      if (App.toast) App.toast('Network error saving changes: ' + e.message, 'danger', 'SYNC ERROR');
      return false;
    }
  }

  async function uploadImageFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async function (e) {
        const dataUrl = e.target.result;
        const auth = getSuperAdminAuth();
        try {
          const res = await fetch('/api/cms/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              auth,
              filename: file.name,
              dataUrl: dataUrl
            })
          });
          const json = await res.json();
          if (res.ok && json.success) {
            resolve(json.url);
          } else {
            reject(new Error(json.error || 'Upload failed'));
          }
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('File read error'));
      reader.readAsDataURL(file);
    });
  }

  async function resetToDefaults() {
    if (!confirm('Are you sure you want to revert all texts, pictures, and design back to the original factory default?')) return;
    const auth = getSuperAdminAuth();
    try {
      const res = await fetch('/api/cms/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auth })
      });
      if (res.ok) {
        localStorage.removeItem(STORAGE_KEY);
        currentContent = JSON.parse(JSON.stringify(DEFAULT_CONTENT));
        currentDesign = JSON.parse(JSON.stringify(DEFAULT_DESIGN));
        applyDesign(currentDesign);
        applyContent(currentContent);
        if (App.toast) App.toast('Website reverted to factory defaults.', 'info', 'RESET COMPLETE');
        window.location.reload();
      }
    } catch (e) {
      alert('Reset failed: ' + e.message);
    }
  }

  /* ==================== 7. CMS ADMIN INTERFACE RENDERER ==================== */
  function renderCmsTab(container, user, isSuper) {
    if (!isSuper) {
      container.innerHTML = `
        <div class="bp-card p-12 rounded-2xl text-center space-y-4 max-w-lg mx-auto my-12 border border-rose-500/30">
          <div class="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/40 flex items-center justify-center text-rose-400 mx-auto text-2xl">
            <i class="fa-solid fa-lock"></i>
          </div>
          <h2 class="font-tech font-bold text-xl text-white">ACCESS RESTRICTED // SUPER ADMIN ONLY</h2>
          <p class="font-mono-cad text-xs bp-muted-text leading-relaxed">
            Only the Central Super Administrator can customize the website texts, team photos, themes, and design parameters.
          </p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Toolbar -->
        <div class="bp-card bp-ticks p-5 sm:p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 border border-cyan-400/30">
          <div class="flex items-center gap-3">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400 text-xl">
              <i class="fa-solid fa-wand-magic-sparkles"></i>
            </div>
            <div>
              <div class="font-tech font-extrabold text-lg text-white flex items-center gap-2">
                <span>WEBSITE CMS & DESIGN STUDIO</span>
                <span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono-cad text-[10px] font-bold">SUPER ADMIN CLEARANCE</span>
              </div>
              <div class="font-mono-cad text-xs bp-muted-text">Real-time customization of all texts, photos, colors, typography & layout</div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex flex-wrap items-center gap-2 font-mono-cad text-xs">
            <button id="cmsPublishBtn" type="button" class="px-4 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all">
              <i class="fa-solid fa-cloud-arrow-up"></i>
              <span>SAVE & PUBLISH LIVE</span>
            </button>
            <a href="index.html" target="_blank" class="px-3.5 py-2.5 rounded-xl border border-current/25 hover:bg-white/10 font-bold flex items-center gap-1.5 transition-colors">
              <i class="fa-solid fa-up-right-from-square"></i>
              <span>VIEW SITE</span>
            </a>
            <button id="cmsResetBtn" type="button" class="px-3 py-2.5 rounded-xl border border-rose-500/40 text-rose-400 hover:bg-rose-500/15 font-bold flex items-center gap-1.5 transition-colors" title="Revert all texts and design to factory defaults">
              <i class="fa-solid fa-rotate-left"></i>
              <span>RESET</span>
            </button>
          </div>
        </div>

        <!-- Sub-Navigation Navigation Pills -->
        <div class="flex flex-wrap gap-2 border-b border-current/15 pb-3">
          <button type="button" data-cms-tab="design" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'design' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-palette"></i><span>1. Design & Themes</span>
          </button>
          <button type="button" data-cms-tab="hero" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'hero' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-bullhorn"></i><span>2. Hero & Branding</span>
          </button>
          <button type="button" data-cms-tab="about" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'about' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-building"></i><span>3. About & Philosophy</span>
          </button>
          <button type="button" data-cms-tab="team" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'team' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-users"></i><span>4. Team & Photos</span>
          </button>
          <button type="button" data-cms-tab="services" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'services' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-cubes"></i><span>5. Services</span>
          </button>
          <button type="button" data-cms-tab="portfolio" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'portfolio' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-star"></i><span>6. Portfolio & Reviews</span>
          </button>
          <button type="button" data-cms-tab="contact" class="bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${activeSubTab === 'contact' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}">
            <i class="fa-solid fa-phone"></i><span>7. Contact & Footer</span>
          </button>
        </div>

        <!-- SubTab Content Area -->
        <div id="cmsSubTabContainer" class="space-y-6">
          <!-- Rendered dynamically below -->
        </div>
      </div>
    `;

    // Hook top buttons
    const publishBtn = container.querySelector('#cmsPublishBtn');
    publishBtn.addEventListener('click', async () => {
      publishBtn.disabled = true;
      publishBtn.innerHTML = '<i class="fa-solid fa-spinner animate-spin"></i><span>PUBLISHING...</span>';
      await publishToServer();
      publishBtn.disabled = false;
      publishBtn.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i><span>SAVE & PUBLISH LIVE</span>';
    });

    const resetBtn = container.querySelector('#cmsResetBtn');
    resetBtn.addEventListener('click', resetToDefaults);

    // Sub-tab switching
    const subNavBtns = container.querySelectorAll('.bp-subnav-btn');
    subNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        activeSubTab = btn.getAttribute('data-cms-tab');
        subNavBtns.forEach(b => {
          const isAct = b === btn;
          b.className = `bp-subnav-btn px-4 py-2 rounded-xl border border-current/25 font-mono-cad text-xs font-bold flex items-center gap-2 ${isAct ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400' : 'text-slate-400'}`;
        });
        renderSubTab(container.querySelector('#cmsSubTabContainer'));
      });
    });

    renderSubTab(container.querySelector('#cmsSubTabContainer'));
  }

  function renderSubTab(subContainer) {
    if (!subContainer) return;
    if (activeSubTab === 'design') renderDesignSubTab(subContainer);
    else if (activeSubTab === 'hero') renderHeroSubTab(subContainer);
    else if (activeSubTab === 'about') renderAboutSubTab(subContainer);
    else if (activeSubTab === 'team') renderTeamSubTab(subContainer);
    else if (activeSubTab === 'services') renderServicesSubTab(subContainer);
    else if (activeSubTab === 'portfolio') renderPortfolioSubTab(subContainer);
    else if (activeSubTab === 'contact') renderContactSubTab(subContainer);
  }

  /* ==================== 8. SUB-TAB: DESIGN & THEMES ==================== */
  function renderDesignSubTab(target) {
    const d = currentDesign;
    target.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Presets & Colors -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Theme Presets -->
          <div class="bp-card p-5 rounded-2xl space-y-4">
            <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
              <i class="fa-solid fa-swatchbook text-cyan-400"></i>
              <span>ONE-CLICK THEME PRESETS</span>
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono-cad text-xs">
              ${[
                { id: 'cyan', label: 'Blueprint Cyan', color: '#00f0ff' },
                { id: 'gold', label: 'Imperial Gold', color: '#f59e0b' },
                { id: 'crimson', label: 'Arena Crimson', color: '#fb7185' },
                { id: 'emerald', label: 'Emerald Matrix', color: '#10b981' },
                { id: 'violet', label: 'Cyber Violet', color: '#a855f7' },
                { id: 'obsidian', label: 'Obsidian Slate', color: '#94a3b8' },
                { id: 'blue', label: 'Electric Blue', color: '#38bdf8' },
                { id: 'amber', label: 'Sunset Amber', color: '#f97316' }
              ].map(th => `
                <button type="button" data-preset-theme="${th.id}" class="p-3 rounded-xl border ${d.themePreset === th.id ? 'border-cyan-400 bg-white/10 ring-1 ring-cyan-400' : 'border-current/20 hover:bg-white/5'} text-left flex flex-col justify-between gap-2">
                  <div class="w-6 h-6 rounded-full" style="background-color: ${th.color}; box-shadow: 0 0 10px ${th.color}66;"></div>
                  <span class="font-bold text-[11px] text-white">${th.label}</span>
                </button>
              `).join('')}
            </div>
          </div>

          <!-- Color Customizer -->
          <div class="bp-card p-5 rounded-2xl space-y-4">
            <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
              <i class="fa-solid fa-eye-dropper text-cyan-400"></i>
              <span>CUSTOM PALETTE OVERRIDE</span>
            </h3>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-cad text-xs">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Primary Accent Color</label>
                <div class="flex items-center gap-2">
                  <input type="color" id="primaryColorPicker" value="${d.primaryAccent || '#00f0ff'}" class="w-10 h-10 rounded-lg cursor-pointer bg-black/40 border border-current/25">
                  <input type="text" id="primaryColorHex" value="${d.primaryAccent || '#00f0ff'}" class="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white font-mono uppercase">
                </div>
              </div>

              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Secondary Accent Color</label>
                <div class="flex items-center gap-2">
                  <input type="color" id="secondaryColorPicker" value="${d.secondaryAccent || '#7df9ff'}" class="w-10 h-10 rounded-lg cursor-pointer bg-black/40 border border-current/25">
                  <input type="text" id="secondaryColorHex" value="${d.secondaryAccent || '#7df9ff'}" class="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white font-mono uppercase">
                </div>
              </div>

              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Base Background Color</label>
                <div class="flex items-center gap-2">
                  <input type="color" id="bgColorPicker" value="${d.backgroundColor || '#030712'}" class="w-10 h-10 rounded-lg cursor-pointer bg-black/40 border border-current/25">
                  <input type="text" id="bgColorHex" value="${d.backgroundColor || '#030712'}" class="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white font-mono uppercase">
                </div>
              </div>

              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Corner Border Radius</label>
                <select id="borderRadiusSelect" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
                  <option value="4px" ${d.borderRadius === '4px' ? 'selected' : ''}>Sharp Tech (4px)</option>
                  <option value="8px" ${d.borderRadius === '8px' ? 'selected' : ''}>Sleek Edge (8px)</option>
                  <option value="16px" ${d.borderRadius === '16px' ? 'selected' : ''}>Modern Architectural (16px - Default)</option>
                  <option value="24px" ${d.borderRadius === '24px' ? 'selected' : ''}>Ultra Smooth (24px)</option>
                  <option value="9999px" ${d.borderRadius === '9999px' ? 'selected' : ''}>Pill Curve (9999px)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Typography, Effects & Custom CSS -->
        <div class="lg:col-span-6 space-y-6">
          <!-- Typography & Effects -->
          <div class="bp-card p-5 rounded-2xl space-y-4">
            <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
              <i class="fa-solid fa-font text-cyan-400"></i>
              <span>TYPOGRAPHY & VISUAL FX</span>
            </h3>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-cad text-xs">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Heading / Display Font</label>
                <select id="fontDisplaySelect" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
                  <option value="'Space Grotesk', 'Orbitron', sans-serif" ${d.fontDisplay.includes('Space Grotesk') ? 'selected' : ''}>Space Grotesk & Orbitron (Default)</option>
                  <option value="'Orbitron', sans-serif" ${d.fontDisplay === "'Orbitron', sans-serif" ? 'selected' : ''}>Pure Orbitron (Sci-Fi / Cyber)</option>
                  <option value="'Inter', sans-serif" ${d.fontDisplay === "'Inter', sans-serif" ? 'selected' : ''}>Inter (Clean Minimal)</option>
                  <option value="'JetBrains Mono', monospace" ${d.fontDisplay.includes('JetBrains') ? 'selected' : ''}>JetBrains Mono (Architectural Code)</option>
                </select>
              </div>

              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Glow Intensity</label>
                <select id="glowIntensitySelect" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
                  <option value="off" ${d.glowIntensity === 'off' ? 'selected' : ''}>Off (Flat Minimal)</option>
                  <option value="subtle" ${d.glowIntensity === 'subtle' ? 'selected' : ''}>Subtle</option>
                  <option value="medium" ${d.glowIntensity === 'medium' ? 'selected' : ''}>Medium (Standard Glow)</option>
                  <option value="intense" ${d.glowIntensity === 'intense' ? 'selected' : ''}>Intense Neon</option>
                </select>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <input type="checkbox" id="scanlinesToggle" ${d.scanlines !== false ? 'checked' : ''} class="w-4 h-4 rounded border-current/30 text-cyan-400">
                <label for="scanlinesToggle" class="text-xs text-white cursor-pointer">Enable Cyber Scanlines Effect</label>
              </div>

              <div class="flex items-center gap-3 pt-2">
                <input type="checkbox" id="canvasGridToggle" ${d.canvasGrid !== false ? 'checked' : ''} class="w-4 h-4 rounded border-current/30 text-cyan-400">
                <label for="canvasGridToggle" class="text-xs text-white cursor-pointer">Interactive CAD Canvas Grid</label>
              </div>
            </div>
          </div>

          <!-- Advanced Custom CSS Box -->
          <div class="bp-card p-5 rounded-2xl space-y-3">
            <div class="flex items-center justify-between">
              <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
                <i class="fa-brands fa-css3-alt text-cyan-400"></i>
                <span>SUPER ADMIN CUSTOM CSS OVERRIDE</span>
              </h3>
              <span class="font-mono-cad text-[10px] text-emerald-400">LIVE INJECTION</span>
            </div>
            <p class="font-mono-cad text-[11px] bp-muted-text">
              Write any custom CSS rules below. They will be injected directly into the live site for complete layout and design mastery.
            </p>
            <textarea id="customCssInput" rows="6" placeholder="/* Example: .bp-card { border-color: rgba(0, 240, 255, 0.4); } */" class="w-full p-3 rounded-xl bg-black/60 border border-current/25 font-mono text-xs text-cyan-300 focus:border-cyan-400 outline-none leading-relaxed">${d.customCss || ''}</textarea>
          </div>
        </div>
      </div>
    `;

    // Hook events for Design sub-tab
    const themeBtns = target.querySelectorAll('[data-preset-theme]');
    themeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const p = btn.getAttribute('data-preset-theme');
        d.themePreset = p;
        const colorMap = {
          cyan: { pri: '#00f0ff', sec: '#7df9ff', bg: '#030712' },
          gold: { pri: '#f59e0b', sec: '#fde68a', bg: '#07060b' },
          crimson: { pri: '#fb7185', sec: '#fecdd3', bg: '#09040b' },
          emerald: { pri: '#10b981', sec: '#6ee7b7', bg: '#021810' },
          violet: { pri: '#a855f7', sec: '#e9d5ff', bg: '#0d0617' },
          obsidian: { pri: '#94a3b8', sec: '#e2e8f0', bg: '#090d16' },
          blue: { pri: '#38bdf8', sec: '#bae6fd', bg: '#030b17' },
          amber: { pri: '#f97316', sec: '#fed7aa', bg: '#140803' }
        };
        if (colorMap[p]) {
          d.primaryAccent = colorMap[p].pri;
          d.secondaryAccent = colorMap[p].sec;
          d.backgroundColor = colorMap[p].bg;
        }
        applyDesign(d);
        renderDesignSubTab(target);
      });
    });

    const priColor = target.querySelector('#primaryColorPicker');
    const priHex = target.querySelector('#primaryColorHex');
    priColor.addEventListener('input', e => {
      priHex.value = e.target.value.toUpperCase();
      d.primaryAccent = e.target.value;
      applyDesign(d);
    });
    priHex.addEventListener('input', e => {
      d.primaryAccent = e.target.value;
      priColor.value = e.target.value;
      applyDesign(d);
    });

    const secColor = target.querySelector('#secondaryColorPicker');
    const secHex = target.querySelector('#secondaryColorHex');
    secColor.addEventListener('input', e => {
      secHex.value = e.target.value.toUpperCase();
      d.secondaryAccent = e.target.value;
      applyDesign(d);
    });
    secHex.addEventListener('input', e => {
      d.secondaryAccent = e.target.value;
      secColor.value = e.target.value;
      applyDesign(d);
    });

    const bgColor = target.querySelector('#bgColorPicker');
    const bgHex = target.querySelector('#bgColorHex');
    bgColor.addEventListener('input', e => {
      bgHex.value = e.target.value.toUpperCase();
      d.backgroundColor = e.target.value;
      applyDesign(d);
    });
    bgHex.addEventListener('input', e => {
      d.backgroundColor = e.target.value;
      bgColor.value = e.target.value;
      applyDesign(d);
    });

    target.querySelector('#borderRadiusSelect').addEventListener('change', e => {
      d.borderRadius = e.target.value;
      applyDesign(d);
    });

    target.querySelector('#fontDisplaySelect').addEventListener('change', e => {
      d.fontDisplay = e.target.value;
      applyDesign(d);
    });

    target.querySelector('#glowIntensitySelect').addEventListener('change', e => {
      d.glowIntensity = e.target.value;
      applyDesign(d);
    });

    target.querySelector('#scanlinesToggle').addEventListener('change', e => {
      d.scanlines = e.target.checked;
      applyDesign(d);
    });

    target.querySelector('#canvasGridToggle').addEventListener('change', e => {
      d.canvasGrid = e.target.checked;
      applyDesign(d);
    });

    target.querySelector('#customCssInput').addEventListener('input', e => {
      d.customCss = e.target.value;
      applyDesign(d);
    });
  }

  /* ==================== 9. SUB-TAB: HERO & BRANDING ==================== */
  function renderHeroSubTab(target) {
    const c = currentContent;
    target.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <!-- Hero Section Texts -->
        <div class="bp-card p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
            <i class="fa-solid fa-bullhorn text-cyan-400"></i>
            <span>HERO BANNER & HEADLINES</span>
          </h3>

          <div class="space-y-4 font-mono-cad text-xs">
            <div>
              <label class="block text-[11px] bp-muted-text mb-1">Top Hero Badge Text</label>
              <input type="text" id="heroBadgeInput" value="${App.escapeHtml(c.hero.badge)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white">
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Main Headline Line 1</label>
                <input type="text" id="heroTitle1Input" value="${App.escapeHtml(c.hero.titleLine1)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white font-bold">
              </div>
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Main Headline Line 2 (Accent Glow)</label>
                <input type="text" id="heroTitle2Input" value="${App.escapeHtml(c.hero.titleLine2)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white font-bold">
              </div>
            </div>

            <div>
              <label class="block text-[11px] bp-muted-text mb-1">Hero Description Paragraph (HTML supported)</label>
              <textarea id="heroParagraphInput" rows="3" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white leading-relaxed">${App.escapeHtml(c.hero.paragraph)}</textarea>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Primary CTA Button Label</label>
                <input type="text" id="heroBtn1Input" value="${App.escapeHtml(c.hero.ctaPrimaryText)}" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Secondary CTA Button Label</label>
                <input type="text" id="heroBtn2Input" value="${App.escapeHtml(c.hero.ctaSecondaryText)}" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
            </div>
          </div>
        </div>

        <!-- Hotlines & Agency Branding -->
        <div class="bp-card p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
            <i class="fa-solid fa-phone-volume text-cyan-400"></i>
            <span>AGENCY CONTACT & HOTLINES</span>
          </h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono-cad text-xs">
            <!-- Hotline 1 -->
            <div class="p-4 rounded-xl bg-black/30 border border-current/20 space-y-3">
              <div class="font-bold text-cyan-400 text-xs">// HOTLINE 01 (PRIMARY)</div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Display Text</label>
                <input type="text" id="hotline1DisplayInput" value="${App.escapeHtml(c.branding.hotline1.display)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Phone Dial Link (+880...)</label>
                <input type="text" id="hotline1TelInput" value="${App.escapeHtml(c.branding.hotline1.tel)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">WhatsApp Number (Digits only)</label>
                <input type="text" id="hotline1WaInput" value="${App.escapeHtml(c.branding.hotline1.wa)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
              </div>
            </div>

            <!-- Hotline 2 -->
            <div class="p-4 rounded-xl bg-black/30 border border-current/20 space-y-3">
              <div class="font-bold text-cyan-400 text-xs">// HOTLINE 02 (COMMAND)</div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Display Text</label>
                <input type="text" id="hotline2DisplayInput" value="${App.escapeHtml(c.branding.hotline2.display)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Phone Dial Link (+880...)</label>
                <input type="text" id="hotline2TelInput" value="${App.escapeHtml(c.branding.hotline2.tel)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">WhatsApp Number (Digits only)</label>
                <input type="text" id="hotline2WaInput" value="${App.escapeHtml(c.branding.hotline2.wa)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    // Hook inputs
    target.querySelector('#heroBadgeInput').addEventListener('input', e => c.hero.badge = e.target.value);
    target.querySelector('#heroTitle1Input').addEventListener('input', e => c.hero.titleLine1 = e.target.value);
    target.querySelector('#heroTitle2Input').addEventListener('input', e => c.hero.titleLine2 = e.target.value);
    target.querySelector('#heroParagraphInput').addEventListener('input', e => c.hero.paragraph = e.target.value);
    target.querySelector('#heroBtn1Input').addEventListener('input', e => c.hero.ctaPrimaryText = e.target.value);
    target.querySelector('#heroBtn2Input').addEventListener('input', e => c.hero.ctaSecondaryText = e.target.value);

    target.querySelector('#hotline1DisplayInput').addEventListener('input', e => c.branding.hotline1.display = e.target.value);
    target.querySelector('#hotline1TelInput').addEventListener('input', e => c.branding.hotline1.tel = e.target.value);
    target.querySelector('#hotline1WaInput').addEventListener('input', e => c.branding.hotline1.wa = e.target.value);

    target.querySelector('#hotline2DisplayInput').addEventListener('input', e => c.branding.hotline2.display = e.target.value);
    target.querySelector('#hotline2TelInput').addEventListener('input', e => c.branding.hotline2.tel = e.target.value);
    target.querySelector('#hotline2WaInput').addEventListener('input', e => c.branding.hotline2.wa = e.target.value);
  }

  /* ==================== 10. SUB-TAB: ABOUT & PHILOSOPHY ==================== */
  function renderAboutSubTab(target) {
    const a = currentContent.about;
    target.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <div class="bp-card p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
            <i class="fa-solid fa-building text-cyan-400"></i>
            <span>SECTION 01: ABOUT US & PHILOSOPHY</span>
          </h3>

          <div class="space-y-4 font-mono-cad text-xs">
            <div>
              <label class="block text-[11px] bp-muted-text mb-1">Section Main Heading</label>
              <input type="text" id="aboutHeadingInput" value="${App.escapeHtml(a.sectionTitle)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white font-bold">
            </div>

            <!-- Tab 1: Philosophy -->
            <div class="p-4 rounded-xl bg-black/30 border border-current/20 space-y-3">
              <div class="font-bold text-cyan-400">// PHILOSOPHY TAB</div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Tab Title</label>
                <input type="text" id="aboutPhilTitleInput" value="${App.escapeHtml(a.philosophyTitle)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white font-bold">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Paragraph 1</label>
                <textarea id="aboutPhilP1Input" rows="2" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white leading-relaxed">${App.escapeHtml(a.philosophyP1)}</textarea>
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Paragraph 2</label>
                <textarea id="aboutPhilP2Input" rows="2" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white leading-relaxed">${App.escapeHtml(a.philosophyP2)}</textarea>
              </div>
            </div>

            <!-- Tab 2: Standards -->
            <div class="p-4 rounded-xl bg-black/30 border border-current/20 space-y-3">
              <div class="font-bold text-cyan-400">// STANDARDS TAB</div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Tab Title</label>
                <input type="text" id="aboutStdTitleInput" value="${App.escapeHtml(a.standardsTitle)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white font-bold">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Paragraph</label>
                <textarea id="aboutStdP1Input" rows="2" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white leading-relaxed">${App.escapeHtml(a.standardsP1)}</textarea>
              </div>
            </div>

            <!-- Tab 3: Footprint -->
            <div class="p-4 rounded-xl bg-black/30 border border-current/20 space-y-3">
              <div class="font-bold text-cyan-400">// KHULNA COVERAGE TAB</div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Tab Title</label>
                <input type="text" id="aboutFootTitleInput" value="${App.escapeHtml(a.footprintTitle)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white font-bold">
              </div>
              <div>
                <label class="block text-[10px] bp-muted-text mb-1">Paragraph</label>
                <textarea id="aboutFootP1Input" rows="2" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white leading-relaxed">${App.escapeHtml(a.footprintP1)}</textarea>
              </div>
            </div>

            <!-- HQ Box -->
            <div class="p-4 rounded-xl bg-black/30 border border-current/20 space-y-3">
              <div class="font-bold text-cyan-400">// KHULNA HEADQUARTERS CARD</div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label class="block text-[10px] bp-muted-text mb-1">Founders Display</label>
                  <input type="text" id="aboutHqFoundersInput" value="${App.escapeHtml(a.hqFounders)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
                </div>
                <div>
                  <label class="block text-[10px] bp-muted-text mb-1">Motto Headline</label>
                  <input type="text" id="aboutHqMottoInput" value="${App.escapeHtml(a.hqMotto)}" class="w-full px-3 py-2 rounded-lg bg-black/50 border border-current/25 text-white">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    target.querySelector('#aboutHeadingInput').addEventListener('input', e => a.sectionTitle = e.target.value);
    target.querySelector('#aboutPhilTitleInput').addEventListener('input', e => a.philosophyTitle = e.target.value);
    target.querySelector('#aboutPhilP1Input').addEventListener('input', e => a.philosophyP1 = e.target.value);
    target.querySelector('#aboutPhilP2Input').addEventListener('input', e => a.philosophyP2 = e.target.value);
    target.querySelector('#aboutStdTitleInput').addEventListener('input', e => a.standardsTitle = e.target.value);
    target.querySelector('#aboutStdP1Input').addEventListener('input', e => a.standardsP1 = e.target.value);
    target.querySelector('#aboutFootTitleInput').addEventListener('input', e => a.footprintTitle = e.target.value);
    target.querySelector('#aboutFootP1Input').addEventListener('input', e => a.footprintP1 = e.target.value);
    target.querySelector('#aboutHqFoundersInput').addEventListener('input', e => a.hqFounders = e.target.value);
    target.querySelector('#aboutHqMottoInput').addEventListener('input', e => a.hqMotto = e.target.value);
  }

  /* ==================== 11. SUB-TAB: TEAM & PHOTOS ==================== */
  function renderTeamSubTab(target) {
    const team = currentContent.team;
    target.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-tech font-bold text-base text-white flex items-center gap-2">
              <i class="fa-solid fa-users text-cyan-400"></i>
              <span>FOUNDERS & EXECUTIVE COMMAND (${team.length} MEMBERS)</span>
            </h3>
            <p class="font-mono-cad text-xs bp-muted-text">Change names, roles, bios, and upload new photos with exact centering sliders</p>
          </div>
          <button id="addTeamMemberBtn" type="button" class="px-3 py-2 rounded-xl border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 font-mono-cad text-xs font-bold hover:bg-cyan-500/25 flex items-center gap-1.5">
            <i class="fa-solid fa-plus"></i><span>ADD MEMBER</span>
          </button>
        </div>

        <!-- Team Member Cards -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${team.map((m, idx) => `
            <div class="bp-card p-5 rounded-2xl border border-current/20 space-y-4 relative group" data-member-idx="${idx}">
              <div class="flex items-center justify-between border-b border-current/15 pb-2.5">
                <span class="font-mono-cad text-xs font-bold text-cyan-400">${App.escapeHtml(m.code || `MEMBER // 0${idx + 1}`)}</span>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 rounded bg-white/10 font-mono-cad text-[10px]">${App.escapeHtml(m.tier === 'founder' ? 'FOUNDER' : 'EXECUTIVE')}</span>
                  <button type="button" class="delete-member-btn text-rose-400 hover:text-rose-300 text-xs p-1" title="Remove member"><i class="fa-solid fa-trash"></i></button>
                </div>
              </div>

              <!-- Photo Area with Live Preview & Upload -->
              <div class="grid grid-cols-1 sm:grid-cols-12 gap-4 items-start">
                <div class="sm:col-span-4 flex flex-col items-center gap-2">
                  <div class="w-28 h-36 rounded-xl overflow-hidden bg-black/60 border border-current/25 relative shadow-inner">
                    <img id="memberPhotoPreview_${idx}" src="${m.photo && m.photo.src ? App.escapeHtml(m.photo.src) : ''}" alt="${App.escapeHtml(m.name)}"
                      style="object-position: ${m.photo?.posX ?? 50}% ${m.photo?.posY ?? 20}%;"
                      class="w-full h-full object-cover ${m.photo && m.photo.src ? '' : 'hidden'}"
                      onerror="this.classList.add('hidden'); this.nextElementSibling.classList.remove('hidden');">
                    <div class="w-full h-full flex flex-col items-center justify-center text-center p-2 font-mono-cad text-[10px] bp-muted-text ${m.photo && m.photo.src ? 'hidden' : ''}">
                      <i class="fa-solid fa-image text-2xl mb-1 text-slate-500"></i>
                      <span>No Photo</span>
                    </div>
                  </div>

                  <!-- Upload Button -->
                  <label class="w-full text-center px-2 py-1.5 rounded-lg border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-mono-cad text-[11px] font-bold cursor-pointer transition-colors">
                    <i class="fa-solid fa-upload mr-1"></i>UPLOAD
                    <input type="file" accept="image/*" class="hidden member-photo-file" data-idx="${idx}">
                  </label>
                </div>

                <!-- Positioning & Photo Details -->
                <div class="sm:col-span-8 space-y-2.5 font-mono-cad text-xs">
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Photo URL / Path</label>
                    <input type="text" value="${App.escapeHtml(m.photo?.src || '')}" class="member-photo-src w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white text-[11px]">
                  </div>

                  <div class="grid grid-cols-2 gap-2">
                    <div>
                      <label class="block text-[10px] bp-muted-text mb-0.5">Focus X: <span class="member-posx-val">${m.photo?.posX ?? 50}%</span></label>
                      <input type="range" min="0" max="100" value="${m.photo?.posX ?? 50}" class="member-posx-range w-full cursor-pointer accent-cyan-400">
                    </div>
                    <div>
                      <label class="block text-[10px] bp-muted-text mb-0.5">Focus Y: <span class="member-posy-val">${m.photo?.posY ?? 20}%</span></label>
                      <input type="range" min="0" max="100" value="${m.photo?.posY ?? 20}" class="member-posy-range w-full cursor-pointer accent-cyan-400">
                    </div>
                  </div>

                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Full Name</label>
                    <input type="text" value="${App.escapeHtml(m.name)}" class="member-name w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white font-bold">
                  </div>
                </div>
              </div>

              <!-- Roles & Bio -->
              <div class="space-y-3 font-mono-cad text-xs pt-1">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Designation / Role</label>
                    <input type="text" value="${App.escapeHtml(m.role)}" class="member-role w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Sector</label>
                    <input type="text" value="${App.escapeHtml(m.sector)}" class="member-sector w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] bp-muted-text mb-0.5">Bio / Profile Description</label>
                  <textarea rows="2" class="member-bio w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white leading-relaxed text-[11px]">${App.escapeHtml(m.bio || '')}</textarea>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Hook events for each member card
    target.querySelectorAll('[data-member-idx]').forEach(card => {
      const idx = parseInt(card.getAttribute('data-member-idx'), 10);
      const m = team[idx];

      const previewImg = card.querySelector(`#memberPhotoPreview_${idx}`);
      const fallbackBox = previewImg.nextElementSibling;
      const srcInput = card.querySelector('.member-photo-src');
      const posXRange = card.querySelector('.member-posx-range');
      const posYRange = card.querySelector('.member-posy-range');
      const posXVal = card.querySelector('.member-posx-val');
      const posYVal = card.querySelector('.member-posy-val');

      function updatePhotoPosition() {
        const x = parseInt(posXRange.value, 10);
        const y = parseInt(posYRange.value, 10);
        posXVal.textContent = x + '%';
        posYVal.textContent = y + '%';
        if (!m.photo) m.photo = {};
        m.photo.posX = x;
        m.photo.posY = y;
        previewImg.style.objectPosition = `${x}% ${y}%`;
      }

      posXRange.addEventListener('input', updatePhotoPosition);
      posYRange.addEventListener('input', updatePhotoPosition);

      srcInput.addEventListener('input', e => {
        if (!m.photo) m.photo = {};
        m.photo.src = e.target.value.trim();
        previewImg.src = m.photo.src;
        if (m.photo.src) {
          previewImg.classList.remove('hidden');
          fallbackBox.classList.add('hidden');
        }
      });

      // File upload handler
      const fileInput = card.querySelector('.member-photo-file');
      fileInput.addEventListener('change', async e => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        try {
          if (App.toast) App.toast(`Uploading ${file.name}...`, 'info', 'PHOTO UPLOAD');
          const uploadedUrl = await uploadImageFile(file);
          if (!m.photo) m.photo = {};
          m.photo.src = uploadedUrl;
          srcInput.value = uploadedUrl;
          previewImg.src = uploadedUrl;
          previewImg.classList.remove('hidden');
          fallbackBox.classList.add('hidden');
          if (App.toast) App.toast('Photo uploaded and linked!', 'success', 'PHOTO READY');
        } catch (err) {
          alert('Photo upload failed: ' + err.message);
        }
      });

      card.querySelector('.member-name').addEventListener('input', e => m.name = e.target.value);
      card.querySelector('.member-role').addEventListener('input', e => m.role = e.target.value);
      card.querySelector('.member-sector').addEventListener('input', e => m.sector = e.target.value);
      card.querySelector('.member-bio').addEventListener('input', e => m.bio = e.target.value);

      card.querySelector('.delete-member-btn').addEventListener('click', () => {
        if (confirm(`Remove ${m.name} from team roster?`)) {
          team.splice(idx, 1);
          renderTeamSubTab(target);
        }
      });
    });

    // Add new member button
    const addBtn = target.querySelector('#addTeamMemberBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        team.push({
          id: 'member_' + Date.now(),
          tier: 'executive',
          code: `EXEC_ID // 0${team.length + 1}`,
          clearance: 'OPS_COMMAND',
          name: 'New Executive Member',
          initials: 'NM',
          photo: { src: '', posX: 50, posY: 20 },
          role: 'Executive Member',
          sector: 'OPERATIONS',
          bio: 'Executive operations specialist coordinating on-ground event delivery and technical logistics.',
          specialties: ['Operations', 'Logistics', 'Execution'],
          stats: { Architecture: 85, Logistics: 90, Production: 88, ClientCmd: 85, CrisisOps: 90 }
        });
        renderTeamSubTab(target);
      });
    }
  }

  /* ==================== 12. SUB-TAB: SERVICES ==================== */
  function renderServicesSubTab(target) {
    const srvs = currentContent.services;
    target.innerHTML = `
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="font-tech font-bold text-base text-white flex items-center gap-2">
              <i class="fa-solid fa-cubes text-cyan-400"></i>
              <span>EVENT PRODUCTION SERVICES (${srvs.length} SERVICES)</span>
            </h3>
            <p class="font-mono-cad text-xs bp-muted-text">Edit service titles, categories, icons, summaries, and inventory lists</p>
          </div>
          <button id="addServiceBtn" type="button" class="px-3 py-2 rounded-xl border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 font-mono-cad text-xs font-bold hover:bg-cyan-500/25 flex items-center gap-1.5">
            <i class="fa-solid fa-plus"></i><span>ADD SERVICE</span>
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          ${srvs.map((s, idx) => `
            <div class="bp-card p-5 rounded-2xl border border-current/20 space-y-4" data-srv-idx="${idx}">
              <div class="flex items-center justify-between border-b border-current/15 pb-2">
                <span class="font-mono-cad text-xs font-bold text-cyan-400">${App.escapeHtml(s.code || `SYS_MOD // 0${idx + 1}`)}</span>
                <button type="button" class="delete-srv-btn text-rose-400 hover:text-rose-300 text-xs p-1" title="Remove service"><i class="fa-solid fa-trash"></i></button>
              </div>

              <div class="space-y-3 font-mono-cad text-xs">
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Service Title</label>
                    <input type="text" value="${App.escapeHtml(s.title)}" class="srv-title w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white font-bold">
                  </div>
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Icon (FontAwesome)</label>
                    <input type="text" value="${App.escapeHtml(s.icon || 'fa-cubes')}" class="srv-icon w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Protocol Tag</label>
                    <input type="text" value="${App.escapeHtml(s.protocol || '')}" class="srv-protocol w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                  </div>
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Lead Time</label>
                    <input type="text" value="${App.escapeHtml(s.leadTime || '')}" class="srv-lead w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                  </div>
                </div>

                <div>
                  <label class="block text-[10px] bp-muted-text mb-0.5">Summary</label>
                  <textarea rows="2" class="srv-summary w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white leading-relaxed text-[11px]">${App.escapeHtml(s.summary || '')}</textarea>
                </div>

                <div>
                  <label class="block text-[10px] bp-muted-text mb-0.5">Inventory (Comma-separated)</label>
                  <textarea rows="2" class="srv-inventory w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white leading-relaxed text-[11px]">${App.escapeHtml(Array.isArray(s.inventory) ? s.inventory.join(', ') : '')}</textarea>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    target.querySelectorAll('[data-srv-idx]').forEach(card => {
      const idx = parseInt(card.getAttribute('data-srv-idx'), 10);
      const s = srvs[idx];
      card.querySelector('.srv-title').addEventListener('input', e => s.title = e.target.value);
      card.querySelector('.srv-icon').addEventListener('input', e => s.icon = e.target.value);
      card.querySelector('.srv-protocol').addEventListener('input', e => s.protocol = e.target.value);
      card.querySelector('.srv-lead').addEventListener('input', e => s.leadTime = e.target.value);
      card.querySelector('.srv-summary').addEventListener('input', e => s.summary = e.target.value);
      card.querySelector('.srv-inventory').addEventListener('input', e => {
        s.inventory = e.target.value.split(',').map(item => item.trim()).filter(Boolean);
      });
      card.querySelector('.delete-srv-btn').addEventListener('click', () => {
        if (confirm(`Remove service "${s.title}"?`)) {
          srvs.splice(idx, 1);
          renderServicesSubTab(target);
        }
      });
    });

    const addBtn = target.querySelector('#addServiceBtn');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        srvs.push({
          id: 'srv-' + Date.now(),
          code: `SYS_MOD // 0${srvs.length + 1}`,
          category: 'custom',
          icon: 'fa-star',
          title: 'Custom Production Service',
          protocol: 'BESPOKE',
          summary: 'Tailored event production engineered to client specifications.',
          leadTime: '10–20 Days',
          inventory: ['Custom Stage & Rigging', 'Dedicated Ops Crew']
        });
        renderServicesSubTab(target);
      });
    }
  }

  /* ==================== 13. SUB-TAB: PORTFOLIO & REVIEWS ==================== */
  function renderPortfolioSubTab(target) {
    const port = currentContent.portfolio;
    const tests = currentContent.testimonials;

    target.innerHTML = `
      <div class="space-y-8 max-w-4xl">
        <!-- Executed Projects -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
              <i class="fa-solid fa-star text-cyan-400"></i>
              <span>EXECUTED BLUEPRINTS & PORTFOLIO (${port.length})</span>
            </h3>
            <button id="addPortfolioBtn" type="button" class="px-3 py-1.5 rounded-lg border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 font-mono-cad text-xs font-bold hover:bg-cyan-500/25">
              <i class="fa-solid fa-plus mr-1"></i>ADD PROJECT
            </button>
          </div>

          <div class="space-y-4">
            ${port.map((p, idx) => `
              <div class="bp-card p-4 rounded-xl border border-current/20 space-y-3" data-port-idx="${idx}">
                <div class="flex items-center justify-between">
                  <span class="font-mono-cad text-xs font-bold text-cyan-400">${App.escapeHtml(p.code || `EXECUTED // 0${idx + 1}`)}</span>
                  <button type="button" class="delete-port-btn text-rose-400 hover:text-rose-300 text-xs p-1"><i class="fa-solid fa-trash"></i></button>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-cad text-xs">
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Project Title</label>
                    <input type="text" value="${App.escapeHtml(p.title)}" class="port-title w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white font-bold">
                  </div>
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Subtitle / Sub-category</label>
                    <input type="text" value="${App.escapeHtml(p.subtitle || '')}" class="port-sub w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                  </div>
                </div>

                <div class="font-mono-cad text-xs">
                  <label class="block text-[10px] bp-muted-text mb-0.5">Summary</label>
                  <textarea rows="2" class="port-summary w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white leading-relaxed text-[11px]">${App.escapeHtml(p.summary || '')}</textarea>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Client Reviews -->
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
              <i class="fa-solid fa-comments text-cyan-400"></i>
              <span>CLIENT TESTIMONIALS (${tests.length})</span>
            </h3>
            <button id="addTestimonialBtn" type="button" class="px-3 py-1.5 rounded-lg border border-cyan-400/50 bg-cyan-500/15 text-cyan-300 font-mono-cad text-xs font-bold hover:bg-cyan-500/25">
              <i class="fa-solid fa-plus mr-1"></i>ADD REVIEW
            </button>
          </div>

          <div class="space-y-4">
            ${tests.map((t, idx) => `
              <div class="bp-card p-4 rounded-xl border border-current/20 space-y-3" data-test-idx="${idx}">
                <div class="flex items-center justify-between">
                  <span class="font-mono-cad text-xs text-cyan-400 font-bold">// REVIEW 0${idx + 1}</span>
                  <button type="button" class="delete-test-btn text-rose-400 hover:text-rose-300 text-xs p-1"><i class="fa-solid fa-trash"></i></button>
                </div>

                <div class="font-mono-cad text-xs space-y-2">
                  <div>
                    <label class="block text-[10px] bp-muted-text mb-0.5">Quote</label>
                    <textarea rows="2" class="test-quote w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white leading-relaxed text-[11px]">${App.escapeHtml(t.quote)}</textarea>
                  </div>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label class="block text-[10px] bp-muted-text mb-0.5">Client / Representative</label>
                      <input type="text" value="${App.escapeHtml(t.author)}" class="test-author w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                    </div>
                    <div>
                      <label class="block text-[10px] bp-muted-text mb-0.5">Organization / Event</label>
                      <input type="text" value="${App.escapeHtml(t.org)}" class="test-org w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-current/20 text-white">
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    // Hook portfolio
    target.querySelectorAll('[data-port-idx]').forEach(card => {
      const idx = parseInt(card.getAttribute('data-port-idx'), 10);
      const p = port[idx];
      card.querySelector('.port-title').addEventListener('input', e => p.title = e.target.value);
      card.querySelector('.port-sub').addEventListener('input', e => p.subtitle = e.target.value);
      card.querySelector('.port-summary').addEventListener('input', e => p.summary = e.target.value);
      card.querySelector('.delete-port-btn').addEventListener('click', () => {
        if (confirm(`Remove project "${p.title}"?`)) {
          port.splice(idx, 1);
          renderPortfolioSubTab(target);
        }
      });
    });

    target.querySelector('#addPortfolioBtn').addEventListener('click', () => {
      port.push({
        id: 'project_' + Date.now(),
        code: `EXECUTED // 0${port.length + 1}`,
        category: 'corporate',
        title: 'New Executed Event',
        subtitle: 'Corporate Event // Khulna',
        scale: 'Corporate Gala',
        power: 'Full AV Rig',
        crew: 'Technical Crew',
        tags: ['Corporate', 'Stage & Sound'],
        summary: 'Turnkey event production with stage engineering, line-array audio, and guest protocol.',
        metrics: { Production: 'Turnkey', Status: 'Executed' }
      });
      renderPortfolioSubTab(target);
    });

    // Hook testimonials
    target.querySelectorAll('[data-test-idx]').forEach(card => {
      const idx = parseInt(card.getAttribute('data-test-idx'), 10);
      const t = tests[idx];
      card.querySelector('.test-quote').addEventListener('input', e => t.quote = e.target.value);
      card.querySelector('.test-author').addEventListener('input', e => t.author = e.target.value);
      card.querySelector('.test-org').addEventListener('input', e => t.org = e.target.value);
      card.querySelector('.delete-test-btn').addEventListener('click', () => {
        if (confirm('Remove this review?')) {
          tests.splice(idx, 1);
          renderPortfolioSubTab(target);
        }
      });
    });

    target.querySelector('#addTestimonialBtn').addEventListener('click', () => {
      tests.push({
        quote: 'Seamless stage production, punctual show calling, and excellent hospitality.',
        author: 'Client Representative',
        org: 'Corporate Gala Committee',
        rating: '5.0 // VERIFIED'
      });
      renderPortfolioSubTab(target);
    });
  }

  /* ==================== 14. SUB-TAB: CONTACT & FOOTER ==================== */
  function renderContactSubTab(target) {
    const c = currentContent.contact;
    target.innerHTML = `
      <div class="space-y-6 max-w-4xl">
        <div class="bp-card p-5 sm:p-6 rounded-2xl space-y-4">
          <h3 class="font-tech font-bold text-sm text-white flex items-center gap-2">
            <i class="fa-solid fa-phone text-cyan-400"></i>
            <span>CONTACT INFO & FOOTER SLOGANS</span>
          </h3>

          <div class="space-y-4 font-mono-cad text-xs">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Office Address</label>
                <input type="text" id="contactAddressInput" value="${App.escapeHtml(c.address)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Official Email Address</label>
                <input type="text" id="contactEmailInput" value="${App.escapeHtml(c.email)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Facebook URL</label>
                <input type="text" id="contactFbInput" value="${App.escapeHtml(c.facebook || '')}" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Instagram URL</label>
                <input type="text" id="contactInstaInput" value="${App.escapeHtml(c.instagram || '')}" class="w-full px-3 py-2 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Footer Copyright Notice</label>
                <input type="text" id="footerCopyInput" value="${App.escapeHtml(c.copyright)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
              <div>
                <label class="block text-[11px] bp-muted-text mb-1">Footer Slogan / Subtitle</label>
                <input type="text" id="footerSlogInput" value="${App.escapeHtml(c.footerSlogan)}" class="w-full px-3 py-2.5 rounded-lg bg-black/40 border border-current/25 text-white">
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    target.querySelector('#contactAddressInput').addEventListener('input', e => c.address = e.target.value);
    target.querySelector('#contactEmailInput').addEventListener('input', e => c.email = e.target.value);
    target.querySelector('#contactFbInput').addEventListener('input', e => c.facebook = e.target.value);
    target.querySelector('#contactInstaInput').addEventListener('input', e => c.instagram = e.target.value);
    target.querySelector('#footerCopyInput').addEventListener('input', e => c.copyright = e.target.value);
    target.querySelector('#footerSlogInput').addEventListener('input', e => c.footerSlogan = e.target.value);
  }

  /* ==================== 15. FLOATING SUPER ADMIN QUICK EDIT BUTTON ==================== */
  function injectFloatingSuperAdminButton() {
    // Only inject on public site (index.html), not when already inside admin.html
    if (window.location.pathname.includes('admin') || window.location.pathname.includes('bsaaevent')) return;

    // Check if Super Admin is currently logged in
    function isSuper() {
      try {
        if (window.BlueprintApp && window.BlueprintApp.admin && typeof window.BlueprintApp.admin.isSuperAdmin === 'function') {
          return window.BlueprintApp.admin.isSuperAdmin();
        }
        const s = localStorage.getItem('bp_admin_session_v5');
        if (s) {
          const parsed = JSON.parse(s);
          const u = parsed.user;
          return !!(u && (u.tier === 'superadmin' || u.id === 'superadmin' || u.id === 'admin'));
        }
      } catch (_) {}
      return false;
    }

    if (!isSuper()) return;

    if (document.getElementById('superAdminFloatingCmsBtn')) return;

    const btn = document.createElement('a');
    btn.id = 'superAdminFloatingCmsBtn';
    btn.href = 'admin.html?open=cms';
    btn.target = '_blank';
    btn.className = 'fixed bottom-5 right-5 z-[80] px-4 py-2.5 rounded-full bg-cyan-400 text-slate-950 font-tech font-bold text-xs tracking-wider shadow-2xl shadow-cyan-400/40 border border-cyan-200 flex items-center gap-2 hover:scale-105 hover:bg-cyan-300 transition-all';
    btn.innerHTML = '<i class="fa-solid fa-paintbrush text-sm"></i><span>EDIT WEBSITE (SUPER ADMIN)</span>';
    document.body.appendChild(btn);
  }

  /* ==================== 16. BOOT & INITIALIZATION ==================== */
  loadLocal();
  applyDesign(currentDesign);
  applyContent(currentContent);

  // Fetch live custom content from server
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fetchFromServer();
      injectFloatingSuperAdminButton();
    });
  } else {
    fetchFromServer();
    injectFloatingSuperAdminButton();
  }

  window.addEventListener('load', injectFloatingSuperAdminButton);

  // Expose API on BlueprintApp
  window.BlueprintApp = window.BlueprintApp || {};
  window.BlueprintApp.cms = {
    getContent: () => currentContent,
    getDesign: () => currentDesign,
    applyDesign,
    applyContent,
    publishToServer,
    resetToDefaults,
    uploadImageFile,
    renderCmsTab
  };
})();
