chrome.runtime.onInstalled.addListener(() => {
    console.log("AI Blocker extension installed and active.");
  });
  
  // Listen for messages from the popup to toggle blocking
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "updateBlockingState") {
      chrome.storage.sync.set({ blockingEnabled: message.blockingEnabled }, () => {
        console.log("Blocking state updated:", message.blockingEnabled);
      });
    }
  });