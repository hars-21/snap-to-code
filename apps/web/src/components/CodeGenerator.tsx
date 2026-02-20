import { useState, useRef } from "react";
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
			headers: { "Content-Type": "application/json" },
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
				copyRef.current.innerText = "Copied!";
				setTimeout(() => {
					if (copyRef.current) copyRef.current.innerHTML = originalText;
				}, 2500);
			}
		}
	};

	return (
		<div
			className="min-h-screen flex flex-col"
			style={{ background: "linear-gradient(135deg, #0f0f1e 0%, #1a0f2e 50%, #0f0f1e 100%)" }}
		>
			<Navbar />

			{/* Hero */}
			<div
				className="flex items-center justify-center px-5 py-[140px_20px_80px] min-h-[85vh]"
				style={{
					padding: "140px 20px 80px",
					background:
						"radial-gradient(circle at 50% 50%, rgba(168,85,247,0.15) 0%, transparent 60%)",
				}}
			>
				<div className="max-w-3xl text-center flex flex-col items-center">
					{/* Badge */}
					<div className="inline-flex items-center gap-2 px-5 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-sm text-[#a0a0b0] mb-8">
						<span className="badge-dot" />
						<span>AI-Powered Code Generation</span>
					</div>

					{/* Title */}
					<h1 className="title-gradient text-[3.5rem] max-md:text-[2.2rem] max-sm:text-[1.8rem] font-bold leading-tight mb-6">
						Transform Designs into <span className="gradient-text">Production Code</span>
					</h1>

					{/* Subtitle */}
					<p className="text-[1.15rem] text-[#a0a0b0] leading-relaxed mb-12 max-w-xl">
						Upload any design screenshot and get pixel-perfect, clean code instantly. Powered by
						advanced AI technology.
					</p>

					{/* Upload + Generate */}
					<div className="flex flex-wrap gap-4 items-center justify-center mb-20 w-full max-w-xl max-md:flex-col">
						<input
							ref={fileInputRef}
							type="file"
							accept="image/*"
							onChange={handleFileUpload}
							className="hidden"
							id="file-upload"
						/>
						<label
							htmlFor="file-upload"
							className="flex-1 min-w-64 max-md:min-w-full bg-purple-500/10 border-2 border-dashed border-purple-500/20 text-[#a0a0b0] px-8 py-4 rounded-xl cursor-pointer font-medium text-center flex items-center justify-center gap-2 transition-all duration-300 hover:border-purple-500/60 hover:text-purple-400 hover:bg-purple-500/15 hover:-translate-y-0.5"
						>
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
							<button
								className="flex items-center gap-2 px-10 py-4 rounded-xl text-base font-semibold text-white cursor-pointer transition-all duration-300 shadow-[0_8px_24px_rgba(168,85,247,0.3)] whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_12px_32px_rgba(168,85,247,0.4)]"
								style={{
									background: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
									border: "none",
								}}
								onClick={handleGenerate}
								disabled={isGenerating}
							>
								{isGenerating ? (
									<>
										<span className="spinner" />
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

					{/* Tech Selection */}
					<TechSelection selectedTech={selectedTech} onTechChange={setSelectedTech} />

					{/* Preview + Code panels */}
					{(uploadedImage || generatedCode) && (
						<div className="px-5 py-10 flex-1 w-full">
							<div className="max-w-5xl mx-auto grid grid-cols-2 gap-6 max-md:grid-cols-1">
								{/* Preview panel */}
								<div className="flex flex-col">
									<div className="flex justify-between items-center mb-4">
										<div className="text-base font-semibold text-white flex items-center gap-2">
											<Image />
											Preview
										</div>
									</div>
									<div className="bg-[rgba(20,20,40,0.8)] border border-purple-500/20 rounded-2xl p-5 h-112.5 max-md:min-h-75 flex items-center justify-center overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
										{uploadedImage ? (
											<img
												src={uploadedImage}
												alt="Uploaded design"
												className="max-w-full max-h-full rounded-xl object-contain shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
											/>
										) : (
											<div className="text-[#a0a0b0] text-center flex flex-col items-center gap-4">
												<Image />
												<p>Your design preview will appear here</p>
											</div>
										)}
									</div>
								</div>

								{/* Code panel */}
								<div className="flex flex-col">
									<div className="flex justify-between items-center mb-4">
										<div className="text-base font-semibold text-white flex items-center gap-2">
											<CodeXml />
											Generated Code
										</div>
										{generatedCode && (
											<button
												ref={copyRef}
												className="bg-purple-500/10 text-purple-400 border border-purple-500/20 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer flex items-center gap-1.5 transition-all duration-300 hover:bg-purple-500/20 hover:border-purple-500/50 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(168,85,247,0.2)] active:translate-y-0"
												onClick={handleCopy}
											>
												<Copy size={14} />
												Copy
											</button>
										)}
									</div>
									<div className="code-scrollbar bg-[rgba(20,20,40,0.8)] border border-purple-500/20 rounded-2xl p-5 h-112.5 max-md:min-h-75 overflow-auto backdrop-blur-sm transition-all duration-300 hover:border-purple-500/40 hover:shadow-[0_8px_32px_rgba(168,85,247,0.15)]">
										{generatedCode ? (
											<pre className="text-green-400 font-mono text-[0.9rem] leading-relaxed m-0 whitespace-pre-wrap wrap-break-word">
												<code>{generatedCode}</code>
											</pre>
										) : (
											<div className="text-[#a0a0b0] text-center flex flex-col items-center justify-center gap-4 h-full">
												<CodeXml />
												<p>Your generated code will appear here</p>
											</div>
										)}
									</div>
								</div>
							</div>
						</div>
					)}

					{/* Trusted section */}
					<div className="mt-16">
						<p className="text-[#a0a0b0] text-xs mb-5 uppercase tracking-widest">
							Trusted by developers at
						</p>
						<div className="flex flex-wrap justify-center gap-8 opacity-60 max-md:gap-4">
							{["Google", "Meta", "Amazon", "Microsoft", "Apple"].map((brand) => (
								<span
									key={brand}
									className="text-[#a0a0b0] text-[0.95rem] font-medium tracking-wide transition-all duration-300 hover:text-purple-400 hover:-translate-y-0.5"
								>
									{brand}
								</span>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
