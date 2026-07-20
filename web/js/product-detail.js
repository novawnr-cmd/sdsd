/*  product-detail.js – Product detail page & add-to-cart modal  */

var currentProduct = null;
var currentImageIndex = 0;
var selectedColor = '';
var selectedSize = '';

var modalProduct = null;
var modalSelectedColor = '';
var modalSelectedSize = '';

/* ─────────────── Product page ─────────────── */

function initProductPage() {
  var productId = getUrlParam('id');
  if (!productId) { showProductNotFound(); return; }
  var product = getProductById(productId);
  if (!product) { showProductNotFound(); return; }
  currentProduct = product;
  selectedColor = product.colors && product.colors.length > 0 ? product.colors[0].name : '';
  selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : '';
  renderProductDetail(product);
  renderRelatedProducts(product);
  document.title = product.name + ' | آدم شوب';
}

function showProductNotFound() {
  var container = document.getElementById('pdContainer');
  if (container) {
    container.innerHTML = '<div class="empty"><div class="e-icon">🔍</div><h3>المنتج غير موجود</h3><p>لم نتمكن من العثور على هذا المنتج</p><a href="../index.html" class="btn btn-gold">العودة للرئيسية</a></div>';
  }
}

function renderProductDetail(product) {
  var c = document.getElementById('pdContainer');
  if (!c) return;

  var thumbsHtml = '';
  var imgs = product.images || [];
  for (var i = 0; i < imgs.length; i++) {
    thumbsHtml += '<div class="pd-thumb' + (i === 0 ? ' active' : '') + '" onclick="switchImage(' + i + ')"><img src="' + imgs[i] + '" alt=""></div>';
  }

  var starsHtml = typeof generateStars === 'function' ? generateStars(product.rating) : '★★★★★';

  var colorsHtml = '';
  if (product.colors && product.colors.length > 0) {
    for (var i = 0; i < product.colors.length; i++) {
      var cl = product.colors[i];
      colorsHtml += '<div class="c-swatch' + (i === 0 ? ' active' : '') + '" style="background:' + cl.hex + '" data-color="' + cl.name + '" onclick="selectColor(this,\'' + cl.name + '\')"></div>';
    }
  }

  var sizesHtml = '';
  if (product.sizes && product.sizes.length > 0) {
    for (var i = 0; i < product.sizes.length; i++) {
      var sz = product.sizes[i];
      sizesHtml += '<button class="size-btn" data-size="' + sz + '" onclick="selectSize(this,\'' + sz + '\')">' + sz + '</button>';
    }
  }

  var oldPriceHtml = product.oldPrice ? '<span class="old">' + formatPrice(product.oldPrice) + '</span>' : '';
  var discHtml = product.discount ? '<span class="disc">-' + product.discount + '%</span>' : '';

  var html = '<div class="pd-page">' +

    /* Gallery */
    '<div class="pd-gallery">' +
      '<div class="pd-thumbs">' + thumbsHtml + '</div>' +
      '<div class="pd-main"><img src="' + imgs[0] + '" alt="' + product.name + '" id="pdMainImg"></div>' +
    '</div>' +

    /* Info */
    '<div class="pd-info">' +
      '<h1 class="pd-title">' + product.name + '</h1>' +
      '<div class="pd-rating">' +
        '<span class="stars">' + starsHtml + '</span>' +
        '<span class="count">(' + product.reviews + ' تقييم)</span>' +
        '<span class="text-dim text-sm">|</span>' +
        '<span class="text-sm text-dim">تم بيع ' + product.sold + ' مرة</span>' +
      '</div>' +
      '<div class="pd-price">' +
        '<span class="curr">' + formatPrice(product.price) + '</span>' +
        oldPriceHtml + discHtml +
      '</div>' +
      '<p class="pd-desc">' + product.description + '</p>' +

      /* Colors */
      '<div class="var-group" id="colorGroup" style="display:' + (product.colors && product.colors.length > 0 ? '' : 'none') + '">' +
        '<div class="var-label">اللون: <span id="selectedColorName">' + (product.colors && product.colors.length > 0 ? product.colors[0].name : '') + '</span></div>' +
        '<div class="color-swatches">' + colorsHtml + '</div>' +
      '</div>' +

      /* Sizes */
      '<div class="var-group" id="sizeGroup" style="display:' + (product.sizes && product.sizes.length > 0 ? '' : 'none') + '">' +
        '<div class="var-label">المقاس</div>' +
        '<div class="size-btns">' + sizesHtml + '</div>' +
      '</div>' +

      /* Quantity */
      '<div class="var-group">' +
        '<div class="var-label">الكمية</div>' +
        '<div class="qty-box">' +
          '<button onclick="changeQty(-1)">−</button>' +
          '<div class="qty-val" id="qtyVal">1</div>' +
          '<button onclick="changeQty(1)">+</button>' +
        '</div>' +
      '</div>' +

      /* Actions */
      '<div class="pd-actions">' +
        '<button class="btn btn-outline btn-lg" onclick="handleAddToCartFromDetail()">🛒 أضف للسلة</button>' +
        '<button class="btn btn-gold btn-lg" onclick="handleBuyNowFromDetail()">اشترِ الآن</button>' +
      '</div>' +

      /* Meta */
      '<div class="pd-meta">' +
        '<div class="meta-row"><span class="meta-label">العلامة التجارية:</span><span>' + product.brand + '</span></div>' +
        '<div class="meta-row"><span class="meta-label">الضمان:</span><span>' + product.warranty + '</span></div>' +
        '<div class="meta-row"><span class="meta-label">الشحن:</span><span>شحن خلال 24 ساعة</span></div>' +
        '<div class="meta-row"><span class="meta-label">الرمز:</span><span class="font-en">' + product.id + '</span></div>' +
      '</div>' +

      /* Quick actions */
      '<div style="display:flex;gap:16px;margin-top:16px;padding-top:16px;border-top:1px solid var(--border)">' +
        '<button class="nav-icon" onclick="handleWishlist()" id="pdWishBtn" title="إضافة للمفضلة">❤️</button>' +
        '<button class="nav-icon" onclick="handleShare()" title="مشاركة">📤</button>' +
        '<button class="nav-icon" title="إرجاع سهل">🔄</button>' +
      '</div>' +

    '</div>' +
  '</div>';

  c.innerHTML = html;
}

/* ─────────────── Image switching ─────────────── */

function switchImage(index) {
  if (!currentProduct) return;
  currentImageIndex = index;
  document.getElementById('pdMainImg').src = currentProduct.images[index];
  document.querySelectorAll('.pd-thumb').forEach(function(t, i) {
    t.classList.toggle('active', i === index);
  });
}

/* ─────────────── Variant selection ─────────────── */

function selectColor(el, name) {
  selectedColor = name;
  document.querySelectorAll('.c-swatch').forEach(function(s) { s.classList.remove('active'); });
  el.classList.add('active');
  document.getElementById('selectedColorName').textContent = name;
}

function selectSize(el, size) {
  selectedSize = size;
  document.querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
  el.classList.add('active');
}

/* ─────────────── Quantity ─────────────── */

function changeQty(delta) {
  var el = document.getElementById('qtyVal');
  var v = parseInt(el.textContent) || 1;
  v = Math.max(1, v + delta);
  el.textContent = v;
}

/* ─────────────── Add to cart (detail page) ─────────────── */

function handleAddToCartFromDetail() {
  if (!currentProduct) return;
  var qty = parseInt(document.getElementById('qtyVal').textContent) || 1;
  var product = currentProduct;

  var needsColor = product.colors && product.colors.length > 0 && !selectedColor;
  var needsSize = product.sizes && product.sizes.length > 0 && !selectedSize;

  if (needsColor || needsSize) {
    showToast('يرجى اختيار جميع الخيارات المتاحة', 'error');
    return;
  }

  var variant = {};
  if (product.colors && product.colors.length > 0) variant.color = selectedColor;
  if (product.sizes && product.sizes.length > 0) variant.size = selectedSize;
  if (Object.keys(variant).length === 0) variant = null;

  addToCart(product.id, product.name, product.price, product.images[0], qty, variant);
}

function handleBuyNowFromDetail() {
  handleAddToCartFromDetail();
  setTimeout(function() { window.location.href = 'cart.html'; }, 500);
}

/* ─────────────── Wishlist ─────────────── */

function handleWishlist() {
  if (!currentProduct) return;
  var btn = document.getElementById('pdWishBtn');
  if (typeof toggleWishlist === 'function') {
    toggleWishlist(currentProduct.id, currentProduct.name, currentProduct.price, currentProduct.images[0]);
    btn.classList.toggle('active');
  }
}

/* ─────────────── Share ─────────────── */

function handleShare() {
  if (navigator.share) {
    navigator.share({ title: currentProduct.name, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
    showToast('تم نسخ الرابط', 'success');
  }
}

/* ─────────────── Related products ─────────────── */

function renderRelatedProducts(product) {
  var related = getRelatedProducts(product.id, 4);
  var grid = document.getElementById('relatedGrid');
  if (!grid || related.length === 0) return;

  grid.innerHTML = related.map(function(p) {
    var stars = typeof generateStars === 'function' ? generateStars(p.rating) : '★★★★★';
    var wishActive = typeof isInWishlist === 'function' && isInWishlist(p.id) ? ' active' : '';
    return '<div class="p-card">' +
      '<div class="p-img" onclick="window.location.href=\'product.html?id=' + p.id + '\'" style="cursor:pointer">' +
        '<div style="position:absolute;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:4rem;background:var(--bg-3)">' + p.image + '</div>' +
        (p.discount ? '<span class="p-badge">-' + p.discount + '%</span>' : '') +
        '<button class="p-fav' + wishActive + '" onclick="event.stopPropagation();toggleWishlist(\'' + p.id + '\',\'' + p.name.replace(/'/g, "\\'") + '\',' + p.price + ',\'' + p.image + '\')">❤️</button>' +
      '</div>' +
      '<div class="p-body">' +
        '<span class="p-cat">' + p.cat + '</span>' +
        '<h3 class="p-name" onclick="window.location.href=\'product.html?id=' + p.id + '\'" style="cursor:pointer">' + p.name + '</h3>' +
        '<div class="p-rating"><span class="stars">' + stars + '</span><span class="r-count">(' + p.reviews + ')</span></div>' +
        '<div class="p-price"><span class="curr">' + formatPrice(p.price) + '</span>' +
          (p.oldPrice ? '<span class="old">' + formatPrice(p.oldPrice) + '</span>' : '') +
        '</div>' +
        '<button class="p-btn" onclick="handleCardAddToCart(\'' + p.id + '\')">🛒 أضف للسلة</button>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ═══════════════════════════════════════════════
   ADD-TO-CART MODAL  (card-based pages)
   ═══════════════════════════════════════════════ */

function ensureCartModal() {
  if (document.getElementById('cartModal')) return;
  var div = document.createElement('div');
  div.innerHTML = '<div class="modal" id="cartModal">' +
    '<div class="modal-content" style="max-width:440px;border-radius:var(--radius-xl);padding:0;overflow:hidden">' +
      '<div style="display:flex;justify-content:space-between;align-items:center;padding:16px 20px;border-bottom:1px solid var(--border)">' +
        '<h3 style="font-size:1rem;font-weight:800">خيارات المنتج</h3>' +
        '<button onclick="closeCartModal()" style="background:none;border:none;font-size:1.3rem;cursor:pointer;color:var(--text-4)">✕</button>' +
      '</div>' +
      '<div style="padding:20px" id="cartModalBody"></div>' +
    '</div>' +
  '</div>';
  document.body.appendChild(div);
}

function handleCardAddToCart(productId) {
  var product = getProductById(productId);
  if (!product) return;

  var hasColors = product.colors && product.colors.length > 0;
  var hasSizes = product.sizes && product.sizes.length > 0;

  if (!hasColors && !hasSizes) {
    addToCart(product.id, product.name, product.price, product.images[0], 1, null);
    return;
  }

  if (hasColors && product.colors.length === 1 && !hasSizes) {
    addToCart(product.id, product.name, product.price, product.images[0], 1, { color: product.colors[0].name });
    return;
  }

  if (hasSizes && product.sizes.length === 1 && !hasColors) {
    addToCart(product.id, product.name, product.price, product.images[0], 1, { size: product.sizes[0] });
    return;
  }

  modalProduct = product;
  openCartModal(product);
}

function openCartModal(product) {
  ensureCartModal();

  var modal = document.getElementById('cartModal');
  var body = document.getElementById('cartModalBody');

  var html = '<div style="display:flex;gap:14px;align-items:center;margin-bottom:20px">';
  html += '<div style="width:80px;height:80px;border-radius:var(--radius);background:var(--bg-3);display:flex;align-items:center;justify-content:center;font-size:2.2rem;flex-shrink:0">' + product.image + '</div>';
  html += '<div><h4 style="font-weight:700;font-size:0.95rem;margin-bottom:4px">' + product.name + '</h4><p style="color:var(--accent);font-weight:800;font-size:1.1rem">' + formatPrice(product.price) + '</p></div>';
  html += '</div>';

  if (product.colors && product.colors.length > 0) {
    html += '<div style="margin-bottom:16px"><div style="font-weight:700;font-size:0.85rem;margin-bottom:10px">اللون: <span id="modalColorName">اختر اللون</span></div>';
    html += '<div class="color-swatches">';
    product.colors.forEach(function(c) {
      html += '<div class="c-swatch" style="background:' + c.hex + '" data-color="' + c.name + '" onclick="modalSelectColor(this,\'' + c.name + '\')"></div>';
    });
    html += '</div></div>';
  }

  if (product.sizes && product.sizes.length > 0) {
    html += '<div style="margin-bottom:16px"><div style="font-weight:700;font-size:0.85rem;margin-bottom:10px">المقاس</div>';
    html += '<div class="size-btns">';
    product.sizes.forEach(function(s) {
      html += '<button class="size-btn" data-size="' + s + '" onclick="modalSelectSize(this,\'' + s + '\')">' + s + '</button>';
    });
    html += '</div></div>';
  }

  html += '<div style="margin-bottom:20px"><div style="font-weight:700;font-size:0.85rem;margin-bottom:10px">الكمية</div>';
  html += '<div class="qty-box"><button onclick="modalChangeQty(-1)">−</button><div class="qty-val" id="modalQtyVal">1</div><button onclick="modalChangeQty(1)">+</button></div></div>';

  html += '<button class="btn btn-gold btn-block btn-lg" id="modalConfirmBtn" onclick="modalConfirmAdd()" disabled style="opacity:0.5">تأكيد الإضافة للسلة</button>';

  body.innerHTML = html;

  modalSelectedColor = '';
  modalSelectedSize = '';

  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeCartModal() {
  var modal = document.getElementById('cartModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function modalSelectColor(el, name) {
  modalSelectedColor = name;
  el.closest('.color-swatches').querySelectorAll('.c-swatch').forEach(function(s) { s.classList.remove('active'); });
  el.classList.add('active');
  document.getElementById('modalColorName').textContent = name;
  checkModalReady();
}

function modalSelectSize(el, size) {
  modalSelectedSize = size;
  el.closest('.size-btns').querySelectorAll('.size-btn').forEach(function(b) { b.classList.remove('active'); });
  el.classList.add('active');
  checkModalReady();
}

function modalChangeQty(delta) {
  var el = document.getElementById('modalQtyVal');
  var v = parseInt(el.textContent) || 1;
  v = Math.max(1, v + delta);
  el.textContent = v;
}

function checkModalReady() {
  if (!modalProduct) return;
  var needsColor = modalProduct.colors && modalProduct.colors.length > 0;
  var needsSize = modalProduct.sizes && modalProduct.sizes.length > 0;

  var ready = true;
  if (needsColor && !modalSelectedColor) ready = false;
  if (needsSize && !modalSelectedSize) ready = false;

  var btn = document.getElementById('modalConfirmBtn');
  if (btn) {
    btn.disabled = !ready;
    btn.style.opacity = ready ? '1' : '0.5';
  }
}

function modalConfirmAdd() {
  if (!modalProduct) return;
  var qty = parseInt(document.getElementById('modalQtyVal').textContent) || 1;
  var variant = {};
  if (modalProduct.colors && modalProduct.colors.length > 0) variant.color = modalSelectedColor;
  if (modalProduct.sizes && modalProduct.sizes.length > 0) variant.size = modalSelectedSize;
  if (Object.keys(variant).length === 0) variant = null;

  addToCart(modalProduct.id, modalProduct.name, modalProduct.price, modalProduct.images[0], qty, variant);
  closeCartModal();
}

/* ─────────────── Auto-init ─────────────── */

(function() {
  function boot() {
    if (document.getElementById('pdContainer')) {
      initProductPage();
    }

    document.querySelectorAll('.c-swatch').forEach(function(s) {
      s.addEventListener('click', function() {
        s.closest('.color-swatches').querySelectorAll('.c-swatch').forEach(function(x) { x.classList.remove('active'); });
        s.classList.add('active');
      });
    });

    document.querySelectorAll('.size-btn').forEach(function(b) {
      b.addEventListener('click', function() {
        b.closest('.size-btns').querySelectorAll('.size-btn').forEach(function(x) { x.classList.remove('active'); });
        b.classList.add('active');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
