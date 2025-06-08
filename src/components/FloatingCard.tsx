import React, { useRef, useEffect } from 'react';

interface FloatingCardProps {
  text: string;
  style?: React.CSSProperties;
}

const FloatingCard: React.FC<FloatingCardProps> = ({ text, style }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 30;
      const y = (e.clientY / innerHeight - 0.5) * -30;
      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${y}deg) rotateY(${x}deg)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div
      ref={cardRef}
      style={{
        ...style,
        transformStyle: 'preserve-3d',
      }}
      className="absolute bg-slate-800/80 text-white px-6 py-4 rounded-xl shadow-xl border border-cyan-500/30 backdrop-blur-md transition-transform duration-300 ease-out"
    >
      {text}
    </div>
  );
};
export default FloatingCard;

