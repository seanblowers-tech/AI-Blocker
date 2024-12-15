// Fetch storage data
function fetchStorage(keys, callback) {
  chrome.storage.sync.get(keys, (data) => callback(data));
}

// Update storage data
function updateStorage(data, callback) {
  chrome.storage.sync.set(data, () => {
    if (callback) callback();
  });
}

// Initialize the popup
document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.querySelector(".toggle-blocking");
  const manageBlocklistButton = document.querySelector(".manage-blocklist");

  // Handle blocking toggle
  toggleButton.addEventListener("click", () => {
    fetchStorage(["blockingEnabled"], (data) => {
      const blockingEnabled = !data.blockingEnabled; // Toggle the state
      updateStorage({ blockingEnabled }, () => {
        toggleButton.textContent = blockingEnabled
          ? "Disable Blocking"
          : "Enable Blocking";
        alert(`Blocking is now ${blockingEnabled ? "enabled" : "disabled"}.`);
      });
    });
  });

  // Navigate to the blocklist settings
  manageBlocklistButton.addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });

  // Set initial state of the toggle button
  fetchStorage(["blockingEnabled"], (data) => {
    toggleButton.textContent = data.blockingEnabled
      ? "Disable Blocking"
      : "Enable Blocking";
  });
});