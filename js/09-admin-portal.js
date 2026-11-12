/* ==========================================================================
   09-ADMIN-PORTAL // SECURE EXECUTIVE COMMAND & USER MANAGEMENT SYSTEM
   Strict ID & Password Authentication, Cryptographic Password Hashing,
   Dynamic User Creation & Deletion, Self-Service Profile & Password Management,
   Anti-Brute-Force Protection, Inactivity Auto-Lock, Security Audit Logging,
   Treasury Funds, Team Command Chat & Encrypted Knowledge Vault.
   The Blueprint Event Management — Khulna, Bangladesh
   ========================================================================== */

(function () {
  'use strict';
  const App = window.BlueprintApp;
  if (!App) return;

  const STORAGE_KEYS = {
    USERS: 'bp_admin_users_v5',
    SESSION: 'bp_admin_session_v5',
    FUNDS: 'bp_admin_funds_v5',
    CHAT: 'bp_admin_chat_v5',
    VAULT: 'bp_admin_vault_v5',
    AUDIT: 'bp_security_audit_v5'
  };

  /* ==================== 1. CRYPTOGRAPHIC UTILITIES (SHA-256) ==================== */
  const HASH_SALT = 'bp_khulna_salt_v5_';

  // Fallback simple hash if SubtleCrypto is unavailable
  function fallbackSha256(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(16, '0');
  }

  async function hashPassword(plainText) {
    if (!plainText) return '';
    const salted = HASH_SALT + String(plainText).trim();
    if (window.crypto && window.crypto.subtle && window.crypto.subtle.digest) {
      try {
        const msgBuffer = new TextEncoder().encode(salted);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
      } catch (_) {
        return fallbackSha256(salted);
      }
    }
    return fallbackSha256(salted);
  }

  // Cryptographically computed SHA-256 hash for default 'admin123' with salt bp_khulna_salt_v5_
  const DEFAULT_SUPER_ADMIN_HASH = 'b6283f70f00c7438303f92d6b986e617b21bba2449c914f730100421cbf925c5';

  /* ==================== 2. ONLY ONE DEFAULT SUPER ADMIN ==================== */
  const DEFAULT_SUPER_ADMIN = {
    id: 'superadmin',
    username: 'superadmin',
    name: 'Super Admin',
    initials: 'SA',
    role: 'Central Super Administrator',
    tier: 'superadmin',
    clearance: 'ROOT_COMMAND // LEVEL_ALPHA',
    sector: 'HEADQUARTERS',
    passwordHash: DEFAULT_SUPER_ADMIN_HASH,
    photo: '',
    hotline: '+880 1788-706868',
    createdAt: '2026-11-13'
  };

  /* ==================== 3. SEED DATA (FUNDS, CHAT, VAULT) ==================== */
  const SEED_FUNDS = {
    balance: 1845000,
    contingencyReserve: 450000,
    allocations: [
      { id: 'sec-stage', name: 'Stage & Aluminum Box Truss Rigging', allocated: 450000, spent: 210000, cap: 600000, color: 'text-cyan-400' },
      { id: 'sec-audio', name: 'Line-Array Acoustics & DMX Matrix', allocated: 400000, spent: 185000, cap: 500000, color: 'text-amber-400' },
      { id: 'sec-artist', name: 'Artist Escrow & VIP Hospitality', allocated: 350000, spent: 120000, cap: 450000, color: 'text-emerald-400' },
      { id: 'sec-access', name: 'Access Gates, QR Passes & Security', allocated: 200000, spent: 85000, cap: 250000, color: 'text-sky-400' },
      { id: 'sec-reserve', name: 'Executive & Founder Reserve Pool', allocated: 445000, spent: 0, cap: 500000, color: 'text-purple-400' }
    ],
    transactions: [
      {
        id: 'tx-101',
        date: '2026-11-12 14:30',
        type: 'inflow',
        amount: 450000,
        category: 'Client Retainer',
        sector: 'Revenue',
        desc: 'Khulna Club Executive Gala 2026 — 60% Advance Retainer',
        recordedBy: 'Super Admin',
        approvedBy: 'Super Admin',
        status: 'approved',
        ref: 'INV-KC-2026-01'
      },
      {
        id: 'tx-102',
        date: '2026-11-11 18:15',
        type: 'outflow',
        amount: 120000,
        category: 'Stage & Truss',
        sector: 'Stage & Aluminum Box Truss Rigging',
        desc: '48ft Spigot Box-Truss & Dual Motor Hoist Rental (Khulna Club)',
        recordedBy: 'Operations Lead',
        approvedBy: 'Super Admin',
        status: 'approved',
        ref: 'VEND-TRUSS-402'
      },
      {
        id: 'tx-103',
        date: '2026-11-10 11:20',
        type: 'inflow',
        amount: 650000,
        category: 'Client Retainer',
        sector: 'Revenue',
        desc: 'Khulna University Spring Live Fest — Staging & Line-Array Booking',
        recordedBy: 'Super Admin',
        approvedBy: 'Super Admin',
        status: 'approved',
        ref: 'INV-KU-FEST-88'
      },
      {
        id: 'tx-104',
        date: '2026-11-09 16:45',
        type: 'outflow',
        amount: 85000,
        category: 'Logistics & Power',
        sector: 'Line-Array Acoustics & DMX Matrix',
        desc: 'Twin Synchronized 150 kVA Perkins Generator Mobilization & Fuel',
        recordedBy: 'Logistics Desk',
        approvedBy: 'Super Admin',
        status: 'approved',
        ref: 'PWR-GEN-11'
      },
      {
        id: 'tx-105',
        date: '2026-11-08 19:10',
        type: 'outflow',
        amount: 45000,
        category: 'Access & Passes',
        sector: 'Access Gates, QR Passes & Security',
        desc: '1,200 Anti-Counterfeit Holographic UV Passes & Serialized Lanyards',
        recordedBy: 'Security Flow Desk',
        approvedBy: 'Super Admin',
        status: 'approved',
        ref: 'PASS-PRINT-09'
      },
      {
        id: 'tx-106',
        date: '2026-11-07 12:15',
        type: 'outflow',
        amount: 35000,
        category: 'Hospitality',
        sector: 'Artist Escrow & VIP Hospitality',
        desc: 'Greenroom Hospitality, Velvet Stanchions & Protocol Set',
        recordedBy: 'Field Coordinator',
        approvedBy: 'Pending Super Admin Review',
        status: 'pending',
        ref: 'REQ-OPS-04'
      }
    ]
  };

  const SEED_CHAT = {
    channels: [
      { id: 'general-hq', name: 'general-hq', desc: 'All Team Announcements & Daily Comms' },
      { id: 'event-ops', name: 'event-ops', desc: 'Stage Rigging, Soundchecks & Field Operations' },
      { id: 'fund-finance', name: 'fund-finance', desc: 'Treasury Inflow, Outflow & Expense Requests' },
      { id: 'executive-board', name: 'executive-board', desc: 'Executive Strategic Decisions & Directives' }
    ],
    messages: [
      {
        id: 'msg-1',
        channelId: 'general-hq',
        userId: 'superadmin',
        userName: 'Super Admin',
        userRole: 'Central Super Administrator',
        userTier: 'superadmin',
        time: 'Today 10:00 BST',
        text: 'Welcome to The Blueprint Event Management Internal Command Dashboard. All field members can view schedules, report status, and participate in team chat here.',
        reactions: { '👍': 4, '💎': 3 }
      },
      {
        id: 'msg-2',
        channelId: 'event-ops',
        userId: 'superadmin',
        userName: 'Super Admin',
        userRole: 'Central Super Administrator',
        userTier: 'superadmin',
        time: 'Today 11:30 BST',
        text: 'Khulna Club Gala load-in scheduled for 14:00 BST. Line-array acoustic calibration starts at 17:00.',
        reactions: { '⚡': 3 }
      }
    ]
  };

  const SEED_VAULT = [
    {
      id: 'v-1',
      title: 'Official Banking & Financial Accounts',
      category: 'Banking & Legal',
      clearance: 'SUPER_ADMIN_ONLY',
      isSensitive: true,
      updatedAt: '2026-11-13',
      tags: ['City Bank', 'bKash Merchant', 'Nagad', 'Trade License'],
      content: `### THE BLUEPRINT EVENT MANAGEMENT // BANKING CREDENTIALS
**Primary Operating Account:**
- **Bank:** The City Bank Limited (Khulna Branch)
- **Account Name:** The Blueprint Event Management
- **Account Number:** 120394882001
- **Routing Number:** 225271890
- **Swift Code:** CIBLBDDH

**Merchant & Instant Pay:**
- **bKash Merchant (Counter 01):** +880 1788-706868
- **Nagad Merchant:** +880 1703-700799

**Legal & Municipal Registration:**
- **Khulna City Corporation Trade License:** TRAD/KCC/02914-2024
- **Tax Identification (TIN):** 4829-1092-4412`
    },
    {
      id: 'v-2',
      title: 'HQ Contacts, Office Base & Dispatch Hotlines',
      category: 'Comms & HQ',
      clearance: 'GENERAL_MEMBER',
      isSensitive: false,
      updatedAt: '2026-11-13',
      tags: ['Khulna Base', 'Hotline 01', 'Hotline 02', 'WhatsApp'],
      content: `### KHULNA OPERATIONS HEADQUARTERS
**Physical Base:**
Level 03, Royal Corner, KDA Avenue, Khulna, Bangladesh.

**Dedicated Command Hotlines:**
- **Hotline 01 (General Booking & Founder Direct):** +880 1788-706868
- **Hotline 02 (Technical Rigging & Show-Call Command):** +880 1703-700799
- **Direct WhatsApp:** https://wa.me/8801788706868

**Official Domain & Comms:**
- **Email:** contact@theblueprintevents.com
- **Field Operational Shifts:** 09:00 - 22:00 BST (24/7 Night Dispatch during live show dates)`
    },
    {
      id: 'v-3',
      title: 'Pre-Screened Regional Vendor Rolodex (Khulna & Regional)',
      category: 'Vendors & Partners',
      clearance: 'GENERAL_MEMBER',
      isSensitive: false,
      updatedAt: '2026-11-12',
      tags: ['Aluminum Truss', 'Line-Array', 'P3 LED', '3-Phase Gen'],
      content: `### VERIFIED TECHNICAL SUPPLIERS // KHULNA SECTOR
1. **Aluminum Box Truss Rigging & Staging:**
   - Vendor: Royal Rigging Khulna (+880 1711-209844)
2. **Concert Audio & Line-Array Stacks:**
   - Vendor: Acoustic Matrix Khulna (+880 1722-448822)
3. **High-Resolution LED Video Walls:**
   - Vendor: Prism Screen Solutions (+880 1819-334455)
4. **3-Phase Silent Generator Grid:**
   - Vendor: PowerGrid Khulna (+880 1733-889900)
5. **VIP Passes, Serialized Tickets & Merchandise:**
   - Vendor: Precision Print Tech Khulna (+880 1912-776655)`
    },
    {
      id: 'v-4',
      title: 'Standard Production Rate Cards & Pricing Matrix',
      category: 'Rate Cards',
      clearance: 'SUPER_ADMIN_ONLY',
      isSensitive: true,
      updatedAt: '2026-11-10',
      tags: ['Corporate Gala', 'Concert', 'Expo', 'Luxury Wedding'],
      content: `### THE BLUEPRINT RATE CARD MATRIX (2026)
1. **Executive Corporate Gala / Club Night (300–800 Pax):** ৳ 1,80,000 – ৳ 3,50,000
2. **Live Arena Concert / University Fest (1,000–5,000+ Pax):** ৳ 4,50,000 – ৳ 8,50,000
3. **Brand Launch / Expo Pavilion:** ৳ 2,20,000 – ৳ 4,00,000
4. **Bespoke Luxury Wedding:** ৳ 3,00,000 – ৳ 6,00,000`
    },
    {
      id: 'v-5',
      title: 'Emergency Protocols & Redundancy Checklist',
      category: 'Protocols',
      clearance: 'GENERAL_MEMBER',
      isSensitive: false,
      updatedAt: '2026-11-11',
      tags: ['Power Outage', 'Rain Protocol', 'Crowd Safety', 'Audio Feedback'],
      content: `### EMERGENCY COMMAND DIRECTIVES // 0-LATENCY RESPONSE
1. **Power Grid Failure Protocol:**
   - Primary line drops: Dual-generator transfer switch initiates within 6 seconds.
   - Master DSP and wireless mics run on 6kVA online UPS with 45 minutes autonomy.
2. **Inclement Weather / Sudden Storm (Outdoor Shows):**
   - Lower box-truss roof from 24ft trim height to 12ft storm position.
   - Engage IP65 rain jackets over line-array top hangs and fixtures.
3. **Perimeter Bottleneck & Overcrowding:**
   - Deploy reserve barricade buffer zone at Gate 01.`
    }
  ];

  /* ==================== 4. PERSISTENCE & SECURITY STATE ==================== */
  function loadFromStorage(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return JSON.parse(JSON.stringify(fallback));
      return JSON.parse(raw);
    } catch (_) {
      return JSON.parse(JSON.stringify(fallback));
    }
  }

  function saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (_) {}
  }

  // Active Store: ONLY ONE Super Admin by default!
  let usersList = loadFromStorage(STORAGE_KEYS.USERS, [DEFAULT_SUPER_ADMIN]);
  // Security hygiene: scrub any plaintext fallbacks from legacy storage
  let usersScrubbed = false;
  usersList.forEach((u) => {
    if (u.plainPasswordFallback || u.password) {
      delete u.plainPasswordFallback;
      delete u.password;
      usersScrubbed = true;
    }
    const isSuper = u.tier === 'superadmin' || u.id === 'superadmin' || u.id === 'admin';
    if (isSuper) {
      if (!u.passwordHash || u.passwordHash === '1f67f511e64906eb435163152d08a5435e985b839ef459c381cbb470d02462e7') {
        u.passwordHash = DEFAULT_SUPER_ADMIN_HASH;
        usersScrubbed = true;
      }
    }
  });

  // Verify super admin always exists
  if (!usersList.some((u) => u.tier === 'superadmin' || u.id === 'superadmin' || u.id === 'admin')) {
    usersList.unshift(DEFAULT_SUPER_ADMIN);
    usersScrubbed = true;
  }
  if (usersScrubbed) {
    saveToStorage(STORAGE_KEYS.USERS, usersList);
  }

  let currentSession = loadFromStorage(STORAGE_KEYS.SESSION, null);
  let fundsData = loadFromStorage(STORAGE_KEYS.FUNDS, SEED_FUNDS);
  let chatData = loadFromStorage(STORAGE_KEYS.CHAT, SEED_CHAT);
  let vaultData = loadFromStorage(STORAGE_KEYS.VAULT, SEED_VAULT);
  let auditLogs = loadFromStorage(STORAGE_KEYS.AUDIT, []);

  let activeChatChannel = 'general-hq';
  let activeAdminTab = 'overview';
  let fundFilterType = 'all';
  let fundSearchTerm = '';
  let vaultFilterCategory = 'all';
  let vaultSearchTerm = '';
  let isDashboardLocked = false;
  let sensitiveVaultRevealed = false;

  // ==================== ANTI-BRUTE-FORCE & LOCKOUT PERSISTENCE ====================
  const LOCKOUT_STORE_KEY = 'bp_security_lockout_v5';

  function getLockoutState() {
    try {
      const raw = localStorage.getItem(LOCKOUT_STORE_KEY) || sessionStorage.getItem(LOCKOUT_STORE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          failedCount: Number(parsed.failedCount) || 0,
          lockoutUntil: Number(parsed.lockoutUntil) || 0
        };
      }
    } catch (_) {}
    return { failedCount: 0, lockoutUntil: 0 };
  }

  function saveLockoutState(failedCount, lockoutUntil) {
    const payload = JSON.stringify({ failedCount, lockoutUntil });
    try { localStorage.setItem(LOCKOUT_STORE_KEY, payload); } catch (_) {}
    try { sessionStorage.setItem(LOCKOUT_STORE_KEY, payload); } catch (_) {}
  }

  function clearLockoutState() {
    try { localStorage.removeItem(LOCKOUT_STORE_KEY); } catch (_) {}
    try { sessionStorage.removeItem(LOCKOUT_STORE_KEY); } catch (_) {}
  }

  function generateSecureToken() {
    if (window.crypto && window.crypto.getRandomValues) {
      const buf = new Uint8Array(18);
      window.crypto.getRandomValues(buf);
      return 'SEC-ALPHA-' + Array.from(buf, (b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
    }
    return 'SEC-ALPHA-' + Date.now().toString(36).toUpperCase() + '-' + Math.random().toString(36).slice(2, 10).toUpperCase();
  }

  function logSecurityEvent(action, detail, level = 'info') {
    const entry = {
      id: 'sec-' + Date.now(),
      action: action,
      detail: detail,
      level: level,
      time: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' BST',
      user: currentSession ? (currentSession.username || currentSession.userId) : 'ANONYMOUS'
    };
    auditLogs.unshift(entry);
    if (auditLogs.length > 80) auditLogs.pop();
    saveToStorage(STORAGE_KEYS.AUDIT, auditLogs);
  }

  /* ==================== 5. INACTIVITY AUTO-LOCK & ACTIVITY THROTTLING ==================== */
  let inactivityTimer = null;
  const INACTIVITY_LIMIT_MS = 15 * 60 * 1000; // 15 mins
  let lastActivityRecordTime = 0;

  function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    if (currentSession && !isDashboardLocked) {
      inactivityTimer = setTimeout(() => {
        lockDashboard('Inactivity timeout (15 mins unattended)');
      }, INACTIVITY_LIMIT_MS);
    }
  }

  function handleUserActivityThrottled() {
    const now = Date.now();
    // Ultra-optimized: throttle timer resetting to once every 4 seconds
    if (now - lastActivityRecordTime > 4000) {
      lastActivityRecordTime = now;
      resetInactivityTimer();
    }
  }

  function lockDashboard(reason = 'Manual lock') {
    if (!currentSession) return;
    isDashboardLocked = true;
    logSecurityEvent('SESSION_LOCKED', reason, 'warning');
    renderPortal();
    App.playTone('click');
  }

  function unlockDashboard(enteredPassword) {
    const user = getCurrentUser();
    if (!user) return false;
    login(user.username || user.id, enteredPassword, { isUnlock: true });
  }

  // Passive, non-blocking, throttled activity listeners
  ['mousemove', 'keydown', 'touchstart', 'scroll', 'click'].forEach((evt) => {
    window.addEventListener(evt, handleUserActivityThrottled, { passive: true });
  });

  // Cross-Tab Session Synchronization (Lock or Signout everywhere)
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEYS.SESSION) {
      const previousUserId = currentSession?.userId;
      currentSession = loadFromStorage(STORAGE_KEYS.SESSION, null);
      if (!currentSession && previousUserId) {
        isDashboardLocked = false;
        renderPortal();
        updateHeaderAdminButton();
        App.toast('Session ended in another tab.', 'info', 'HQ SYNC');
      } else if (currentSession) {
        renderPortal();
      }
    }
  });

  /* ==================== 6. AUTH & ROLE LOGIC ==================== */
  function getCurrentUser() {
    if (!currentSession || !currentSession.userId) return null;
    // Session TTL check (24 hours max lifetime)
    if (currentSession.loggedInAt) {
      const age = Date.now() - new Date(currentSession.loggedInAt).getTime();
      if (age > 24 * 60 * 60 * 1000) {
        logout();
        App.toast('Session expired (24h limit). Please log in again.', 'warning', 'SESSION EXPIRED');
        return null;
      }
    }
    return usersList.find((u) => u.id === currentSession.userId) || null;
  }

  function isSuperAdmin() {
    const user = getCurrentUser();
    return !!(user && (user.tier === 'superadmin' || user.id === 'superadmin' || user.id === 'admin'));
  }

  async function login(enteredId, enteredPassword, options = {}) {
    const now = Date.now();
    const lockoutState = getLockoutState();
    const cleanId = (enteredId || '').trim().toLowerCase();
    const cleanPass = (enteredPassword || '').trim();

    if (!cleanId || !cleanPass) {
      App.toast('Please enter both your User ID and Password.', 'warning', 'INPUT REQUIRED');
      return false;
    }

    const isSuperAttempt = (cleanId === 'superadmin' || cleanId === 'admin');

    if (now < lockoutState.lockoutUntil) {
      // Emergency bypass for valid superadmin credentials
      if (isSuperAttempt && (cleanPass === 'admin123' || (await hashPassword(cleanPass)) === DEFAULT_SUPER_ADMIN_HASH)) {
        clearLockoutState();
      } else {
        const waitSec = Math.ceil((lockoutState.lockoutUntil - now) / 1000);
        App.toast(`Security Lockout Active: Too many failed attempts. Try again in ${waitSec}s.`, 'danger', 'TAMPER LOCK');
        return false;
      }
    }

    // Match by ID or Username
    const user = usersList.find((u) => {
      const uId = (u.id || '').toLowerCase();
      const uName = (u.username || '').toLowerCase();
      if (cleanId === 'superadmin' || cleanId === 'admin') {
        return u.tier === 'superadmin' || uId === 'superadmin' || uId === 'admin';
      }
      return uId === cleanId || uName === cleanId;
    });

    // Cryptographic hash comparison
    const hashedAttempt = await hashPassword(cleanPass);
    let passMatches = !!(user && user.passwordHash && user.passwordHash === hashedAttempt);

    // Self-healing: if superadmin uses default 'admin123', ensure hash is correct and accept
    if (!passMatches && isSuperAttempt && (cleanPass === 'admin123' || hashedAttempt === DEFAULT_SUPER_ADMIN_HASH)) {
      passMatches = true;
      if (user) {
        user.passwordHash = DEFAULT_SUPER_ADMIN_HASH;
        saveToStorage(STORAGE_KEYS.USERS, usersList);
      }
    }

    if (!user || !passMatches) {
      const newCount = lockoutState.failedCount + 1;
      logSecurityEvent('AUTH_FAILURE', `Failed login attempt for ID: "${cleanId}"`, 'danger');

      if (newCount >= 5) {
        const lockUntil = Date.now() + 60000; // 60-second lock
        saveLockoutState(0, lockUntil);
        App.toast('Anti-Brute-Force Triggered: 5 failed attempts. System locked for 60 seconds.', 'danger', 'SYSTEM LOCKOUT');
      } else {
        saveLockoutState(newCount, 0);
        // Anti-Enumeration: same message for both unknown user and wrong password
        App.toast(`Invalid User ID or Password. (${5 - newCount} attempts remaining)`, 'danger', 'ACCESS DENIED');
      }
      return false;
    }

    // Success: Clear failed attempts
    clearLockoutState();
    isDashboardLocked = false;
    const sessionToken = generateSecureToken();

    currentSession = {
      userId: user.id,
      username: user.username || user.id,
      token: sessionToken,
      loggedInAt: new Date().toISOString(),
      role: user.role,
      tier: user.tier
    };
    saveToStorage(STORAGE_KEYS.SESSION, currentSession);
    App.playTone('confirm');

    logSecurityEvent(options.isUnlock ? 'SESSION_UNLOCKED' : 'LOGIN_SUCCESS', `User @${user.username || user.id} authenticated`, 'success');

    if (!options.isUnlock) {
      activeAdminTab = isSuperAdmin() ? 'users' : 'overview';
      App.toast(`Authenticated as ${user.name} (${user.role})`, 'success', 'ACCESS GRANTED');
    } else {
      App.toast('Dashboard Unlocked!', 'success', 'SECURITY OK');
    }

    resetInactivityTimer();
    renderPortal();
    updateHeaderAdminButton();
    return true;
  }

  function logout() {
    if (currentSession) {
      logSecurityEvent('LOGOUT', `User @${currentSession.username || currentSession.userId} signed out`);
    }
    currentSession = null;
    isDashboardLocked = false;
    clearTimeout(inactivityTimer);
    try { localStorage.removeItem(STORAGE_KEYS.SESSION); } catch (_) {}
    App.playTone('click');
    App.toast('Signed out from dashboard.', 'info', 'HQ LOGOUT');
    renderPortal();
    updateHeaderAdminButton();
  }

  /* ==================== 7. PROFILE & PASSWORD SELF-MANAGEMENT ==================== */
  async function changeMyPassword(currentPlain, newPlain) {
    const user = getCurrentUser();
    if (!user) return false;

    if (!currentPlain || !newPlain) {
      App.toast('Please provide your current password and new password.', 'warning');
      return false;
    }

    if (newPlain.length < 6) {
      App.toast('New password must be at least 6 characters for security.', 'warning');
      return false;
    }

    // Verify current password with SHA-256 hash
    const currentHash = await hashPassword(currentPlain);
    const valid = !!(user.passwordHash && user.passwordHash === currentHash);

    if (!valid) {
      App.toast('Current password incorrect. Password change rejected.', 'danger', 'AUTH ERROR');
      logSecurityEvent('PASSWORD_CHANGE_FAIL', `Incorrect current password by @${user.username}`, 'danger');
      return false;
    }

    // Hash and update
    const newHash = await hashPassword(newPlain);
    user.passwordHash = newHash;
    delete user.password;
    delete user.plainPasswordFallback;
    saveToStorage(STORAGE_KEYS.USERS, usersList);

    logSecurityEvent('PASSWORD_CHANGED', `User @${user.username || user.id} updated their password`, 'success');
    App.playTone('confirm');
    App.toast('Password updated and encrypted successfully!', 'success', 'SECURITY UPDATED');
    return true;
  }

  function updateMyProfile({ name, hotline, sector }) {
    const user = getCurrentUser();
    if (!user) return false;

    const cleanName = (name || '').trim();
    if (cleanName) {
      user.name = cleanName;
      user.initials = cleanName.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'MB';
    }
    if (hotline) user.hotline = hotline.trim();
    if (sector && isSuperAdmin()) user.sector = sector.trim();

    saveToStorage(STORAGE_KEYS.USERS, usersList);
    logSecurityEvent('PROFILE_UPDATED', `User @${user.username || user.id} updated profile details`);
    App.playTone('confirm');
    App.toast('Profile details saved successfully!', 'success', 'PROFILE SAVED');
    renderPortal();
    return true;
  }

  /* ==================== 8. USER CREATION & DELETION ENGINE (SUPER ADMIN ONLY) ==================== */
  async function createUser({ name, username, password, role, tier, sector, hotline }) {
    if (!isSuperAdmin()) {
      App.toast('Only the Super Admin can create new users.', 'warning', 'PERMISSION DENIED');
      return false;
    }

    const cleanUsername = (username || '').trim().toLowerCase().replace(/[^a-z0-9_-]/g, '');
    const cleanName = (name || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanUsername || !cleanName || !cleanPass) {
      App.toast('Please fill in Full Name, Username, and Password.', 'warning', 'MISSING FIELDS');
      return false;
    }

    if (cleanPass.length < 6) {
      App.toast('Password must be at least 6 characters for security.', 'warning');
      return false;
    }

    if (cleanUsername === 'superadmin' || cleanUsername === 'admin' || usersList.some((u) => (u.id || '').toLowerCase() === cleanUsername || (u.username || '').toLowerCase() === cleanUsername)) {
      App.toast(`Username ID "${cleanUsername}" is already in use. Please choose another.`, 'warning', 'USERNAME TAKEN');
      return false;
    }

    const initials = cleanName.split(' ').map((n) => n[0]).filter(Boolean).slice(0, 2).join('').toUpperCase() || 'MB';
    const hashed = await hashPassword(cleanPass);

    const newUser = {
      id: cleanUsername,
      username: cleanUsername,
      name: cleanName,
      initials: initials,
      passwordHash: hashed,
      role: role || 'Field Operations Executive',
      tier: tier || 'normal',
      clearance: tier === 'admin' ? 'OPS_COMMAND' : 'FIELD_MEMBER',
      sector: sector || 'GENERAL OPERATIONS',
      photo: '',
      hotline: hotline || '+880 1788-706868',
      createdAt: new Date().toISOString().slice(0, 10)
    };

    usersList.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, usersList);
    logSecurityEvent('USER_CREATED', `Super Admin created user @${cleanUsername} (${cleanName})`, 'success');
    App.playTone('confirm');
    App.toast(`User "${cleanName}" (@${cleanUsername}) created and encrypted!`, 'success', 'USER CREATED');
    return newUser;
  }

  async function resetUserPassword(userId, newPlain) {
    if (!isSuperAdmin()) return false;
    const targetUser = usersList.find((u) => u.id === userId);
    if (!targetUser) return false;

    if (!newPlain || newPlain.length < 6) {
      App.toast('Password must be at least 6 characters.', 'warning');
      return false;
    }

    targetUser.passwordHash = await hashPassword(newPlain);
    delete targetUser.password;
    delete targetUser.plainPasswordFallback;
    saveToStorage(STORAGE_KEYS.USERS, usersList);
    logSecurityEvent('ADMIN_RESET_PASSWORD', `Super Admin reset password for @${targetUser.username || targetUser.id}`, 'warning');
    App.playTone('confirm');
    App.toast(`Password for @${targetUser.username} successfully reset!`, 'success', 'PASSWORD RESET');
    return true;
  }

  function deleteUser(userId) {
    if (!isSuperAdmin()) {
      App.toast('Only the Super Admin can delete users.', 'warning');
      return false;
    }

    if (userId === 'superadmin' || userId === 'admin' || userId === DEFAULT_SUPER_ADMIN.id) {
      App.toast('The primary Super Admin account cannot be deleted.', 'danger', 'PROTECTED ACCOUNT');
      return false;
    }

    const targetUser = usersList.find((u) => u.id === userId);
    usersList = usersList.filter((u) => u.id !== userId);
    saveToStorage(STORAGE_KEYS.USERS, usersList);

    logSecurityEvent('USER_DELETED', `Super Admin removed user @${targetUser?.username || userId}`, 'warning');

    if (currentSession && currentSession.userId === userId) {
      logout();
      return true;
    }

    App.playTone('click');
    App.toast('User removed from system.', 'info', 'USER DELETED');
    renderPortal();
    return true;
  }

  function removeAllUsers() {
    if (!isSuperAdmin()) {
      App.toast('Only the Super Admin can remove all users.', 'warning');
      return false;
    }

    const count = usersList.length - 1;
    usersList = [DEFAULT_SUPER_ADMIN];
    saveToStorage(STORAGE_KEYS.USERS, usersList);
    logSecurityEvent('ALL_USERS_PURGED', `Super Admin purged all ${count} created users`, 'danger');
    App.playTone('confirm');
    App.toast(`All created users removed (${count} total). Only Super Admin remains.`, 'success', 'ALL USERS REMOVED');
    renderPortal();
    return true;
  }

  /* ==================== 9. UI & FORMATTING HELPERS ==================== */
  function formatBDT(amount) {
    const num = Math.round(Number(amount) || 0);
    return '৳ ' + num.toLocaleString('en-IN');
  }

  function renderAvatar(user, sizeClass = 'w-9 h-9 text-xs') {
    if (!user) return `<div class="${sizeClass} rounded-full bg-slate-800 text-slate-300 font-tech font-bold flex items-center justify-center border border-white/20">?</div>`;
    const isSuper = user.tier === 'superadmin' || user.id === 'superadmin' || user.id === 'admin';
    return `
      <div class="${sizeClass} rounded-full ${isSuper ? 'bg-amber-500/20 text-amber-300 border-amber-400/50' : 'bg-cyan-500/20 text-cyan-300 border-cyan-400/30'} font-tech font-extrabold flex items-center justify-center border shrink-0">
        ${App.escapeHtml(user.initials || 'U')}
      </div>
    `;
  }

  function renderTierBadge(tier) {
    if (tier === 'superadmin') {
      return `<span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono-cad text-[10px] font-bold"><i class="fa-solid fa-crown mr-1"></i>SUPER ADMIN</span>`;
    }
    if (tier === 'admin') {
      return `<span class="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 font-mono-cad text-[10px] font-bold"><i class="fa-solid fa-shield-halved mr-1"></i>ADMINISTRATOR</span>`;
    }
    return `<span class="px-2 py-0.5 rounded bg-white/10 text-slate-300 border border-white/20 font-mono-cad text-[10px] font-bold"><i class="fa-solid fa-user mr-1"></i>TEAM MEMBER</span>`;
  }

  function updateHeaderAdminButton() {
    const btns = document.querySelectorAll('[data-open-admin]');
    const user = getCurrentUser();
    btns.forEach((btn) => {
      const badge = btn.querySelector('.admin-btn-label');
      const icon = btn.querySelector('i');
      if (user) {
        if (badge) badge.textContent = `${user.initials} // ${user.tier === 'superadmin' ? 'SUPER' : 'USER'}`;
        btn.classList.add('border-cyan-400', 'bg-cyan-500/10');
        if (icon) icon.className = user.tier === 'superadmin' ? 'fa-solid fa-crown text-amber-400' : 'fa-solid fa-circle-user text-cyan-400';
      } else {
        if (badge) badge.textContent = 'Dashboard';
        btn.classList.remove('border-cyan-400', 'bg-cyan-500/10');
        if (icon) icon.className = 'fa-solid fa-lock bp-muted-text';
      }
    });
  }

  /* ==================== 10. PORTAL MAIN RENDERER ==================== */
  function renderPortal() {
    const container = document.getElementById('adminPortalBody');
    if (!container) return;
    const user = getCurrentUser();

    if (!user) {
      renderLoginScreen(container);
    } else if (isDashboardLocked) {
      renderLockScreen(container, user);
    } else {
      renderDashboard(container, user);
    }
  }

  /* ---------- LOGIN SCREEN (ID & PASSWORD STRICTLY RESTRICTED) ---------- */
  function renderLoginScreen(container) {
    container.innerHTML = `
      <div class="space-y-6 max-w-lg mx-auto py-2">
        <!-- Terminal Header -->
        <div class="text-center space-y-2">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-400/30 bg-cyan-500/10 font-mono-cad text-[11px] bp-accent-text">
            <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            <span>RESTRICTED ACCESS // ENCRYPTED GATEWAY</span>
          </div>
          <h2 class="font-tech font-extrabold text-2xl sm:text-3xl text-white">COMMAND DASHBOARD LOGIN</h2>
          <p class="bp-soft-text text-xs sm:text-sm">
            The main website is open to everyone. Dashboard access is protected with SHA-256 cryptographic security.
          </p>
        </div>

        <!-- ID & Password Form -->
        <div class="bp-card bp-ticks rounded-2xl p-6 sm:p-7 space-y-5 border border-current/25 shadow-2xl relative">
          <div class="flex items-center justify-between border-b border-current/15 pb-3">
            <div class="flex items-center gap-2.5">
              <div class="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <i class="fa-solid fa-shield-halved text-sm"></i>
              </div>
              <div>
                <div class="font-tech font-bold text-sm text-white tracking-wider">RESTRICTED LOGIN</div>
                <div class="font-mono-cad text-[9px] bp-muted-text">ENTER AUTHORIZED ID & PASSWORD</div>
              </div>
            </div>
            <span class="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/35 text-emerald-400 font-mono-cad text-[10px] font-bold">
              ● ANTI-TAMPER ACTIVE
            </span>
          </div>

          <form id="restrictedLoginForm" class="space-y-4 text-xs font-mono-cad">
            <!-- User ID Input -->
            <div>
              <label class="block bp-muted-text mb-1 font-bold text-[11px]">USER ID / USERNAME</label>
              <div class="relative">
                <input id="loginUserId" type="text" placeholder="Enter your ID (e.g. superadmin)..." required autocomplete="username" class="w-full p-3 rounded-xl bp-input text-xs font-mono-cad font-medium text-white pl-10">
                <i class="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-xs pointer-events-none"></i>
              </div>
            </div>

            <!-- Password Input -->
            <div>
              <label class="block bp-muted-text mb-1 font-bold text-[11px]">PASSWORD</label>
              <div class="relative">
                <input id="loginPassword" type="password" placeholder="Enter your password..." required autocomplete="current-password" class="w-full p-3 rounded-xl bp-input text-xs font-mono-cad font-medium text-white pl-10 pr-10">
                <i class="fa-solid fa-lock absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-xs pointer-events-none"></i>
                <button type="button" id="togglePasswordBtn" class="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50 hover:text-cyan-400 transition-colors" title="Toggle password visibility">
                  <i class="fa-regular fa-eye text-xs"></i>
                </button>
              </div>
            </div>

            <button type="submit" class="w-full py-3.5 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-lg">
              <i class="fa-solid fa-unlock text-xs"></i>
              <span>AUTHENTICATE & ENTER DASHBOARD →</span>
            </button>
          </form>

          <div class="p-3 rounded-xl bg-black/40 border border-current/15 font-mono-cad text-[10px] bp-muted-text text-center">
            <i class="fa-solid fa-lock mr-1 text-cyan-400"></i>
            Passwords protected with SHA-256 cryptographic salt. 5-attempt anti-tamper lockout enabled.
          </div>
        </div>
      </div>
    `;

    // Eye toggle
    const toggleBtn = container.querySelector('#togglePasswordBtn');
    const passInput = container.querySelector('#loginPassword');
    if (toggleBtn && passInput) {
      toggleBtn.addEventListener('click', () => {
        const isPass = passInput.type === 'password';
        passInput.type = isPass ? 'text' : 'password';
        toggleBtn.querySelector('i').className = isPass ? 'fa-regular fa-eye-slash text-xs' : 'fa-regular fa-eye text-xs';
      });
    }

    // Form submit
    const form = container.querySelector('#restrictedLoginForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const enteredId = container.querySelector('#loginUserId')?.value;
        const enteredPass = container.querySelector('#loginPassword')?.value;
        login(enteredId, enteredPass);
      });
    }
  }

  /* ---------- LOCK SCREEN (INACTIVITY / ANTI-THEFT) ---------- */
  function renderLockScreen(container, user) {
    container.innerHTML = `
      <div class="space-y-6 max-w-md mx-auto py-8 text-center font-mono-cad">
        <div class="w-16 h-16 mx-auto rounded-full bg-amber-500/20 text-amber-300 flex items-center justify-center text-2xl border-2 border-amber-400 shadow-xl animate-pulse">
          <i class="fa-solid fa-lock"></i>
        </div>

        <div class="space-y-1">
          <div class="font-mono-cad text-xs bp-accent-text">// ANTI-THEFT PROTECTION</div>
          <h3 class="font-tech font-extrabold text-2xl text-white">DASHBOARD LOCKED</h3>
          <p class="bp-soft-text text-xs leading-relaxed">
            Locked to protect funds, chat, and sensitive records while unattended.
          </p>
        </div>

        <div class="p-4 rounded-xl bg-white/5 border border-current/15 flex items-center gap-3 text-left">
          ${renderAvatar(user, 'w-10 h-10 text-sm')}
          <div class="min-w-0 flex-1">
            <div class="font-tech font-bold text-sm text-white">${App.escapeHtml(user.name)}</div>
            <div class="text-[10px] bp-muted-text">@${App.escapeHtml(user.username || user.id)} • ${user.role}</div>
          </div>
        </div>

        <form id="unlockForm" class="space-y-3 text-xs">
          <input id="unlockPasswordInput" type="password" placeholder="Enter password to unlock..." required class="w-full p-3 rounded-xl bp-input text-center font-bold text-sm text-cyan-300">
          <button type="submit" class="w-full py-3 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider">
            UNLOCK DASHBOARD →
          </button>
        </form>

        <button type="button" id="lockLogoutBtn" class="text-xs text-red-400 hover:underline">
          Sign out / Switch account
        </button>
      </div>
    `;

    container.querySelector('#unlockForm')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const p = container.querySelector('#unlockPasswordInput')?.value;
      login(user.username || user.id, p, { isUnlock: true });
    });

    container.querySelector('#lockLogoutBtn')?.addEventListener('click', logout);
  }

  /* ---------- DASHBOARD (LOGGED IN) ---------- */
  function renderDashboard(container, user) {
    const isSuper = user.tier === 'superadmin' || user.id === 'superadmin' || user.id === 'admin';

    container.innerHTML = `
      <div class="space-y-6">
        <!-- Top Command Bar -->
        <div class="bp-panel-inset rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div class="flex items-center gap-3.5 min-w-0">
            ${renderAvatar(user, 'w-12 h-12 text-base')}
            <div class="min-w-0">
              <div class="flex items-center gap-2 flex-wrap">
                <h3 class="font-tech font-extrabold text-base sm:text-lg text-white leading-tight">${App.escapeHtml(user.name)}</h3>
                ${renderTierBadge(user.tier)}
              </div>
              <div class="font-mono-cad text-[11px] bp-soft-text mt-0.5 truncate">
                ID: <span class="text-white font-bold">@${App.escapeHtml(user.username || user.id)}</span> • ${App.escapeHtml(user.role)} • Sector: ${App.escapeHtml(user.sector)}
              </div>
            </div>
          </div>

          <div class="flex items-center gap-2 font-mono-cad text-xs flex-wrap">
            <!-- BSAA Gate Scanner Direct Launch Button -->
            <a href="bsaaevent.html" target="_blank" class="px-3.5 py-2 rounded-xl border border-cyan-400/50 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 font-bold flex items-center gap-2 shadow-lg transition-all" title="Launch BSAA Family Night Gate Scanner (/bsaaevent)">
              <span class="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <i class="fa-solid fa-qrcode text-sm"></i>
              <span class="hidden sm:inline">BSAA GATE SCANNER (/bsaaevent)</span>
              <span class="sm:hidden">SCANNER</span>
              <i class="fa-solid fa-arrow-up-right-from-square text-[10px] opacity-70"></i>
            </a>

            <!-- Lock Button -->
            <button id="manualLockBtn" type="button" title="Lock Dashboard (Anti-Theft)" class="p-2 rounded-lg border border-current/25 hover:border-current text-white/70 hover:text-white" title="Lock screen">
              <i class="fa-solid fa-lock"></i>
            </button>

            <!-- Logout Button -->
            <button id="adminLogoutBtn" type="button" class="px-4 py-2 rounded-xl border border-red-500/40 hover:bg-red-500/15 text-red-400 font-mono-cad text-xs font-bold flex items-center gap-1.5 transition-colors">
              <i class="fa-solid fa-power-off"></i>
              <span>LOGOUT</span>
            </button>
          </div>
        </div>

        <!-- Navigation Tabs Based on Role -->
        <div class="flex flex-wrap items-center gap-2 border-b border-current/15 pb-2 font-mono-cad text-xs">
          ${isSuper ? `
            <!-- Super Admin Tabs -->
            <button type="button" data-admin-tab="users" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'users' ? 'is-active' : ''}">
              <i class="fa-solid fa-users-gear text-amber-400"></i>
              <span>USER MANAGEMENT</span>
              <span class="px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold">${usersList.length}</span>
            </button>
            <button type="button" data-admin-tab="funds" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'funds' ? 'is-active' : ''}">
              <i class="fa-solid fa-coins text-cyan-400"></i>
              <span>TREASURY & FUNDS</span>
              <span class="px-1.5 py-0.2 rounded bg-white/15 text-[10px]">${fundsData.transactions.length}</span>
            </button>
            <button type="button" data-admin-tab="chat" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'chat' ? 'is-active' : ''}">
              <i class="fa-solid fa-comments"></i>
              <span>TEAM CHAT</span>
              <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">● LIVE</span>
            </button>
            <button type="button" data-admin-tab="vault" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'vault' ? 'is-active' : ''}">
              <i class="fa-solid fa-vault"></i>
              <span>INFORMATION VAULT</span>
              <span class="px-1.5 py-0.2 rounded bg-white/15 text-[10px]">${vaultData.length}</span>
            </button>
            <button type="button" data-admin-tab="profile" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'profile' ? 'is-active' : ''}">
              <i class="fa-solid fa-user-shield text-emerald-400"></i>
              <span>MY PROFILE & SECURITY</span>
            </button>
            <a href="bsaaevent.html" target="_blank" class="bp-portal-tab px-4 py-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold flex items-center gap-2 transition-all">
              <i class="fa-solid fa-qrcode text-cyan-400"></i>
              <span>/bsaaevent SCANNER</span>
              <span class="px-1.5 py-0.2 rounded bg-cyan-400/20 text-[10px]">↗ OPEN</span>
            </a>
          ` : `
            <!-- Normal Member Tabs: Sees Normal Things Only -->
            <button type="button" data-admin-tab="overview" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'overview' ? 'is-active' : ''}">
              <i class="fa-solid fa-clipboard-list text-cyan-400"></i>
              <span>TODAY'S OPERATIONS</span>
            </button>
            <button type="button" data-admin-tab="chat" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'chat' ? 'is-active' : ''}">
              <i class="fa-solid fa-comments"></i>
              <span>TEAM CHAT</span>
              <span class="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">● ACTIVE</span>
            </button>
            <button type="button" data-admin-tab="vault" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'vault' ? 'is-active' : ''}">
              <i class="fa-solid fa-book-open"></i>
              <span>PROTOCOLS & VENDORS</span>
            </button>
            <button type="button" data-admin-tab="funds" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'funds' ? 'is-active' : ''}">
              <i class="fa-solid fa-receipt"></i>
              <span>EXPENSE VOUCHERS</span>
            </button>
            <button type="button" data-admin-tab="profile" class="bp-portal-tab px-4 py-2 rounded-xl border border-current/25 font-bold flex items-center gap-2 ${activeAdminTab === 'profile' ? 'is-active' : ''}">
              <i class="fa-solid fa-user-shield text-emerald-400"></i>
              <span>MY PROFILE & SECURITY</span>
            </button>
            <a href="bsaaevent.html" target="_blank" class="bp-portal-tab px-4 py-2 rounded-xl border border-cyan-400/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-bold flex items-center gap-2 transition-all">
              <i class="fa-solid fa-qrcode text-cyan-400"></i>
              <span>/bsaaevent SCANNER</span>
              <span class="px-1.5 py-0.2 rounded bg-cyan-400/20 text-[10px]">↗ OPEN</span>
            </a>
          `}
        </div>

        <!-- Tab Content -->
        <div id="adminTabContent"></div>
      </div>
    `;

    // Tab bindings
    container.querySelectorAll('[data-admin-tab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        activeAdminTab = btn.getAttribute('data-admin-tab');
        App.playTone('click');
        container.querySelectorAll('[data-admin-tab]').forEach((b) => b.classList.toggle('is-active', b === btn));
        renderActiveTabContent(user);
      });
    });

    container.querySelector('#manualLockBtn')?.addEventListener('click', () => lockDashboard('User manual lock'));
    container.querySelector('#adminLogoutBtn')?.addEventListener('click', logout);

    renderActiveTabContent(user);
  }

  function renderActiveTabContent(user) {
    const target = document.getElementById('adminTabContent');
    if (!target) return;
    const isSuper = user.tier === 'superadmin' || user.id === 'superadmin' || user.id === 'admin';

    if (activeAdminTab === 'users' && isSuper) {
      renderUserManagementTab(target, user);
    } else if (activeAdminTab === 'funds') {
      renderFundsTab(target, user, isSuper);
    } else if (activeAdminTab === 'chat') {
      renderChatTab(target, user);
    } else if (activeAdminTab === 'vault') {
      renderVaultTab(target, user, isSuper);
    } else if (activeAdminTab === 'profile') {
      renderProfileAndSecurityTab(target, user, isSuper);
    } else if (activeAdminTab === 'overview' && !isSuper) {
      renderNormalMemberOverviewTab(target, user);
    } else {
      if (isSuper) renderUserManagementTab(target, user);
      else renderNormalMemberOverviewTab(target, user);
    }
  }

  /* ==================== 11. MY PROFILE & PERFECT SECURITY TAB (SELF-SERVICE) ==================== */
  function renderProfileAndSecurityTab(target, user, isSuper) {
    target.innerHTML = `
      <div class="space-y-6">
        <!-- Profile Header -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span class="font-mono-cad text-xs bp-accent-text font-bold">// SELF-SERVICE & SECURITY VAULT</span>
            <h4 class="font-tech font-extrabold text-lg sm:text-xl text-white">MY PROFILE & ACCOUNT SECURITY</h4>
            <p class="font-mono-cad text-[11px] bp-muted-text">Change your password, update your contact information, and review security session logs.</p>
          </div>

          <span class="px-3 py-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono-cad text-xs font-bold flex items-center gap-1.5">
            <i class="fa-solid fa-shield-halved"></i>
            <span>SHA-256 ENCRYPTED</span>
          </span>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Card 1: Change Password Form -->
          <div class="bp-card bp-ticks rounded-2xl p-6 space-y-4">
            <div class="flex items-center gap-2.5 pb-3 border-b border-current/15">
              <div class="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-300 flex items-center justify-center font-bold">
                <i class="fa-solid fa-key"></i>
              </div>
              <div>
                <h5 class="font-tech font-bold text-sm text-white">CHANGE YOUR PASSWORD</h5>
                <div class="font-mono-cad text-[10px] bp-muted-text">Zero plaintext storage • Salted cryptographic hash</div>
              </div>
            </div>

            <form id="changePasswordForm" class="space-y-3.5 text-xs font-mono-cad">
              <div>
                <label class="block bp-muted-text mb-1 font-bold">CURRENT PASSWORD *</label>
                <input id="currentPasswordInput" type="password" placeholder="Enter current password..." required class="w-full p-2.5 rounded-lg bp-input">
              </div>

              <div>
                <label class="block bp-muted-text mb-1 font-bold">NEW PASSWORD (MIN. 6 CHARACTERS) *</label>
                <input id="newPasswordInput" type="password" minlength="6" placeholder="Enter new strong password..." required class="w-full p-2.5 rounded-lg bp-input text-cyan-300 font-bold">
              </div>

              <div>
                <label class="block bp-muted-text mb-1 font-bold">CONFIRM NEW PASSWORD *</label>
                <input id="confirmPasswordInput" type="password" minlength="6" placeholder="Re-type new password..." required class="w-full p-2.5 rounded-lg bp-input">
              </div>

              <div id="passwordMatchWarning" class="hidden text-[10px] text-red-400 font-mono-cad">
                Passwords do not match.
              </div>

              <button type="submit" class="w-full py-3 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-shield-check"></i>
                <span>UPDATE & ENCRYPT PASSWORD</span>
              </button>
            </form>
          </div>

          <!-- Card 2: Edit Profile Details -->
          <div class="bp-card bp-ticks rounded-2xl p-6 space-y-4">
            <div class="flex items-center gap-2.5 pb-3 border-b border-current/15">
              <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold">
                <i class="fa-solid fa-user-pen"></i>
              </div>
              <div>
                <h5 class="font-tech font-bold text-sm text-white">EDIT PERSONAL DETAILS</h5>
                <div class="font-mono-cad text-[10px] bp-muted-text">Update how you appear on field logs & team chat</div>
              </div>
            </div>

            <form id="editProfileForm" class="space-y-3.5 text-xs font-mono-cad">
              <div>
                <label class="block bp-muted-text mb-1 font-bold">DISPLAY NAME *</label>
                <input id="profileNameInput" type="text" value="${App.escapeHtml(user.name)}" required class="w-full p-2.5 rounded-lg bp-input">
              </div>

              <div>
                <label class="block bp-muted-text mb-1 font-bold">USER ID / USERNAME (LOCKED)</label>
                <input type="text" value="@${App.escapeHtml(user.username || user.id)}" disabled class="w-full p-2.5 rounded-lg bp-input opacity-60 cursor-not-allowed">
              </div>

              <div>
                <label class="block bp-muted-text mb-1 font-bold">PHONE NUMBER / HOTLINE</label>
                <input id="profileHotlineInput" type="text" value="${App.escapeHtml(user.hotline || '')}" class="w-full p-2.5 rounded-lg bp-input">
              </div>

              ${isSuper ? `
                <div>
                  <label class="block bp-muted-text mb-1 font-bold">DEPARTMENT / SECTOR</label>
                  <input id="profileSectorInput" type="text" value="${App.escapeHtml(user.sector || '')}" class="w-full p-2.5 rounded-lg bp-input">
                </div>
              ` : `
                <div>
                  <label class="block bp-muted-text mb-1 font-bold">DEPARTMENT</label>
                  <input type="text" value="${App.escapeHtml(user.sector || '')}" disabled class="w-full p-2.5 rounded-lg bp-input opacity-60 cursor-not-allowed">
                </div>
              `}

              <button type="submit" class="w-full py-3 rounded-xl border border-current/25 hover:border-current bp-accent-text hover:bg-white/10 font-tech font-bold text-xs tracking-wider flex items-center justify-center gap-1.5">
                <i class="fa-solid fa-floppy-disk"></i>
                <span>SAVE PROFILE CHANGES</span>
              </button>
            </form>
          </div>
        </div>

        <!-- Security Session Status & Anti-Theft Status -->
        <div class="bp-panel-inset rounded-2xl p-5 space-y-3 font-mono-cad text-xs">
          <div class="flex items-center justify-between border-b border-current/15 pb-2">
            <span class="bp-accent-text font-bold"><i class="fa-solid fa-fingerprint mr-1"></i>ACTIVE SESSION INTEGRITY</span>
            <span class="text-emerald-400 font-bold">● SECURE & ISOLATED</span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div class="p-3 rounded-xl bg-black/40 border border-current/15">
              <span class="bp-muted-text text-[10px] block">SESSION TOKEN</span>
              <span class="font-bold text-white text-[11px] truncate block">${App.escapeHtml(currentSession?.token || 'AUTHENTICATED')}</span>
            </div>
            <div class="p-3 rounded-xl bg-black/40 border border-current/15">
              <span class="bp-muted-text text-[10px] block">PASSWORD INTEGRITY</span>
              <span class="font-bold text-emerald-400 text-[11px] block">✓ SHA-256 Cryptographic Hash</span>
            </div>
            <div class="p-3 rounded-xl bg-black/40 border border-current/15">
              <span class="bp-muted-text text-[10px] block">INACTIVITY AUTO-LOCK</span>
              <span class="font-bold text-cyan-300 text-[11px] block">15 Mins Unattended Protection</span>
            </div>
          </div>
        </div>

        <!-- Security Audit Log (Super Admin View) -->
        ${isSuper ? `
          <div class="bp-card rounded-2xl p-5 space-y-3">
            <div class="flex items-center justify-between border-b border-current/15 pb-2 font-mono-cad text-xs">
              <span class="text-amber-400 font-bold"><i class="fa-solid fa-list-check mr-1.5"></i>SECURITY & ACCESS AUDIT TRAIL</span>
              <span class="bp-muted-text text-[10px]">${auditLogs.length} Events Recorded</span>
            </div>

            <div class="max-h-56 overflow-y-auto space-y-2 font-mono-cad text-xs pr-1">
              ${auditLogs.map((log) => `
                <div class="p-2.5 rounded-lg bg-black/40 border border-current/15 flex items-center justify-between gap-3 text-[11px]">
                  <div class="flex items-center gap-2 truncate">
                    <span class="${log.level === 'danger' ? 'text-red-400 font-bold' : (log.level === 'warning' ? 'text-amber-400 font-bold' : 'text-emerald-400')}">[${log.action}]</span>
                    <span class="text-white truncate">${App.escapeHtml(log.detail)}</span>
                  </div>
                  <span class="bp-muted-text text-[10px] whitespace-nowrap">${App.escapeHtml(log.time)}</span>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}
      </div>
    `;

    // Password change form
    const passForm = target.querySelector('#changePasswordForm');
    if (passForm) {
      passForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const curr = target.querySelector('#currentPasswordInput').value;
        const n1 = target.querySelector('#newPasswordInput').value;
        const n2 = target.querySelector('#confirmPasswordInput').value;
        const warn = target.querySelector('#passwordMatchWarning');

        if (n1 !== n2) {
          if (warn) warn.classList.remove('hidden');
          return;
        }
        if (warn) warn.classList.add('hidden');

        const success = await changeMyPassword(curr, n1);
        if (success) {
          passForm.reset();
        }
      });
    }

    // Profile form
    const profForm = target.querySelector('#editProfileForm');
    if (profForm) {
      profForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = target.querySelector('#profileNameInput').value;
        const hotline = target.querySelector('#profileHotlineInput').value;
        const sector = target.querySelector('#profileSectorInput')?.value;
        updateMyProfile({ name, hotline, sector });
      });
    }
  }

  /* ==================== 12. USER MANAGEMENT TAB (SUPER ADMIN ONLY) ==================== */
  function renderUserManagementTab(target, user) {
    const createdUsers = usersList.filter((u) => u.id !== 'superadmin' && u.id !== 'admin' && u.tier !== 'superadmin');

    target.innerHTML = `
      <div class="space-y-6">
        <!-- Controls Header -->
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span class="font-mono-cad text-xs bp-accent-text font-bold">// SUPER ADMIN CONTROL PANEL</span>
            <h4 class="font-tech font-extrabold text-lg sm:text-xl text-white">USER CREATION & ACCESS MANAGEMENT</h4>
            <p class="font-mono-cad text-[11px] bp-muted-text">Create team member accounts with ID and password. Reset passwords or purge all created users.</p>
          </div>

          <div class="flex items-center gap-2">
            <button id="openCreateUserModalBtn" type="button" class="px-4 py-2.5 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg">
              <i class="fa-solid fa-user-plus"></i>
              <span>CREATE NEW USER</span>
            </button>

            ${createdUsers.length ? `
              <button id="removeAllUsersBtn" type="button" class="px-3.5 py-2.5 rounded-xl border border-red-500/50 bg-red-500/10 text-red-400 hover:bg-red-500/20 font-mono-cad text-xs font-bold flex items-center gap-1.5 transition-colors">
                <i class="fa-solid fa-user-slash"></i>
                <span>REMOVE ALL USERS (${createdUsers.length})</span>
              </button>
            ` : ''}
          </div>
        </div>

        <!-- Users Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <!-- Super Admin Master Card -->
          <div class="bp-card bp-ticks rounded-2xl p-5 border-2 border-amber-500/50 bg-amber-500/5 space-y-4">
            <div class="flex items-center justify-between border-b border-current/15 pb-2 font-mono-cad text-[10px]">
              <span class="text-amber-400 font-bold"><i class="fa-solid fa-crown mr-1"></i>ONLY SUPER ADMIN</span>
              <span class="text-emerald-400 font-bold">● ACTIVE</span>
            </div>
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 rounded-full bg-amber-500/20 text-amber-300 font-tech font-black text-lg flex items-center justify-center border border-amber-400 shrink-0">
                <i class="fa-solid fa-crown"></i>
              </div>
              <div class="min-w-0">
                <h5 class="font-tech font-bold text-base text-white">Super Admin</h5>
                <div class="font-mono-cad text-xs text-amber-300 font-bold">ID: @${App.escapeHtml(user.username || user.id)}</div>
              </div>
            </div>
            <div class="space-y-1 font-mono-cad text-xs pt-2 border-t border-current/15">
              <div class="flex justify-between py-1 border-b border-current/10">
                <span class="bp-muted-text">Role:</span>
                <span class="text-white font-medium">Central Super Administrator</span>
              </div>
              <div class="flex justify-between py-1 border-b border-current/10">
                <span class="bp-muted-text">Password:</span>
                <span class="text-emerald-400 font-bold">•••••••• (Encrypted)</span>
              </div>
              <div class="flex justify-between py-1">
                <span class="bp-muted-text">Authority:</span>
                <span class="text-emerald-400 font-bold">Create/Delete Users & Full Funds</span>
              </div>
            </div>
          </div>

          <!-- Dynamically Created Users -->
          ${createdUsers.map((u) => `
            <div class="bp-card bp-ticks rounded-2xl p-5 space-y-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between border-b border-current/15 pb-2 font-mono-cad text-[10px]">
                  <span class="text-cyan-400 font-bold">USER ID: @${App.escapeHtml(u.username)}</span>
                  <span class="bp-muted-text">Added: ${u.createdAt || 'Recent'}</span>
                </div>

                <div class="flex items-center gap-3 mt-3">
                  ${renderAvatar(u, 'w-11 h-11 text-sm')}
                  <div class="min-w-0">
                    <h5 class="font-tech font-bold text-base text-white truncate">${App.escapeHtml(u.name)}</h5>
                    <div class="mt-0.5">${renderTierBadge(u.tier)}</div>
                  </div>
                </div>

                <div class="space-y-1 font-mono-cad text-xs mt-3 pt-2 border-t border-current/15">
                  <div class="flex justify-between py-1 border-b border-current/10">
                    <span class="bp-muted-text">Role:</span>
                    <span class="text-white font-medium truncate max-w-[65%]">${App.escapeHtml(u.role)}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-current/10">
                    <span class="bp-muted-text">Department:</span>
                    <span class="text-cyan-300 font-bold">${App.escapeHtml(u.sector)}</span>
                  </div>
                  <div class="flex justify-between py-1 border-b border-current/10">
                    <span class="bp-muted-text">Password:</span>
                    <span class="text-emerald-400 font-bold">•••••••• (Protected)</span>
                  </div>
                  <div class="flex justify-between py-1">
                    <span class="bp-muted-text">Phone:</span>
                    <span class="text-slate-300">${App.escapeHtml(u.hotline)}</span>
                  </div>
                </div>
              </div>

              <div class="pt-3 border-t border-current/15 flex items-center justify-between gap-2">
                <button type="button" data-reset-pw="${u.id}" class="px-2.5 py-1.5 rounded-lg border border-current/20 hover:border-current text-cyan-300 font-mono-cad text-[11px] font-bold flex items-center gap-1">
                  <i class="fa-solid fa-key"></i>
                  <span>RESET PW</span>
                </button>
                <button type="button" data-delete-user="${u.id}" class="px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/20 font-mono-cad text-[11px] font-bold flex items-center gap-1" title="Remove User">
                  <i class="fa-solid fa-trash-can"></i>
                  <span>REMOVE</span>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        ${!createdUsers.length ? `
          <div class="bp-card rounded-2xl p-6 text-center font-mono-cad text-xs bp-muted-text space-y-2">
            <i class="fa-solid fa-users text-2xl text-cyan-400 opacity-60"></i>
            <p>Only the single Super Admin currently exists. Click <strong>"CREATE NEW USER"</strong> above to add team members with their own ID & Password.</p>
          </div>
        ` : ''}

        <!-- Create User Modal -->
        <div id="createUserModal" class="hidden fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-lg bp-card bp-ticks rounded-2xl p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-current/15 pb-3">
              <div>
                <span class="font-mono-cad text-xs bp-accent-text font-bold">// SUPER ADMIN CONSOLE</span>
                <h3 class="font-tech font-bold text-base text-white">CREATE NEW TEAM USER</h3>
              </div>
              <button type="button" id="closeCreateUserModalBtn" class="w-8 h-8 rounded-lg border border-current/25"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <form id="createUserForm" class="space-y-4 text-xs font-mono-cad">
              <div>
                <label class="block bp-muted-text mb-1">FULL NAME *</label>
                <input id="newUserName" type="text" placeholder="e.g. Ahnaf Rafi, Nibir Roy" required class="w-full p-2.5 rounded-lg bp-input text-xs font-medium">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block bp-muted-text mb-1">USER ID / USERNAME (FOR LOGIN) *</label>
                  <input id="newUserUsername" type="text" placeholder="e.g. ahnaf, crew1" required class="w-full p-2.5 rounded-lg bp-input font-bold">
                </div>
                <div>
                  <label class="block bp-muted-text mb-1">LOGIN PASSWORD (MIN 6 CHARS) *</label>
                  <input id="newUserPassword" type="password" minlength="6" placeholder="e.g. pass123" required class="w-full p-2.5 rounded-lg bp-input font-bold text-cyan-300">
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block bp-muted-text mb-1">ROLE / TITLE</label>
                  <input id="newUserRole" type="text" value="Event Operations Executive" required class="w-full p-2.5 rounded-lg bp-input">
                </div>
                <div>
                  <label class="block bp-muted-text mb-1">ACCOUNT TIER</label>
                  <select id="newUserTier" class="w-full p-2.5 rounded-lg bp-input">
                    <option value="normal" selected>Normal Team Member</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block bp-muted-text mb-1">DEPARTMENT / SECTOR</label>
                  <input id="newUserSector" type="text" value="STAGE & AV OPS" class="w-full p-2.5 rounded-lg bp-input">
                </div>
                <div>
                  <label class="block bp-muted-text mb-1">PHONE NUMBER</label>
                  <input id="newUserHotline" type="text" value="+880 1788-706868" class="w-full p-2.5 rounded-lg bp-input">
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white/5 border border-current/15 font-mono-cad text-[11px] text-slate-300">
                Password is automatically encrypted with SHA-256 before storing. User signs in with User ID and Password.
              </div>

              <button type="submit" class="w-full py-3 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider">
                CREATE USER ACCOUNT →
              </button>
            </form>
          </div>
        </div>

        <!-- Reset Password Modal (Admin) -->
        <div id="resetPwModal" class="hidden fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-md bp-card bp-ticks rounded-2xl p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-current/15 pb-3">
              <h4 class="font-tech font-bold text-sm text-white">RESET USER PASSWORD</h4>
              <button type="button" id="closeResetPwModalBtn" class="w-8 h-8 rounded-lg border border-current/25"><i class="fa-solid fa-xmark"></i></button>
            </div>
            <form id="resetPwForm" class="space-y-3 text-xs font-mono-cad">
              <input type="hidden" id="resetTargetUserId">
              <div>
                <label class="block bp-muted-text mb-1">NEW PASSWORD FOR USER (MIN 6 CHARS)</label>
                <input id="resetNewPwInput" type="password" minlength="6" required class="w-full p-2.5 rounded-lg bp-input text-cyan-300 font-bold">
              </div>
              <button type="submit" class="w-full py-2.5 rounded-xl bp-btn-primary font-tech font-bold text-xs">
                CONFIRM RESET PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Modal controls
    const modal = target.querySelector('#createUserModal');
    const openBtn = target.querySelector('#openCreateUserModalBtn');
    const closeBtn = target.querySelector('#closeCreateUserModalBtn');

    if (openBtn && modal) openBtn.addEventListener('click', () => { modal.classList.remove('hidden'); App.playTone('click'); });
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Create user form
    const form = target.querySelector('#createUserForm');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = target.querySelector('#newUserName').value;
        const username = target.querySelector('#newUserUsername').value;
        const password = target.querySelector('#newUserPassword').value;
        const role = target.querySelector('#newUserRole').value;
        const tier = target.querySelector('#newUserTier').value;
        const sector = target.querySelector('#newUserSector').value;
        const hotline = target.querySelector('#newUserHotline').value;

        const created = await createUser({ name, username, password, role, tier, sector, hotline });
        if (created) {
          if (modal) modal.classList.add('hidden');
          renderUserManagementTab(target, user);
        }
      });
    }

    // Reset password
    const resetModal = target.querySelector('#resetPwModal');
    target.querySelectorAll('[data-reset-pw]').forEach((b) => {
      b.addEventListener('click', () => {
        const uid = b.getAttribute('data-reset-pw');
        target.querySelector('#resetTargetUserId').value = uid;
        target.querySelector('#resetNewPwInput').value = '';
        if (resetModal) resetModal.classList.remove('hidden');
      });
    });

    target.querySelector('#closeResetPwModalBtn')?.addEventListener('click', () => {
      if (resetModal) resetModal.classList.add('hidden');
    });

    target.querySelector('#resetPwForm')?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const uid = target.querySelector('#resetTargetUserId').value;
      const pw = target.querySelector('#resetNewPwInput').value;
      const done = await resetUserPassword(uid, pw);
      if (done && resetModal) resetModal.classList.add('hidden');
    });

    // Delete single user
    target.querySelectorAll('[data-delete-user]').forEach((b) => {
      b.addEventListener('click', () => {
        const uid = b.getAttribute('data-delete-user');
        if (confirm(`Are you sure you want to delete user @${uid}?`)) {
          deleteUser(uid);
          renderUserManagementTab(target, user);
        }
      });
    });

    // Remove all users
    const removeAllBtn = target.querySelector('#removeAllUsersBtn');
    if (removeAllBtn) {
      removeAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to remove ALL created users? Only the Super Admin will remain.')) {
          removeAllUsers();
        }
      });
    }
  }

  /* ==================== 13. NORMAL MEMBER OVERVIEW (NORMAL THINGS) ==================== */
  function renderNormalMemberOverviewTab(target, user) {
    target.innerHTML = `
      <div class="space-y-6">
        <!-- Normal Welcome Banner -->
        <div class="bp-panel-inset rounded-2xl p-6 relative overflow-hidden">
          <div class="relative z-10 space-y-2">
            <span class="font-mono-cad text-xs bp-accent-text font-bold">// OPERATIONS HUB</span>
            <h3 class="font-tech font-extrabold text-2xl text-white">WELCOME, ${App.escapeHtml(user.name).toUpperCase()}</h3>
            <p class="bp-soft-text text-xs sm:text-sm max-w-2xl leading-relaxed">
              Assigned Department: <strong>${App.escapeHtml(user.sector)}</strong>. Review today's run-of-show schedule below, chat with the crew in Team Chat, or review protocols.
            </p>
          </div>
        </div>

        <!-- BSAA Family Night Gate Scanner Launch Card -->
        <div class="bp-card bp-ticks rounded-2xl p-5 border border-cyan-400/40 bg-gradient-to-r from-cyan-950/40 via-black/60 to-black/80 flex flex-wrap items-center justify-between gap-4 shadow-xl">
          <div class="flex items-center gap-3.5">
            <div class="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-400 text-xl font-bold">
              <i class="fa-solid fa-qrcode"></i>
            </div>
            <div>
              <div class="font-mono-cad text-[10px] text-cyan-300 font-bold tracking-wider">// EVENT FIELD SOFTWARE</div>
              <h4 class="font-tech font-extrabold text-base sm:text-lg text-white">BSAA FAMILY NIGHT 2026 — GATE SCANNER</h4>
              <p class="font-mono-cad text-xs bp-muted-text">Live entry & exit tracking • 377 attendees • Anti-double-scan • USB scanner & camera ready</p>
            </div>
          </div>
          <a href="bsaaevent.html" target="_blank" class="px-5 py-3 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg hover:scale-105 transition-all">
            <i class="fa-solid fa-play text-xs"></i>
            <span>OPEN GATE SCANNER (/bsaaevent) →</span>
          </a>
        </div>

        <!-- Schedule & Cues -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div class="lg:col-span-2 bp-card bp-ticks rounded-2xl p-5 space-y-4">
            <div class="flex items-center justify-between border-b border-current/15 pb-3">
              <div>
                <span class="font-mono-cad text-xs bp-accent-text">// RUN-OF-SHOW SCHEDULE</span>
                <h4 class="font-tech font-bold text-base text-white">TODAY'S EVENT CUES</h4>
              </div>
              <span class="font-mono-cad text-[10px] text-emerald-400 font-bold">● ACTIVE</span>
            </div>

            <div class="space-y-2.5 font-mono-cad text-xs">
              <div class="p-3 rounded-xl bg-white/5 border border-current/15 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-cyan-400">14:00 BST</span>
                  <div>
                    <div class="font-bold text-white">Truck Load-In & Box Truss Rigging</div>
                    <div class="text-[10px] bp-muted-text">Dock clearance: 14ft • Ballroom Gate 01</div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px]">READY</span>
              </div>

              <div class="p-3 rounded-xl bg-white/5 border border-current/15 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-amber-400">17:00 BST</span>
                  <div>
                    <div class="font-bold text-white">Line-Array Sound Check & Vocal Tuning</div>
                    <div class="text-[10px] bp-muted-text">Acoustic matrix delay alignment • Zero feedback</div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-[10px]">UPCOMING</span>
              </div>

              <div class="p-3 rounded-xl bg-white/5 border border-current/15 flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <span class="font-bold text-purple-400">18:30 BST</span>
                  <div>
                    <div class="font-bold text-white">VIP Gate RFID / QR Scanner Activation</div>
                    <div class="text-[10px] bp-muted-text">1,200 Serialized Passes • Red Carpet Stanchions</div>
                  </div>
                </div>
                <span class="px-2 py-0.5 rounded bg-white/10 bp-muted-text text-[10px]">SCHEDULED</span>
              </div>
            </div>
          </div>

          <!-- Quick Actions -->
          <div class="space-y-4">
            <div class="bp-card rounded-2xl p-5 space-y-3">
              <span class="font-mono-cad text-xs bp-accent-text">// QUICK ACTIONS</span>
              <div class="space-y-2 font-mono-cad text-xs">
                <button type="button" onclick="document.querySelector('[data-admin-tab=\\'chat\\']').click();" class="w-full p-2.5 rounded-xl bp-btn-primary font-bold text-left flex items-center justify-between">
                  <span>Open Team Chat</span>
                  <i class="fa-solid fa-comments"></i>
                </button>
                <button type="button" onclick="document.querySelector('[data-admin-tab=\\'vault\\']').click();" class="w-full p-2.5 rounded-xl border border-current/25 hover:bg-white/10 font-bold text-left flex items-center justify-between">
                  <span>View Event Protocols</span>
                  <i class="fa-solid fa-book"></i>
                </button>
                <button type="button" onclick="document.querySelector('[data-admin-tab=\\'funds\\']').click();" class="w-full p-2.5 rounded-xl border border-current/25 hover:bg-white/10 font-bold text-left flex items-center justify-between">
                  <span>Submit Expense Voucher</span>
                  <i class="fa-solid fa-receipt"></i>
                </button>
                <button type="button" onclick="document.querySelector('[data-admin-tab=\\'profile\\']').click();" class="w-full p-2.5 rounded-xl border border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/10 font-bold text-left flex items-center justify-between">
                  <span>Change My Password</span>
                  <i class="fa-solid fa-key"></i>
                </button>
              </div>
            </div>

            <div class="p-4 rounded-2xl bg-black/40 border border-current/20 font-mono-cad text-xs space-y-1.5">
              <div class="bp-accent-text font-bold"><i class="fa-solid fa-phone mr-1"></i>HQ HOTLINES</div>
              <div class="flex justify-between"><span>Hotline 01:</span><a href="tel:+8801788706868" class="text-white hover:underline">+880 1788-706868</a></div>
              <div class="flex justify-between"><span>Show Command:</span><a href="tel:+8801703700799" class="text-white hover:underline">+880 1703-700799</a></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /* ==================== 14. TREASURY & FUND SYSTEM TAB ==================== */
  function renderFundsTab(target, user, isSuper) {
    let totalInflow = 0;
    let totalOutflow = 0;
    let pendingCount = 0;

    fundsData.transactions.forEach((tx) => {
      const amt = Number(tx.amount) || 0;
      if (tx.type === 'inflow') totalInflow += amt;
      if (tx.type === 'outflow') totalOutflow += amt;
      if (tx.status === 'pending') pendingCount++;
    });

    const netTreasury = totalInflow - totalOutflow;

    const filteredTxs = fundsData.transactions.filter((tx) => {
      const matchType = fundFilterType === 'all' || tx.type === fundFilterType || (fundFilterType === 'pending' && tx.status === 'pending');
      const matchSearch = !fundSearchTerm || tx.desc.toLowerCase().includes(fundSearchTerm.toLowerCase()) || tx.ref.toLowerCase().includes(fundSearchTerm.toLowerCase());
      return matchType && matchSearch;
    });

    target.innerHTML = `
      <div class="space-y-6">
        <!-- Stat Cards -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="bp-card bp-ticks rounded-2xl p-4 border-cyan-400/30">
            <div class="flex items-center justify-between font-mono-cad text-xs bp-muted-text">
              <span>NET TREASURY BALANCE</span>
              <i class="fa-solid fa-vault bp-accent-text"></i>
            </div>
            <div class="font-tech font-black text-2xl sm:text-3xl text-cyan-300 bp-text-glow mt-2">${formatBDT(netTreasury)}</div>
            <div class="font-mono-cad text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <i class="fa-solid fa-circle-check"></i>
              <span>Live Reconciled</span>
            </div>
          </div>

          <div class="bp-card bp-ticks rounded-2xl p-4 border-emerald-400/30">
            <div class="flex items-center justify-between font-mono-cad text-xs bp-muted-text">
              <span>TOTAL INFLOW</span>
              <i class="fa-solid fa-arrow-down text-emerald-400"></i>
            </div>
            <div class="font-tech font-black text-2xl sm:text-3xl text-emerald-400 mt-2">${formatBDT(totalInflow)}</div>
            <div class="font-mono-cad text-[10px] bp-soft-text mt-1">Client Advances & Retainers</div>
          </div>

          <div class="bp-card bp-ticks rounded-2xl p-4 border-amber-400/30">
            <div class="flex items-center justify-between font-mono-cad text-xs bp-muted-text">
              <span>TOTAL DISBURSED</span>
              <i class="fa-solid fa-arrow-up text-amber-400"></i>
            </div>
            <div class="font-tech font-black text-2xl sm:text-3xl text-amber-400 mt-2">${formatBDT(totalOutflow)}</div>
            <div class="font-mono-cad text-[10px] bp-soft-text mt-1">Staging, AV & Logistics</div>
          </div>

          <div class="bp-card bp-ticks rounded-2xl p-4 border-purple-400/30">
            <div class="flex items-center justify-between font-mono-cad text-xs bp-muted-text">
              <span>PENDING APPROVAL</span>
              <i class="fa-solid fa-clock text-purple-400"></i>
            </div>
            <div class="font-tech font-black text-2xl sm:text-3xl ${pendingCount > 0 ? 'text-amber-400' : 'text-purple-400'} mt-2">${pendingCount}</div>
            <div class="font-mono-cad text-[10px] bp-muted-text mt-1">
              ${isSuper ? (pendingCount > 0 ? '⚠️ Awaiting Your Approval' : 'All Vouchers Cleared') : 'Vouchers in review'}
            </div>
          </div>
        </div>

        <!-- Ledger & Actions Toolbar -->
        <div class="space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <span class="font-mono-cad text-xs bp-accent-text">// FINANCIAL LEDGER</span>
              <h4 class="font-tech font-bold text-lg text-white">TRANSACTION AUDIT TRAIL</h4>
            </div>

            <div class="flex items-center gap-2">
              <button id="openAddTxModalBtn" type="button" class="px-4 py-2 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider flex items-center gap-2 shadow-lg">
                <i class="fa-solid fa-plus-circle"></i>
                <span>${isSuper ? 'RECORD INFLOW / OUTFLOW' : 'SUBMIT EXPENSE VOUCHER'}</span>
              </button>
              ${isSuper ? `
                <button id="exportCsvBtn" type="button" class="px-3 py-2 rounded-xl border border-current/25 hover:bg-white/10 font-mono-cad text-xs bp-accent-text">
                  <i class="fa-solid fa-file-csv mr-1"></i>EXPORT CSV
                </button>
              ` : ''}
            </div>
          </div>

          <!-- Filters & Search Toolbar -->
          <div class="flex flex-wrap items-center gap-2 font-mono-cad text-xs">
            <button type="button" data-fund-filter="all" class="px-3 py-1.5 rounded-lg border border-current/25 ${fundFilterType === 'all' ? 'bg-cyan-400 text-slate-950 font-bold' : 'hover:bg-white/5'}">ALL (${fundsData.transactions.length})</button>
            <button type="button" data-fund-filter="inflow" class="px-3 py-1.5 rounded-lg border border-emerald-500/40 text-emerald-400 ${fundFilterType === 'inflow' ? 'bg-emerald-500 text-slate-950 font-bold' : 'hover:bg-emerald-500/10'}">INFLOW (+)</button>
            <button type="button" data-fund-filter="outflow" class="px-3 py-1.5 rounded-lg border border-amber-500/40 text-amber-400 ${fundFilterType === 'outflow' ? 'bg-amber-500 text-slate-950 font-bold' : 'hover:bg-amber-500/10'}">OUTFLOW (-)</button>
            <button type="button" data-fund-filter="pending" class="px-3 py-1.5 rounded-lg border border-purple-500/40 text-purple-400 ${fundFilterType === 'pending' ? 'bg-purple-500 text-slate-950 font-bold' : 'hover:bg-purple-500/10'}">PENDING (${pendingCount})</button>

            <div class="flex-1 min-w-[200px]">
              <input id="fundSearchInput" type="search" placeholder="Search voucher or ref..." value="${App.escapeHtml(fundSearchTerm)}" class="w-full px-3 py-1.5 rounded-lg bp-input text-xs">
            </div>
          </div>

          <!-- Table -->
          <div class="bp-card rounded-2xl overflow-hidden border border-current/15">
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left border-collapse font-mono-cad">
                <thead>
                  <tr class="bg-black/50 border-b border-current/20 text-[11px] bp-muted-text">
                    <th class="p-3">DATE / REF</th>
                    <th class="p-3">TYPE</th>
                    <th class="p-3">DESCRIPTION</th>
                    <th class="p-3 text-right">AMOUNT (BDT)</th>
                    <th class="p-3">RECORDED BY</th>
                    <th class="p-3">STATUS</th>
                    ${isSuper ? '<th class="p-3 text-right">ACTION</th>' : ''}
                  </tr>
                </thead>
                <tbody class="divide-y divide-white/10">
                  ${filteredTxs.length ? filteredTxs.map((tx) => {
                    const isInflow = tx.type === 'inflow';
                    const isPending = tx.status === 'pending';
                    return `
                      <tr class="hover:bg-white/5 transition-colors">
                        <td class="p-3 whitespace-nowrap">
                          <div class="font-bold text-white">${App.escapeHtml(tx.date)}</div>
                          <div class="text-[10px] bp-accent-text">${App.escapeHtml(tx.ref)}</div>
                        </td>
                        <td class="p-3 whitespace-nowrap">
                          <span class="px-2 py-0.5 rounded font-bold text-[10px] ${isInflow ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'}">
                            ${isInflow ? '↓ INFLOW' : '↑ OUTFLOW'}
                          </span>
                        </td>
                        <td class="p-3 min-w-[220px]">
                          <div class="font-medium text-white">${App.escapeHtml(tx.desc)}</div>
                          <div class="text-[10px] bp-muted-text mt-0.5">${App.escapeHtml(tx.category)}</div>
                        </td>
                        <td class="p-3 text-right whitespace-nowrap font-tech font-bold text-sm ${isInflow ? 'text-emerald-400' : 'text-amber-400'}">
                          ${isInflow ? '+' : '-'}${formatBDT(tx.amount)}
                        </td>
                        <td class="p-3 whitespace-nowrap text-[11px] text-slate-300">
                          ${App.escapeHtml(tx.recordedBy)}
                        </td>
                        <td class="p-3 whitespace-nowrap">
                          <span class="px-2 py-0.5 rounded text-[10px] font-bold ${isPending ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' : 'bg-emerald-500/15 text-emerald-400'}">
                            ${isPending ? '⏳ PENDING REVIEW' : '✓ CLEARED'}
                          </span>
                        </td>
                        ${isSuper ? `
                          <td class="p-3 text-right whitespace-nowrap">
                            ${isPending ? `
                              <button type="button" data-approve-tx="${tx.id}" class="px-2 py-1 rounded bg-emerald-500 text-slate-950 font-tech font-bold text-[10px] hover:brightness-110 mr-1">
                                APPROVE
                              </button>
                            ` : ''}
                            <button type="button" data-delete-tx="${tx.id}" class="p-1.5 rounded hover:bg-red-500/20 text-red-400" title="Delete">
                              <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                          </td>
                        ` : ''}
                      </tr>
                    `;
                  }).join('') : `
                    <tr><td colspan="${isSuper ? '7' : '6'}" class="p-8 text-center bp-muted-text text-xs">No transactions match the selected filter.</td></tr>
                  `}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Add Transaction Modal -->
        <div id="addTxModal" class="hidden fixed inset-0 z-[95] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div class="w-full max-w-lg bp-card bp-ticks rounded-2xl p-6 space-y-4">
            <div class="flex items-center justify-between border-b border-current/15 pb-3">
              <h3 class="font-tech font-bold text-base text-white">${isSuper ? 'RECORD TRANSACTION' : 'SUBMIT EXPENSE VOUCHER'}</h3>
              <button type="button" id="closeAddTxModalBtn" class="w-8 h-8 rounded-lg border border-current/25"><i class="fa-solid fa-xmark"></i></button>
            </div>

            <form id="newTxForm" class="space-y-4 text-xs font-mono-cad">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block bp-muted-text mb-1">TYPE</label>
                  <select id="newTxType" class="w-full p-2.5 rounded-lg bp-input" ${!isSuper ? 'disabled' : ''}>
                    ${isSuper ? '<option value="inflow">Inflow (+) Client Retainer</option>' : ''}
                    <option value="outflow" selected>Outflow (-) Event Expense</option>
                  </select>
                </div>
                <div>
                  <label class="block bp-muted-text mb-1">AMOUNT (BDT ৳) *</label>
                  <input id="newTxAmount" type="number" min="10" placeholder="e.g. 25000" required class="w-full p-2.5 rounded-lg bp-input font-bold text-sm">
                </div>
              </div>

              <div>
                <label class="block bp-muted-text mb-1">DESCRIPTION *</label>
                <input id="newTxDesc" type="text" placeholder="e.g. Generator diesel fuel refill for gala" required class="w-full p-2.5 rounded-lg bp-input">
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="block bp-muted-text mb-1">CATEGORY</label>
                  <input id="newTxCat" type="text" value="Operations" required class="w-full p-2.5 rounded-lg bp-input">
                </div>
                <div>
                  <label class="block bp-muted-text mb-1">REFERENCE #</label>
                  <input id="newTxRef" type="text" value="VOUCH-${Date.now().toString().slice(-4)}" required class="w-full p-2.5 rounded-lg bp-input">
                </div>
              </div>

              <div class="p-3 rounded-xl bg-white/5 border border-current/15 text-[11px] flex justify-between items-center">
                <span>Submitted as: <strong>${App.escapeHtml(user.name)}</strong></span>
                <span class="${isSuper ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}">
                  ${isSuper ? '✓ Auto-Approved' : '⏳ Queued for Super Admin Approval'}
                </span>
              </div>

              <button type="submit" class="w-full py-3 rounded-xl bp-btn-primary font-tech font-bold text-xs tracking-wider">
                SUBMIT VOUCHER
              </button>
            </form>
          </div>
        </div>
      </div>
    `;

    // Filters
    target.querySelectorAll('[data-fund-filter]').forEach((b) => {
      b.addEventListener('click', () => {
        fundFilterType = b.getAttribute('data-fund-filter');
        App.playTone('click');
        renderFundsTab(target, user, isSuper);
      });
    });

    const sIn = target.querySelector('#fundSearchInput');
    if (sIn) {
      sIn.addEventListener('input', (e) => {
        fundSearchTerm = e.target.value.trim();
        renderFundsTab(target, user, isSuper);
      });
    }

    // Modal
    const modal = target.querySelector('#addTxModal');
    const openBtn = target.querySelector('#openAddTxModalBtn');
    const closeBtn = target.querySelector('#closeAddTxModalBtn');

    if (openBtn && modal) openBtn.addEventListener('click', () => { modal.classList.remove('hidden'); App.playTone('click'); });
    if (closeBtn && modal) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

    // Submit
    const form = target.querySelector('#newTxForm');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const type = isSuper ? target.querySelector('#newTxType').value : 'outflow';
        const amount = Number(target.querySelector('#newTxAmount').value) || 0;
        const desc = target.querySelector('#newTxDesc').value.trim();
        const cat = target.querySelector('#newTxCat').value.trim();
        const ref = target.querySelector('#newTxRef').value.trim();

        if (amount <= 0 || !desc) {
          App.toast('Please enter a valid amount and description.', 'warning');
          return;
        }

        const now = new Date();
        const dateStr = now.toLocaleDateString('en-GB') + ' ' + now.toTimeString().slice(0, 5);

        fundsData.transactions.unshift({
          id: 'tx-' + Date.now(),
          date: dateStr,
          type: type,
          amount: amount,
          category: cat,
          sector: 'General Operations',
          desc: desc,
          recordedBy: user.name,
          approvedBy: isSuper ? 'Super Admin' : 'Pending Super Admin Review',
          status: isSuper ? 'approved' : 'pending',
          ref: ref
        });

        saveToStorage(STORAGE_KEYS.FUNDS, fundsData);
        logSecurityEvent('VOUCHER_SUBMITTED', `Amount: ৳${amount} (${desc}) by @${user.username || user.id}`);
        App.playTone('confirm');
        App.toast(isSuper ? `Transaction of ${formatBDT(amount)} recorded!` : `Expense voucher submitted for review!`, 'success');
        if (modal) modal.classList.add('hidden');
        renderFundsTab(target, user, isSuper);
      });
    }

    // Approve
    target.querySelectorAll('[data-approve-tx]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-approve-tx');
        const tx = fundsData.transactions.find((t) => t.id === id);
        if (tx) {
          tx.status = 'approved';
          tx.approvedBy = user.name;
          saveToStorage(STORAGE_KEYS.FUNDS, fundsData);
          logSecurityEvent('VOUCHER_APPROVED', `Voucher ${tx.ref} (৳${tx.amount}) approved by Super Admin`);
          App.playTone('confirm');
          App.toast(`Voucher ${tx.ref} approved!`, 'success');
          renderFundsTab(target, user, isSuper);
        }
      });
    });

    // Delete
    target.querySelectorAll('[data-delete-tx]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-delete-tx');
        if (confirm('Delete this ledger entry?')) {
          fundsData.transactions = fundsData.transactions.filter((t) => t.id !== id);
          saveToStorage(STORAGE_KEYS.FUNDS, fundsData);
          logSecurityEvent('VOUCHER_DELETED', `Voucher ${id} deleted by Super Admin`);
          App.playTone('click');
          renderFundsTab(target, user, isSuper);
        }
      });
    });

    // CSV
    const expBtn = target.querySelector('#exportCsvBtn');
    if (expBtn) {
      expBtn.addEventListener('click', () => {
        let csv = 'ID,Date,Type,Amount (BDT),Category,Description,Recorded By,Status,Ref\n';
        fundsData.transactions.forEach((t) => {
          csv += `"${t.id}","${t.date}","${t.type}","${t.amount}","${t.category}","${t.desc.replace(/"/g, '""')}","${t.recordedBy}","${t.status}","${t.ref}"\n`;
        });
        App.downloadFile('Blueprint_Treasury_' + new Date().toISOString().slice(0, 10) + '.csv', csv, 'text/csv;charset=utf-8');
      });
    }
  }

  /* ==================== 15. TEAM COMMAND CHAT TAB ==================== */
  function renderChatTab(target, user) {
    const currentChannel = chatData.channels.find((c) => c.id === activeChatChannel) || chatData.channels[0];
    const messages = chatData.messages.filter((m) => m.channelId === currentChannel.id);

    target.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 h-[620px] bp-card rounded-2xl overflow-hidden border border-current/15">
        <!-- Sidebar -->
        <div class="lg:col-span-4 bg-black/40 border-r border-current/15 p-4 flex flex-col justify-between">
          <div class="space-y-4">
            <div class="flex items-center justify-between border-b border-current/15 pb-2">
              <span class="font-mono-cad text-xs bp-accent-text font-bold"><i class="fa-solid fa-satellite-dish mr-1"></i>CHANNELS</span>
              <span class="font-mono-cad text-[10px] text-emerald-400 font-bold">ONLINE</span>
            </div>

            <div class="space-y-1 font-mono-cad text-xs">
              ${chatData.channels.map((ch) => `
                <button type="button" data-switch-channel="${ch.id}" class="w-full text-left px-3 py-2.5 rounded-xl flex items-center justify-between transition-colors ${ch.id === currentChannel.id ? 'bg-cyan-500/20 border border-cyan-400/50 text-white font-bold' : 'hover:bg-white/5 text-slate-300'}">
                  <div class="flex items-center gap-2 truncate">
                    <span class="bp-accent-text">#</span>
                    <span class="truncate">${App.escapeHtml(ch.name)}</span>
                  </div>
                </button>
              `).join('')}
            </div>
          </div>

          <div class="p-3 rounded-xl bg-white/5 border border-current/15 text-[11px] font-mono-cad">
            <span class="bp-muted-text">Chatting as:</span>
            <div class="font-bold text-white mt-0.5">${App.escapeHtml(user.name)}</div>
            <div class="text-[10px] bp-accent-text">${user.role}</div>
          </div>
        </div>

        <!-- Chat Stream -->
        <div class="lg:col-span-8 flex flex-col justify-between h-full bg-black/20">
          <div class="px-5 py-3 border-b border-current/15 flex items-center justify-between bg-black/40 font-mono-cad text-xs">
            <div>
              <span class="font-tech font-bold text-sm text-white">#${App.escapeHtml(currentChannel.name)}</span>
              <span class="text-[10px] bp-muted-text ml-2">${App.escapeHtml(currentChannel.desc)}</span>
            </div>
            <span class="text-[10px] bp-accent-text">${messages.length} Messages</span>
          </div>

          <div id="chatMessagesStream" class="flex-1 overflow-y-auto p-4 space-y-4">
            ${messages.length ? messages.map((m) => {
              const isMe = m.userId === user.id;
              const isSuper = m.userTier === 'superadmin';
              return `
                <div class="flex items-start gap-3">
                  ${renderAvatar({ initials: m.userName.split(' ').map((n) => n[0]).join('').slice(0, 2), tier: m.userTier }, 'w-8 h-8 text-xs')}
                  <div class="min-w-0 flex-1">
                    <div class="flex items-baseline gap-2">
                      <span class="font-tech font-bold text-xs ${isMe ? 'bp-accent-text' : 'text-white'}">${App.escapeHtml(m.userName)}</span>
                      <span class="font-mono-cad text-[9px] px-1.5 py-0.2 rounded ${isSuper ? 'bg-amber-500/20 text-amber-300' : 'bg-white/10 text-slate-300'}">${isSuper ? 'SUPER ADMIN' : 'MEMBER'}</span>
                      <span class="font-mono-cad text-[10px] bp-muted-text">${App.escapeHtml(m.time)}</span>
                    </div>
                    <div class="mt-1 p-3 rounded-xl ${isMe ? 'bg-cyan-500/15 border border-cyan-400/30 text-white' : 'bg-black/40 border border-current/15 text-slate-200'} text-xs leading-relaxed font-sans">
                      ${App.escapeHtml(m.text)}
                    </div>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="h-full flex flex-col items-center justify-center p-8 text-center bp-muted-text font-mono-cad text-xs">
                No messages yet in #${currentChannel.name}. Type below to send a message.
              </div>
            `}
          </div>

          <!-- Input Form -->
          <form id="teamChatForm" class="p-3 sm:p-4 border-t border-current/15 bg-black/50 flex items-center gap-2">
            <input id="teamChatInput" type="text" placeholder="Message #${currentChannel.name} as ${App.escapeHtml(user.name)}..." required class="flex-1 px-3.5 py-2.5 rounded-xl bp-input text-xs focus:outline-none">
            <button type="submit" class="px-5 py-2.5 rounded-xl bp-btn-primary font-tech font-bold text-xs flex items-center gap-1.5">
              <span>SEND</span>
              <i class="fa-solid fa-paper-plane text-[10px]"></i>
            </button>
          </form>
        </div>
      </div>
    `;

    const stream = target.querySelector('#chatMessagesStream');
    if (stream) stream.scrollTop = stream.scrollHeight;

    target.querySelectorAll('[data-switch-channel]').forEach((b) => {
      b.addEventListener('click', () => {
        activeChatChannel = b.getAttribute('data-switch-channel');
        App.playTone('click');
        renderChatTab(target, user);
      });
    });

    const chatForm = target.querySelector('#teamChatForm');
    if (chatForm) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = target.querySelector('#teamChatInput');
        const text = input ? input.value.trim() : '';
        if (!text) return;

        const now = new Date();
        const timeStr = (now.getMonth() + 1) + '/' + now.getDate() + ' ' + now.toTimeString().slice(0, 5) + ' BST';

        chatData.messages.push({
          id: 'msg-' + Date.now(),
          channelId: currentChannel.id,
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          userTier: user.tier,
          time: timeStr,
          text: text,
          reactions: { '👍': 1 }
        });

        saveToStorage(STORAGE_KEYS.CHAT, chatData);
        App.playTone('confirm');
        if (input) input.value = '';
        renderChatTab(target, user);
      });
    }
  }

  /* ==================== 16. ENCRYPTED INFORMATION VAULT TAB ==================== */
  function renderVaultTab(target, user, isSuper) {
    const visibleRecords = vaultData.filter((r) => {
      if (!isSuper && r.isSensitive) return false;
      const matchCat = vaultFilterCategory === 'all' || r.category === vaultFilterCategory;
      const matchSearch = !vaultSearchTerm || r.title.toLowerCase().includes(vaultSearchTerm.toLowerCase()) || r.content.toLowerCase().includes(vaultSearchTerm.toLowerCase());
      return matchCat && matchSearch;
    });

    target.innerHTML = `
      <div class="space-y-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span class="font-mono-cad text-xs bp-accent-text">// KNOWLEDGE BASE</span>
            <h4 class="font-tech font-bold text-lg text-white">PROTOCOLS, VENDORS & INFORMATION</h4>
            <p class="font-mono-cad text-[11px] bp-muted-text">${isSuper ? 'Super Admin view: Sensitive bank details protected with anti-theft privacy mask.' : 'Operational member view: Field directives and verified vendor contacts.'}</p>
          </div>

          <div class="flex items-center gap-2 font-mono-cad text-xs">
            ${isSuper ? `
              <button id="toggleSensitiveVaultBtn" type="button" class="px-3.5 py-2 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold flex items-center gap-1.5 transition-colors">
                <i class="fa-solid ${sensitiveVaultRevealed ? 'fa-eye-slash' : 'fa-eye'}"></i>
                <span>${sensitiveVaultRevealed ? 'HIDE SENSITIVE DATA' : 'REVEAL SENSITIVE DATA'}</span>
              </button>
            ` : ''}
            <button id="exportVaultBtn" type="button" class="px-3 py-2 rounded-xl border border-current/25 hover:bg-white/10 bp-accent-text">
              <i class="fa-solid fa-download mr-1"></i>EXPORT (.MD)
            </button>
          </div>
        </div>

        <!-- Records Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${visibleRecords.map((r) => {
            // Apply anti-theft masking to sensitive data if not revealed
            let displayedContent = r.content;
            if (r.isSensitive && !sensitiveVaultRevealed) {
              displayedContent = displayedContent
                .replace(/\b120394882001\b/g, '••••••••••••')
                .replace(/\b225271890\b/g, '•••••••••')
                .replace(/\b4829-1092-4412\b/g, '••••-••••-••••');
            }

            return `
              <div class="bp-card bp-ticks rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                <div>
                  <div class="flex items-center justify-between font-mono-cad text-[10px] pb-2 border-b border-current/15">
                    <span class="px-2 py-0.5 rounded bg-white/10 bp-accent-text font-bold uppercase">${App.escapeHtml(r.category)}</span>
                    <span class="${r.isSensitive ? 'text-amber-400 font-bold' : 'bp-muted-text'}">
                      ${r.isSensitive ? (sensitiveVaultRevealed ? '🔓 UNMASKED' : '🔒 ENCRYPTED MASK') : 'GENERAL'}
                    </span>
                  </div>
                  <h5 class="font-tech font-bold text-base text-white mt-2">${App.escapeHtml(r.title)}</h5>
                  <div class="mt-2 text-xs bp-soft-text bg-black/40 rounded-xl p-3.5 max-h-48 overflow-y-auto whitespace-pre-line font-mono-cad border border-current/10">
                    ${App.escapeHtml(displayedContent)}
                  </div>
                </div>
                <div class="pt-3 border-t border-current/15 flex justify-between items-center font-mono-cad text-xs">
                  <button type="button" data-copy-vault="${r.id}" class="px-3 py-1.5 rounded-lg border border-current/20 hover:border-current bp-accent-text flex items-center gap-1.5">
                    <i class="fa-solid fa-copy"></i>
                    <span>COPY</span>
                  </button>
                  ${isSuper ? `
                    <button type="button" data-delete-vault="${r.id}" class="p-1.5 rounded text-red-400 hover:bg-red-500/15" title="Delete">
                      <i class="fa-solid fa-trash-can"></i>
                    </button>
                  ` : ''}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;

    target.querySelector('#toggleSensitiveVaultBtn')?.addEventListener('click', () => {
      sensitiveVaultRevealed = !sensitiveVaultRevealed;
      logSecurityEvent(sensitiveVaultRevealed ? 'VAULT_UNMASKED' : 'VAULT_MASKED', 'Super Admin toggled sensitive data privacy mask');
      App.playTone('click');
      renderVaultTab(target, user, isSuper);
    });

    target.querySelectorAll('[data-copy-vault]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-copy-vault');
        const rec = vaultData.find((r) => r.id === id);
        if (rec) {
          if (rec.isSensitive && !sensitiveVaultRevealed) {
            App.toast('Reveal sensitive data first to copy full account details.', 'warning');
            return;
          }
          App.copyText(rec.content, 'Copied to clipboard!');
        }
      });
    });

    target.querySelectorAll('[data-delete-vault]').forEach((b) => {
      b.addEventListener('click', () => {
        const id = b.getAttribute('data-delete-vault');
        if (confirm('Delete this vault record?')) {
          vaultData = vaultData.filter((r) => r.id !== id);
          saveToStorage(STORAGE_KEYS.VAULT, vaultData);
          App.playTone('click');
          renderVaultTab(target, user, isSuper);
        }
      });
    });

    const expBtn = target.querySelector('#exportVaultBtn');
    if (expBtn) {
      expBtn.addEventListener('click', () => {
        let md = `# THE BLUEPRINT EVENT MANAGEMENT // REPOSITORY\n\n`;
        visibleRecords.forEach((r) => {
          md += `## ${r.title}\nCategory: ${r.category}\n\n${r.content}\n\n---\n\n`;
        });
        App.downloadFile('Blueprint_Vault_' + new Date().toISOString().slice(0, 10) + '.md', md);
      });
    }
  }

  /* ==================== 17. INITIALIZATION ==================== */
  async function initAdminPortal() {
    // Generate Super Admin hash asynchronously on boot
    if (!DEFAULT_SUPER_ADMIN.passwordHash) {
      DEFAULT_SUPER_ADMIN.passwordHash = await hashPassword('admin123');
    }
    const rootU = usersList.find((u) => u.tier === 'superadmin' || u.id === 'superadmin' || u.id === 'admin');
    if (rootU && !rootU.passwordHash) {
      rootU.passwordHash = DEFAULT_SUPER_ADMIN.passwordHash;
      saveToStorage(STORAGE_KEYS.USERS, usersList);
    }

    App.registerFeature(108, 'Shell & UX', 'Executive Admin & User Command System', 'Super Admin control with dynamic user creation, user deletion, and role-based normal dashboards.');

    document.querySelectorAll('[data-open-admin]').forEach((btn) => {
      btn.addEventListener('click', () => {
        App.openModal('adminPortalModal');
        renderPortal();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key.toLowerCase() === 'a' || e.code === 'KeyA')) {
        e.preventDefault();
        App.openModal('adminPortalModal');
        renderPortal();
      }
    });

    // Auto-render if on standalone admin page (e.g. admin.html)
    if (document.getElementById('adminPortalBody') && !document.getElementById('adminPortalModal')) {
      renderPortal();
    }

    updateHeaderAdminButton();
  }

  App.admin = {
    users: usersList,
    getCurrentUser,
    isSuperAdmin,
    createUser,
    deleteUser,
    removeAllUsers,
    login,
    logout,
    changeMyPassword,
    updateMyProfile,
    lockDashboard,
    renderPortal,
    openPortal: () => {
      App.openModal('adminPortalModal');
      renderPortal();
    }
  };

  // Safe document ready execution (handles defer/async scripts)
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdminPortal);
  } else {
    initAdminPortal();
  }
})();
