const $ = (id) => document.getElementById(id);

async function loadUpdate() {
  const { updateInfo } = await chrome.storage.local.get('updateInfo');
  const installedVersion = chrome.runtime.getManifest().version;
  const browserIsBrave = navigator.brave && typeof navigator.brave.isBrave === 'function';
  const extensionsUrl = browserIsBrave ? 'brave://extensions' : 'chrome://extensions';

  $('currentVersion').textContent = updateInfo?.currentVersion || installedVersion;
  $('latestVersion').textContent = updateInfo?.latestVersion || 'latest';
  $('extensionsUrl').textContent = extensionsUrl;
  $('required').style.display = updateInfo?.forceUpdate ? 'block' : 'none';

  $('download').addEventListener('click', () => {
    if (!updateInfo?.downloadUrl) {
      $('status').textContent = 'The download link is unavailable. Please try again after reopening the extension.';
      return;
    }
    chrome.tabs.create({ url: updateInfo.downloadUrl });
    $('status').textContent = 'Download opened. Keep this instructions page available for the remaining steps.';
  });

  $('extensions').addEventListener('click', () => {
    // Chromium blocks extensions from opening chrome:// and brave:// URLs
    // programmatically, so copy the exact address and explain what to do.
    navigator.clipboard.writeText(extensionsUrl).then(
      () => { $('status').textContent = `${extensionsUrl} copied. Paste it into the address bar and press Enter.`; },
      () => { $('status').textContent = `Type ${extensionsUrl} into the address bar and press Enter.`; },
    );
  });
}

loadUpdate().catch(() => {
  $('status').textContent = 'Could not load update details. Close this page and try Update now again.';
});
