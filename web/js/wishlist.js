/* ==========================================================================
   Adam Shop - Wishlist Management
   ========================================================================== */

const WISHLIST_KEY = 'adam_shop_wishlist';

function getLocalWishlist() {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocalWishlist(list) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
}

async function getWishlist() {
  if (isLoggedIn()) {
    try {
      const data = await apiGet('/wishlist');
      const items = data?.wishlist || data?.items || data || [];
      const list = Array.isArray(items) ? items : [];
      saveLocalWishlist(list.map(item => item.productId || item._id || item));
      return list;
    } catch (error) {
      console.warn('API wishlist fetch failed, using local:', error);
    }
  }
  return getLocalWishlist();
}

async function toggleWishlist(productId) {
  if (!productId) throw new Error('Product ID is required');

  const currentlyIn = await isInWishlist(productId);

  if (isLoggedIn()) {
    try {
      if (currentlyIn) {
        await apiDelete(`/wishlist/${productId}`);
        const list = getLocalWishlist().filter(id => id !== productId);
        saveLocalWishlist(list);

        if (typeof showToast === 'function') {
          showToast(t('success.wishlist_removed'), 'info');
        }

        document.dispatchEvent(new CustomEvent('wishlistUpdated', {
          detail: { action: 'remove', productId }
        }));

        return false;
      } else {
        await apiPost('/wishlist/add', { productId });
        const list = getLocalWishlist();
        if (!list.includes(productId)) list.push(productId);
        saveLocalWishlist(list);

        if (typeof showToast === 'function') {
          showToast(t('success.wishlist_added'), 'success');
        }

        document.dispatchEvent(new CustomEvent('wishlistUpdated', {
          detail: { action: 'add', productId }
        }));

        return true;
      }
    } catch (error) {
      throw error;
    }
  }

  const localList = getLocalWishlist();
  const index = localList.indexOf(productId);

  if (index > -1) {
    localList.splice(index, 1);
    saveLocalWishlist(localList);

    if (typeof showToast === 'function') {
      showToast(t('success.wishlist_removed'), 'info');
    }

    document.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { action: 'remove', productId }
    }));

    return false;
  } else {
    localList.push(productId);
    saveLocalWishlist(localList);

    if (typeof showToast === 'function') {
      showToast(t('success.wishlist_added'), 'success');
    }

    document.dispatchEvent(new CustomEvent('wishlistUpdated', {
      detail: { action: 'add', productId }
    }));

    return true;
  }
}

async function isInWishlist(productId) {
  const list = await getWishlist();

  if (Array.isArray(list) && list.length > 0) {
    if (typeof list[0] === 'object' && list[0] !== null) {
      return list.some(item => {
        const id = item.productId || item._id || item.id || item;
        return id === productId || id === String(productId);
      });
    }
    return list.includes(productId) || list.includes(String(productId));
  }

  return false;
}

async function removeFromWishlist(productId) {
  if (isLoggedIn()) {
    try {
      await apiDelete(`/wishlist/${productId}`);
    } catch (error) {
      console.warn('API remove from wishlist failed:', error);
    }
  }

  const list = getLocalWishlist();
  const filtered = list.filter(id => id !== productId && id !== String(productId));
  saveLocalWishlist(filtered);

  document.dispatchEvent(new CustomEvent('wishlistUpdated', {
    detail: { action: 'remove', productId }
  }));

  return filtered;
}

function updateWishlistButtons() {
  document.querySelectorAll('[data-wishlist-btn]').forEach(btn => {
    const productId = btn.getAttribute('data-wishlist-btn');
    isInWishlist(productId).then(inList => {
      if (inList) {
        btn.classList.add('wishlisted');
        btn.setAttribute('data-tooltip', t('product.remove_from_wishlist'));
      } else {
        btn.classList.remove('wishlisted');
        btn.setAttribute('data-tooltip', t('product.add_to_wishlist'));
      }
    });
  });
}

function initWishlist() {
  updateWishlistButtons();

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-wishlist-btn]');
    if (btn) {
      e.preventDefault();
      e.stopPropagation();

      if (!isLoggedIn()) {
        if (typeof showToast === 'function') {
          showToast(t('nav.login'), 'warning');
        }
        setTimeout(() => {
          window.location.href = '/login.html';
        }, 1000);
        return;
      }

      const productId = btn.getAttribute('data-wishlist-btn');
      toggleWishlist(productId).then(() => {
        updateWishlistButtons();
      });
    }
  });

  document.addEventListener('wishlistUpdated', () => {
    updateWishlistButtons();
  });

  document.addEventListener('authChanged', () => {
    updateWishlistButtons();
  });
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWishlist);
  } else {
    initWishlist();
  }
})();
