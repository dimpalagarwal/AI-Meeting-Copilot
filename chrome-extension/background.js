// background.js
const BACKEND_URL = "https://YOUR_BACKEND_DOMAIN/meet/transcript"; // replace

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type === "TRANSCRIPT") {
    // include metadata (tab URL, title)
    const payload = {
      transcript: msg.transcript,
      pageUrl: sender.tab ? sender.tab.url : null,
      timestamp: new Date().toISOString()
    };
    fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).catch(err => console.error("Failed to send transcript", err));
  }
});
