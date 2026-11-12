/* ==========================================================================
   10-WEB-APP // PROGRESSIVE WEB APP (PWA) CONTROLLER, SERVICE WORKER SYNC,
                 STANDALONE APP SHELL, INSTALL PROMPT & DEEP LINK ROUTER
   The Blueprint Event Management — Khulna, Bangladesh
   ========================================================================== */

(function () {
  'use strict';
  const App = window.BlueprintApp;
  if (!App) return;

  let deferredPrompt = null;
  let isStandalone = window.matchMedia('(display-mode: standalone)').matches || !!window.navigator.standalone;

  /* ==================== 1. SERVICE WORKER REGISTRATION ==================== */
  function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          // Check for worker updates
          reg.addEventListener('updatefound', () => {
            const newWorker = reg.installing;
            if (!newWorker) return;
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                App.toast('New Web App update available. Reloading cache...', 'info', 'PWA ENGINE');
              }
            });
          });
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });

    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }

  /* ==================== 2. PWA INSTALL PROMPT MANAGEMENT ==================== */
  function initInstallPrompts() {
    const installBtns = document.querySelectorAll('#pwaInstallAppBtn, #pwaMobileInstallBtn, #pwaModalInstallBtn, [data-pwa-install]');
    const statusBadges = document.querySelectorAll('#pwaStatusBadge');

    function updateInstallUI(available) {
      installBtns.forEach((btn) => {
        if (isStandalone) {
          btn.classList.add('hidden');
        } else if (available) {
          btn.classList.remove('hidden');
        }
      });

      statusBadges.forEach((badge) => {
        if (isStandalone) {
          badge.textContent = 'STANDALONE APP';
          badge.className = 'text-cyan-400 font-bold';
        } else if (available) {
          badge.textContent = 'READY TO INSTALL';
          badge.className = 'text-emerald-400 font-bold';
        } else {
          badge.textContent = 'WEB BROWSER';
          badge.className = 'bp-muted-text';
        }
      });
    }

    if (isStandalone) {
      document.documentElement.classList.add('is-pwa-standalone');
      updateInstallUI(false);
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
      updateInstallUI(true);
    });

    window.addEventListener('appinstalled', () => {
      deferredPrompt = null;
      isStandalone = true;
      document.documentElement.classList.add('is-pwa-standalone');
      updateInstallUI(false);
      App.playTone('confirm');
      App.toast('The Blueprint Web App successfully installed!', 'success', 'PWA INSTALLED');
    });

    installBtns.forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          const { outcome } = await deferredPrompt.userChoice;
          if (outcome === 'accepted') {
            App.playTone('confirm');
            App.toast('Installing The Blueprint Web App...', 'info');
          }
          deferredPrompt = null;
          updateInstallUI(false);
        } else {
          // Guidance for iOS or browsers that don't support beforeinstallprompt
          App.toast('To install: tap your browser menu or Share icon, then select "Add to Home Screen".', 'info', 'INSTALL APP');
        }
      });
    });
  }

  /* ==================== 3. DEEP-LINK URL ROUTER ==================== */
  function handleUrlDeepLinks() {
    try {
      const params = new URLSearchParams(window.location.search);
      const action = params.get('open');
      if (!action) return;

      setTimeout(() => {
        if (action === 'admin') {
          if (App.admin) App.admin.openPortal();
        } else if (action === 'funds') {
          if (App.admin) {
            App.admin.openPortal();
            const btn = document.querySelector('[data-admin-tab="funds"]');
            if (btn) btn.click();
          }
        } else if (action === 'chat') {
          if (App.admin) {
            App.admin.openPortal();
            const btn = document.querySelector('[data-admin-tab="chat"]');
            if (btn) btn.click();
          }
        } else if (action === 'vault') {
          if (App.admin) {
            App.admin.openPortal();
            const btn = document.querySelector('[data-admin-tab="vault"]');
            if (btn) btn.click();
          }
        } else if (action === 'lab') {
          document.getElementById('blueprint-lab')?.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'hotlines') {
          document.getElementById('comms')?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 400);
    } catch (_) {}
  }

  /* ==================== 4. INITIALIZATION ==================== */
  function initWebApp() {
    registerServiceWorker();
    initInstallPrompts();
    handleUrlDeepLinks();

    // Register features
    App.registerFeature(112, 'Shell & UX', 'Progressive Web App (PWA) Engine', 'Service worker offline caching, manifest shortcuts, and install-to-homescreen.');
    App.registerFeature(113, 'Shell & UX', 'Standalone Executive Web App Route', 'Dedicated fullscreen admin app (/admin.html) with standalone window controls.');

    const totalCount = document.getElementById('featuresTotalCount');
    if (totalCount) totalCount.textContent = String(App.features.length);
  }

  App.pwa = {
    isStandalone: () => isStandalone,
    promptInstall: () => {
      const btn = document.getElementById('pwaInstallAppBtn');
      if (btn) btn.click();
    }
  };

  document.addEventListener('DOMContentLoaded', initWebApp);
})();
