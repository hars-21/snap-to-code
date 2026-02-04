chrome.runtime.onInstalled.addListener(() => {
	console.log("Extension installed");
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "PING") {
		sendResponse({ ok: true });
	}
	return true;
});

chrome.runtime.onInstalled.addListener(() => {
	chrome.contextMenus.create({
		id: "takeScreenshot",
		title: "Take Screenshot",
		contexts: ["all"],
	});
});

chrome.contextMenus.onClicked.addListener((info) => {
	if (info.menuItemId === "takeScreenshot") {
		chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
			console.log(dataUrl);
		});
	}
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.type === "CAPTURE_SCREENSHOT") {
		chrome.tabs.captureVisibleTab({ format: "png" }, (dataUrl) => {
			sendResponse({ image: dataUrl });
		});
		return true;
	}
});
