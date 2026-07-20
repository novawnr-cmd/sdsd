/* ==========================================================================
   Adam Shop - Search Controller
   ========================================================================== */

let searchOverlayActive = false;
let currentSuggestionIndex = -1;
let searchDebounceTimer = null;

function initSearch() {
  initSearchTriggers();
  initSearchOverlay();
  initSearchInput();
  initSearchKeyboardNav();
  initSearchOverlayClose();
}

function initSearchTriggers() {
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-search-trigger]');
    if (trigger) {
      e.preventDefault();
      openSearchOverlay();
    }
  });

  document.querySelectorAll('.navbar-search-input').forEach(input => {
    input.addEventListener('focus', () => {
      openSearchOverlay();
    });
  });
}

function openSearchOverlay() {
  const overlay = document.querySelector('.search-overlay');
  if (!overlay) {
    createSearchOverlay();
    return;
  }

  overlay.classList.add('active');
  searchOverlayActive = true;
  document.body.style.overflow = 'hidden';

  const input = overlay.querySelector('.search-overlay-input');
  if (input) {
    setTimeout(() => input.focus(), 100);
  }

  loadRecentSearches();
}

function closeSearchOverlay() {
  const overlay = document.querySelector('.search-overlay');
  if (!overlay) return;

  overlay.classList.remove('active');
  searchOverlayActive = false;
  document.body.style.overflow = '';

  const input = overlay.querySelector('.search-overlay-input');
  if (input) {
    input.value = '';
    input.blur();
  }

  clearSearchSuggestions();
}

function createSearchOverlay() {
  const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  const rtl = lang === 'ar';

  const overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML = `
    <div class="search-overlay-inner">
      <div class="search-overlay-input-wrap">
        <input type="text" class="search-overlay-input" placeholder="${t('nav.search_placeholder')}" autocomplete="off">
        <button class="search-overlay-close" aria-label="${t('common.close')}">\u00D7</button>
      </div>
      <div class="search-suggestions" style="display: none;"></div>
    </div>
  `;

  document.body.appendChild(overlay);

  overlay.classList.add('active');
  searchOverlayActive = true;
  document.body.style.overflow = 'hidden';

  const input = overlay.querySelector('.search-overlay-input');
  if (input) {
    setTimeout(() => input.focus(), 100);
  }

  initSearchOverlayEvents(overlay);
  loadRecentSearches();
}

function initSearchOverlay() {
  const overlay = document.querySelector('.search-overlay');
  if (!overlay) return;
  initSearchOverlayEvents(overlay);
}

function initSearchOverlayEvents(overlay) {
  const input = overlay.querySelector('.search-overlay-input');
  const closeBtn = overlay.querySelector('.search-overlay-close');
  const suggestions = overlay.querySelector('.search-suggestions');

  if (input) {
    input.addEventListener('input', debounce((e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        fetchSearchSuggestions(query, suggestions);
      } else if (query.length === 0) {
        loadRecentSearches();
      }
    }, 250));

    input.addEventListener('keydown', (e) => {
      handleSearchKeydown(e, suggestions);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSearchOverlay);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeSearchOverlay();
    }
  });
}

function initSearchInput() {
  const navbarInputs = document.querySelectorAll('.navbar-search-input');
  navbarInputs.forEach(input => {
    let navSuggestions = input.parentElement.querySelector('.search-suggestions');
    if (!navSuggestions) {
      navSuggestions = document.createElement('div');
      navSuggestions.className = 'search-suggestions';
      navSuggestions.style.cssText = 'position:absolute;top:100%;left:0;right:0;display:none;z-index:1000;';
      input.parentElement.appendChild(navSuggestions);
    }

    input.addEventListener('input', debounce((e) => {
      const query = e.target.value.trim();
      if (query.length >= 2) {
        fetchSearchSuggestions(query, navSuggestions);
        navSuggestions.style.display = 'block';
      } else {
        navSuggestions.style.display = 'none';
        navSuggestions.innerHTML = '';
      }
    }, 250));

    input.addEventListener('focus', () => {
      if (input.value.trim().length >= 2) {
        navSuggestions.style.display = 'block';
      }
    });

    input.addEventListener('blur', () => {
      setTimeout(() => {
        navSuggestions.style.display = 'none';
      }, 200);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const query = input.value.trim();
        if (query) {
          saveRecentSearch(query);
          window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
        }
      }
    });
  });
}

async function fetchSearchSuggestions(query, container) {
  if (!container) return;

  container.innerHTML = `
    <div style="padding: 16px; text-align: center;">
      <div class="spinner spinner-sm" style="margin: 0 auto;"></div>
    </div>
  `;
  container.style.display = 'block';

  try {
    const data = await apiGet(`/products/search?q=${encodeURIComponent(query)}&limit=6`);
    const products = data?.products || data?.items || data || [];

    if (!Array.isArray(products) || products.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'search-suggestion-item';
      noResults.style.justifyContent = 'center';
      noResults.style.color = 'var(--text-tertiary)';
      noResults.style.fontSize = 'var(--fs-sm)';
      noResults.textContent = t('search.no_results');
      container.innerHTML = '';
      container.appendChild(noResults);
      return;
    }

    container.innerHTML = '';

    products.forEach(product => {
      const item = createSearchSuggestionItem(product, query);
      container.appendChild(item);
    });

    const viewAll = document.createElement('div');
    viewAll.className = 'search-suggestion-item';
    viewAll.style.justifyContent = 'center';
    viewAll.style.color = 'var(--accent-primary)';
    viewAll.style.fontWeight = '600';
    viewAll.style.fontSize = 'var(--fs-sm)';
    viewAll.style.cursor = 'pointer';
    viewAll.textContent = t('common.view_all') + ' \u2192';
    viewAll.addEventListener('click', () => {
      saveRecentSearch(query);
      window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    });
    container.appendChild(viewAll);

  } catch (error) {
    console.warn('Search suggestions failed:', error);
    const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
    const popularSearches = lang === 'ar'
      ? ['هواتف', 'لابتوب', 'أحذية', 'ملابس', 'إلكترونيات']
      : ['phones', 'laptops', 'shoes', 'clothing', 'electronics'];

    const filtered = popularSearches.filter(s => s.includes(query.toLowerCase()));
    if (filtered.length > 0) {
      container.innerHTML = '';
      filtered.slice(0, 4).forEach(term => {
        const item = document.createElement('div');
        item.className = 'search-suggestion-item';
        item.innerHTML = `<span style="font-size: var(--fs-sm); color: var(--text-secondary);">\uD83D\uDD0D ${escapeHtml(term)}</span>`;
        item.addEventListener('click', () => {
          window.location.href = `/search.html?q=${encodeURIComponent(term)}`;
        });
        container.appendChild(item);
      });
    } else {
      container.innerHTML = `
        <div style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: var(--fs-sm);">
          ${t('search.no_results')}
        </div>
      `;
    }
  }
}

function createSearchSuggestionItem(product, query) {
  const item = document.createElement('div');
  item.className = 'search-suggestion-item';

  const productId = product._id || product.id;
  const productName = product.name || product.title || '';
  const productPrice = product.price || 0;
  const productImage = product.images && product.images[0]
    ? (product.images[0].url || product.images[0])
    : product.image || '';

  const highlightedName = highlightText(productName, query);

  const imgSrc = productImage
    ? (productImage.startsWith('http') ? productImage : getImageUrl(productImage))
    : '';

  item.innerHTML = `
    ${imgSrc ? `<img src="${imgSrc}" alt="${escapeHtml(productName)}" onerror="this.style.display='none'">` : ''}
    <div class="search-suggestion-info">
      <div class="search-suggestion-name">${highlightedName}</div>
      <div class="search-suggestion-price">${formatPrice(productPrice)}</div>
    </div>
  `;

  item.addEventListener('click', () => {
    saveRecentSearch(query);
    window.location.href = `/product.html?id=${productId}`;
  });

  return item;
}

function highlightText(text, query) {
  if (!text || !query) return escapeHtml(text || '');
  const escaped = escapeHtml(text);
  const queryEscaped = escapeHtml(query);
  const regex = new RegExp(`(${queryEscaped.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  return escaped.replace(regex, '<span class="search-highlight">$1</span>');
}

function handleSearchKeydown(e, container) {
  if (!container) return;
  const items = container.querySelectorAll('.search-suggestion-item');

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    currentSuggestionIndex = Math.min(currentSuggestionIndex + 1, items.length - 1);
    updateSuggestionHighlight(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    currentSuggestionIndex = Math.max(currentSuggestionIndex - 1, -1);
    updateSuggestionHighlight(items);
  } else if (e.key === 'Enter') {
    e.preventDefault();
    const overlay = document.querySelector('.search-overlay');
    const input = overlay ? overlay.querySelector('.search-overlay-input') : e.target;
    const query = input ? input.value.trim() : '';

    if (currentSuggestionIndex >= 0 && items[currentSuggestionIndex]) {
      items[currentSuggestionIndex].click();
    } else if (query) {
      saveRecentSearch(query);
      window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
    }
  } else if (e.key === 'Escape') {
    closeSearchOverlay();
  }
}

function updateSuggestionHighlight(items) {
  items.forEach((item, i) => {
    if (i === currentSuggestionIndex) {
      item.classList.add('active');
      item.scrollIntoView({ block: 'nearest' });
    } else {
      item.classList.remove('active');
    }
  });
}

function clearSearchSuggestions() {
  currentSuggestionIndex = -1;
  document.querySelectorAll('.search-suggestions').forEach(el => {
    el.innerHTML = '';
    el.style.display = 'none';
  });
}

function loadRecentSearches() {
  const container = document.querySelector('.search-overlay .search-suggestions');
  if (!container) return;

  const recent = getRecentSearches();
  const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';

  if (recent.length === 0) {
    const popularSearches = lang === 'ar'
      ? ['هواتف ذكية', 'لابتوب', 'أحذية رياضية', 'سماعات', 'ساعات']
      : ['Smartphones', 'Laptops', 'Sneakers', 'Headphones', 'Watches'];

    container.innerHTML = `
      <div style="padding: 12px 20px 8px; font-size: var(--fs-xs); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">
        ${t('search.popular_searches')}
      </div>
    `;

    popularSearches.forEach(term => {
      const item = document.createElement('div');
      item.className = 'search-suggestion-item';
      item.innerHTML = `
        <span style="color: var(--text-tertiary); font-size: var(--fs-sm);">\uD83D\uDD25</span>
        <span style="font-size: var(--fs-sm); color: var(--text-secondary);">${escapeHtml(term)}</span>
      `;
      item.addEventListener('click', () => {
        const input = container.closest('.search-overlay')?.querySelector('.search-overlay-input');
        if (input) input.value = term;
        window.location.href = `/search.html?q=${encodeURIComponent(term)}`;
      });
      container.appendChild(item);
    });

    container.style.display = 'block';
    return;
  }

  container.innerHTML = `
    <div style="padding: 12px 20px 8px; display: flex; justify-content: space-between; align-items: center;">
      <span style="font-size: var(--fs-xs); font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px;">
        ${t('search.recent_searches')}
      </span>
      <button class="search-clear-recent" style="font-size: var(--fs-xs); color: var(--danger); cursor: pointer; background: none; border: none;">
        ${t('search.clear_search')}
      </button>
    </div>
  `;

  const clearBtn = container.querySelector('.search-clear-recent');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      clearRecentSearches();
      container.innerHTML = '';
      loadRecentSearches();
    });
  }

  recent.forEach(term => {
    const item = document.createElement('div');
    item.className = 'search-suggestion-item';
    item.innerHTML = `
      <span style="color: var(--text-tertiary); font-size: var(--fs-sm);">\uD83D\uDC83</span>
      <span style="font-size: var(--fs-sm); color: var(--text-secondary);">${escapeHtml(term)}</span>
    `;
    item.addEventListener('click', () => {
      const input = container.closest('.search-overlay')?.querySelector('.search-overlay-input');
      if (input) input.value = term;
      window.location.href = `/search.html?q=${encodeURIComponent(term)}`;
    });
    container.appendChild(item);
  });

  container.style.display = 'block';
}

function getRecentSearches() {
  try {
    const raw = localStorage.getItem('adam_shop_recent_searches');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRecentSearch(query) {
  if (!query) return;
  let recent = getRecentSearches();
  recent = recent.filter(s => s.toLowerCase() !== query.toLowerCase());
  recent.unshift(query);
  if (recent.length > 10) recent = recent.slice(0, 10);
  localStorage.setItem('adam_shop_recent_searches', JSON.stringify(recent));
}

function clearRecentSearches() {
  localStorage.removeItem('adam_shop_recent_searches');
}

function initSearchOverlayClose() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlayActive) {
      closeSearchOverlay();
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      if (searchOverlayActive) {
        closeSearchOverlay();
      } else {
        openSearchOverlay();
      }
    }
  });
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
  } else {
    initSearch();
  }
})();
