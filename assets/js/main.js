/**
 * MAIN.JS - Centralized JavaScript for Promotional Products & Corporate Merchandise Supplier
 * Strictly handles:
 * - Branded Page Loader
 * - Pure #000000 Dark Mode with LocalStorage
 * - RTL/LTR Direction with LocalStorage
 * - Click-Only Home Dropdown (No Hover)
 * - Mobile Drawer & Accordion
 * - Mobile Menu Auto-close on Navigation
 * - Header Scroll States
 * - Scroll to Top
 * - Active Navigation Highlighting
 */

(function () {
  'use strict';

  // ==========================================
  // 1. THEME MANAGEMENT (PURE #000000 DARK MODE)
  // ==========================================
  const THEME_KEY = 'promomerch_theme';
  
  function initTheme() {
    const savedTheme = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    updateThemeToggleIcons();
  }

  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
    updateThemeToggleIcons();
  }

  function updateThemeToggleIcons() {
    const isDark = document.documentElement.classList.contains('dark');
    const toggles = document.querySelectorAll('.theme-toggle-btn');
    toggles.forEach(btn => {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
      const sunIcon = btn.querySelector('.icon-sun');
      const moonIcon = btn.querySelector('.icon-moon');
      if (sunIcon && moonIcon) {
        sunIcon.style.display = isDark ? 'block' : 'none';
        moonIcon.style.display = isDark ? 'none' : 'block';
      }
    });
  }

  // ==========================================
  // 2. RTL / LTR DIRECTION TOGGLE
  // ==========================================
  const DIR_KEY = 'promomerch_dir';

  function initDir() {
    const savedDir = localStorage.getItem(DIR_KEY) || 'ltr';
    document.documentElement.setAttribute('dir', savedDir);
    updateDirToggleButtons(savedDir);
  }

  function toggleDir() {
    const currentDir = document.documentElement.getAttribute('dir') || 'ltr';
    const newDir = currentDir === 'ltr' ? 'rtl' : 'ltr';
    document.documentElement.setAttribute('dir', newDir);
    localStorage.setItem(DIR_KEY, newDir);
    updateDirToggleButtons(newDir);
  }

  function updateDirToggleButtons(dir) {
    const rtlToggles = document.querySelectorAll('.rtl-toggle-btn');
    rtlToggles.forEach(btn => {
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to LTR' : 'Switch to RTL');
      const textSpan = btn.querySelector('.dir-label');
      if (textSpan) {
        textSpan.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      }
    });
  }

  // ==========================================
  // 3. BRANDED PAGE LOADER
  // ==========================================
  function initLoader() {
    const loader = document.getElementById('page-loader');
    if (!loader) return;

    const hideLoader = () => {
      loader.classList.add('loaded');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 450);
    };

    if (document.readyState === 'complete') {
      setTimeout(hideLoader, 200);
    } else {
      window.addEventListener('load', () => setTimeout(hideLoader, 250));
      // Fallback safeguard so loader never gets stuck
      setTimeout(hideLoader, 2500);
    }
  }

  // ==========================================
  // 4. DESKTOP HOME DROPDOWN (CLICK-ONLY, NEVER HOVER)
  // ==========================================
  function initDropdown() {
    const dropdownItem = document.querySelector('.nav-item.has-dropdown');
    const dropdownBtn = document.getElementById('home-dropdown-btn');

    if (!dropdownItem || !dropdownBtn) return;

    dropdownBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = dropdownItem.classList.toggle('dropdown-open');
      dropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownItem.contains(e.target)) {
        dropdownItem.classList.remove('dropdown-open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dropdownItem.classList.contains('dropdown-open')) {
        dropdownItem.classList.remove('dropdown-open');
        dropdownBtn.setAttribute('aria-expanded', 'false');
        dropdownBtn.focus();
      }
    });
  }

  // ==========================================
  // 5. MOBILE DRAWER NAVIGATION & ACCORDION
  // ==========================================
  function initMobileMenu() {
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('mobile-drawer-overlay');
    const closeBtn = document.getElementById('mobile-drawer-close');
    const accordionBtn = document.getElementById('mobile-home-accordion-btn');
    const accordionItem = document.getElementById('mobile-home-accordion-item');

    if (!drawer || !overlay) return;

    function openMenu() {
      // By default, home accordion is always closed until explicitly clicked
      if (accordionItem) {
        accordionItem.classList.remove('open');
        if (accordionBtn) accordionBtn.setAttribute('aria-expanded', 'false');
      }
      drawer.classList.add('active');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
      drawer.classList.remove('active');
      overlay.classList.remove('active');
      document.body.style.overflow = '';
      if (mobileBtn) mobileBtn.setAttribute('aria-expanded', 'false');
      // Reset accordion state to closed
      if (accordionItem) {
        accordionItem.classList.remove('open');
        if (accordionBtn) accordionBtn.setAttribute('aria-expanded', 'false');
      }
    }

    if (mobileBtn) mobileBtn.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    // Close menu when clicking ANY navigation item or link inside drawer
    const drawerLinks = drawer.querySelectorAll('a');
    drawerLinks.forEach(link => {
      link.addEventListener('click', () => {
        closeMenu();
      });
    });

    // Mobile Home Accordion toggle (Click only)
    if (accordionBtn && accordionItem) {
      accordionBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = accordionItem.classList.toggle('open');
        accordionBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });
    }

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('active')) {
        closeMenu();
      }
    });
  }

  // ==========================================
  // 6. HEADER SCROLL EFFECT & SCROLL-TO-TOP
  // ==========================================
  function initScrollEffects() {
    const header = document.getElementById('site-header');
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;

      if (header) {
        if (scrollY > 15) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }

      if (scrollTopBtn) {
        if (scrollY > 350) {
          scrollTopBtn.classList.add('visible');
        } else {
          scrollTopBtn.classList.remove('visible');
        }
      }
    }, { passive: true });

    if (scrollTopBtn) {
      scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      });
    }
  }

  // ==========================================
  // 7. ACTIVE NAVIGATION LINK DETECTION
  // ==========================================
  function initActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const allLinks = document.querySelectorAll('.nav-link, .dropdown-link, .mobile-nav-link, .mobile-sub-link');

    allLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (!href) return;
      const targetPage = href.split('/').pop();

      if (targetPage === currentPath || ((currentPath === '' || currentPath === 'index.html') && targetPage === 'index.html')) {
        link.classList.add('active');
        
        // If dropdown link is active, also highlight parent Home link
        const parentDropdown = link.closest('.nav-item.has-dropdown');
        if (parentDropdown) {
          const mainHomeLink = parentDropdown.querySelector('#home-dropdown-btn');
          if (mainHomeLink) mainHomeLink.classList.add('active');
        }

        // If mobile dropdown link is active, also highlight parent mobile Home button
        const mobileAccordionItem = link.closest('#mobile-home-accordion-item');
        if (mobileAccordionItem) {
          const mobileHomeBtn = mobileAccordionItem.querySelector('#mobile-home-accordion-btn');
          if (mobileHomeBtn) mobileHomeBtn.classList.add('active');
        }
      }
    });

    // Explicit check for Home 1 and Home 2 to guarantee both parent & child are highlighted
    if (currentPath === 'index.html' || currentPath === '') {
      const mobileHomeBtn = document.getElementById('mobile-home-accordion-btn');
      if (mobileHomeBtn) mobileHomeBtn.classList.add('active');
      const home1Link = document.querySelector('.mobile-sub-link[href="index.html"]');
      if (home1Link) home1Link.classList.add('active');
    } else if (currentPath === 'home-2.html') {
      const mobileHomeBtn = document.getElementById('mobile-home-accordion-btn');
      if (mobileHomeBtn) mobileHomeBtn.classList.add('active');
      const home2Link = document.querySelector('.mobile-sub-link[href="home-2.html"]');
      if (home2Link) home2Link.classList.add('active');
    }
  }

  // ==========================================
  // 8. INTERACTIVE QUOTATION FORM ENHANCEMENT
  // ==========================================
  function initQuoteForm() {
    const form = document.getElementById('corporate-quote-form');
    const fileInput = document.getElementById('artwork-file-input');
    const dropzone = document.getElementById('artwork-upload-zone');

    if (fileInput && dropzone) {
      fileInput.addEventListener('change', (e) => {
        if (fileInput.files && fileInput.files[0]) {
          const fileName = fileInput.files[0].name;
          const statusText = dropzone.querySelector('span');
          if (statusText) {
            statusText.textContent = 'Selected: ' + fileName;
            statusText.style.color = 'var(--color-accent)';
          }
        }
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
          const originalText = submitBtn.innerHTML;
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Processing Specification...</span>';
          
          setTimeout(() => {
            submitBtn.innerHTML = '<span>&#10003; Specification Received! Check Email in 2h</span>';
            submitBtn.style.backgroundColor = 'var(--color-primary-dark)';
            
            // Show alert box above form
            let feedback = form.querySelector('.quote-success-banner');
            if (!feedback) {
              feedback = document.createElement('div');
              feedback.className = 'quote-success-banner';
              feedback.style.cssText = 'background: rgba(16, 185, 129, 0.15); border: 1px solid var(--color-accent); color: var(--text-main); padding: 1rem 1.25rem; border-radius: 12px; margin-bottom: 1.5rem; font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; gap: 0.75rem;';
              feedback.innerHTML = '<span style="color: var(--color-accent); font-size: 1.2rem;">&#10004;</span> <span>Thank you! Your quote request #Q-8492 has been dispatched to our NY and London design labs. Expect your 3D digital proof within 2 hours.</span>';
              form.prepend(feedback);
            }
          }, 600);
        }
      });
    }
  }

  // ==========================================
  // 9. CLIENT PORTAL AUTH TABS
  // ==========================================
  function initAuthTabs() {
    const loginTabBtn = document.getElementById('tab-login-btn');
    const registerTabBtn = document.getElementById('tab-register-btn');
    const loginPanel = document.getElementById('auth-login-panel');
    const registerPanel = document.getElementById('auth-register-panel');

    if (loginTabBtn && registerTabBtn && loginPanel && registerPanel) {
      loginTabBtn.addEventListener('click', () => {
        loginTabBtn.classList.add('active');
        loginTabBtn.setAttribute('aria-selected', 'true');
        registerTabBtn.classList.remove('active');
        registerTabBtn.setAttribute('aria-selected', 'false');
        loginPanel.style.display = 'block';
        registerPanel.style.display = 'none';
      });

      registerTabBtn.addEventListener('click', () => {
        registerTabBtn.classList.add('active');
        registerTabBtn.setAttribute('aria-selected', 'true');
        loginTabBtn.classList.remove('active');
        loginTabBtn.setAttribute('aria-selected', 'false');
        registerPanel.style.display = 'block';
        loginPanel.style.display = 'none';
      });
    }

    const loginForm = document.getElementById('client-login-form');
    if (loginForm) {
      loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        if (submitBtn) {
          submitBtn.disabled = true;
          submitBtn.innerHTML = '<span>Verifying Credentials...</span>';
          setTimeout(() => {
            submitBtn.innerHTML = '<span>&#10003; Verified! Redirecting...</span>';
            setTimeout(() => {
              window.location.href = 'index.html';
            }, 500);
          }, 700);
        }
      });
    }
  }

  // ==========================================
  // DOM READY INITIALIZATION
  // ==========================================
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initDir();
    initLoader();
    initDropdown();
    initMobileMenu();
    initScrollEffects();
    initActiveNav();
    initQuoteForm();
    initAuthTabs();

    // Bind theme toggles
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleTheme);
    });

    // Bind RTL toggles
    document.querySelectorAll('.rtl-toggle-btn').forEach(btn => {
      btn.addEventListener('click', toggleDir);
    });
  });

})();
