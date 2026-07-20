/* ==========================================================================
   ADAM SHOP - Navbar Controller
   ========================================================================== */

function initNavbar() {
  initScrollEffect();
  initMobileMenu();
  initUserDropdown();
  initNavbarCartBadge();
  initLanguageButton();
  initThemeButton();
  initSearchNav();
}

function initScrollEffect() {
  var navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 10) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
}

function initMobileMenu() {
  var hamburger = document.getElementById('hamburger');
  var mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    var isOpen = mobileMenu.classList.toggle('active');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('click', function(e) {
    if (mobileMenu.classList.contains('active') &&
        !mobileMenu.contains(e.target) &&
        !hamburger.contains(e.target)) {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });

  mobileMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() {
      mobileMenu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

function initUserDropdown() {
  var userBtn = document.getElementById('userBtn');
  var userMenu = document.getElementById('userMenu');
  if (!userBtn || !userMenu) return;

  userBtn.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    userMenu.classList.toggle('active');
  });

  document.addEventListener('click', function(e) {
    if (!userBtn.contains(e.target) && !userMenu.contains(e.target)) {
      userMenu.classList.remove('active');
    }
  });

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      userMenu.classList.remove('active');
    }
  });
}

function initNavbarCartBadge() {
  if (typeof getCartCount === 'function') {
    var countEl = document.getElementById('cartCount');
    if (countEl) {
      var count = getCartCount();
      countEl.textContent = count;
      countEl.style.display = count > 0 ? 'flex' : 'none';
    }
  }
  if (typeof getWishlistCount === 'function') {
    var wishEl = document.getElementById('wishCount');
    if (wishEl) {
      var wcount = getWishlistCount();
      wishEl.textContent = wcount;
      wishEl.style.display = wcount > 0 ? 'flex' : 'none';
    }
  }
}

function initLanguageButton() {
  var langBtn = document.getElementById('langToggle');
  if (!langBtn) return;

  var currentLang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  langBtn.textContent = currentLang === 'ar' ? 'EN' : 'عربي';

  langBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var newLang = (typeof toggleLanguage === 'function') ? toggleLanguage() : 'ar';
    langBtn.textContent = newLang === 'ar' ? 'EN' : 'عربي';

    document.querySelectorAll('[data-i18n]').forEach(function(el) {
      var key = el.getAttribute('data-i18n');
      if (typeof t === 'function') {
        var translated = t(key);
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else {
          el.textContent = translated;
        }
      }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
      var key = el.getAttribute('data-i18n-placeholder');
      if (typeof t === 'function') {
        el.placeholder = t(key);
      }
    });
  });
}

function initThemeButton() {
  var themeBtn = document.getElementById('themeToggle');
  if (!themeBtn) return;

  var currentTheme = (typeof getTheme === 'function') ? getTheme() : 'dark';
  themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

  themeBtn.addEventListener('click', function(e) {
    e.preventDefault();
    var newTheme = (typeof toggleTheme === 'function') ? toggleTheme() : 'dark';
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
  });
}

function initSearchNav() {
  var searchInput = document.getElementById('navSearch');
  var searchDropdown = document.getElementById('searchDropdown');
  if (!searchInput || !searchDropdown) return;

  searchInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      var query = searchInput.value.trim();
      if (query) {
        window.location.href = 'pages/search.html?q=' + encodeURIComponent(query);
      }
    }
  });

  searchInput.addEventListener('input', function() {
    var query = searchInput.value.trim();
    if (query.length < 2) {
      searchDropdown.classList.remove('active');
      searchDropdown.innerHTML = '';
      return;
    }
    searchDropdown.classList.add('active');
    searchDropdown.innerHTML = '<div class="s-item" style="justify-content:center;color:var(--text-4);padding:16px">جاري البحث...</div>';
  });

  document.addEventListener('click', function(e) {
    if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
      searchDropdown.classList.remove('active');
    }
  });
}

function updateUserMenu() {
  var userMenu = document.getElementById('userMenu');
  var userName = document.getElementById('userName');
  var userAvatar = document.getElementById('userAvatar');
  if (!userMenu) return;

  var user = null;
  if (typeof getUser === 'function') {
    user = getUser();
  }

  if (user && isLoggedIn()) {
    if (userName) userName.textContent = user.name || 'حسابي';
    if (userAvatar) userAvatar.textContent = (user.name || 'م')[0];

    var menuHTML = '';
    if (user.role === 'ADMIN' && user.isOwner) {
      menuHTML += '<a href="pages/admin/site-products.html">📦 إدارة المنتجات</a>';
      menuHTML += '<div class="dropdown-sep"></div>';
    }
    menuHTML += '<a href="pages/profile.html">👤 الملف الشخصي</a>';
    menuHTML += '<a href="pages/orders.html">📦 طلباتي</a>';
    menuHTML += '<a href="pages/wishlist.html">❤️ المفضلة</a>';
    menuHTML += '<div class="dropdown-sep"></div>';
    menuHTML += '<button onclick="handleLogout()" style="color:var(--red)">🚪 تسجيل خروج</button>';
    userMenu.innerHTML = menuHTML;
  } else {
    if (userName) userName.textContent = '';
    if (userAvatar) userAvatar.textContent = '👤';
    userMenu.innerHTML = '<a href="pages/login.html">🔑 تسجيل الدخول</a>' +
      '<a href="pages/register.html">📝 إنشاء حساب</a>';
  }
}

function handleLogout() {
  if (typeof logout === 'function') {
    logout();
  }
  window.location.href = 'index.html';
}

function initBackToTop() {
  var btt = document.querySelector('.btt');
  if (!btt) return;
  window.addEventListener('scroll', function() {
    if (window.scrollY > 400) {
      btt.classList.add('visible');
    } else {
      btt.classList.remove('visible');
    }
  });
  btt.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initHeroSlider() {
  var slides = document.querySelectorAll('.hero-slide');
  var dots = document.querySelectorAll('.hero-dots span');
  if (slides.length === 0) return;

  var current = 0;

  function goTo(index) {
    slides[current].classList.remove('active');
    if (dots[current]) dots[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dots[current]) dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  setInterval(next, 5000);

  dots.forEach(function(dot, i) {
    dot.addEventListener('click', function() { goTo(i); });
  });
}

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var group = btn.closest('.tabs-bar');
      var target = btn.getAttribute('data-tab');

      group.querySelectorAll('.tab-btn').forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');

      var parent = group.parentElement;
      parent.querySelectorAll('.tab-panel').forEach(function(p) { p.classList.remove('active'); });
      var panel = parent.querySelector('#' + target);
      if (panel) panel.classList.add('active');
    });
  });
}

function initQty() {
  document.querySelectorAll('.qty-box').forEach(function(box) {
    var minus = box.querySelector('.qty-minus');
    var plus = box.querySelector('.qty-plus');
    var val = box.querySelector('.qty-val');
    if (!minus || !plus || !val) return;

    minus.addEventListener('click', function() {
      var v = parseInt(val.textContent) || 1;
      if (v > 1) {
        val.textContent = v - 1;
      }
    });

    plus.addEventListener('click', function() {
      var v = parseInt(val.textContent) || 1;
      val.textContent = v + 1;
    });
  });
}

function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  reveals.forEach(function(el) { observer.observe(el); });
}

(function() {
  function init() {
    initNavbar();
    initBackToTop();
    initHeroSlider();
    initTabs();
    initQty();
    initScrollReveal();
    updateUserMenu();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
