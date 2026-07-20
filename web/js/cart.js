/* ==========================================================================
   ADAM SHOP - Cart Module
   ========================================================================== */

function getCart() {
  try {
    var cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
  } catch(e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  var countEl = document.getElementById('cartCount');
  if (countEl) {
    var count = getCartCount();
    countEl.textContent = count;
    countEl.style.display = count > 0 ? 'flex' : 'none';
  }
}

function updateWishlistBadge() {
  var wishEl = document.getElementById('wishCount');
  if (wishEl && typeof getWishlistCount === 'function') {
    var wcount = getWishlistCount();
    wishEl.textContent = wcount;
    wishEl.style.display = wcount > 0 ? 'flex' : 'none';
  }
}

function addToCart(productId, name, price, image, quantity, variant) {
  var cart = getCart();
  var key = productId + (variant ? '-' + JSON.stringify(variant) : '');
  var existing = cart.find(function(item) { return item.key === key; });

  if (existing) {
    existing.quantity += (quantity || 1);
  } else {
    cart.push({
      key: key,
      productId: productId,
      name: name,
      price: price,
      image: image || '',
      quantity: quantity || 1,
      variant: variant || null
    });
  }

  saveCart(cart);
  showToast('تمت الإضافة إلى السلة', 'success');
}

function updateCartItem(key, quantity) {
  var cart = getCart();
  var item = cart.find(function(i) { return i.key === key; });
  if (item) {
    if (quantity <= 0) {
      cart = cart.filter(function(i) { return i.key !== key; });
    } else {
      item.quantity = quantity;
    }
    saveCart(cart);
  }
}

function removeFromCart(key) {
  var cart = getCart().filter(function(i) { return i.key !== key; });
  saveCart(cart);
  showToast('تمت الإزالة من السلة', 'info');
}

function clearCart() {
  localStorage.removeItem('cart');
  saveCart([]);
}

function getCartCount() {
  var cart = getCart();
  return cart.reduce(function(sum, item) { return sum + item.quantity; }, 0);
}

function getCartTotal() {
  var cart = getCart();
  return cart.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
}

function getCartItems() {
  return getCart();
}
