// Charles Dwayne Viray - Developer Portfolio Scripts
// Holy Angel University | Web Development (Phase 2 - Finals)
// Formspree live mailer integration & interactive Scroll-Spy navigation wired

document.addEventListener('DOMContentLoaded', () => {
  // Brand watermark in dev console
  console.log(
    '%c Charles Viray %c AI & Software Engineer ',
    'background:#2B2A30;color:#EDB843;font-weight:bold;padding:2px 4px;',
    'background:#BA423C;color:#FBF7F0;padding:2px 4px;'
  );

  // Dynamic copyright year in footer
  const yearLabels = document.querySelectorAll('[data-year]');
  const thisYear = new Date().getFullYear();
  yearLabels.forEach(label => {
    label.textContent = thisYear;
  });

  // Mobile navigation drawer toggle
  const navToggleBtn = document.querySelector('.nav-toggle');
  const siteNav = document.getElementById('site-nav');
  const siteHeader = document.querySelector('.site-header');

  if (navToggleBtn && siteNav) {
    function toggleNavMenu() {
      const isExpanded = navToggleBtn.getAttribute('aria-expanded') === 'true';
      const willOpen = !isExpanded;

      navToggleBtn.setAttribute('aria-expanded', willOpen);
      siteNav.classList.toggle('is-open', willOpen);
      if (siteHeader) {
        siteHeader.classList.toggle('is-menu-open', willOpen);
      }
      document.body.classList.toggle('no-scroll', willOpen);
    }

    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleNavMenu();
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && siteNav.classList.contains('is-open')) {
        toggleNavMenu();
        navToggleBtn.focus();
      }
    });

    // Close if user resizes back to desktop breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 1024 && siteNav.classList.contains('is-open')) {
        navToggleBtn.setAttribute('aria-expanded', 'false');
        siteNav.classList.remove('is-open');
        if (siteHeader) siteHeader.classList.remove('is-menu-open');
        document.body.classList.remove('no-scroll');
      }
    });
  }

  // Projects filtering & instant search (Works / Projects Page)
  const projectGrid = document.querySelector('[data-project-grid]');
  const filterPills = document.querySelectorAll('[data-filter]');
  const searchBar = document.getElementById('project-search');
  const resultsCounter = document.querySelector('[data-results-count]');
  const noMatchNotice = document.querySelector('[data-empty-state]');

  if (projectGrid) {
    const projectCards = Array.from(projectGrid.querySelectorAll('[data-category]'));
    let currentCategory = 'all';

    function runProjectFilter() {
      const query = searchBar ? searchBar.value.trim().toLowerCase() : '';
      let matchesFound = 0;

      for (let i = 0; i < projectCards.length; i++) {
        const item = projectCards[i];
        const itemCats = item.dataset.category ? item.dataset.category.toLowerCase().split(' ') : [];
        const itemContent = item.innerText ? item.innerText.toLowerCase() : '';

        const categoryMatches = (currentCategory === 'all') || itemCats.includes(currentCategory);
        const searchMatches = !query || itemContent.includes(query);

        if (categoryMatches && searchMatches) {
          item.hidden = false;
          matchesFound++;
        } else {
          item.hidden = true;
        }
      }

      if (resultsCounter) {
        resultsCounter.textContent = matchesFound;
      }
      if (noMatchNotice) {
        noMatchNotice.hidden = (matchesFound > 0);
      }
    }

    filterPills.forEach(btn => {
      btn.addEventListener('click', function () {
        filterPills.forEach(b => b.setAttribute('aria-pressed', 'false'));
        this.setAttribute('aria-pressed', 'true');
        currentCategory = this.dataset.filter || 'all';
        runProjectFilter();
      });
    });

    if (searchBar) {
      searchBar.addEventListener('input', runProjectFilter);
    }
  }

  // Contact form submission with Formspree live endpoint
  const contactForm = document.querySelector('[data-contact-form]');
  const sentDialog = document.getElementById('sent-dialog');

  if (contactForm && sentDialog) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic client check
      const nameInput = contactForm.querySelector('#name');
      const emailInput = contactForm.querySelector('#email');
      const submitBtn = contactForm.querySelector('button[type="submit"]');

      if (!nameInput?.value.trim() || !emailInput?.value.trim()) {
        alert('Please fill out your name and email address.');
        return;
      }

      // UI loading state
      const originalBtnText = submitBtn ? submitBtn.textContent : 'Send message →';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending message...';
      }

      try {
        const formData = new FormData(contactForm);
        const endpoint = contactForm.action && contactForm.action !== '#'
          ? contactForm.action
          : 'https://formspree.io/f/xeaedjpy';

        const response = await fetch(endpoint, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          // Show confirmation dialog
          if (typeof sentDialog.showModal === 'function') {
            sentDialog.showModal();
          } else {
            alert('Thanks! Message received.');
          }
          contactForm.reset();
        } else {
          const result = await response.json().catch(() => null);
          const errorMsg = result?.errors?.map(err => err.message).join('\n') ||
            'Oops! There was a problem submitting your message. Please try again.';
          alert(errorMsg);
        }
      } catch (err) {
        alert('A network error occurred. Please try again or email viraycharlesdwayne@gmail.com directly.');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });

    const closeBtns = sentDialog.querySelectorAll('[data-close-dialog]');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        sentDialog.close();
      });
    });

    // Close when clicking outside the modal backdrop
    sentDialog.addEventListener('click', (e) => {
      const rect = sentDialog.getBoundingClientRect();
      const inDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!inDialog) {
        sentDialog.close();
      }
    });
  }

  // Interactive Scroll-Spy navigation (Case Study Table of Contents)
  const caseToc = document.querySelector('.case-toc');
  if (caseToc) {
    const tocLinks = Array.from(caseToc.querySelectorAll('a[href^="#"]'));
    const sections = tocLinks
      .map(link => document.querySelector(link.getAttribute('href')))
      .filter(Boolean);

    if (sections.length > 0) {
      let isClickScrolling = false;
      let clickTimeout = null;
      let currentActiveId = null;

      function setActiveLink(activeSection) {
        const nextId = activeSection ? activeSection.id : null;
        if (nextId === currentActiveId) return;
        currentActiveId = nextId;

        const tocList = caseToc.querySelector('ol');
        tocLinks.forEach(link => {
          const targetId = link.getAttribute('href').slice(1);
          if (nextId && targetId === nextId) {
            link.setAttribute('aria-current', 'true');
            // Safely scroll only the mobile <ol> container horizontally, NEVER the window
            if (tocList && window.innerWidth <= 1024) {
              const linkLeft = link.offsetLeft;
              const linkWidth = link.offsetWidth;
              const listWidth = tocList.offsetWidth;
              tocList.scrollTo({
                left: linkLeft - (listWidth / 2) + (linkWidth / 2),
                behavior: 'smooth'
              });
            }
          } else {
            link.removeAttribute('aria-current');
          }
        });
      }

      function updateActiveToc() {
        if (isClickScrolling) return;

        // Reading line threshold: ~25% down the viewport
        const threshold = Math.max(120, Math.min(240, window.innerHeight * 0.25));

        // 1. If scrolled up into the hero/header above the case sections, remove active state
        if (sections[0].getBoundingClientRect().top > threshold + 50) {
          setActiveLink(null);
          return;
        }

        // 2. If near the bottom of the document, activate the last section
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
          setActiveLink(sections[sections.length - 1]);
          return;
        }

        // 3. Find the section that spans across the reading line
        let activeSection = null;
        for (let i = 0; i < sections.length; i++) {
          const rect = sections[i].getBoundingClientRect();
          if (rect.top <= threshold && rect.bottom > threshold) {
            activeSection = sections[i];
            break;
          }
        }

        // 4. Fallback: last section that scrolled past threshold
        if (!activeSection) {
          for (let i = sections.length - 1; i >= 0; i--) {
            if (sections[i].getBoundingClientRect().top <= threshold) {
              activeSection = sections[i];
              break;
            }
          }
        }

        setActiveLink(activeSection);
      }

      // Smooth scroll on click and update active state immediately
      tocLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          const targetId = link.getAttribute('href').slice(1);
          const targetSection = document.getElementById(targetId);

          if (targetSection) {
            e.preventDefault();
            isClickScrolling = true;
            clearTimeout(clickTimeout);

            setActiveLink(targetSection);

            targetSection.scrollIntoView({ behavior: 'smooth' });

            if (history.pushState) {
              history.pushState(null, '', `#${targetId}`);
            }

            clickTimeout = setTimeout(() => {
              isClickScrolling = false;
            }, 800);
          }
        });
      });

      // Passive throttled scroll handler
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateActiveToc();
            ticking = false;
          });
          ticking = true;
        }
      }, { passive: true });

      // Run on initial page load
      updateActiveToc();
    }
  }

  // Certificate hover live preview
  const certLinks = document.querySelectorAll('.cert-list a[href$=".pdf"]');
  if (certLinks.length > 0) {
    const previewCard = document.createElement('div');
    previewCard.className = 'cert-preview-card';
    previewCard.setAttribute('aria-hidden', 'true');
    previewCard.innerHTML = `
      <div class="cert-preview-card__header">
        <span>Verified Credential</span>
        <span>PDF Preview</span>
      </div>
      <img class="cert-preview-card__img" src="" alt="Certificate thumbnail" loading="eager">
      <div class="cert-preview-card__footer">
        <span class="preview-title">Certificate</span>
        <span>Click to open ↗</span>
      </div>
    `;
    document.body.appendChild(previewCard);

    const previewImg = previewCard.querySelector('.cert-preview-card__img');
    const previewTitle = previewCard.querySelector('.preview-title');

    function positionPreview(clientX, clientY) {
      const cardWidth = 350;
      const cardHeight = 240;
      const padding = 16;

      let left = clientX + 20;
      let top = clientY - 40;

      // Flip left if overflowing right edge
      if (left + cardWidth > window.innerWidth - padding) {
        left = clientX - cardWidth - 20;
      }
      if (left < padding) left = padding;

      // Flip up if overflowing bottom edge
      if (top + cardHeight > window.innerHeight - padding) {
        top = window.innerHeight - cardHeight - padding;
      }
      if (top < padding) top = padding;

      previewCard.style.left = `${left}px`;
      previewCard.style.top = `${top}px`;
    }

    certLinks.forEach(link => {
      link.setAttribute('target', '_blank');
      link.setAttribute('rel', 'noopener');

      const href = link.getAttribute('href');
      const thumbUrl = href
        .replace(/\.pdf$/i, '.png')
        .replace('assets/certificates/', 'assets/certificates/thumbs/');
      const certName = link.textContent.trim().replace(/\s*PDF\s*↗?$/i, '');

      link.addEventListener('mouseenter', (e) => {
        previewImg.src = thumbUrl;
        previewTitle.textContent = certName;
        positionPreview(e.clientX, e.clientY);
        previewCard.classList.add('is-visible');
      });

      link.addEventListener('mousemove', (e) => {
        positionPreview(e.clientX, e.clientY);
      });

      link.addEventListener('mouseleave', () => {
        previewCard.classList.remove('is-visible');
      });

      link.addEventListener('focus', () => {
        const rect = link.getBoundingClientRect();
        previewImg.src = thumbUrl;
        previewTitle.textContent = certName;
        positionPreview(rect.right, rect.top);
        previewCard.classList.add('is-visible');
      });

      link.addEventListener('blur', () => {
        previewCard.classList.remove('is-visible');
      });
    });
  }

  // 1. Interactive Retro PC CRT terminal boot on hero illustration
  function initRetroPc() {
    const pcContainer = document.getElementById('retro-pc');
    if (!pcContainer) return;

    const screenBody = pcContainer.querySelector('.retro-pc__body');
    const screenPrompt = pcContainer.querySelector('.retro-pc__prompt');
    if (!screenBody) return;

    const bootSequences = [
      [
        'C:\\CHARUSUI> run portfolio.exe',
        'Loading models... OK!',
        'Segments ready. Welcome!'
      ],
      [
        'C:\\CHARUSUI> status --gdg',
        'Role: AI/ML Lead @ GDG',
        'Awards: 5x Hackathons Won',
        'Status: All systems GO!'
      ],
      [
        'C:\\CHARUSUI> cat bio.txt',
        'Building smart apps & ML.',
        'BS Computer Science'
      ]
    ];

    let sequenceIndex = 0;
    let isTyping = false;
    let typeTimeout = null;

    function runBoot() {
      if (isTyping) return;
      isTyping = true;

      if (screenPrompt) screenPrompt.textContent = '► BOOTING... ◄';

      const sequence = bootSequences[sequenceIndex % bootSequences.length];
      sequenceIndex++;

      const fullText = sequence.join('\n');
      screenBody.textContent = '';

      let charIndex = 0;

      function typeNextChar() {
        if (charIndex < fullText.length) {
          screenBody.textContent += fullText.charAt(charIndex);
          charIndex++;

          // Typewriter pacing with slight pause after newlines
          const isNewline = fullText.charAt(charIndex - 1) === '\n';
          const delay = isNewline ? 160 : 22;

          typeTimeout = setTimeout(typeNextChar, delay);
        } else {
          isTyping = false;
          if (screenPrompt) screenPrompt.textContent = '► CLICK SCREEN TO RE-RUN ◄';
        }
      }

      typeNextChar();
    }

    pcContainer.addEventListener('click', runBoot);

    pcContainer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        runBoot();
      }
    });
  }

  // 3. Analog mechanical odometer / rolling numbers for stats
  function initStatsOdometer() {
    const statElements = document.querySelectorAll('.stat-strip strong, .stat__value');
    if (statElements.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // easeOutExpo for rapid mechanical spin that decelerates into place
    function easeOutExpo(x) {
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        obs.unobserve(el);

        const rawText = el.textContent.trim();
        const match = rawText.match(/^([^0-9.]*)(\d+(?:\.\d+)?)(.*)$/);
        if (!match) return;

        const prefix = match[1];
        const targetNum = parseFloat(match[2]);
        const suffix = match[3];
        const isDecimal = match[2].includes('.');
        const decimalPlaces = isDecimal ? match[2].split('.')[1].length : 0;

        const duration = 1300;
        const startTime = performance.now();

        function step(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const eased = easeOutExpo(progress);

          const currentVal = targetNum * eased;
          const formattedNum = isDecimal ? currentVal.toFixed(decimalPlaces) : Math.floor(currentVal);

          el.textContent = `${prefix}${formattedNum}${suffix}`;

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.textContent = rawText;
          }
        }

        requestAnimationFrame(step);
      });
    }, { threshold: 0.25 });

    statElements.forEach(el => observer.observe(el));
  }

  // 3. Tactile 3D magnetic tilt with offset shadow physics (desktop only)
  function initCard3DTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (window.innerWidth <= 1024) return;

    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
      card.classList.add('card-tilt');
      let rafId = null;

      card.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 1024) return;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Normalized coordinate space [-1, 1]
        const normX = (x / rect.width) * 2 - 1;
        const normY = (y / rect.height) * 2 - 1;

        // Dynamic 3D tilt angles (max 6 deg)
        const rotX = -(normY * 6).toFixed(2);
        const rotY = (normX * 6).toFixed(2);

        // Counter-sliding ink shadow physics
        const shadowX = (4 - normX * 6).toFixed(1);
        const shadowY = (4 - normY * 6).toFixed(1);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.015, 1.015, 1.015)`;
          card.style.boxShadow = `${shadowX}px ${shadowY}px 0 var(--ink-900)`;
        });
      });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.style.transform = '';
        card.style.boxShadow = '';
      });
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1024) {
        cards.forEach(card => {
          card.style.transform = '';
          card.style.boxShadow = '';
        });
      }
    }, { passive: true });
  }

  // 5. Interactive rubber stamp tool ("Workshop Mode")
  function initStampMode() {
    const stampVariants = [
      { class: 'workshop-stamp--approved', html: '<span>APPROVED</span>' },
      { class: 'workshop-stamp--verified', html: '<span>VERIFIED</span>' },
      { class: 'workshop-stamp--charusui', html: 'CHARUSUI<br><span>WORKSHOP</span>' },
      { class: 'workshop-stamp--secret', html: '<span>TOP SECRET</span>' }
    ];

    let isActive = false;
    let stampCount = 0;
    const placedStamps = [];

    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'stamp-tool-toggle';
    toggleBtn.type = 'button';
    toggleBtn.setAttribute('aria-label', 'Toggle interactive rubber stamp tool');
    toggleBtn.innerHTML = '<span class="stamp-tool-toggle__icon">✎</span><span class="stamp-tool-toggle__text">Stamp Mode</span>';
    document.body.appendChild(toggleBtn);

    const toolbar = document.createElement('div');
    toolbar.className = 'stamp-toolbar';
    toolbar.hidden = true;
    toolbar.innerHTML = `
      <span>Stamps: <strong class="stamp-toolbar__count">0</strong></span>
      <button type="button" class="stamp-toolbar__btn stamp-toolbar__btn--clear">Clear</button>
      <button type="button" class="stamp-toolbar__btn stamp-toolbar__btn--close" aria-label="Exit stamp mode">✕</button>
    `;
    document.body.appendChild(toolbar);

    const countLabel = toolbar.querySelector('.stamp-toolbar__count');
    const clearBtn = toolbar.querySelector('.stamp-toolbar__btn--clear');
    const closeBtn = toolbar.querySelector('.stamp-toolbar__btn--close');

    function setStampMode(enabled) {
      isActive = enabled;
      toggleBtn.classList.toggle('is-active', isActive);
      document.body.classList.toggle('stamp-mode-active', isActive);
      toolbar.hidden = !isActive;

      const label = toggleBtn.querySelector('.stamp-tool-toggle__text');
      if (label) {
        label.textContent = isActive ? 'Stamping...' : 'Stamp Mode';
      }
    }

    toggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setStampMode(!isActive);
    });

    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setStampMode(false);
    });

    clearBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      placedStamps.forEach(stamp => stamp.remove());
      placedStamps.length = 0;
      stampCount = 0;
      countLabel.textContent = '0';
    });

    document.addEventListener('click', (e) => {
      if (!isActive) return;

      // Ignore clicks on buttons, links, inputs, and the stamp controls
      if (e.target.closest('button, a, input, select, textarea, .stamp-toolbar, .stamp-tool-toggle, .nav-toggle')) {
        return;
      }

      // Random jitter angle between -15deg and +15deg
      const angle = Math.floor(Math.random() * 31) - 15;
      const variant = stampVariants[Math.floor(Math.random() * stampVariants.length)];

      const stamp = document.createElement('div');
      stamp.className = `workshop-stamp ${variant.class}`;
      stamp.style.setProperty('--stamp-angle', `${angle}deg`);
      stamp.style.left = `${e.pageX}px`;
      stamp.style.top = `${e.pageY}px`;
      stamp.innerHTML = variant.html;

      document.body.appendChild(stamp);
      placedStamps.push(stamp);

      stampCount++;
      countLabel.textContent = stampCount;
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isActive) {
        setStampMode(false);
      }
    });
  }

  // Initialize new retro animations
  initRetroPc();
  initStatsOdometer();
  initCard3DTilt();
  initStampMode();
});
