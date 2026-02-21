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
    const techLabel =
      TECH_STACKS.find((t) => t.id === selectedTech)?.label ??
      "React + Tailwind";
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
      if (!res.ok || !data.success)
        throw new Error(data.message ?? "Generation failed");
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
    <div className="flex flex-col min-h-131">
      <header className="flex items-center justify-between px-4 py-3.5 border-b border-[rgba(154,124,255,0.2)] shrink-0">
        <div className="flex items-center gap-2 cursor-pointer mr-auto transition-transform duration-300 hover:scale-[1.02] group">
          <img
            src="/logo.svg"
            alt="Snap2Code Logo"
            className="h-7 w-7 rounded-lg"
          />
          <span
            className="font-bold text-[1.1rem] tracking-tight"
            style={{
              background:
                "linear-gradient(135deg, #ffffff 0%, #d4b8ff 50%, #ec4899 100%)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "-0.02em",
            }}
          >
            Snap<span style={{ opacity: 1 }}>2</span>Code
          </span>
        </div>
        {screen === "output" && (
          <button
            className="bg-transparent border border-[rgba(154,124,255,0.3)] text-[#bfa9ff] text-xs font-semibold px-2.75 py-1.25 rounded-lg cursor-pointer transition-[background,color] duration-180 hover:bg-[rgba(126,76,255,0.15)] hover:text-white"
            onClick={handleBack}
          >
            ← Back
          </button>
        )}
      </header>

      {screen === "input" && (
        <main className="px-4.5 pt-5 pb-5.5 flex flex-col gap-0 flex-1">
          <h1 className="text-2xl font-extrabold leading-[1.15] tracking-[-0.02em] text-[#f3efff] mb-2">
            Transform Designs into{" "}
            <span className="bg-linear-to-r from-[#a86bff] to-[#f05dc6] bg-clip-text text-transparent">
              Production Code
            </span>
          </h1>
          <p className="text-[13px] leading-normal text-[#a99dc8] mb-4.5">
            Capture any tab or upload a design screenshot to generate
            pixel-perfect code.
          </p>

          <div className="grid grid-cols-2 gap-2 mb-3.5">
            <button
              className="flex items-center justify-center gap-1.75 px-2.5 py-2.75 rounded-xl border border-dashed border-[rgba(180,139,255,0.45)] bg-[rgba(99,57,171,0.18)] text-[#c3b6e8] text-[13px] font-semibold cursor-pointer transition-[background,border-color,color] duration-180 hover:bg-[rgba(99,57,171,0.3)] hover:border-[rgba(198,132,255,0.65)] hover:text-[#e8deff]"
              onClick={handleCapture}
            >
              <Camera /> Capture Tab
            </button>
            <button
              className="flex items-center justify-center gap-1.75 px-2.5 py-2.75 rounded-xl border border-dashed border-[rgba(180,139,255,0.45)] bg-[rgba(99,57,171,0.18)] text-[#c3b6e8] text-[13px] font-semibold cursor-pointer transition-[background,border-color,color] duration-180 hover:bg-[rgba(99,57,171,0.3)] hover:border-[rgba(198,132,255,0.65)] hover:text-[#e8deff]"
              onClick={() => fileInputRef.current?.click()}
            >
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
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-2.5 bg-[rgba(99,57,171,0.2)] border border-[rgba(180,139,255,0.3)] mb-3.5">
              <img
                src={imageDataUrl}
                alt="Selected screenshot"
                className="w-11 h-8.5 object-cover rounded-md border border-[rgba(154,124,255,0.3)]"
              />
              <span className="text-xs text-[#c3b6e8] font-medium flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                ✓ {imageName}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-[rgba(255,80,80,0.12)] border border-[rgba(255,80,80,0.35)] rounded-lg text-[#ff9a9a] text-xs px-3 py-2 mb-3.5">
              {error}
            </div>
          )}

          <div className="text-2.75 font-semibold tracking-[0.08em] uppercase text-[#7e72a8] mb-2">
            Choose tech stack
          </div>
          <div className="grid grid-cols-2 gap-1.75 mb-4">
            {TECH_STACKS.map((tech) => (
              <button
                key={tech.id}
                className={
                  selectedTech === tech.id
                    ? "border border-[rgba(193,132,255,0.9)] bg-linear-to-r from-[rgba(112,67,219,0.45)] to-[rgba(219,84,202,0.3)] text-white shadow-[inset_0_0_0_1px_rgba(198,132,255,0.2)] px-2.5 py-2.25 rounded-2.5 text-xs font-semibold cursor-pointer text-left transition-[background,border-color,color] duration-150"
                    : "border border-[rgba(140,106,235,0.3)] bg-[rgba(39,30,77,0.65)] text-[#bca8f7] px-2.5 py-2.25 rounded-2.5 text-xs font-semibold cursor-pointer text-left transition-[background,border-color,color] duration-150 hover:bg-[rgba(39,30,77,0.9)] hover:border-[rgba(193,132,255,0.5)] hover:text-[#ddd0ff]"
                }
                onClick={() => setSelectedTech(tech.id)}
              >
                {tech.label}
              </button>
            ))}
          </div>

          <button
            className="w-full px-3.5 py-3 border-none rounded-xl bg-linear-to-r from-[#7f4dff] to-[#e051c1] text-white text-sm font-bold cursor-pointer transition-[opacity,transform,box-shadow] duration-200 shadow-[0_6px_20px_rgba(127,77,255,0.35)] not-disabled:hover:-translate-y-px not-disabled:hover:shadow-[0_10px_28px_rgba(127,77,255,0.45)] disabled:opacity-45 disabled:cursor-not-allowed"
            disabled={!imageDataUrl}
            onClick={handleGenerate}
          >
            ⚡ Generate ({TECH_STACKS.find((t) => t.id === selectedTech)?.label}
            )
          </button>
        </main>
      )}

      {screen === "loading" && (
        <main className="px-4.5 pt-5 pb-5.5 flex flex-col flex-1 items-center justify-center text-center">
          <div className="mb-4">
            <div className="w-9 h-9 border-[3px] border-[rgba(154,124,255,0.25)] border-t-[#a86bff] rounded-full animate-spin" />
          </div>
          <p className="text-[15px] font-semibold text-[#e8e2ff] mb-1">
            Generating code...
          </p>
          <p className="text-xs text-[#7e72a8]">Powered by Gemini AI</p>
        </main>
      )}

      {screen === "output" && (
        <main className="flex flex-col flex-1 px-4 pt-3.5 pb-4 gap-2.5 min-h-0">
          <div className="flex items-center justify-between shrink-0">
            <span className="text-[13px] font-bold text-[#e8e2ff]">
              &#60;/&#62; Generated Code
            </span>
            <button
              className="px-3.5 py-md rounded-lg border border-[rgba(154,124,255,0.4)] bg-[rgba(126,76,255,0.15)] text-[#bfa9ff] text-xs font-semibold cursor-pointer transition-[background,color,border-color] duration-180 hover:bg-[rgba(126,76,255,0.28)] hover:text-white hover:border-[rgba(198,132,255,0.7)]"
              onClick={handleCopy}
            >
              {copied ? "✓ Copied!" : "Copy"}
            </button>
          </div>
          <div className="flex-1 overflow-y-auto rounded-xl border border-[rgba(154,124,255,0.2)] bg-[rgba(14,10,30,0.85)] p-3.5 [&::-webkit-scrollbar]:w-md [&::-webkit-scrollbar-track]:bg-[rgba(154,124,255,0.05)] [&::-webkit-scrollbar-track]:rounded-[3px] [&::-webkit-scrollbar-thumb]:bg-[rgba(154,124,255,0.3)] [&::-webkit-scrollbar-thumb]:rounded-[3px] [&::-webkit-scrollbar-thumb:hover]:bg-[rgba(154,124,255,0.55)]">
            <pre className="font-['Fira_Code','Cascadia_Code',Consolas,monospace] text-[11.5px] leading-[1.6] text-[#a3e635] whitespace-pre-wrap wrap-break-words m-0">
              <code>{generatedCode}</code>
            </pre>
          </div>
        </main>
      )}
    </div>
  );
}
