# Changelog

All notable changes to 4:20 Tracker are recorded here.

## [1.4.9] - 2026-07-29

### Fixed

- Test controls now wait for Settings to finish saving, so a newly entered
  display duration is used by the popup immediately.
- Update buttons stay on one line in the toolbar popup, Settings banner, and
  update instructions page.
- Update layouts now stack cleanly on narrow windows without overflowing.
- Shortened the native update notification so it displays more cleanly.

## [1.4.8] - 2026-07-29

### Added

- Optional **10-minute test mode** in Settings.
- Recurring test popups follow whichever normal webpage is active.
- Live `mm:ss` countdown while 10-minute test mode is enabled.
- Test scheduling persists after Settings closes and across browser restarts.

### Fixed

- Display duration now starts after the entrance animation finishes, so the
  popup remains fully visible for the configured number of seconds.
- Display duration is consistently limited to 1–120 seconds.

### Documentation

- Documented 10-minute test mode, its countdown, and duration behavior.
- Kept the complete Chrome, Brave, and Edge manual-update guide current.

## [1.4.7] - 2026-07-29

- Added redundant exact-minute scheduling using aligned 30-second alarms and
  15-second visible-page heartbeats.
- Added **Test automatic trigger** to exercise the real scheduler.
- Prevented misleading late 4:20 alerts at 4:21 or afterward.
- Corrected and expanded README streaming, OBS, VDO.Ninja, and feature guidance.

## [1.4.6] - 2026-07-28

- Added guided **Update now / Later** notifications and controls.
- Added a dedicated manual-update instructions page.
- Added optional required-update prompts via `[force-update]` release notes.

## [1.4.5] - 2026-07-28

- Reliably delivers popups to the active normal webpage.
- Injects content assets into pages open before an unpacked-extension reload.
- Requires a render acknowledgement before marking an alert as delivered.
- Repairs missing background alarms when the service worker starts.

## [1.4.4] - 2026-07-28

- Improved real 4:20 delivery behavior and daily deduplication.

## [1.4.3] - 2026-07-28

- Added the bundled default image helper for channel-logo testing.

## [1.4.2] - 2026-07-28

- Fixed the **Fire real 4:20 now** diagnostic control.

## [1.4.1] - 2026-07-28

- Added streamer branding, update notifications, and diagnostic controls.

## [1.2.4] - 2026-07-28

- Added quiet real-event behavior when no normal webpage is active.
- Refined the inline leaf layout and settings UI.
