/* ==========================================================================
   ADAM SHOP - Wishlist Module
   ========================================================================== */

function getWishlist() {
  try {
    var wl = localStorage.getItem('wishlist');
    return wl ? JSON.parse(wl) : [];
  } catch(e) {
    return [];
  }
}

function saveWishlist(wl) {
  localStorage.setItem('wishlist', JSON.stringify(wl));
  var wishEl = document.getElementById('wishCount');
  if (wishEl) {
    var count = wl.length;
    wishEl.textContent = count;
    wishEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

function toggleWishlist(productId, name, price, image) {
  var wl = getWishlist();
  var index = wl.findIndex(function(item) { return item.productId === productId; });

  if (index > -1) {
    wl.splice(index, 1);
    showToast('تمت الإزالة من المفضلة', 'info');
  } else {
    wl.push({
      productId: productId,
      name: name,
      price: price,
      image: image || ''
    });
    showToast('تمت الإضافة إلى المفضلة', 'success');
  }

  saveWishlist(wl);
  updateWishlistButtons();
}

function isInWishlist(productId) {
  return getWishlist().some(function(item) { return item.productId === productId; });
}

function getWishlistCount() {
  return getWishlist().length;
}

function updateWishlistButtons() {
  document.querySelectorAll('.p-fav').forEach(function(btn) {
    var pid = btn.getAttribute('data-product-id');
    if (pid && isInWishlist(pid)) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}
