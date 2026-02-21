export function Navbar() {
  return (
    <nav
      className="sticky top-0 z-1000 h-15 flex items-center px-5 border-b border-purple-500/10 backdrop-blur-md"
      style={{
        background:
          "linear-gradient(135deg, rgba(15,15,30,0.95) 0%, rgba(26,15,46,0.95) 100%)",
      }}
    >
      <div className="max-w-350 mx-auto flex items-center justify-between w-full">
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
