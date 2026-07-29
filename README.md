![leaf](icons/leaf.svg)

# 4:20 Tracker — Global Cannabis Time

Current version: **1.4.7**

A Chromium extension that pops up a clean, animated, cannabis-themed notification
the moment it hits **4:20 PM** in any major timezone around the world.

> *"Hey! It's 4:20 in London!"* → slides in, chimes, slides out.

Designed for medical-cannabis YouTube streams/videos so the host can let the
extension announce 4:20 rolling across the globe throughout the day.

---

## Features

- **Global tracking** — fires for 39 cities across major timezones (or 16 iconic cities — your choice).
- **Exact-minute alerts** — redundant scheduling checks during 4:20, with no misleading late alert at 4:21 or afterward.
- **Works over any active webpage** — StreamYard, YouTube, Twitch, VDO.Ninja, social sites, and other normal `http://` or `https://` tabs.
- **Customisable look** — pick popup **position** (6 corners/edges) and **size** (S/M/L). The popup slides in naturally from its chosen position.
- **Optional chime** — soft pleasant sound when the popup appears (toggle on/off).
- **Configurable duration** — auto-dismiss after 1–120 seconds.
- **Click to dismiss** — click anywhere on the popup (or the close button) to close early.
- **Cannabis theme** — green/gold glass card with shimmer text, custom cannabis-leaf branding throughout.
- **Channel branding** — streamers can add their channel name, link, tagline, and logo to every popup.
- **Toolbar popup** — shows the next upcoming 4:20 + countdown.
- **Built-in diagnostics** — preview immediately, test the automatic scheduler at the next minute, simulate a real event, or reset the dedup cache.
- **Full settings page** — tracker, timezone, display, sound, testing, and channel-branding controls.
- **Guided updates** — detects newer GitHub Releases, offers **Update now / Later**, and opens step-by-step Chrome/Brave instructions.
- **No spam** — each tracked city fires at most once per local day.
- **Accessible** — respects `prefers-reduced-motion`; uses `role="alert"`.

---

## Install

**Full step-by-step guide with screenshots-style walkthrough, troubleshooting,
and instructions for Chrome / Brave / Edge: see [`INSTALL.md`](./INSTALL.md).**

**Quick version (Chrome):**
1. Open Chrome and go to `chrome://extensions`.
2. Toggle on **Developer mode** (top-right).
3. Click **Load unpacked**.
4. Select the `420-tracker` folder (the one with `manifest.json` inside).
5. Pin the ![leaf](icons/leaf.svg) icon to your toolbar for quick access.

### Updating an existing installation

When the extension reports an update, choose **Update now** to open the guided
update page. Download and extract the ZIP, copy its files over the original
extension folder, then reload 4:20 Tracker from your browser's extensions page.
Do not remove and reinstall it. See the complete
**[update instructions](./INSTALL.md#updating-to-a-new-version)** for Chrome,
Brave, Edge, version verification, and the automatic-trigger test.

> Works in Chrome, Edge, Brave, and any Chromium browser that supports Manifest V3.

---

## Settings

Open via the toolbar popup → ** Full settings**, or right-click the icon → Options.

| Setting            | What it does                                                |
| ------------------ | ----------------------------------------------------------- |
| Enable tracker     | Master on/off                                               |
| Timezones to track | **All major zones (39)** or **Iconic cities only (16)**     |
| Popup position     | 6 fixed spots: top/bottom × left/centre/right (slides in from there) |
| Popup size         | Small, Medium, or Large                                     |
| Display duration   | Seconds before auto-dismiss (1–120)                         |
| Play chime         | Soft sound on popup                                          |
| Channel branding   | Optional: channel name, link, tagline, logo URL shown on every popup |

### Testing

- **Test Popup** renders a preview immediately. This confirms the appearance,
 position, branding, and chime, but bypasses automatic scheduling.
- **Test automatic trigger** arms the real scheduler for the beginning of the
 next clock minute. Keep any normal webpage active; if the popup appears there,
 the complete heartbeat → service worker → active-tab delivery path is working.
- The settings page also includes **Fire real 4:20 now** and **Reset fired
 cache** diagnostic controls.

---

## How it works

- A background service worker checks on aligned 30-second boundaries, reinforced by a 15-second heartbeat from the visible webpage.
- On each tick it checks the local time in every tracked timezone via `Intl.DateTimeFormat`.
- It injects the popup only while a zone's clock reads **16:20** and records the firing so it won't repeat. It never announces late at 16:21 or afterward.
- Real alerts appear in the active normal webpage. Chromium does not allow page overlays on protected pages such as `chrome://`, `brave://`, the Web Store, or some New Tab/PDF pages, so real alerts stay silent on those pages.
- Settings are stored in `chrome.storage.sync` and persist across browser restarts.

### Publishing updates

The extension checks GitHub's **latest published release** when the browser
starts and once per day. A commit or tag by itself is not an update: publish a
GitHub Release whose tag is higher than the version in `manifest.json`, and
attach the install ZIP as the first release asset.

Users receive an **Update now / Later** notification and see the same choices
in the toolbar and settings pages. **Later** snoozes the prompt for 24 hours.
For an urgent release, put `[force-update]` anywhere in the release notes. That
removes the Later choice and makes the notification persistent and recurring.

Because this project is installed unpacked, Chrome and Brave do not allow it to
overwrite its own files. **Update now** opens a guided update page with the
download and exact Chrome/Brave instructions; the user must unzip it into the
extension folder and reload the extension from the browser's extensions page.
Publishing through the Chrome Web Store is required for unattended updates on
normal Windows and macOS installations.

---

## Project structure

```
420-tracker/
├── manifest.json # MV3 manifest
├── background.js # Service worker: 4:20 detection + alarms
├── content.js # Injects & animates the popup in the page
├── popup.css # Popup styles + all entrance animations
├── popup.html / .js # Toolbar dropdown (status + quick toggle)
├── options.html / .js # Full settings page
├── update.html / .js # Guided manual-update instructions
├── sounds/
│ ├── chime.mp3 # Generated pleasant 3-note chime
│ └── chime.ogg # OGG fallback
└── icons/
 ├── icon16/32/48/128.png
 ├── default-logo.png
 └── leaf.svg
```

---

## Customising

**Add or remove a city:** edit the `TIMEZONES` array in `background.js`. Each entry is:
```js
{ city: 'Your City', tz: 'America/Your_City', offset: -5 }
```
`tz` is the [IANA timezone identifier](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones).
Add the city name to the `MAJOR_ONLY` array if you want it included in the "iconic" mode too.

**Change the chime:** replace `sounds/chime.mp3` (keep the filename).

**Change colours / text:** edit `popup.css` for the card look, and `content.js`
for the `"Hey! It's 4:20"` / `"in {city}"` strings.

---

## Showing the popup on stream (OBS)

The popup lives inside the active tab of the real Chrome/Brave/Edge window
where the extension is installed. Capture that browser window in OBS.

> **OBS Browser Source does not load your installed browser extensions.**
> Pasting the same webpage URL into an OBS Browser Source will not make 4:20
> Tracker appear there. Use Window Capture or Display Capture instead.

### Window / Display Capture

1. Open a browser window with a normal webpage as the active tab.
2. In OBS → **Sources → ➕ → Window Capture** (Mac: **macOS Window Capture**)
 or **Display Capture**.
3. Select your browser window.
4. Crop/resize so only the popup area shows, or layer it over a transparent
 background scene.

You will see the rest of the browser unless you crop carefully. To include the
chime, add OBS **Application Audio Capture** for Chrome/Brave/Edge or use your
normal desktop-audio source; Window Capture itself may not capture audio.

### Tips for a clean stream overlay

- **Pin a "dummy" tab** (e.g. a blank dark page) as your active tab while
 streaming so popups always land somewhere predictable.
- Use **Test Popup** to confirm placement, then **Test automatic trigger** to
 verify that the real scheduler appears on the captured webpage.
- The popup auto-dismisses after your configured duration, so you don't need
 to manage it manually mid-stream.
- Remember: popups **won't** fire on `chrome://` pages or the new-tab page —
 always have a real website as your active tab.

---

## Using VDO.Ninja instead of OBS

**Yes — this works with VDO.Ninja too.** VDO.Ninja rooms are just webpages
loaded into a browser, so the extension can fire its popup right on top of
the VDO.Ninja guest/scene view.

There are two approaches:

### Approach 1 — Run the extension in your own VDO.Ninja browser tab

This is the easiest if **you** are the host and the popup is for your own view.

1. Install the extension in the browser you use to open VDO.Ninja
 (see [`INSTALL.md`](./INSTALL.md)).
2. Open your VDO.Ninja room / director's dashboard as a **normal browser tab**
 (not the OBS-embedded version).
3. Make sure that tab is your **active tab** when you want popups to appear.
4. When 4:20 hits somewhere, the popup slides in over the VDO.Ninja view.

> The popup targets whichever normal webpage is active. If you switch away
> from VDO.Ninja, the alert will appear on the new active webpage instead.

### Approach 2 — Add VDO.Ninja as an OBS Browser Source (best for streams)

This is the pro setup: VDO.Ninja feeds the guests into OBS, and the popup
overlays on top via OBS.

1. In VDO.Ninja, open the **Director's Dashboard** for your room.
2. Next to the guest or scene you want, click the **OBS** icon to get the
 direct link (it'll look like `https://vdo.ninja/?view=XXXXX&...`).
3. Add these parameters to the URL for a clean overlay:
 - `&transparent` — makes the VDO.Ninja background transparent
 - `&cleanoutput` — hides all UI buttons and branding
 - (optional) `&bitrate=6000` — higher video quality
4. In OBS → **Sources → ➕ → Browser** → paste that URL.
5. Set Width/Height to your stream resolution. Tick the box so the source
 **stays loaded** (don't shut it down when not visible).
6. **Install the 4:20 Tracker extension in the same browser OBS uses for
 Browser Sources** — but note: *OBS's built-in Browser Source has its own
 embedded Chromium that does **not** run your installed extensions.*

 So for the popup to appear on the VDO.Ninja feed, you have two options:
 - **(a)** Run VDO.Ninja in your **real Chrome/Brave window** (with the
 extension installed) and capture that window with **Window Capture**
 in OBS — the popup will be captured along with it.
 - **(b)** Keep VDO.Ninja as an OBS Browser Source (clean, transparent),
 and capture a separate real browser window containing the popup using
 **Window Capture**. Crop that capture to the configured popup area and layer
 it above the VDO.Ninja source.

> **Key takeaway:** OBS's Browser Sources run in an isolated embedded
> browser — they ignore your installed extensions. To get the extension's
> popup on stream, it must run in your **actual browser window**, which you
> then capture with Window/Display Capture. VDO.Ninja itself works fine as
> an OBS Browser Source; the popup just needs its own capture path.

### VDO.Ninja + 4:20 Tracker — recommended setup

For most streamers, the cleanest combo is:

```
[Your real Chrome/Brave with extension installed]
 ↓ Window Capture
[OBS Scene]
 +
[VDO.Ninja as Browser Source with &transparent &cleanoutput]
```

This way VDO.Ninja guests come in clean and transparent, and the 4:20 popup
shows up via the window capture whenever 4:20 hits. ![leaf](icons/leaf.svg)

---

## Notes

- Browser autoplay policies may block the chime on a tab the user has never
 interacted with. Once you click anywhere on the page, sound will work.
 The visual popup always shows.
- The tracker only fires in the **active tab** so it doesn't spam background tabs.

Stay chill. ![leaf](icons/leaf.svg)


Feel Free To Join The [Discord](https://discord.gg/6aWfHfpbG)
