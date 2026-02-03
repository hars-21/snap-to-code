import { useState, useRef } from "react";
import "./CodeGenerator.css";
import { Navbar } from "./Navbar";
import TechSelection, { Languages } from "./techStack";
import { processImageFile } from "../utils/imageConverter";
import { CloudUpload, CloudCheck, CodeXml, Image, Copy } from "lucide-react";

export function CodeGenerator() {
	const [uploadedImage, setUploadedImage] = useState<string | null>(null);
	const [generatedCode, setGeneratedCode] = useState<string | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [selectedTech, setSelectedTech] = useState("react");

	const fileInputRef = useRef<HTMLInputElement>(null);
	const copyRef = useRef<HTMLButtonElement>(null);

	const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const imageData = await processImageFile(file);
				setUploadedImage(imageData.base64);
			} catch (error) {
				console.error("Error processing image:", error);
			}
		}
	};

	const handleGenerate = async () => {
		if (!uploadedImage) {
			alert("Please upload an image first");
			return;
		}

		setIsGenerating(true);
		const techLabel = Languages.find((t) => t.id === selectedTech)?.label || "React";
		const res = await fetch(`/api/v1/generate`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				base64Buffer: uploadedImage,
				language: `${techLabel} + Tailwind CSS`,
			}),
		});

		const data = await res.json();
		setGeneratedCode(data.code);
		setIsGenerating(false);
	};

	const handleCopy = () => {
		if (generatedCode) {
			navigator.clipboard.writeText(generatedCode);
			if (copyRef.current) {
				const originalText = copyRef.current.innerHTML;
				copyRef.current.innerText = "Copied !";
				setTimeout(() => {
					if (copyRef.current) {
						copyRef.current.innerHTML = originalText;
					}
				}, 2500);
			}
		}
	};

	return (
		<div className="app-container">
			<Navbar />

			<div className="hero-section">
				<div className="hero-content">
					<div className="hero-badge">
						<span className="badge-dot"></span>
						<span>AI-Powered Code Generation</span>
					</div>

					<h1 className="hero-title">
						Transform Designs into <span className="gradient-text">Production Code</span>
					</h1>

					<p className="hero-subtitle">
						Upload any design screenshot and get pixel-perfect, clean code instantly. Powered by
						advanced AI technology.
					</p>

					<div className="upload-section">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							className="file-input"
							id="file-upload"
						/>
						<label htmlFor="file-upload" className="upload-label">
							{uploadedImage ? (
								<>
									<CloudCheck />
									<span>Image Uploaded</span>
								</>
							) : (
								<>
									<CloudUpload />
									<span>Upload Design Screenshot</span>
								</>
							)}
						</label>
						{uploadedImage && (
							<button className="generate-btn" onClick={handleGenerate} disabled={isGenerating}>
								{isGenerating ? (
									<>
										<span className="spinner"></span>
										<span>Generating...</span>
									</>
								) : (
									<>
										<CodeXml />
										<span>Generate Code</span>
									</>
								)}
							</button>
						)}
					</div>

					<TechSelection selectedTech={selectedTech} onTechChange={setSelectedTech} />

					{(uploadedImage || generatedCode) && (
						<div className="main-content">
							<div className="content-grid">
								<div className="preview-section">
									<div className="section-header">
										<div className="section-title">
											<Image />
											Preview
										</div>
									</div>
									<div className="preview-container">
										{uploadedImage ? (
											<img src={uploadedImage} alt="Uploaded design" className="preview-image" />
										) : (
											<div className="preview-placeholder">
												<Image />
												<p>Your design preview will appear here</p>
											</div>
										)}
									</div>
								</div>

								<div className="code-section">
									<div className="section-header">
										<div className="section-title">
											<CodeXml />
											Generated Code
										</div>
										{generatedCode && (
											<button ref={copyRef} className="copy-btn-small" onClick={handleCopy}>
												<Copy />
												Copy
											</button>
										)}
									</div>
									<div className="code-container">
										{generatedCode ? (
											<pre className="code-output">
												<code>{generatedCode}</code>
											</pre>
										) : (
											<div className="code-placeholder">
												<CodeXml />
												<p>Your generated code will appear here</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					<div className="trusted-section">
						<p className="trusted-text">Trusted by developers at</p>
						<div className="brand-logos">
							<span className="brand">Google</span>
							<span className="brand">Meta</span>
							<span className="brand">Amazon</span>
							<span className="brand">Microsoft</span>
							<span className="brand">Apple</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
