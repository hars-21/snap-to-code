import { useState, useRef } from "react";
import "./main.css";
import { Camera, Cloud } from "lucide-react";

const TECH_STACKS = [
	{ id: "html", label: "HTML" },
	{ id: "react-css", label: "React + CSS" },
	{ id: "react-tailwind", label: "React + Tailwind" },
	{ id: "vue", label: "Vue" },
	{ id: "angular", label: "Angular" },
	{ id: "svelte", label: "Svelte" },
	{ id: "next", label: "Next.js" },
	{ id: "react-native", label: "React Native" },
];

type Screen = "input" | "loading" | "output";

function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (err) => reject(err);
	});
}

export default function App() {
	const [screen, setScreen] = useState<Screen>("input");
	const [imageDataUrl, setImageDataUrl] = useState<string | null>(null);
	const [selectedTech, setSelectedTech] = useState("react-tailwind");
	const [generatedCode, setGeneratedCode] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [copied, setCopied] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleCapture = () => {
		setError(null);
		chrome.runtime.sendMessage({ type: "CAPTURE_SCREENSHOT" }, (response) => {
			if (chrome.runtime.lastError) {
				setError("Screenshot failed. Try again.");
				return;
			}
			if (response?.image) {
				setImageDataUrl(response.image);
			}
		});
	};

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setError(null);
		try {
			const base64 = await fileToBase64(file);
			setImageDataUrl(base64);
		} catch {
			setError("Failed to read file.");
		}
	};

	const handleGenerate = async () => {
		if (!imageDataUrl) return;
		setScreen("loading");
		setError(null);
		const techLabel = TECH_STACKS.find((t) => t.id === selectedTech)?.label ?? "React + Tailwind";
		try {
			const res = await fetch("http://localhost:3000/api/v1/generate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					base64Buffer: imageDataUrl,
					language: techLabel,
				}),
			});
			const data = await res.json();
			if (!res.ok || !data.success) throw new Error(data.message ?? "Generation failed");
			setGeneratedCode(data.code);
			setScreen("output");
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : "Something went wrong.");
			setScreen("input");
		}
	};

	const handleCopy = () => {
		if (!generatedCode) return;
		navigator.clipboard.writeText(generatedCode).then(() => {
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		});
	};

	const handleBack = () => {
		setScreen("input");
		setGeneratedCode(null);
		setError(null);
	};

	const imageName = imageDataUrl
		? imageDataUrl.startsWith("data:image/png")
			? "screenshot.png"
			: "uploaded-image"
		: null;

	return (
		<div className="popup">
			<header className="topbar">
				<div className="brand">
					<span className="brandIcon">⚡</span>
					<span>Snap2Code</span>
				</div>
				{screen === "output" && (
					<button className="backBtn" onClick={handleBack}>
						← Back
					</button>
				)}
			</header>

			{screen === "input" && (
				<main className="mainContent">
					<h1>
						Transform Designs into <span>Production Code</span>
					</h1>
					<p>Capture any tab or upload a design screenshot to generate pixel-perfect code.</p>

					<div className="actionRow">
						<button className="actionBtn" onClick={handleCapture}>
							<Camera /> Capture Tab
						</button>
						<button className="actionBtn" onClick={() => fileInputRef.current?.click()}>
							<Cloud /> Upload Image
						</button>
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							style={{ display: "none" }}
						/>
					</div>

					{imageDataUrl && (
						<div className="thumbnailWrap">
							<img src={imageDataUrl} alt="Selected screenshot" className="thumbnail" />
							<span className="thumbnailLabel">✓ {imageName}</span>
						</div>
					)}

					{error && <div className="errorBanner">{error}</div>}

					<div className="sectionLabel">Choose tech stack</div>
					<div className="techGrid">
						{TECH_STACKS.map((tech) => (
							<button
								key={tech.id}
								className={`chip${selectedTech === tech.id ? " active" : ""}`}
								onClick={() => setSelectedTech(tech.id)}
							>
								{tech.label}
							</button>
						))}
					</div>

					<button className="generateBtn" disabled={!imageDataUrl} onClick={handleGenerate}>
						⚡ Generate ({TECH_STACKS.find((t) => t.id === selectedTech)?.label})
					</button>
				</main>
			)}

			{screen === "loading" && (
				<main className="mainContent centerFlex">
					<div className="spinnerWrap">
						<div className="spinner" />
					</div>
					<p className="loadingText">Generating code...</p>
					<p className="loadingSubtext">Powered by Gemini AI</p>
				</main>
			)}

			{screen === "output" && (
				<main className="outputContent">
					<div className="outputHeader">
						<span className="outputTitle">&#60;/&#62; Generated Code</span>
						<button className="copyBtn" onClick={handleCopy}>
							{copied ? "✓ Copied!" : "Copy"}
						</button>
					</div>
					<div className="codeScrollArea">
						<pre className="codeBlock">
							<code>{generatedCode}</code>
						</pre>
					</div>
				</main>
			)}
		</div>
	);
}
