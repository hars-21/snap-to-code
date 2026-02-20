import { useMemo, useState } from "react";

const frameworks = ["React", "Vue", "Angular", "Svelte"] as const;
type Framework = (typeof frameworks)[number];

export default function App() {
    const [selectedFramework, setSelectedFramework] = useState<Framework>("React");
    const [file, setFile] = useState<File | null>(null);

    const fileLabel = useMemo(() => {
        if (!file) return "Upload Design Screenshot";
        return file.name.length > 30 ? `${file.name.slice(0, 27)}...` : file.name;
    }, [file]);

    return (
        <div className="popup">
            <header className="topbar">
                <div className="brand">
                    <span className="brandIcon">⚡</span>
                    <span>Snap2Code</span>
                </div>
                <nav className="links">
                    <button className="linkBtn">Features</button>
                    <button className="linkBtn">Docs</button>
                </nav>
            </header>

            <main className="hero">
                <div className="badge">● AI-Powered Code Generation</div>

                <h1>
                    Transform Designs into <span>Production Code</span>
                </h1>

                <p>
                    Upload any design screenshot and get pixel-perfect, clean code instantly.
                </p>

                <label className="uploadCard" htmlFor="design-upload">
                    <input
                        id="design-upload"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                    <div className="uploadInner">☁ {fileLabel}</div>
                </label>

                <div className="frameworks">
                    {frameworks.map((fw) => (
                        <button
                            key={fw}
                            className={`chip ${selectedFramework === fw ? "active" : ""}`}
                            onClick={() => setSelectedFramework(fw)}
                        >
                            {fw}
                        </button>
                    ))}
                </div>

                <button className="generateBtn" disabled={!file}>
                    Snap & Generate ({selectedFramework})
                </button>
            </main>
        </div>
    );
}