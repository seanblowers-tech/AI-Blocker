// Default blocklist
// Default blocklist for the personal version (with https:// included)
const DEFAULT_BLOCKLIST = [
  "https://openai.com",          // OpenAI services
  "https://chat.openai.com",     // ChatGPT
  "https://bard.google.com",     // Google Bard
  "https://gemini.google.com",   // Google's Gemini
  "https://chatgpt.com",         // ChatGPT alternative domain
  "https://anthropic.com",       // Anthropic Claude
  "https://midjourney.com",      // MidJourney
  "https://stability.ai",        // Stable Diffusion
  "https://huggingface.co",      // Hugging Face
  "https://runwayml.com",        // RunwayML
  "https://perplexity.ai",       // Perplexity AI
  "https://you.com",             // YouChat (AI-powered search)
  "https://writesonic.com",      // Writesonic
  "https://copy.ai",             // Copy AI
  "https://jasper.ai",           // Jasper AI
  "https://notion.so/ai",        // Notion AI
  "https://character.ai",        // Character AI
  "https://gptzero.me",          // GPTZero (AI detection tool)
  "https://scribehow.com",       // Scribe AI
  "https://play.ht",             // Play.ht (text-to-speech AI)
  "https://d-id.com",            // D-ID (AI avatars)
  "https://synthesia.io"         // Synthesia AI
];

// Fetch storage data
function fetchStorage(keys, callback) {
  chrome.storage.sync.get(keys, (data) => callback(data));
}

// Update storage
function updateStorage(data, callback) {
  chrome.storage.sync.set(data, () => {
    if (callback) callback();
  });
}

// Add domain to allowlist and remove it from blocklist
function addToAllowlist(domain) {
  fetchStorage(["allowlist", "blocklist", "removedDefaults"], (data) => {
    const allowlist = data.allowlist || [];
    const blocklist = data.blocklist || [];
    const removedDefaults = data.removedDefaults || [];

    // Add to allowlist
    if (!allowlist.includes(domain)) {
      allowlist.push(domain);
    }

    // Remove from blocklist
    const updatedBlocklist = blocklist.filter((item) => item !== domain);

    // Track removed defaults if applicable
    if (DEFAULT_BLOCKLIST.includes(domain) && !removedDefaults.includes(domain)) {
      removedDefaults.push(domain);
    }

    updateStorage({ allowlist, blocklist: updatedBlocklist, removedDefaults }, () => {
      console.log(`Added ${domain} to allowlist and removed from blocklist.`);
      window.location.reload();
    });
  });
}

// Render custom blocking page
function renderBlockingPage(currentDomain) {
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
    color: #fff;
    font-family: Arial, sans-serif;
    text-align: center;
  `;

  blockPage.innerHTML = `
    <h1 style="font-size: 3em; margin-bottom: 20px; color: #ff4d4d;">
      🚫 Blocked by AI Blocker
    </h1>
    <p style="font-size: 1.2em; margin-bottom: 30px;">
      Access to <strong>${currentDomain}</strong> has been restricted.
    </p>
    <button id="allowSiteButton" style="
      padding: 12px 20px; 
      background-color: #4CAF50; 
      color: white; 
      border: none; 
      border-radius: 8px;
      font-size: 1.1em;
      cursor: pointer;
      margin-bottom: 15px;
    ">
      Allow This Site
    </button>
    <button id="backButton" style="
      padding: 12px 20px; 
      background-color: #f44336; 
      color: white; 
      border: none; 
      border-radius: 8px;
      font-size: 1.1em;
      cursor: pointer;
    ">
      Go Back
    </button>
  `;

  document.body.appendChild(blockPage);

  // Allow button functionality
  document.getElementById("allowSiteButton").addEventListener("click", () => {
    console.log(`Allowing site: ${currentDomain}`);
    addToAllowlist(currentDomain);
  });

  // Back button functionality
  document.getElementById("backButton").addEventListener("click", () => {
    console.log("Going back to the previous page.");
    window.history.back();
  });
}

// Check if a site is in the blocklist
function isSiteBlocked(domain, blocklist) {
  return blocklist.some((blockedDomain) => domain.includes(blockedDomain));
}

// Initialize blocking logic
function initializeBlocking() {
  const currentDomain = window.location.hostname;
  console.log(`Checking blocklist for: ${currentDomain}`);

  fetchStorage(["blocklist", "allowlist", "removedDefaults"], (data) => {
    const userBlocklist = data.blocklist || [];
    const allowlist = data.allowlist || [];
    const removedDefaults = data.removedDefaults || [];

    // Combine default blocklist and user blocklist, excluding removed defaults
    const combinedBlocklist = [
      ...DEFAULT_BLOCKLIST.filter((domain) => !removedDefaults.includes(domain)),
      ...userBlocklist,
    ];

    // If site is in the allowlist, skip blocking
    if (isSiteBlocked(currentDomain, allowlist)) {
      console.log(`Site allowed: ${currentDomain}`);
      return;
    }

    // If site is in the combined blocklist, render block page
    if (isSiteBlocked(currentDomain, combinedBlocklist)) {
      console.log(`Site blocked: ${currentDomain}`);
      renderBlockingPage(currentDomain);
    } else {
      console.log(`Site not blocked: ${currentDomain}`);
    }
  });
}

// Run blocking logic on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeBlocking);
} else {
  initializeBlocking();
}

// Function to append "-ai" to Google searches
function modifyGoogleSearch() {
  // Check if the current URL is a Google search page
  if (window.location.hostname === "www.google.com" && window.location.pathname === "/search") {
    const urlParams = new URLSearchParams(window.location.search);
    let query = urlParams.get("q"); // Get the current search query

    // Append "-ai" if it's not already in the query
    if (query && !query.includes("-ai")) {
      query += " -ai";
      urlParams.set("q", query);

      // Update the URL without reloading the page
      window.history.replaceState({}, "", `${window.location.pathname}?${urlParams.toString()}`);

      // Trigger a search update
      document.dispatchEvent(new Event("input"));
    }
  }
}

// Initialize the search modification
function initializeGoogleSearchModifier() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", modifyGoogleSearch);
  } else {
    modifyGoogleSearch();
  }

  // Observe URL changes to handle dynamic navigation
  const observer = new MutationObserver(modifyGoogleSearch);
  observer.observe(document.body, { childList: true, subtree: true });
}

// Initialize the extension functionality
initializeGoogleSearchModifier();
