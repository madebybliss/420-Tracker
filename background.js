// ===================================================================
// 4:20 Tracker — Background Service Worker
// Fires a popup the moment 4:20 PM hits in any tracked timezone.
// ===================================================================

// ---- DEFAULT SETTINGS (user can override in options page) --------
const DEFAULT_SETTINGS = {
  timezoneMode: 'all',        // 'all' = every major zone, 'major' = key cities only
  soundEnabled: true,         // play chime on popup
  durationSec: 6,             // how long popup stays before auto-dismiss
  position: 'top-right',      // 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right'
  size: 'medium',             // 'small' | 'medium' | 'large'
  bgColor: '#1a3a24',         // popup background colour
  textColor: '#eafff0',       // popup text colour
  enabled: true,              // master on/off
  // Streamer branding (optional). Shown on every popup when brandChannel is set.
  brandChannel: '',           // e.g. "Bliss TV"
  brandLink: '',              // e.g. "https://youtube.com/@bliss"
  brandTagline: '',           // e.g. "Medical cannabis education"
  brandLogoUrl: '',           // e.g. "https://example.com/avatar.png"
};

// ---- TIMEZONES ----------------------------------------------------
// Every major timezone offset that observes a 4:20 PM.
// `city` is the friendly name shown in the popup. `tz` is the IANA
// timezone id used to compute local time. `offset` is the standard
// UTC offset in hours (for ordering / dedup).
const TIMEZONES = [
  { city: 'Auckland',      tz: 'Pacific/Auckland',    offset: 12 },
  { city: 'Sydney',        tz: 'Australia/Sydney',    offset: 10 },
  { city: 'Brisbane',      tz: 'Australia/Brisbane',  offset: 10 },
  { city: 'Tokyo',         tz: 'Asia/Tokyo',          offset: 9  },
  { city: 'Seoul',         tz: 'Asia/Seoul',          offset: 9  },
  { city: 'Hong Kong',     tz: 'Asia/Hong_Kong',      offset: 8  },
  { city: 'Singapore',     tz: 'Asia/Singapore',      offset: 8  },
  { city: 'Bangkok',       tz: 'Asia/Bangkok',        offset: 7  },
  { city: 'Jakarta',       tz: 'Asia/Jakarta',        offset: 7  },
  { city: 'Dhaka',         tz: 'Asia/Dhaka',          offset: 6  },
  { city: 'Mumbai',        tz: 'Asia/Kolkata',        offset: 5.5 },
  { city: 'Karachi',       tz: 'Asia/Karachi',        offset: 5  },
  { city: 'Tashkent',      tz: 'Asia/Tashkent',       offset: 5  },
  { city: 'Dubai',         tz: 'Asia/Dubai',          offset: 4  },
  { city: 'Baku',          tz: 'Asia/Baku',           offset: 4  },
  { city: 'Moscow',        tz: 'Europe/Moscow',       offset: 3  },
  { city: 'Nairobi',       tz: 'Africa/Nairobi',      offset: 3  },
  { city: 'Cairo',         tz: 'Africa/Cairo',        offset: 2  },
  { city: 'Athens',        tz: 'Europe/Athens',       offset: 2  },
  { city: 'Amsterdam',     tz: 'Europe/Amsterdam',    offset: 1  },
  { city: 'Berlin',        tz: 'Europe/Berlin',       offset: 1  },
  { city: 'Paris',         tz: 'Europe/Paris',        offset: 1  },
  { city: 'Rome',          tz: 'Europe/Rome',         offset: 1  },
  { city: 'Madrid',        tz: 'Europe/Madrid',       offset: 1  },
  { city: 'London',        tz: 'Europe/London',       offset: 0  },
  { city: 'Lagos',         tz: 'Africa/Lagos',        offset: 0  },
  { city: 'Casablanca',    tz: 'Africa/Casablanca',   offset: 0  },
  { city: 'Reykjavik',     tz: 'Atlantic/Reykjavik',  offset: 0  },
  { city: 'New York',      tz: 'America/New_York',    offset: -5 },
  { city: 'Toronto',       tz: 'America/Toronto',     offset: -5 },
  { city: 'Miami',         tz: 'America/New_York',    offset: -5 },
  { city: 'Chicago',       tz: 'America/Chicago',     offset: -6 },
  { city: 'Mexico City',   tz: 'America/Mexico_City', offset: -6 },
  { city: 'Denver',        tz: 'America/Denver',      offset: -7 },
  { city: 'Phoenix',       tz: 'America/Phoenix',     offset: -7 },
  { city: 'Los Angeles',   tz: 'America/Los_Angeles', offset: -8 },
  { city: 'Vancouver',     tz: 'America/Vancouver',   offset: -8 },
  { city: 'Anchorage',     tz: 'America/Anchorage',   offset: -9 },
  { city: 'Honolulu',      tz: 'Pacific/Honolulu',    offset: -10 },
];

// Subset for "major zones only" mode — the iconic 4:20 cities.
const MAJOR_ONLY = ['Auckland','Sydney','Tokyo','Hong Kong','Singapore','Mumbai','Dubai','Moscow','Berlin','Amsterdam','London','New York','Chicago','Denver','Los Angeles','Honolulu'];

// ---- HELPERS ------------------------------------------------------

// Read settings, merged with defaults.
async function getSettings() {
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  return { ...DEFAULT_SETTINGS, ...stored };
}

// Returns the list of timezones the user currently wants tracked.
function activeZones(mode) {
  if (mode === 'major') return TIMEZONES.filter(z => MAJOR_ONLY.includes(z.city));
  return TIMEZONES;
}

// Format the time in a given IANA timezone using Intl. Returns {hour, minute}.
function getZoneTime(tz) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false
  }).formatToParts(new Date());
  const h = parseInt(parts.find(p => p.type === 'hour').value, 10);
  const m = parseInt(parts.find(p => p.type === 'minute').value, 10);
  // Intl can return 24 for midnight; normalise.
  return { hour: h === 24 ? 0 : h, minute: m };
}

// Returns today's YYYY-MM-DD key for a given timezone (used to dedup firing).
function getZoneDate(tz) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz }).format(new Date());
}

// ------------------------------------------------------------------
// MAIN TICK — runs once a minute via chrome.alarms.
// Checks every active timezone; the first time we see a zone sitting
// at exactly 16:20 local time we fire the popup for it.
// ------------------------------------------------------------------
async function tick() {
  const settings = await getSettings();
  if (!settings.enabled) return;

  const zones = activeZones(settings.timezoneMode);

  // Load the set of "already-fired" keys for today so we never spam.
  const { firedToday = {} } = await chrome.storage.local.get('firedToday');
  // Clean: drop any fired keys from a previous date in any zone.
  // (Simplest: wipe storage at first 4:20-zone-day boundary mismatch.)
  const cleaned = {};
  let dirty = false;
  for (const [key, val] of Object.entries(firedToday)) {
    const [dateStr] = key.split('|');
    if (dateStr === val.date) cleaned[key] = val;
    else dirty = true;
  }

  for (const zone of zones) {
    const { hour, minute } = getZoneTime(zone.tz);
    if (hour !== 16 || minute !== 20) continue; // not 4:20 here

    const dateStr = getZoneDate(zone.tz);
    const key = `${dateStr}|${zone.city}`;
    if (cleaned[key]) continue; // already announced this 4:20

    // Fire!
    cleaned[key] = { date: dateStr, firedAt: Date.now() };
    await firePopup(zone, settings);
  }

  await chrome.storage.local.set({ firedToday: cleaned });
  if (dirty) await chrome.storage.local.set({ firedToday: cleaned });
}

// Poll a tab until its content script responds, or until timeoutMs elapses.
// Resolves true if the script is ready, false on timeout. This avoids the
// race where we message a freshly-opened tab before its content script has
// injected (which used to trigger the OS-notification fallback).
async function waitForContentScript(tabId, timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const res = await chrome.tabs.sendMessage(tabId, { type: 'PING_420' });
      if (res && res.ok) return true;
    } catch (e) {
      // Script not injected yet — wait and retry.
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  return false;
}

// Fire the popup into the active tab and (optionally) play a sound.
//
// Behaviour:
//   - Real 4:20 announcement (zone.tz != 'UTC'): if there's no usable
//     browser tab to inject into, STAY SILENT. We never fire OS-level
//     desktop notifications for real announcements — they're jarring when
//     the user isn't even looking at a browser.
//   - Manual test (zone.tz === 'UTC'): always try to show something by
//     opening a fresh tab if needed.
async function firePopup(zone, settings) {
  const isTest = zone.tz === 'UTC';

  const messagePayload = {
    type: 'SHOW_420',
    city: zone.city,
    position: settings.position,
    size: settings.size,
    bgColor: settings.bgColor,
    textColor: settings.textColor,
    durationSec: settings.durationSec,
    soundEnabled: settings.soundEnabled,
    brandChannel: settings.brandChannel,
    brandLink: settings.brandLink,
    brandTagline: settings.brandTagline,
    brandLogoUrl: settings.brandLogoUrl,
  };

  const fireInto = async (target) => {
    const payload = { ...messagePayload, animation: positionToAnimation(settings.position) };
    await chrome.tabs.sendMessage(target.id, payload);
  };

  // Open a fresh normal webpage and fire the popup there. Used for tests.
  const openAndFire = async () => {
    const tab = await chrome.tabs.create({ url: 'https://example.com', active: true });
    const ready = await waitForContentScript(tab.id, 8000);
    if (ready) await fireInto(tab);
  };

  try {
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // No usable active tab (no tab at all, or a restricted chrome:// page).
    if (!tab || isRestrictedUrl(tab.url)) {
      if (isTest) {
        await openAndFire();
      }
      // Real announcement + no browser tab → do nothing (stay silent).
      return;
    }

    // Try to message the active tab.
    try {
      await fireInto(tab);
    } catch (sendErr) {
      // Content script not present in this tab. Tests recover by opening a
      // new page; real announcements stay silent.
      if (isTest) await openAndFire();
    }
  } catch (e) {
    // Total failure — only show the fallback for manual tests, never for
    // real announcements.
    if (isTest) showFallbackNotification(zone);
  }
}

// Derive the entrance animation from the chosen fixed position so the popup
// always slides/fades in naturally from its anchored corner/edge.
//   corners  -> diagonal slide-in from that corner
//   top/bottom-center -> zoom/fade
//   left/right edges aren't separate positions (every row has a horizontal slot)
function positionToAnimation(position) {
  switch (position) {
    case 'top-left':      return 'slide-tl';
    case 'top-right':     return 'slide-tr';
    case 'bottom-left':   return 'slide-bl';
    case 'bottom-right':  return 'slide-br';
    case 'top-center':    return 'slide-top';
    case 'bottom-center': return 'slide-bottom';
    default:              return 'fade';
  }
}

function isRestrictedUrl(url) {
  // No URL usually means we lack permission to read it (e.g. a chrome-
  // internal page). Treat that as restricted so we don't try to inject.
  if (!url) return true;
  return url.startsWith('chrome://') || url.startsWith('chrome-extension://') || url.startsWith('edge://') || url.startsWith('about:') || url.startsWith('https://chrome.google.com/webstore');
}

function showFallbackNotification(zone) {
  chrome.notifications.create({
    type: 'basic',
    iconUrl: 'icons/icon128.png',
    title: "It's 4:20!",
    message: `Hey! It's 4:20 in ${zone.city}!`,
    priority: 2,
  });
}

// ------------------------------------------------------------------
// ALARM + INSTALL LIFECYCLE
// ------------------------------------------------------------------
chrome.runtime.onInstalled.addListener(async () => {
  await chrome.storage.sync.set(await getSettings());
  // Fire every minute — service workers may sleep, but alarms wake us.
  chrome.alarms.create('tick', { periodInMinutes: 1 });
  // Check for updates once a day.
  chrome.alarms.create('check-update', { periodInMinutes: 60 * 24 });
  checkForUpdate(); // also check right after install/update
  console.log('[4:20 Tracker] Installed and ticking every 60s.');
});

chrome.runtime.onStartup.addListener(() => {
  chrome.alarms.create('tick', { periodInMinutes: 1 });
  chrome.alarms.create('check-update', { periodInMinutes: 60 * 24 });
  checkForUpdate(); // check each time the browser starts
  console.log('[4:20 Tracker] Started — ticking every 60s.');
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'tick') tick();
  else if (alarm.name === 'check-update') checkForUpdate();
});

// ------------------------------------------------------------------
// UPDATE CHECK
// Pings GitHub's releases API to compare the installed version against
// the latest release. Stores the result so the popup/options UI can show
// an "update available" banner. Unpacked extensions can't self-update —
// the user has to download the new zip and reload — but we can notify.
// ------------------------------------------------------------------
const UPDATE_REPO = 'madebybliss/420-Tracker';

async function checkForUpdate() {
  try {
    const res = await fetch(`https://api.github.com/repos/${UPDATE_REPO}/releases/latest`, {
      headers: { 'Accept': 'application/vnd.github+json' },
    });
    if (!res.ok) return;
    const data = await res.json();
    const remoteTag = (data.tag_name || '').replace(/^v/, ''); // 'v1.3.6' -> '1.3.6'
    const localVersion = chrome.runtime.getManifest().version;
    const hasUpdate = remoteTag && compareVersions(remoteTag, localVersion) > 0;
    const result = {
      hasUpdate,
      latestVersion: remoteTag,
      currentVersion: localVersion,
      downloadUrl: (data.assets && data.assets[0] && data.assets[0].browser_download_url)
        || data.html_url
        || `https://github.com/${UPDATE_REPO}/releases/latest`,
      releaseNotes: data.html_url || `https://github.com/${UPDATE_REPO}/releases/latest`,
      checkedAt: Date.now(),
    };
    await chrome.storage.local.set({ updateInfo: result });
    console.log('[4:20 Tracker] Update check:', hasUpdate
      ? `v${localVersion} -> v${remoteTag} available`
      : `up to date (v${localVersion})`);
  } catch (e) {
    // Network failure / offline — silently skip. We'll retry next day or on startup.
    console.log('[4:20 Tracker] Update check failed:', e && e.message);
  }
}

// Returns >0 if a is newer than b, 0 if equal, <0 if a is older.
function compareVersions(a, b) {
  const pa = String(a).split('.').map((n) => parseInt(n, 10) || 0);
  const pb = String(b).split('.').map((n) => parseInt(n, 10) || 0);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

// Manual "test popup" / status messages from the popup/options page.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  // Safe sendResponse — swallows the "channel closed" error that MV3 throws
  // when the calling page navigates away or the service worker slept. The
  // warning is harmless but noisy, so we suppress it.
  const safeRespond = (payload) => {
    try { sendResponse(payload); } catch (_) { /* channel already closed */ }
  };

  if (msg.type === 'TEST_POPUP') {
    // Fire-and-forget: the calling page ignores the response, so we don't
    // keep the channel open (avoids the async-response warning).
    (async () => {
      const settings = await getSettings();
      const fakeZone = { city: msg.city || 'Test City', tz: 'UTC' };
      await firePopup(fakeZone, { ...settings, soundEnabled: msg.sound ?? settings.soundEnabled });
      safeRespond({ ok: true });
    })();
    return false;
  }
  if (msg.type === 'GET_STATUS') {
    (async () => {
      const settings = await getSettings();
      const zones = activeZones(settings.timezoneMode);
      // Next upcoming 4:20 across active zones
      let next = null;
      for (const zone of zones) {
        const { hour, minute } = getZoneTime(zone.tz);
        let minutesUntil = (16 * 60 + 20) - (hour * 60 + minute);
        if (minutesUntil <= 0) minutesUntil += 24 * 60;
        if (!next || minutesUntil < next.minutesUntil) {
          next = { minutesUntil, city: zone.city };
        }
      }
      safeRespond({ settings, zoneCount: zones.length, next });
    })();
    return true; // async response — channel kept open for GET_STATUS
  }
  if (msg.type === 'GET_UPDATE_STATUS') {
    // Return cached update info immediately; optionally refresh first.
    (async () => {
      if (msg.refresh) await checkForUpdate();
      const { updateInfo } = await chrome.storage.local.get('updateInfo');
      safeRespond(updateInfo || { hasUpdate: false, currentVersion: chrome.runtime.getManifest().version });
    })();
    return true;
  }
  if (msg.type === 'FIRE_REAL_420') {
    // Simulate a genuine 4:20 announcement — uses the real firePopup path
    // (so it respects the silent-when-no-tab rule and opens example.com if
    // needed) but with a real timezone so it's not treated as a test.
    (async () => {
      const settings = await getSettings();
      const zone = { city: msg.city || 'London', tz: 'Europe/London' };
      await firePopup(zone, settings);
      safeRespond({ ok: true });
    })();
    return false;
  }
  if (msg.type === 'RESET_CACHE') {
    // Clear the once-per-day dedup so popups can fire again for testing.
    (async () => {
      await chrome.storage.local.remove('firedToday');
      console.log('[4:20 Tracker] Fired-today cache reset.');
      safeRespond({ ok: true });
    })();
    return true;
  }
});
