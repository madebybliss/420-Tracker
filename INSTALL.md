# How to Install the 4:20 Tracker Extension

A beginner-friendly, step-by-step guide. Pick your browser below and follow along —
the whole thing takes about **2 minutes**.

> **First time?** Start with **[Step 0 — Get the folder onto your computer](#step-0--get-the-folder-onto-your-computer)**
> below, then come back and pick your browser.

---

## Quick links

- [Step 0 — Get the folder](#step-0--get-the-folder-onto-your-computer)
- [For Google Chrome](#for-google-chrome)
- [For Brave](#for-brave)
- [For Microsoft Edge](#for-microsoft-edge)
- [After install: pin & test](#after-install-pin--test)
- [Updating to a new version](#updating-to-a-new-version)
- [Removing it](#removing-it)
- [Troubleshooting](#troubleshooting)

---

## Step 0 — Get the folder onto your computer

The extension is a folder of files. You need that folder saved somewhere on
**your own computer** before the browser can load it.

### Option A — Someone sent you a ZIP file (most common)

1. **Save the ZIP** to your computer (e.g. your **Downloads** folder).
2. **Unzip it:**
 - **Windows:** right-click the `.zip` → **Extract All…** → click **Extract**.
 You'll get a new folder called `420-tracker`.
 - **Mac:** double-click the `.zip`. A folder called `420-tracker` appears
 next to it.
3. *(Recommended)* Move the unzipped `420-tracker` folder somewhere permanent
 like **Documents** or **Desktop** — see the note below about why.

> Warning: **Don't load the `.zip` directly into the browser.** The browser needs
> the **unzipped folder**, not the zip file. Always extract first.

### Option B — Someone sent you a folder directly

Just save it somewhere on your computer (e.g. **Documents**). Skip to your
browser's install steps below.

### Option C — Downloaded from a link / cloud drive

Download the folder or ZIP, then follow Option A or B depending on which you got.

### Verify you have the right thing

Open the folder. You should see these files **directly inside** it:

```
420-tracker/ ← THIS is the folder to select later
├── manifest.json ← must be here, at this level
├── background.js
├── content.js
├── popup.css
├── popup.html
├── popup.js
├── options.html
├── options.js
├── streamyard.html
├── README.md
├── INSTALL.md ← you are here
├── icons/ ← (folder with the leaf icons)
└── sounds/ ← (folder with the chime)
```

If you see *another* folder inside (e.g. `420-tracker/420-tracker/...`), go
**one level deeper** — the browser wants the folder that has `manifest.json`
sitting right inside it.

---

## Before you start

Make sure you've completed **[Step 0](#step-0--get-the-folder-onto-your-computer)**
and have the unzipped `420-tracker` folder somewhere on your computer.

> **Important:** When asked to "select the folder", select the **`420-tracker`**
> folder itself — the one with `manifest.json` directly inside it.
> Don't select the parent folder that *contains* it, and don't go *into* a
> subfolder. If Chrome shows an error about a missing manifest, you picked the
> wrong level.

> **The folder can live anywhere you like** — there's no required location.
> When you click **Load unpacked**, you navigate to wherever *you* saved the
> folder, and the browser remembers that path. Common choices:
>
> | OS | Example path |
> | -------- | ----------------------------------------------------------- |
> | Windows | `C:\Users\YourName\Documents\420-tracker\` |
> | Windows | `C:\Users\YourName\Desktop\420-tracker\` |
> | Mac | `/Users/YourName/Documents/420-tracker/` |
> | Linux | `/home/YourName/420-tracker/` |
>
> **Once loaded, don't move, rename, or delete the folder** — the browser
> reads files live from that exact spot. If you ever do need to move it, just
> re-do the **Load unpacked** step pointing at the new location and remove the
> old entry.

---

## For Google Chrome

### Step 1 — Open the extensions page
Type this into your address bar and press **Enter**:

```
chrome://extensions
```

### Step 2 — Turn on Developer mode
Look at the **top-right corner** of the extensions page. You'll see a toggle
switch labelled **Developer mode**. Click it so it turns **blue**.

> Once enabled, you'll see three new buttons appear in the top-left:
> **Load unpacked** · **Pack extension** · **Update**.

### Step 3 — Load the extension
1. Click **Load unpacked**.
2. A file picker opens. Navigate to and **select the `420-tracker` folder**.
3. Click **Select Folder** (Windows) or **Open** (Mac).

 The 4:20 Tracker now appears in your extensions list with a ![leaf](icons/leaf.svg) leaf icon.

### Step 4 — Reload if you change files
If you (or Bliss) ever update the extension's files, come back to
`chrome://extensions` and click the little ** reload** arrow on the
4:20 Tracker card. Changes take effect immediately.

---

## For Brave

Brave is built on Chromium, so the process is identical to Chrome — just a
different URL.

### Step 1 — Open the extensions page
```
brave://extensions
```

### Step 2 — Turn on Developer mode
Toggle **Developer mode** in the **top-right corner**.

### Step 3 — Load the extension
1. Click **Load unpacked**.
2. Select the **`420-tracker` folder**.
3. Click **Select Folder** / **Open**.

 Done. Works exactly the same as Chrome — same settings, same popups,
same chime.

---

## For Microsoft Edge

### Step 1 — Open the extensions page
```
edge://extensions
```

### Step 2 — Turn on Developer mode
Toggle **Developer mode** in the **bottom-left corner** (Edge puts it at the
bottom, not the top — easy to miss!).

### Step 3 — Load the extension
1. Click **Load unpacked** (appears near the top once dev mode is on).
2. Select the **`420-tracker` folder**.
3. Click **Select Folder** / **Open**.

 Done.

---

## After install: pin & test

### Pin the icon to your toolbar
1. Click the ** puzzle piece** icon in your browser's top-right toolbar.
2. Find **![leaf](icons/leaf.svg) 4:20 Tracker** in the list.
3. Click the ** pin** icon next to it.
4. The ![leaf](icons/leaf.svg) leaf now lives in your toolbar for easy access.

### Run a test popup (recommended)
1. Click the ![leaf](icons/leaf.svg) icon in your toolbar.
2. Click ** Full settings**.
3. Click the **![leaf](icons/leaf.svg) Test Popup** button.
4. A green cannabis-themed card should slide/fade in showing:
   ```
 ![leaf](icons/leaf.svg) Hey! It's 4:20
 in Test City
 MADE BY BLISS
   ```
 (and play a chime if sound is on).

If you see that — you're fully set up. Real 4:20 announcements will fire
automatically throughout the day.

---

## Updating to a new version

The extension checks the latest published GitHub release when the browser
starts and once per day. When an update is available, choose **Update now** in
the notification, toolbar popup, or settings page. You can choose **Later** to
be reminded again after 24 hours unless the release is marked as required.

Because 4:20 Tracker is installed as an unpacked extension, Chrome, Brave, and
Edge will not replace its files automatically. Follow these steps:

1. Click **Update now**, then click **Download update** on the instructions
 page. Alternatively, download `420-tracker.zip` from the latest GitHub Release.
2. Wait for the ZIP to finish downloading, then **unzip/extract it**. Open the
 extracted `420-tracker` folder and confirm that `manifest.json` is directly
 inside it.
3. Find the **original `420-tracker` folder** that the browser is already
 using. This is the folder you selected when you first clicked **Load unpacked**.
4. Copy everything from the newly extracted `420-tracker` folder into that
 original folder. Choose **Replace/Overwrite** when your computer asks about
 files with the same names.
5. Open the extensions page for your browser:
   - Chrome: `chrome://extensions`
   - Brave: `brave://extensions`
   - Edge: `edge://extensions`
6. Find **![leaf](icons/leaf.svg) 4:20 Tracker** and click its circular
 **Reload** button.
7. Refresh any webpage that was already open so it receives the newest page
 heartbeat code.
8. Open the extension and click **Test automatic trigger**. Keep a normal
 webpage active; the popup should appear when the next clock minute begins.

### Confirm the installed version

The quickest check: open the extension's **Settings** page and look at the
bottom — it shows the installed version number. You can also open the
browser's extensions page and check **Details** for 4:20 Tracker. Either way,
confirm it matches the GitHub Release. If the old version is still shown, the
new files were probably copied into a different folder.

> **Do not remove the extension or load the downloaded folder as a second
> extension.** Replace the files in the original folder and press Reload. This
> preserves the existing extension identity and settings.

> **Do not select the ZIP itself.** Browsers can only load the extracted folder
> containing `manifest.json`.

---

## Removing it

Want to uninstall?

1. Open `chrome://extensions` (or the Brave/Edge equivalent).
2. Find **![leaf](icons/leaf.svg) 4:20 Tracker**.
3. Click **Remove**.
4. Confirm.

Your settings will be cleared too.

---

## Troubleshooting

### "Failed to load extension — manifest file is missing"
You selected the wrong folder. Make sure you picked the **`420-tracker`**
folder — the one with `manifest.json` sitting directly inside it.

### The popup doesn't appear
- The tracker only fires in the **active tab**. Make sure a normal website
 (like YouTube, Google, or any blog) is your active tab — not a `chrome://`
 page or a blank new-tab page.
- Open the toolbar popup — it shows the **next upcoming 4:20** with a
 countdown. That tells you it's working.
- Use **Test Popup** in settings to confirm it shows at all.

### No chime sound
- Check that **Play chime** is toggled **on** in settings.
- If **Use custom sound** is also on, check it actually has a file set (the
 panel shows the filename, or "No file selected — using the default chime").
 Use **Preview** to test it on its own, without waiting for a popup.
- Browsers block audio on a tab **until you've clicked on it at least once**.
 Click anywhere on the page once — the next popup's chime will play.
- Check your system volume isn't muted.

### It doesn't fire on certain pages
The popup can't be injected into browser-internal pages (`chrome://`,
`edge://`, the new-tab page, the Web Store, PDF viewer, etc.). On those tabs,
the extension falls back to a quiet **system notification** instead. This is
normal and unavoidable — just keep a normal website as your active tab.

### I changed settings but nothing changed
- Most setting changes take effect on the **next** popup, not the current one.
- Click **Test Popup** again to preview the new settings immediately.

### The extension disappeared after restart
- The folder was probably moved, renamed, or deleted. Restore it to its
 original location and re-do the **Load unpacked** step.
- On Brave/Chrome startup you may see a one-time "disable developer mode
 extensions?" prompt — click **Keep** to keep it enabled.

---

## Still stuck?

Open the toolbar popup → the next 4:20 countdown should be ticking down.
If it shows **"![leaf](icons/leaf.svg) Next 4:20: [city] in [Xm]"**, the tracker is running
correctly and just waiting for the right moment.

Stay chill. ![leaf](icons/leaf.svg)
