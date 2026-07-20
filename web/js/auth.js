/* ==========================================================================
   ADAM SHOP - Auth Module (localStorage-based)
   ========================================================================== */

var AUTH_USERS_KEY = 'adam_shop_users';
var AUTH_SESSION_KEY = 'adam_shop_session';
var AUTH_CURRENT_USER_KEY = 'adam_shop_current_user';

function registerUser(userData) {
  var users = getAllUsers();
  var exists = users.some(function(u) {
    return u.phone === userData.phone;
  });
  if (exists) {
    return { success: false, message: 'هذا الرقم مسجل بالفعل' };
  }
  var user = {
    id: 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6),
    name: userData.name || '',
    phone: userData.phone || '',
    backupPhone: userData.backupPhone || '',
    location: userData.location || null,
    notes: userData.notes || '',
    role: 'CUSTOMER',
    createdAt: new Date().toISOString()
  };
  users.push(user);
  localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  localStorage.setItem(AUTH_SESSION_KEY, 'true');
  localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user));
  if (typeof updateUserMenu === 'function') updateUserMenu();
  return { success: true, user: user };
}

function loginUser(name, phone) {
  var users = getAllUsers();
  var user = users.find(function(u) {
    return u.phone === phone && u.name === name;
  });
  if (!user) {
    return { success: false, message: 'الاسم أو رقم الهاتف غير صحيح' };
  }
  localStorage.setItem(AUTH_SESSION_KEY, 'true');
  localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(user));
  if (typeof updateUserMenu === 'function') updateUserMenu();
  return { success: true, user: user };
}

function logout() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem(AUTH_CURRENT_USER_KEY);
  if (typeof updateUserMenu === 'function') updateUserMenu();
}

function isLoggedIn() {
  return localStorage.getItem(AUTH_SESSION_KEY) === 'true' && getUser() !== null;
}

function getUser() {
  try {
    var raw = localStorage.getItem(AUTH_CURRENT_USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function updateUser(data) {
  var user = getUser();
  if (!user) return { success: false, message: 'غير مسجل الدخول' };
  var updated = Object.assign({}, user, data);
  localStorage.setItem(AUTH_CURRENT_USER_KEY, JSON.stringify(updated));
  var users = getAllUsers();
  var idx = users.findIndex(function(u) { return u.id === user.id; });
  if (idx !== -1) {
    users[idx] = updated;
    localStorage.setItem(AUTH_USERS_KEY, JSON.stringify(users));
  }
  if (typeof updateUserMenu === 'function') updateUserMenu();
  return { success: true, user: updated };
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

function isSeller() {
  var user = getUser();
  return user && (user.role === 'SELLER' || user.role === 'ADMIN');
}

function isAdmin() {
  var user = getUser();
  return user && user.role === 'ADMIN';
}

function getToken() {
  return isLoggedIn() ? 'local_token' : null;
}

function getProfile() {
  return getUser();
}

function getAllUsers() {
  try {
    var raw = localStorage.getItem(AUTH_USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}
