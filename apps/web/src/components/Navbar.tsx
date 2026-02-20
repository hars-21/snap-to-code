import { Snap2CodeLogo } from "./Snap2CodeLogo";

export function Navbar() {
	return (
		<nav
			className="sticky top-0 z-1000 h-15 flex items-center px-5 border-b border-purple-500/10 backdrop-blur-md"
			style={{
				background: "linear-gradient(135deg, rgba(15,15,30,0.95) 0%, rgba(26,15,46,0.95) 100%)",
			}}
		>
			<div className="max-w-350 mx-auto flex items-center justify-between w-full">
				<div className="flex items-center gap-3 cursor-pointer mr-auto transition-transform duration-300 hover:scale-[1.02]">
					<Snap2CodeLogo />
				</div>
				<div className="flex gap-10 items-center max-md:gap-5">
					<a
						href="#features"
						className="text-[#a0a0b0] no-underline font-medium text-[0.95rem] transition-colors duration-300 hover:text-purple-400 max-md:text-[0.85rem]"
					>
						Features
					</a>
					<a
						href="#docs"
						className="text-[#a0a0b0] no-underline font-medium text-[0.95rem] transition-colors duration-300 hover:text-purple-400 max-md:text-[0.85rem]"
					>
						Docs
					</a>
				</div>
			</div>
		</nav>
	);
}
