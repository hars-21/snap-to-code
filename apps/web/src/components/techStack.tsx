import {
	Atom,
	Flame,
	Layers,
	Triangle,
	Smartphone,
	Boxes,
	LayoutGrid,
	Feather,
	Cpu,
	Check,
} from "lucide-react";

const Languages = [
	{ id: "html", label: "HTML", icon: Layers },
	{ id: "react-css", label: "React + CSS", icon: Atom },
	{ id: "react-tailwind", label: "React + Tailwind", icon: Atom },
	{ id: "vue", label: "Vue", icon: Flame },
	{ id: "angular", label: "Angular", icon: Layers },
	{ id: "svelte", label: "Svelte", icon: Triangle },
	{ id: "swiftui", label: "Swift UI", icon: Feather },
	{ id: "next", label: "Next.js", icon: LayoutGrid },
	{ id: "react-native", label: "React Native", icon: Smartphone },
	{ id: "flutter", label: "Flutter", icon: Boxes },
	{ id: "kotlin", label: "Kotlin", icon: Cpu },
];

interface TechSelectionProps {
	selectedTech: string;
	onTechChange: (tech: string) => void;
}

const TechSelection = ({ selectedTech, onTechChange }: TechSelectionProps) => {
	return (
		<div className="w-full px-5 py-6 flex items-center justify-center">
			<div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
				{Languages.map((tech) => (
					<button
						key={tech.id}
						onClick={() => onTechChange(tech.id)}
						className={`min-h-24 w-full flex items-center justify-between gap-4 px-6 py-4 rounded-2xl border transition-all duration-300 cursor-pointer focus:outline-none ${
							selectedTech === tech.id
								? "border-[#9A69EA] bg-[rgba(35,31,62,0.9)] shadow-[0_0_0_1px_rgba(154,105,234,0.18)]"
								: "border-transparent bg-[rgba(30,27,53,0.72)] hover:border-[#9A69EA]/45 hover:bg-[rgba(35,31,62,0.8)]"
						}`}
					>
						<div className="flex items-center gap-3 text-[#9A69EA] text-[1.15rem] font-medium tracking-[0.01em]">
							<tech.icon size={19} strokeWidth={2} />
							<span className="text-left">{tech.label}</span>
						</div>

						{selectedTech === tech.id && (
							<div className="w-6 h-6 rounded-full bg-[#9A69EA] flex items-center justify-center shrink-0">
								<Check size={12} className="text-white" />
							</div>
						)}
					</button>
				))}
			</div>
		</div>
	);
};

export { Languages };
export default TechSelection;
