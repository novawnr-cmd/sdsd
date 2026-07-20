/* ==========================================================================
   Adam Shop - Utility Functions
   ========================================================================== */

function formatPrice(amount, currency) {
  if (amount === null || amount === undefined) return '0';

  currency = currency || 'LYD';
  const num = parseFloat(amount);
  if (isNaN(num)) return '0';

  const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  const locale = lang === 'ar' ? 'ar-LY' : 'en-US';

  try {
    const formatted = new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);

    const currencies = {
      'LYD': lang === 'ar' ? 'د.ل' : 'LYD',
      'USD': lang === 'ar' ? '$' : '$',
      'EUR': lang === 'ar' ? '\u20AC' : '\u20AC',
      'GBP': lang === 'ar' ? '\u00A3' : '\u00A3'
    };

    const symbol = currencies[currency] || currency;
    return lang === 'ar' ? `${formatted} ${symbol}` : `${symbol}${formatted}`;
  } catch {
    return `${num.toFixed(2)} ${currency}`;
  }
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  const locale = lang === 'ar' ? 'ar-LY' : 'en-US';

  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(d);
  } catch {
    return d.toLocaleDateString();
  }
}

function formatDateTime(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  const locale = lang === 'ar' ? 'ar-LY' : 'en-US';

  try {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch {
    return d.toLocaleString();
  }
}

function truncateText(text, maxLen) {
  if (!text) return '';
  maxLen = maxLen || 100;
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen).trim() + '...';
}

function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay || 300);
  };
}

function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => { inThrottle = false; }, limit || 300);
    }
  };
}

function showToast(message, type) {
  type = type || 'info';
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  const icons = {
    success: '\u2713',
    error: '\u2717',
    warning: '\u26A0',
    info: '\u2139'
  };

  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Close">\u00D7</button>
    <div class="toast-progress"></div>
  `;

  container.appendChild(toast);

  const closeBtn = toast.querySelector('.toast-close');
  closeBtn.addEventListener('click', () => removeToast(toast));

  setTimeout(() => removeToast(toast), 3500);
}

function removeToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.add('toast-exit');
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 300);
}

function showLoading(message) {
  let overlay = document.querySelector('.loading-overlay');
  if (overlay) return;

  overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = `
    <div class="spinner"></div>
    ${message ? `<span class="loading-text">${escapeHtml(message)}</span>` : ''}
  `;
  document.body.appendChild(overlay);
}

function hideLoading() {
  const overlay = document.querySelector('.loading-overlay');
  if (overlay) {
    overlay.style.opacity = '0';
    setTimeout(() => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, 300);
  }
}

function generateStars(rating, size) {
  size = size || 'sm';
  rating = parseFloat(rating) || 0;
  let html = `<span class="stars stars-${size}">`;

  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      html += '<span class="star">\u2605</span>';
    } else if (i - rating < 1 && i - rating > 0) {
      html += '<span class="star half">\u2605</span>';
    } else {
      html += '<span class="star empty">\u2606</span>';
    }
  }

  html += '</span>';
  return html;
}

function getUrlParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setUrlParam(name, value) {
  const url = new URL(window.location);
  if (value === null || value === undefined || value === '') {
    url.searchParams.delete(name);
  } else {
    url.searchParams.set(name, value);
  }
  window.history.replaceState({}, '', url);
}

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

function timeAgo(date) {
  if (!date) return '';
  const now = Date.now();
  const d = new Date(date).getTime();
  if (isNaN(d)) return '';

  const seconds = Math.floor((now - d) / 1000);

  const lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  const isAr = lang === 'ar';

  const intervals = [
    { label: isAr ? '\u062B\u0627\u0646\u064A\u0629' : 'year', shortLabel: isAr ? '\u0633' : 'y', seconds: 31536000 },
    { label: isAr ? '\u0634\u0647\u0631' : 'month', shortLabel: isAr ? '\u0634\u0647\u0631' : 'mo', seconds: 2592000 },
    { label: isAr ? '\u0623\u0633\u0628\u0648\u0639' : 'week', shortLabel: isAr ? '\u0623\u0633\u0628\u0648\u0639' : 'w', seconds: 604800 },
    { label: isAr ? '\u064A\u0648\u0645' : 'day', shortLabel: isAr ? '\u064A' : 'd', seconds: 86400 },
    { label: isAr ? '\u0633\u0627\u0639\u0629' : 'hour', shortLabel: isAr ? '\u0633' : 'h', seconds: 3600 },
    { label: isAr ? '\u062F\u0642\u064A\u0642\u0629' : 'minute', shortLabel: isAr ? '\u062F' : 'm', seconds: 60 },
    { label: isAr ? '\u062B\u0627\u0646\u064A\u0629' : 'second', shortLabel: isAr ? '\u062B' : 's', seconds: 1 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(seconds / interval.seconds);
    if (count >= 1) {
      if (isAr) {
        if (count === 1) return interval.label;
        if (count === 2) return interval.label === '\u062B\u0627\u0646\u064A\u0629' ? '\u0645\u0636\u062A' : (count === 2 && interval.label === '\u064A\u0648\u0645' ? '\u0627\u0644\u064A\u0648\u0645\u0627\u0646' : `\u0627\u0644${interval.label.substring(0, interval.label.length - 1)}\u064A\u0646`) ;
        if (count >= 3 && count <= 10) return `${count} ${interval.label}\u0646`;
        return `${count} ${interval.label}`;
      }
      if (count === 1) return `1 ${interval.label} ago`;
      return `${count} ${interval.label}s ago`;
    }
  }

  return isAr ? '\u0627\u0644\u0622\u0646' : 'just now';
}

function openModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';

  const closeBtn = overlay.querySelector('.modal-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => closeModal(id));
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      closeModal(id);
    }
  });

  const escHandler = (e) => {
    if (e.key === 'Escape') {
      closeModal(id);
      document.removeEventListener('keydown', escHandler);
    }
  };
  document.addEventListener('keydown', escHandler);
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (!overlay) return;

  overlay.classList.remove('active');
  document.body.style.overflow = '';
}

function escapeHtml(text) {
  if (!text) return '';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(text));
  return div.innerHTML;
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      if (typeof showToast === 'function') {
        showToast(t('common.copied_to_clipboard'), 'success');
      }
    }).catch(() => {
      fallbackCopy(text);
    });
  } else {
    fallbackCopy(text);
  }
}

function fallbackCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    if (typeof showToast === 'function') {
      showToast(t('common.copied_to_clipboard'), 'success');
    }
  } catch {
    if (typeof showToast === 'function') {
      showToast(t('errors.request_failed'), 'error');
    }
  }
  document.body.removeChild(textarea);
}

function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
    observer.observe(el);
  });
}

function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', throttle(() => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, 200));

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '100px' });

  document.querySelectorAll('img[data-src]').forEach(img => {
    observer.observe(img);
  });
}

function getImageUrl(path, placeholder) {
  placeholder = placeholder || '/images/placeholder.png';
  if (!path) return placeholder;
  if (path.startsWith('http')) return path;
  const base = localStorage.getItem('api_url') || 'http://localhost:5000';
  return base.replace(/\/api\/?$/, '') + path;
}

function initRecaptcha() {
  var gate = document.getElementById('recaptchaGate');
  if (!gate) return;

  if (sessionStorage.getItem('recaptcha_verified') === 'true') {
    gate.classList.add('hidden');
    return;
  }

  var checkbox = document.getElementById('recaptchaCheck');
  var submitBtn = document.getElementById('recaptchaSubmit');

  if (submitBtn) {
    submitBtn.addEventListener('click', function() {
      if (checkbox && checkbox.checked) {
        sessionStorage.setItem('recaptcha_verified', 'true');
        gate.classList.add('hidden');
      } else {
        showToast('يرجى التحقق أنك لست روبوت', 'error');
      }
    });
  }

  if (checkbox) {
    checkbox.addEventListener('change', function() {
      if (this.checked) {
        submitBtn.style.opacity = '1';
        submitBtn.style.pointerEvents = 'auto';
      }
    });
  }
}

function initUtils() {
  initScrollAnimations();
  initBackToTop();
  initLazyImages();
  initRecaptcha();
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtils);
  } else {
    initUtils();
  }
})();
