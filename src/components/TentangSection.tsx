import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { BrainCircuit, Rocket, Users } from 'lucide-react';

// Define the content for the slides in an array for easy mapping
const slides = [
  {
    icon: <Users size={48} className="text-cyan-400 mb-6" />,
    title: "Misi Kami",
    description: "Menjembatani kesenjangan antara ide-ide cemerlang dari mahasiswa dan UMKM dengan teknologi canggih yang dapat mewujudkannya.",
  },
  {
    icon: <BrainCircuit size={48} className="text-cyan-400 mb-6" />,
    title: "Fokus Kami",
    description: "Memberikan solusi teknologi yang terjangkau dan berkualitas, mulai dari MVP untuk validasi ide hingga produk yang siap diluncurkan.",
  },
  {
    icon: <Rocket size={48} className="text-cyan-400 mb-6" />,
    title: "Target Kami",
    description: "Menjadi akselerator inovasi bagi talenta-talenta muda dan bisnis yang sedang berkembang pesat di seluruh penjuru Indonesia.",
  },
];

const TentangSection: React.FC = () => {
  const targetRef = useRef<HTMLDivElement>(null);
  
  // useScroll hook to track scroll progress within the targetRef
  const { scrollYProgress } = useScroll({
    target: targetRef,
    // Start animation when the top of the target hits the top of the viewport
    // End animation when the bottom of the target hits the bottom of the viewport
    offset: ["start start", "end end"]
  });

  // Tweak the input range of useTransform to adjust animation timing.
  // The animation will now happen between 10% and 90% of the scroll progress,
  // creating a smoother start and end.
  const x = useTransform(scrollYProgress, [0.1, 0.9], ["0%", "-66.66%"]);

  // Add an opacity transform for a fade-in/fade-out effect
  // const opacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    // The parent element with a defined height to create the scroll "runway"
    // The height is reduced to 250vh to make the scroll feel snappier.
    <div ref={targetRef} className="h-[250vh] relative">
      {/* The sticky container that holds the horizontal slides */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        
        {/* Gradient overlays for seamless blending with the page background */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-slate-900 to-transparent z-20 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-slate-900 to-transparent z-20 pointer-events-none" />
        
        {/* The moving element, animated with Framer Motion for horizontal scroll and opacity */}
        <motion.div style={{x}} className="flex h-full w-[300vw] items-center">
          {slides.map((slide, index) => (
            <div key={index} className="w-screen h-full flex flex-col items-center justify-center p-8 text-center">
              {slide.icon}
              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">{slide.title}</h2>
              <p className="text-lg text-gray-400 max-w-3xl mx-auto leading-relaxed">
                {slide.description}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default TentangSection;
