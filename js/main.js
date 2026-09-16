// Charles Dwayne Viray - Developer Portfolio Scripts
// Holy Angel University | Midterm Requirement (Phase 1)

document.addEventListener('DOMContentLoaded', () => {
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

  // Projects filtering & instant search
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
});
