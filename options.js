// ===================================================================
// 4:20 Tracker — Options page logic
// ===================================================================

const DEFAULTS = {
  timezoneMode: 'all',
  soundEnabled: true,
  durationSec: 6,
  position: 'top-right',
  size: 'medium',
  enabled: true,
  brandChannel: '',
  brandLink: '',
  brandTagline: '',
  brandLogoUrl: '',
};

const $ = (id) => document.getElementById(id);

// Small inline cannabis-leaf SVG for status text (uses currentColor).
const LEAF = '<svg viewBox="0 0 100 100" width="16" height="16" fill="currentColor" style="vertical-align:-3px;margin-right:5px" aria-hidden="true"><path d="M 47.28,6.45 L 48.42,7.02 L 49.28,9.03 L 51,17.91 L 52.15,18.77 L 52.44,23.07 L 53.87,22.78 L 53.87,18.77 L 55.59,15.23 L 57.31,11.49 L 58.74,7.18 L 61.04,5.46 L 64.49,5.75 L 67.08,8.05 L 67.94,12.07 L 67.65,16.09 L 66.79,20.4 L 65.35,24.71 L 63.63,28.82 L 61.61,32.93 L 59.88,37.24 L 58.74,41.84 L 59.31,43.85 L 61.32,42.99 L 63.92,40.4 L 66.79,37.52 L 70.24,34.36 L 74.26,31.2 L 78.57,28.32 L 82.88,25.86 L 86.62,24.27 L 89.5,24.27 L 91.51,26.28 L 91.51,29.44 L 89.21,32.9 L 85.75,35.78 L 81.73,38.66 L 77.42,41.26 L 73.11,43.56 L 69.08,45.58 L 65.35,47.3 L 64.49,49.02 L 66.5,49.88 L 70.24,49.88 L 74.55,49.88 L 79.15,49.88 L 83.46,50.46 L 87.19,51.9 L 89.5,54.2 L 89.5,57.07 L 87.48,59.37 L 83.75,60.24 L 79.15,60.24 L 74.26,59.66 L 69.66,58.51 L 65.35,57.07 L 61.61,55.35 L 58.45,53.62 L 57.02,54.77 L 57.6,57.36 L 59.03,61.1 L 60.46,65.41 L 61.9,69.72 L 62.76,74.03 L 62.76,77.76 L 61.32,80.07 L 58.74,80.64 L 56.16,79.2 L 54.43,75.75 L 53.29,71.44 L 52.43,66.84 L 51.86,62.53 L 51.57,58.51 L 51.28,55.06 L 50.71,53.62 L 50.13,55.06 L 49.85,58.51 L 49.56,62.53 L 48.99,66.84 L 48.13,71.44 L 46.99,75.75 L 45.27,79.2 L 42.68,80.64 L 40.1,80.07 L 38.66,77.76 L 38.66,74.03 L 39.52,69.72 L 40.96,65.41 L 42.39,61.1 L 43.82,57.36 L 44.4,54.77 L 42.97,53.62 L 39.81,55.35 L 36.07,57.07 L 31.76,58.51 L 27.16,59.66 L 22.27,60.24 L 17.67,60.24 L 13.94,59.37 L 11.92,57.07 L 11.92,54.2 L 14.23,51.9 L 17.96,50.46 L 22.27,49.88 L 26.58,49.88 L 30.89,49.88 L 34.62,49.88 L 36.64,49.02 L 35.78,47.3 L 32.04,45.58 L 28.02,43.56 L 23.71,41.26 L 19.4,38.66 L 15.38,35.78 L 11.92,32.9 L 9.62,29.44 L 9.62,26.28 L 11.63,24.27 L 14.51,24.27 L 18.24,24.27 L 21.99,25.86 L 26.29,28.32 L 30.6,31.2 L 34.62,34.36 L 38.08,37.52 L 40.96,40.4 L 43.54,42.99 L 45.56,43.85 L 46.13,41.84 L 44.98,37.24 L 43.25,32.93 L 41.53,28.82 L 39.81,24.71 L 38.38,20.4 L 37.52,16.09 L 37.23,12.07 L 38.08,8.05 L 40.68,5.75 L 44.12,5.46 L 46.41,7.18 L 47.85,11.49 L 49.56,15.23 L 51.28,18.77 L 51.28,22.78 L 52.72,23.07 Z"/></svg>';

async function load() {
  const s = await chrome.storage.sync.get(DEFAULTS);
  $('enabled').checked       = s.enabled;
  $('timezoneMode').value    = s.timezoneMode;
  $('position').value        = s.position;
  $('size').value            = s.size;
  $('durationSec').value     = s.durationSec;
  $('soundEnabled').checked  = s.soundEnabled;
  $('brandChannel').value    = s.brandChannel;
  $('brandLink').value       = s.brandLink;
  $('brandTagline').value    = s.brandTagline;
  $('brandLogoUrl').value    = s.brandLogoUrl;
  updateLogoPreview(s.brandLogoUrl);
  refreshStatus();
  refreshUpdateBanner();
}

// Show the update banner if a newer version is available on GitHub.
async function refreshUpdateBanner() {
  try {
    const info = await chrome.runtime.sendMessage({ type: 'GET_UPDATE_STATUS' });
    if (info && info.hasUpdate) {
      $('updateVersion').textContent = info.latestVersion;
      $('currentVersion').textContent = info.currentVersion;
      $('updateBanner').style.display = 'flex';
      $('updateLink').onclick = (e) => {
        e.preventDefault();
        chrome.tabs.create({ url: info.downloadUrl });
      };
    } else {
      $('updateBanner').style.display = 'none';
    }
  } catch (e) {
    $('updateBanner').style.display = 'none';
  }
}

async function save() {
  const settings = {
    enabled:       $('enabled').checked,
    timezoneMode:  $('timezoneMode').value,
    position:      $('position').value,
    size:          $('size').value,
    durationSec:   Math.max(1, parseInt($('durationSec').value, 10) || 6),
    soundEnabled:  $('soundEnabled').checked,
    brandChannel:  $('brandChannel').value.trim(),
    brandLink:     $('brandLink').value.trim(),
    brandTagline:  $('brandTagline').value.trim(),
    brandLogoUrl:  $('brandLogoUrl').value.trim(),
  };
  await chrome.storage.sync.set(settings);
}

// Show/hide the logo preview based on the entered URL.
// Accepts http(s) URLs and data: URLs (so users can paste a base64 image
// directly to test without needing to host the file).
function updateLogoPreview(url) {
  const img = $('logoPreview');
  if (url && /^(https?:|data:)/i.test(url)) {
    img.src = url;
    img.classList.remove('hidden');
    img.onerror = () => img.classList.add('hidden');
  } else {
    img.classList.add('hidden');
    img.removeAttribute('src');
  }
}

async function refreshStatus() {
  const el = $('nextUp');
  try {
    // Promise form (no callback) — avoids the MV3 "message channel closed"
    // warning that callback-style sendMessage produces when the service
    // worker sleeps between polls.
    const res = await chrome.runtime.sendMessage({ type: 'GET_STATUS' });
    if (!res || !res.next) {
      el.innerHTML = `${LEAF}Tracker is running.`;
      return;
    }
    const mins = res.next.minutesUntil;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;
    el.innerHTML = `${LEAF}Next 4:20: ${res.next.city} — in ${timeStr} (${res.zoneCount} zones tracked)`;
  } catch (e) {
    // Service worker may be waking up — fail gracefully to the idle state.
    el.innerHTML = `${LEAF}Tracker is running.`;
  }
}

// Wire up inputs — save on any change.
['enabled','timezoneMode','position','size','durationSec','soundEnabled','brandChannel','brandLink','brandTagline'].forEach((id) => {
  $(id).addEventListener('change', () => { save(); refreshStatus(); });
});
// Branding text fields also save on `input` so typing persists immediately.
['brandChannel','brandLink','brandTagline'].forEach((id) => {
  $(id).addEventListener('input', () => { save(); });
});
// Logo URL updates the preview live on each keystroke.
$('brandLogoUrl').addEventListener('input', () => {
  updateLogoPreview($('brandLogoUrl').value.trim());
  save();
});

// "Populate default image" — loads the bundled default-logo.png and fills
// the Logo URL field with its base64 data URL. Handy for testing without
// needing to host an image or paste a long string.
$('populateDefaultLogo').addEventListener('click', async () => {
  try {
    const url = chrome.runtime.getURL('icons/default-logo.png');
    const blob = await (await fetch(url)).blob();
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result;
      $('brandLogoUrl').value = dataUrl;
      updateLogoPreview(dataUrl);
      await save();
      const btn = $('populateDefaultLogo');
      const orig = btn.textContent;
      btn.textContent = 'Added!';
      setTimeout(() => { btn.textContent = orig; }, 1500);
    };
    reader.readAsDataURL(blob);
  } catch (e) {
    console.log('Could not load default logo:', e);
  }
});

// Toggle the city-list panel open/closed.
$('tzInfoBtn').addEventListener('click', () => {
  $('cityPanel').classList.toggle('open');
});

// Test popup fires the real popup in the active tab.
$('testBtn').addEventListener('click', () => {
  try { chrome.runtime.sendMessage({ type: 'TEST_POPUP', city: 'Test City', sound: $('soundEnabled').checked }); } catch (_) {}
});

// "Fire real 4:20 now" — simulate an actual 4:20 firing. Uses the real
// firePopup path with a real timezone so it behaves exactly like a genuine
// announcement (opens example.com if needed, fires the green popup).
$('fireRealBtn').addEventListener('click', () => {
  try {
    chrome.runtime.sendMessage({
      type: 'FIRE_REAL_420',
      city: 'London',   // pretend it just hit 4:20 in London
    });
  } catch (_) {}
});

// "Reset fired cache" — clears the once-per-day dedup so popups can fire
// again for cities that already fired today (useful for testing).
$('resetCacheBtn').addEventListener('click', async () => {
  try {
    await chrome.runtime.sendMessage({ type: 'RESET_CACHE' });
    $('resetCacheBtn').textContent = 'Cache reset!';
    setTimeout(() => { $('resetCacheBtn').textContent = 'Reset fired cache'; }, 2000);
  } catch (_) {}
});

load();
setInterval(refreshStatus, 30_000); // keep countdown fresh
