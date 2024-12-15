// Expanded default blocklist with https:// included
const DEFAULT_BLOCKLIST = [
  "https://openai.com",
  "https://chat.openai.com",
  "https://bard.google.com",
  "https://gemini.google.com",
  "https://chatgpt.com",
  "https://anthropic.com",
  "https://midjourney.com",
  "https://stability.ai",
  "https://huggingface.co",
  "https://runwayml.com",
  "https://perplexity.ai",
  "https://you.com",
  "https://writesonic.com",
  "https://copy.ai",
  "https://jasper.ai",
  "https://notion.so/ai",
  "https://character.ai",
  "https://gptzero.me",
  "https://scribehow.com",
  "https://play.ht",
  "https://d-id.com",
  "https://synthesia.io"
];

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

// Check if a domain is blocked
function isSiteBlocked(domain, blocklist) {
  return blocklist.some((blockedDomain) => domain.includes(blockedDomain));
}

// Render block page
function renderBlockingPage(domain) {
  document.head.innerHTML = "";
  document.body.innerHTML = "";

  const blockPage = document.createElement("div");
  blockPage.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #1e1e1e;
    color: white;
    font-family: Arial, sans-serif;
    text-align: center;
  `;

  blockPage.innerHTML = `
    <h1 style="font-size: 3em; color: #ff4d4d;">🚫 Blocked by AI Blocker</h1>
    <p style="font-size: 1.2em; margin-bottom: 20px;">Access to <strong>${domain}</strong> is restricted.</p>
    <button id="allowSiteButton" style="
      padding: 10px 20px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1em;
      cursor: pointer;
      margin: 5px;
    ">Allow This Site</button>
    <button id="backButton" style="
      padding: 10px 20px;
      background-color: #f44336;
      color: white;
      border: none;
      border-radius: 5px;
      font-size: 1em;
      cursor: pointer;
      margin: 5px;
    ">Go Back</button>
  `;

  document.body.appendChild(blockPage);

  // Allow button functionality
  document.getElementById("allowSiteButton").addEventListener("click", () => {
    fetchStorage(["allowlist"], (data) => {
      const allowlist = data.allowlist || [];
      allowlist.push(domain);
      updateStorage({ allowlist }, () => window.location.reload());
    });
  });

  // Back button functionality
  document.getElementById("backButton").addEventListener("click", () => {
    window.history.back();
  });
}

// Modify Google search queries to append "-ai"
function modifyGoogleSearch() {
  if (window.location.hostname === "www.google.com" && window.location.pathname === "/search") {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get("q");

    if (query && !query.includes("-ai")) {
      urlParams.set("q", `${query} -ai`);
      window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`);
    }
  }
}

// Main blocking logic
function initializeBlocking() {
  const currentDomain = window.location.hostname;
  fetchStorage(["blocklist", "allowlist"], (data) => {
    const blocklist = [...DEFAULT_BLOCKLIST, ...(data.blocklist || [])];
    const allowlist = data.allowlist || [];

    if (allowlist.includes(currentDomain)) return;

    if (isSiteBlocked(currentDomain, blocklist)) {
      renderBlockingPage(currentDomain);
    }
  });
}

// Initialize content script
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initializeBlocking();
    modifyGoogleSearch();
  });
} else {
  initializeBlocking();
  modifyGoogleSearch();
}