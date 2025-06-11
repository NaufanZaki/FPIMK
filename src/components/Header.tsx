import { useState, useEffect } from "react";
import type { FC } from "react";
import { Menu, X } from "lucide-react";

const Header: FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const navLinks = [
		"Tentang",
		"Layanan",
		"Proses",
		"Testimoni",
		"Portofolio",
		"Kontak",
	];

	return (
		<>
			<header
				className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
					isScrolled
						? "bg-slate-900/50 backdrop-blur-xl shadow-2xl"
						: "bg-transparent"
				}`}
			>
				<div className="container mx-auto px-6 py-4">
					<div className="flex justify-between items-center">
						<a
							href="#hero"
							className="text-3xl font-bold text-white tracking-wider"
						>
							<img
								src="/public/images/wordmark-logo-white.png"
								alt="Logo"
								className="h-10 inline-block"
							/>
						</a>

						<nav className="hidden md:flex space-x-8">
							{navLinks.map((name) => (
								<a
									key={name}
									href={`#${name.toLowerCase()}`}
									className="text-gray-300 hover:text-cyan-400 transition-colors duration-300 font-medium"
								>
									{name}
								</a>
							))}
						</nav>

						<button
							onClick={() => setIsOpen(!isOpen)}
							className="block md:hidden text-white focus:outline-none"
							aria-label="Toggle menu"
						>
							{isOpen ? <X size={28} /> : <Menu size={28} />}
						</button>
					</div>
				</div>
			</header>

			{/* Mobile Menu Overlay */}
			<div
				className={`fixed inset-0 z-[90] bg-slate-900/98 backdrop-blur-lg transition-transform duration-300 ease-in-out ${
					isOpen ? "translate-x-0" : "translate-x-full"
				} md:hidden`}
			>
				<div className="flex flex-col items-center justify-center min-h-screen">
					{navLinks.map((name) => (
						<a
							key={name}
							href={`#${name.toLowerCase()}`}
							onClick={() => setIsOpen(false)}
							className="block w-full py-4 text-center text-xl text-gray-300 hover:text-cyan-400 transition-colors"
						>
							{name}
						</a>
					))}
				</div>
			</div>
		</>
	);
};

export default Header;
