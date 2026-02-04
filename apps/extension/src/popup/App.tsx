export default function App() {
	const captureScreenshot = () => {
		chrome.runtime.sendMessage(
			{
				type: "CAPTURE_SCREENSHOT",
			},
			(response) => {
				console.log(response);
			},
		);
	};

	return (
		<div className="w-sm p-4">
			<h1 className="text-xl font-bold mb-4">Snap To Code</h1>
			<button className="border cursor-pointer p-2" onClick={() => captureScreenshot}>
				Capture Screenshot
			</button>
		</div>
	);
}
