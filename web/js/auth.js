/* ==========================================================================
   Adam Shop - Authentication
   ========================================================================== */

function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem('user');
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
}

function isLoggedIn() {
  const token = localStorage.getItem('token');
  return !!token && !!getStoredUser();
}

function getUser() {
  return getStoredUser();
}

function isAdmin() {
  const user = getStoredUser();
  return user && (user.role === 'admin' || user.isAdmin === true);
}

function isSeller() {
  const user = getStoredUser();
  return user && (user.role === 'seller' || user.role === 'admin' || user.isSeller === true);
}

async function login(email, password) {
  if (!email) throw new Error(t('errors.email_required'));
  if (!password) throw new Error(t('errors.password_required'));

  const data = await apiPost('/auth/login', { email, password });

  if (data.token) {
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }

  if (data.user) {
    storeUser(data.user);
  }

  if (typeof showToast === 'function') {
    showToast(t('success.login'), 'success');
  }

  document.dispatchEvent(new CustomEvent('authChanged', { detail: { action: 'login', user: data.user } }));

  return data;
}

async function register(userData) {
  const { name, email, password, confirmPassword, phone, role } = userData;

  if (!name) throw new Error(t('errors.name_required'));
  if (!email) throw new Error(t('errors.email_required'));
  if (!password) throw new Error(t('errors.password_required'));
  if (password.length < 6) throw new Error(t('errors.password_short'));
  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new Error(t('errors.password_mismatch'));
  }

  const payload = { name, email, password };
  if (phone) payload.phone = phone;
  if (role) payload.role = role;

  const data = await apiPost('/auth/register', payload);

  if (data.token) {
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }

  if (data.user) {
    storeUser(data.user);
  }

  if (typeof showToast === 'function') {
    showToast(t('success.register'), 'success');
  }

  document.dispatchEvent(new CustomEvent('authChanged', { detail: { action: 'register', user: data.user } }));

  return data;
}

async function googleLogin(token) {
  if (!token) throw new Error('Google token is required');

  const data = await apiPost('/auth/google', { token });

  if (data.token) {
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }

  if (data.user) {
    storeUser(data.user);
  }

  if (typeof showToast === 'function') {
    showToast(t('success.login'), 'success');
  }

  document.dispatchEvent(new CustomEvent('authChanged', { detail: { action: 'login', user: data.user } }));

  return data;
}

async function facebookLogin(token) {
  if (!token) throw new Error('Facebook token is required');

  const data = await apiPost('/auth/facebook', { token });

  if (data.token) {
    localStorage.setItem('token', data.token);
    if (data.refreshToken) {
      localStorage.setItem('refreshToken', data.refreshToken);
    }
  }

  if (data.user) {
    storeUser(data.user);
  }

  if (typeof showToast === 'function') {
    showToast(t('success.login'), 'success');
  }

  document.dispatchEvent(new CustomEvent('authChanged', { detail: { action: 'login', user: data.user } }));

  return data;
}

function logout() {
  clearUser();

  if (typeof showToast === 'function') {
    showToast(t('success.logout'), 'info');
  }

  document.dispatchEvent(new CustomEvent('authChanged', { detail: { action: 'logout' } }));

  setTimeout(() => {
    window.location.href = '/';
  }, 500);
}

async function getProfile() {
  const data = await apiGet('/auth/profile');
  if (data && data.user) {
    storeUser(data.user);
  }
  return data;
}

async function updateProfile(profileData) {
  const data = await apiPut('/auth/profile', profileData);

  if (data && data.user) {
    storeUser(data.user);
  }

  if (typeof showToast === 'function') {
    showToast(t('success.profile_updated'), 'success');
  }

  document.dispatchEvent(new CustomEvent('authChanged', { detail: { action: 'profileUpdated', user: data.user } }));

  return data;
}

async function changePassword(currentPassword, newPassword) {
  if (!currentPassword) throw new Error(t('errors.password_required'));
  if (!newPassword) throw new Error(t('errors.password_required'));
  if (newPassword.length < 6) throw new Error(t('errors.password_short'));

  const data = await apiPut('/auth/password', { currentPassword, newPassword });

  if (typeof showToast === 'function') {
    showToast(t('success.password_reset'), 'success');
  }

  return data;
}

async function forgotPassword(email) {
  if (!email) throw new Error(t('errors.email_required'));

  const data = await apiPost('/auth/forgot-password', { email });
  return data;
}

function updateAuthUI() {
  const user = getStoredUser();
  const authBtns = document.querySelectorAll('.navbar-auth-btns');
  const userBtns = document.querySelectorAll('.navbar-user-menu');
  const avatarEls = document.querySelectorAll('.navbar-avatar');
  const nameEls = document.querySelectorAll('.navbar-username');

  if (isLoggedIn()) {
    authBtns.forEach(el => el.style.display = 'none');
    userBtns.forEach(el => el.style.display = 'flex');

    const displayName = user ? (user.name || user.email) : '';
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    avatarEls.forEach(el => {
      if (user && user.avatar) {
        el.innerHTML = `<img src="${user.avatar}" alt="${displayName}">`;
      } else {
        el.textContent = initials || 'A';
      }
    });

    nameEls.forEach(el => {
      el.textContent = displayName;
    });
  } else {
    authBtns.forEach(el => el.style.display = 'flex');
    userBtns.forEach(el => el.style.display = 'none');
  }
}

function initAuth() {
  updateAuthUI();

  document.addEventListener('click', (e) => {
    if (e.target.closest('.logout-btn')) {
      e.preventDefault();
      logout();
    }
  });

  document.addEventListener('authChanged', () => {
    updateAuthUI();
  });
}

(function autoInit() {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAuth);
  } else {
    initAuth();
  }
})();
