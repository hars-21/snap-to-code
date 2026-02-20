chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "takeScreenshot",
		title: "Snap to Code — Capture Screenshot",
		contexts: ["all"],
	});
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === "takeScreenshot" && tab?.id) {
		chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
			if (chrome.runtime.lastError) {
				console.error("Capture error:", chrome.runtime.lastError.message);
				return;
			}
			console.log("Screenshot captured via context menu:", dataUrl.slice(0, 80));
		});
	}
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "CAPTURE_SCREENSHOT") {
		chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
			if (chrome.runtime.lastError) {
				sendResponse({ error: chrome.runtime.lastError.message });
			} else {
				sendResponse({ image: dataUrl });
			}
		});
		return true;
	}
});
