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
	Hexagon,
	Repeat,
	Plug,
	Monitor,
	X,
	Check,
} from "lucide-react";

const Languages = [
	{ id: "react", label: "React", icon: Atom },
	{ id: "vue", label: "Vue", icon: Flame },
	{ id: "angular", label: "Angular", icon: Layers },
	{ id: "svelte", label: "Svelte", icon: Triangle },
	{ id: "swiftui", label: "Swift UI", icon: Feather },
	{ id: "next", label: "Next.js", icon: LayoutGrid },
	{ id: "react-native", label: "React Native", icon: Smartphone },
	{ id: "flutter", label: "Flutter", icon: Boxes },
	{ id: "kotlin", label: "Kotlin", icon: Cpu },
	{ id: "nuxt", label: "Nuxt.js", icon: Hexagon },
	{ id: "remix", label: "Remix", icon: Repeat },
	{ id: "ionic", label: "Ionic", icon: Plug },
	{ id: "electron", label: "Electron", icon: Monitor },
	{ id: "xamarin", label: "Xamarin", icon: X },
];

interface TechSelectionProps {
	selectedTech: string;
	onTechChange: (tech: string) => void;
}

const TechSelection = ({ selectedTech, onTechChange }: TechSelectionProps) => {
	return (
		<div className="p-8 flex items-center justify-center">
			<div className="grid grid-cols-4 gap-x-6 gap-y-5">
				{Languages.map((tech) => (
					<button
						key={tech.id}
						onClick={() => onTechChange(tech.id)}
						className={`flex items-center justify-between gap-6 px-4 py-3 rounded-xl transition-all bg-[#201E35] text-[#CDCCE2] hover:bg-[#26244A] hover:scale-[1.02] focus:outline-none cursor-pointer border ${selectedTech === tech.id ? "border-[#9A69EA]" : "border-transparent"}`}
					>
						<div className="flex items-center gap-2 text-[#9A69EA]">
							<tech.icon size={20} />
							<span>{tech.label}</span>
						</div>

						{selectedTech === tech.id && (
							<div className="w-5 h-5 rounded-full bg-[#9A69EA] flex items-center justify-center">
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
