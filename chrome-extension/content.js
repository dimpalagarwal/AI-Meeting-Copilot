// content.js
const POLL_MS = 3000;

function findTranscriptText() {
  // Google Meet DOM changes frequently.
  // Try a few selectors — adapt if Meet UI changes.
  const selectors = [
    '[jsname="YSxPC"]',        // older
    '[data-self-name]',        // example alternative
    '.iW7aDf'                  // fallback, change as needed
  ];
  let text = "";
  for (const sel of selectors) {
    const nodes = document.querySelectorAll(sel);
    if (nodes && nodes.length) {
      nodes.forEach(n => text += (n.innerText || n.textContent) + "\n");
    }
  }
  // last fallback: capture transcript panel text if exists
  const cc = document.querySelector('[role="region"]');
  if (!text && cc) text = cc.innerText || cc.textContent || "";
  return text.trim();
}

let lastSent = "";
setInterval(() => {
  try {
    const transcript = findTranscriptText();
    if (!transcript) return;
    // reduce repeated sends
    if (transcript.length > 100 && transcript !== lastSent) {
      lastSent = transcript;
      chrome.runtime.sendMessage({ type: "TRANSCRIPT", transcript });
    }
  } catch (err) {
    // ignore DOM read errors
    console.warn("transcript capture error", err);
  }
}, POLL_MS);
