/* ==========================================================================
   ADAM SHOP - Auth Module
   ========================================================================== */

function login(email, password) {
  return apiPost('/auth/login', { email: email, password: password })
    .then(function(data) {
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        showToast('تم تسجيل الدخول بنجاح', 'success');
        if (typeof updateUserMenu === 'function') updateUserMenu();
        return data.data;
      }
      throw new Error(data.message || 'Login failed');
    });
}

function register(name, email, password) {
  return apiPost('/auth/register', { name: name, email: email, password: password })
    .then(function(data) {
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        showToast('تم إنشاء الحساب بنجاح', 'success');
        if (typeof updateUserMenu === 'function') updateUserMenu();
        return data.data;
      }
      throw new Error(data.message || 'Register failed');
    });
}

function googleLogin(token) {
  return apiPost('/auth/google', { token: token })
    .then(function(data) {
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        showToast('تم تسجيل الدخول بنجاح', 'success');
        if (typeof updateUserMenu === 'function') updateUserMenu();
        return data.data;
      }
      throw new Error(data.message);
    });
}

function facebookLogin(token) {
  return apiPost('/auth/facebook', { token: token })
    .then(function(data) {
      if (data.success) {
        localStorage.setItem('token', data.data.accessToken);
        localStorage.setItem('refreshToken', data.data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        showToast('تم تسجيل الدخول بنجاح', 'success');
        if (typeof updateUserMenu === 'function') updateUserMenu();
        return data.data;
      }
      throw new Error(data.message);
    });
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  showToast('تم تسجيل الخروج', 'info');
  if (typeof updateUserMenu === 'function') updateUserMenu();
}

function getProfile() {
  return apiGet('/auth/profile')
    .then(function(data) {
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        return data.data;
      }
      throw new Error(data.message);
    });
}

function updateProfile(profileData) {
  return apiPut('/auth/profile', profileData)
    .then(function(data) {
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        showToast('تم تحديث الملف الشخصي', 'success');
        if (typeof updateUserMenu === 'function') updateUserMenu();
        return data.data;
      }
      throw new Error(data.message);
    });
}

function isLoggedIn() {
  return !!localStorage.getItem('token');
}

function getUser() {
  try {
    var user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch(e) {
    return null;
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function isAdmin() {
  var user = getUser();
  return user && user.role === 'ADMIN';
}

function isSeller() {
  var user = getUser();
  return user && (user.role === 'SELLER' || user.role === 'ADMIN');
}

function requireAuth() {
  if (!isLoggedIn()) {
    showToast('يجب تسجيل الدخول أولاً', 'error');
    setTimeout(function() {
      window.location.href = 'login.html';
    }, 1000);
    return false;
  }
  return true;
}
