document.getElementById('statusBtn').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    document.getElementById('status').textContent = tab ? `Active tab: ${tab.url}` : "No active tab";
});
