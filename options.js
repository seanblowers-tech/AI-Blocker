const DEFAULT_BLOCKLIST = ["openai.com", "bard.google.com", "gemini.google.com", "chatgpt.com"];
const blocklistElement = document.getElementById("blocklist");
const allowlistElement = document.getElementById("allowlist");
const blocklistInput = document.getElementById("blocklistInput");

// Load and merge lists
function loadLists() {
  chrome.storage.sync.get(["blocklist", "allowlist", "removedDefaults"], (data) => {
    const userBlocklist = data.blocklist || [];
    const allowlist = data.allowlist || [];
    const removedDefaults = data.removedDefaults || [];

    // Merge default blocklist and user blocklist, excluding removed defaults
    const mergedBlocklist = [
      ...DEFAULT_BLOCKLIST.filter((domain) => !removedDefaults.includes(domain)),
      ...userBlocklist,
    ];

    displayBlocklist(mergedBlocklist);
    displayAllowlist(allowlist);
  });
}

// Display Blocklist
function displayBlocklist(blocklist) {
  blocklistElement.innerHTML = "";
  blocklist.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;

    // Remove button
    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.className = "remove-btn";
    removeButton.onclick = () => moveToAllowlist(domain);

    li.appendChild(removeButton);
    blocklistElement.appendChild(li);
  });
}

// Display Allowlist
function displayAllowlist(allowlist) {
  allowlistElement.innerHTML = "";
  allowlist.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;

    // Add back to blocklist button
    const blockButton = document.createElement("button");
    blockButton.textContent = "Add to Blocklist";
    blockButton.className = "block-btn";
    blockButton.onclick = () => moveToBlocklist(domain);

    li.appendChild(blockButton);
    allowlistElement.appendChild(li);
  });
}

// Move a domain from blocklist to allowlist
function moveToAllowlist(domain) {
  chrome.storage.sync.get(["blocklist", "allowlist", "removedDefaults"], (data) => {
    const userBlocklist = data.blocklist.filter((item) => item !== domain);
    const allowlist = data.allowlist || [];
    const removedDefaults = data.removedDefaults || [];

    // Add to allowlist
    if (!allowlist.includes(domain)) {
      allowlist.push(domain);
    }

    // Track as removed default if applicable
    if (DEFAULT_BLOCKLIST.includes(domain) && !removedDefaults.includes(domain)) {
      removedDefaults.push(domain);
    }

    chrome.storage.sync.set({ blocklist: userBlocklist, allowlist, removedDefaults }, loadLists);
  });
}

// Move a domain from allowlist to blocklist
function moveToBlocklist(domain) {
  chrome.storage.sync.get(["blocklist", "allowlist", "removedDefaults"], (data) => {
    const allowlist = data.allowlist.filter((item) => item !== domain);
    const userBlocklist = data.blocklist || [];
    const removedDefaults = data.removedDefaults || [];

    // Add to user blocklist
    if (!userBlocklist.includes(domain)) {
      userBlocklist.push(domain);
    }

    // Remove from removedDefaults if it was a default
    const updatedRemovedDefaults = removedDefaults.filter((item) => item !== domain);

    chrome.storage.sync.set({ blocklist: userBlocklist, allowlist, removedDefaults: updatedRemovedDefaults }, loadLists);
  });
}

// Add a domain to the blocklist
document.getElementById("addBlocklistButton").addEventListener("click", () => {
  const domain = blocklistInput.value.trim();
  if (domain) {
    chrome.storage.sync.get(["blocklist"], (data) => {
      const userBlocklist = data.blocklist || [];
      if (!userBlocklist.includes(domain)) {
        userBlocklist.push(domain);
        chrome.storage.sync.set({ blocklist: userBlocklist }, loadLists);
        blocklistInput.value = "";
      }
    });
  }
});

// Initialize lists
loadLists();