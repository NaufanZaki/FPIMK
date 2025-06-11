import { BrainCircuit, Rocket, Users } from "lucide-react";

// Define the content for the cards
const cards = [
	{
		icon: <Users size={48} className="text-cyan-400 mb-6" />,
		title: "Misi Kami",
		description:
			"Menjembatani kesenjangan antara ide-ide cemerlang dari mahasiswa dan UMKM dengan teknologi canggih yang dapat mewujudkannya.",
	},
	{
		icon: <BrainCircuit size={48} className="text-cyan-400 mb-6" />,
		title: "Fokus Kami",
		description:
			"Memberikan solusi teknologi yang terjangkau dan berkualitas, mulai dari MVP untuk validasi ide hingga produk yang siap diluncurkan.",
	},
	{
		icon: <Rocket size={48} className="text-cyan-400 mb-6" />,
		title: "Target Kami",
		description:
			"Menjadi akselerator inovasi bagi talenta-talenta muda dan bisnis yang sedang berkembang pesat di seluruh penjuru Indonesia.",
	},
];

const TentangSection: React.FC = () => {
	return (
		<div className="py-16 px-8">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
					{cards.map((card, index) => (
						<div
							key={index}
							className="bg-slate-800 rounded-lg p-8 flex flex-col text-center items-center hover:bg-slate-700 transition-colors duration-300"
						>
							{card.icon}
							<h2 className="text-2xl font-bold text-white mb-4 tracking-tight">
								{card.title}
							</h2>
							<p className="text-gray-400 leading-relaxed">
								{card.description}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default TentangSection;
