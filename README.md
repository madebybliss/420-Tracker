![leaf](icons/leaf.svg)

# 4:20 Tracker — Global Cannabis Time

A Chrome extension that pops up a clean, animated, cannabis-themed notification
the moment it hits **4:20 PM** in any major timezone around the world.

> *"Hey! It's 4:20 in London!"* → slides in, chimes, slides out.

Designed for medical-cannabis YouTube streams/videos so the host can let the
extension announce 4:20 rolling across the globe throughout the day.

---

## Features

- **Global tracking** — fires for 38 major timezones (or 16 iconic cities — your choice).
- **Customisable look** — pick popup **position** (6 corners/edges), **size** (S/M/L), and **colours** (background + text). The popup slides in naturally from its chosen corner.
- **Optional chime** — soft pleasant sound when the popup appears (toggle on/off).
- **Configurable duration** — auto-dismiss after any number of seconds.
- **Click to dismiss** — click anywhere on the popup (or the close button) to close early.
- **Cannabis theme** — green/gold glass card with shimmer text, custom cannabis-leaf branding throughout.
- **Toolbar popup** — shows the next upcoming 4:20 + countdown.
- **Full settings page** — toggle every option.
- **No spam** — each timezone fires exactly once per day.
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

> Works in Chrome, Edge, Brave, and any Chromium browser that supports Manifest V3.

---

## Settings

Open via the toolbar popup → ** Full settings**, or right-click the icon → Options.

| Setting            | What it does                                                |
| ------------------ | ----------------------------------------------------------- |
| Enable tracker     | Master on/off                                               |
| Timezones to track | **All major zones (~38)** or **Iconic cities only (~16)**   |
| Popup position     | 6 fixed spots: top/bottom × left/centre/right (slides in from there) |
| Popup size         | Small, Medium, or Large                                     |
| Colours            | Background + text colour pickers ("Made by Bliss" stays gold + outlined) |
| Display duration   | Seconds before auto-dismiss (1–120)                         |
| Play chime         | Soft sound on popup                                          |

Click **![leaf](icons/leaf.svg) Test Popup** to preview without waiting for the real 4:20.

---

## How it works

- A background service worker runs a `chrome.alarms` tick **every 60 seconds**.
- On each tick it checks the local time in every tracked timezone via `Intl.DateTimeFormat`.
- The first minute it sees a zone sitting at exactly **16:20**, it injects a popup into the active tab and records the firing so it won't repeat.
- If the active tab can't be injected (e.g. `chrome://` pages or a fresh tab), it falls back to a standard Chrome notification.
- Settings are stored in `chrome.storage.sync` and persist across browser restarts.

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
├── sounds/
│ ├── chime.mp3 # Generated pleasant 3-note chime
│ └── chime.ogg # OGG fallback
└── icons/
 ├── icon16/32/48/128.png
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

The popup lives inside a browser tab, so to get it on stream you point OBS at
that tab. **Two ways to do it — pick whichever fits your setup.**

### Option A — Browser Source (cleanest, recommended)

A Browser Source is a dedicated hidden webpage that OBS controls. The popup
appears on a transparent background, so it floats over your stream cleanly.

1. **Set up the source page.** Open a fresh browser tab and go to any normal
 website (e.g. `https://example.com`). Keep this tab open — it's where the
 popup will appear.
2. In **OBS**, make sure the **Browser Source** feature is available (it ships
 with OBS by default — no plugin needed).
3. In your OBS scene, under **Sources**, click the **➕** button → **Browser**.
4. Configure it:
 - **URL:** paste the URL of the tab from step 1 (e.g. `https://example.com`)
 - **Width:** `1920` (or your stream width)
 - **Height:** `1080` (or your stream height)
 - Tick **"Shutdown source when not visible"** — *leave it UNCHECKED* so
 the page stays loaded and popups can fire anytime
 - Click **OK**
5. Resize/position the Browser Source as needed. Since the page background
 isn't transparent by default, you may want to either:
 - Use a website with a dark background, **or**
 - Add an **Image Mask/Blend** filter to the Browser Source, **or**
 - Switch to **Option B** below for true transparency.

> **Sound on stream:** The chime plays in the *browser*, not OBS. To capture
> it, either route the tab's audio via **Application Audio Capture** (Windows 11
> / recent OBS) pointed at Chrome/Brave, or use **Option B**.

### Option B — Window / Display Capture (simplest, captures everything)

1. Open a browser window with a normal webpage as the active tab.
2. In OBS → **Sources → ➕ → Window Capture** (Mac: **macOS Window Capture**)
 or **Display Capture**.
3. Select your browser window.
4. Crop/resize so only the popup area shows, or layer it over a transparent
 background scene.

This captures **video + the chime audio** in one shot, but you'll see the rest
of the browser too unless you crop carefully.

### Tips for a clean stream overlay

- **Pin a "dummy" tab** (e.g. a blank dark page) as your active tab while
 streaming so popups always land somewhere predictable.
- Test with **Test Popup** in settings *before* going live — confirm it
 appears on stream exactly where you want.
- The popup auto-dismisses after your configured duration, so you don't need
 to manage it manually mid-stream.
- Set **Animation style → Random** for variety across the day's 4:20s.
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

> Warning: The popup only fires in the **active** tab. If you switch away from the
> VDO.Ninja tab, popups pause until you come back. For always-on behaviour,
> use Approach 2.

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

 So for the popup to appear on the VDO.Ninja OBS feed, you have two options:
 - **(a)** Run VDO.Ninja in your **real Chrome/Brave window** (with the
 extension installed) and capture that window with **Window Capture**
 in OBS — the popup will be captured along with it.
 - **(b)** Keep VDO.Ninja as an OBS Browser Source (clean, transparent),
 and add the 4:20 popup as a **separate** overlay using Option A or B
 from the OBS section above.

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


