/* ==========================================================================
   Adam Shop - Cart Management
   ========================================================================== */

const CART_STORAGE_KEY = 'adam_shop_cart';

function getLocalCart() {
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    return raw ? JSON.parse(raw) : { items: [] };
  } catch {
    return { items: [] };
  }
}

function saveLocalCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
}

async function getCart() {
  if (isLoggedIn()) {
    try {
      const data = await apiGet('/cart');
      if (data && data.cart) {
        saveLocalCart(data.cart);
        updateCartBadge();
        return data.cart;
      }
      if (data && Array.isArray(data.items)) {
        const cart = { items: data.items };
        saveLocalCart(cart);
        updateCartBadge();
        return cart;
      }
    } catch (error) {
      console.warn('API cart fetch failed, using local cart:', error);
    }
  }

  const local = getLocalCart();
  updateCartBadge();
  return local;
}

async function addToCart(productId, quantity = 1, variant = null) {
  if (!productId) throw new Error('Product ID is required');

  if (isLoggedIn()) {
    try {
      const payload = { productId, quantity };
      if (variant) payload.variant = variant;

      const data = await apiPost('/cart/add', payload);

      if (data && data.cart) {
        saveLocalCart(data.cart);
      } else if (data && data.items) {
        saveLocalCart({ items: data.items });
      }

      updateCartBadge();

      if (typeof showToast === 'function') {
        showToast(t('success.cart_added'), 'success');
      }

      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'add', productId } }));
      return data;
    } catch (error) {
      throw error;
    }
  }

  const cart = getLocalCart();
  const existingIndex = cart.items.findIndex(item => {
    if (item.productId === productId || item.product?._id === productId || item.product?.id === productId) {
      if (variant && item.variant) {
        return JSON.stringify(item.variant) === JSON.stringify(variant);
      }
      if (!variant && !item.variant) return true;
    }
    return false;
  });

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += quantity;
  } else {
    cart.items.push({
      _id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
      productId,
      product: { _id: productId },
      quantity,
      variant: variant || null,
      price: 0
    });
  }

  saveLocalCart(cart);
  updateCartBadge();

  if (typeof showToast === 'function') {
    showToast(t('success.cart_added'), 'success');
  }

  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'add', productId } }));
  return cart;
}

async function updateCartItem(itemId, quantity) {
  if (quantity < 1) {
    return removeFromCart(itemId);
  }

  if (isLoggedIn()) {
    try {
      const data = await apiPut(`/cart/item/${itemId}`, { quantity });

      if (data && data.cart) {
        saveLocalCart(data.cart);
      } else if (data && data.items) {
        saveLocalCart({ items: data.items });
      }

      updateCartBadge();
      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'update', itemId, quantity } }));
      return data;
    } catch (error) {
      throw error;
    }
  }

  const cart = getLocalCart();
  const itemIndex = cart.items.findIndex(item => item._id === itemId);

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity = quantity;
    saveLocalCart(cart);
    updateCartBadge();
    document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'update', itemId, quantity } }));
  }

  return cart;
}

async function removeFromCart(itemId) {
  if (isLoggedIn()) {
    try {
      const data = await apiDelete(`/cart/item/${itemId}`);

      if (data && data.cart) {
        saveLocalCart(data.cart);
      } else if (data && data.items) {
        saveLocalCart({ items: data.items });
      } else {
        const cart = getLocalCart();
        cart.items = cart.items.filter(item => item._id !== itemId);
        saveLocalCart(cart);
      }

      updateCartBadge();

      if (typeof showToast === 'function') {
        showToast(t('success.cart_removed'), 'info');
      }

      document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'remove', itemId } }));
      return data;
    } catch (error) {
      throw error;
    }
  }

  const cart = getLocalCart();
  cart.items = cart.items.filter(item => item._id !== itemId);
  saveLocalCart(cart);
  updateCartBadge();

  if (typeof showToast === 'function') {
    showToast(t('success.cart_removed'), 'info');
  }

  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'remove', itemId } }));
  return cart;
}

async function clearCart() {
  if (isLoggedIn()) {
    try {
      await apiDelete('/cart/clear');
    } catch (error) {
      console.warn('API cart clear failed:', error);
    }
  }

  saveLocalCart({ items: [] });
  updateCartBadge();

  document.dispatchEvent(new CustomEvent('cartUpdated', { detail: { action: 'clear' } }));
}

function getCartCount() {
  const cart = getLocalCart();
  return cart.items.reduce((sum, item) => sum + (item.quantity || 1), 0);
}

function getCartTotal() {
  const cart = getLocalCart();
  return cart.items.reduce((sum, item) => {
    const price = item.price || item.product?.price || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
}

function updateCartBadge() {
  const count = getCartCount();
  const badges = document.querySelectorAll('.cart-badge-count, .navbar-btn .badge-count');

  badges.forEach(badge => {
    if (badge.closest('.navbar-btn')?.querySelector('[data-i18n="nav.cart"]') ||
        badge.closest('a')?.getAttribute('href')?.includes('cart') ||
        badge.classList.contains('cart-badge-count')) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });

  const allBadges = document.querySelectorAll('.badge-count');
  allBadges.forEach(badge => {
    const parent = badge.closest('.navbar-btn') || badge.closest('[data-cart]');
    if (parent) {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    }
  });
}

function syncCartOnLogin() {
  if (!isLoggedIn()) return;

  const localCart = getLocalCart();
  if (localCart.items.length === 0) return;

  apiGet('/cart').then(serverCart => {
    const serverItems = serverCart?.items || [];

    if (serverItems.length === 0 && localCart.items.length > 0) {
      localCart.items.forEach(item => {
        apiPost('/cart/add', {
          productId: item.productId || item.product?._id,
          quantity: item.quantity,
          variant: item.variant
        }).catch(() => {});
      });
    }
  }).catch(() => {});
}

function initCart() {
  updateCartBadge();

  if (isLoggedIn()) {
    syncCartOnLogin();
  }

  document.addEventListener('cartUpdated', () => {
    updateCartBadge();
  });

  document.addEventListener('authChanged', (e) => {
    if (e.detail.action === 'login') {
      syncCartOnLogin();
    }
    updateCartBadge();
  });
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
  } else {
    initCart();
  }
})();
