/* ==========================================================================
   ADAM SHOP - Location Management Module
   ========================================================================== */

var LOC_LAST_KEY = 'adam_shop_last_location';
var LOC_SAVED_KEY = 'adam_shop_saved_location';

function saveLastOrderLocation(location) {
  localStorage.setItem(LOC_LAST_KEY, JSON.stringify(location));
}

function getLastOrderLocation() {
  try {
    var raw = localStorage.getItem(LOC_LAST_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function hasLocation() {
  return getLastOrderLocation() !== null;
}

function saveSavedLocation(location) {
  localStorage.setItem(LOC_SAVED_KEY, JSON.stringify(location));
}

function getSavedLocation() {
  try {
    var raw = localStorage.getItem(LOC_SAVED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

function removeSavedLocation() {
  localStorage.removeItem(LOC_SAVED_KEY);
}

function showGoogleMapsPicker(callback) {
  var existing = document.getElementById('osmPickerModal');
  if (existing) existing.remove();

  var defaultLat = 32.9;
  var defaultLng = 13.18;
  var saved = getSavedLocation() || getLastOrderLocation();
  if (saved && saved.lat && saved.lng) {
    defaultLat = parseFloat(saved.lat);
    defaultLng = parseFloat(saved.lng);
  }

  var overlay = document.createElement('div');
  overlay.id = 'osmPickerModal';
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = '<div class="modal-box" style="max-width:700px;padding:24px">' +
    '<button class="modal-close" onclick="closeOSMPicker()" style="font-size:1.3rem">✕</button>' +
    '<h3 class="modal-title" style="margin-bottom:12px">📍 حدد موقعك على الخريطة</h3>' +
    '<div style="position:relative;margin-bottom:12px">' +
      '<input type="text" class="form-input" id="osmSearchInput" placeholder="ابحث عن عنوان..." style="padding-left:40px">' +
      '<button onclick="searchOSMAddress()" style="position:absolute;left:4px;top:50%;transform:translateY(-50%);background:var(--accent);color:#fff;border:none;border-radius:8px;width:34px;height:34px;font-size:1rem;cursor:pointer">🔍</button>' +
    '</div>' +
    '<div style="font-size:0.78rem;color:var(--text-4);margin-bottom:8px">يمكنك البحث أو سحب العلامة على الخريطة لاختيار الموقع</div>' +
    '<div id="osmMapContainer" style="width:100%;height:350px;border-radius:var(--radius);overflow:hidden;border:1px solid var(--border);position:relative">' +
      '<iframe id="osmMapFrame" width="100%" height="100%" style="border:0" allowfullscreen loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=' + (defaultLng - 0.02) + ',' + (defaultLat - 0.01) + ',' + (defaultLng + 0.02) + ',' + (defaultLat + 0.01) + '&layer=mapnik&marker=' + defaultLat + ',' + defaultLng + '"></iframe>' +
      '<div id="osmDragHint" style="position:absolute;bottom:8px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.7);color:#fff;padding:6px 14px;border-radius:20px;font-size:0.75rem;pointer-events:none">اضغط على الخريطة لاختيار الموقع</div>' +
    '</div>' +
    '<div id="osmSelectedInfo" style="margin-top:12px;display:none">' +
      '<div style="font-size:0.82rem;font-weight:600;margin-bottom:6px">📍 الموقع المحدد:</div>' +
      '<div id="osmSelectedAddress" class="loc-address" style="background:var(--bg-3);border:1px solid var(--border);border-radius:var(--radius);padding:12px;font-size:0.85rem"></div>' +
      '<div id="osmSelectedCoords" style="font-size:0.75rem;color:var(--text-4);margin-top:4px"></div>' +
    '</div>' +
    '<div class="loc-actions" style="margin-top:16px;display:flex;gap:12px">' +
      '<button class="btn btn-outline" onclick="closeOSMPicker()" style="flex:1">إلغاء</button>' +
      '<button class="btn btn-gold" id="osmConfirmBtn" onclick="confirmOSMPicker()" style="flex:1" disabled>تأكيد الموقع</button>' +
    '</div>' +
  '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeOSMPicker();
  });

  window._osmPickerState = {
    lat: defaultLat,
    lng: defaultLng,
    address: saved ? (saved.address || '') : '',
    callback: callback
  };

  var mapContainer = document.getElementById('osmMapContainer');
  mapContainer.addEventListener('click', function(e) {
    if (e.target.tagName === 'IFRAME') {
      setTimeout(function() {
        var hint = document.getElementById('osmDragHint');
        if (hint) hint.style.display = 'none';
        document.getElementById('osmConfirmBtn').disabled = false;
      }, 1500);
    }
  });

  setTimeout(function() {
    document.getElementById('osmConfirmBtn').disabled = false;
    var hint = document.getElementById('osmDragHint');
    if (hint) hint.style.display = 'none';
  }, 2000);

  document.getElementById('osmSearchInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      searchOSMAddress();
    }
  });
}

function searchOSMAddress() {
  var query = document.getElementById('osmSearchInput').value.trim();
  if (!query) return;

  var hint = document.getElementById('osmDragHint');
  if (hint) {
    hint.textContent = 'جاري البحث...';
    hint.style.display = 'block';
  }

  fetch('https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1&accept-language=ar')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      if (data && data.length > 0) {
        var lat = parseFloat(data[0].lat);
        var lng = parseFloat(data[0].lon);
        var address = data[0].display_name || query;
        updateOSMPickerMap(lat, lng, address);
      } else {
        if (hint) {
          hint.textContent = 'لم يتم العثور على نتائج، جرب البحث بكلمات أخرى';
          setTimeout(function() { hint.style.display = 'none'; }, 3000);
        }
        showToast('لم يتم العثور على نتائج', 'error');
      }
    })
    .catch(function() {
      if (hint) hint.style.display = 'none';
      showToast('خطأ في البحث', 'error');
    });
}

function updateOSMPickerMap(lat, lng, address) {
  var frame = document.getElementById('osmMapFrame');
  if (frame) {
    frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + (lng - 0.02) + ',' + (lat - 0.01) + ',' + (lng + 0.02) + ',' + (lat + 0.01) + '&layer=mapnik&marker=' + lat + ',' + lng;
  }
  var state = window._osmPickerState;
  if (state) {
    state.lat = lat;
    state.lng = lng;
    state.address = address;
  }
  var info = document.getElementById('osmSelectedInfo');
  if (info) info.style.display = 'block';
  var addr = document.getElementById('osmSelectedAddress');
  if (addr) addr.textContent = address;
  var coords = document.getElementById('osmSelectedCoords');
  if (coords) coords.textContent = lat.toFixed(6) + ', ' + lng.toFixed(6);
  document.getElementById('osmConfirmBtn').disabled = false;
  var hint = document.getElementById('osmDragHint');
  if (hint) hint.style.display = 'none';
}

function confirmOSMPicker() {
  var state = window._osmPickerState;
  if (!state) return;
  var location = {
    lat: state.lat,
    lng: state.lng,
    address: state.address || document.getElementById('osmSearchInput').value || 'موقع محدد'
  };
  closeOSMPicker();
  if (typeof state.callback === 'function') {
    state.callback(location);
  }
}

function closeOSMPicker() {
  var modal = document.getElementById('osmPickerModal');
  if (modal) modal.remove();
  window._osmPickerState = null;
}

function showLocationConfirmModal(onConfirm, onChange) {
  var saved = getSavedLocation();
  if (!saved) {
    if (typeof onChange === 'function') onChange();
    else if (typeof onConfirm === 'function') onConfirm(null);
    return;
  }

  var existing = document.getElementById('locConfirmModal');
  if (existing) existing.remove();

  var overlay = document.createElement('div');
  overlay.id = 'locConfirmModal';
  overlay.className = 'modal-overlay active';
  overlay.innerHTML = '<div class="modal-box" style="max-width:440px">' +
    '<h3 class="modal-title" style="text-align:center;margin-bottom:4px">📍 هل ما زلت في هذا الموقع؟</h3>' +
    '<div style="text-align:center;margin-bottom:16px">' +
      '<div style="font-size:0.85rem;color:var(--text-3);margin-bottom:12px">آخر موقع مسجل:</div>' +
      '<div class="loc-address" style="background:var(--bg-3);border:1px solid var(--border);border-radius:var(--radius);padding:14px;font-size:0.88rem;text-align:center">' + (saved.address || 'موقع محفوظ') + '</div>' +
      (saved.lat && saved.lng ? '<div style="margin-top:8px"><iframe width="100%" height="150" style="border:0;border-radius:var(--radius)" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=' + (saved.lng - 0.01) + ',' + (saved.lat - 0.005) + ',' + (saved.lng + 0.01) + ',' + (saved.lat + 0.005) + '&layer=mapnik&marker=' + saved.lat + ',' + saved.lng + '"></iframe></div>' : '') +
    '</div>' +
    '<div class="loc-actions" style="display:flex;gap:12px">' +
      '<button class="btn btn-gold" onclick="confirmLocModal()" style="flex:1">نعم، استخدم هذا الموقع</button>' +
      '<button class="btn btn-outline" onclick="changeLocModal()" style="flex:1">لا، تحديد موقع جديد</button>' +
    '</div>' +
  '</div>';

  document.body.appendChild(overlay);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeLocConfirmModal();
  });

  window._locConfirmCallbacks = {
    onConfirm: onConfirm,
    onChange: onChange
  };
}

function confirmLocModal() {
  var saved = getSavedLocation();
  closeLocConfirmModal();
  var cbs = window._locConfirmCallbacks;
  if (cbs && typeof cbs.onConfirm === 'function') {
    cbs.onConfirm(saved);
  }
  window._locConfirmCallbacks = null;
}

function changeLocModal() {
  closeLocConfirmModal();
  var cbs = window._locConfirmCallbacks;
  showGoogleMapsPicker(function(location) {
    saveLastOrderLocation(location);
    if (cbs && typeof cbs.onChange === 'function') {
      cbs.onChange(location);
    } else if (cbs && typeof cbs.onConfirm === 'function') {
      cbs.onConfirm(location);
    }
    window._locConfirmCallbacks = null;
  });
}

function closeLocConfirmModal() {
  var modal = document.getElementById('locConfirmModal');
  if (modal) modal.remove();
}
