/* ==========================================================================
   Adam Shop - API Client
   ========================================================================== */

const API_BASE = localStorage.getItem('api_url') || 'http://localhost:5000/api';

function getAuthToken() {
  return localStorage.getItem('token') || '';
}

function getRefreshToken() {
  return localStorage.getItem('refreshToken') || '';
}

function setAuthTokens(accessToken, refreshToken) {
  localStorage.setItem('token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
}

function clearAuthTokens() {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}

function buildHeaders(token, isFormData) {
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    const stored = getAuthToken();
    if (stored) {
      headers['Authorization'] = `Bearer ${stored}`;
    }
  }
  return headers;
}

async function handleResponse(response) {
  if (response.status === 401) {
    const refreshed = await tryRefreshToken();
    if (refreshed) {
      return null;
    }
    clearAuthTokens();
    if (typeof showToast === 'function') {
      showToast(getTranslatedError('session_expired'), 'error');
    }
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1000);
    throw new Error('Unauthorized');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data.message || data.error || getTranslatedError('request_failed');
    throw new Error(message);
  }

  return data;
}

function getTranslatedError(key) {
  if (typeof translations !== 'undefined' && typeof t === 'function') {
    return t(`errors.${key}`) || key;
  }
  return key;
}

async function tryRefreshToken() {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    });

    if (!response.ok) return false;

    const data = await response.json();
    if (data.token) {
      setAuthTokens(data.token, data.refreshToken || refreshToken);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function apiGet(endpoint, token) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = buildHeaders(token || null, false);

  try {
    let response = await fetch(url, {
      method: 'GET',
      headers
    });

    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        response = await fetch(url, {
          method: 'GET',
          headers: buildHeaders(null, false)
        });
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Unauthorized') throw error;
    console.error('API GET Error:', error);
    throw new Error(getTranslatedError('network_error'));
  }
}

async function apiPost(endpoint, data, token) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = buildHeaders(token || null, false);

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        response = await fetch(url, {
          method: 'POST',
          headers: buildHeaders(null, false),
          body: JSON.stringify(data)
        });
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Unauthorized') throw error;
    console.error('API POST Error:', error);
    throw new Error(getTranslatedError('network_error'));
  }
}

async function apiPut(endpoint, data, token) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = buildHeaders(token || null, false);

  try {
    let response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        response = await fetch(url, {
          method: 'PUT',
          headers: buildHeaders(null, false),
          body: JSON.stringify(data)
        });
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Unauthorized') throw error;
    console.error('API PUT Error:', error);
    throw new Error(getTranslatedError('network_error'));
  }
}

async function apiDelete(endpoint, token) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = buildHeaders(token || null, false);

  try {
    let response = await fetch(url, {
      method: 'DELETE',
      headers
    });

    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        response = await fetch(url, {
          method: 'DELETE',
          headers: buildHeaders(null, false)
        });
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Unauthorized') throw error;
    console.error('API DELETE Error:', error);
    throw new Error(getTranslatedError('network_error'));
  }
}

async function apiUpload(endpoint, formData, token) {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint}`;
  const headers = buildHeaders(token || null, true);

  try {
    let response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData
    });

    if (response.status === 401) {
      const refreshed = await tryRefreshToken();
      if (refreshed) {
        response = await fetch(url, {
          method: 'POST',
          headers: buildHeaders(null, true),
          body: formData
        });
      }
    }

    return handleResponse(response);
  } catch (error) {
    if (error.message === 'Unauthorized') throw error;
    console.error('API Upload Error:', error);
    throw new Error(getTranslatedError('upload_failed'));
  }
}
