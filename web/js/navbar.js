/* ==========================================================================
   Adam Shop - Navbar Controller
   ========================================================================== */

function initNavbar() {
  initScrollEffect();
  initMobileMenu();
  initUserDropdown();
  initNavbarCartBadge();
  initLanguageButton();
}

function initScrollEffect() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', throttle(() => {
    const currentScroll = window.scrollY;

    if (currentScroll > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  }, 100));
}

function initMobileMenu() {
  const hamburger = document.querySelector('.navbar-hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const isActive = hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('active', isActive);

    if (isActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', (e) => {
    if (hamburger.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  mobileMenu.querySelectorAll('.mobile-menu-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

function initUserDropdown() {
  const userBtn = document.querySelector('.navbar-user');
  const dropdown = document.querySelector('.navbar-dropdown');

  if (!userBtn || !dropdown) return;

  userBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      dropdown.classList.remove('active');
    }
  });

  dropdown.querySelectorAll('.navbar-dropdown-item').forEach(item => {
    item.addEventListener('click', () => {
      dropdown.classList.remove('active');
    });
  });
}

function initNavbarCartBadge() {
  if (typeof updateCartBadge === 'function') {
    updateCartBadge();
  }

  document.addEventListener('cartUpdated', () => {
    if (typeof updateCartBadge === 'function') {
      updateCartBadge();
    }
  });
}

function initLanguageButton() {
  const langBtns = document.querySelectorAll('.navbar-lang-btn');

  langBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const newLang = typeof toggleLanguage === 'function' ? toggleLanguage() : 'ar';
      btn.textContent = newLang === 'ar' ? 'EN' : '\u0639\u0631\u0628\u064A';

      if (typeof updateCartBadge === 'function') {
        updateCartBadge();
      }

      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (typeof t === 'function') {
          const translated = t(key);
          if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
            el.placeholder = translated;
          } else {
            el.textContent = translated;
          }
        }
      });
    });
  });
}

function closeAllDropdowns(except) {
  document.querySelectorAll('.navbar-dropdown, .dropdown-menu').forEach(dd => {
    if (except && dd.contains(except)) return;
    dd.classList.remove('active');
  });
}

function initNavbarSearch() {
  const searchInput = document.querySelector('.navbar-search-input');
  if (!searchInput) return;

  searchInput.addEventListener('focus', () => {
    searchInput.parentElement.classList.add('focused');
  });

  searchInput.addEventListener('blur', () => {
    setTimeout(() => {
      searchInput.parentElement.classList.remove('focused');
    }, 200);
  });

  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = searchInput.value.trim();
      if (query) {
        window.location.href = `/search.html?q=${encodeURIComponent(query)}`;
      }
    }
  });
}

function initCartDrawer() {
  const overlay = document.querySelector('.cart-drawer-overlay');
  const drawer = document.querySelector('.cart-drawer');
  const closeBtn = document.querySelector('.cart-drawer-close');
  const cartBtns = document.querySelectorAll('[data-open-cart]');

  if (!overlay || !drawer) return;

  function openDrawer() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof renderCartDrawer === 'function') {
      renderCartDrawer();
    }
  }

  function closeDrawer() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeDrawer);
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeDrawer();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay.classList.contains('active')) {
      closeDrawer();
    }
  });
}

function initNavbar() {
  initScrollEffect();
  initMobileMenu();
  initUserDropdown();
  initNavbarCartBadge();
  initLanguageButton();
  initNavbarSearch();
  initCartDrawer();
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavbar);
  } else {
    initNavbar();
  }
})();
