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

// Load blocklist and allowlist
function loadLists() {
  chrome.storage.sync.get(["blocklist", "allowlist"], (data) => {
    const blocklist = data.blocklist || [];
    const allowlist = data.allowlist || [];

    displayList("blocklist", blocklist, true);
    displayList("allowlist", allowlist, false);
  });
}

// Display a list (blocklist or allowlist)
function displayList(listId, list, isBlocklist) {
  const listElement = document.getElementById(listId);
  listElement.innerHTML = ""; // Clear the list

  list.forEach((domain) => {
    const li = document.createElement("li");
    li.textContent = domain;

    // Add remove/move button
    const button = document.createElement("button");
    button.textContent = isBlocklist ? "Remove" : "Add to Blocklist";
    button.className = isBlocklist ? "remove-btn" : "add-btn";

    button.addEventListener("click", () => {
      if (isBlocklist) {
        moveToAllowlist(domain);
      } else {
        moveToBlocklist(domain);
      }
    });

    li.appendChild(button);
    listElement.appendChild(li);
  });
}

// Move a domain from blocklist to allowlist
function moveToAllowlist(domain) {
  chrome.storage.sync.get(["blocklist", "allowlist"], (data) => {
    const blocklist = data.blocklist || [];
    const allowlist = data.allowlist || [];

    // Remove from blocklist
    const updatedBlocklist = blocklist.filter((item) => item !== domain);

    // Add to allowlist
    if (!allowlist.includes(domain)) {
      allowlist.push(domain);
    }

    // Save changes
    chrome.storage.sync.set({ blocklist: updatedBlocklist, allowlist }, loadLists);
  });
}

// Move a domain from allowlist to blocklist
function moveToBlocklist(domain) {
  chrome.storage.sync.get(["blocklist", "allowlist"], (data) => {
    const blocklist = data.blocklist || [];
    const allowlist = data.allowlist || [];

    // Remove from allowlist
    const updatedAllowlist = allowlist.filter((item) => item !== domain);

    // Add to blocklist
    if (!blocklist.includes(domain)) {
      blocklist.push(domain);
    }

    // Save changes
    chrome.storage.sync.set({ blocklist, allowlist: updatedAllowlist }, loadLists);
  });
}

// Add a domain to the blocklist
document.getElementById("addBlocklistButton").addEventListener("click", () => {
  const input = document.getElementById("blocklistInput");
  const domain = input.value.trim();

  if (domain) {
    chrome.storage.sync.get(["blocklist"], (data) => {
      const blocklist = data.blocklist || [];
      if (!blocklist.includes(domain)) {
        blocklist.push(domain);
        chrome.storage.sync.set({ blocklist }, loadLists);
        input.value = ""; // Clear input
      } else {
        alert("This domain is already in the blocklist.");
      }
    });
  }
});

// Initialize lists
document.addEventListener("DOMContentLoaded", loadLists);