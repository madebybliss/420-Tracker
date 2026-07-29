// ===================================================================
// 4:20 Tracker — Content Script
// Receives SHOW_420 messages from the background and renders the
// animated cannabis-themed popup. One popup at a time.
// ===================================================================

(function () {
  const HOST_ID = 'four20-tracker-host';

  // Guard against duplicate injection (e.g. SPA navigations).
  if (window.__four20TrackerInjected) return;
  window.__four20TrackerInjected = true;

  // Preload the audio once so the first chime is instant.
  let audioPromise = null;
  function getAudio() {
    if (!audioPromise) {
      audioPromise = new Promise((resolve) => {
        const url = chrome.runtime.getURL('sounds/chime.mp3');
        const audio = new Audio(url);
        audio.preload = 'auto';
        audio.volume = 0.7;
        audio.addEventListener('canplaythrough', () => resolve(audio), { once: true });
        // Don't hang forever if the file is missing/blocked.
        setTimeout(() => resolve(audio), 1500);
      });
    }
    return audioPromise;
  }

  async function playChime() {
    try {
      const audio = await getAudio();
      audio.currentTime = 0;
      await audio.play();
    } catch (e) {
      // Autoplay may be blocked until user interacts — that's fine, the
      // visual still shows. Next popup (after a click anywhere) will play.
    }
  }

  function ensureHost() {
    let host = document.getElementById(HOST_ID);
    if (host) return host;
    host = document.createElement('div');
    host.id = HOST_ID;
    document.documentElement.appendChild(host);
    return host;
  }

  // Inline cannabis-leaf SVG (traced from the author's leaf image).
  // Path uses fill="currentColor" so it tints with the popup's text colour.
  const LEAF_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"
         width="100%" height="100%" preserveAspectRatio="xMidYMid meet"
         aria-hidden="true" focusable="false">
      <path d="M 47.28,6.45 L 48.42,7.02 L 49.28,9.03 L 51.0,17.91 L 52.15,18.77 L 52.44,23.07 L 53.87,22.78 L 53.87,27.08 L 55.3,27.36 L 55.01,31.38 L 56.45,31.66 L 56.45,34.24 L 55.59,36.25 L 57.02,36.25 L 56.16,40.26 L 57.59,40.54 L 56.16,44.84 L 57.59,45.42 L 55.87,48.85 L 56.73,50.57 L 55.01,53.15 L 55.59,54.58 L 54.15,56.59 L 54.44,58.31 L 52.72,62.32 L 51.58,68.62 L 49.57,72.92 L 49.86,73.78 L 51.58,70.34 L 52.15,70.06 L 52.72,71.2 L 56.45,65.76 L 55.87,62.89 L 55.3,64.04 L 53.87,64.61 L 54.44,61.17 L 55.3,60.6 L 55.59,58.88 L 57.02,58.02 L 57.02,54.87 L 58.17,54.01 L 58.45,51.72 L 59.6,51.15 L 60.17,49.14 L 61.6,48.57 L 61.89,45.99 L 63.61,45.13 L 63.61,43.41 L 65.04,42.84 L 66.19,39.97 L 67.34,40.54 L 67.91,39.97 L 69.34,37.39 L 70.2,37.68 L 72.21,35.39 L 73.64,35.39 L 75.36,33.38 L 76.22,33.38 L 81.09,29.37 L 85.67,22.78 L 85.96,23.64 L 83.38,28.22 L 81.66,33.09 L 81.95,34.53 L 80.52,37.11 L 81.09,38.25 L 79.37,40.54 L 79.66,42.55 L 77.36,45.42 L 78.22,45.99 L 78.22,47.42 L 75.93,50.29 L 76.5,51.43 L 66.19,62.61 L 66.76,64.04 L 64.76,64.33 L 56.73,70.63 L 58.45,71.49 L 58.17,72.64 L 59.03,72.92 L 71.06,67.48 L 74.21,61.75 L 73.64,61.46 L 68.19,67.77 L 68.48,66.05 L 69.91,64.9 L 71.35,62.03 L 69.05,62.03 L 67.62,62.89 L 69.05,61.17 L 70.49,61.17 L 71.92,59.74 L 73.35,60.03 L 74.79,58.6 L 76.5,59.17 L 78.22,57.74 L 80.23,58.02 L 81.38,57.16 L 82.81,57.74 L 84.53,56.59 L 86.53,56.88 L 92.26,55.73 L 100.0,52.87 L 99.14,54.01 L 92.55,58.02 L 89.68,60.89 L 85.67,61.75 L 85.39,62.32 L 86.53,62.89 L 85.1,63.75 L 85.96,65.47 L 82.52,67.19 L 83.09,68.62 L 79.66,69.48 L 79.08,71.2 L 75.93,71.2 L 75.36,73.5 L 70.49,73.5 L 69.91,74.36 L 65.33,74.64 L 64.76,75.79 L 59.31,75.79 L 57.88,76.65 L 58.74,77.22 L 57.59,77.51 L 57.88,78.65 L 60.17,78.08 L 58.74,79.23 L 59.03,79.8 L 63.04,77.79 L 69.63,78.37 L 69.91,79.23 L 74.21,80.09 L 74.79,80.95 L 77.36,81.81 L 78.22,82.95 L 83.38,84.96 L 84.53,86.39 L 79.37,84.96 L 75.36,85.24 L 74.5,84.67 L 73.64,84.96 L 74.21,85.82 L 71.35,85.24 L 71.06,86.1 L 68.48,85.24 L 66.19,85.53 L 64.47,84.67 L 63.04,85.24 L 57.02,82.66 L 53.58,80.37 L 51.29,77.79 L 49.86,77.51 L 49.0,84.1 L 49.28,93.55 L 48.42,93.55 L 47.85,85.24 L 48.71,78.08 L 47.28,77.51 L 42.12,81.81 L 36.39,84.38 L 34.96,84.1 L 33.81,84.96 L 32.38,84.96 L 32.09,84.1 L 30.37,84.67 L 26.36,84.38 L 19.77,86.1 L 15.76,88.4 L 16.91,86.39 L 26.93,79.8 L 29.23,79.51 L 29.8,78.65 L 32.38,78.65 L 32.95,77.79 L 35.53,78.08 L 36.1,77.22 L 35.24,76.36 L 32.95,76.65 L 32.09,75.79 L 28.94,75.79 L 27.51,74.36 L 23.5,74.07 L 23.21,72.35 L 18.62,71.49 L 18.05,69.48 L 15.47,68.91 L 14.33,68.05 L 14.61,66.91 L 12.03,65.47 L 13.47,64.04 L 14.61,64.33 L 15.19,63.18 L 13.18,62.61 L 10.89,63.47 L 10.03,62.61 L 10.32,61.46 L 12.89,62.32 L 13.18,61.75 L 10.89,60.6 L 10.6,59.74 L 9.74,59.74 L 9.46,58.6 L 7.74,58.02 L 7.16,58.88 L 0.0,51.43 L 6.88,55.16 L 8.6,55.16 L 10.6,56.3 L 12.32,55.73 L 15.47,57.74 L 15.76,56.59 L 16.62,56.3 L 20.63,58.88 L 22.06,58.31 L 24.36,60.6 L 26.07,60.6 L 27.79,62.61 L 28.94,62.61 L 31.81,65.19 L 33.24,65.19 L 36.68,68.05 L 35.24,68.62 L 35.53,67.77 L 34.1,66.62 L 32.09,66.62 L 30.66,65.19 L 29.23,65.47 L 26.93,63.18 L 26.36,63.75 L 27.51,65.47 L 27.51,66.91 L 25.21,65.19 L 23.78,62.61 L 23.21,63.18 L 24.36,65.47 L 21.2,62.89 L 19.2,62.32 L 18.91,62.89 L 19.77,64.04 L 27.22,68.05 L 38.97,72.92 L 39.54,72.35 L 37.54,70.92 L 38.4,71.2 L 39.26,70.34 L 37.25,68.34 L 46.99,75.21 L 47.28,74.64 L 45.27,72.64 L 38.11,67.48 L 34.1,63.18 L 31.52,62.03 L 30.66,60.32 L 28.37,59.46 L 27.22,58.31 L 27.22,57.16 L 23.5,54.87 L 24.07,53.72 L 20.92,51.43 L 21.49,50.29 L 18.91,47.99 L 19.2,46.28 L 17.77,44.84 L 17.19,43.41 L 17.77,41.98 L 16.05,39.11 L 16.62,37.68 L 15.76,34.53 L 16.33,33.95 L 15.19,31.95 L 14.61,32.52 L 15.19,33.67 L 14.61,33.38 L 13.75,30.52 L 14.9,28.8 L 14.04,27.94 L 12.32,27.94 L 10.6,25.64 L 11.17,25.36 L 14.61,27.65 L 23.5,35.96 L 24.36,35.1 L 26.36,37.97 L 27.51,37.39 L 29.51,40.83 L 30.66,40.26 L 31.52,41.12 L 32.38,43.41 L 34.38,44.84 L 34.96,46.56 L 37.82,50.0 L 38.4,52.58 L 39.83,54.01 L 40.4,56.3 L 41.83,57.16 L 42.12,59.46 L 43.27,60.32 L 43.55,62.32 L 44.99,63.75 L 45.56,62.89 L 44.13,59.74 L 44.7,58.88 L 43.55,56.88 L 42.69,49.14 L 41.26,46.56 L 42.12,45.7 L 40.97,44.27 L 40.97,43.12 L 42.12,42.55 L 40.69,38.83 L 42.12,38.54 L 40.97,36.53 L 40.97,34.24 L 41.83,33.95 L 41.26,30.23 L 42.69,30.23 L 42.41,26.79 L 43.84,26.5 L 43.55,23.64 L 44.99,23.07 L 44.99,20.49 L 46.13,19.34 L 47.28,16.19 L 47.85,11.32 Z"
            fill="currentColor" stroke="rgba(0,0,0,0.2)" stroke-width="0.4"
            stroke-linejoin="round"/>
    </svg>`;

  // Build the popup DOM.
  //   data-position -> anchors the popup to a screen corner/edge
  //   data-anim     -> which entrance keyframe runs
  //   data-size     -> S/M/L scaling
  function buildPopup(city, opts) {
    const { animation, position, size, bgColor, textColor,
            brandChannel, brandLink, brandTagline, brandLogoUrl } = opts;

    const overlay = document.createElement('div');
    overlay.className = 'f420-popup';
    overlay.dataset.anim = animation;
    overlay.dataset.position = position;
    overlay.dataset.size = size;
    overlay.setAttribute('role', 'alert');
    overlay.setAttribute('aria-live', 'assertive');

    // Expose the user's colours as CSS custom properties so the stylesheet
    // can consume them via var(--f420-bg) / var(--f420-text).
    if (bgColor)   overlay.style.setProperty('--f420-bg', bgColor);
    if (textColor) overlay.style.setProperty('--f420-text', textColor);

    const leafWrap = document.createElement('span');
    leafWrap.className = 'f420-leaf';
    leafWrap.innerHTML = LEAF_SVG;

    const body = document.createElement('div');
    body.className = 'f420-body';

    // Headline has the leaf inline on the same line as the text.
    const headline = document.createElement('div');
    headline.className = 'f420-headline';
    headline.appendChild(leafWrap);
    const headlineText = document.createElement('span');
    headlineText.className = 'f420-headline-text';
    headlineText.textContent = "Hey! It's 4:20";
    headline.appendChild(headlineText);

    const place = document.createElement('div');
    place.className = 'f420-city';
    place.textContent = `in ${city}`;

    const dismissBtn = document.createElement('button');
    dismissBtn.className = 'f420-icon-btn f420-dismiss';
    dismissBtn.type = 'button';
    dismissBtn.setAttribute('aria-label', 'Dismiss popup');
    dismissBtn.innerHTML = '&times;';

    // Optional streamer branding block. Only built when a channel name is set.
    let brandBlock = null;
    if (brandChannel && brandChannel.trim()) {
      brandBlock = document.createElement('div');
      brandBlock.className = 'f420-brand';

      if (brandLogoUrl && /^(https?:|data:)/i.test(brandLogoUrl)) {
        const logo = document.createElement('img');
        logo.className = 'f420-brand-logo';
        logo.src = brandLogoUrl;
        logo.alt = '';
        logo.onerror = () => logo.remove();  // hide if the URL is broken
        brandBlock.appendChild(logo);
      }

      const textCol = document.createElement('div');
      textCol.className = 'f420-brand-text';

      // Channel name — link if a URL is set, plain text otherwise.
      const nameEl = brandLink
        ? document.createElement('a')
        : document.createElement('span');
      nameEl.className = 'f420-brand-name';
      if (brandLink) {
        nameEl.href = brandLink;
        nameEl.target = '_blank';
        nameEl.rel = 'noopener noreferrer';
      }
      nameEl.textContent = brandChannel.trim();
      textCol.appendChild(nameEl);

      if (brandTagline && brandTagline.trim()) {
        const tag = document.createElement('div');
        tag.className = 'f420-brand-tagline';
        tag.textContent = brandTagline.trim();
        textCol.appendChild(tag);
      }

      brandBlock.appendChild(textCol);
    }

    // "madebybliss.com" — clickable link to the author's site.
    const credit = document.createElement('a');
    credit.className = 'f420-credit';
    credit.href = 'https://madebybliss.com';
    credit.target = '_blank';
    credit.rel = 'noopener noreferrer';
    credit.textContent = 'madebybliss.com';

    body.appendChild(headline);
    body.appendChild(place);
    if (brandBlock) body.appendChild(brandBlock);
    body.appendChild(credit);
    overlay.appendChild(body);
    overlay.appendChild(dismissBtn);

    return { overlay, dismissBtn };
  }

  function showPopup(msg) {
    const { city, animation, position, size, bgColor, textColor, durationSec, soundEnabled,
            brandChannel, brandLink, brandTagline, brandLogoUrl } = msg;
    const host = ensureHost();
    // Remove any popup currently on screen.
    const existing = host.querySelector('.f420-popup');
    if (existing) existing.remove();

    const { overlay, dismissBtn } = buildPopup(city, {
      animation, position, size, bgColor, textColor,
      brandChannel, brandLink, brandTagline, brandLogoUrl,
    });
    host.appendChild(overlay);

    // Trigger entrance animation on next frame so the transition runs.
    requestAnimationFrame(() => overlay.classList.add('f420-visible'));

    if (soundEnabled) playChime();

    let hideTimer = null;
    const dismiss = () => {
      if (hideTimer) clearTimeout(hideTimer);
      overlay.classList.remove('f420-visible');
      overlay.classList.add('f420-leaving');
      overlay.addEventListener('animationend', () => overlay.remove(), { once: true });
    };

    hideTimer = setTimeout(dismiss, Math.max(1, durationSec) * 1000);

    // Dismiss button closes; clicking anywhere else on the popup also dismisses.
    dismissBtn.addEventListener('click', (e) => { e.stopPropagation(); dismiss(); });
    overlay.addEventListener('click', dismiss);
  }

  // Listen for messages from the background.
  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg) return;
    if (msg.type === 'SHOW_420') {
      showPopup(msg);
      // The worker only marks this city as announced after the page confirms
      // that it rendered the popup. Without an acknowledgement, a successful
      // message send is indistinguishable from a dropped alert.
      sendResponse({ ok: true });
    } else if (msg.type === 'PING_420') {
      // Readiness probe used by the background before sending a test popup
      // to a freshly-opened tab.
      sendResponse({ ok: true });
    }
  });

  // A visible webpage gives the scheduler extra chances during the exact
  // 4:20 minute even if Chrome delays a background alarm under load.
  function heartbeat() {
    if (document.visibilityState !== 'visible') return;
    try {
      const pending = chrome.runtime.sendMessage({ type: 'PAGE_HEARTBEAT_420' });
      if (pending && typeof pending.catch === 'function') pending.catch(() => {});
    } catch (_) {}
  }
  heartbeat();
  setInterval(heartbeat, 15_000);
})();
