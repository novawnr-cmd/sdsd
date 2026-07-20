/* ==========================================================================
   ADAM SHOP - Utility Functions
   ========================================================================== */

function formatPrice(amount, currency) {
  if (amount === null || amount === undefined) return '0';
  currency = currency || 'LYD';
  var num = parseFloat(amount);
  if (isNaN(num)) return '0';
  var lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  var locale = lang === 'ar' ? 'ar-LY' : 'en-US';
  try {
    var formatted = new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num);
    var symbols = { 'LYD': lang === 'ar' ? 'د.ل' : 'LYD', 'USD': '$' };
    var sym = symbols[currency] || currency;
    return lang === 'ar' ? formatted + ' ' + sym : sym + formatted;
  } catch(e) {
    return num.toFixed(2) + ' ' + currency;
  }
}

function formatDate(date) {
  if (!date) return '';
  var d = new Date(date);
  if (isNaN(d.getTime())) return '';
  var lang = (typeof getLanguage === 'function') ? getLanguage() : 'ar';
  try {
    return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-LY' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' }).format(d);
  } catch(e) {
    return d.toLocaleDateString();
  }
}

function timeAgo(date) {
  if (!date) return '';
  var now = new Date();
  var d = new Date(date);
  var diff = Math.floor((now - d) / 1000);
  if (diff < 60) return 'الآن';
  if (diff < 3600) return Math.floor(diff / 60) + ' دقيقة';
  if (diff < 86400) return Math.floor(diff / 3600) + ' ساعة';
  if (diff < 2592000) return Math.floor(diff / 86400) + ' يوم';
  return formatDate(date);
}

function truncateText(text, maxLen) {
  if (!text) return '';
  maxLen = maxLen || 80;
  if (text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
}

function generateStars(rating) {
  var full = Math.floor(rating);
  var half = rating % 1 >= 0.5 ? 1 : 0;
  var empty = 5 - full - half;
  var html = '';
  for (var i = 0; i < full; i++) html += '★';
  for (var i = 0; i < half; i++) html += '★';
  for (var i = 0; i < empty; i++) html += '☆';
  return html;
}

function debounce(fn, delay) {
  var timer;
  return function() {
    var args = arguments;
    var ctx = this;
    clearTimeout(timer);
    timer = setTimeout(function() { fn.apply(ctx, args); }, delay);
  };
}

function throttle(fn, limit) {
  var inThrottle;
  return function() {
    var args = arguments;
    var ctx = this;
    if (!inThrottle) {
      fn.apply(ctx, args);
      inThrottle = true;
      setTimeout(function() { inThrottle = false; }, limit);
    }
  };
}

// Toast notifications
function showToast(message, type) {
  type = type || 'info';
  var container = document.querySelector('.toast-box');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-box';
    document.body.appendChild(container);
  }
  var toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  var icon = type === 'success' ? '✓' : type === 'error' ? '✕' : 'ℹ';
  toast.innerHTML = '<span>' + icon + '</span><span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(function() {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-20px)';
    setTimeout(function() { toast.remove(); }, 300);
  }, 3000);
}

// Modal
function openModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  var modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// URL params
function getUrlParam(name) {
  var params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// ReCAPTCHA gate
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
}

// Scroll reveal
function initScrollReveal() {
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;
  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  reveals.forEach(function(el) { observer.observe(el); });
}

// Image URL helper
function getImageUrl(path, placeholder) {
  placeholder = placeholder || 'https://placehold.co/400x400/1C2333/D4A94A?text=Product';
  if (!path) return placeholder;
  if (path.startsWith('http')) return path;
  var base = localStorage.getItem('api_url') || 'http://localhost:5000';
  return base.replace(/\/api\/?$/, '') + path;
}

// Init all utils
function initUtils() {
  initRecaptcha();
  initScrollReveal();
}

(function() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initUtils);
  } else {
    initUtils();
  }
})();
