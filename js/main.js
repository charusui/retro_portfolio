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

});
